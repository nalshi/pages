/**
 * orders-actions.js — أفعال وإجراءات الطلبات (الموافقة، الإلغاء، التوصيل، التحديث الفوري)
 * يُحمَّل عند الحاجة (Lazy Loaded مع orders.js)
 */
(function () {
    'use strict';

    const orderActionInFlight = new Set();

    // ===== الموافقة على طلب مع التحقق والحماية =====
    window.approveOrder = async function (orderId) {
        if (!orderId || orderId === 'undefined' || orderId === 'null' || !String(orderId).trim()) {
            window.showT('خطأ: معرف الطلب غير محدد', 'error');
            return;
        }

        const idStr = String(orderId);
        if (orderActionInFlight.has(idStr)) {
            window.showT('جاري معالجة هذا الطلب بالفعل...', 'info');
            return;
        }

        const activeOrders = window.AppStore ? window.AppStore.getOrders('active') : [];
        const order = activeOrders.find(o => String(o.id) === idStr);
        if (!order) {
            window.showT('الطلب غير موجود في قائمة الطلبات النشطة', 'warning');
            return;
        }

        orderActionInFlight.add(idStr);
        window.showT('جاري الموافقة على الطلب...', 'info');

        try {
            const res = await window.apiReq('update_order_status', { ticket_id: idStr, status: 'confirmed_by_store' });
            if (res && res.status === 'success') {
                window.updateOrderCardInPlace(idStr, 'confirmed_by_store');
                window.showT(res.message || 'تمت الموافقة على الطلب وجاري التجهيز 👍', 'success');
            } else {
                window.showT(res?.message || 'فشل تحديث حالة الطلب', 'error');
                if (typeof window.loadOrders === 'function') {
                    window.loadOrders('active', document.querySelector('#orders .segment-btn.active'), true);
                }
            }
        } finally {
            orderActionInFlight.delete(idStr);
        }
    };

    // ===== خروج الطلب للتوصيل مع التحقق الصارم =====
    window.markOrderOutForDelivery = function (orderId) {
        if (!orderId || orderId === 'undefined' || orderId === 'null' || !String(orderId).trim()) {
            window.showT('خطأ: معرف الطلب غير محدد', 'error');
            return;
        }

        const idStr = String(orderId);
        const activeOrders = window.AppStore ? window.AppStore.getOrders('active') : [];
        const order = activeOrders.find(o => String(o.id) === idStr);
        if (!order) {
            window.showT('الطلب غير موجود أو تمت معالجته مسبقاً', 'warning');
            return;
        }

        window.showSmartConfirm({
            title: 'تأكيد خروج الطلب للتوصيل',
            msg: `هل تم تسليم الطلب #${idStr.substring(0, 8)} للمندوب وهو في طريقه للعميل الآن؟`,
            icon: 'fa-motorcycle',
            type: 'info',
            confirmText: 'نعم، خرج للتوصيل',
            onConfirm: async () => {
                if (orderActionInFlight.has(idStr)) return;
                orderActionInFlight.add(idStr);

                try {
                    const res = await window.apiReq('update_order_status', { ticket_id: idStr, status: 'out_for_delivery' });
                    if (res && res.status === 'success') {
                        window.updateOrderCardInPlace(idStr, 'out_for_delivery');
                        window.showT(res.message || 'تم تحديث حالة الطلب إلى "في الطريق" 🛵', 'success');
                    } else {
                        window.showT(res?.message || 'فشل تحديث حالة الطلب', 'error');
                        if (typeof window.loadOrders === 'function') {
                            window.loadOrders('active', document.querySelector('#orders .segment-btn.active'), true);
                        }
                    }
                } finally {
                    orderActionInFlight.delete(idStr);
                }
            }
        });
    };

    // ===== إلغاء الطلب من قبل التاجر =====
    window.merchantCancelOrder = function (orderId) {
        if (!orderId || orderId === 'undefined' || orderId === 'null' || !String(orderId).trim()) {
            window.showT('خطأ: معرف الطلب غير محدد', 'error');
            return;
        }

        const idStr = String(orderId);
        const activeOrders = window.AppStore ? window.AppStore.getOrders('active') : [];
        const order = activeOrders.find(o => String(o.id) === idStr);
        if (!order) {
            window.showT('الطلب غير موجود أو تم إلغاؤه مسبقاً', 'warning');
            return;
        }

        window.showSmartConfirm({
            title: 'إلغاء الطلب',
            msg: `هل أنت متأكد من رغبتك في إلغاء الطلب #${idStr.substring(0, 8)}؟`,
            icon: 'fa-times-circle',
            type: 'danger',
            confirmText: 'نعم، إلغاء الطلب',
            onConfirm: async () => {
                if (orderActionInFlight.has(idStr)) return;
                orderActionInFlight.add(idStr);

                try {
                    const res = await window.apiReq('cancel_order', { ticket_id: idStr, reason: 'تم الإلغاء من قبل المتجر' });
                    if (res && res.status === 'success') {
                        window.updateOrderCardInPlace(idStr, 'cancelled');
                        window.showT(res.message || 'تم إلغاء الطلب بنجاح', 'success');
                        setTimeout(() => {
                            if (typeof window.loadOrders === 'function') {
                                window.loadOrders('active', document.querySelector('#orders .segment-btn.active'), true);
                            }
                        }, 1200);
                    } else {
                        window.showT(res?.message || 'حدث خطأ أثناء إلغاء الطلب', 'error');
                    }
                } finally {
                    orderActionInFlight.delete(idStr);
                }
            }
        });
    };

    // ===== تحديث بطاقة الطلب في مكانها دون إعادة تحميل الصفحة =====
    window.updateOrderCardInPlace = function (orderId, newStatus) {
        const idStr = String(orderId);
        
        // تحديث كاش الذاكرة
        const activeOrders = window.AppStore ? window.AppStore.getOrders('active') : [];
        const orderIndex = activeOrders.findIndex(o => String(o.id) === idStr);
        if (orderIndex > -1) {
            activeOrders[orderIndex].status = newStatus;
            window.AppStore.setOrders('active', activeOrders);
        }

        // تحديث السطر المصغر في القائمة
        const compactRow = document.getElementById(`m-order-row-${idStr}`);
        const legacyCard = document.getElementById(`m-order-card-${idStr}`);
        
        if (compactRow) {
            const badge = compactRow.querySelector('.order-compact-badge');
            const iconWrap = compactRow.querySelector('.order-compact-icon i');
            let statusText = '', badgeStyle = '', iconClass = 'fa-receipt';

            if (newStatus === 'confirmed_by_store') {
                statusText = 'قيد التجهيز';
                badgeStyle = 'background:rgba(16, 185, 129, 0.12); color:var(--success);';
                iconClass = 'fa-box-open';
            } else if (newStatus === 'out_for_delivery') {
                statusText = 'في الطريق';
                badgeStyle = 'background:rgba(59, 130, 246, 0.12); color:var(--info);';
                iconClass = 'fa-motorcycle';
            } else if (newStatus === 'completed') {
                statusText = 'مكتمل بنجاح';
                badgeStyle = 'background:rgba(16, 185, 129, 0.12); color:var(--success);';
                iconClass = 'fa-circle-check';
                setTimeout(() => {
                    compactRow.style.transition = 'all 0.3s ease';
                    compactRow.style.opacity = '0';
                    compactRow.style.transform = 'scale(0.95)';
                    setTimeout(() => compactRow.remove(), 300);
                }, 1500);
            } else if (newStatus === 'cancelled') {
                statusText = 'طلب ملغي';
                badgeStyle = 'background:rgba(239, 68, 68, 0.12); color:var(--danger);';
                iconClass = 'fa-circle-xmark';
                setTimeout(() => {
                    compactRow.style.transition = 'all 0.3s ease';
                    compactRow.style.opacity = '0';
                    compactRow.style.transform = 'scale(0.95)';
                    setTimeout(() => compactRow.remove(), 300);
                }, 1500);
            }

            if (badge) {
                badge.innerText = statusText;
                badge.style.cssText = badgeStyle;
            }
            if (iconWrap) {
                iconWrap.className = `fas ${iconClass}`;
            }
        }

        if (legacyCard) {
            const badge = legacyCard.querySelector('span[style*="border-radius"]');
            if (badge) {
                if (newStatus === 'confirmed_by_store') badge.innerText = 'قيد التجهيز';
                else if (newStatus === 'out_for_delivery') badge.innerText = 'في الطريق';
                else if (newStatus === 'completed') badge.innerText = 'مكتمل';
                else if (newStatus === 'cancelled') badge.innerText = 'ملغي';
            }
        }

        // تحديث كرت التفاصيل إذا كانت النافذة مفتوحة لنفس الطلب
        if (window.currentViewingOrderId === idStr && typeof window.openOrderDetail === 'function') {
            const modal = document.getElementById('single-order-detail-modal');
            if (modal && modal.classList.contains('show')) {
                window.openOrderDetail(idStr);
            }
        }
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('orders-actions');

})();
