/*
 * Compatibility shim for older dashboard builds.
 * The merchant hub was merged into dashboard-tab.js; keep the old URL valid
 * so cached pages do not receive the HTML fallback document.
 */
(function () {
    'use strict';
    if (document.querySelector('script[data-merchant-hub-compat]')) return;
    const script = document.createElement('script');
    script.src = '/js/dashboard/dashboard-tab.js';
    script.async = true;
    script.dataset.merchantHubCompat = 'true';
    document.head.appendChild(script);
}());
