// =========================================================================
// ملف favorites.js - نظام المفضلة المنفصلة الذكية (بدون أخطاء وبدون CSS)
// =========================================================================

console.log("❤️ جاري تهيئة وحدة المفضلة المستقلة...");

if (typeof window.favorites === 'undefined') window.favorites = [];
if (typeof window.user === 'undefined') window.user = { loggedIn: false };
if (typeof window.allProducts === 'undefined') window.allProducts = [];

// التأكد من وجود دالة تنظيف النصوص عالمياً
if (typeof window.escapeHTML === 'undefined') {
    window.escapeHTML = function(str) {
        if (!str) return '';
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
}

window.getIsolatedFavoritesKey = function() {
    let storeId = 'nalsh_mall'; 
    if (typeof App !== 'undefined' && App.currentStoreId) {
        storeId = App.currentStoreId.toLowerCase();
    } else {
        const pathParts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
        const ignored = ['', 'index.html', 'merchant-dashboard', 'login', 'api.php'];
        if (pathParts.length > 0 && !ignored.includes(pathParts[0].toLowerCase())) {
            storeId = pathParts[0].toLowerCase();
        }
    }
    return `favorites_isolated_${storeId}`;
};

window.loadIsolatedFavorites = function() {
    const favKey = window.getIsolatedFavoritesKey();
    try {
        const savedFavs = localStorage.getItem(favKey);
        window.favorites = savedFavs ? JSON.parse(savedFavs) : [];
    } catch (e) {
        window.favorites = [];
    }
    window.updateFavoriteIcons();
};

window.saveFavoritesToLocalStorage = function() {
    const favKey = window.getIsolatedFavoritesKey();
    try {
        localStorage.setItem(favKey, JSON.stringify(window.favorites || []));
    } catch (e) {
        console.error("⚠️ فشل حفظ المفضلة:", e);
    }
};

const FavoritesUI = {
    template: `
        <div class="modern-fav-overlay" id="fav-modern-overlay" onclick="window.closeModernFavorites()"></div>
        <div class="modern-fav-panel" id="fav-modern-panel">
            <div class="fav-drag-handle"></div>
            <div class="fav-panel-header">
                <h3><i class="fas fa-heart" style="color: var(--danger);"></i> مفضلة المتجر</h3>
                <button class="fav-close-btn" onclick="window.closeModernFavorites()"><i class="fas fa-times"></i></button>
            </div>
            
            <div id="fav-loading-state">
                <div class="fav-loading-shimmer"></div>
                <div class="fav-loading-shimmer"></div>
            </div>

            <div class="fav-panel-body" id="fav-page-items" style="display: none;"></div>
        </div>
    `,

    init: function() {
        if (!document.getElementById('fav-modern-panel')) {
            document.body.insertAdjacentHTML('beforeend', this.template);
        }
        window.loadIsolatedFavorites();
    }
};

window.openModernFavorites = function() {
    const panel = document.getElementById('fav-modern-panel');
    const overlay = document.getElementById('fav-modern-overlay');
    const loader = document.getElementById('fav-loading-state');
    const items = document.getElementById('fav-page-items');

    if (!panel) return;

    window.loadIsolatedFavorites();

    overlay.classList.add('active');
    panel.classList.add('active');
    if (typeof lockBodyScroll === 'function') lockBodyScroll(true);

    items.style.display = 'none';
    loader.style.display = 'block';

    setTimeout(() => {
        loader.style.display = 'none';
        items.style.display = 'block';
        window.renderFavoritesContent();
    }, 400); 
};

window.closeModernFavorites = function() {
    const panel = document.getElementById('fav-modern-panel');
    const overlay = document.getElementById('fav-modern-overlay');
    if (panel) panel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
    
    if (typeof updateBottomNavActive === 'function') updateBottomNavActive('home');
    if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('home');
};

const originalFavTogglePage = window.togglePage;
window.togglePage = function(pageId, show, noHistory) {
    if (pageId === 'favorites-page') {
        if (show) window.openModernFavorites();
        else window.closeModernFavorites();
        return;
    }
    if (originalFavTogglePage) originalFavTogglePage(pageId, show, noHistory);
};

window.toggleFavorite = function(productId) {
    if (!window.user.loggedIn || window.user.requires_otp) {
        if(typeof toggleAuthPage === 'function') toggleAuthPage(true);
        if(typeof showToast === 'function') showToast('يرجى تسجيل الدخول أولاً لحفظ المفضلة', 'info');
        return;
    }

    window.loadIsolatedFavorites();
    const index = window.favorites.indexOf(productId);
    
    if (index > -1) {
        window.favorites.splice(index, 1);
        if(typeof showToast === 'function') showToast('تمت الإزالة من المفضلة 💔', 'info');
    } else {
        window.favorites.push(productId);
        if(typeof showToast === 'function') showToast('تمت الإضافة للمفضلة ❤️', 'success');
        
        const robot = document.querySelector('.cyber-robot');
        if (robot) { robot.classList.add('eyes-happy', 'spin-happy'); setTimeout(() => robot.classList.remove('eyes-happy', 'spin-happy'), 1500); }
    }
    
    window.saveFavoritesToLocalStorage();
    window.updateFavoriteIcons();
    
    const panel = document.getElementById('fav-modern-panel');
    if (panel && panel.classList.contains('active')) {
        window.renderFavoritesContent();
    }
};

window.updateFavoriteIcons = function() { 
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.classList.toggle('active', window.favorites.includes(btn.dataset.productId)); 
    }); 
};

