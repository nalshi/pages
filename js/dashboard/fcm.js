/**
 * fcm.js — نظام الإشعارات السحابية (Firebase Cloud Messaging)
 * يُحمَّل عند تفعيل الإشعارات أو عند التهيئة (Lazy Loaded)
 */
(function () {
    'use strict';

    let fcmMessaging = null;

    window.initDynamicFCM = async function () {
        try {
            if (typeof firebase === 'undefined') {
                console.warn('Firebase SDK not available yet');
                return;
            }

            const res = await window.apiReq('get_firebase_config', {}, 'POST', false, true);
            if (!res || res.status !== 'success' || !res.config) return;

            const config = res.config;
            const vapidKey = config.vapidKey;
            delete config.vapidKey;

            if (!firebase.apps.length) firebase.initializeApp(config);
            fcmMessaging = firebase.messaging();

            if (typeof Notification === 'undefined') return;

            const permission = await Notification.requestPermission();
            if (permission === 'granted' && 'serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                const token = await fcmMessaging.getToken({ vapidKey: vapidKey, serviceWorkerRegistration: registration });

                if (token) {
                    await window.apiReq('save_fcm_token', { fcm_token: token }, 'POST', false, true);
                }

                fcmMessaging.onMessage((payload) => {
                    if (payload.data && payload.data.action === 'new_order') {
                        const isNotifEnabled = window.currentMerchantData?.settings?.push_notifications;
                        if (isNotifEnabled !== false && isNotifEnabled !== 'false' && window.orderAudio) {
                            window.orderAudio.loop = true;
                            window.orderAudio.currentTime = 0;
                            window.orderAudio.play().catch(() => { });
                        }

                        const alertBox = document.getElementById('new-order-alert');
                        if (alertBox) alertBox.classList.add('show');

                        if (typeof window.loadOrders === 'function') {
                            window.loadOrders('active', null, true);
                        }

                        const newOrdersBadge = document.getElementById('new-orders-badge');
                        if (newOrdersBadge) newOrdersBadge.style.display = 'inline-block';
                        const navBadgeMobile = document.getElementById('nav-badge-mobile');
                        if (navBadgeMobile) navBadgeMobile.style.display = 'block';
                    }
                });
            }
        } catch (err) {
            console.warn('FCM Init Notice:', err);
        }
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('fcm');

})();
