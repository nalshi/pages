/**
 * ========================================================
 * 🃏 Nalsh Card Templates v2.0 — cardTemplates.js
 * ========================================================
 * محرك وقوالب أشكال كروت المنتجات الاحترافية والمتجاوبة.
 * كل شكل دالة مستقلة مجهزة بكافة عناصر البطاقة:
 * (الاسم، السعر، العملة، السعر القديم، شارة الخصم، حالة المخزون،
 *  اسم الفئة، اسم التاجر، الصورة المحسنة، زر السلة، المفضلة والمشاركة)
 * متوافقة 100% مع الوضعين الفاتح والداكن وكافة مقاسات الشاشات.
 * ========================================================
 */
(function() {
'use strict';

// ── 1. القالب الكلاسيكي (Classic) ──────────────────────────────────────────
// التصميم القياسي المتوازن: صورة مربعة في الأعلى + بيانات وسعر وزر في الأسفل
window.CT_classic = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-classic';
    const imgH = opts.imgHeight > 0 ? `height:${opts.imgHeight}px; aspect-ratio:auto;` : '';

    wrap.innerHTML = `
        <div class="compact-img-wrapper" style="${imgH}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
                <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
        <div class="compact-details">
            <div class="meta-row-mini">
                <span class="sc-cat-mini p-cat" style="display:none;"></span>
                <div class="merchant-mini-label p-merchant" style="display:none;">
                    <i class="fas fa-store"></i> <span class="m-name"></span>
                </div>
            </div>
            <div class="compact-name p-name"></div>
            <div class="modern-card-footer">
                <div class="modern-price-box">
                    <div class="modern-price-current"><span class="p-price"></span> <small class="p-currency"></small></div>
                    <div class="modern-price-old-wrapper" style="display:none;">
                        <span class="modern-price-old p-old-price"></span>
                    </div>
                </div>
                <button class="modern-add-cart-btn-mini p-add-cart" title="أضف للسلة">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>`;
    return wrap;
};

// ── 2. القالب المبسط (Minimal) ─────────────────────────────────────────────
// بدون حدود صلبة، خلفية خفيفة، صورة ممتدة، طبقة تدرج شفافة أنيقة للمعلومات
window.CT_minimal = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-minimal';
    const imgH = opts.imgHeight > 0 ? `height:${opts.imgHeight}px;` : '';

    wrap.innerHTML = `
        <div class="ct-min-img-box" style="${imgH}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
                <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
            <div class="ct-min-overlay-grad"></div>
        </div>
        <div class="ct-min-info">
            <div class="meta-row-mini">
                <span class="sc-cat-mini p-cat" style="display:none;"></span>
                <div class="merchant-mini-label p-merchant" style="display:none;">
                    <i class="fas fa-store"></i> <span class="m-name"></span>
                </div>
            </div>
            <div class="compact-name p-name"></div>
            <div class="ct-min-footer">
                <div class="modern-price-box">
                    <div class="modern-price-current"><span class="p-price"></span> <small class="p-currency"></small></div>
                    <div class="modern-price-old-wrapper" style="display:none;">
                        <span class="modern-price-old p-old-price"></span>
                    </div>
                </div>
                <button class="action-btn-mini p-add-cart ct-min-btn" title="أضف للسلة">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>`;
    return wrap;
};

// ── 3. القالب البولد الجريء (Bold) ──────────────────────────────────────────
// نصوص بارزة وواضحة، عنوان قوي، سعر ملفت، وزر عريض مباشر للشراء
window.CT_bold = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-bold';
    const imgH = opts.imgHeight > 0 ? `height:${opts.imgHeight}px; aspect-ratio:auto;` : '';

    wrap.innerHTML = `
        <div class="compact-img-wrapper ct-bold-img-wrap" style="${imgH}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
                <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
        <div class="ct-bold-details">
            <div class="meta-row-mini">
                <span class="sc-cat-mini p-cat" style="display:none;"></span>
                <div class="merchant-mini-label p-merchant" style="display:none;">
                    <i class="fas fa-store"></i> <span class="m-name"></span>
                </div>
            </div>
            <div class="compact-name p-name ct-bold-title"></div>
            <div class="ct-bold-price-box">
                <div class="modern-price-current ct-bold-price"><span class="p-price"></span> <small class="p-currency"></small></div>
                <div class="modern-price-old-wrapper" style="display:none;">
                    <span class="modern-price-old p-old-price"></span>
                </div>
            </div>
            <button class="ct-bold-action-btn p-add-cart" title="أضف للسلة">
                <i class="fas fa-shopping-basket"></i> <span>أضف للسلة</span>
            </button>
        </div>`;
    return wrap;
};

