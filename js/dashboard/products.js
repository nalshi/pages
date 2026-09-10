/**
 * products.js — قائمة المنتجات وعرضها والتصفية والحذف
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    window.PRODUCTS_CHUNK_SIZE = 12;
    window.displayedProductsCount = 0;
    window.isLoadingMoreProducts = false;
    window.hasMoreProducts = false;
    window.productObserver = null;
    window.currentSearchTerm = '';
    window.currentPage = 1;
    window.isFetchingProducts = false;
    window._productScrollAttached = false;
    window._renderingProducts = false; // حارس يمنع تكرار renderProductsInitial
    window._pendingProductsRefresh = false; // علامة: يوجد تحديث معلق ينتظر انتهاء الرسم الحالي
    let productFilterTimer = null;

    // ===== حقن واجهة قائمة المنتجات ديناميكياً =====
    window.ensureProductsHTML = function () {
        const mgtSec = document.getElementById('management');
        if (!mgtSec) return;

        // إزالة هيكل التحميل الذي يضيفه تبديل التبويب قبل إنشاء قائمة المنتجات.
        mgtSec.querySelectorAll(':scope > .section-skeleton').forEach(skeleton => skeleton.remove());

        if (!document.getElementById('product-list-view')) {
            const html = `
            <div id="product-list-view">
                 <div style="display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; background: var(--bg-solid); padding: 14px; border-radius: var(--radius-lg); border: 1px solid var(--border-glass); box-shadow: var(--shadow-sm);">
                    <div class="input-group" style="flex:1; min-width:180px; flex-direction: row; align-items: center; position: relative;">
                        <i class="fas fa-search" style="position: absolute; right: 14px; color: var(--text-muted);"></i>
                        <input type="text" id="search-p" class="modern-input" placeholder="ابحث في منتجاتك..." onkeyup="filterP()" style="padding-right: 38px; padding-top: 9px; padding-bottom: 9px;">
                    </div>
                    <button class="btn-main" onclick="showProductForm()" style="width:auto; padding: 9px 14px; font-size:0.9rem;"><i class="fas fa-plus"></i> منتج جديد</button>
                    <button class="btn-main" onclick="showCategoryManager()" style="width:auto; padding: 9px 14px; font-size:0.9rem; background:var(--bg-body); color:var(--primary); border:1px solid var(--primary); box-shadow:none;"><i class="fas fa-tags"></i> إدارة الفئات</button>
                </div>
                <div class="products-grid" id="p-grid"></div>
            </div>`;
            mgtSec.insertAdjacentHTML('afterbegin', html);
            window.bindProductGridEvents();
        }
    };

    // ===== التحقق من صحة صيغة الصورة =====
    window.validateImageSignature = function (file, callback) {
        if (!file) return callback(false);
        const reader = new FileReader();
        reader.onloadend = function (e) {
            if (e.target.readyState === FileReader.DONE) {
                const arr = (new Uint8Array(e.target.result)).subarray(0, 12);
                let header = "";
                for (let i = 0; i < arr.length; i++) header += arr[i].toString(16).toUpperCase().padStart(2, '0');

                let isValid = false;
                if (header.startsWith("FFD8FF") || header.startsWith("89504E47") || (header.startsWith("52494646") && header.substring(16, 24) === "57454250") || header.startsWith("47494638")) isValid = true;
                callback(isValid);
            }
        };
        reader.readAsArrayBuffer(file.slice(0, 12));
    };

    // ===== جلب اسم الفئة للمنتج =====
    window.getCategoryDisplayName = function (categoryId) {
        if (categoryId === null || categoryId === undefined || categoryId === '') return 'عام';
        const list = window.flatCategoriesList || [];
        if (list.length === 0) return null;
        const byId = {};
        list.forEach(c => { byId[String(c.id)] = c; });
        const chain = [];
        let current = byId[String(categoryId)];
        let guard = 0;
        while (current && guard < 10) {
            chain.unshift(current.name);
            current = current.parent_id ? byId[String(current.parent_id)] : null;
            guard++;
        }
        return chain.length > 0 ? chain.join(' > ') : 'عام';
    };

    window.refreshProductCategoryNames = function () {
        const products = window.AppStore.getProducts();
        if (!products || products.length === 0) return;
        let changed = false;
        products.forEach(p => {
            const resolved = window.getCategoryDisplayName(p.category_id);
            if (resolved !== null && resolved !== p.type) { p.type = resolved; changed = true; }
        });
        if (changed) {
            window.AppStore.setProducts(products);
            if (typeof window.filterP === 'function') window.filterP();
        }
    };

    // ===== الحصول على المنتجات المفلترة بحسب نص البحث =====
    window.getFilteredMerchantProducts = function () {
        const all = window.AppStore ? (window.AppStore.getProducts() || []) : [];
        const term = (window.currentSearchTerm || '').trim().toLowerCase();
        if (!term) return all;
        return all.filter(p =>
            (p.name && p.name.toLowerCase().includes(term)) ||
            (p.mainDescription && p.mainDescription.toLowerCase().includes(term)) ||
            (p.type && p.type.toLowerCase().includes(term))
        );
    };

    // ===== إظهار أو إخفاء مؤشر التحميل التدريجي =====
    window.showProductsInfiniteLoader = function (show) {
        const sentinel = document.getElementById('scroll-anchor');
        if (!sentinel) return;
        if (show) {
            sentinel.style.display = 'flex';
            sentinel.innerHTML = `
                <div style="display:inline-flex; align-items:center; gap:10px; padding:10px 22px; background:var(--bg-solid); border:1px solid var(--primary-glow); border-radius:50px; box-shadow:var(--shadow-hover); color:var(--primary); font-size:0.88rem; font-weight:800;">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <span>جاري تحميل المزيد بالتدريج...</span>
                </div>`;
        }
    };

    // ===== تحديث واجهة نهاية القائمة / زر عرض المزيد =====
    window.updateProductsScrollSentinel = function (hasMore, totalCount) {
        const sentinel = document.getElementById('scroll-anchor');
        if (!sentinel) return;

        if (totalCount === 0) {
            sentinel.style.display = 'none';
            sentinel.innerHTML = '';
            return;
        }

        sentinel.style.display = 'flex';
        if (hasMore) {
            sentinel.innerHTML = `
                <div class="scroll-more-pill" onclick="window.loadNextProductsChunk()" style="cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:10px 22px; background:var(--bg-solid); border:1px solid var(--border-glass); border-radius:50px; box-shadow:var(--shadow-sm); color:var(--text-muted); font-size:0.85rem; font-weight:800; transition:all 0.2s ease;">
                    <i class="fas fa-chevron-down" style="color:var(--primary);"></i>
                    <span>مرر لعرض المزيد (معروض ${window.displayedProductsCount} من ${totalCount})</span>
                </div>`;
            // لا تستدعي setupProductObserver هنا — يتولى ذلك loadNextProductsChunk
        } else {
            sentinel.innerHTML = `
                <div style="padding:16px; color:var(--text-muted); font-size:0.85rem; font-weight:800; display:inline-flex; align-items:center; gap:8px;">
                    <i class="fas fa-check-circle" style="color:var(--success);"></i>
                    <span>تم عرض جميع المنتجات بالكامل (${totalCount} منتج)</span>
                </div>`;
            if (window.productObserver) {
                try { window.productObserver.disconnect(); } catch (e) { }
                window.productObserver = null;
            }
        }
    };

    // ===== تحميل دفعة جديدة بالتدريج عند التمرير =====
    window.loadNextProductsChunk = function (onDone) {
        if (window.isLoadingMoreProducts) {
            if (onDone) onDone();
            return;
        }

        const allFiltered = window.getFilteredMerchantProducts();
        const total = allFiltered.length;

        if (window.displayedProductsCount >= total) {
            window.hasMoreProducts = false;
            window.updateProductsScrollSentinel(false, total);
            if (onDone) onDone();
            return;
        }

        window.isLoadingMoreProducts = true;
        window.showProductsInfiniteLoader(true);

        setTimeout(() => {
            const nextBatch = allFiltered.slice(
                window.displayedProductsCount,
                window.displayedProductsCount + window.PRODUCTS_CHUNK_SIZE
            );

            const grid = document.getElementById('p-grid');
            if (grid && nextBatch.length > 0) {
                const frag = document.createDocumentFragment();
                for (let i = 0; i < nextBatch.length; i++) {
                    frag.appendChild(window._buildCard(nextBatch[i]));
                }
                grid.appendChild(frag);
                window.displayedProductsCount += nextBatch.length;
            }

            window.isLoadingMoreProducts = false;
            window.hasMoreProducts = window.displayedProductsCount < total;
            window.updateProductsScrollSentinel(window.hasMoreProducts, total);

            if (window.hasMoreProducts) {
                window.setupProductObserver();
            }

            if (onDone) onDone();
        }, 80);
    };


    // ===== مراقب التمرير اللانهائي (IntersectionObserver + Scroll Listener الاحتياطي) =====
    window.setupProductObserver = function () {
        const sentinel = document.getElementById('scroll-anchor');
        if (!sentinel) return;

        if (window.productObserver) {
            try { window.productObserver.disconnect(); } catch (e) { }
            window.productObserver = null;
        }

        // 1. استخدام IntersectionObserver
        try {
            window.productObserver = new IntersectionObserver((entries) => {
                if (entries[0] && entries[0].isIntersecting && window.hasMoreProducts && !window.isLoadingMoreProducts) {
                    window.loadNextProductsChunk();
                }
            }, { root: null, rootMargin: '200px', threshold: 0.1 });

            window.productObserver.observe(sentinel);
        } catch (e) {
            console.warn('IntersectionObserver غير متاح:', e);
        }

        // 2. فحص فوري: إذا كان السنتينل بالفعل ظاهراً على الشاشة (مثلاً 12 كرت لا تملأ الشاشة)، حمّل الدفعة التالية تلقائياً!
        setTimeout(() => {
            const sentinelEl = document.getElementById('scroll-anchor');
            if (sentinelEl && sentinelEl.style.display !== 'none' && window.hasMoreProducts && !window.isLoadingMoreProducts) {
                const rect = sentinelEl.getBoundingClientRect();
                const winH = window.innerHeight || document.documentElement.clientHeight;
                if (rect.top <= winH + 300) {
                    window.loadNextProductsChunk();
                }
            }
        }, 120);

        // 3. مراقب تمرير احتياطي على نافذة المتصفح لضمان العمل على جميع الشاشات والهواتف
        if (!window._productScrollAttached) {
            window._productScrollAttached = true;
            let scrollThrottle = false;
            const handleScroll = () => {
                if (scrollThrottle) return;
                scrollThrottle = true;
                setTimeout(() => { scrollThrottle = false; }, 80);

                const mgtSec = document.getElementById('management');
                if (!mgtSec || mgtSec.style.display === 'none') return;
                if (!window.hasMoreProducts || window.isLoadingMoreProducts) return;

                const sentinelEl = document.getElementById('scroll-anchor');
                if (sentinelEl && sentinelEl.style.display !== 'none') {
                    const rect = sentinelEl.getBoundingClientRect();
                    const winH = window.innerHeight || document.documentElement.clientHeight;
                    const docH = document.documentElement.scrollHeight;
                    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

                    if (rect.top <= winH + 400 || (scrollY + winH) >= (docH - 400)) {
                        window.loadNextProductsChunk();
                    }
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('touchmove', handleScroll, { passive: true });
        }
    };

    // ===== بدء عرض المنتجات وإعادة التهيئة التدريجية =====
    window.renderProductsInitial = function () {
        window.ensureProductsHTML();
        const g = document.getElementById('p-grid');
        if (!g) return;

        // إذا كان الرسم جارياً، احفظ طلب التحديث كـ"معلق" بدلاً من تجاهله كلياً
        if (window._renderingProducts) {
            window._pendingProductsRefresh = true;
            return;
        }
        window._renderingProducts = true;
        window._pendingProductsRefresh = false;

        g.innerHTML = '';
        window.displayedProductsCount = 0;
        window.isLoadingMoreProducts = false;

        const allFiltered = window.getFilteredMerchantProducts();
        if (allFiltered.length === 0) {
            g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:35px;border:1px dashed var(--border-glass);border-radius:16px;color:var(--text-muted);"><i class="fas fa-store-slash" style="font-size:2.2rem;opacity:.4;margin-bottom:10px;display:block"></i><p style="font-weight:800;">لا توجد منتجات، قم بإضافة منتجك الأول.</p></div>';
            window.updateProductsScrollSentinel(false, 0);
            window._renderingProducts = false;
            return;
        }

        // تأكد من وجود scroll-anchor بعد شبكة المنتجات
        if (!document.getElementById('scroll-anchor')) {
            g.insertAdjacentHTML('afterend', '<div id="scroll-anchor" style="width:100%;min-height:60px;display:flex;justify-content:center;align-items:center;margin:20px 0;"></div>');
        }

        // تحميل الدفعة الأولى فوراً، ثم رفع الحارس وفحص إن كان ثمة تحديث معلق
        window.loadNextProductsChunk(() => {
            window._renderingProducts = false;
            // إذا وصل تحديث جديد من الخادم أثناء الرسم، أعد الرسم الآن بالبيانات الجديدة
            if (window._pendingProductsRefresh) {
                window._pendingProductsRefresh = false;
                window.renderProductsInitial();
            }
        });
    };


    // ===== جلب المنتجات من الخادم =====
    window.loadAllFromJson = async function (page = 1, term = '', isAppending = false, isSilent = false, forceDb = false) {
        window.ensureProductsHTML();
        window.dashboardReadState = window.dashboardReadState || {};
        window.dashboardReadPromises = window.dashboardReadPromises || {};
        if (window.isFetchingProducts) return;
        window.isFetchingProducts = true;

        try {
            if ((typeof window.isDashboardRealtimeReady === 'function' && window.isDashboardRealtimeReady())
                || window.dashboardReadState.products) {
                window.renderProductsInitial();
                return;
            }
            const apiRes = await window.apiReq('list_products', { page: 1, limit: 1000, term: '' }, 'POST', false, true);

            let rawList = null;
            if (apiRes && (apiRes.status === 'success' || !apiRes.status || apiRes.status === 'ok')) {
                if (Array.isArray(apiRes.data)) {
                    rawList = apiRes.data;
                } else if (Array.isArray(apiRes.products)) {
                    rawList = apiRes.products;
                } else if (apiRes.data && Array.isArray(apiRes.data.products)) {
                    rawList = apiRes.data.products;
                } else if (apiRes.data && Array.isArray(apiRes.data.results)) {
                    rawList = apiRes.data.results;
                } else if (Array.isArray(apiRes)) {
                    rawList = apiRes;
                }
            }

            if (rawList !== null) {
                const fetchedProducts = rawList.map(p => {
                    let parsedOptions = [];
                    if (Array.isArray(p.options)) {
                        parsedOptions = p.options;
                    } else if (typeof p.options === 'string' && p.options.trim()) {
                        try { parsedOptions = JSON.parse(p.options); } catch (e) { parsedOptions = []; }
                        if (!Array.isArray(parsedOptions)) parsedOptions = [];
                    }

                    const pid = String(p.id || p.product_id || p.global_product_id || '');
                    const catName = p.type || p.category_name || (typeof window.getCategoryDisplayName === 'function' ? window.getCategoryDisplayName(p.category_id) : null) || 'عام';

                    return {
                        id: pid,
                        // معرّف المنتج القديم هو المعرّف الأساسي؛ يجب أن يتطابق
                        // مع المعرّف المستخدم في التعديل والحذف وبطاقات القائمة.
                        global_product_id: String(p.id || p.global_product_id || p.product_id || pid),
                        name: p.name || p.product_name || 'منتج بدون اسم',
                        mainDescription: p.description || p.mainDescription || '',
                        price: parseFloat(p.price) || 0,
                        cost_price: parseFloat(p.cost_price) || 0,
                        discount: parseFloat(p.discount) || 0,
                        image: p.image || p.image_url || '',
                        category_id: p.category_id ?? null,
                        type: catName,
                        options: parsedOptions,
                        quantity: p.quantity_type === 'unlimited' ? 9999 : (parseInt(p.quantity, 10) || 0),
                        quantity_type: p.quantity_type || 'tracked',
                        is_available: (p.is_available == 1 || p.is_available === true || p.is_available === '1'),
                        currency: p.currency || 'YER',
                        updated_at: p.updated_at || Date.now(),
                        approval_status: p.approval_status || 'approved'
                    };
                });

                fetchedProducts.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
                // setProducts يُطلق products_init subscriber الذي يتولى استدعاء renderProductsInitial تلقائياً
                // لا تستدعي renderProductsInitial هنا لتجنب Race Condition
                window.AppStore.setProducts(fetchedProducts);
                window.dashboardReadState.products = true;
            } else {
                throw new Error(apiRes?.message || 'فشل استرجاع البيانات من قاعدة البيانات');
            }

        } catch (error) {
            console.error('خطأ جلب المنتجات:', error);
            const grid = document.getElementById('p-grid');
            if (grid && (!window.AppStore.getProducts() || window.AppStore.getProducts().length === 0)) {
                grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:35px 20px; border:1px dashed var(--border-glass); border-radius:16px; color:var(--text-muted);">
                    <i class="fas fa-exclamation-circle" style="font-size:2.2rem; color:var(--danger); opacity:0.7; margin-bottom:10px; display:block;"></i>
                    <p style="font-weight:800; margin-bottom:10px;">تعذر تحميل المنتجات (${window.escapeHTML(error.message || 'خطأ غير معروف')})</p>
                    <button class="btn-main" onclick="loadAllFromJson(1, '', false, false, true)" style="width:auto; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:0.85rem;">
                        <i class="fas fa-redo"></i> إعادة المحاولة
                    </button>
                </div>`;
            } else if (!isSilent) {
                window.showT('تعذر تحديث المنتجات من الخادم', 'warning');
            }
        } finally {
            window.isFetchingProducts = false;
        }
    };


    // ===== قالب بطاقة المنتج =====
    const _CARD_TEMPLATE = (() => {
        const t = document.createElement('template');
        t.innerHTML = `<div class="product-card" data-pid="">
            <div class="p-image-wrapper">
                <img class="p-image" width="400" height="180" loading="lazy" decoding="async" fetchpriority="low" src="" alt="">
                <div class="publish-badge live" id=""><i class="fas fa-check-circle"></i> بالمتجر</div>
            </div>
            <div class="p-details">
                <div class="p-cat"><i class="fas fa-tag"></i> <span class="_cat"></span></div>
                <div class="p-name _name"></div>
                <div class="p-price-row">
                    <div class="_price"></div>
                    <div class="p-stock _stock"></div>
                </div>
                <div class="p-actions">
                    <button class="btn-sm btn-edit" data-pid="" title="تعديل"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-qr" data-pid="" title="مشاركة وباركود"><i class="fas fa-qrcode"></i></button>
                    <button class="btn-sm btn-del" data-pid="" title="حذف"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`;
        return t;
    })();

    window._buildCard = function (p) {
        const node = _CARD_TEMPLATE.content.cloneNode(true);
        const card = node.querySelector('.product-card');
        const pId = String(p.global_product_id || p.id || p.product_id || '');
        card.id = 'p-card-' + pId;
        card.dataset.pid = pId;
        if (p.is_syncing) card.classList.add('is-syncing');

        const img = card.querySelector('.p-image');
        if (img) {
            img.alt = p.name || 'صورة المنتج';
            img.src = window.getValidImageUrl(p.image);
            img.onerror = function () { this.onerror = null; this.src = window.PLACEHOLDER_IMG; };
        }

        const wrapper = card.querySelector('.p-image-wrapper');
        if (wrapper) {
            if (p.approval_status === 'pending') {
                const sb = document.createElement('button');
                sb.className = 'p-status inactive';
                sb.style.background = 'var(--warning)';
                sb.innerHTML = '<i class="fas fa-clock"></i> قيد المراجعة';
                wrapper.insertBefore(sb, wrapper.firstChild);
            } else if (p.approval_status === 'rejected') {
                const sb = document.createElement('button');
                sb.className = 'p-status inactive';
                sb.style.background = 'var(--danger)';
                sb.innerHTML = '<i class="fas fa-ban"></i> مرفوض';
                wrapper.insertBefore(sb, wrapper.firstChild);
            }
            const discount = parseFloat(p.discount) || 0;
            if (discount > 0) {
                const db = document.createElement('div');
                db.className = 'p-status';
                db.style.cssText = 'background:var(--danger);left:auto;right:10px;';
                db.textContent = 'خصم ' + discount + '%';
                wrapper.appendChild(db);
            }
        }

        const syncBadge = card.querySelector('.publish-badge');
        if (syncBadge) {
            syncBadge.id = 'sync-badge-' + pId;
            if (p.is_syncing) {
                syncBadge.className = 'publish-badge syncing';
                syncBadge.style.fontSize = '0.65rem';
                syncBadge.innerHTML = '<i class="fas fa-sync fa-spin"></i> النشر جاري...';
            }
        }

        const catEl = card.querySelector('._cat');
        if (catEl) catEl.textContent = p.type || 'عام';

        const nameEl = card.querySelector('._name');
        if (nameEl) nameEl.textContent = p.name || '';

        const discount = parseFloat(p.discount) || 0;
        const basePrice = parseFloat(p.price) || 0;
        const priceEl = card.querySelector('._price');
        if (priceEl) {
            if (discount > 0) {
                const fp = basePrice * (1 - discount / 100);
                priceEl.innerHTML = '<span class="p-price" style="color:var(--danger);font-size:1.1rem">' + fp.toLocaleString() + ' <small>' + window.escapeHTML(p.currency || 'YER') + '</small></span><span style="text-decoration:line-through;color:var(--text-muted);font-size:.8rem;display:block">' + basePrice.toLocaleString() + '</span>';
            } else {
                priceEl.innerHTML = '<span class="p-price">' + basePrice.toLocaleString() + ' <small>' + window.escapeHTML(p.currency || 'YER') + '</small></span>';
            }
        }

        const stockEl = card.querySelector('._stock');
        if (stockEl) {
            let optionsList = [];
            if (Array.isArray(p.options)) {
                optionsList = p.options;
            } else if (typeof p.options === 'string' && p.options.trim()) {
                try { optionsList = JSON.parse(p.options); } catch (e) { optionsList = []; }
                if (!Array.isArray(optionsList)) optionsList = [];
            }

            if (optionsList.length > 0) {
                if (optionsList.some(o => o && o.quantity_type === 'unlimited')) {
                    stockEl.innerHTML = '<i class="fas fa-box"></i> <strong class="unlimited"><i class="fas fa-infinity"></i></strong>';
                } else {
                    stockEl.innerHTML = '<i class="fas fa-box"></i> <strong>' + optionsList.reduce((s, o) => s + (parseInt(o?.quantity, 10) || 0), 0) + '</strong>';
                }
            } else {
                const isUnl = p.quantity_type === 'unlimited';
                const qtyVal = parseInt(p.quantity, 10) || 0;
                stockEl.innerHTML = '<i class="fas fa-box"></i> <strong class="' + (isUnl ? 'unlimited' : '') + '">' + (isUnl ? '<i class="fas fa-infinity"></i>' : qtyVal) + '</strong>';
            }
        }

        const btnEdit = card.querySelector('.btn-edit');
        if (btnEdit) btnEdit.dataset.pid = pId;
        const btnQr = card.querySelector('.btn-qr');
        if (btnQr) btnQr.dataset.pid = pId;
        const btnDel = card.querySelector('.btn-del');
        if (btnDel) btnDel.dataset.pid = pId;

        return card;
    };

    // ===== رسم شبكة المنتجات =====
    window.renderProductsGrid = function (productsToRender, isAppending = false, onDone = null) {
        window.ensureProductsHTML();
        const g = document.getElementById('p-grid');
        if (!g) return;
        if (!isAppending) {
            g.innerHTML = '';
            window.displayedProductsCount = 0;
        }

        if (productsToRender.length === 0 && !isAppending) {
            g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:35px;border:1px dashed var(--border-glass);border-radius:16px;color:var(--text-muted);"><i class="fas fa-store-slash" style="font-size:2.2rem;opacity:.4;margin-bottom:10px;display:block"></i><p style="font-weight:800;">لا توجد منتجات، قم بإضافة منتجك الأول.</p></div>';
            window.updateProductsScrollSentinel(false, 0);
            if (onDone) onDone();
            return;
        }

        // رسم الكروت
        const frag = document.createDocumentFragment();
        for (let i = 0; i < productsToRender.length; i++) {
            frag.appendChild(window._buildCard(productsToRender[i]));
        }
        g.appendChild(frag);
        g.style.opacity = '1';
        window.displayedProductsCount = g.querySelectorAll('.product-card').length;

        // تأكد من وجود scroll-anchor بعد الـ grid دائماً
        if (!document.getElementById('scroll-anchor')) {
            g.insertAdjacentHTML('afterend', '<div id="scroll-anchor" style="width:100%;min-height:60px;display:flex;justify-content:center;align-items:center;margin:20px 0;"></div>');
        }

        const allFiltered = window.getFilteredMerchantProducts();
        window.hasMoreProducts = window.displayedProductsCount < allFiltered.length;
        window.updateProductsScrollSentinel(window.hasMoreProducts, allFiltered.length);

        // إعادة تفعيل المراقب بعد كل رسم، بما في ذلك الرسم المباشر من الذاكرة
        // عند فتح تبويب المنتجات بعد الانتقال من تبويب آخر.
        requestAnimationFrame(() => {
            if (window.hasMoreProducts && !window.isLoadingMoreProducts) {
                window.setupProductObserver();
            }
            if (onDone) onDone();
        });
    };

    // ===== البحث والتصفية التدريجية =====
    window.filterP = function () {
        window.ensureProductsHTML();
        const searchInput = document.getElementById('search-p');
        window.currentSearchTerm = searchInput ? searchInput.value.trim() : '';
        if (productFilterTimer) clearTimeout(productFilterTimer);
        productFilterTimer = setTimeout(() => {
            productFilterTimer = null;
            window.renderProductsInitial();
        }, window.dashboardPerformanceMode === 'light' ? 180 : 100);
    };

    // ===== حذف منتج مع التحقق الصارم المسبق =====
    window.opnDel = function (id) {
        if (!id || id === 'undefined' || id === 'null' || !String(id).trim()) {
            window.showT('خطأ: معرف المنتج غير محدد', 'error');
            return;
        }

        const product = window.AppStore ? window.AppStore.findProduct(id) : null;
        if (!product) {
            window.showT('المنتج غير موجود أو تم حذفه مسبقاً', 'warning');
            return;
        }

        const safeProdName = window.escapeHTML(product.name || 'هذا المنتج');

        window.showSmartConfirm({
            title: 'حذف المنتج',
            msg: `هل أنت متأكد من حذف "${safeProdName}" نهائياً من متجرك؟ لا يمكن التراجع عن هذه الخطوة.`,
            icon: 'fa-trash-alt',
            type: 'danger',
            confirmText: 'نعم، احذف',
            onConfirm: async () => {
                window.showT('جاري الحذف...', 'info');
                try {
                    const res = await window.apiReq('delete_product', { id: String(id), product_id: String(id) });
                    if (res && res.status === 'success') {
                        window.showT(res.message || 'تم حذف المنتج بنجاح', 'success');
                        window.AppStore.removeProduct(id);
                    } else {
                        window.showT(res?.message || 'فشل حذف المنتج، يرجى المحاولة لاحقاً', 'error');
                    }
                } catch (error) {
                    window.showT('حدث خطأ أثناء الاتصال بالخادم', 'error');
                }
            }
        });
    };

    // ===== تفويض الأحداث على شبكة المنتجات =====
    window.bindProductGridEvents = function () {
        const grid = document.getElementById('p-grid');
        if (grid && !grid.dataset.eventsBound) {
            grid.dataset.eventsBound = '1';
            grid.addEventListener('click', async function (e) {
                const edit = e.target.closest('.btn-edit');
                const qr = e.target.closest('.btn-qr');
                const del = e.target.closest('.btn-del');
                if (edit) {
                    const pid = edit.dataset.pid;
                    if (!pid || pid === 'undefined') {
                        window.showT('معرف المنتج غير صالح', 'error');
                        return;
                    }
                    await window.ModuleLoader.load('product-form');
                    const p = window.AppStore.findProduct(pid);
                    if (p && typeof window.editProduct === 'function') {
                        window.editProduct(p);
                    } else {
                        window.showT('المنتج المطلوب تعديله غير موجود', 'warning');
                    }
                } else if (qr) {
                    const pid = qr.dataset.pid;
                    if (!pid || pid === 'undefined') {
                        window.showT('معرف المنتج غير صالح', 'error');
                        return;
                    }
                    await window.ModuleLoader.load('qr-modal');
                    const p = window.AppStore.findProduct(pid);
                    if (p && typeof window.showProductQRModal === 'function') {
                        window.showProductQRModal(p);
                    } else {
                        window.showT('المنتج غير موجود', 'warning');
                    }
                } else if (del) {
                    e.preventDefault();
                    e.stopPropagation();
                    const pid = del.dataset.pid;
                    if (!pid || pid === 'undefined') {
                        window.showT('معرف المنتج غير صالح للحذف', 'error');
                        return;
                    }
                    window.opnDel(pid);
                }
            });
        }
    };

    // ربط اشتراكات AppStore بالواجهة
    window.AppStore.subscribe('products_init', (products) => {
        const mgtSec = document.getElementById('management');
        if (mgtSec && mgtSec.style.display !== 'none' && mgtSec.classList.contains('active')) {
            // دائماً أعد الرسم عند تحديث المنتجات — الحارس _renderingProducts يمنع التكرار
            window.renderProductsInitial();
        }
    });

    window.AppStore.subscribe('product_added', (p) => {
        window.ensureProductsHTML();
        const grid = document.getElementById('p-grid');
        if (!grid) return;
        if (grid.querySelector('.fa-store-slash') || grid.innerHTML.includes('لا توجد')) grid.innerHTML = '';
        grid.insertBefore(window._buildCard(p), grid.firstChild);
    });
    window.AppStore.subscribe('product_updated', (p) => {
        const card = document.getElementById(`p-card-${p.global_product_id || p.id}`);
        if (card) { card.replaceWith(window._buildCard(p)); }
    });
    window.AppStore.subscribe('product_removed', (id) => {
        const card = document.getElementById(`p-card-${id}`);
        if (card) {
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                if (window.AppStore.getProductsCount() === 0) window.filterP();
            }, 300);
        }
    });

    window.ensureProductsHTML();

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('products');

})();
