// =========================================================================
// ملف cart.js - نظام السلة المنفصلة الذكية (Isolated Cart) + أنيميشن عصري
// =========================================================================

console.log("🛒 جاري تهيئة وحدة السلة المنفصلة (المستقلة لكل متجر)...");

// 1. دالة ذكية لمعرفة المتجر الحالي وتوليد مفتاح خاص به
window.getIsolatedCartKey = function() {
    let storeId;

    // الأولوية القصوى دائماً لمعرف المتجر الفعلي اللي حدده محرك التطبيق (App)
    if (typeof App !== 'undefined' && App.currentStoreId) {
        storeId = App.currentStoreId.toLowerCase();
    } else {
        // حل بديل: نفس منطق App.init بالضبط (رابط المسار ثم ?store= ثم الافتراضي)
        // هذا يضمن نفس مفتاح السلة سواء كانت App جاهزة بعد أو لا
        const pathParts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
        const ignoredPaths = ['', 'index.html', 'merchant-app.html', 'merchant-app', 'merchant-dashboard', 'auth-page.html', 'login', 'api.php'];
        const urlParams = new URLSearchParams(window.location.search);

        let storeFromPath = null;
        if (pathParts[0].toLowerCase() === 'merchant-app' && pathParts.length > 1) {
            storeFromPath = pathParts[1];
        } else if (pathParts.length > 0 && !ignoredPaths.includes(pathParts[0].toLowerCase())) {
            storeFromPath = pathParts[0];
        }

        storeId = (storeFromPath || urlParams.get('store') || 'nalshi').toLowerCase();
    }

    return `cart_isolated_${storeId}`;
};

// 2. دالة استعادة السلة الخاصة بالمتجر الحالي فقط
window.loadIsolatedCart = function() {
    const cartKey = window.getIsolatedCartKey();
    try {
        const savedCart = localStorage.getItem(cartKey);
        window.cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
        window.cart = [];
    }
    window.updateCartCounters(); // تحديث العدادات فقط
};

// 3. حفظ السلة الخاصة بالمتجر الحالي
window.saveCartToLocalStorage = function() {
    const cartKey = window.getIsolatedCartKey();
    try {
        localStorage.setItem(cartKey, JSON.stringify(window.cart || []));
    } catch (e) {
        console.error("⚠️ فشل حفظ السلة:", e);
    }
};