// ── 4. القالب العريض الأفقي (Landscape Row) ────────────────────────────────
// الصورة على جانب والبيانات على الجانب الآخر — نمط المتاجر الكبرى والبطاقات الأفقية
window.CT_landscape_row = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-landscape-row';
    const cardW = Number(opts.cardWidth || 0);
    const imgW = cardW > 0 ? `width:${Math.max(100, Math.round(cardW * 0.38))}px;` : '';

    wrap.innerHTML = `
        <div class="ct-row-img-side" style="${imgW}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container top-start">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
            </div>
        </div>
        <div class="ct-row-info-side">
            <div class="meta-row-mini">
                <span class="sc-cat-mini p-cat" style="display:none;"></span>
                <div class="merchant-mini-label p-merchant" style="display:none;">
                    <i class="fas fa-store"></i> <span class="m-name"></span>
                </div>
            </div>
            <div class="compact-name p-name ct-row-title"></div>
            <div class="ct-row-bottom-bar">
                <div class="modern-price-box">
                    <div class="modern-price-current"><span class="p-price"></span> <small class="p-currency"></small></div>
                    <div class="modern-price-old-wrapper" style="display:none;">
                        <span class="modern-price-old p-old-price"></span>
                    </div>
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
                    <button class="modern-add-cart-btn-mini p-add-cart" title="أضف للسلة">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>`;
    return wrap;
};

// ── 5. قالب المجلة (Magazine) ──────────────────────────────────────────────
// صورة متصدرة تغطي معظم البطاقة مع طبقة نص غنية وقراءة سينمائية
window.CT_magazine = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-magazine';
    const imgH = opts.imgHeight > 0 ? `min-height:${opts.imgHeight}px;` : '';

    wrap.innerHTML = `
        <div class="ct-mag-card-inner" style="${imgH}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper ct-mag-image-wrap">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
                <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
            <div class="ct-mag-glass-content">
                <div class="meta-row-mini">
                    <span class="sc-cat-mini p-cat" style="display:none;"></span>
                </div>
                <div class="compact-name p-name ct-mag-title"></div>
                <div class="ct-mag-bottom-row">
                    <div class="modern-price-box">
                        <div class="modern-price-current ct-mag-price"><span class="p-price"></span> <small class="p-currency"></small></div>
                        <div class="modern-price-old-wrapper" style="display:none;">
                            <span class="modern-price-old p-old-price"></span>
                        </div>
                    </div>
                    <button class="action-btn-mini p-add-cart ct-mag-add" title="أضف للسلة">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>`;
    return wrap;
};

// ── 6. القالب الزجاجي المتألق (Glassmorphism) ──────────────────────────────
// تأثير زجاجي بلوري شفاف، ظلال وتدرجات ضوئية عصرية فاخرة
window.CT_glass = function(product, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'product-card-compact fast-card ct-card ct-glass';
    const imgH = opts.imgHeight > 0 ? `height:${opts.imgHeight}px; aspect-ratio:auto;` : '';

    wrap.innerHTML = `
        <div class="compact-img-wrapper ct-glass-img-wrap" style="${imgH}">
            <div class="discount-badge-mini" style="display:none;"></div>
            <div class="stock-badge-mini" style="display:none;"></div>
            <div class="image-container-wrapper">
                <i class="fas fa-image placeholder-icon"></i>
                <img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
            </div>
            <div class="card-actions-container">
                <button class="action-btn-mini fav-btn" title="المفضلة"><i class="fas fa-heart"></i></button>
                <button class="action-btn-mini share-btn" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
        <div class="compact-details ct-glass-details">
            <div class="meta-row-mini">
                <span class="sc-cat-mini p-cat" style="display:none;"></span>
                <div class="merchant-mini-label p-merchant" style="display:none;">
                    <i class="fas fa-store"></i> <span class="m-name"></span>
                </div>
            </div>
            <div class="compact-name p-name ct-glass-title"></div>
            <div class="modern-card-footer">
                <div class="modern-price-box">
                    <div class="modern-price-current"><span class="p-price"></span> <small class="p-currency"></small></div>
                    <div class="modern-price-old-wrapper" style="display:none;">
                        <span class="modern-price-old p-old-price"></span>
                    </div>
                </div>
                <button class="modern-add-cart-btn-mini p-add-cart ct-glass-btn" title="أضف للسلة">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>`;
    return wrap;
};

