(function() {
const cssId = 'product-cards-style';
if (!document.getElementById(cssId)) {
const link = document.createElement('link');
link.id = cssId;
link.rel = 'stylesheet';
link.href = 'css/product.css';
document.head.appendChild(link);
}
})();
(function() {
const styleId = 'category-chips-style';
if (document.getElementById(styleId)) return;
const style = document.createElement('style');
style.id = styleId;
style.textContent = `
.cat-chips-scroller { display:flex; gap:10px; overflow-x:auto; padding:4px 15px 16px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
.cat-chips-scroller::-webkit-scrollbar { display:none; }
.cat-chip-card { flex:0 0 auto; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; width:76px; cursor:pointer; }
.cat-chip-circle { width:58px; height:58px; border-radius:18px; background:var(--bg-card, #f3f4f6); border:1px solid var(--border, #e5e7eb); display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:900; color:var(--primary, #10b981); }
.cat-chip-card.active .cat-chip-circle { background:var(--primary, #10b981); color:#fff; border-color:var(--primary, #10b981); }
.cat-chip-name { font-size:0.72rem; font-weight:700; color:var(--text-main,#111); text-align:center; max-width:76px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cat-chip-count { font-size:0.62rem; color:var(--text-muted,#888); }
`;
document.head.appendChild(style);
})();
if (typeof window.escapeHTML === 'undefined') {
window.escapeHTML = function(str) {
if (!str) return '';
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
};
}
if (typeof window.escapeAttr === 'undefined') {
window.escapeAttr = function(str) {
if (!str) return '';
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;')
.replace(/`/g, '&#96;');
};
}
if (typeof window.escapeJsAttr === 'undefined') {
window.escapeJsAttr = function(str) {
if (!str) return '';
return String(str)
.replace(/\\/g, '\\\\')
.replace(/'/g, "\\'")
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/\r?\n/g, ' ');
};
}
window.parsePrice = function(p) {
let orig = parseFloat(p.price) || 0;
let disc = parseFloat(p.discount) || 0;
let curr = disc > 0 ? orig * (1 - (disc / 100)) : orig;
if (p.original_price !== undefined) orig = parseFloat(p.original_price);
if (p.current_price !== undefined) curr = parseFloat(p.current_price);
return { current: curr, original: orig, discount: disc };
};
window.getOptimizedImageUrl = function(src, viewType = 'thumb') {
if (!src || src.trim() === '') return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
let finalUrl = src;
if (!src.startsWith('http') && !src.startsWith('data:')) {
const baseUrl = typeof BASE_URL !== 'undefined' ? BASE_URL : window.location.origin;
finalUrl = `${baseUrl}/${src.replace(/^\.\.\/|^\.\/|^\//, '')}`;
}
let width = 600, quality = 90, fit = 'cover';
if (viewType === 'detail') {
width = 1200;
quality = 95;
fit = 'contain';
} else if (viewType === 'option' || viewType === 'spec') {
width = 600;
quality = 90;
fit = 'cover';
} else if (viewType === 'order') {
width = 250;
quality = 85;
fit = 'contain';
}
return `https://wsrv.nl/?url=${encodeURIComponent(finalUrl)}&w=${width}&fit=${fit}&output=webp&q=${quality}&il=1`;
};
window.handleImageLoad = function(imgElement) {
imgElement.classList.add('loaded');
const wrapper = imgElement.closest('.image-container-wrapper');
if (wrapper) {
const placeholder = wrapper.querySelector('.placeholder-icon');
if (placeholder) placeholder.style.display = 'none';
}
};
window.handleImageError = function(imgElement) {
const wrapper = imgElement.closest('.image-container-wrapper');
if (wrapper) {
const placeholder = wrapper.querySelector('.placeholder-icon');
if (placeholder) {
placeholder.classList.remove('fa-image');
placeholder.classList.add('fa-image-slash');
placeholder.style.color = '#f87171';
placeholder.style.opacity = '0.4';
}
}
imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
};
window.handleCardAddToCartClick = function(product) {
if (product.options && product.options.length > 0) {
if (typeof toggleProductModal === 'function') {
toggleProductModal(true, product);
setTimeout(() => {
if (typeof openOptionsSheet === 'function') {
openOptionsSheet();
}
}, 320);
}
} else {
if (typeof addToCart === 'function') {
addToCart(product, 1, null);
}
}
};
const compactCardTemplate = document.createElement('template');
compactCardTemplate.innerHTML = `
<div class="product-card-compact fast-card">
<div class="compact-img-wrapper">
<div class="discount-badge-mini" style="display:none;"></div>
<div class="stock-badge-mini" style="display:none;"></div>
<div class="image-container-wrapper">
<i class="fas fa-image placeholder-icon"></i>
<img loading="lazy" decoding="async" class="p-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="صورة" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
</div>
<div class="card-actions-container">
<button class="action-btn-mini fav-btn"><i class="fas fa-heart"></i></button>
<button class="action-btn-mini share-btn"><i class="fas fa-share-alt"></i></button>
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
</div>
</div>
`;
window.generateFastCardNode = function(product, isStorePage = false) {
const cfg = window.currentStorefrontConfig?.products_settings || {};
const isMobile = window.innerWidth <= 768;
const orientCfg = isMobile ? (cfg.portrait || {}) : (cfg.landscape || {});
const pInfo = window.parsePrice(product);
const safeCurrency = window.escapeHTML(product.currency || 'YER');
const stockQty = product.quantity !== undefined ? Number(product.quantity) : (product.stock !== undefined ? Number(product.stock) : null);
const isOutOfStock = product.is_out_of_stock === true || stockQty === 0;

// اختر القالب المناسب
const cardStyle = orientCfg.card_style || cfg.card_style || 'classic';
const templateFn = (window.CARD_TEMPLATES && window.CARD_TEMPLATES[cardStyle]) || window.CT_classic;

const templateOpts = {
    pInfo,
    outOfStock: isOutOfStock,
    imgHeight: Number(orientCfg.img_custom_height || 0),
    cardWidth: Number(orientCfg.card_custom_width || 0)
};

const card = templateFn(product, templateOpts);
card.dataset.listingId = product.listing_id || product.id;

// ── مَلء البيانات المشتركة ──
const nameEl = card.querySelector('.p-name');
if (nameEl) nameEl.textContent = product.name;
const priceEl = card.querySelector('.p-price');
if (priceEl) priceEl.textContent = pInfo.current.toLocaleString();
const currencyEls = card.querySelectorAll('.p-currency');
currencyEls.forEach(el => { el.textContent = cfg.show_currency === false ? '' : safeCurrency; });

// شارة التصنيف
let categoryText = product.leaf_category || product.type || product.department || '';
if (categoryText.includes('>')) categoryText = categoryText.split('>').map(s => s.trim()).filter(Boolean).pop() || '';
const catEl = card.querySelector('.p-cat');
if (catEl && categoryText && cfg.show_category_tag !== false) {
    catEl.textContent = categoryText;
    catEl.style.display = 'inline-block';
}

// شارة الخصم والسعر القديم
if (pInfo.discount > 0 && cfg.show_discount_badge !== false && cfg.show_badges !== false) {
    const discountBadge = card.querySelector('.discount-badge-mini');
    if (discountBadge) {
        discountBadge.textContent = `-%${pInfo.discount.toFixed(0)}`;
        discountBadge.style.display = 'block';
    }
    if (cfg.show_old_price !== false) {
        const oldPriceEl = card.querySelector('.p-old-price');
        if (oldPriceEl) oldPriceEl.textContent = pInfo.original.toLocaleString();
        const oldPriceWrap = card.querySelector('.modern-price-old-wrapper');
        if (oldPriceWrap) oldPriceWrap.style.display = 'flex';
    }
}

// اسم التاجر
const merchantObj = (typeof allMerchants !== 'undefined') ? allMerchants.find(m => m.id == product.merchant_id) : null;
const actualStoreName = product.merchant_name || (merchantObj ? merchantObj.store_name : null) || 'متجرنا';
const safeUsername = merchantObj ? merchantObj.username : '';
if (!isStorePage && cfg.show_merchant !== false) {
    const mLabel = card.querySelector('.p-merchant');
    if (mLabel) {
        const mName = card.querySelector('.m-name');
        if (mName) mName.textContent = actualStoreName;
        mLabel.style.display = 'flex';
        mLabel.onclick = (e) => { e.stopPropagation(); if(typeof openListDetailView === 'function') openListDetailView('store', product.merchant_id, actualStoreName, '', safeUsername); };
    }
}

// الصورة
const img = card.querySelector('.p-img');
if (img) { img.src = window.getOptimizedImageUrl(product.image, 'thumb'); img.alt = product.name; }

// زر الإضافة للسلة المخصص
const addCartBtn = card.querySelector('.p-add-cart');
if (addCartBtn) {
    if (cfg.show_quick_add === false) {
        addCartBtn.style.display = 'none';
    } else {
        const btnCfg = cfg.add_to_cart_btn || {};
        const btnStyle = btnCfg.style || 'circle_icon';
        const btnIcon = btnCfg.icon || 'fa-plus';
        const btnText = btnCfg.text || 'أضف للسلة';
        const showText = btnCfg.show_text === true || btnStyle === 'pill_text' || btnStyle === 'full_bottom' || btnStyle === 'outlined';
        const anim = btnCfg.action_animation || 'scale';

        // إضافة الكلاسات المناسبة
        addCartBtn.className = `p-add-cart atc-btn atc-style-${btnStyle} atc-anim-${anim}`;
        
        let iconHtml = `<i class="fas ${btnIcon}"></i>`;
        let textHtml = showText ? `<span class="atc-btn-text">${btnText}</span>` : '';

        addCartBtn.innerHTML = `${iconHtml}${textHtml}`;
        addCartBtn.title = btnText;

        // في حال النمط العائم على الصورة
        if (btnStyle === 'floating_action') {
            const imgWrap = card.querySelector('.compact-img-wrapper, .ct-min-img-box, .ct-bold-img-wrap, .ct-glass-img-wrap, .ct-mag-card-inner');
            if (imgWrap && !imgWrap.contains(addCartBtn)) {
                imgWrap.appendChild(addCartBtn);
            }
        }

        if (isOutOfStock) {
            addCartBtn.classList.add('atc-disabled');
            addCartBtn.disabled = true;
            addCartBtn.title = 'نفدت الكمية';
            addCartBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof showToast === 'function') showToast('عذراً، هذا المنتج غير متوفر حالياً (نفدت الكمية)');
            };
        } else {
            addCartBtn.onclick = (e) => {
                e.stopPropagation();
                addCartBtn.classList.add('atc-active-click');
                setTimeout(() => addCartBtn.classList.remove('atc-active-click'), 450);
                window.handleCardAddToCartClick(product);
            };
        }
    }
}

// أزرار المشاركة والمفضلة (فقط للقوالب التي تحتويها)
const actionsBox = card.querySelector('.card-actions-container');
if (actionsBox && cfg.show_actions === false) actionsBox.style.display = 'none';

const favBtn = card.querySelector('.fav-btn');
if (favBtn) {
    if (typeof favorites !== 'undefined' && favorites.includes(product.id)) favBtn.classList.add('active');
    favBtn.dataset.productId = product.id;
    favBtn.onclick = (e) => { e.stopPropagation(); if(typeof toggleFavorite === 'function') toggleFavorite(product.id); };
}

const shareBtn = card.querySelector('.share-btn');
if (shareBtn) {
    shareBtn.dataset.id = product.id;
    shareBtn.dataset.name = product.name;
    shareBtn.dataset.desc = product.description || '';
    shareBtn.dataset.username = safeUsername;
    shareBtn.dataset.image = product.image || '';
    shareBtn.dataset.price = pInfo.current.toLocaleString();
    shareBtn.dataset.currency = safeCurrency;
    shareBtn.onclick = window.shareProduct;
}

// نفاذ المخزون
if (isOutOfStock) {
    card.classList.add('is-out-of-stock');
    const stockBadgeEl = card.querySelector('.stock-badge-mini');
    if (stockBadgeEl) { stockBadgeEl.className = 'stock-badge-mini out-of-stock'; stockBadgeEl.innerHTML = '<i class="fas fa-ban"></i> نفدت'; stockBadgeEl.style.display = 'inline-flex'; }
} else if (stockQty !== null && stockQty > 0 && stockQty <= 5) {
    const stockBadgeEl = card.querySelector('.stock-badge-mini');
    if (stockBadgeEl) { stockBadgeEl.className = 'stock-badge-mini low-stock'; stockBadgeEl.innerHTML = `<i class="fas fa-fire"></i> متبقي ${stockQty}`; stockBadgeEl.style.display = 'inline-flex'; }
}

card.style.cursor = 'pointer';
card.onclick = (e) => {
    if (e && e.target && e.target.closest('.p-add-cart, .fav-btn, .share-btn, .p-merchant, .merchant-mini-label')) {
        return;
    }
    if (typeof toggleProductModal === 'function') {
        toggleProductModal(true, product);
    }
};
return card;
};

window.renderThousandsOfProducts = function(productsArray, containerElement, isStorePage = false) {
if (!containerElement || !productsArray || productsArray.length === 0) return;
containerElement.innerHTML = '';
const fragment = document.createDocumentFragment();
const initialBatch = productsArray.slice(0, 20);
initialBatch.forEach(product => {
fragment.appendChild(window.generateFastCardNode(product, isStorePage));
});
containerElement.appendChild(fragment);
if (productsArray.length > 20) {
let currentIndex = 20;
const chunkSize = 30;
function renderNextChunk() {
if (currentIndex >= productsArray.length) return;
const chunkFragment = document.createDocumentFragment();
const end = Math.min(currentIndex + chunkSize, productsArray.length);
for (let i = currentIndex; i < end; i++) {
chunkFragment.appendChild(window.generateFastCardNode(productsArray[i], isStorePage));
}
containerElement.appendChild(chunkFragment);
currentIndex += chunkSize;
requestAnimationFrame(renderNextChunk);
}
requestAnimationFrame(renderNextChunk);
}
};
function _countProductsDeep(category) {
let count = (category.products || []).length;
if (category.subcategories && category.subcategories.length > 0) {
category.subcategories.forEach(sub => {
count += _countProductsDeep(sub);
});
}
return count;
}
window.createCategoryChip = function(category, isActive = false) {
const escapeHTML = window.escapeHTML;
const escapeAttr = window.escapeAttr;
const count = _countProductsDeep(category);
const initial = escapeHTML((category.name || '').trim().charAt(0) || '#');
return `<div class="cat-chip-card ${isActive ? 'active' : ''}" onclick="StoreUI.openCategoryFullView('${window.escapeJsAttr(category.name)}')">
<div class="cat-chip-circle">${initial}</div>
<div class="cat-chip-name">${escapeHTML(category.name)}</div>
<div class="cat-chip-count">${count}</div>
</div>`;
};
if (typeof window.createCategoryChipsStrip === 'undefined') {
window.createCategoryChipsStrip = function(categories) {
if (!categories || categories.length === 0) return '';
const chips = categories.map(cat => window.createCategoryChip(cat)).join('');
return `<div class="cat-chips-scroller" id="home-category-chips">${chips}</div>`;
};
}
window.createImageWithLoader = function(src, alt, cssClass = '', viewType = 'thumb') {
const optimizedSrc = window.getOptimizedImageUrl(src, viewType);
const priority = viewType === 'detail' ? 'high' : 'low';
const loadingAttr = viewType === 'detail' ? '' : 'loading="lazy"';
const escapeAttr = window.escapeAttr;
return `<div class="image-container-wrapper">
<i class="fas fa-image placeholder-icon"></i>
<img ${loadingAttr} decoding="async" fetchpriority="${priority}" src="${optimizedSrc}" alt="${escapeAttr(alt)}" class="${cssClass}" onload="window.handleImageLoad(this)" onerror="window.handleImageError(this)">
</div>`;
};
window.createCompactProductCard = function(p, isStorePage = false) {
const escapeHTML = window.escapeHTML;
const escapeAttr = window.escapeAttr;
const pInfo = window.parsePrice(p);
const merchantObj = (typeof allMerchants !== 'undefined') ? allMerchants.find(m => m.id == p.merchant_id) : null;
const actualStoreName = p.merchant_name || (merchantObj ? merchantObj.store_name : null) || 'متجرنا';
const safeUsername = merchantObj ? merchantObj.username : '';
const safeCurrency = escapeHTML(p.currency || 'YER');
let categoryText = p.leaf_category || p.type || p.department || '';
if (categoryText.includes('>')) {
const catParts = categoryText.split('>').map(s => s.trim()).filter(Boolean);
categoryText = catParts[catParts.length - 1] || '';
}
const categoryPathHtml = categoryText ? `<span class="sc-cat-mini">${escapeHTML(categoryText)}</span>` : '';
const merchantChipHtml = isStorePage ? '' : `
<div class="merchant-mini-label" onclick="event.stopPropagation(); openListDetailView('store', '${p.merchant_id}', '${escapeAttr(actualStoreName)}', '', '${safeUsername}')">
<i class="fas fa-store"></i> <span>${escapeHTML(actualStoreName)}</span>
</div>`;
const isFav = (typeof favorites !== 'undefined' && favorites.includes(p.id)) ? 'active' : '';
const productDataEscaped = JSON.stringify(p).replace(/'/g, "&#39;");
return `<div class="product-card-compact fast-card" data-listing-id="${p.listing_id || p.id}" onclick='toggleProductModal(true, ${productDataEscaped})'>
<div class="compact-img-wrapper">
${pInfo.discount > 0 ? `<div class="discount-badge-mini">-%${pInfo.discount.toFixed(0)}</div>` : ''}
${window.createImageWithLoader(p.image, p.name)}
<div class="card-actions-container">
<button class="action-btn-mini fav-btn ${isFav}" data-product-id="${p.id}" onclick="event.stopPropagation(); toggleFavorite('${p.id}')"><i class="fas fa-heart"></i></button>
<button class="action-btn-mini share-btn" data-id="${p.id}" data-username="${safeUsername}" data-name="${escapeAttr(p.name)}" data-desc="${escapeAttr(p.description || '')}" data-image="${escapeAttr(p.image || '')}" data-price="${pInfo.current.toLocaleString()}" data-currency="${safeCurrency}" onclick="window.shareProduct(event)"><i class="fas fa-share-alt"></i></button>
</div>
</div>
<div class="compact-details">
<div class="meta-row-mini">
${categoryPathHtml}
${merchantChipHtml}
</div>
<div class="compact-name">${escapeHTML(p.name)}</div>
<div class="modern-card-footer">
<div class="modern-price-box">
<div class="modern-price-current">
${pInfo.current.toLocaleString()} <small class="currency-label">${safeCurrency}</small>
</div>
${pInfo.discount > 0 ? `
<div class="modern-price-old-wrapper">
<span class="modern-price-old">${pInfo.original.toLocaleString()}</span>
</div>` : ''}
</div>
<!-- تم التوجيه للمعالج الذكي لتخطي طلب تسجيل الدخول الفوري في الكروت النصية القديمة أيضاً -->
<button class="modern-add-cart-btn-mini" title="أضف للسلة" onclick="event.stopPropagation(); window.handleCardAddToCartClick(${productDataEscaped})">
<i class="fas fa-shopping-basket"></i>
</button>
</div>
</div>
</div>`;
};
window.createHeroProductCard = function(p) {
const escapeHTML = window.escapeHTML;
const escapeAttr = window.escapeAttr;
const pInfo = window.parsePrice(p);
const merchantObj = (typeof allMerchants !== 'undefined') ? allMerchants.find(m => m.id == p.merchant_id) : null;
const actualStoreName = p.merchant_name || (merchantObj ? merchantObj.store_name : null) || 'متجرنا';
const safeUsername = merchantObj ? merchantObj.username : '';
const safeCurrency = escapeHTML(p.currency || 'YER');
const isFav = (typeof favorites !== 'undefined' && favorites.includes(p.id)) ? 'active' : '';
const productDataEscaped = JSON.stringify(p).replace(/'/g, "&#39;");
return `
<div class="product-card-hero fast-card" data-listing-id="${p.listing_id || p.id}" onclick='toggleProductModal(true, ${productDataEscaped})'>
<div class="hero-img-wrapper">
${pInfo.discount > 0 ? `<div class="discount-badge-mini" style="top:8px; right:8px;">خصم ${pInfo.discount.toFixed(0)}%</div>` : ''}
${window.createImageWithLoader(p.image, p.name, '', 'detail')}
</div>
<div class="card-actions-container" style="top:8px; left:8px;">
<button class="action-btn-mini fav-btn ${isFav}" data-product-id="${p.id}" onclick="event.stopPropagation(); toggleFavorite('${p.id}')"><i class="fas fa-heart"></i></button>
<button class="action-btn-mini share-btn" data-id="${p.id}" data-username="${safeUsername}" data-name="${escapeAttr(p.name)}" data-desc="${escapeAttr(p.mainDescription || '')}" data-image="${escapeAttr(p.image || '')}" data-price="${pInfo.current.toLocaleString()}" data-currency="${safeCurrency}" onclick="window.shareProduct(event)"><i class="fas fa-share-alt"></i></button>
</div>
<div class="hero-details">
<div class="hero-merchant"><i class="fas fa-store"></i> ${escapeHTML(actualStoreName)}</div>
<div class="hero-name">${escapeHTML(p.name)}</div>
<div class="hero-price-row">
<span class="hero-price">${pInfo.current.toLocaleString()} <small>${safeCurrency}</small></span>
${pInfo.discount > 0 ? `<span class="hero-old-price">${pInfo.original.toLocaleString()}</span>` : ''}
</div>
</div>
</div>`;
};
window.createProductListItem = function(p) {
const escapeHTML = window.escapeHTML;
const escapeAttr = window.escapeAttr;
const pInfo = window.parsePrice(p);
const merchantObj = (typeof allMerchants !== 'undefined') ? allMerchants.find(m => m.id == p.merchant_id) : null;
const actualStoreName = p.merchant_name || (merchantObj ? merchantObj.store_name : null) || 'متجرنا';
const safeUsername = merchantObj ? merchantObj.username : '';
const safeCurrency = escapeHTML(p.currency || 'YER');
const isFav = (typeof favorites !== 'undefined' && favorites.includes(p.id)) ? 'active' : '';
let categoryText = p.leaf_category || p.type || p.department || '';
if (categoryText.includes('>')) {
const catParts = categoryText.split('>').map(s => s.trim()).filter(Boolean);
categoryText = catParts[catParts.length - 1] || '';
}
const categoryPathHtml = categoryText ? `<div class="list-item-category">${escapeHTML(categoryText)}</div>` : '';
return `<div class="product-list-item fast-card" data-listing-id="${p.listing_id || p.id}" onclick="openProductDetails('${p.listing_id || p.id}')">
<div class="list-item-img-container">${window.createImageWithLoader(p.image, p.name, 'list-item-img')}</div>
<div class="list-item-details">
${categoryPathHtml}
<div class="merchant-mini-label" style="margin-bottom: 2px;" onclick="event.stopPropagation(); openListDetailView('store', '${p.merchant_id}', '${escapeAttr(actualStoreName)}', '', '${safeUsername}')">
<i class="fas fa-store"></i><span>${escapeHTML(actualStoreName)}</span>
</div>
<div class="list-item-name">${escapeHTML(p.name)}</div>
<div class="list-item-footer">
<div class="list-item-price">
${pInfo.current.toLocaleString()} <small>${safeCurrency}</small>
${pInfo.discount > 0 ? `<span class="list-item-old-price">${pInfo.original.toLocaleString()}</span>` : ''}
</div>
<div class="card-actions-container" style="position:static; flex-direction:row; gap:4px;">
<button class="action-btn-mini fav-btn ${isFav}" data-product-id="${p.id}" onclick="event.stopPropagation(); toggleFavorite('${p.id}')"><i class="fas fa-heart"></i></button>
<button class="action-btn-mini share-btn" data-id="${p.id}" data-username="${safeUsername}" data-name="${escapeAttr(p.name)}" data-desc="${escapeAttr(p.mainDescription || '')}" data-image="${escapeAttr(p.image || '')}" data-price="${pInfo.current.toLocaleString()}" data-currency="${safeCurrency}" onclick="window.shareProduct(event)"><i class="fas fa-share-alt"></i></button>
</div>
</div>
</div>
</div>`;
};
window.applyProductLiveUpdate = function(updatedProd) {
if (typeof allProducts !== 'undefined') {
const idx = allProducts.findIndex(p => p.listing_id === updatedProd.listing_id);
if (idx > -1) allProducts[idx] = { ...allProducts[idx], ...updatedProd };
}
const cards = document.querySelectorAll(`[data-listing-id="${updatedProd.listing_id}"]`);
cards.forEach(card => {
const priceElem = card.querySelector('.modern-price-current') ||
card.querySelector('.compact-price') ||
card.querySelector('.sic-price') ||
card.querySelector('.ultra-current-price') ||
card.querySelector('.list-item-price');
if (priceElem) {
const currency = updatedProd.currency || 'YER';
const pInfo = window.parsePrice(updatedProd);
if(priceElem.querySelector('.p-price')) {
priceElem.querySelector('.p-price').textContent = pInfo.current.toLocaleString();
priceElem.querySelector('.p-currency').textContent = currency;
} else {
priceElem.innerHTML = `${pInfo.current.toLocaleString()} <small>${currency}</small>`;
}
card.style.transition = "box-shadow 0.4s ease, transform 0.4s ease";
card.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.5)";
card.style.transform = "scale(1.02)";
setTimeout(() => {
card.style.boxShadow = "";
card.style.transform = "";
}, 2000);
}
});
if (typeof currentModalProduct !== 'undefined' &&
currentModalProduct &&
currentModalProduct.listing_id === updatedProd.listing_id) {
Object.assign(currentModalProduct, updatedProd);
if (typeof renderProductDetailPage === 'function') renderProductDetailPage(updatedProd);
}
};
window.removeProductFromUI = function(pid) {
document.querySelectorAll(`[data-listing-id="${pid}"]`).forEach(card => {
card.style.opacity = '0';
card.style.transform = 'scale(0.85)';
setTimeout(() => card.remove(), 400);
});
};
window.shareProduct = async function(event) {
event.stopPropagation();
const btn = event.currentTarget;
const data = {
id: btn.dataset.id,
name: btn.dataset.name,
desc: btn.dataset.desc,
username: btn.dataset.username,
image: btn.dataset.image,
price: btn.dataset.price,
currency: btn.dataset.currency
};
if (typeof window.openShareModal === 'function') {
window.openShareModal(data);
return;
}
const currentStore = (window.App && window.App.currentStoreId) ? window.App.currentStoreId : '';
let username = data.username && data.username.trim() !== '' ? data.username : (currentStore || 'store');
const baseUrl = typeof BASE_URL !== 'undefined' ? BASE_URL : window.location.origin;
const url = `${baseUrl}/${username}/p${data.id}`;
const shareData = { title: data.name, text: data.desc, url: url };
if (navigator.share) {
try { await navigator.share(shareData); } catch (err) {}
} else {
navigator.clipboard.writeText(url).then(() => {
if(typeof showToast === 'function') showToast('تم نسخ رابط المنتج! 📋', 'success');
}).catch(() => {
if(typeof showToast === 'function') showToast('فشل نسخ الرابط', 'error');
});
}
};
window.removeProductCompletely = function(listingId, productName) {
if (typeof cart !== 'undefined') {
const initialCartLength = cart.length;
cart = cart.filter(c => String(c.listing_id) !== String(listingId));
if (cart.length !== initialCartLength) {
if(typeof saveLocalData === 'function') saveLocalData();
if(typeof updateCartUI === 'function') updateCartUI();
if(typeof showToast === 'function') showToast(`تم إزالة "${productName}" من السلة لانتهاء الكمية 📦`, 'error');
}
}
if (typeof allProducts !== 'undefined') {
allProducts = allProducts.filter(p => String(p.listing_id) !== String(listingId));
}
window.requestAnimationFrame(() => {
document.querySelectorAll(`[data-listing-id="${listingId}"]`).forEach(card => {
card.style.transition = 'all 0.3s ease';
card.style.opacity = '0';
card.style.transform = 'scale(0.85)';
setTimeout(() => card.remove(), 300);
});
});
if (typeof currentModalProduct !== 'undefined' && currentModalProduct && String(currentModalProduct.listing_id) === String(listingId)) {
if(typeof toggleProductModal === 'function') toggleProductModal(false);
}
};
