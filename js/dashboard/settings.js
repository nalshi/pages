/**
 * settings.js — إعدادات المتجر العامة والنوافذ المرتبطة بها
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    // ===== حقن واجهة الإعدادات ونوافذها ديناميكياً =====
    window.ensureSettingsHTML = function () {
        const settingsSec = document.getElementById('settings');
        if (settingsSec && !settingsSec.querySelector('.settings-list')) {
            const html = `
            <div class="card-4d" style="padding: 20px;">
                <div class="card-header" style="font-size: 1.25rem;"><i class="fas fa-cog"></i> الإعدادات</div>
                <div class="settings-list">
                    <div class="setting-item" onclick="openM('setting-name-modal')">
                        <div class="s-label"><i class="fas fa-store text-primary"></i> اسم المتجر</div>
                        <div class="s-val"><span id="display-store-name" class="store-name-display">...</span> <i class="fas fa-chevron-left"></i></div>
                    </div>

                    <div class="setting-item" onclick="switchT('templates')" style="background: linear-gradient(90deg, rgba(79, 70, 229, 0.08), transparent); border-color: rgba(79, 70, 229, 0.3);">
                        <div class="s-label"><i class="fas fa-palette text-primary"></i> قوالب المتجر الجاهزة <span style="background:var(--primary); color:white; font-size:0.65rem; padding:2px 6px; border-radius:50px;">جديد</span></div>
                        <div class="s-val">اختيار ومعاينة <i class="fas fa-chevron-left" style="color:var(--primary);"></i></div>
                    </div>

                    <div class="setting-item" onclick="openM('setting-welcome-modal')">
                        <div class="s-label"><i class="fas fa-comment-alt text-primary"></i> رسالة ترحيب المتجر</div>
                        <div class="s-val"><span id="display-welcome-msg">...</span> <i class="fas fa-chevron-left"></i></div>
                    </div>
                    
                    <div class="setting-item" onclick="openM('setting-shipping-modal')">
                        <div class="s-label"><i class="fas fa-truck text-success"></i> التوصيل المجاني</div>
                        <div class="s-val"><span id="display-free-shipping">...</span> <i class="fas fa-chevron-left"></i></div>
                    </div>
                    
                    <div class="setting-item" onclick="openM('setting-ai-assistant-modal'); if (typeof loadAiAssistantConfig === 'function') loadAiAssistantConfig();">
                        <div class="s-label"><i class="fas fa-robot text-primary"></i> المساعد الذكي (AI)</div>
                        <div class="s-val"><span id="display-ai-assistant-status">...</span> <i class="fas fa-chevron-left"></i></div>
                    </div>

                    <div class="setting-item" onclick="openM('setting-whatsapp-modal'); if (typeof loadWhatsappConfig === 'function') loadWhatsappConfig();">
                        <div class="s-label"><i class="fab fa-whatsapp" style="color:#25D366;"></i> ربط المساعد بواتساب</div>
                        <div class="s-val"><span id="display-whatsapp-status">...</span> <i class="fas fa-chevron-left"></i></div>
                    </div>

                    <div class="setting-item">
                        <div class="s-label"><i class="fas fa-bell text-warning"></i> تنبيهات الطلبات الجديدة</div>
                        <div class="s-val">
                            <label class="toggle-switch">
                                <input type="checkbox" id="edit-push-notifications" onchange="handleNotificationToggle(this)">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="setting-item" onclick="handleLogout()" style="border-color: rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.02); margin-top: 12px;">
                        <div class="s-label" style="color: var(--danger);"><i class="fas fa-power-off"></i> تسجيل الخروج من الحساب</div>
                        <div class="s-val"><i class="fas fa-chevron-left" style="color: var(--danger);"></i></div>
                    </div>
                </div>
            </div>`;
            settingsSec.innerHTML = html;
        }

        // حقن Modals الإعدادات في body إن لم تكن موجودة
        if (!document.getElementById('setting-name-modal')) {
            const modalsHtml = `
            <div class="modal" id="setting-welcome-modal">
                <div class="modal-content" style="max-width: 420px;">
                    <div class="modal-title-bar">
                        <h3>رسالة ترحيب المتجر</h3>
                        <button class="close-btn" onclick="closeM('setting-welcome-modal')"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="input-group" style="margin-bottom: 18px;">
                        <label>اكتب عبارة ترحيبية جذابة تظهر للعملاء أعلى متجرك:</label>
                        <textarea id="edit-store-welcome" class="modern-input" rows="4" maxlength="150" placeholder="مثال: أهلاً بكم في متجرنا! تسوقوا أحدث المنتجات بأفضل الأسعار..."></textarea>
                        <small style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; display: block;">الحد الأقصى 150 حرف.</small>
                    </div>
                    <button class="btn-main" onclick="saveSpecificSetting('welcome')"><i class="fas fa-save"></i> حفظ الرسالة</button>
                </div>
            </div>

            <div class="modal" id="setting-name-modal">
                <div class="modal-content" style="max-width: 380px;">
                    <div class="modal-title-bar"><h3>تعديل اسم المتجر</h3><button class="close-btn" onclick="closeM('setting-name-modal')"><i class="fas fa-times"></i></button></div>
                    <input type="text" id="edit-store-name" class="modern-input" maxlength="40" style="width: 100%; margin-bottom: 18px;" placeholder="الاسم الجديد">
                    <button class="btn-main" onclick="saveSpecificSetting('name')">حفظ</button>
                </div>
            </div>

            <div class="modal" id="setting-phone-modal">
                <div class="modal-content" style="max-width: 380px;">
                    <div class="modal-title-bar"><h3>رقم الواتساب</h3><button class="close-btn" onclick="closeM('setting-phone-modal')"><i class="fas fa-times"></i></button></div>
                    <input type="tel" id="edit-store-phone" class="modern-input" dir="ltr" maxlength="15" style="width: 100%; margin-bottom: 18px; text-align: right;" placeholder="96777XXXXXXX">
                    <button class="btn-main" onclick="saveSpecificSetting('phone')">حفظ</button>
                </div>
            </div>

            <div class="modal" id="setting-shipping-modal">
                <div class="modal-content" style="max-width: 380px;">
                    <div class="modal-title-bar">
                        <h3><i class="fas fa-truck text-success"></i> التوصيل المجاني</h3>
                        <button class="close-btn" onclick="closeM('setting-shipping-modal')"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div class="input-group" style="margin-bottom: 16px;">
                        <label>تفعيل التوصيل المجاني</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="edit-free-shipping-enabled" onchange="toggleShippingInputs()">
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="input-group" style="margin-bottom: 14px;">
                        <label>شرط التوصيل المجاني</label>
                        <select id="edit-free-shipping-type" class="modern-input" onchange="toggleShippingInputs()">
                            <option value="always">مجاني دائماً</option>
                            <option value="order_value">عندما تصل قيمة الطلب إلى</option>
                            <option value="item_count">عندما يصل عدد القطع إلى</option>
                        </select>
                    </div>

                    <div class="input-group" id="free-shipping-threshold-group" style="margin-bottom: 20px; display: none;">
                        <label>الحد المطلوب</label>
                        <input type="number" id="edit-free-shipping-threshold" class="modern-input" placeholder="مثال: 15000" min="0" step="1">
                    </div>

                    <button class="btn-main" onclick="saveSpecificSetting('shipping')"><i class="fas fa-save"></i> حفظ الإعدادات</button>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalsHtml);
        }
    };

    // ===== تسجيل الخروج =====
    window.handleLogout = function (forceLogout = false) {
        const doLogout = async () => {
            const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
            ['merchant_token', 'merchant_products_cache', 'merchant_settings_cache',
                'merchant_active_orders_cache', 'merchant_archived_orders_cache',
                'merchant_settings_cache_ts', 'merchant_notifications', 'has_unread_notifs',
                'merchant_dashboard_stats', 'merchant_dashboard_stats_v2', 'mThm'].forEach(key => {
                    try { localStorage.removeItem(key); } catch (e) { }
                });
            sessionStorage.clear();
            window.dashboardSocketStop = true;
            if (window.dashboardSocket) window.dashboardSocket.close(1000, 'logout');
            await fetch(window.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': window.CSRF_TOKEN },
                body: JSON.stringify({ action: 'logout', auth_token: token })
            }).catch(() => { });
            window.location.href = 'login.html';
        };

        if (forceLogout) { doLogout(); return; }

        window.showSmartConfirm({
            title: 'تسجيل الخروج',
            msg: 'هل أنت متأكد أنك تريد إنهاء الجلسة الحالية؟',
            icon: 'fa-power-off',
            type: 'danger',
            confirmText: 'تسجيل خروج',
            onConfirm: doLogout
        });
    };

    // ===== جلب إعدادات المتجر =====
    window.loadStoreData = async function () {
        window.dashboardReadState = window.dashboardReadState || {};
        const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
        if (!token) throw new Error('بيانات الدخول مفقودة.');

        try {
            if (window.dashboardSocketReady || window.dashboardReadState.settings) {
                window.applySettingsToUI(window.currentMerchantData);
                return;
            }
            window.dashboardReadState.settings = true;
            const cachedSettings = localStorage.getItem('merchant_settings_cache');
            const cacheTimestamp = parseInt(localStorage.getItem('merchant_settings_cache_ts') || '0');
            const CACHE_MAX_AGE_MS = 10 * 60 * 1000;

            if (cachedSettings && (Date.now() - cacheTimestamp) < CACHE_MAX_AGE_MS) {
                try {
                    const cached = JSON.parse(cachedSettings);
                    window.currentMerchantData = cached;
                    window.applySettingsToUI(window.currentMerchantData);
                } catch(e) {}

                setTimeout(async () => {
                    try {
                        const res = await window.apiReq('get_merchant_settings', {}, 'POST', false, true);
                        if (res && res.status === 'success' && res.data) {
                            window.currentMerchantData = res.data;
                            if (typeof window.currentMerchantData.settings === 'string') {
                                try { window.currentMerchantData.settings = JSON.parse(window.currentMerchantData.settings); }
                                catch (e) { window.currentMerchantData.settings = {}; }
                            } else if (!window.currentMerchantData.settings) {
                                window.currentMerchantData.settings = {};
                            }
                            localStorage.setItem('merchant_settings_cache', JSON.stringify(window.currentMerchantData));
                            localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
                            window.applySettingsToUI(window.currentMerchantData);
                        }
                    } catch (e) { }
                }, 2000);
                return;
            }

            const res = await window.apiReq('get_merchant_settings', {}, 'POST', false, true);
            if (res && res.status === 'success' && res.data) {
                window.currentMerchantData = res.data;
                if (typeof window.currentMerchantData.settings === 'string') {
                    try { window.currentMerchantData.settings = JSON.parse(window.currentMerchantData.settings); }
                    catch (e) { window.currentMerchantData.settings = {}; }
                } else if (!window.currentMerchantData.settings) {
                    window.currentMerchantData.settings = {};
                }
                localStorage.setItem('merchant_settings_cache', JSON.stringify(window.currentMerchantData));
                localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
                window.applySettingsToUI(window.currentMerchantData);
                return;
            }
        } catch (e) {
            const cachedSettings = localStorage.getItem('merchant_settings_cache');
            if (cachedSettings) {
                try {
                    window.currentMerchantData = JSON.parse(cachedSettings);
                    window.applySettingsToUI(window.currentMerchantData);
                } catch(err) {}
                return;
            }
        }
    };

    // ===== تطبيق الإعدادات على الواجهة =====
    window.applySettingsToUI = function (data) {
        if (!data || Object.keys(data).length === 0) {
            data = {
                store_name: window.jwtPayload?.store_name || window.jwtPayload?.username || 'متجري',
                username: window.jwtPayload?.username,
                settings: {}
            };
        }
        const storeName = data.store_name || data.username || window.merchantUsername || 'متجري';
        document.querySelectorAll('#ui-store-name, .store-name-display').forEach(el => el.textContent = storeName);
        document.querySelectorAll('#ui-username').forEach(el => el.textContent = `@${window.merchantUsername || 'merchant'}`);
        document.title = 'بوابة التاجر | ' + storeName;
        window.updateSettingsUI(data);
        if (typeof window.renderStoreLinkBanner === 'function') window.renderStoreLinkBanner();
    };

    // ===== تحديث واجهة الإعدادات بطريقة آمنة وسريعة =====
    window.updateSettingsUI = function (m) {
        window.ensureSettingsHTML();
        if (!m) return;
        
        let s = m.settings;
        if (typeof s === 'string') {
            try { s = JSON.parse(s); } catch(e) { s = {}; }
        }
        s = s || {};

        const storeName = m.store_name || 'متجري';

        const elStoreName = document.getElementById('edit-store-name');
        if (elStoreName) elStoreName.value = storeName !== 'متجري' ? storeName : '';
        const dispStoreName = document.getElementById('display-store-name');
        if (dispStoreName) dispStoreName.innerText = storeName;

        const welcomeMsg = s.welcome_message || '';
        const elWelcome = document.getElementById('edit-store-welcome');
        if (elWelcome) elWelcome.value = welcomeMsg;
        const dispWelcome = document.getElementById('display-welcome-msg');
        if (dispWelcome) dispWelcome.innerText = welcomeMsg ? (welcomeMsg.substring(0, 20) + '...') : 'غير محددة';

        const storePhone = s.phone || m.phone || '';
        const elPhone = document.getElementById('edit-store-phone');
        if (elPhone) elPhone.value = storePhone;

        const isFreeEnabled = (s.free_shipping_enabled === true || String(s.free_shipping_enabled) === 'true');
        const freeType = s.free_shipping_type || 'order_value';
        const freeThreshold = parseFloat(s.free_shipping_threshold) || 0;

        const elFreeEnabled = document.getElementById('edit-free-shipping-enabled');
        if (elFreeEnabled) elFreeEnabled.checked = isFreeEnabled;
        const elFreeType = document.getElementById('edit-free-shipping-type');
        if (elFreeType) {
            elFreeType.value = freeType;
        }
        const elFreeThreshold = document.getElementById('edit-free-shipping-threshold');
        if (elFreeThreshold) elFreeThreshold.value = freeThreshold;

        let displayShippingText = 'معطل';
        if (isFreeEnabled) {
            if (freeType === 'always') displayShippingText = 'مفعل (دائماً)';
            else if (freeType === 'order_value') displayShippingText = `مفعل (> ${freeThreshold.toLocaleString()} ريال)`;
            else displayShippingText = `مفعل (> ${freeThreshold.toLocaleString()} قطع)`;
        }
        const dispFreeShipping = document.getElementById('display-free-shipping');
        if (dispFreeShipping) dispFreeShipping.innerText = displayShippingText;

        const elPushNotif = document.getElementById('edit-push-notifications');
        if (elPushNotif) {
            const dbEnabled = (s.push_notifications === true || String(s.push_notifications) === 'true');
            const permGranted = (typeof Notification !== 'undefined' && Notification.permission === 'granted');
            elPushNotif.checked = dbEnabled && permGranted;
        }

        if (typeof window.toggleShippingInputs === 'function') window.toggleShippingInputs();
    };

    // ===== حفظ إعداد محدد =====
    window.saveSpecificSetting = async function (t) {
        if (window.isSavingSettingLock) return;
        window.isSavingSettingLock = true;

        const modalId = (t === 'notifications') ? null : `setting-${t}-modal`;
        if (!window.currentMerchantData.settings) window.currentMerchantData.settings = {};
        if (typeof window.currentMerchantData.settings === 'string') {
            try { window.currentMerchantData.settings = JSON.parse(window.currentMerchantData.settings); } catch(e) { window.currentMerchantData.settings = {}; }
        }
        const previousData = JSON.parse(JSON.stringify(window.currentMerchantData));

        let newStoreName = window.currentMerchantData.store_name || 'متجري';
        if (t === 'name') {
            const nameInput = document.getElementById('edit-store-name');
            if (nameInput && nameInput.value.trim() !== '') {
                newStoreName = nameInput.value.trim();
            } else {
                window.showT('اسم المتجر مطلوب', 'error');
                window.isSavingSettingLock = false;
                return;
            }
        }

        if (t === 'welcome') {
            const welEl = document.getElementById('edit-store-welcome');
            window.currentMerchantData.settings.welcome_message = welEl ? welEl.value.trim() : '';
        }
        if (t === 'name') window.currentMerchantData.store_name = newStoreName;
        if (t === 'shipping') {
            const shipEn = document.getElementById('edit-free-shipping-enabled');
            const shipTy = document.getElementById('edit-free-shipping-type');
            const shipTh = document.getElementById('edit-free-shipping-threshold');
            window.currentMerchantData.settings.free_shipping_enabled = shipEn ? shipEn.checked : false;
            window.currentMerchantData.settings.free_shipping_type = shipTy ? shipTy.value : 'order_value';
            window.currentMerchantData.settings.free_shipping_threshold = shipTh ? (parseFloat(shipTh.value) || 0) : 0;
        }
        if (t === 'phone') {
            const phEl = document.getElementById('edit-store-phone');
            window.currentMerchantData.settings.phone = phEl ? phEl.value.trim() : '';
        }
        if (t === 'notifications') {
            const notifEl = document.getElementById('edit-push-notifications');
            window.currentMerchantData.settings.push_notifications = notifEl ? notifEl.checked : false;
        }

        window.isSavingSettingLock = false;
        if (modalId) window.closeM(modalId);
        window.showT('تم الحفظ ✅', 'success');
        localStorage.setItem('merchant_settings_cache', JSON.stringify(window.currentMerchantData));
        localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
        window.updateSettingsUI(window.currentMerchantData);
        document.querySelectorAll('#ui-store-name, .store-name-display').forEach(el => el.textContent = newStoreName);

        const apiRes = await window.apiReq('save_merchant_settings', {
            storeName: newStoreName,
            storeType: window.currentMerchantData.store_type || null,
            settings: window.currentMerchantData.settings
        });

        if (apiRes.status !== 'success') {
            window.currentMerchantData = previousData;
            localStorage.setItem('merchant_settings_cache', JSON.stringify(window.currentMerchantData));
            localStorage.setItem('merchant_settings_cache_ts', Date.now().toString());
            window.updateSettingsUI(window.currentMerchantData);
            document.querySelectorAll('#ui-store-name, .store-name-display').forEach(el => el.textContent = window.currentMerchantData.store_name || 'متجري');
            window.showT(apiRes.message || 'فشل الحفظ', 'error');
        }
    };

    // ===== إظهار/إخفاء حقول الشحن =====
    window.toggleShippingInputs = function () {
        const enabledCheckbox = document.getElementById('edit-free-shipping-enabled');
        if (!enabledCheckbox) return;
        const isEnabled = enabledCheckbox.checked;
        const typeSelect = document.getElementById('edit-free-shipping-type');
        const thresholdGroup = document.getElementById('free-shipping-threshold-group');
        if (typeSelect) typeSelect.disabled = !isEnabled;
        if (thresholdGroup) {
            const type = typeSelect ? typeSelect.value : 'always';
            thresholdGroup.style.display = (isEnabled && type !== 'always') ? 'flex' : 'none';
        }
    };

    // ===== معالج تبديل الإشعارات =====
    window.handleNotificationToggle = async function (checkbox) {
        if (checkbox.checked) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                window.showT('يرجى السماح بالإشعارات في المتصفح أولاً', 'error');
                checkbox.checked = false;
                return;
            }
            if (window.orderAudio) window.orderAudio.play().catch(() => { });
            window.showT('تم تفعيل التنبيهات ✅', 'success');
            await window.ModuleLoader.load('fcm');
            if (typeof window.initDynamicFCM === 'function') window.initDynamicFCM();
        }
        window.saveSpecificSetting('notifications');
    };

    // ===== بانر رابط المتجر =====
    window.renderStoreLinkBanner = function () {
        const username = window.merchantUsername || 'store';
        const storeUrl = `${window.location.origin}/${encodeURIComponent(username)}`;

        const bannerHTML = `<div class="store-link-banner"><div class="store-link-info"><div class="store-link-icon"><i class="fas fa-link"></i></div><div class="store-link-text"><h3>رابط متجرك الخاص</h3><p id="merchant-store-url" dir="ltr">${storeUrl}</p></div></div><div class="store-link-actions"><button class="btn-outline" onclick="copyStoreLink('${storeUrl}')"><i class="far fa-copy"></i> نسخ الرابط</button><a href="${storeUrl}" target="_blank" class="btn-main" style="width:auto; padding: 8px 18px; text-decoration: none;"><i class="fas fa-external-link-alt"></i> زيارة المتجر</a></div></div>`;
        const dashboardSec = document.getElementById('dashboard');
        if (dashboardSec && !document.querySelector('.store-link-banner')) {
            dashboardSec.insertAdjacentHTML('afterbegin', bannerHTML);
        }
    };

    window.copyStoreLink = function (url) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                window.showT('تم نسخ رابط المتجر ✅', 'success');
            }).catch(() => {
                window.fallbackCopy(url);
            });
        } else {
            window.fallbackCopy(url);
        }
    };

    window.fallbackCopy = function (text) {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        try {
            document.execCommand('copy');
            window.showT('تم النسخ بنجاح ✅', 'success');
        } catch (e) {
            window.showT('تعذر النسخ يدوياً.', 'error');
        }
        document.body.removeChild(el);
    };

    window.ensureSettingsHTML();

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('settings');

})();
