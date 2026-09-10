/**
 * pwa.js — ميزات PWA، تثبيت التطبيق، Service Worker، والاتصال
 * يُحمَّل بعد تحميل الصفحة (Lazy Loaded)
 */
(function () {
    'use strict';

    // ===== حقن بانر تثبيت PWA =====
    function injectPwaBanner() {
        if (!document.getElementById('pwa-install-banner')) {
            const html = `
            <div id="pwa-install-banner">
                <div class="pwa-text">ثبّت التطبيق لتجربة أسرع 🚀</div>
                <button id="pwa-install-btn">تثبيت</button>
                <button id="pwa-close-btn"><i class="fas fa-times"></i></button>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    injectPwaBanner();

    // ===== تسجيل Service Worker =====
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(() => { }).catch(() => { });
    }

    // ===== معالجة بانر التثبيت =====
    let deferredPrompt = null;
    const pwaBanner = document.getElementById('pwa-install-banner');
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    const pwaCloseBtn = document.getElementById('pwa-close-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(() => {
            if (pwaBanner) pwaBanner.classList.add('show');
        }, 3000);
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            if (pwaBanner) pwaBanner.classList.remove('show');
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
        });
    }

    if (pwaCloseBtn) {
        pwaCloseBtn.addEventListener('click', () => {
            if (pwaBanner) pwaBanner.classList.remove('show');
        });
    }

    window.addEventListener('appinstalled', () => {
        if (pwaBanner) pwaBanner.classList.remove('show');
    });

    // ===== معالجات حالة الاتصال =====
    window.addEventListener('offline', () => {
        if (typeof window.showT === 'function') window.showT('انقطع الاتصال بالإنترنت!', 'error');
    });

    window.addEventListener('online', () => {
        if (typeof window.showT === 'function') window.showT('عاد الاتصال بالإنترنت!', 'success');
        window.startOrderPolling();
        window.startProductAutoRefresh();
    });

    let orderPollingInterval = null;
    let productAutoRefreshInterval = null;

    window.startOrderPolling = function () {
        if (orderPollingInterval) {
            clearInterval(orderPollingInterval);
            orderPollingInterval = null;
        }
    };

    window.startProductAutoRefresh = function () {
        if (productAutoRefreshInterval) {
            clearInterval(productAutoRefreshInterval);
            productAutoRefreshInterval = null;
        }
    };

    // ===== معالجة الروابط والتنقل الخارجي الآمن =====
    document.addEventListener('visibilitychange', function (e) {
        if (document.visibilityState === 'visible') e.preventDefault();
    }, true);

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) e.preventDefault();
    });

    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        if (link.href.startsWith('tel:') || link.href.startsWith('mailto:')) return;

        const url = new URL(link.href, window.location.origin);
        const currentOrigin = window.location.origin;
        const currentPath = window.location.pathname.toLowerCase();
        let shouldOpenExternally = false;

        if (url.origin !== currentOrigin) {
            shouldOpenExternally = true;
        } else {
            const targetPath = url.pathname.toLowerCase();
            const isCurrentlyInMerchantApp = currentPath.includes('merchant-dashboard') || currentPath.includes('login');
            if (isCurrentlyInMerchantApp) {
                if (!targetPath.includes('merchant-dashboard') && !targetPath.includes('login')) shouldOpenExternally = true;
            } else {
                if (targetPath.includes('merchant-dashboard') || targetPath.includes('login')) shouldOpenExternally = true;
            }
        }

        if (link.getAttribute('target') === '_blank') shouldOpenExternally = true;

        if (shouldOpenExternally) {
            e.preventDefault();
            e.stopPropagation();
            const a = document.createElement('a');
            a.href = link.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }, true);

    const originalWindowOpen = window.open;
    window.open = function (url, target, features) {
        if (!url) return null;
        return originalWindowOpen.call(window, url, '_blank', 'noopener,noreferrer');
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            document.body.style.transform = 'none';
            void document.body.offsetHeight;
            window.dispatchEvent(new Event('resize'));
        }
    });

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('pwa');

})();
