window.currentModalProduct = null;
window.selectedOption = null;
const ProductDetailUI = {
template: `
<div class="page-overlay transition-element" id="product-detail-page" style="z-index: 1001;">
<!-- شاشة التحميل الذكية العصرية (الهيكلية) المتوافقة مع جميع الأجهزة -->
<div id="pd-loading-screen" style="position: absolute; inset: 0; background: var(--bg-body); z-index: 150; display: none; flex-direction: column; opacity: 0; transition: opacity 0.25s ease;">
<!-- سكيلتون مساحة الصورة العلوية -->
<div class="pd-skeleton-shimmer" style="width: 100%; height: 50vh; opacity: 0.85;"></div>
<!-- سكيلتون المحتوى الداخلي -->
<div style="padding: 30px 25px; background: var(--bg-body); border-top-left-radius: 30px; border-top-right-radius: 30px; margin-top: -30px; position: relative; z-index: 51; flex: 1;">
<!-- سكيلتون اسم المنتج -->
<div class="pd-skeleton-shimmer" style="height: 28px; width: 75%; margin-bottom: 15px; border-radius: 8px;"></div>
<!-- سكيلتون شريحة المتجر -->
<div class="pd-skeleton-shimmer" style="height: 52px; width: 100%; margin: 20px 0; border-radius: 16px;"></div>
<!-- سكيلتون الوصف والتفاصيل -->
<div class="pd-skeleton-shimmer" style="height: 16px; width: 100%; margin-bottom: 12px; border-radius: 4px;"></div>
<div class="pd-skeleton-shimmer" style="height: 16px; width: 95%; margin-bottom: 12px; border-radius: 4px;"></div>
<div class="pd-skeleton-shimmer" style="height: 16px; width: 80%; margin-bottom: 12px; border-radius: 4px;"></div>
<div class="pd-skeleton-shimmer" style="height: 16px; width: 50%; border-radius: 4px;"></div>
</div>
</div>
<!-- الهيدر الثابت -->
<div class="page-header transparent-header" style="position: absolute; top: 15px; left: 0; right: 0; padding: 0 20px; z-index: 60; display: flex; justify-content: space-between; align-items: center; width: 100%; pointer-events: none;">
<button class="icon-btn" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; pointer-events: auto; background: rgba(255,255,255,0.85); color: var(--text-main); border: 1px solid var(--border); box-shadow: var(--shadow-sm); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer;" onclick="toggleProductModal(false)">
<i class="fas fa-arrow-right"></i>
</button>
<div id="pd-top-actions" style="display: flex; gap: 10px; pointer-events: auto;">
<button id="pd-fav-btn" class="icon-btn fav-btn" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.85); border: 1px solid var(--border); box-shadow: var(--shadow-sm); backdrop-filter: blur(10px); cursor: pointer; transition: transform 0.2s;">
<i class="fas fa-heart"></i>
</button>
<button id="pd-share-btn" class="icon-btn share-btn" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.85); border: 1px solid var(--border); box-shadow: var(--shadow-sm); backdrop-filter: blur(10px); cursor: pointer; transition: transform 0.2s; color: var(--primary);">
<i class="fas fa-share-alt"></i>
</button>
</div>
</div>
<div class="page-body">
<!-- حاوية الصورة الثابتة مدعومة بالهيكل التفاعلي أثناء التحميل المباشر -->
<div class="pd-image-container">
<div class="image-container-wrapper">
<!-- هيكل تحميل الصورة الرئيسي لصفحة التفاصيل -->
<div id="pd-img-skeleton" class="pd-skeleton-shimmer" style="position: absolute; inset: 0; z-index: 5; display: none; opacity: 0; transition: opacity 0.25s ease;"></div>
<i class="fas fa-image placeholder-icon" id="pd-img-placeholder" style="z-index: 4;"></i>
<img id="pd-main-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Product" decoding="async" fetchpriority="high" style="object-fit: contain !important; background-color: var(--bg-card); opacity: 0; transition: opacity 0.3s ease; z-index: 3;">
</div>
</div>
<div class="pd-content">
<h2 id="pd-name"></h2>
<!-- شريحة التاجر الثابتة -->
<div id="pd-merchant-chip" class="merchant-modern-chip pd-merchant-chip" style="display:none;">
<div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
<div class="chip-top">
<i class="fas fa-store chip-icon" style="font-size:1.2rem;"></i>
<span class="chip-name" id="pd-store-name" style="font-size: 1rem;"></span>
</div>
<i id="pd-store-arrow" class="fas fa-chevron-left" style="color:var(--text-muted); font-size:0.9rem;"></i>
</div>
<div class="chip-bottom" id="pd-store-username-wrapper" style="margin-top:8px; justify-content: flex-start;">
<span class="chip-username" id="pd-store-username" style="font-size:0.85rem; padding:4px 12px;"></span>
</div>
</div>
<p id="pd-desc"></p>
</div>
<div class="related-products-section" id="pd-related-section" style="display:none;">
<div class="related-section-head">
<h3><i class="fas fa-layer-group"></i> <span id="pd-related-title">منتجات من نفس القسم</span></h3>
</div>
<div class="horizontal-scroller virtual-scroller" id="pd-related-grid" style="padding-bottom: 20px;"></div>
</div>
</div>
<div class="page-footer">
<button id="main-buy-btn" class="btn-action primary" onclick="handleBuyClick()">
<span id="buy-btn-text" style="display:flex; align-items:center; gap:10px;"><i class="fas fa-shopping-bag"></i> أضف للسلة</span>
<span id="main-buy-price"></span>
</button>
</div>
<!-- النافذة المنبثقة للخيارات (Bottom Sheet) -->
<div id="options-sheet-overlay" class="sheet-overlay" onclick="closeOptionsSheet()"></div>
<div id="options-bottom-sheet" class="options-bottom-sheet">
<div class="sheet-header">
<h3 id="sheet-title">اختر المواصفات</h3>
<button class="sheet-close-btn" onclick="closeOptionsSheet()"><i class="fas fa-times"></i></button>
</div>
<div class="sheet-content">
<div class="sheet-product-preview">
<!-- حاوية المعاينة مدمجة مع سكيلتون تحميل مخصص -->
<div class="image-container-wrapper" style="width: 80px; height: 80px; position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0;">
<!-- سكيلتون صورة المعاينة المصغرة -->
<div id="sheet-img-skeleton" class="pd-skeleton-shimmer" style="position: absolute; inset: 0; z-index: 3; display: none; opacity: 0; transition: opacity 0.2s ease;"></div>
<img id="sheet-preview-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="preview" style="width: 100%; height: 100%; object-fit: cover; opacity: 0; z-index: 2;">
</div>
<div class="sheet-product-info">
<span id="sheet-price" class="sheet-price"></span>
<span id="sheet-stock-status" style="color: var(--text-muted); font-size: 0.9rem; margin-top: 5px;"></span>
</div>
</div>
<div id="sheet-options-container" style="margin-bottom: 20px;"></div>
<div class="qty-section" style="display: flex; align-items: center; justify-content: space-between; padding-top: 15px; border-top: 1px dashed var(--border);">
<span style="font-weight: 800; font-size: 1.1rem; color: var(--text-main);">الكمية:</span>
<div class="qty-controls" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 4px;">
<div class="qty-btn" onclick="adjustModalQty(-1)"><i class="fas fa-minus"></i></div>
<input id="pd-qty" type="number" value="1" min="1" readonly style="width: 45px; text-align: center; border: none; background: transparent; font-weight:900; font-size:1.2rem; color: var(--text-main);">
<div class="qty-btn" onclick="adjustModalQty(1)"><i class="fas fa-plus"></i></div>
</div>
</div>
</div>
<div class="sheet-footer">
<button id="confirm-add-btn" class="btn-action primary" style="width: 100%; font-size: 1.1rem; padding: 15px; border-radius: 14px;" onclick="confirmAddToCart()">تأكيد وإضافة للسلة</button>
</div>
</div>
</div>
`,
dom: {},
init: function() {
if (!document.getElementById('product-detail-page')) {
document.body.insertAdjacentHTML('beforeend', this.template);
}
this.dom = {
page: document.getElementById('product-detail-page'),
loadingScreen: document.getElementById('pd-loading-screen'),
img: document.getElementById('pd-main-img'),
imgPlaceholder: document.getElementById('pd-img-placeholder'),
imgSkeleton: document.getElementById('pd-img-skeleton'),
name: document.getElementById('pd-name'),
desc: document.getElementById('pd-desc'),
buyPrice: document.getElementById('main-buy-price'),
buyText: document.getElementById('buy-btn-text'),
buyBtn: document.getElementById('main-buy-btn'),
favBtn: document.getElementById('pd-fav-btn'),
shareBtn: document.getElementById('pd-share-btn'),
merchantChip: document.getElementById('pd-merchant-chip'),
storeName: document.getElementById('pd-store-name'),
storeUsername: document.getElementById('pd-store-username'),
storeUsernameWrapper: document.getElementById('pd-store-username-wrapper'),
storeArrow: document.getElementById('pd-store-arrow'),
relatedSection: document.getElementById('pd-related-section'),
relatedGrid: document.getElementById('pd-related-grid'),
relatedTitle: document.getElementById('pd-related-title'),
sheetOverlay: document.getElementById('options-sheet-overlay'),
sheet: document.getElementById('options-bottom-sheet'),
sheetTitle: document.getElementById('sheet-title'),
sheetPreviewImg: document.getElementById('sheet-preview-img'),
sheetImgSkeleton: document.getElementById('sheet-img-skeleton'),
sheetPrice: document.getElementById('sheet-price'),
sheetStockStatus: document.getElementById('sheet-stock-status'),
sheetOptionsContainer: document.getElementById('sheet-options-container'),
confirmAddBtn: document.getElementById('confirm-add-btn'),
qtyInput: document.getElementById('pd-qty')
};
this.setupImageHandlers();

// إغلاق النافذة عند النقر خارج الكرت في وضع الكمبيوتر
if (this.dom.page && !this.dom.page._backdropBound) {
this.dom.page._backdropBound = true;
this.dom.page.addEventListener('click', function(e) {
if (e.target === ProductDetailUI.dom.page) {
window.toggleProductModal(false);
}
});
}
},
setupImageHandlers: function() {
const dom = this.dom;
dom.img.onload = () => {
dom.imgPlaceholder.style.display = 'none';
dom.img.style.opacity = '1';
dom.imgSkeleton.style.opacity = '0';
setTimeout(() => { dom.imgSkeleton.style.display = 'none'; }, 250);
dom.loadingScreen.style.opacity = '0';
dom.loadingScreen.style.pointerEvents = 'none';
setTimeout(() => { dom.loadingScreen.style.display = 'none'; }, 250);
};
dom.img.onerror = () => {
dom.imgPlaceholder.classList.remove('fa-image');
dom.imgPlaceholder.classList.add('fa-image-slash');
dom.imgPlaceholder.style.color = '#f87171';
dom.img.style.opacity = '0';
dom.imgSkeleton.style.opacity = '0';
setTimeout(() => { dom.imgSkeleton.style.display = 'none'; }, 250);
dom.loadingScreen.style.opacity = '0';
dom.loadingScreen.style.pointerEvents = 'none';
setTimeout(() => { dom.loadingScreen.style.display = 'none'; }, 250);
};
dom.sheetPreviewImg.onload = () => {
dom.sheetPreviewImg.style.opacity = '1';
dom.sheetImgSkeleton.style.opacity = '0';
setTimeout(() => { dom.sheetImgSkeleton.style.display = 'none'; }, 200);
};
dom.sheetPreviewImg.onerror = () => {
dom.sheetPreviewImg.style.opacity = '0.3';
dom.sheetImgSkeleton.style.opacity = '0';
setTimeout(() => { dom.sheetImgSkeleton.style.display = 'none'; }, 200);
};
}
};
window.toggleProductModal = function(show, product = null, noHistory = false) {
    if (!ProductDetailUI.dom || !ProductDetailUI.dom.page) {
        ProductDetailUI.init();
    }
    const dom = ProductDetailUI.dom;
    if (!dom || !dom.page) return;
    
    if (show && product) {
        window.currentModalProduct = product;
        window.selectedOption = null;
        
        // 💡 [الحل هنا]: إجبار سكرول الصفحة والحاوية الداخلية للعودة إلى أعلى نقطة دائماً
        dom.page.scrollTop = 0;
        const pageBody = dom.page.querySelector('.page-body');
        if (pageBody) pageBody.scrollTop = 0;

        dom.page.classList.add('open');
        
        if (typeof lockBodyScroll === 'function') lockBodyScroll(true);
        dom.loadingScreen.style.display = 'flex';
        dom.loadingScreen.style.pointerEvents = 'auto';
        
        requestAnimationFrame(() => {
            dom.loadingScreen.style.opacity = '1';
        });
        
        window.renderProductDetailPage(product);
        document.title = product.name;
        
        if (typeof verifyProductLiveState === 'function') verifyProductLiveState(product);
        
        if (!noHistory) {
            const rawRef = String(product.product_number || product.id || product.global_product_id);
            const cleanRef = rawRef.startsWith('p') ? rawRef.substring(1) : rawRef;
            const productCode = `p${cleanRef}`;
            const baseUrl = window.location.origin;
            const mUser = (window.App && window.App.currentStoreId) ? window.App.currentStoreId : 'store';
            const newUrl = `${baseUrl}/${mUser}/${productCode}`;
            history.pushState({ page: 'product', id: product.global_product_id || product.id, pNum: product.product_number }, product.name, newUrl);
        }
    } else {
        window.closeOptionsSheet();
        dom.page.classList.remove('open');
        
        if (!noHistory) {
            const baseUrl = window.location.origin;
            const currentStore = (window.App && window.App.currentStoreId) ? window.App.currentStoreId : '';
            if (currentStore) {
                history.pushState({ page: 'store' }, '', `${baseUrl}/${currentStore}`);
            } else {
                history.pushState({ page: 'main' }, '', `${baseUrl}/`);
            }
        }
        
        setTimeout(() => {
            if (document.querySelectorAll('.page-overlay.open').length === 0) {
                if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
            }
            dom.img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            dom.img.style.opacity = '0';
        }, 300);
    }
};
function collectCategoryProductsDeep(node, out) {
if (node.products && node.products.length) out.push(...node.products);
if (node.subcategories && node.subcategories.length) {
node.subcategories.forEach(sub => collectCategoryProductsDeep(sub, out));
}
return out;
}
function findRootCategoryOfProduct(categories, productId) {
function nodeContains(node) {
if (node.products && node.products.some(pr => String(pr.id) === String(productId))) return true;
if (node.subcategories && node.subcategories.length) return node.subcategories.some(nodeContains);
return false;
}
return (categories || []).find(root => nodeContains(root)) || null;
}
window.getRelatedProductsByCategoryTree = function(p) {
const excludeSelf = rl => String(rl.id) !== String(p.id);
const categories = (window.App && window.App.storeData && window.App.storeData.categories) || null;
if (categories && categories.length) {
const rootCat = findRootCategoryOfProduct(categories, p.id);
if (rootCat) {
const deep = collectCategoryProductsDeep(rootCat, []).filter(excludeSelf);
const seen = new Set();
const unique = deep.filter(rl => {
const k = String(rl.id);
if (seen.has(k)) return false;
seen.add(k);
return true;
});
if (unique.length > 0) {
return { list: unique.slice(0, 15), categoryName: rootCat.name };
}
}
}
if (typeof allProducts !== 'undefined') {
if (p.leaf_category) {
const sameLeaf = allProducts.filter(rl => rl.leaf_category === p.leaf_category && excludeSelf(rl));
if (sameLeaf.length > 0) return { list: sameLeaf.slice(0, 15), categoryName: p.leaf_category };
}
const sameType = allProducts.filter(rl => rl.type === p.type && excludeSelf(rl));
if (sameType.length > 0) return { list: sameType.slice(0, 15), categoryName: p.type };
}
return { list: [], categoryName: '' };
};
window.renderProductDetailPage = function(p) {
const dom = ProductDetailUI.dom;
const safeCurrency = p.currency || 'YER';
const mObj = (typeof allMerchants !== 'undefined') ? allMerchants.find(m => m.id == p.merchant_id) : null;
const mName = p.merchant_name || (mObj ? mObj.store_name : null) || '';
const mUser = mObj ? mObj.username : '';
const currentMode = typeof currentRenderMode !== 'undefined' ? currentRenderMode : '';
const currentMId = typeof currentMerchantId !== 'undefined' ? currentMerchantId : '';
const isAlreadyInStore = currentMode === 'store' && String(currentMId) === String(p.merchant_id);
dom.img.style.opacity = '0';
dom.imgSkeleton.style.display = 'block';
dom.imgSkeleton.style.opacity = '1';
dom.name.textContent = p.name;
// عرض الوصف مع دعم الأسطر الجديدة والنص الطويل
const descText = p.description || p.mainDescription || 'لا يوجد وصف متاح لهذا المنتج.';
dom.desc.textContent = descText;
dom.desc.style.display = descText ? 'block' : 'none';
const pInfo = typeof parsePrice === 'function' ? parsePrice(p) : { current: p.price || 0 };
dom.buyPrice.textContent = `${pInfo.current.toLocaleString()} ${safeCurrency}`;
const customCta = window.currentStorefrontConfig?.modals_customization?.product_details?.cta_button_text || 'أضف للسلة';
const stockQty = p.quantity !== undefined ? Number(p.quantity) : (p.stock !== undefined ? Number(p.stock) : null);
const isOutOfStock = p.is_out_of_stock === true || stockQty === 0;

const buyBtnEl = document.getElementById('main-buy-btn');
if (isOutOfStock) {
    if (buyBtnEl) {
        buyBtnEl.disabled = true;
        buyBtnEl.classList.add('out-of-stock-disabled');
    }
    dom.buyText.innerHTML = '<i class="fas fa-ban"></i> نفدت الكمية';
    dom.buyPrice.style.display = 'none';
} else {
    if (buyBtnEl) {
        buyBtnEl.disabled = false;
        buyBtnEl.classList.remove('out-of-stock-disabled');
    }
    dom.buyPrice.style.display = '';
    if (p.options && p.options.length > 0) {
        dom.buyText.innerHTML = '<i class="fas fa-list-ul"></i> اختر المواصفات';
    } else {
        dom.buyText.innerHTML = `<i class="fas fa-shopping-bag"></i> ${customCta}`;
    }
}
const isFav = (typeof favorites !== 'undefined' && favorites.includes(p.id));
dom.favBtn.className = isFav ? 'icon-btn fav-btn active' : 'icon-btn fav-btn';
dom.favBtn.onclick = (e) => {
e.stopPropagation();
if(typeof toggleFavorite === 'function') toggleFavorite(p.id);
dom.favBtn.classList.toggle('active');
};
dom.shareBtn.onclick = (e) => {
e.stopPropagation();
e.currentTarget.dataset.id = p.id;
e.currentTarget.dataset.name = p.name;
e.currentTarget.dataset.desc = p.description || '';
e.currentTarget.dataset.username = mUser;
e.currentTarget.dataset.image = p.image || '';
e.currentTarget.dataset.price = pInfo.current.toLocaleString();
e.currentTarget.dataset.currency = safeCurrency;
if(typeof shareProduct === 'function') shareProduct(e);
};
if (!mName) {
dom.merchantChip.style.display = 'none';
} else {
dom.merchantChip.style.display = 'flex';
dom.storeName.textContent = `يباع بواسطة: ${mName}`;
}
if (mUser && !isAlreadyInStore) {
dom.storeUsername.textContent = `@${mUser}`;
dom.storeUsernameWrapper.style.display = 'flex';
} else {
dom.storeUsernameWrapper.style.display = 'none';
}
if (isAlreadyInStore) {
dom.merchantChip.style.cursor = 'default';
dom.merchantChip.style.background = 'transparent';
dom.merchantChip.style.border = 'none';
dom.merchantChip.style.boxShadow = 'none';
dom.merchantChip.style.padding = '0';
dom.storeArrow.style.display = 'none';
dom.merchantChip.onclick = null;
} else {
dom.merchantChip.style.cursor = 'pointer';
dom.merchantChip.style.background = '';
dom.merchantChip.style.border = '';
dom.merchantChip.style.boxShadow = '';
dom.merchantChip.style.padding = '';
dom.storeArrow.style.display = 'block';
dom.merchantChip.onclick = () => {
window.toggleProductModal(false);
setTimeout(() => {
if(typeof openListDetailView === 'function') openListDetailView('store', p.merchant_id, mName, '', mUser);
}, 300);
};
}
const relResult = window.getRelatedProductsByCategoryTree(p);
const rel = relResult.list;
if (rel.length > 0 && typeof window.renderThousandsOfProducts === 'function') {
dom.relatedSection.style.display = 'block';
if (dom.relatedTitle) {
dom.relatedTitle.textContent = relResult.categoryName ? `منتجات من: ${relResult.categoryName}` : 'منتجات من نفس القسم';
}
window.renderThousandsOfProducts(rel, dom.relatedGrid, false);
} else {
dom.relatedSection.style.display = 'none';
dom.relatedGrid.innerHTML = '';
}
dom.imgPlaceholder.style.display = 'block';
const optimizedUrl = typeof getOptimizedImageUrl === 'function' ? getOptimizedImageUrl(p.image, 'detail') : p.image;
dom.img.src = optimizedUrl;
setTimeout(() => {
if (dom.loadingScreen.style.opacity === '1') {
dom.loadingScreen.style.opacity = '0';
dom.loadingScreen.style.pointerEvents = 'none';
setTimeout(() => { dom.loadingScreen.style.display = 'none'; }, 250);
}
}, 1200);
};
window.handleBuyClick = function() {
const p = window.currentModalProduct;
if (!p) return;
const stockQty = p.quantity !== undefined ? Number(p.quantity) : (p.stock !== undefined ? Number(p.stock) : null);
if (p.is_out_of_stock === true || stockQty === 0) {
    if (typeof showToast === 'function') showToast('عذراً، هذا المنتج غير متوفر حالياً (نفدت الكمية)');
    return;
}
if (p.options && p.options.length > 0) {
window.openOptionsSheet();
} else {
if (typeof addToCart === 'function') {
addToCart(p, 1, null);
window.toggleProductModal(false);
}
}
};
window.openOptionsSheet = function() {
const p = window.currentModalProduct;
if (!p) return;
const dom = ProductDetailUI.dom;
const safeCurrency = p.currency || 'YER';
const pInfo = typeof parsePrice === 'function' ? parsePrice(p) : { current: p.price || 0 };
dom.sheetPreviewImg.style.opacity = '0';
dom.sheetImgSkeleton.style.display = 'block';
dom.sheetImgSkeleton.style.opacity = '1';
const highQualityPreview = typeof getOptimizedImageUrl === 'function'
? getOptimizedImageUrl(p.image, 'option')
: p.image;
dom.sheetPreviewImg.src = highQualityPreview;
dom.sheetPrice.textContent = `${pInfo.current.toLocaleString()} ${safeCurrency}`;
dom.sheetTitle.textContent = p.variation_title || 'اختر المواصفات';
dom.qtyInput.value = 1;
window.selectedOption = null;
dom.sheetOptionsContainer.textContent = '';
const fragment = document.createDocumentFragment();
p.options.forEach((opt, i) => {
const chip = document.createElement('div');
const isOutOfStock = opt.quantity_type === 'tracked' && parseInt(opt.quantity) <= 0;
chip.className = 'option-chip' + (isOutOfStock ? ' out-of-stock' : '');
chip.setAttribute('role', 'button');
chip.setAttribute('aria-label', opt.name + (isOutOfStock ? ' - نفذت الكمية' : ''));
chip.textContent = opt.name;
if (!isOutOfStock) {
chip.onclick = () => window.selectOption(i, chip);
}
fragment.appendChild(chip);
});
dom.sheetOptionsContainer.appendChild(fragment);
dom.confirmAddBtn.innerHTML = '<i class="fas fa-cart-plus"></i> الرجاء اختيار المواصفات';
dom.confirmAddBtn.classList.add('disabled');
dom.confirmAddBtn.style.opacity = '0.6';
dom.sheetOverlay.classList.add('active');
dom.sheet.classList.add('active');
};
window.closeOptionsSheet = function() {
const dom = ProductDetailUI.dom;
if(dom.sheetOverlay) dom.sheetOverlay.classList.remove('active');
if(dom.sheet) dom.sheet.classList.remove('active');
};
window.selectOption = function(index, element) {
const p = window.currentModalProduct;
if (!p) return;
const dom = ProductDetailUI.dom;
const safeCurrency = p.currency || 'YER';
dom.sheetOptionsContainer.querySelectorAll('.option-chip').forEach(el => el.classList.remove('selected'));
element.classList.add('selected');
window.selectedOption = p.options[index];
dom.sheetPreviewImg.style.opacity = '0';
dom.sheetImgSkeleton.style.display = 'block';
dom.sheetImgSkeleton.style.opacity = '1';
if(window.selectedOption && window.selectedOption.custom_price != null) {
dom.sheetPrice.textContent = `${parseFloat(window.selectedOption.custom_price).toLocaleString()} ${safeCurrency}`;
} else {
const pInfo = typeof parsePrice === 'function' ? parsePrice(p) : { current: p.price || 0 };
dom.sheetPrice.textContent = `${pInfo.current.toLocaleString()} ${safeCurrency}`;
}

// عرض حالة المخزون للخيار المختار
if (dom.sheetStockStatus) {
if (window.selectedOption && window.selectedOption.quantity_type === 'tracked') {
const q = parseInt(window.selectedOption.quantity) || 0;
if (q <= 0) {
dom.sheetStockStatus.textContent = 'نفدت الكمية 🔴';
dom.sheetStockStatus.style.color = 'var(--danger)';
} else if (q <= 5) {
dom.sheetStockStatus.textContent = `متبقي ${q} قطع فقط 🔥`;
dom.sheetStockStatus.style.color = '#f59e0b';
} else {
dom.sheetStockStatus.textContent = `متوفر في المخزون (${q} قطعة) 🟢`;
dom.sheetStockStatus.style.color = '#10b981';
}
} else {
const q = p.quantity !== undefined ? parseInt(p.quantity) : (p.stock !== undefined ? parseInt(p.stock) : null);
if (q !== null && !isNaN(q)) {
if (q <= 0) {
dom.sheetStockStatus.textContent = 'نفدت الكمية 🔴';
dom.sheetStockStatus.style.color = 'var(--danger)';
} else if (q <= 5) {
dom.sheetStockStatus.textContent = `متبقي ${q} قطع فقط 🔥`;
dom.sheetStockStatus.style.color = '#f59e0b';
} else {
dom.sheetStockStatus.textContent = 'متوفر في المخزون 🟢';
dom.sheetStockStatus.style.color = '#10b981';
}
} else {
dom.sheetStockStatus.textContent = 'متوفر 🟢';
dom.sheetStockStatus.style.color = '#10b981';
}
}
}
const rawOptionImg = window.selectedOption.image ? window.selectedOption.image : p.image;
const optimizedOptionImg = typeof getOptimizedImageUrl === 'function'
? getOptimizedImageUrl(rawOptionImg, 'option')
: rawOptionImg;
dom.sheetPreviewImg.src = optimizedOptionImg;
dom.qtyInput.value = 1;
dom.confirmAddBtn.innerHTML = '<i class="fas fa-cart-plus"></i> تأكيد وإضافة للسلة';
dom.confirmAddBtn.classList.remove('disabled');
dom.confirmAddBtn.style.opacity = '1';
};
window.adjustModalQty = function(delta) {
const dom = ProductDetailUI.dom;
if(!dom.qtyInput) return;
let newVal = (parseInt(dom.qtyInput.value) || 1) + delta;
if(newVal < 1) newVal = 1;
if (window.currentModalProduct && window.currentModalProduct.quantity_type === 'tracked') {
let maxQty = window.selectedOption && window.selectedOption.quantity_type === 'tracked' ? window.selectedOption.quantity : window.currentModalProduct.quantity;
if (newVal > maxQty) {
if (typeof showToast === 'function') showToast('عذراً، تجاوزت الكمية المتوفرة', 'error');
return;
}
}
dom.qtyInput.value = newVal;
};
window.confirmAddToCart = function() {
const p = window.currentModalProduct;
const dom = ProductDetailUI.dom;
if (!p) return;
if (p.options && p.options.length > 0 && !window.selectedOption) {
if (typeof showToast === 'function') showToast('يرجى اختيار المواصفات أولاً', 'warning');
dom.sheetOptionsContainer.style.transform = 'translateX(5px)';
setTimeout(() => dom.sheetOptionsContainer.style.transform = 'translateX(-5px)', 100);
setTimeout(() => dom.sheetOptionsContainer.style.transform = 'translateX(5px)', 200);
setTimeout(() => dom.sheetOptionsContainer.style.transform = 'translateX(0)', 300);
return;
}
if (typeof addToCart === 'function') {
addToCart(p, parseInt(dom.qtyInput.value || 1), window.selectedOption);
window.closeOptionsSheet();
window.toggleProductModal(false);
}
};

window.openProductDetails = function(productId) {
    let p = null;
    if (typeof allProducts !== 'undefined' && Array.isArray(allProducts)) {
        p = allProducts.find(item => String(item.id) === String(productId) || String(item.listing_id) === String(productId));
    }
    if (!p && window.App?.storeData?.products) {
        p = window.App.storeData.products.find(item => String(item.id) === String(productId) || String(item.listing_id) === String(productId));
    }
    if (p && typeof window.toggleProductModal === 'function') {
        window.toggleProductModal(true, p);
    }
};

ProductDetailUI.init();