// ── 7. رجستري الأشكال العام ────────────────────────────────────────────────
window.CARD_TEMPLATES = {
    classic:       window.CT_classic,
    minimal:       window.CT_minimal,
    bold:          window.CT_bold,
    landscape_row: window.CT_landscape_row,
    magazine:      window.CT_magazine,
    glass:         window.CT_glass
};

// ── 8. CSS المتكامل والمحكم لكافة أشكال وتصاميم الكروت ───────────────────────
(function injectCardTemplateStyles() {
    const styleId = 'card-templates-style-v2';
    if (document.getElementById(styleId)) return;
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
/* ── المشترك لجميع الكروت ── */
.ct-card {
    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.22s ease !important;
}

/* ── 1. Minimal Style ── */
.ct-minimal {
    background: var(--bg-card, #ffffff) !important;
    border: 1px solid var(--border, rgba(0,0,0,0.06)) !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.03) !important;
}
.ct-min-img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    background: transparent;
}
.ct-min-info {
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.ct-min-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 8px;
}
.ct-min-btn {
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    border-radius: var(--theme-button-radius, 10px) !important;
    width: 34px !important;
    height: 34px !important;
}

/* ── 2. Bold Style ── */
.ct-bold {
    background: var(--bg-card, #ffffff) !important;
    border: 2px solid var(--border, rgba(0,0,0,0.08)) !important;
    box-shadow: 0 4px 14px rgba(0,0,0,0.04) !important;
}
.ct-bold-title {
    font-size: 1rem !important;
    font-weight: 900 !important;
    color: var(--text-main, #111827) !important;
}
.ct-bold-price {
    font-size: 1.35rem !important;
    font-weight: 900 !important;
    color: var(--primary, #4F46E5) !important;
}
.ct-bold-details {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.ct-bold-price-box {
    margin: 8px 0 10px;
}
.ct-bold-action-btn {
    width: 100%;
    padding: 9px 12px;
    background: var(--primary, #4F46E5);
    color: #ffffff;
    border: none;
    border-radius: var(--theme-button-radius, 12px);
    font-weight: 800;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}
.ct-bold-action-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
}
.ct-bold-action-btn:active {
    transform: scale(0.98);
}

/* ── 3. Landscape Row Style ── */
.ct-landscape-row {
    flex-direction: row !important;
    align-items: stretch !important;
    min-height: 120px !important;
    height: auto !important;
    background: var(--bg-card, #ffffff) !important;
    border: 1px solid var(--border, rgba(0,0,0,0.06)) !important;
}
.ct-row-img-side {
    width: 130px;
    min-width: 110px;
    max-width: 160px;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    background: transparent;
}
.ct-row-img-side .image-container-wrapper {
    height: 100% !important;
    aspect-ratio: auto !important;
}
.ct-row-info-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px 14px;
    min-width: 0;
}
.ct-row-title {
    font-size: 0.95rem !important;
    font-weight: 800 !important;
    margin-bottom: 6px;
    -webkit-line-clamp: 2 !important;
}
.ct-row-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 8px;
}

/* ── 4. Magazine Style ── */
.ct-magazine {
    border: none !important;
    overflow: hidden !important;
    background: #000000 !important;
    min-height: 220px;
    position: relative;
}
.ct-mag-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    display: flex;
    flex-direction: column;
}
.ct-mag-image-wrap {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1;
}
.ct-mag-image-wrap img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    opacity: 0.88 !important;
}
.ct-mag-glass-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    padding: 24px 12px 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 65%, transparent 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
}
.ct-mag-title {
    color: #ffffff !important;
    font-size: 0.92rem !important;
    font-weight: 800 !important;
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    margin-bottom: 6px;
}
.ct-mag-bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
}
.ct-mag-price {
    color: #ffffff !important;
    font-size: 1.15rem !important;
    font-weight: 900 !important;
}
.ct-mag-price small {
    color: #38BDF8 !important;
}
.ct-mag-add {
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    border-radius: var(--theme-button-radius, 10px) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* ── 5. Glassmorphism Style ── */
.ct-glass {
    background: rgba(255, 255, 255, 0.72) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.06) !important;
}
.dark-mode .ct-glass {
    background: rgba(15, 23, 42, 0.68) !important;
    border: 1px solid rgba(255, 255, 255, 0.09) !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
}
.ct-glass-img-wrap {
    background: transparent !important;
}
.ct-glass-btn {
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* ── تخصيص أشكال زر الإضافة للسلة ── */
.atc-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    border: none;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.atc-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
}
.atc-btn:active, .atc-btn.atc-active-click {
    transform: scale(0.9) !important;
}