window.openProductFromFavorites = function(product) {
    window.closeModernFavorites(); 
    
    setTimeout(() => {
        if (typeof toggleProductModal === 'function') {
            toggleProductModal(true, product);
        }
    }, 300);
};

window.renderFavoritesContent = function() { 
    const container = document.getElementById('fav-page-items'); 
    if (!container) return;

    if (window.favorites.length === 0) { 
        container.innerHTML = `
        <div style="text-align:center; padding:40px 20px; opacity:0.6;">
            <i class="fas fa-heart-broken" style="font-size:4rem; color:var(--text-muted); margin-bottom:15px;"></i>
            <h3 style="margin-bottom:5px; font-weight:900;">مفضلتك فارغة</h3>
            <p style="font-size:0.9rem;">اضغط على علامة القلب في أي منتج لإضافته هنا.</p>
        </div>`; 
        return; 
    } 

    const favProducts = (window.allProducts || []).filter(p => window.favorites.includes(p.id)); 
    
    if(favProducts.length === 0 && window.favorites.length > 0) {
         container.innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size:3rem; color:var(--primary); margin-bottom:15px;"></i>
            <p style="font-weight:bold; color:var(--text-muted);">جاري تحميل بيانات المنتجات...</p>
        </div>`; 
        return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 12px;">`;

    favProducts.forEach(p => {
        const pInfo = typeof parsePrice === 'function' ? parsePrice(p) : { current: p.price || 0 };
        const safeCurrency = window.escapeHTML(p.currency || 'YER');
        const imgUrl = typeof getOptimizedImageUrl === 'function' ? getOptimizedImageUrl(p.image, 'thumb') : p.image;
        const productJson = JSON.stringify(p).replace(/'/g, "&#39;");

        html += `
            <div class="fav-item-card" onclick='window.openProductFromFavorites(${productJson})'>
                <div style="width: 70px; height: 70px; border-radius: 12px; overflow: hidden; background: white; border: 1px solid var(--border); flex-shrink: 0;">
                    <img src="${imgUrl}" style="width:100%; height:100%; object-fit:contain;" onerror="this.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                </div>
                <div style="flex: 1; padding-right: 12px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-weight: 900; font-size: 0.95rem; line-height: 1.3; margin-bottom: 5px;">${window.escapeHTML(p.name)}</div>
                    <span style="font-weight:900; color:var(--primary); font-size: 1.05rem;">${pInfo.current.toLocaleString()} <small>${safeCurrency}</small></span>
                </div>
                <div class="fav-trash-btn" onclick="event.stopPropagation(); window.toggleFavorite('${p.id}')">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html; 
    window.updateFavoriteIcons(); 
};

FavoritesUI.init();