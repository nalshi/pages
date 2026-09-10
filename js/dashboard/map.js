/**
 * map.js — خريطة تحديد موقع المتجر (Leaflet)
 * يُحمَّل عند النقر على "فتح الخريطة لتحديد الموقع" (Lazy Loaded)
 */
(function () {
    'use strict';

    let merchantMap = null;
    let merchantMarker = null;
    let mapInitialized = false;

    // ===== تهيئة خريطة Leaflet =====
    window.initSettingMap = function () {
        const mapWrapper = document.getElementById('map-wrapper');
        const btnInitMap = document.getElementById('btn-init-map');
        if (mapWrapper) mapWrapper.classList.add('active');
        if (btnInitMap) btnInitMap.style.display = 'none';

        if (mapInitialized && merchantMap) {
            setTimeout(() => merchantMap.invalidateSize(), 300);
            return;
        }

        setTimeout(() => {
            if (typeof L === 'undefined') {
                console.warn('Leaflet library not loaded yet');
                return;
            }

            const isDark = document.body.classList.contains('dark-mode');
            merchantMap = L.map('merchant-map', { zoomControl: false }).setView([15.3694, 44.1910], 13);

            L.tileLayer(isDark
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            ).addTo(merchantMap);

            const customIcon = L.divIcon({
                html: '<div style="background:var(--primary); color:white; width:28px; height:28px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.3);"><i class="fas fa-store" style="font-size:0.85rem"></i></div>',
                className: ''
            });

            merchantMarker = L.marker([15.3694, 44.1910], { icon: customIcon, draggable: true }).addTo(merchantMap);

            merchantMarker.on('dragend', e => {
                const locInput = document.getElementById('edit-store-location');
                if (locInput) locInput.value = `https://www.google.com/maps?q=${e.target.getLatLng().lat},${e.target.getLatLng().lng}`;
            });

            merchantMap.on('click', e => {
                merchantMarker.setLatLng(e.latlng);
                const locInput = document.getElementById('edit-store-location');
                if (locInput) locInput.value = `https://www.google.com/maps?q=${e.latlng.lat},${e.latlng.lng}`;
            });

            const currentLoc = document.getElementById('edit-store-location')?.value;
            if (currentLoc) {
                const match = currentLoc.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (match) {
                    merchantMarker.setLatLng([parseFloat(match[1]), parseFloat(match[2])]);
                    merchantMap.setView([parseFloat(match[1]), parseFloat(match[2])], 15);
                }
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(p => {
                    merchantMarker.setLatLng([p.coords.latitude, p.coords.longitude]);
                    merchantMap.setView([p.coords.latitude, p.coords.longitude], 15);
                    const locInput = document.getElementById('edit-store-location');
                    if (locInput) locInput.value = `https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`;
                }, () => { });
            }

            mapInitialized = true;
        }, 300);
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('map');

})();