/* 1. دائري ناعم */
.atc-style-circle_icon {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    font-size: 1rem !important;
    box-shadow: 0 4px 12px rgba(var(--primary-rgb, 79,70,229), 0.35) !important;
}

/* 2. كبسولي مع نص */
.atc-style-pill_text {
    padding: 7px 15px !important;
    border-radius: 9999px !important;
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    font-size: 0.82rem !important;
    font-weight: 800 !important;
    gap: 6px !important;
    box-shadow: 0 4px 14px rgba(var(--primary-rgb, 79,70,229), 0.35) !important;
}

/* 3. مربع بزوايا ناعمة */
.atc-style-rounded_box {
    width: 40px !important;
    height: 40px !important;
    border-radius: var(--theme-button-radius, 12px) !important;
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    font-size: 1.05rem !important;
    box-shadow: 0 4px 12px rgba(var(--primary-rgb, 79,70,229), 0.25) !important;
}

/* 4. عريض أسفل الكرت */
.atc-style-full_bottom {
    width: 100% !important;
    padding: 9px 12px !important;
    border-radius: var(--theme-button-radius, 12px) !important;
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    font-size: 0.86rem !important;
    font-weight: 800 !important;
    gap: 8px !important;
    margin-top: 8px !important;
    box-shadow: 0 4px 14px rgba(var(--primary-rgb, 79,70,229), 0.3) !important;
}

/* 5. مؤطر شفاف */
.atc-style-outlined {
    padding: 6px 14px !important;
    border-radius: var(--theme-button-radius, 10px) !important;
    background: transparent !important;
    color: var(--primary, #4F46E5) !important;
    border: 1.5px solid var(--primary, #4F46E5) !important;
    font-size: 0.82rem !important;
    font-weight: 800 !important;
    gap: 6px !important;
}
.atc-style-outlined:hover {
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
}

/* 6. زجاجي متدرج لامع */
.atc-style-gradient_glow {
    padding: 7px 15px !important;
    border-radius: 9999px !important;
    background: linear-gradient(135deg, var(--primary, #4F46E5), var(--accent, #06B6D4)) !important;
    color: #ffffff !important;
    font-size: 0.82rem !important;
    font-weight: 800 !important;
    gap: 6px !important;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45) !important;
}

/* 7. عائم فوق الصورة */
.atc-style-floating_action {
    position: absolute !important;
    bottom: 10px !important;
    left: 10px !important;
    z-index: 5 !important;
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: var(--primary, #4F46E5) !important;
    color: #ffffff !important;
    border: 2px solid #ffffff !important;
    box-shadow: 0 4px 14px rgba(0,0,0,0.3) !important;
}

/* حركة التفاعل عند الضغط */
.atc-anim-bounce.atc-active-click {
    animation: atcBounce 0.4s ease;
}
@keyframes atcBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.25); }
}
.atc-anim-glow.atc-active-click {
    box-shadow: 0 0 22px var(--primary, #4F46E5) !important;
}

/* ── استجابة الهواتف الصغيرة ── */
@media (max-width: 480px) {
    .ct-bold-title { font-size: 0.88rem !important; }
    .ct-bold-price { font-size: 1.1rem !important; }
    .ct-bold-action-btn { padding: 7px 10px; font-size: 0.78rem; }
    .ct-row-img-side { width: 100px; min-width: 90px; }
}
    `;
    document.head.appendChild(s);
})();

})();
