/**
 * qr-modal.js — نافذة مشاركة المنتج، توليد QR، تنزيل وطباعة
 * يُحمَّل عند النقر على زر QR (Lazy Loaded)
 */
(function () {
    'use strict';

    let currentQRProduct = null;

    // ===== حقن HTML الخاص بنافذة QR =====
    function injectQRModal() {
        if (!document.getElementById('qr-modal')) {
            const html = `
            <div class="modal" id="qr-modal" style="z-index: 10006;">
                <div class="modal-content" style="max-width: 380px; text-align: center; background: var(--bg-solid);">
                    <div class="modal-title-bar">
                        <h3><i class="fas fa-qrcode text-success"></i> مشاركة المنتج (QR)</h3>
                        <button class="close-btn" onclick="closeM('qr-modal')"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div id="qr-card-export">
                        <div class="deco-1"></div><div class="deco-2"></div>
                        <div class="qr-brand-row"><span class="qr-brand-dot"></span><h3 id="qr-store-name"></h3></div>
                        <h4 id="qr-product-name"></h4>
                        <div class="qr-hero-wrap" id="qr-hero-wrap">
                            <img id="qr-product-image" class="qr-hero-img" alt="" loading="eager" decoding="async" onerror="document.getElementById('qr-hero-wrap').innerHTML='<div class=&quot;qr-hero-placeholder&quot;><i class=&quot;fas fa-image&quot;></i></div>'">
                        </div>
                        <div class="qr-canvas-container">
                            <canvas id="qr-modal-canvas"></canvas>
                            <div class="qr-stamp"><div class="qr-stamp-inner">N</div></div>
                        </div>
                        <div id="qr-product-price"></div>
                        <div id="qr-footer-text"><i class="fas fa-qrcode"></i> امسح الكود لطلب المنتج مباشرة</div>
                    </div>

                    <div style="display:flex; gap:8px; justify-content: center; margin-top: 14px; flex-wrap: wrap;">
                        <button class="btn-main" style="background: #25D366; flex:1; min-width: 90px; padding: 9px;" onclick="shareProductLink()"><i class="fas fa-share-alt"></i> مشاركة</button>
                        <button class="btn-main" style="background: var(--success); flex:1; min-width: 90px; padding: 9px;" onclick="downloadQRImage()"><i class="fas fa-download"></i> حفظ</button>
                        <button class="btn-main" style="background: var(--primary); flex:1; min-width: 90px; padding: 9px;" onclick="printModalQR()"><i class="fas fa-print"></i> طباعة</button>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    injectQRModal();

    // ===== إظهار نافذة QR =====
    window.showProductQRModal = function (product) {
        injectQRModal();
        currentQRProduct = product;
        const storeName = document.getElementById('display-store-name')?.innerText || window.currentMerchantData?.store_name || 'متجري';
        const currency = product.currency || 'YER';
        const price = parseFloat(product.price).toLocaleString();

        const qrStoreName = document.getElementById('qr-store-name');
        const qrProductName = document.getElementById('qr-product-name');
        const qrProductPrice = document.getElementById('qr-product-price');
        if (qrStoreName) qrStoreName.innerText = storeName;
        if (qrProductName) qrProductName.innerText = window.escapeHTML(product.name);
        if (qrProductPrice) qrProductPrice.innerText = price + ' ' + currency;

        const heroWrap = document.getElementById('qr-hero-wrap');
        if (heroWrap) {
            heroWrap.innerHTML = `<img id="qr-product-image" class="qr-hero-img" alt="" loading="eager" decoding="async" onerror="document.getElementById('qr-hero-wrap').innerHTML='<div class=&quot;qr-hero-placeholder&quot;><i class=&quot;fas fa-image&quot;></i></div>'">`;
            const qrImg = document.getElementById('qr-product-image');
            if (qrImg) qrImg.src = window.getValidImageUrl(product.image);
        }

        const stampEl = document.querySelector('#qr-card-export .qr-stamp-inner');
        if (stampEl) stampEl.innerText = (storeName.trim().charAt(0) || 'N').toUpperCase();

        const baseUrl = window.location.origin;
        const pRef = product.product_number || product.id || product.global_product_id;
        const productUrl = `${baseUrl}/${window.merchantUsername}/p${pRef}`;

        const canvas = document.getElementById('qr-modal-canvas');
        if (canvas && window.QRious) {
            new window.QRious({
                element: canvas,
                value: productUrl,
                size: 240,
                level: 'H',
                background: '#ffffff',
                foreground: '#0f172a'
            });
        }

        window.openM('qr-modal');
    };

    // ===== تنزيل صورة QR كـ PNG =====
    window.downloadQRImage = function () {
        const card = document.getElementById('qr-card-export');
        if (!card || typeof window.html2canvas !== 'function') return;

        window.html2canvas(card, { scale: 3, backgroundColor: null, useCORS: true, logging: false }).then(canvas => {
            const link = document.createElement('a');
            const name = currentQRProduct ? currentQRProduct.name.substring(0, 10) : 'product';
            link.download = `Product_QR_${name}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            window.showT('تم تنزيل صورة الباركود', 'success');
        }).catch(() => window.showT('خطأ أثناء حفظ الصورة', 'error'));
    };

    // ===== مشاركة رابط المنتج عبر Web Share API أو واتساب =====
    window.shareProductLink = async function () {
        if (!currentQRProduct) return;
        const baseUrl = window.location.origin;
        const pRef = currentQRProduct.product_number || currentQRProduct.id;
        const productUrl = `${baseUrl}/${window.merchantUsername}/p${pRef}`;
        const currency = currentQRProduct.currency || 'YER';
        const price = parseFloat(currentQRProduct.price).toLocaleString();
        const shareTitle = currentQRProduct.name;
        const shareText = `شاهد هذا المنتج في متجري: ${currentQRProduct.name}\nالسعر: ${price} ${currency}\n\nللطلب والتفاصيل:\n`;

        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText, url: productUrl });
            } catch (err) { }
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + productUrl)}`, '_blank');
        }
    };

    // ===== طباعة كود QR =====
    window.printModalQR = function () {
        let printArea = document.getElementById('print-area');
        if (!printArea) {
            printArea = document.createElement('div');
            printArea.id = 'print-area';
            printArea.style.display = 'none';
            document.body.appendChild(printArea);
        }
        printArea.style.display = 'flex';

        const card = document.getElementById('qr-card-export');
        if (!card) return;
        const cardClone = card.cloneNode(true);
        const canvas = document.getElementById('qr-modal-canvas');
        const dataUrl = canvas ? canvas.toDataURL() : '';
        const canvasContainer = cardClone.querySelector('.qr-canvas-container');
        const stampLetter = document.querySelector('#qr-card-export .qr-stamp-inner')?.innerText || 'N';

        if (canvasContainer) {
            canvasContainer.innerHTML = `<img src="${dataUrl}" style="width:160px; height:160px; display:block;"><div class="qr-stamp" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 50%; padding: 3px; display: flex; justify-content: center; align-items: center;"><div class="qr-stamp-inner" style="background: var(--primary-gradient); width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 10px; font-weight: bold;">${stampLetter}</div></div>`;
        }

        cardClone.style.boxShadow = 'none';
        cardClone.style.maxWidth = '320px';
        printArea.innerHTML = '';
        printArea.appendChild(cardClone);

        setTimeout(() => {
            window.print();
            setTimeout(() => { printArea.style.display = 'none'; }, 400);
        }, 250);
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('qr-modal');

})();
