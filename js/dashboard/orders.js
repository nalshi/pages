/**
 * orders.js — إدارة الطلبات، كروت خفيفة سريعة، وكرت تفاصيل موحد (Single Reusable Detail Card)
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    let currentOrdersLimit = 25;
    let renderedOrdersState = null;
    let ordersSearchTerm = '';
    window.currentViewingOrderId = null;

    // ===== حقن واجهة قسم الطلبات والنافذة الموحدة ديناميكياً =====
    window.ensureOrdersHTML = function () {
        const ordersSec = document.getElementById('orders');
        if (!ordersSec) return;

        if (!document.getElementById('orders-container')) {
            const html = `
            <div class="card-4d" style="padding: 20px;">
                <div class="card-header" style="font-size: 1.25rem;"><i class="fas fa-shopping-basket"></i> إدارة الطلبات والتوصيل</div>
                <div class="orders-toolbar">
                    <div class="orders-search">
                        <i class="fas fa-search"></i>
                        <input id="orders-search-input" type="search" placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..." autocomplete="off">
                    </div>
                    <div class="segment-group orders-filter">
                    <button class="segment-btn active" onclick="loadOrders('active', this)"><i class="fas fa-bolt"></i> النشطة</button>
                    <button class="segment-btn" onclick="loadOrders('archived', this)"><i class="fas fa-clock-rotate-left"></i> السابقة</button>
                    </div>
                </div>
                <div id="orders-container" class="orders-list-compact">
                    <div class="section-skeleton" style="padding: 10px 0;">
                        <div class="sk-card"><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><div class="sk-shimmer sk-bar" style="width:130px;"></div><div class="sk-shimmer" style="width:70px;height:24px;border-radius:12px;"></div></div><div class="sk-shimmer sk-bar" style="width:55%;margin-bottom:10px;"></div><div class="sk-shimmer sk-bar-sm"></div></div>
                        <div class="sk-card"><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><div class="sk-shimmer sk-bar" style="width:150px;"></div><div class="sk-shimmer" style="width:70px;height:24px;border-radius:12px;"></div></div><div class="sk-shimmer sk-bar" style="width:65%;margin-bottom:10px;"></div><div class="sk-shimmer sk-bar-sm"></div></div>
                    </div>
                </div>
            </div>`;
            ordersSec.innerHTML = html;
            const searchInput = document.getElementById('orders-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (event) => {
                    ordersSearchTerm = event.target.value.trim().toLowerCase();
                    currentOrdersLimit = 25;
                    renderedOrdersState = null;
                    const activeFilter = window._lastOrdersFilter || 'active';
                    window.renderOrdersUI(window.AppStore.getOrders(activeFilter), activeFilter);
                });
            }
        }

        // حقن نافذة كرت تفاصيل الطلب الموحدة مرة واحدة فقط في الـ DOM
        if (!document.getElementById('single-order-detail-modal')) {
            const modalHtml = `
            <div class="modal" id="single-order-detail-modal">
                <div class="modal-content order-detail-modal-content">
                    <div class="modal-title-bar" style="margin-bottom: 14px;">
                        <h3 id="m-detail-order-title"><i class="fas fa-receipt text-primary"></i> تفاصيل الطلب</h3>
                        <button class="close-btn" onclick="closeM('single-order-detail-modal')"><i class="fas fa-times"></i></button>
                    </div>
                    <div id="single-order-detail-body">
                        <!-- يُحقن محتوى كرت الطلب المحدد عند النقر في 0ms -->
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    };

    // ===== جلب الطلبات من الخادم مع الحفظ بالذاكرة =====
    window.loadOrders = async function (filterType, btnElement, silent = false) {
        window.dashboardReadState = window.dashboardReadState || {};
        window.dashboardReadPromises = window.dashboardReadPromises || {};
        window.ensureOrdersHTML();
        if (btnElement) {
            document.querySelectorAll('#orders .segment-btn').forEach(b => b.classList.remove('active'));
            btnElement.classList.add('active');
        }

        // إعادة ضبط حد العرض عند تبديل الفلتر
        if (window._lastOrdersFilter !== filterType) {
            currentOrdersLimit = 25;
            window._lastOrdersFilter = filterType;
        }

        const container = document.getElementById('orders-container');
        const ordersSection = document.getElementById('orders');
        const isOrdersTabActive = ordersSection && ordersSection.classList.contains('active');
        const hasRealtimeData = Boolean(window.dashboardSnapshotLoaded || window.dashboardReadState[filterType + 'Orders']);

        // عرض كاش الذاكرة فوراً (إن وجد) لمنع الوميض
        const cached = window.AppStore ? window.AppStore.getOrders(filterType) : [];
        if (cached && cached.length > 0 && isOrdersTabActive && container) {
            window.renderOrdersUI(cached, filterType);
        } else if (!hasRealtimeData && isOrdersTabActive && container) {
            container.innerHTML = `
                <div class="section-skeleton" style="padding: 10px 0;">
                    <div class="sk-card"><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><div class="sk-shimmer sk-bar" style="width:130px;"></div><div class="sk-shimmer" style="width:70px;height:24px;border-radius:12px;"></div></div><div class="sk-shimmer sk-bar" style="width:55%;margin-bottom:10px;"></div><div class="sk-shimmer sk-bar-sm"></div></div>
                    <div class="sk-card"><div style="display:flex;justify-content:space-between;margin-bottom:12px;"><div class="sk-shimmer sk-bar" style="width:150px;"></div><div class="sk-shimmer" style="width:70px;height:24px;border-radius:12px;"></div></div><div class="sk-shimmer sk-bar" style="width:65%;margin-bottom:10px;"></div><div class="sk-shimmer sk-bar-sm"></div></div>
                </div>
            `;
        } else if (hasRealtimeData && isOrdersTabActive && container) {
            window.renderOrdersUI(cached, filterType);
        }

        try {
            const readKey = filterType + 'Orders';
            // اللقطة اللحظية تعتبر مصدر البيانات حتى لو كانت القائمة فارغة؛
            // لا نعيد طلب get_orders عند كل دخول لقسم الطلبات.
            if (window.dashboardSocketReady || window.dashboardReadState[readKey]) return;
            if (window.dashboardReadPromises[filterType + 'Orders']) return window.dashboardReadPromises[filterType + 'Orders'];
            window.dashboardReadPromises[readKey] = window.apiReq('get_orders', { filter: filterType }, 'POST', false, true);
            const res = await window.dashboardReadPromises[readKey];
            delete window.dashboardReadPromises[readKey];
            let newOrders = [];

            if (res && res.status === 'success' && Array.isArray(res.data)) {
                newOrders = res.data;
            }
            window.dashboardReadState[readKey] = true;

            const prevOrders = window.AppStore.getOrders(filterType);

            // للأرشيف: نرتّب بـ setTimeout لعدم تجميد الـ UI Thread
            const doRender = (sorted) => {
                window.AppStore.setOrders(filterType, sorted);
                if (isOrdersTabActive && container) {
                    window.renderOrdersUI(sorted, filterType);
                }
            };

            if (filterType === 'archived') {
                // تأجيل الترتيب ليكون خارج الـ critical path
                setTimeout(() => {
                    newOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                    doRender(newOrders);
                }, 0);
            } else {
                newOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

                const prevIds = prevOrders.map(o => String(o.id));
                const hasNewOrder = newOrders.some(o => !prevIds.includes(String(o.id)));

                if (hasNewOrder && window.initialOrdersLoaded) {
                    const isNotifEnabled = window.currentMerchantData?.settings?.push_notifications;
                    if (isNotifEnabled !== false && isNotifEnabled !== 'false' && window.orderAudio) {
                        window.orderAudio.loop = true;
                        window.orderAudio.currentTime = 0;
                        window.orderAudio.play().catch(() => { });
                    }
                    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                        new Notification('طلب جديد واصل الآن! 🛍️', { body: 'لديك طلب جديد بانتظار التجهيز.', icon: '/favicon.svg' });
                    }
                    const alertBar = document.getElementById('persistent-order-alert');
                    if (alertBar) alertBar.classList.add('show');
                    const greenAlert = document.getElementById('new-order-alert');
                    if (greenAlert) greenAlert.classList.add('show');
                }

                doRender(newOrders);
            }

            window.initialOrdersLoaded = true;

        } catch (error) {
            console.error('خطأ جلب الطلبات:', error);
            if (isOrdersTabActive && container && (!cached || cached.length === 0)) {
                container.innerHTML = `<div style="text-align:center; padding:35px; color:var(--danger);"><i class="fas fa-exclamation-circle" style="font-size:2rem; margin-bottom:10px; display:block;"></i>تعذر جلب الطلبات. تحقق من الاتصال.</div>`;
            }
        }
    };

    // استخراج تفاصيل حالة الطلب
    function getStatusMeta(status) {
        switch (status) {
            case 'pending_merchant_approval':
                return { text: 'بانتظار موافقتك', badgeStyle: 'background:rgba(245, 158, 11, 0.12); color:var(--warning);', icon: 'fa-clock' };
            case 'confirmed_by_store':
                return { text: 'قيد التجهيز', badgeStyle: 'background:rgba(16, 185, 129, 0.12); color:var(--success);', icon: 'fa-box-open' };
            case 'out_for_delivery':
                return { text: 'في الطريق', badgeStyle: 'background:rgba(59, 130, 246, 0.12); color:var(--info);', icon: 'fa-motorcycle' };
            case 'completed':
                return { text: 'مكتمل بنجاح', badgeStyle: 'background:rgba(16, 185, 129, 0.12); color:var(--success);', icon: 'fa-circle-check' };
            case 'cancelled':
                return { text: 'طلب ملغي', badgeStyle: 'background:rgba(239, 68, 68, 0.12); color:var(--danger);', icon: 'fa-circle-xmark' };
            default:
                return { text: status, badgeStyle: 'background:var(--bg-body); color:var(--text-muted);', icon: 'fa-receipt' };
        }
    }

    // ===== رسم قائمة الطلبات المصغرة — تدريجي بـ chunks لمنع التجميد =====
    window.renderOrdersUI = function (data, filterType) {
        window.ensureOrdersHTML();
        const container = document.getElementById('orders-container');
        if (!container) return;

        if (!Array.isArray(data) || data.length === 0) {
            renderedOrdersState = null;
            container.innerHTML = `
            <div style="text-align:center; padding:45px 20px;">
                <div style="width: 65px; height: 65px; background: rgba(100, 116, 139, 0.08); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 14px;">
                    <i class="fas fa-shopping-basket" style="font-size: 1.8rem; color: var(--text-muted); opacity: 0.5;"></i>
                </div>
                <h3 style="font-weight: 900; font-size: 1.05rem; color: var(--text-main);">لا توجد طلبات في هذا القسم</h3>
            </div>`;
            return;
        }

        const filteredData = ordersSearchTerm
            ? data.filter(order => {
                const haystack = [
                    order.id,
                    order.customer_name,
                    order.customer_phone,
                    order.delivery_address_text
                ].map(value => String(value || '').toLowerCase()).join(' ');
                return haystack.includes(ordersSearchTerm);
            })
            : data;
        const dataToShow = filteredData.slice(0, currentOrdersLimit);
        if (filteredData.length === 0) {
            renderedOrdersState = null;
            container.innerHTML = `
                <div class="orders-empty-state">
                    <i class="fas fa-search"></i>
                    <h3>لا توجد نتائج مطابقة</h3>
                    <p>جرّب رقم طلب أو اسم عميل مختلف.</p>
                </div>`;
            return;
        }

        const ids = dataToShow.map(order => `${String(order.id)}:${String(order.status || '')}:${String(order.updated_at || '')}`);
        const stateKey = `${filterType}:${ordersSearchTerm}:${ids.join(',')}`;
        const previous = renderedOrdersState;
        if (previous && previous.filterType === filterType
            && previous.dataIds.length < ids.length
            && ids.slice(0, previous.dataIds.length).every((id, index) => id === previous.dataIds[index])) {
            const footer = document.getElementById('orders-load-more-wrap');
            if (footer) footer.remove();
            const fragment = document.createDocumentFragment();
            dataToShow.slice(previous.dataIds.length).forEach(order => {
                const template = document.createElement('template');
                template.innerHTML = buildCompactRow(order).trim();
                if (template.content.firstElementChild) fragment.appendChild(template.content.firstElementChild);
            });
            container.appendChild(fragment);
            renderedOrdersState = { filterType, dataIds: ids, stateKey };
            appendOrdersFooter(container, filteredData.length, filterType);
            return;
        }

        if (previous && previous.stateKey === stateKey) return;

        // بناء HTML بشكل متزامن (سريع لأن الكروت خفيفة)
        const rowsHtml = dataToShow.map(o => buildCompactRow(o)).join('');

        // كتابة HTML دفعة واحدة → يحسم الجمود
        container.innerHTML = rowsHtml;
        renderedOrdersState = { filterType, dataIds: ids, stateKey };
        appendOrdersFooter(container, filteredData.length, filterType);
    };

    function appendOrdersFooter(container, total, filterType) {
        if (total <= currentOrdersLimit) return;
        const footer = document.createElement('div');
        footer.id = 'orders-load-more-wrap';
        footer.style.cssText = 'text-align:center;margin-top:14px;';
        footer.innerHTML = `<button onclick="loadMoreOrders('${filterType}')" class="btn-main" style="width:auto;margin:0 auto;background:var(--bg-solid);color:var(--primary);border:2px solid var(--primary);box-shadow:none;padding:8px 18px;font-size:0.88rem;">عرض المزيد (${total - currentOrdersLimit}) <i class="fas fa-chevron-down"></i></button>`;
        container.appendChild(footer);
    }

    // بناء HTML لكرت طلب واحد (دالة مساعدة خفيفة)
    function buildCompactRow(o) {
        const statusMeta = getStatusMeta(o.status);
        const totalAmount = (parseFloat(o.total_amount) || 0).toLocaleString();
        const itemsCount = (o.items || []).reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
        const dateStr = o.created_at
            ? new Date(o.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '';
        const custName = window.escapeHTML(o.customer_name || 'عميل');
        const oid = String(o.id);
        const shortId = oid.substring(0, 8);
        const cur = window.escapeHTML(o.currency || 'YER');
        const itemWord = itemsCount === 1 ? 'منتج' : 'منتجات';

        return `<article class="order-card-compact" id="m-order-row-${oid}" onclick="openOrderDetail('${oid}')"><div class="order-compact-main"><div class="order-compact-icon"><i class="fas ${statusMeta.icon}"></i></div><div class="order-compact-info"><div class="order-compact-header-row"><span class="order-compact-id">#${shortId}</span><span class="order-compact-badge" style="${statusMeta.badgeStyle}">${statusMeta.text}</span></div><div class="order-compact-meta"><span><i class="fas fa-user text-primary" style="font-size:0.75rem;"></i> ${custName}</span><span>•</span><span>${itemsCount} ${itemWord}</span></div></div></div><div class="order-compact-right"><div class="order-compact-price-wrap"><span class="order-compact-price">${totalAmount} <small style="font-size:0.75rem;">${cur}</small></span><span class="order-compact-date">${dateStr}</span></div><button class="order-compact-btn-details" onclick="event.stopPropagation();openOrderDetail('${oid}')"><span>عرض التفاصيل</span><i class="fas fa-arrow-left" style="font-size:0.7rem;"></i></button></div></article>`;
    }

    window.loadMoreOrders = function (filterType) {
        currentOrdersLimit += 25;
        const data = window.AppStore.getOrders(filterType);
        window.renderOrdersUI(data, filterType);
        // تمرير ناعم لأسفل
        const wrap = document.getElementById('orders-load-more-wrap');
        if (wrap) wrap.scrollIntoView({
            behavior: window.dashboardPerformanceMode === 'light' ? 'auto' : 'smooth',
            block: 'center'
        });
    };



    // ===== فتح كرت التفاصيل الموحد الذكي (Single Reused Modal Card) =====
    window.openOrderDetail = function (orderId) {
        window.ensureOrdersHTML();
        window.currentViewingOrderId = String(orderId);

        // البحث عن الطلب في الذاكرة
        const allOrders = [...(window.AppStore.getOrders('active') || []), ...(window.AppStore.getOrders('archived') || [])];
        const o = allOrders.find(item => String(item.id) === String(orderId));

        if (!o) {
            window.showT('لم يتم العثور على بيانات الطلب', 'error');
            return;
        }

        const titleEl = document.getElementById('m-detail-order-title');
        if (titleEl) {
            titleEl.innerHTML = `<i class="fas fa-receipt text-primary"></i> طلب #${String(o.id).substring(0, 8)}`;
        }

        const bodyEl = document.getElementById('single-order-detail-body');
        if (!bodyEl) return;

        const statusMeta = getStatusMeta(o.status);

        // أزرار الإجراءات
        let actionButtons = '';
        switch (o.status) {
            case 'pending_merchant_approval':
                actionButtons = `
                <div style="display:flex; gap:8px;">
                    <button class="btn-main" style="background:var(--success); flex:2; padding:10px;" onclick="approveOrder('${o.id}'); closeM('single-order-detail-modal');">
                        <i class="fas fa-check"></i> موافقة وتجهيز
                    </button>
                    <button class="btn-main" style="background:rgba(239, 68, 68, 0.1); color:var(--danger); border:1px solid var(--danger); box-shadow:none; flex:1; padding:10px;" onclick="merchantCancelOrder('${o.id}'); closeM('single-order-detail-modal');">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>`;
                break;
            case 'confirmed_by_store':
                actionButtons = `
                <div style="display:flex; gap:8px;">
                    ${o.delivery_gps_link ? `<button class="btn-main" style="background:#0284c7; flex:1; padding:10px;" onclick="window.open('${o.delivery_gps_link}', '_blank');"><i class="fas fa-map-marker-alt"></i> الخريطة</button>` : ''}
                    <button class="btn-main" style="background:var(--success); flex:2; padding:10px;" onclick="markOrderOutForDelivery('${o.id}'); closeM('single-order-detail-modal');">
                        <i class="fas fa-motorcycle"></i> خرج للتوصيل
                    </button>
                </div>`;
                break;
            case 'out_for_delivery':
                actionButtons = `
                <div style="display:flex; gap:8px;">
                    ${o.delivery_gps_link ? `<button class="btn-main" style="background:#0284c7; flex:1; padding:10px;" onclick="window.open('${o.delivery_gps_link}', '_blank');"><i class="fas fa-map-marker-alt"></i> الخريطة</button>` : ''}
                    <button class="btn-main" style="background:var(--primary); flex:2; padding:10px;" onclick="closeM('single-order-detail-modal'); openDeliveryCodeModal('${o.id}');">
                        <i class="fas fa-key"></i> تأكيد كود الاستلام
                    </button>
                </div>`;
                break;
            default:
                actionButtons = '';
        }

        let totalCost = 0, productsTotalRevenue = 0;
        const itemsHtml = (o.items || []).map(i => {
            const itemSellingPrice = parseFloat(i.price) || 0;
            const itemCost = parseFloat(i.cost_price) || 0;
            const itemQty = parseInt(i.quantity) || 1;
            productsTotalRevenue += (itemSellingPrice * itemQty);
            totalCost += (itemCost * itemQty);
            // استخدم الصورة الأصلية داخل التفاصيل؛ محول الصور الخارجي يضيف
            // طلب شبكة وتأخيرًا لكل منتج عند فتح الطلب.
            const imgUrl = i.image || window.PLACEHOLDER_IMG;

            return `
            <div style="display:flex; gap:10px; margin-bottom:10px; padding-bottom:10px; border-bottom:1px dashed var(--border-glass); align-items:center;">
                <img width="48" height="48" loading="lazy" decoding="async" src="${window.escapeHTML(imgUrl)}" alt="${window.escapeHTML(i.product_name || i.name || 'منتج')}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid var(--border-glass);">
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:900; font-size:0.92rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${window.escapeHTML(i.product_name || i.name || 'منتج')}</div>
                    <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-top:3px;">
                        <span style="color:var(--text-muted);">الكمية: <b>${itemQty}</b></span>
                        <span style="color:var(--primary); font-weight:900;">${(itemSellingPrice * itemQty).toLocaleString()} ${window.escapeHTML(o.currency || 'YER')}</span>
                    </div>
                </div>
            </div>`;
        }).join('');

        const netProfit = productsTotalRevenue - totalCost;
        const profitBadge = (netProfit > 0 && o.status !== 'cancelled') ? `<span class="order-profit-badge"><i class="fas fa-arrow-trend-up"></i> ربحك الصافي: ${netProfit.toLocaleString()} ${window.escapeHTML(o.currency || 'YER')}</span>` : '';
        const deliveryFee = parseFloat(o.delivery_fee) || 0;
        const finalGrandTotal = productsTotalRevenue + deliveryFee;

        bodyEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:var(--bg-body); padding:10px 14px; border-radius:10px;">
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">تاريخ الطلب</span>
                    <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">${new Date(o.created_at).toLocaleString('ar-EG')}</div>
                </div>
                <div style="text-align:left;">
                    <span style="${statusMeta.badgeStyle} padding:4px 10px; border-radius:6px; font-weight:bold; font-size:0.82rem;">${statusMeta.text}</span>
                </div>
            </div>

            <!-- بيانات العميل والتوصيل -->
            <div style="background: rgba(37, 99, 235, 0.03); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-glass); margin-bottom: 14px;">
                <div style="font-weight: 900; margin-bottom: 8px; color: var(--primary); display: flex; align-items: center; gap: 6px; font-size: 0.88rem;">
                    <i class="fas fa-user-circle"></i> بيانات العميل والتوصيل:
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 800;">
                    <span style="color: var(--text-main); font-size: 0.95rem;">${window.escapeHTML(o.customer_name || 'عميل المتجر')}</span>
                    ${o.customer_phone ? `
                        <a href="tel:${o.customer_phone}" style="color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 6px; background: var(--bg-solid); padding: 5px 12px; border-radius: 8px; border: 1px solid var(--border-glass); font-size: 0.82rem; font-weight:800;">
                            <i class="fas fa-phone-alt" style="color:var(--success);"></i> ${window.escapeHTML(o.customer_phone)}
                        </a>
                    ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">بدون رقم</span>'}
                </div>
                ${o.delivery_address_text ? `
                    <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-top: 8px; font-weight: 700; border-top: 1px dashed var(--border-glass); padding-top: 8px;">
                        <i class="fas fa-map-marker-alt" style="color: var(--danger); margin-left: 4px;"></i> ${window.escapeHTML(o.delivery_address_text)}
                    </div>
                ` : ''}
            </div>

            <!-- قائمة المنتجات -->
            <div style="background:var(--bg-body); padding:12px 14px; border-radius:12px; margin-bottom:14px; max-height:220px; overflow-y:auto;">
                <div style="font-weight: 900; margin-bottom: 8px; color: var(--primary); font-size: 0.86rem;"><i class="fas fa-box-open"></i> قائمة المنتجات المطلوبة:</div>
                ${itemsHtml}
            </div>

            <!-- الملخص المالي والربح -->
            <div style="background: rgba(37, 99, 235, 0.04); padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(37, 99, 235, 0.1); margin-bottom: 14px;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; margin-bottom:4px;">
                    <span style="color:var(--text-muted);">إجمالي المنتجات:</span>
                    <span style="color:var(--text-main); font-weight:800;">${productsTotalRevenue.toLocaleString()} ${window.escapeHTML(o.currency || 'YER')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; margin-bottom:8px; border-bottom:1px dashed var(--border-glass); padding-bottom:6px;">
                    <span style="color:var(--text-muted);">رسوم التوصيل:</span>
                    <span style="color:var(--text-main); font-weight:800;">${deliveryFee === 0 ? 'مجاني' : deliveryFee.toLocaleString() + ' ' + window.escapeHTML(o.currency || 'YER')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:bold; display:block;">المبلغ الإجمالي المستحق:</span>
                        <span style="font-size:1.28rem; font-weight:900; color:var(--primary);">${finalGrandTotal.toLocaleString()} <small style="font-size:0.8rem;">${window.escapeHTML(o.currency || 'YER')}</small></span>
                    </div>
                    <div>${profitBadge}</div>
                </div>
            </div>

            <!-- أزرار الإجراءات -->
            <div>${actionButtons}</div>
        `;

        window.openM('single-order-detail-modal');
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('orders');

})();
