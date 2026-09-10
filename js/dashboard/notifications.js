/**
 * notifications.js — نظام الإشعارات والتنبيهات
 * يُحمَّل فوراً مع الصفحة
 */
(function () {
    'use strict';

    const MAX_NOTIFICATIONS = 30;
    let notifications = JSON.parse(localStorage.getItem('merchant_notifications')) || [];
    let hasUnreadNotifs = localStorage.getItem('has_unread_notifs') === 'true';

    window.addNotification = function (icon, message, type = 'info') {
        const timeString = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        notifications.unshift({ icon, message, time: timeString, type });
        if (notifications.length > MAX_NOTIFICATIONS) notifications.pop();
        localStorage.setItem('merchant_notifications', JSON.stringify(notifications));
        localStorage.setItem('has_unread_notifs', 'true');
        hasUnreadNotifs = true;
        window.updateNotificationUI();
    };

    window.updateNotificationUI = function () {
        const badge = document.getElementById('notif-badge');
        if (badge) badge.style.display = hasUnreadNotifs ? 'block' : 'none';
        const panel = document.getElementById('notif-list');
        if (!panel) return;
        if (notifications.length === 0) {
            panel.innerHTML = `<div style="text-align:center; padding:25px; color:var(--text-muted); font-size:0.85rem;">لا توجد نشاطات مسجلة.</div>`;
        } else {
            panel.innerHTML = notifications.map(n =>
                `<div class="notif-item"><div class="notif-icon" style="background:var(--${n.type});"><i class="fas ${n.icon}"></i></div><div class="notif-content"><p>${window.escapeHTML(n.message)}</p><span>${n.time}</span></div></div>`
            ).join('');
        }
    };

    window.toggleNotificationPanel = function () {
        const p = document.getElementById('notification-panel');
        if (!p) return;
        p.classList.toggle('show');
        if (p.classList.contains('show')) {
            const badge = document.getElementById('notif-badge');
            if (badge) badge.style.display = 'none';
            localStorage.setItem('has_unread_notifs', 'false');
            hasUnreadNotifs = false;
        }
    };

    window.clearNotifications = function () {
        notifications = [];
        localStorage.removeItem('merchant_notifications');
        localStorage.setItem('has_unread_notifs', 'false');
        hasUnreadNotifs = false;
        window.updateNotificationUI();
        const panel = document.getElementById('notification-panel');
        if (panel) panel.classList.remove('show');
    };

    // ===== تقييم حالة الطلبات المعلقة والشريط العلوي =====
    window.evaluatePendingOrdersState = function () {
        if (!window.AppStore) return;
        const activeOrders = window.AppStore.getOrders('active');
        const pendingOrders = activeOrders.filter(o => o.status === 'pending_merchant_approval');
        const totalActiveCount = activeOrders.length;
        const pendingCount = pendingOrders.length;
        const alertBar = document.getElementById('persistent-order-alert');
        const newOrderAlert = document.getElementById('new-order-alert');
        const ordersSection = document.getElementById('orders');
        const isOrdersTabOpen = Boolean(ordersSection && ordersSection.classList.contains('active'));
        const titleText = document.getElementById('persistent-title');
        const countText = document.getElementById('pending-count-text');
        const newOrdersBadge = document.getElementById('new-orders-badge');
        const navBadgeMobile = document.getElementById('nav-badge-mobile');

        if (pendingCount > 0 && !isOrdersTabOpen) {
            const needsApproval = true;
            const isPreparing = activeOrders.some(o => o.status === 'confirmed_by_store');
            const isOutForDelivery = activeOrders.some(o => o.status === 'out_for_delivery');

            if (alertBar) {
                if (needsApproval) {
                    alertBar.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
                    if (titleText) titleText.innerText = 'طلبات بانتظار الإجراء!';
                    const isNotifEnabled = window.currentMerchantData?.settings?.push_notifications;
                    if (isNotifEnabled !== false && isNotifEnabled !== 'false' && window.orderAudio) {
                        window.orderAudio.loop = true;
                        window.orderAudio.play().catch(e => { });
                    }
                } else if (isPreparing) {
                    alertBar.style.background = 'linear-gradient(135deg, #f59e0b, #ea580c)';
                    if (titleText) titleText.innerText = 'طلبات قيد التجهيز';
                    if (window.orderAudio) { window.orderAudio.pause(); window.orderAudio.currentTime = 0; }
                } else if (isOutForDelivery) {
                    alertBar.style.background = 'linear-gradient(135deg, #2563eb, #0284c7)';
                    if (titleText) titleText.innerText = 'طلبات في الطريق للعميل';
                    if (window.orderAudio) { window.orderAudio.pause(); window.orderAudio.currentTime = 0; }
                }

                if (countText) countText.innerText = `لديك ${totalActiveCount} ${totalActiveCount === 1 ? 'طلب نشط' : 'طلبات نشطة'}`;
                alertBar.classList.add('show');
            }

            if (newOrdersBadge) newOrdersBadge.style.display = 'inline-block';
            if (navBadgeMobile) navBadgeMobile.style.display = 'block';
        } else {
            if (alertBar) alertBar.classList.remove('show');
            if (newOrderAlert) newOrderAlert.classList.remove('show');
            if (window.orderAudio) { window.orderAudio.pause(); window.orderAudio.currentTime = 0; }
            if (newOrdersBadge) newOrdersBadge.style.display = 'none';
            if (navBadgeMobile) navBadgeMobile.style.display = 'none';
        }
    };

    window.dismissOrderAlerts = function () {
        const alertBar = document.getElementById('persistent-order-alert');
        const newOrderAlert = document.getElementById('new-order-alert');
        if (alertBar) alertBar.classList.remove('show');
        if (newOrderAlert) newOrderAlert.classList.remove('show');
        if (window.orderAudio) {
            window.orderAudio.loop = false;
            window.orderAudio.pause();
            window.orderAudio.currentTime = 0;
        }
    };

    window.goToPendingOrders = function () {
        window.dismissOrderAlerts();
        if (typeof window.switchT === 'function') window.switchT('orders');
    };

    window.stopRingingAndGoToOrders = function () {
        window.dismissOrderAlerts();
        if (typeof window.switchT === 'function') window.switchT('orders');
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('notifications');

})();