const escapeHTML = window.escapeHTML || function(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

// ==========================================
// 4. واجهة السلة العصرية (أنيميشن + تحميل)
// ==========================================
const CartUI = {
    template: `
        <style>
            /* تنسيقات السلة العصرية */
            .modern-cart-overlay {
                position: fixed; inset: 0; background: var(--theme-modal-overlay, rgba(0, 0, 0, 0.4)); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
            }
            .modern-cart-overlay.active { opacity: 1; pointer-events: auto; }
            
            .modern-cart-panel {
                position: fixed; bottom: 0; left: 0; right: 0; background: var(--theme-modal-bg, var(--theme-card-bg, var(--bg-card))); color: var(--theme-text-primary, var(--text-main)); z-index: 10001;
                border-radius: 30px 30px 0 0; padding: 20px; box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
                transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                max-height: 85vh; display: flex; flex-direction: column;
            }
            .modern-cart-panel.active { transform: translateY(0); }
            
            .cart-drag-handle { width: 50px; height: 5px; background: var(--theme-modal-handle, var(--theme-border, var(--border))); border-radius: 10px; margin: 0 auto 15px; }
            
            .cart-panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--theme-border, var(--border)); padding-bottom: 15px; margin-bottom: 15px; }
            .cart-panel-header h3 { margin: 0; font-weight: 900; display: flex; align-items: center; gap: 10px; font-size: 1.3rem; color: var(--theme-text-primary, var(--text-main)); }
            .cart-close-btn { background: var(--theme-surface, var(--theme-card-bg, var(--bg-card))); border: 1px solid var(--theme-border, var(--border)); width: 35px; height: 35px; border-radius: 50%; color: var(--theme-text-primary, var(--text-main)); display: flex; align-items: center; justify-content: center; cursor: pointer; }
            
            /* تأثير التحميل العصري */
            .cart-loading-shimmer {
                width: 100%; height: 90px; background: linear-gradient(90deg, var(--theme-card-bg, var(--bg-card)) 25%, var(--theme-border, var(--border)) 50%, var(--theme-card-bg, var(--bg-card)) 75%);
                background-size: 200% 100%; animation: cartShimmer 1.5s infinite; border-radius: 16px; margin-bottom: 15px;
            }
            @keyframes cartShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            
            .cart-panel-body { flex: 1; overflow-y: auto; padding-bottom: 20px; }
            .cart-panel-footer { padding-top: 15px; border-top: 1px solid var(--theme-border, var(--border)); }
        </style>

        <div class="modern-cart-overlay" id="cart-modern-overlay" onclick="window.closeModernCart()"></div>
        <div class="modern-cart-panel" id="cart-modern-panel">
            <div class="cart-drag-handle"></div>
            <div class="cart-panel-header">
                <h3><i class="fas fa-shopping-bag" style="color: var(--primary);"></i> سلة المتجر</h3>
                <button class="cart-close-btn" onclick="window.closeModernCart()"><i class="fas fa-times"></i></button>
            </div>
            
            <!-- حالة التحميل السريع -->
            <div id="cart-loading-state">
                <div class="cart-loading-shimmer"></div>
                <div class="cart-loading-shimmer"></div>
            </div>

            <!-- محتوى السلة الفعلي -->
            <div class="cart-panel-body" id="cart-page-items" style="display: none;"></div>

            <div class="cart-panel-footer">
                <button id="checkout-btn" class="btn-action primary" style="width: 100%; font-size: 1.1rem; padding: 15px; border-radius: 16px; font-weight: 900;" onclick="handleCheckoutClick()" disabled>إتمام الطلب</button>
            </div>
        </div>
    `,

    init: function() {
        if (!document.getElementById('cart-modern-panel')) {
            document.body.insertAdjacentHTML('beforeend', this.template);
        }
        window.loadIsolatedCart();
    }
};

// ==========================================
// 5. محرك الفتح والإغلاق العصري
// ==========================================
window.openModernCart = function() {
    const panel = document.getElementById('cart-modern-panel');
    const overlay = document.getElementById('cart-modern-overlay');
    const loader = document.getElementById('cart-loading-state');
    const items = document.getElementById('cart-page-items');

    if (!panel) return;

    window.loadIsolatedCart(); // تأكيد تحميل سلة المتجر الحالي

    // إظهار الخلفية واللوحة
    overlay.classList.add('active');
    panel.classList.add('active');
    if (typeof lockBodyScroll === 'function') lockBodyScroll(true);

    // تفعيل تأثير التحميل السريع (يعطي إحساساً بالاحترافية)
    items.style.display = 'none';
    loader.style.display = 'block';

    setTimeout(() => {
        loader.style.display = 'none';
        items.style.display = 'block';
        window.renderCartContent(); // رسم المنتجات
    }, 450); // مدة التحميل الوهمي الجميل
};

window.closeModernCart = function() {
    const panel = document.getElementById('cart-modern-panel');
    const overlay = document.getElementById('cart-modern-overlay');
    if (panel) panel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
    
    // إعادة ألوان الأزرار السفلية
    if (typeof updateBottomNavActive === 'function') updateBottomNavActive('home');
    if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('home');
};

// تجاوز وظيفة togglePage لفتح السلة العصرية بدلاً من القديمة
const originalTogglePage = window.togglePage;
window.togglePage = function(pageId, show, noHistory) {
    if (pageId === 'cart-page') {
        if (show) window.openModernCart();
        else window.closeModernCart();
        return;
    }
    if (originalTogglePage) originalTogglePage(pageId, show, noHistory);
};


// ==========================================
// 6. عمليات السلة البرمجية المعزولة
// ==========================================

window.addToCart = function(product, qty = 1, option = null) {
    if (typeof user === 'undefined' || !user || !user.loggedIn || user.requires_otp) {
        window.pendingCartAction = { product, qty, option };
        if(typeof toggleAuthPage === 'function') toggleAuthPage(true);
        if(typeof showToast === 'function') showToast('يرجى تسجيل الدخول أولاً', 'info');
        return;
    }

    window.loadIsolatedCart();

    // ملاحظة: لا نمنع الإضافة هنا حتى لو بدا merchant_id غير مطابق، لأن هذا
    // قد يحدث بسبب اختلاف تنسيق الرقم فقط (نص/رقم) وليس خطأ فعلي بالمنتج.
    // نكتفي بتحذير بالـ Console للمراقبة فقط دون تعطيل إضافة المنتج.
    const isIsolated = (typeof isIsolatedStore !== 'undefined' && isIsolatedStore);
    const currentMerchId = (typeof currentMerchantId !== 'undefined' ? currentMerchantId : null);
    if (isIsolated && currentMerchId && String(product.merchant_id) !== String(currentMerchId)) {
        console.warn('⚠️ [Cart] merchant_id للمنتج لا يطابق currentMerchantId:', product.merchant_id, 'vs', currentMerchId);
    }

    qty = parseInt(qty, 10);
    if (!qty || qty < 1) qty = 1;

    // ⭐ إصلاح مهم: بعض المنتجات ما فيها listing_id أصلاً (يرجع undefined)،
    // وكان هذا يخلي كل هذي المنتجات تشترك بنفس cartId فتختلط ببعضها بالسلة.
    // الآن نستخدم أي معرف فريد متوفر فعلياً للمنتج.
    const realProductId = product.listing_id || product.id || product.global_product_id;
    const merchantKey = String(product.merchant_id);
    let cartId = `${merchantKey}_${realProductId}`;
    let price = parseFloat(product.price);
    let sizeName = null;
    let sizeId = null;

    if (option) {
        cartId = `${merchantKey}_${realProductId}_${option.id}`;
        if (option.custom_price) price = parseFloat(option.custom_price);
        sizeName = option.name;
        sizeId = String(option.id);
    } else {
        const pInfo = typeof parsePrice === 'function' ? parsePrice(product) : { current: price };
        price = pInfo.current;
    }

    const existingItem = window.cart.find(x => String(x.cartId) === cartId);
    
    if (existingItem) {
        // المنتج موجود مسبقاً في السلة: نضيف الكمية الجديدة فوق الكمية الحالية بدل تكرار الصف
        window.updateCartQty(cartId, qty);
        if(typeof showToast === 'function') showToast('تم تحديث الكمية في السلة 🛒', 'success');
    } else {
        window.cart.push({
            cartId: cartId,
            listing_id: String(realProductId),
            product_id: String(product.id || product.global_product_id),
            name: product.name,
            price: price,
            image: product.image,
            qty: qty,
            size_name: sizeName,
            size_id: sizeId,
            merchant_id: String(product.merchant_id),
            merchant_name: product.merchant_name || 'متجر',
            merchant_username: product.merchant_username,
            currency: product.currency || 'YER'
        });
        
        window.saveCartToLocalStorage();
        window.updateCartCounters();
        if(typeof showToast === 'function') showToast('تمت الإضافة إلى السلة 🛒', 'success');
        
        const robot = document.querySelector('.cyber-robot');
        if (robot) { robot.classList.add('in-cart'); setTimeout(() => robot.classList.remove('in-cart'), 2500); }
    }
};

window.updateCartQty = function(cartId, delta) {
    cartId = String(cartId);
    const itemIndex = window.cart.findIndex(x => String(x.cartId) === cartId);
    if (itemIndex === -1) return;
    
    const item = window.cart[itemIndex];
    const newQty = item.qty + delta;

    if (newQty < 1) { 
        if(typeof confirmRemoveFromCart === 'function') confirmRemoveFromCart(cartId); 
        else window.removeFromCart(cartId);
        return; 
    }
    
    item.qty = newQty;
    window.saveCartToLocalStorage();
    window.updateCartCounters();
    window.renderCartContent();
};

window.removeFromCart = function(cartId) {
    cartId = String(cartId);
    window.cart = window.cart.filter(x => String(x.cartId) !== cartId);
    window.saveCartToLocalStorage();
    window.updateCartCounters();
    window.renderCartContent();
};

window.confirmRemoveFromCart = function(cartId) { 
    if(typeof showConfirmationModal === 'function') {
        showConfirmationModal('حذف المنتج من السلة؟', () => window.removeFromCart(cartId), 'حذف'); 
    } else {
        window.removeFromCart(cartId);
    }
};

// ==========================================
// 7. تحديث العدادات والرسم
// ==========================================
// دالة مساعدة: ترجع عناصر السلة المرئية
// ملاحظة: السلة أصلاً معزولة بالكامل حسب المتجر عبر مفتاح تخزين خاص لكل متجر
// (getIsolatedCartKey)، وهذا يكفي لضمان عدم تسرب منتجات متجر لمتجر آخر.
// لا نعتمد هنا على مطابقة merchant_id لأنها قد تسبب إخفاء منتجات صحيحة
// بالخطأ إذا اختلف تنسيق الرقم.
window.getVisibleCartItems = function() {
    if (typeof window.cart === 'undefined') window.cart = [];
    return window.cart;
};

window.updateCartCounters = function() {
    if (typeof window.cart === 'undefined') window.cart = [];
    const visibleItems = window.getVisibleCartItems();
    const count = visibleItems.reduce((s, i) => s + i.qty, 0); 
    const badge = document.querySelector('#cart-count'); 
    const isoBadge = document.querySelector('#iso-cart-badge');
    
    if (badge) { badge.innerText = count; badge.classList.toggle('show', count > 0); } 
    if (isoBadge) { isoBadge.innerText = count; isoBadge.classList.toggle('show', count > 0); }
};

// بطاقة منتج واحد داخل مجموعة المتجر (تستخدم كلاسات cart.css الجاهزة)
function renderCartItemCard(item) {
    return `
        <div class="cart-item-card">
            <div class="cart-img-container">
                <img src="${typeof getOptimizedImageUrl === 'function' ? getOptimizedImageUrl(item.image, 'order') : item.image}" onerror="this.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
            </div>
            <div class="cart-info">
                <div style="font-weight:900; font-size:0.95rem; line-height:1.3;">${escapeHTML(item.name)}</div>
                ${item.size_name ? `<div style="font-size:0.8rem; color:var(--primary); font-weight:800;">${escapeHTML(item.size_name)}</div>` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:8px;">
                    <span style="font-weight:900; color:var(--primary); font-size:1.05rem;">${parseFloat(item.price).toLocaleString()} <small>${escapeHTML(item.currency || 'YER')}</small></span>
                    <div class="qty-controls">
                        <div class="qty-btn" style="${item.qty === 1 ? 'color: var(--danger);' : ''}" onclick="event.stopPropagation(); updateCartQty('${item.cartId}', -1)"><i class="${item.qty === 1 ? 'fas fa-trash-alt' : 'fas fa-minus'}"></i></div>
                        <span style="font-weight:900; min-width:20px; text-align:center;">${item.qty}</span>
                        <div class="qty-btn" onclick="event.stopPropagation(); updateCartQty('${item.cartId}', 1)"><i class="fas fa-plus"></i></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// فتح/طي مجموعة متجر معين داخل السلة
window.toggleMerchantCartGroup = function(merchantId) {
    const group = document.getElementById(`merchant-group-${merchantId}`);
    if (group) group.classList.toggle('expanded');
};

window.renderCartContent = function() {
    const container = document.getElementById('cart-page-items'); 
    const checkBtn = document.getElementById('checkout-btn');
    if (!container) return;

    // لا نعرض إلا منتجات المتجر الحالي إذا كنا داخل متجر معزول (isolated store)
    const visibleCart = window.getVisibleCartItems();

    if (!visibleCart || visibleCart.length === 0) { 
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; opacity:0.6;">
                <i class="fas fa-shopping-basket" style="font-size:4rem; margin-bottom: 15px; color: var(--text-muted);"></i>
                <h3 style="font-weight: 900; margin-bottom: 5px;">السلة فارغة</h3>
                <p style="font-size: 0.9rem;">تصفح منتجات المتجر وأضفها هنا.</p>
            </div>`; 
        if(checkBtn) { checkBtn.disabled = true; checkBtn.innerText = 'إتمام الطلب'; }
        return;
    }

    // تجميع المنتجات حسب المتجر (كل متجر في مجموعة منفصلة بشكل أكورديون احترافي)
    // ⭐ إصلاح: نجمع المبالغ حسب العملة الفعلية لكل منتج بدل افتراض عملة واحدة
    // للسلة كلها (كان هذا يخلط عملات مختلفة ببعضها بمجموع واحد غلط)
    const groups = {};
    const groupOrder = [];
    visibleCart.forEach(item => {
        const mid = String(item.merchant_id || 'unknown');
        if (!groups[mid]) {
            groups[mid] = {
                merchant_id: mid,
                merchant_name: item.merchant_name || 'متجر',
                items: [],
                subtotalsByCurrency: {},
                qtyCount: 0
            };
            groupOrder.push(mid);
        }
        const curr = item.currency || 'YER';
        groups[mid].items.push(item);
        groups[mid].subtotalsByCurrency[curr] = (groups[mid].subtotalsByCurrency[curr] || 0) + (parseFloat(item.price) * item.qty);
        groups[mid].qtyCount += item.qty;
    });

    const singleStore = groupOrder.length === 1;
    const grandTotalsByCurrency = {};

    let html = '';
    groupOrder.forEach((mid, idx) => {
        const group = groups[mid];
        Object.entries(group.subtotalsByCurrency).forEach(([curr, amt]) => {
            grandTotalsByCurrency[curr] = (grandTotalsByCurrency[curr] || 0) + amt;
        });
        const expandedClass = singleStore || idx === 0 ? 'expanded' : '';
        const totalsHTML = Object.entries(group.subtotalsByCurrency).map(([curr, amt]) => `
                    <div class="merchant-summary-total">
                        <span>المجموع</span>
                        <span>${amt.toLocaleString()} ${escapeHTML(curr)}</span>
                    </div>`).join('');

        html += `
            <div class="merchant-cart-group ${expandedClass}" id="merchant-group-${escapeHTML(mid)}">
                <div class="merchant-cart-header" onclick="window.toggleMerchantCartGroup('${escapeHTML(mid)}')">
                    <div class="merchant-cart-header-title">
                        <i class="fas fa-store"></i>
                        <span>${escapeHTML(group.merchant_name)}</span>
                        <span style="font-size:0.75rem; font-weight:700; color: var(--text-muted);">(${group.qtyCount})</span>
                    </div>
                    <i class="fas fa-chevron-down expand-icon"></i>
                </div>
                <div class="merchant-cart-body">
                    ${group.items.map(renderCartItemCard).join('')}
                </div>
                <div class="merchant-cart-footer">
                    <div class="merchant-summary-row">
                        <span>إجمالي منتجات المتجر</span>
                        <span>${group.qtyCount}</span>
                    </div>
                    ${totalsHTML}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if(checkBtn) { 
        checkBtn.disabled = false; 
        const grandTotalText = Object.entries(grandTotalsByCurrency)
            .map(([curr, amt]) => `${amt.toLocaleString()} ${escapeHTML(curr)}`)
            .join(' + ');
        checkBtn.innerHTML = `<span>إتمام الطلب</span> <span style="background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 8px;">${grandTotalText}</span>`;
    }
};

// ==========================================
// 8. الذكاء الاصطناعي للواجهة (الإغلاق التلقائي)
// ==========================================
// هذا الكود يراقب دوال صفحة الدفع، وبمجرد نجاح فحص المخزون وطلب فتح الخريطة أو الفاتورة، يغلق السلة العصرية تلقائياً.

const originalOpenAddressEditorFunc = window.openAddressEditor;
window.openAddressEditor = function(locationOnly) {
    if (typeof window.closeModernCart === 'function') window.closeModernCart();
    if (originalOpenAddressEditorFunc) originalOpenAddressEditorFunc(locationOnly);
};

const originalToggleLocationConfirmModalFunc = window.toggleLocationConfirmModal;
window.toggleLocationConfirmModal = function(show) {
    if (show && typeof window.closeModernCart === 'function') window.closeModernCart();
    if (originalToggleLocationConfirmModalFunc) originalToggleLocationConfirmModalFunc(show);
};


// ==========================================
// 9. تفريغ السلة تلقائياً بعد إتمام الطلب بنجاح
// ==========================================
// دالة عامة لتفريغ سلة المتجر الحالي فقط (لا تمس سلال المتاجر الأخرى)
window.clearIsolatedCart = function() {
    window.cart = [];
    window.saveCartToLocalStorage();
    window.updateCartCounters();
    window.renderCartContent();
    window.closeModernCart();
};

// استمع لحدث مخصص "order:completed" — نادِه من كود الدفع فور نجاح إنشاء الطلب، مثال:
// document.dispatchEvent(new Event('order:completed'));
document.addEventListener('order:completed', window.clearIsolatedCart);

// توافقية للإبقاء على كود الواجهة السابقة إذا تم استدعاء دالة تحديث عامة
window.updateCartUI = window.renderCartContent;

CartUI.init();