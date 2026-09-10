// =========================================================================
// ملف shareModal.js - نافذة المشاركة الاحترافية
// تعرض: صورة المنتج + الاسم + السعر + رمز QR + الرابط + منصات التواصل الاجتماعي
// =========================================================================

// ----------------------------------------
// 1. حقن تنسيقات النافذة (مرة واحدة فقط)
// ----------------------------------------
(function() {
    const styleId = 'share-modal-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        #share-modal-overlay.sheet-modal {
            position: fixed; inset: 0; z-index: 2100;
            background: rgba(0,0,0,0.55);
            display: flex; align-items: flex-end; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity .25s ease;
        }
        #share-modal-overlay.sheet-modal.open { opacity: 1; pointer-events: auto; }
        #share-modal-sheet {
            position: relative; width: 100%; max-width: 480px;
            background: var(--bg-card, #fff);
            border-radius: 24px 24px 0 0;
            padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
            max-height: 88vh; overflow-y: auto;
            transform: translateY(100%);
            transition: transform .3s cubic-bezier(.2,.9,.3,1);
        }
        #share-modal-overlay.sheet-modal.open #share-modal-sheet { transform: translateY(0); }
        .share-modal-handle { width: 42px; height: 5px; background: var(--border, #e5e7eb); border-radius: 10px; margin: 0 auto 14px; }
        .share-modal-close {
            position: absolute; top: 14px; left: 14px; width: 34px; height: 34px;
            border-radius: 50%; background: var(--bg-body, #f3f4f6); border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: var(--text-main, #111); font-size: 0.95rem;
        }
        .share-modal-title { text-align: center; font-weight: 900; font-size: 1.05rem; margin-bottom: 16px; color: var(--text-main, #111); }
        .share-card-preview {
            display: flex; gap: 12px; align-items: center;
            background: var(--bg-body, #f9fafb); border: 1px solid var(--border, #e5e7eb);
            border-radius: 16px; padding: 12px; margin-bottom: 18px;
        }
        .share-card-img-wrap { width: 66px; height: 66px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #fff; border: 1px solid var(--border, #e5e7eb); }
        .share-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .share-card-info { flex: 1; min-width: 0; }
        .share-card-name { font-weight: 800; font-size: 0.92rem; color: var(--text-main, #111); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px; }
        .share-card-price { font-weight: 900; color: var(--primary, #10b981); font-size: 0.98rem; }
        .share-qr-wrap { flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 5px; background: #fff; border-radius: 12px; border: 1px solid var(--border, #e5e7eb); }
        .share-qr-wrap canvas { display: block; border-radius: 6px; }
        .share-link-row {
            display: flex; align-items: center; gap: 8px;
            background: var(--bg-body, #f9fafb); border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px; padding: 10px 12px; margin-bottom: 22px;
        }
        .share-link-row input { flex: 1; min-width: 0; border: none; background: transparent; font-size: 0.82rem; color: var(--text-muted, #666); direction: ltr; text-align: left; outline: none; }
        .share-link-copy-btn { flex-shrink: 0; background: var(--primary, #10b981); color: #fff; border: none; border-radius: 8px; padding: 9px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; }
        .share-platforms-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 10px; }
        .share-platform-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; padding: 0; }
        .share-platform-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #fff; box-shadow: var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.08)); }
        .share-platform-label { font-size: 0.7rem; font-weight: 700; color: var(--text-main, #111); }
    `;
    document.head.appendChild(style);
})();

// ----------------------------------------
// 2. حقن قالب النافذة في الصفحة (مرة واحدة فقط)
// ----------------------------------------
(function() {
    if (document.getElementById('share-modal-overlay')) return;
    const html = `
    <div id="share-modal-overlay" class="sheet-modal">
        <div id="share-modal-sheet">
            <button class="share-modal-close" onclick="window.closeShareModal()"><i class="fas fa-times"></i></button>
            <div class="share-modal-handle"></div>
            <div class="share-modal-title">مشاركة المنتج</div>

            <div class="share-card-preview">
                <div class="share-card-img-wrap"><img id="share-modal-img" src="" alt="صورة المنتج"></div>
                <div class="share-card-info">
                    <div class="share-card-name" id="share-modal-name"></div>
                    <div class="share-card-price" id="share-modal-price"></div>
                </div>
                <div class="share-qr-wrap"><canvas id="share-modal-qr" width="70" height="70"></canvas></div>
            </div>

            <div class="share-link-row">
                <input id="share-modal-link" type="text" readonly>
                <button class="share-link-copy-btn" onclick="window.copyShareLink()">نسخ</button>
            </div>

            <div class="share-platforms-grid" id="share-platforms-grid"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    // إغلاق النافذة عند الضغط خارج المحتوى مباشرة
    document.getElementById('share-modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) window.closeShareModal();
    });
})();

// ----------------------------------------
// 3. تعريف منصات التواصل الاجتماعي المدعومة
// ----------------------------------------
window.SHARE_PLATFORMS = [
    { key: 'whatsapp',  label: 'واتساب',   color: '#25D366', icon: 'fab fa-whatsapp',            build: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}` },
    { key: 'telegram',  label: 'تيليجرام', color: '#26A5E4', icon: 'fab fa-telegram-plane',       build: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { key: 'twitter',   label: 'X',        color: '#111111', icon: 'fab fa-twitter',              build: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { key: 'facebook',  label: 'فيسبوك',   color: '#1877F2', icon: 'fab fa-facebook-f',           build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { key: 'messenger', label: 'ماسنجر',   color: '#0084FF', icon: 'fab fa-facebook-messenger',   build: (url) => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0&redirect_uri=${encodeURIComponent(url)}` },
    { key: 'email',     label: 'إيميل',    color: '#6b7280', icon: 'fas fa-envelope',             build: (url, text) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + '\n' + url)}` }
];

// بناء شبكة أزرار المنصات + زر "المزيد" (قائمة المشاركة الأصلية بالجهاز إن وجدت)
window.buildShareGrid = function(url, text) {
    const grid = document.getElementById('share-platforms-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.SHARE_PLATFORMS.forEach(pl => {
        const btn = document.createElement('button');
        btn.className = 'share-platform-btn';
        btn.innerHTML = `<span class="share-platform-icon" style="background:${pl.color};"><i class="${pl.icon}"></i></span><span class="share-platform-label">${pl.label}</span>`;
        btn.onclick = () => window.open(pl.build(url, text), '_blank', 'noopener,noreferrer');
        grid.appendChild(btn);
    });

    // زر "المزيد" يفتح قائمة المشاركة الأصلية بالجهاز (تصل لجميع التطبيقات المثبتة)
    if (navigator.share) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'share-platform-btn';
        moreBtn.innerHTML = `<span class="share-platform-icon" style="background:var(--primary,#10b981);"><i class="fas fa-ellipsis"></i></span><span class="share-platform-label">المزيد</span>`;
        moreBtn.onclick = async () => {
            try { await navigator.share({ title: text, text: text, url: url }); } catch (e) {}
        };
        grid.appendChild(moreBtn);
    }
};

// ----------------------------------------
// 4. فتح وإغلاق النافذة
// ----------------------------------------
window.currentShareData = null;

window.openShareModal = async function(data) {
    const overlay = document.getElementById('share-modal-overlay');
    if (!overlay || !data || !data.id) return;

    window.currentShareData = data;

    const baseUrl = typeof BASE_URL !== 'undefined' ? BASE_URL : window.location.origin;
    const currentStore = (window.App && window.App.currentStoreId) ? window.App.currentStoreId : '';
    const username = (data.username && data.username.trim() !== '') ? data.username : (currentStore || 'store');
    const url = `${baseUrl}/${username}/p${data.id}`;

    document.getElementById('share-modal-name').textContent = data.name || '';
    document.getElementById('share-modal-price').textContent = data.price ? `${data.price} ${data.currency || ''}` : '';
    document.getElementById('share-modal-img').src = typeof window.getOptimizedImageUrl === 'function'
        ? window.getOptimizedImageUrl(data.image, 'thumb')
        : (data.image || '');
    document.getElementById('share-modal-link').value = url;

    window.buildShareGrid(url, data.name || '');

    overlay.classList.add('open');
    if (typeof lockBodyScroll === 'function') lockBodyScroll(true);

    // توليد رمز QR (يحمّل مكتبة QRious بشكل كسول عبر app.js إن لم تكن محملة)
    try {
        if (typeof window.lazyLoadQR === 'function') await window.lazyLoadQR();
        const canvas = document.getElementById('share-modal-qr');
        if (window.QRious && canvas) {
            new QRious({ element: canvas, value: url, size: 140, level: 'H', background: '#ffffff', foreground: '#111111' });
        }
    } catch (e) {
        console.warn('⚠️ تعذر توليد رمز QR:', e);
    }
};

window.closeShareModal = function() {
    const overlay = document.getElementById('share-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    setTimeout(() => {
        if (document.querySelectorAll('.page-overlay.open, .sheet-modal.open, .modern-cart-overlay.active').length === 0) {
            if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
        }
    }, 300);
};

window.copyShareLink = function() {
    const input = document.getElementById('share-modal-link');
    if (!input) return;

    const finish = () => { if (typeof showToast === 'function') showToast('تم نسخ رابط المنتج! 📋', 'success'); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(finish).catch(() => {
            input.removeAttribute('readonly');
            input.select();
            document.execCommand('copy');
            input.setAttribute('readonly', 'true');
            finish();
        });
    } else {
        input.removeAttribute('readonly');
        input.select();
        document.execCommand('copy');
        input.setAttribute('readonly', 'true');
        finish();
    }
};

console.log("📤 تم تحميل نظام المشاركة الاحترافي (صورة + QR + منصات التواصل الاجتماعي) بنجاح!");
