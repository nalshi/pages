/**
 * core.js — النواة الأساسية للوحة التحكم (Critical Path)
 * يُحمَّل فوراً مع الصفحة
 * يحتوي على: API، Auth، AppStore، ModuleLoader، والمتغيرات العامة
 */
(function () {
    'use strict';

    // ===== الثوابت العامة =====
    window.API_URL = 'https://api.nalsh.dpdns.org/api.php';

    window.WORKER_API_URL = (() => {
        const configured = window.WORKER_API_URL || window.CF_WORKER_URL || window.CLOUDFLARE_WORKER_URL;
        if (typeof configured === 'string' && configured.trim()) {
            const value = configured.trim();
            if (value === '/api/worker' || value === '/api/worker/') return '/api/worker/';
            if (value.includes('://')) {
                const normalized = value.replace(/\/$/, '');
                return normalized.endsWith('/api/worker') ? `${normalized}/` : `${normalized}/api/worker/`;
            }
            return value.endsWith('/') ? value : `${value}/`;
        }
        return '/api/worker/';
    })();

    window.WORKER_ACTIONS = [
        'save_product', 'list_products', 'get_public_products',
        'delete_product', 'toggle_availability', 'get_categories_tree',
        'get_merchant_settings', 'save_merchant_settings',
        'get_merchant_orders', 'get_orders', 'update_order_status',
        'cancel_order', 'confirm_delivery_code',
        'add_to_cart', 'get_cart', 'create_order',
        'save_fcm_token', 'get_firebase_config',
        'get_ai_assistant_config', 'save_ai_assistant_config',
        'get_whatsapp_config', 'save_whatsapp_config',
        'get_storefront_config', 'save_storefront_config', 'get_storefront_themes', 'save_storefront_selection'
    ];
    window.WORKER_NO_FALLBACK_ACTIONS = new Set(['save_storefront_selection']);

    window.PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="%2394a3b8">لا توجد صورة</text></svg>';

    // ===== المتغيرات العامة والحالة =====
    window.CSRF_TOKEN = '';
    window.originalProductData = null;
    window.isSavingSettingLock = false;
    window.isSavingProductLock = false;
    window.currentMerchantData = {};
    // Localhost is still a normal authenticated dashboard environment.
    // Do not silently replace the merchant with a demo account.
    window.isLocalTemplateMode = false;
    window.appDataReady = false;
    window.introAnimDone = false;
    window.initialOrdersLoaded = false;
    window.dashboardSocket = null;
    window.dashboardSocketReady = false;
    window.dashboardDataReady = Promise.resolve();
    window.dashboardSnapshotLoaded = false;
    window.dashboardReadState = { products: false, activeOrders: false, archivedOrders: false, settings: false, stats: false };
    window.dashboardSocketStop = false;
    window.dashboardSocketPingTimer = null;
    window.dashboardSocketReconnectTimer = null;
    window.dashboardSocketReconnectAttempt = 0;
    window.dashboardSocketStatus = 'idle';
    window.dashboardSocketLastError = '';
    window.dashboardSocketPaused = false;
    window.dashboardConnectionChecked = false;
    window.dashboardSectionsInitialized = {};
    window.dashboardReadPromises = {};

    // اختيار مسار عرض أخف قبل بدء تحميل الوحدات الثانوية.
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    window.dashboardPerformanceMode = (
        (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        || Boolean(connection && connection.saveData)
        || (navigator.deviceMemory && navigator.deviceMemory <= 2)
        || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    ) ? 'light' : 'full';
    if (window.dashboardPerformanceMode === 'light') {
        document.documentElement.classList.add('low-performance');
    }

    // ===== التحقق من صلاحية الجلسة والتوكن =====
    window.checkTokenValidity = function () {
        const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if ((payload.exp * 1000) - 60000 < Date.now()) return false;
            return payload;
        } catch (e) {
            return false;
        }
    };

    const jwtPayload = window.checkTokenValidity();
    if (!jwtPayload) {
        localStorage.removeItem('merchant_token');
        sessionStorage.removeItem('merchant_token');
        window.location.replace('login.html');
        throw new Error("جاري التحويل لصفحة تسجيل الدخول...");
    } else {
        window.jwtPayload = jwtPayload;
        window.merchantToken = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
        window.merchantUsername = jwtPayload.username;
        window.merchantUserId = jwtPayload.user_id;
    }

    window.addEventListener('storage', function (event) {
        if (event.key === 'merchant_token' && !event.newValue) {
            window.location.replace('login.html');
        }
    });

    // ===== دوال مساعدة عامة =====
    window.getValidImageUrl = function (url) {
        if (!url) return window.PLACEHOLDER_IMG;
        let cleanUrl = String(url).trim().replace(/^["']|["']$/g, '');
        if (cleanUrl === '' || cleanUrl === 'null' || cleanUrl === '#') return window.PLACEHOLDER_IMG;
        if (cleanUrl.startsWith('data:')) return cleanUrl;
        if (cleanUrl.includes('.') && !cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        return 'https://images.weserv.nl/?url=' + encodeURIComponent(cleanUrl) + '&w=400&q=70';
    };

    window.escapeHTML = function (str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    // ===== محرك تحميل الموديولات عند الطلب (ModuleLoader) =====
    window.ModuleLoader = {
        loaded: new Set(),
        loading: new Map(),

        async load(moduleName) {
            if (this.loaded.has(moduleName)) return Promise.resolve();
            if (this.loading.has(moduleName)) return this.loading.get(moduleName);

            const promise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `/js/dashboard/${moduleName}.js`;
                script.async = true;
                script.onload = () => {
                    this.loaded.add(moduleName);
                    this.loading.delete(moduleName);
                    resolve();
                };
                script.onerror = (err) => {
                    this.loading.delete(moduleName);
                    console.error(`Error loading module: js/dashboard/${moduleName}.js`, err);
                    reject(err);
                };
                document.head.appendChild(script);
            });

            this.loading.set(moduleName, promise);
            return promise;
        }
    };

    window.ModuleLoader.loaded.add('core');

    // ===== Stubs للتحميل التلقائي عند استدعاء أي دالة قبل اكتمال تحميل موديولها =====
    window.showProductForm = async function (...args) {
        await Promise.all([window.ModuleLoader.load('categories'), window.ModuleLoader.load('product-form')]);
        return window.showProductForm(...args);
    };
    window.showProductList = async function (...args) {
        await window.ModuleLoader.load('product-form');
        return window.showProductList(...args);
    };
    window.editProduct = async function (...args) {
        await Promise.all([window.ModuleLoader.load('categories'), window.ModuleLoader.load('product-form')]);
        return window.editProduct(...args);
    };
    window.showCategoryManager = async function (...args) {
        await window.ModuleLoader.load('categories');
        return window.showCategoryManager(...args);
    };
    window.hideCategoryManager = async function (...args) {
        await window.ModuleLoader.load('categories');
        return window.hideCategoryManager(...args);
    };
    window.showProductQRModal = async function (...args) {
        await window.ModuleLoader.load('qr-modal');
        return window.showProductQRModal(...args);
    };
    window.startScanner = async function (...args) {
        await window.ModuleLoader.load('scanner');
        return window.startScanner(...args);
    };
    window.openDeliveryCodeModal = async function (...args) {
        await window.ModuleLoader.load('scanner');
        return window.openDeliveryCodeModal(...args);
    };
    window.initSettingMap = async function (...args) {
        await window.ModuleLoader.load('map');
        return window.initSettingMap(...args);
    };
    window.loadAiAssistantConfig = async function (...args) {
        await window.ModuleLoader.load('ai-assistant');
        return window.loadAiAssistantConfig(...args);
    };
    window.saveAiAssistantConfig = async function (...args) {
        await window.ModuleLoader.load('ai-assistant');
        return window.saveAiAssistantConfig(...args);
    };
    window.loadWhatsappConfig = async function (...args) {
        await window.ModuleLoader.load('whatsapp');
        return window.loadWhatsappConfig(...args);
    };
    window.saveWhatsappConfig = async function (...args) {
        await window.ModuleLoader.load('whatsapp');
        return window.saveWhatsappConfig(...args);
    };
    window.approveOrder = async function (...args) {
        await window.ModuleLoader.load('orders-actions');
        return window.approveOrder(...args);
    };
    window.merchantCancelOrder = async function (...args) {
        await window.ModuleLoader.load('orders-actions');
        return window.merchantCancelOrder(...args);
    };
    window.markOrderOutForDelivery = async function (...args) {
        await window.ModuleLoader.load('orders-actions');
        return window.markOrderOutForDelivery(...args);
    };
    window.submitMerchantDeliveryCode = async function (...args) {
        await window.ModuleLoader.load('scanner');
        return window.submitMerchantDeliveryCode(...args);
    };
    window.loadAllFromJson = async function (...args) {
        await window.ModuleLoader.load('products');
        return window.loadAllFromJson(...args);
    };
    window.renderProductsInitial = async function (...args) {
        await window.ModuleLoader.load('products');
        return window.renderProductsInitial(...args);
    };
    window.loadNextProductsChunk = async function (...args) {
        await window.ModuleLoader.load('products');
        return window.loadNextProductsChunk(...args);
    };
    window.filterP = async function (...args) {
        await window.ModuleLoader.load('products');
        return window.filterP(...args);
    };

    // ===== مخزن بيانات التطبيق (AppStore) =====
    window.AppStore = (() => {
        let state = { products: [], activeOrders: [], archivedOrders: [] };
        const listeners = {};

        function subscribe(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
        }

        function notify(event, data) {
            if (listeners[event]) listeners[event].forEach(cb => cb(data));
        }

        let persistTimer = null;
        function schedulePersist() {
            if (persistTimer) clearTimeout(persistTimer);
            persistTimer = setTimeout(() => {
                persistTimer = null;
                const run = () => {
                    try {
                        localStorage.setItem('merchant_products_cache', JSON.stringify(state.products));
                        localStorage.setItem('merchant_active_orders_cache', JSON.stringify(state.activeOrders));
                        localStorage.setItem('merchant_archived_orders_cache', JSON.stringify(state.archivedOrders));
                    }
                    catch (e) { }
                };
                if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 1000 });
                else run();
            }, 400);
        }

        return {
            subscribe,
            setProducts: (p) => {
                state.products = p;
                schedulePersist();
                notify('products_init', state.products);
            },
            getProducts: () => state.products,
            getProductsCount: () => state.products.length,
            findProduct: (id) => state.products.find(p => String(p.global_product_id || p.id) === String(id)),
            updateProduct: (up) => {
                const idx = state.products.findIndex(p => String(p.global_product_id || p.id) === String(up.global_product_id || up.id));
                if (idx > -1) {
                    state.products[idx] = { ...state.products[idx], ...up };
                    notify('product_updated', state.products[idx]);
                } else {
                    state.products.unshift(up);
                    notify('product_added', up);
                }
                schedulePersist();
            },
            removeProduct: (id) => {
                state.products = state.products.filter(p => String(p.global_product_id || p.id) !== String(id));
                schedulePersist();
                notify('product_removed', id);
            },
            setOrders: (type, orders) => {
                if (type === 'active') state.activeOrders = orders;
                else state.archivedOrders = orders;
                schedulePersist();
                notify('orders_updated', { type, orders });
                if (type === 'active' && typeof window.evaluatePendingOrdersState === 'function') {
                    window.evaluatePendingOrdersState();
                }
            },
            getOrders: (type) => type === 'active' ? [...state.activeOrders] : [...state.archivedOrders]
        };
    })();

    // ===== نظام الحماية المتقدمة ومكافحة الإغراق والتلاعب (Security Guard) =====
    window.SecurityGuard = (() => {
        const rateLimits = new Map();
        const activeLocks = new Set();
        const failedDeliveryAttempts = new Map();

        // التحقق من تجاوز معدل الطلبات (Anti-Flooding / Anti-Draining)
        function checkRateLimit(action, maxRequests = 15, windowMs = 10000) {
            const now = Date.now();
            const history = (rateLimits.get(action) || []).filter(ts => now - ts < windowMs);
            if (history.length >= maxRequests) {
                return false;
            }
            history.push(now);
            rateLimits.set(action, history);
            return true;
        }

        // قفل العمليات المتزامنة لمنع التكرار (Mutex Lock)
        function acquireLock(lockKey) {
            if (activeLocks.has(lockKey)) return false;
            activeLocks.add(lockKey);
            return true;
        }

        function releaseLock(lockKey) {
            activeLocks.delete(lockKey);
        }

        // فحص محاولات كود التسليم (Delivery Code Brute Force Protection)
        function checkDeliveryCodeAttempt(orderId) {
            const record = failedDeliveryAttempts.get(String(orderId));
            if (!record) return { allowed: true };
            if (record.lockedUntil && Date.now() < record.lockedUntil) {
                const remainingSec = Math.ceil((record.lockedUntil - Date.now()) / 1000);
                return { allowed: false, remainingSec };
            }
            return { allowed: true };
        }

        function recordDeliveryCodeAttempt(orderId, success) {
            const idStr = String(orderId);
            if (success) {
                failedDeliveryAttempts.delete(idStr);
                return;
            }
            const record = failedDeliveryAttempts.get(idStr) || { count: 0, lockedUntil: null };
            record.count += 1;
            if (record.count >= 3) {
                record.lockedUntil = Date.now() + 60000; // حظر مؤقت لمدة 60 ثانية
                record.count = 0;
            }
            failedDeliveryAttempts.set(idStr, record);
        }

        // التحقق الصارم من الشروط والمدخلات قبل الإرسال (Pre-flight Validation)
        function validateActionPayload(action, data) {
            if (!action || typeof action !== 'string') {
                return { valid: false, error: 'نوع العملية غير معروف' };
            }

            // فحص حذف منتج
            if (action === 'delete_product') {
                const pId = data?.id || data?.product_id;
                if (!pId || pId === 'undefined' || pId === 'null' || !String(pId).trim()) {
                    return { valid: false, error: 'معرف المنتج غير محدد' };
                }
            }

            // فحص تأكيد كود التسليم
            if (action === 'confirm_delivery_code') {
                const ticketId = data?.ticket_id;
                const code = String(data?.code || '').trim();
                if (!ticketId || ticketId === 'undefined' || ticketId === 'null' || !String(ticketId).trim()) {
                    return { valid: false, error: 'يرجى تحديد الطلب المراد تسليمه أولاً' };
                }
                if (!code || !/^\d{4,6}$/.test(code)) {
                    return { valid: false, error: 'كود التسليم يجب أن يتكون من 4 أرقام' };
                }
                const attemptCheck = checkDeliveryCodeAttempt(ticketId);
                if (!attemptCheck.allowed) {
                    return { valid: false, error: `تم حظر المحاولات لهذا الطلب مؤقتاً لتكرار الخطأ. يرجى الانتظار ${attemptCheck.remainingSec} ثانية.` };
                }
            }

            // فحص تحديث حالة الطلب
            if (action === 'update_order_status') {
                const ticketId = data?.ticket_id;
                const status = data?.status;
                const allowedStatuses = ['confirmed_by_store', 'out_for_delivery', 'completed', 'cancelled'];
                if (!ticketId || ticketId === 'undefined' || ticketId === 'null' || !String(ticketId).trim()) {
                    return { valid: false, error: 'معرف الطلب غير محدد' };
                }
                if (!status || !allowedStatuses.includes(status)) {
                    return { valid: false, error: 'الحالة المطلوبة غير صالحة' };
                }
            }

            // فحص إلغاء الطلب
            if (action === 'cancel_order') {
                const ticketId = data?.ticket_id;
                if (!ticketId || ticketId === 'undefined' || ticketId === 'null' || !String(ticketId).trim()) {
                    return { valid: false, error: 'معرف الطلب غير محدد للإلغاء' };
                }
            }

            return { valid: true };
        }

        function sanitizeString(str) {
            if (typeof str !== 'string') return str;
            return str
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript\s*:/gi, '')
                .trim();
        }

        return {
            checkRateLimit,
            acquireLock,
            releaseLock,
            validateActionPayload,
            recordDeliveryCodeAttempt,
            sanitizeString
        };
    })();

    // ===== دالة طلبات الـ API =====
    window.apiReq = async function (action, data = {}, method = 'POST', isFD = false, isSilent = false, retryCount = 0) {
        const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token') || window.merchantToken;
        if (!token) {
            if (!isSilent && typeof window.handleLogout === 'function') window.handleLogout(true);
            return { status: 'error', message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول.' };
        }

        // مكافحة الإغراق والنزف (Rate Limiting)
        const isCritical = ['delete_product', 'confirm_delivery_code', 'update_order_status', 'cancel_order', 'save_product'].includes(action);
        const maxAllowed = isCritical ? 6 : 25;
        if (!window.SecurityGuard.checkRateLimit(action, maxAllowed, 8000)) {
            const rateErr = 'تم إرسال عدة عمليات بسرعة فائقة، يرجى التمهل ثوانٍ قبل المتابعة.';
            if (!isSilent && typeof window.showT === 'function') window.showT(rateErr, 'error');
            return { status: 'error', message: rateErr };
        }

        // التحقق من صحة الشروط والمعاملات قبل الخروج للشبكة (Pre-flight Validation)
        if (!isFD) {
            const preCheck = window.SecurityGuard.validateActionPayload(action, data);
            if (!preCheck.valid) {
                if (!isSilent && typeof window.showT === 'function') window.showT(preCheck.error, 'error');
                return { status: 'error', message: preCheck.error };
            }
        }

        // قفل العمليات المتزامنة لمنع تكرار الإرسال
        let lockKey = null;
        if (isCritical) {
            const entityKey = isFD ? (data.get ? (data.get('id') || data.get('product_id')) : '') : (data.id || data.product_id || data.ticket_id || '');
            lockKey = `${action}_${entityKey || 'act'}`;
            if (!window.SecurityGuard.acquireLock(lockKey)) {
                return { status: 'error', message: 'العملية قيد المعالجة حالياً...' };
            }
        }

        async function executeFetch(url, isWorkerCall) {
            const headers = { 'Authorization': `Bearer ${token}` };
            if (!isWorkerCall) headers['X-CSRF-TOKEN'] = window.CSRF_TOKEN;
            const opts = { method, headers, credentials: isWorkerCall ? 'omit' : 'include' };

            if (method === 'POST') {
                if (isFD) {
                    if (!data.has('action')) data.append('action', action);
                    if (!isWorkerCall && token) data.append('auth_token', token);
                    opts.body = data;
                } else {
                    headers['Content-Type'] = 'application/json';
                    opts.body = isWorkerCall
                        ? JSON.stringify({ action, ...data })
                        : JSON.stringify({ action, auth_token: token, ...data });
                }
            }
            const res = await fetch(url, opts);

            const newToken = res.headers.get('X-New-CSRF-Token');
            if (newToken) window.CSRF_TOKEN = newToken;

            const rawText = await res.text();
            let result;
            try {
                const jsonStart = rawText.indexOf('{');
                const jsonEnd = rawText.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd >= jsonStart) {
                    result = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
                } else throw new Error("No JSON payload");
            } catch (e) {
                if (rawText.includes('<html') || rawText.includes('__test')) throw new Error('جدار حماية الاستضافة يعيق الاتصال.');
                throw new Error('السيرفر أرجع بيانات غير صالحة.');
            }

            if (res.status === 401) {
                if (!isSilent && typeof window.handleLogout === 'function') window.handleLogout(true);
                return { status: 'error', message: 'انتهت الجلسة' };
            }
            if (res.status === 403 && result.error_type === 'csrf_mismatch' && retryCount < 2) {
                return await window.apiReq(action, data, method, isFD, isSilent, retryCount + 1);
            }
            if (!res.ok && res.status !== 429) {
                throw new Error(result.message || 'خطأ داخلي في الخادم.');
            }
            return result;
        }

        try {
            const useWorker = window.WORKER_ACTIONS.includes(action);
            const targetUrl = useWorker ? window.WORKER_API_URL : window.API_URL;

            let result;
            try {
                result = await executeFetch(targetUrl, useWorker);
            } catch (fetchErr) {
                // محاولة الاتصال بالـ API_URL الاحتياطي إذا فشل الـ Worker (مثل 404 أو تعذر الاتصال)
                if (useWorker && targetUrl !== window.API_URL && !window.WORKER_NO_FALLBACK_ACTIONS.has(action)) {
                    result = await executeFetch(window.API_URL, false);
                } else {
                    throw fetchErr;
                }
            }

            if (action === 'confirm_delivery_code' && !isFD) {
                window.SecurityGuard.recordDeliveryCodeAttempt(data.ticket_id, result.status === 'success');
            }

            return result;

        } catch (error) {
            if (action === 'confirm_delivery_code' && !isFD) {
                window.SecurityGuard.recordDeliveryCodeAttempt(data.ticket_id, false);
            }
            if (!isSilent) console.log("API Error:", error.message);
            return { status: 'error', message: error.message };
        } finally {
            if (lockKey) window.SecurityGuard.releaseLock(lockKey);
        }
    };

    window.setDashboardSocketStatus = function (status, detail = '') {
        window.dashboardSocketStatus = status;
        window.dashboardSocketLastError = detail;
        const el = document.getElementById('dashboard-connection-status');
        if (!el) return;
        const dot = el.querySelector('span:first-child');
        const text = el.querySelector('span:last-child');
        const states = {
            connected: ['#10b981', 'متصل لحظياً'],
            connecting: ['#f59e0b', 'جاري الاتصال...'],
            disconnected: ['#ef4444', detail ? `غير متصل: ${detail}` : 'غير متصل'],
            offline: ['#ef4444', 'لا يوجد إنترنت'],
        };
        const current = states[status] || states.disconnected;
        if (dot) dot.style.background = current[0];
        if (text) text.textContent = current[1];
        el.title = detail || current[1];
    };

    window.dashboardSharedWorker = null;
    window.dashboardSharedWorkerPort = null;
    window.dashboardSharedWorkerActive = false;

    window.isDashboardRealtimeReady = function () {
        return Boolean(
            window.dashboardSocketReady &&
            window.dashboardSnapshotLoaded &&
            (window.dashboardSharedWorkerActive || (window.dashboardSocket && window.dashboardSocket.readyState === WebSocket.OPEN))
        );
    };

    window.ensureDashboardRealtime = async function () {
        if (window.isDashboardRealtimeReady()) return true;
        const connection = window.connectDashboardSocket();
        const connected = await connection;
        return Boolean(connected && window.isDashboardRealtimeReady());
    };

    window.processDashboardSnapshot = function (message) {
        if (!message || typeof message !== 'object') return;
        window.setDashboardSocketStatus('connected');
        if (typeof window.ilsConnectionState === 'function') {
            window.ilsConnectionState('success', 'تم تجهيز الاتصال والبيانات');
        }
        window.dashboardSnapshotLoaded = true;
        window.dashboardSocketReady = true;

        if (Array.isArray(message.products)) {
            window.AppStore.setProducts(message.products);
            window.dashboardReadState.products = true;
        }
        if (Array.isArray(message.orders)) {
            window.AppStore.setOrders('active', message.orders);
            window.dashboardReadState.activeOrders = true;
        }
        if (Array.isArray(message.archivedOrders)) {
            window.AppStore.setOrders('archived', message.archivedOrders);
            window.dashboardReadState.archivedOrders = true;
        }
        if (Array.isArray(message.categories)) window.flatCategoriesList = message.categories;
        if (message.settings && typeof message.settings === 'object') {
            window.dashboardReadState.settings = true;
            window.currentMerchantData = message.settings;
            localStorage.setItem('merchant_settings_cache', JSON.stringify(message.settings));
            localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
            if (typeof window.applySettingsToUI === 'function') window.applySettingsToUI(message.settings);
        }
        if (Array.isArray(message.salesLog) && typeof window.computeStatsByCurrency === 'function') {
            window.dashboardReadState.stats = true;
            const stats = window.computeStatsByCurrency(message.salesLog);
            stats.weekly = typeof window.computeWeeklyActivity === 'function'
                ? window.computeWeeklyActivity(message.salesLog) : null;
            localStorage.setItem('merchant_dashboard_stats_v2', JSON.stringify(stats));
            if (typeof window.renderCurrencyStats === 'function') window.renderCurrencyStats(stats.byCurrency);
            if (typeof window.renderTopSellersList === 'function') window.renderTopSellersList({ labels: stats.topProducts, data: stats.topCounts });
            if (typeof window.renderWeeklyActivityBar === 'function') window.renderWeeklyActivityBar(stats.weekly);
        }

        if (typeof window.tryRevealApp === 'function') window.tryRevealApp();
    };

    window.processDashboardEvent = function (message) {
        if (!message || !message.event) return;
        if (message.event === 'product_updated' && message.product) {
            window.AppStore.updateProduct(message.product);
        } else if (message.event === 'product_removed' && message.product_id) {
            window.AppStore.removeProduct(message.product_id);
        } else if (message.event === 'order_updated' && message.order) {
            const wasKnown = window.AppStore.getOrders('active').some(order => String(order.id) === String(message.order.id));
            const current = window.AppStore.getOrders('active');
            const next = current.filter(order => String(order.id) !== String(message.order.id));
            if (message.order.status !== 'completed' && message.order.status !== 'cancelled') {
                next.push(message.order);
            }
            window.AppStore.setOrders('active', next);
            if (!wasKnown && message.order.status === 'pending_merchant_approval') {
                const ordersSection = document.getElementById('orders');
                const isOrdersTabOpen = Boolean(ordersSection && ordersSection.classList.contains('active'));
                if (isOrdersTabOpen) {
                    window.dismissOrderAlerts?.();
                }
                if (typeof window.addNotification === 'function') {
                    window.addNotification('fa-bell', 'وصل طلب جديد من ' + (message.order.customer_name || 'عميل'), 'warning');
                }
                const alert = document.getElementById('new-order-alert');
                if (alert && !isOrdersTabOpen) alert.classList.add('show');
                if (!isOrdersTabOpen && window.orderAudio && window.currentMerchantData?.settings?.push_notifications !== false) {
                    window.orderAudio.loop = true;
                    window.orderAudio.currentTime = 0;
                    window.orderAudio.play().catch(() => {});
                }
                window.initialOrdersLoaded = true;
            }
            if (typeof window.renderOrdersUI === 'function' && document.getElementById('orders-container')) {
                window.renderOrdersUI(next, 'active');
            }
        } else if (message.event === 'settings_updated' && message.settings) {
            window.currentMerchantData = message.settings;
            localStorage.setItem('merchant_settings_cache', JSON.stringify(message.settings));
            localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
            if (typeof window.applySettingsToUI === 'function') window.applySettingsToUI(message.settings);
        } else if (message.event === 'merchant_message' && message.message) {
            const incoming = message.message;
            if (typeof window.addNotification === 'function') {
                window.addNotification(
                    'fa-whatsapp',
                    `رسالة واتساب من ${incoming.customer_name || 'عميل'}: ${incoming.text || ''}`,
                    'info'
                );
            }
            window.dispatchEvent(new CustomEvent('merchant-message', { detail: incoming }));
        }
    };

    // اتصال واحد آمن لكل جلسة؛ مع دعم SharedWorker لمنع الانقطاع عند تحديث الصفحة
    window.connectDashboardSocket = function () {
        const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token') || window.merchantToken;
        const merchantId = window.merchantUserId;
        if (!token || !merchantId) {
            if (typeof window.ilsConnectionState === 'function') {
                window.ilsConnectionState('error', 'بيانات الاتصال غير متوفرة');
            }
            window.setDashboardSocketStatus('disconnected', 'بيانات الدخول غير متوفرة');
            return Promise.resolve(false);
        }

        if (window.isDashboardRealtimeReady()) {
            return Promise.resolve(true);
        }

        const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socketUrl = `${scheme}//${window.location.host}/api/worker/ws?merchant_id=${encodeURIComponent(merchantId)}&token=${encodeURIComponent(token)}`;

        // 🌟 1. المسار الفائق: SharedWorker للاستمرار عبر التحديثات والتبويبات
        if (typeof window.SharedWorker === 'function' && !window.dashboardSocketForceDirect) {
            try {
                if (!window.dashboardSharedWorker) {
                    window.dashboardSharedWorker = new SharedWorker('/js/dashboard/realtime-worker.js', { name: 'nalsh-merchant-realtime' });
                    const port = window.dashboardSharedWorker.port;
                    window.dashboardSharedWorkerPort = port;

                    window.dashboardDataReady = new Promise((resolve) => {
                        let settled = false;
                        const finish = (val) => {
                            if (!settled) {
                                settled = true;
                                clearTimeout(workerTimeout);
                                resolve(val);
                            }
                        };
                        const workerTimeout = setTimeout(() => {
                            finish(window.isDashboardRealtimeReady());
                        }, 12000);

                        port.onmessage = function (event) {
                            let msg = event.data;
                            if (typeof msg === 'string') {
                                try { msg = JSON.parse(msg); } catch (_) { return; }
                            }
                            if (!msg || typeof msg !== 'object') return;

                            if (msg.type === 'status') {
                                window.setDashboardSocketStatus(msg.status, msg.detail || '');
                                if (msg.status === 'connected') {
                                    window.dashboardSocketReady = true;
                                    window.dashboardSharedWorkerActive = true;
                                    if (window.dashboardSnapshotLoaded) finish(true);
                                } else if (msg.status === 'disconnected') {
                                    window.dashboardSocketReady = false;
                                }
                            } else if (msg.type === 'snapshot') {
                                window.dashboardSharedWorkerActive = true;
                                window.processDashboardSnapshot(msg.data);
                                finish(true);
                            } else if (msg.type === 'event') {
                                window.processDashboardEvent(msg.data);
                            } else if (msg.type === 'error') {
                                window.setDashboardSocketStatus('disconnected', msg.message || 'خطأ في الاتصال اللحظي');
                                finish(false);
                            }
                        };

                        port.start();
                        port.postMessage({
                            action: 'init',
                            socketUrl,
                            merchantId,
                            token
                        });
                    });
                } else if (window.dashboardSharedWorkerPort) {
                    window.dashboardSharedWorkerPort.postMessage({
                        action: 'init',
                        socketUrl,
                        merchantId,
                        token
                    });
                }
                return window.dashboardDataReady;
            } catch (workerErr) {
                console.warn('تراجع للاتصال المباشر:', workerErr);
                window.dashboardSharedWorker = null;
                window.dashboardSharedWorkerPort = null;
            }
        }

        // 🌟 2. المسار الاحتياطي: اتصال WebSocket مباشر
        if (window.dashboardSocket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(window.dashboardSocket.readyState)) {
            return window.isDashboardRealtimeReady() ? Promise.resolve(true) : window.dashboardDataReady;
        }

        if (window.dashboardSocketReconnectTimer) {
            clearTimeout(window.dashboardSocketReconnectTimer);
            window.dashboardSocketReconnectTimer = null;
        }
        window.dashboardSocketReady = false;
        window.setDashboardSocketStatus('connecting');
        if (typeof window.ilsConnectionState === 'function') {
            window.ilsConnectionState('', 'جاري إنشاء اتصال آمن...');
        }

        window.dashboardDataReady = new Promise((resolve) => {
            const socket = new WebSocket(socketUrl);
            let settled = false;
            const handshakeTimer = setTimeout(() => {
                if (!settled) {
                    if (typeof window.ilsConnectionState === 'function') {
                        window.ilsConnectionState('error', 'بانتظار الاتصال اللحظي الآمن...');
                    }
                    window.setDashboardSocketStatus('disconnected', 'انتهت مهلة الاتصال');
                    finish(false);
                    if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
                        socket.close(1011, 'تجاوز مهلة اللقطة');
                    }
                }
            }, 12000);
            const finish = (value) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(handshakeTimer);
                    resolve(value);
                }
            };

            window.dashboardSocket = socket;
            socket.addEventListener('open', () => {
                if (socket !== window.dashboardSocket || window.dashboardSocketStop) {
                    socket.close(1000, 'اتصال قديم');
                    return;
                }
                window.setDashboardSocketStatus('connecting', 'تم فتح القناة، بانتظار البيانات...');
                window.dashboardSocketReady = true;
                window.dashboardSocketReconnectAttempt = 0;
                socket.send(JSON.stringify({ type: 'ping' }));
                if (window.dashboardSocketPingTimer) clearInterval(window.dashboardSocketPingTimer);
                window.dashboardSocketPingTimer = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'ping' }));
                }, 20000);
            });

            socket.addEventListener('message', (event) => {
                let message;
                try { message = JSON.parse(event.data); } catch (e) { return; }
                if (message.type === 'pong') return;
                if (message.event === 'initial_load') {
                    window.processDashboardSnapshot(message);
                    finish(true);
                } else if (message.event === 'error') {
                    if (typeof window.ilsConnectionState === 'function') {
                        window.ilsConnectionState('error', 'تعذر تحميل الاتصال اللحظي');
                    }
                    window.setDashboardSocketStatus('disconnected', message.message || 'فشل تحميل بيانات اللوحة');
                    finish(false);
                } else {
                    window.processDashboardEvent(message);
                }
            });

            socket.addEventListener('error', () => {
                if (socket !== window.dashboardSocket) return;
                window.setDashboardSocketStatus('disconnected', 'رفض الخادم اتصال WebSocket');
                finish(false);
            });

            socket.addEventListener('close', (event) => {
                if (socket !== window.dashboardSocket) return;
                window.dashboardSocketReady = false;
                window.dashboardSnapshotLoaded = false;
                window.dashboardConnectionChecked = false;
                const reason = event.reason || (event.code === 1000 ? 'تم إغلاق الاتصال' : `رمز ${event.code}`);
                window.setDashboardSocketStatus(navigator.onLine ? 'disconnected' : 'offline', reason);
                if (window.dashboardSocketPingTimer) {
                    clearInterval(window.dashboardSocketPingTimer);
                    window.dashboardSocketPingTimer = null;
                }
                if (!settled) finish(false);
                if (!window.dashboardSocketStop && !window.dashboardSocketPaused && navigator.onLine && document.visibilityState === 'visible') {
                    const attempt = (window.dashboardSocketReconnectAttempt || 0) + 1;
                    window.dashboardSocketReconnectAttempt = attempt;
                    window.dashboardSocketReconnectTimer = setTimeout(() => {
                        window.connectDashboardSocket();
                    }, Math.min(25000, 1000 * Math.pow(1.8, Math.min(attempt - 1, 5))));
                }
            });
        });

        return window.dashboardDataReady;
    };
    window.addEventListener('online', () => {
        window.dashboardSocketReconnectAttempt = 0;
        window.connectDashboardSocket();
    });
    window.addEventListener('offline', () => {
        window.setDashboardSocketStatus('offline');
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // لا نغلق القناة عند تبديل التبويب؛ إغلاقها يسبب اتصالاً ولقطة
            // جديدين في كل عودة، بينما تبقى القناة آمنة وتعيد الاتصال عند انقطاعها.
            window.dashboardSocketPaused = false;
            return;
        }

        window.dashboardSocketPaused = false;
        if (!window.dashboardSocketStop && navigator.onLine) {
            window.connectDashboardSocket();
        }
    });

    // ===== إخفاء شاشة التحميل =====
    window.hideInitialLoadingScreen = function () {
        window.appDataReady = true;
        if (typeof window.tryRevealApp === 'function') window.tryRevealApp();
    };

    // ===== التهيئة والتحقق من الجلسة =====
    window.verifySessionAndLoad = async function () {
        const ls = document.getElementById('initial-loading-screen');
        try {
            if (window.isLocalTemplateMode) {
                window.currentMerchantData = {
                    username: 'demo_store',
                    store_name: 'متجر التجربة المحلية',
                    settings: { store_name: 'متجر التجربة المحلية' }
                };
                window.dashboardConnectionChecked = true;
                window.dashboardSnapshotLoaded = true;
                if (typeof window.applySettingsToUI === 'function') {
                    window.applySettingsToUI(window.currentMerchantData);
                }
                window.hideInitialLoadingScreen();
                await window.switchT('templates');
                return;
            }
            sessionStorage.setItem('merchant_session_started', 'true');
            // يبدأ bootApp الاتصال مسبقاً؛ الاحتفاظ بالوعد يمنع فتح قناة ثانية.
            let realtimeConnection = window.connectDashboardSocket();

            const cachedProducts = localStorage.getItem('merchant_products_cache');
            const cachedSettings = localStorage.getItem('merchant_settings_cache');
            const cachedActiveOrders = localStorage.getItem('merchant_active_orders_cache');
            const cachedArchivedOrders = localStorage.getItem('merchant_archived_orders_cache');

            if (window.ilsUpdate) window.ilsUpdate(40, 'جاري تحميل بياناتك المحفوظة...');
            if (cachedSettings) {
                try {
                    window.currentMerchantData = JSON.parse(cachedSettings);
                    if (typeof window.applySettingsToUI === 'function') {
                        window.applySettingsToUI(window.currentMerchantData);
                    }
                } catch (e) {
                    localStorage.removeItem('merchant_settings_cache');
                    localStorage.removeItem('merchant_settings_cache_ts');
                    if (typeof window.applySettingsToUI === 'function') window.applySettingsToUI(null);
                }
            } else if (typeof window.applySettingsToUI === 'function') {
                window.applySettingsToUI(null);
            }

            let shownFromCache = false;
            if (cachedProducts) {
                try {
                    const parsedProducts = JSON.parse(cachedProducts);
                    if (parsedProducts && parsedProducts.length > 0) {
                        window.AppStore.setProducts(parsedProducts);
                        window.dashboardReadState.products = true;
                        shownFromCache = true;
                    }
                } catch (e) {
                    localStorage.removeItem('merchant_products_cache');
                }
            }
            try {
                if (cachedActiveOrders) {
                    window.AppStore.setOrders('active', JSON.parse(cachedActiveOrders));
                    window.dashboardReadState.activeOrders = true;
                }
                if (cachedArchivedOrders) {
                    window.AppStore.setOrders('archived', JSON.parse(cachedArchivedOrders));
                    window.dashboardReadState.archivedOrders = true;
                }
            } catch (e) {
                localStorage.removeItem('merchant_active_orders_cache');
                localStorage.removeItem('merchant_archived_orders_cache');
            }

            const hasLocalCache = Boolean(
                (cachedProducts && cachedProducts.length > 2) || 
                (cachedSettings && cachedSettings.length > 2) || 
                (cachedActiveOrders && cachedActiveOrders.length > 2)
            );

            if (hasLocalCache) {
                // 🚀 عرض فوري للوحة التحكم من الكاش دون أي تأخير عند عمل Refresh أو التنقل!
                window.dashboardConnectionChecked = true;
                window.hideInitialLoadingScreen();

                // مزامنة الاتصال اللحظي في الخلفية وتحديث البيانات عند وصول اللقطة
                realtimeConnection.then(() => {
                    window.dashboardConnectionChecked = true;
                    if (typeof window.loadStoreData === 'function') {
                        window.loadStoreData().catch(e => console.warn('تحديث الإعدادات:', e));
                    }
                }).catch(e => console.warn('مزامنة الاتصال اللحظي بالخلفية:', e));
            } else {
                // أول تسجيل دخول على هذا الجهاز (لا يوجد كاش محلي): انتظار الاتصال واللقطة
                if (window.ilsUpdate) window.ilsUpdate(15, 'التحقق من الاتصال اللحظي...');
                try {
                    await Promise.race([
                        realtimeConnection,
                        new Promise(resolve => setTimeout(resolve, 6000))
                    ]);
                } catch (error) {
                    console.warn('تعذر استكمال الاتصال اللحظي الأولي:', error);
                }
                window.dashboardConnectionChecked = true;
                window.hideInitialLoadingScreen();
            }

            // تحميل وعرض تبويب الرئيسية فوراً وبسرعة فائقة
            await window.ModuleLoader.load('dashboard-tab');
            if (typeof window.ensureDashboardHTML === 'function') window.ensureDashboardHTML();
            if (typeof window.loadLocalDashboardStats === 'function') window.loadLocalDashboardStats();
            if (typeof window.loadStoreData === 'function') {
                window.loadStoreData().catch(e => console.warn('تحديث الإعدادات:', e));
            }

            // لا يتم تحميل أقسام المنتجات والطلبات إلا عند فتحها فعليًا.
            // ميزات PWA ثانوية ويمكن تحميلها عندما يصبح المتصفح متفرغًا.
            const loadDeferredFeatures = () => {
                Promise.all([
                    window.ModuleLoader.load('pwa'),
                    window.ModuleLoader.load('settings')
                ]).then(() => {
                    if (typeof window.loadStoreData === 'function') {
                        return window.loadStoreData();
                    }
                    return undefined;
                }).catch(error => {
                    console.warn('تعذر تحميل الميزات المؤجلة:', error);
                });
            };
            if (window.requestIdleCallback) {
                window.requestIdleCallback(loadDeferredFeatures, { timeout: window.dashboardPerformanceMode === 'light' ? 5000 : 2500 });
            } else {
                setTimeout(loadDeferredFeatures, window.dashboardPerformanceMode === 'light' ? 4000 : 2000);
            }

        } catch (e) {
            console.error("System Error: ", e);

            if (e.message && (e.message.includes('انتهت') || e.message.includes('تسجيل الدخول'))) {
                localStorage.removeItem('merchant_token');
                sessionStorage.removeItem('merchant_token');
                window.location.replace('login.html');
                return;
            }

            if (!navigator.onLine) {
                if (localStorage.getItem('merchant_products_cache') || localStorage.getItem('merchant_settings_cache')) {
                    window.dashboardConnectionChecked = false;
                    if (window.ilsUpdate) window.ilsUpdate(0, 'الاتصال غير متوفر، سيتم فتح اللوحة بعد عودته');
                    return;
                }
                if (window.ilsRelease) window.ilsRelease();
                if (ls) {
                    ls.innerHTML = `<div style="text-align:center; padding: 20px;"><i class="fas fa-wifi" style="font-size:3rem; color:var(--danger);"></i><h2>لا يوجد اتصال بالإنترنت</h2><button onclick="location.reload()" class="btn-main" style="margin-top:20px; width:auto; display:inline-block;">تحديث الصفحة</button></div>`;
                }
            } else {
                window.dashboardConnectionChecked = false;
                if (window.ilsUpdate) window.ilsUpdate(0, 'تعذر الاتصال اللحظي، جارٍ إعادة المحاولة...');
            }
        }
    };

    // ===== الصوتيات والتنبيهات =====
    window.orderAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    window.orderAudio.preload = 'none';

    function unlockAudio() {
        if (window.orderAudio) {
            window.orderAudio.play().then(() => {
                window.orderAudio.pause();
                window.orderAudio.currentTime = 0;
            }).catch(() => { });
        }
        document.body.removeEventListener('click', unlockAudio);
        document.body.removeEventListener('touchstart', unlockAudio);
    }
    document.body.addEventListener('click', unlockAudio);
    document.body.addEventListener('touchstart', unlockAudio);

})();
