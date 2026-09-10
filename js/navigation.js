// =========================================================================
// ملف navigation.js - إدارة الأشرطة العلوية والسفلية (Navbar & Bottom Bar)
// النسخة المحدثة والخالية من التعارضات لدعم السلة العصرية
// =========================================================================

const NavigationUI = {
    // 1. الكود المصدري (HTML) للأشرطة
    templates: {
        // الهيدر الرئيسي للمول
        mainHeader: `
            <div class="header-container transition-element" id="header-container">
                <nav class="navbar" id="navbar">
                    <div class="nav-container">
                        <a class="logo" href="/" onclick="handleLogoClick(event)">
                            <i class="fas fa-store"></i> <span id="main-logo-text">المتجر</span>
                        </a>
                        <div class="nav-actions">
                            <button class="icon-btn" id="search-header-btn" onclick="togglePage('search-page', true)">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="icon-btn" id="profile-header-btn" onclick="handleProfileClick()">
                                <i class="fas fa-user"></i>
                            </button>
                            <button class="icon-btn" id="dark-mode-header-btn" onclick="toggleDarkModeWithMotion()">
                                <i id="theme-icon" class="fas fa-moon mode-icon"></i>
                            </button>
                        </div>
                    </div>
                </nav>
                <div class="sub-navbar" id="sub-navbar"></div>
            </div>
        `,
     
        // الشريط السفلي الرئيسي للمول
        mainBottomBar: `
            <div class="mobile-bar transition-element" id="mobile-bar">
                <div class="nav-item active" id="nav-home" onclick="goHome()">
                    <div class="nav-icon-container"><i class="fas fa-home"></i></div>
                    <span>الرئيسية</span>
                </div>
                <div class="nav-item" id="nav-search" onclick="togglePage('search-page', true)">
                    <div class="nav-icon-container"><i class="fas fa-search"></i></div>
                    <span>بحث</span>
                </div>
                <div class="nav-item" id="orders-nav-item" onclick="handleProfileClick()">
                    <div class="nav-icon-container"><i class="fas fa-box-open"></i></div>
                    <span>طلباتي</span>
                </div>
                <div class="nav-item" id="nav-favorites" onclick="togglePage('favorites-page', true)">
                    <div class="nav-icon-container"><i class="fas fa-heart"></i></div>
                    <span>المفضلة</span>
                </div>
                <div class="nav-item" id="nav-cart" onclick="handleCartClick()">
                    <div class="nav-icon-container">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="cart-badge">0</span>
                    </div>
                    <span>السلة</span>
                </div>
            </div>
        `,
        // الشريط السفلي المعزول للمتجر المستقل
        isolatedBottomBar: `
            <nav class="isolated-bottom-bar" id="isolated-bottom-bar">
                <div class="nav-item active" data-nav="home" onclick="handleIsolatedNavClick('home')">
                    <div class="nav-icon-container"><i class="fas fa-home"></i></div>
                    <span>الرئيسية</span>
                </div>
                <div class="nav-item" data-nav="search" onclick="handleIsolatedNavClick('search')">
                    <div class="nav-icon-container"><i class="fas fa-search"></i></div>
                    <span>بحث</span>
                </div>
                <div class="nav-item" data-nav="orders" onclick="handleIsolatedNavClick('orders')">
                    <div class="nav-icon-container"><i class="fas fa-box-open"></i></div>
                    <span>طلباتي</span>
                </div>
                <div class="nav-item" data-nav="favorites" onclick="handleIsolatedNavClick('favorites')">
                    <div class="nav-icon-container"><i class="fas fa-heart"></i></div>
                    <span>المفضلة</span>
                </div>
                <div class="nav-item" data-nav="cart" onclick="handleIsolatedNavClick('cart')">
                    <div class="nav-icon-container">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="iso-cart-badge" class="cart-badge">0</span>
                    </div>
                    <span>السلة</span>
                </div>
            </nav>
        `
    },

    init: function() {
        // --- إضافة كود ربط الـ CSS برمجياً ---
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/nav.css';
        document.head.appendChild(link);
        // ------------------------------------

        // حقن الأشرطة في الصفحة
        const wrapper = document.getElementById('navigation-wrapper');
        if (wrapper) {
            wrapper.innerHTML = 
                (this.templates.isolatedHeader || '') + 
                this.templates.mainHeader + 
                this.templates.mainBottomBar + 
                this.templates.isolatedBottomBar;
        }
            
        console.log("🚀 Navigation UI & CSS Injected Successfully!");
    }
};

// =========================================================================
// الوظائف المرتبطة بالأشرطة (مربوطة بالـ window لتعمل مع onclick)
// =========================================================================

// تغيير الوضع الليلي/النهاري مع الحركة
window.toggleDarkModeWithMotion = function() {
    const mainIcon = document.getElementById('theme-icon');
    const isoIcon = document.getElementById('iso-theme-icon');
    if (mainIcon) mainIcon.classList.add('spin-out');
    if (isoIcon) isoIcon.classList.add('spin-out');
    
    document.body.classList.add('theme-transitioning');
    const isDarkNow = document.documentElement.classList.contains('dark-mode');
    const goingDark = !isDarkNow;

    // تطبيق التغيير على html و body معاً
    document.documentElement.classList.toggle('dark-mode', goingDark);
    if (document.body) document.body.classList.toggle('dark-mode', goingDark);
    localStorage.setItem('darkMode', goingDark ? 'enabled' : 'disabled');

    // إعادة تطبيق ألوان الثيم فوراً بعد تغيير الوضع
    if (window.currentStorefrontConfig && typeof window.StorefrontEngine?.reapplyActiveMode === 'function') {
        window.StorefrontEngine.reapplyActiveMode();
    } else if (window.currentStorefrontConfig) {
        // fallback مباشر إذا لم يكن المحرك جاهزاً
        const root = document.documentElement;
        const cfg = window.currentStorefrontConfig;
        const lightColors = cfg.light_theme?.colors || cfg.modes?.light?.colors || {};
        const darkColors = cfg.dark_theme?.colors || cfg.modes?.dark?.colors || {};
        const c = goingDark ? darkColors : lightColors;
        const defaults = goingDark
            ? { bg: '#0B1120', card: '#151E2E', surface: '#1E293B', text: '#F8FAFC', muted: '#94A3B8' }
            : { bg: '#F8FAFC', card: '#FFFFFF', surface: '#F1F5F9', text: '#0F172A', muted: '#64748B' };
        root.style.setProperty('--bg-body', c.bg_body || defaults.bg);
        root.style.setProperty('--bg-card', c.bg_card || c.card_bg || defaults.card);
        root.style.setProperty('--bg-surface', c.bg_surface || defaults.surface);
        root.style.setProperty('--theme-background', c.bg_body || defaults.bg);
        root.style.setProperty('--theme-card-bg', c.bg_card || c.card_bg || defaults.card);
        root.style.setProperty('--theme-surface', c.bg_surface || defaults.surface);
        root.style.setProperty('--text-main', c.text_main || defaults.text);
        root.style.setProperty('--theme-text-primary', c.text_main || defaults.text);
        root.style.setProperty('--text-muted', c.text_muted || defaults.muted);
        root.style.setProperty('--theme-text-secondary', c.text_muted || defaults.muted);
        root.style.setProperty('--border', c.border || (goingDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'));
        root.style.setProperty('--theme-border', c.border || (goingDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'));
    }

    setTimeout(() => {
        const newClass = goingDark ? 'fas fa-sun mode-icon spin-in' : 'fas fa-moon mode-icon spin-in';
        if (mainIcon) mainIcon.className = newClass;
        if (isoIcon) isoIcon.className = newClass;
        
        setTimeout(() => {
            if(mainIcon) mainIcon.classList.remove('spin-in');
            if(isoIcon) isoIcon.classList.remove('spin-in');
        }, 400);
    }, 200);
    
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 600);
};

function setInitialThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    const newClass = isDark ? 'fas fa-sun mode-icon' : 'fas fa-moon mode-icon';
    const mainIcon = document.getElementById('theme-icon');
    const isoIcon = document.getElementById('iso-theme-icon');
    if(mainIcon) mainIcon.className = newClass;
    if(isoIcon) isoIcon.className = newClass;
}

// تحديث الأيقونة عند تسجيل الدخول
window.updateUIAfterLoginStateChange = function() {
    const profileHeaderBtn = document.getElementById('profile-header-btn');
    const isoProfileBtn = document.getElementById('iso-profile-btn');
    
    let content = '<i class="fas fa-user"></i>';
    // التأكد من أن متغير user موجود عالمياً
    if (typeof user !== 'undefined' && user.loggedIn && user.full_name && !user.full_name.startsWith('عميل')) { 
        content = `<div class="user-initial">${escapeHTML(user.full_name.charAt(0).toUpperCase())}</div>`; 
    }
    
    if(profileHeaderBtn) profileHeaderBtn.innerHTML = content;
    if(isoProfileBtn) isoProfileBtn.innerHTML = content;
    
    if (typeof updateCartUI === 'function') updateCartUI(); 
    if (typeof updateFavoriteIcons === 'function') updateFavoriteIcons(); 
};

// النقر على الشعار
window.handleLogoClick = function(event) {
    if (typeof isIsolatedStore !== 'undefined' && (isIsolatedStore || (currentRenderMode === 'store' && currentMerchantId))) {
        event.preventDefault(); 
        if (typeof attemptExitStore === 'function') attemptExitStore();
    } else {
        if (typeof goHome === 'function') goHome(); 
    }
};

// النقر على سلة المشتريات (معدلة لدعم السلة العصرية)
window.handleCartClick = function() {
    if (typeof user !== 'undefined' && (!user.loggedIn || user.requires_otp)) {
        if (typeof toggleAuthPage === 'function') toggleAuthPage(true);
        if (typeof showToast === 'function') showToast('يرجى تسجيل الدخول أولاً لعرض السلة', 'info');
    } else {
        // إضاءة الزر فوراً
        if (typeof updateBottomNavActive === 'function') updateBottomNavActive('cart-page');
        if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('cart');
        
        // استدعاء السلة العصرية إذا كانت موجودة، وإلا فالقديمة
        if (typeof window.openModernCart === 'function') {
            window.openModernCart();
        } else if (typeof togglePage === 'function') {
            togglePage('cart-page', true);
        }
        
        if (typeof updateCartUI === 'function') updateCartUI();
    }
};

// النقر على الملف الشخصي (حسابي/طلباتي)
window.handleProfileClick = function() {
    // إضاءة الزر فوراً
    if (typeof updateBottomNavActive === 'function') updateBottomNavActive('profile-page');
    if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('orders');

    if (!document.getElementById('profile-page')) {
        const profileHTML = `
            <div class="page-overlay transition-element" id="profile-page">
                <div class="page-header" style="border-bottom: 1px solid var(--border) !important;">
                    <button class="icon-btn" style="border:none; box-shadow:none; background:transparent;" onclick="togglePage('profile-page', false)">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <h3>طلباتي</h3>
                </div>
                <div class="page-body" id="profile-page-content">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', profileHTML);
    }

    if (typeof OrdersApp !== 'undefined' && typeof OrdersApp.openProfilePage === 'function') {
        OrdersApp.openProfilePage();
    } else {
        togglePage('profile-page', true);
    }
};

// =========================================================================
// دالة فتح وإغلاق النوافذ (تم دمجها وإصلاح التعارض لدعم السلة الجديدة)
// =========================================================================
window.togglePage = function(pageId, show, noHistory) {
    
    // 1. اعتراض طلب السلة وتحويله للسلة العصرية تلقائياً
    if (pageId === 'cart-page') {
        if (show && typeof window.openModernCart === 'function') {
            window.openModernCart();
        } else if (!show && typeof window.closeModernCart === 'function') {
            window.closeModernCart();
        }
        return; // الخروج هنا لتجنب البحث عن العنصر القديم
    }

    const page = document.getElementById(pageId);
    if (!page) return;

    // الفحص الآمن لمعرفة إذا كنا في المتجر المستقل
    const currentStore = (window.App && window.App.currentStoreId) ? window.App.currentStoreId : '';
const baseUrl = currentStore ? `${window.location.origin}/${currentStore}` : window.location.origin;

    if (show) {
        // إغلاق أي صفحات أخرى مفتوحة
        document.querySelectorAll('.page-overlay.open').forEach(p => p.classList.remove('open'));
        
        page.classList.add('open');
        if (typeof lockBodyScroll === 'function') lockBodyScroll(true);

        if (!noHistory) {
            history.pushState({ page: pageId }, '', baseUrl);
        }
        
        // تحديث محتوى الصفحات عند فتحها
        if (pageId === 'favorites-page' && typeof renderFavoritesPage === 'function') renderFavoritesPage();
        else if (pageId === 'profile-page') { if(typeof OrdersApp !== 'undefined') OrdersApp.renderPage(); }
        else if (pageId === 'search-page' && typeof renderSearchPage === 'function') renderSearchPage();

        // تحديث إضاءة الأشرطة السفلية
        if (typeof updateBottomNavActive === 'function') updateBottomNavActive(pageId);
        if (typeof updateIsolatedNavActiveState === 'function') {
            const navMap = {
                'search-page': 'search',
                'profile-page': 'orders',
                'favorites-page': 'favorites',
                'cart-page': 'cart'
            };
            updateIsolatedNavActiveState(navMap[pageId] || 'home');
        }

    } else {
        page.classList.remove('open');
        if (!noHistory) {
            history.pushState({ page: window.isIsolatedStore ? 'store' : 'main' }, '', baseUrl);
        }
        
        setTimeout(() => {
            if (document.querySelectorAll('.page-overlay.open').length === 0) {
                if (typeof lockBodyScroll === 'function') lockBodyScroll(false);
                
                // إعادة إضاءة زر "الرئيسية" عند إغلاق الصفحات الجانبية
                if (typeof updateBottomNavActive === 'function') updateBottomNavActive('home');
                if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('home');
            }
        }, 50);
    }
};

// إضاءة الزر الصحيح في الشريط السفلي
window.updateBottomNavActive = function(pageId) {
    const mainBar = document.getElementById('mobile-bar');
    if (mainBar) {
        mainBar.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        if (pageId === 'home') document.getElementById('nav-home')?.classList.add('active');
        else if (pageId === 'search-page') document.getElementById('nav-search')?.classList.add('active');
        else if (pageId === 'favorites-page') document.getElementById('nav-favorites')?.classList.add('active');
        else if (pageId === 'cart-page') document.getElementById('nav-cart')?.classList.add('active');
        else if (pageId === 'profile-page') document.getElementById('orders-nav-item')?.classList.add('active');
    }
};

// دالة الرجوع للرئيسية المخصصة
window.goHome = function() {
    document.querySelectorAll('.page-overlay.open').forEach(p => {
        if (typeof togglePage === 'function') {
            togglePage(p.id, false);
        } else {
            p.classList.remove('open');
        }
    });
    
    // إغلاق السلة العصرية إذا كانت مفتوحة
    if (typeof window.closeModernCart === 'function') window.closeModernCart();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // التأكد من تحديث كلا الشريطين عند العودة للرئيسية
    if (typeof updateBottomNavActive === 'function') updateBottomNavActive('home');
    if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('home');
};

function renderSubNavbar() { 
    const c = document.getElementById('sub-navbar'); 
    if (!c) return;
    
    let h = '';
    
    if (window.App && window.App.storeData && window.App.storeData.categories) {
        h += `<div class="sub-nav-item active" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); setActiveSubNav(this);">الكل</div>`; 
        window.App.storeData.categories.forEach(cat => {
            h += `<div class="sub-nav-item" onclick="scrollToCategory('${cat.name}', this)">${cat.name}</div>`;
        });
    } else {
        h = `<div class="sub-nav-item active">الكل</div>`;
    }
    
    c.innerHTML = h; 
    window.isSubNavRendered = true;
}

window.scrollToCategory = function(catName, btnElement) {
    setActiveSubNav(btnElement);
    const categoryTitles = document.querySelectorAll('.store-category-title');
    for (let title of categoryTitles) {
        if (title.innerText.includes(catName)) {
            const y = title.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
            break;
        }
    }
};

window.setActiveSubNav = function(clickedElement) {
    document.querySelectorAll('#sub-navbar .sub-nav-item').forEach(el => el.classList.remove('active'));
    clickedElement.classList.add('active');
    clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

// =========================================================================
// 🗂️ الدخول إلى فئة أب: تحويل الشريط العلوي لعرض فئاتها الفرعية + زر رجوع
// (يُستخدم من StoreUI عند فتح صفحة "عرض الكل" لفئة معينة)
// =========================================================================
window._savedTopBarState = null;

// ⭐ إصلاح: يحسب عدد منتجات القسم شاملاً كل أقسامه الفرعية مهما كان عمق التداخل
// (نفس منطق getAllProductsDeep في home.js/store.js، مكرَّرة هنا محلياً حتى لا
// يعتمد هذا الملف على ترتيب تحميل الملفات الأخرى).
function _countProductsDeep(category) {
    let count = (category.products || []).length;
    if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
            count += _countProductsDeep(sub);
        });
    }
    return count;
}

window.enterCategoryTopBar = function(category) {
    const subNav = document.getElementById('sub-navbar');
    const logo = document.querySelector('#header-container .logo');
    if (!subNav || !category) return;

    // نحفظ حالة الشعار الأصلية أول مرة فقط (حتى لا تُفقد إن تم الدخول لفئة داخل فئة)
    if (!window._savedTopBarState && logo) {
        window._savedTopBarState = {
            logoHtml: logo.innerHTML,
            logoOnClick: logo.getAttribute('onclick')
        };
    }

    // 1. تحويل الشعار لزر رجوع + اسم الفئة الأب مؤقتاً
    if (logo) {
        const safeName = typeof window.escapeHTML === 'function' ? window.escapeHTML(category.name) : category.name;
        logo.innerHTML = `<i class="fas fa-arrow-right"></i> <span>${safeName}</span>`;
        logo.setAttribute('onclick', 'window.exitCategoryTopBarBack(); return false;');
    }

    // 2. استبدال شريط الفئات (الذي كان يعرض فئات الأب) بالفئات الفرعية لهذه الفئة تحديداً
    const subcats = category.subcategories || [];
    // ⭐ إصلاح: العدّاد الآن يشمل منتجات كل الأقسام الفرعية المتداخلة، لا المستوى المباشر فقط
    const totalCount = _countProductsDeep(category);
    let chipsHtml = `<div class="sub-nav-item active" onclick="StoreUI.filterCategoryPageBySub('__all__', this)">الكل <span style="opacity:.7; font-size:.85em;">(${totalCount})</span></div>`;
    subcats.forEach(sub => {
        const safe = typeof window.escapeHTML === 'function' ? window.escapeHTML(sub.name) : sub.name;
        const jsSafe = typeof window.escapeJsAttr === 'function' ? window.escapeJsAttr(sub.name) : String(sub.name).replace(/'/g, "\\'");
        chipsHtml += `<div class="sub-nav-item" onclick="StoreUI.filterCategoryPageBySub('${jsSafe}', this)">${safe} <span style="opacity:.7; font-size:.85em;">(${_countProductsDeep(sub)})</span></div>`;
    });

    subNav.innerHTML = chipsHtml;
};

// يُستدعى فقط من زر الرجوع في الشعار: يغلق صفحة الفئة (وهي بدورها تستدعي exitCategoryTopBar للتنظيف)
window.exitCategoryTopBarBack = function() {
    if (typeof StoreUI !== 'undefined' && typeof StoreUI.closeCategoryFullView === 'function') {
        StoreUI.closeCategoryFullView();
    } else {
        window.exitCategoryTopBar();
    }
};

// استعادة الشريط العلوي الأصلي (الشعار وفئات الأب) - تُستدعى عند إغلاق صفحة الفئة
window.exitCategoryTopBar = function() {
    const logo = document.querySelector('#header-container .logo');
    if (logo && window._savedTopBarState) {
        logo.innerHTML = window._savedTopBarState.logoHtml;
        if (window._savedTopBarState.logoOnClick) {
            logo.setAttribute('onclick', window._savedTopBarState.logoOnClick);
        } else {
            logo.removeAttribute('onclick');
        }
    }
    window._savedTopBarState = null;

    // نعيد رسم شريط فئات الأب من جديد بدل استرجاع نص محفوظ، لضمان أحداث نظيفة ومحدثة
    if (typeof renderSubNavbar === 'function') renderSubNavbar();
};

// تأثيرات التمرير والهيدر
window.addEventListener('scroll', () => {
    const isoHeader = document.getElementById('isolated-header');
    
    if (isoHeader && typeof isIsolatedStore !== 'undefined' && isIsolatedStore) {
        if (window.scrollY > 4) {
            isoHeader.classList.add('scrolled'); 
            document.body.classList.add('header-is-scrolled'); 
        } else {
            isoHeader.classList.remove('scrolled'); 
            document.body.classList.remove('header-is-scrolled'); 
        }
    } else {
        if(isoHeader) isoHeader.classList.remove('scrolled');
        document.body.classList.remove('header-is-scrolled');
    }
});

// ================= دوال المتجر المستقل (Isolated Nav) =================
window.updateIsolatedNavActiveState = function(pageName) {
    const bottomBar = document.getElementById('isolated-bottom-bar');
    if (!bottomBar) return;
    bottomBar.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.nav === pageName);
    });
};

window.handleIsolatedNavClick = function(pageName) {
    document.querySelectorAll('.page-overlay.open').forEach(p => {
        if (p.classList.contains('open') && typeof togglePage === 'function') {
            togglePage(p.id, false, true);
        }
    });
    
    if (typeof window.closeModernCart === 'function') window.closeModernCart();

    window.updateIsolatedNavActiveState(pageName);

    switch(pageName) {
        case 'home':
            if(typeof isolatedActiveCat !== 'undefined' && isolatedActiveCat !== 'الكل' && typeof filterIsolatedStore === 'function') {
                filterIsolatedStore('الكل');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'search':
            if (typeof togglePage === 'function') togglePage('search-page', true);
            break;
        case 'orders':
            window.handleProfileClick();
            break;
        case 'favorites':
            if (typeof togglePage === 'function') togglePage('favorites-page', true);
            break;
        case 'cart':
            window.handleCartClick();
            break;
    }
};

window.updateMainHeaderLogo = function(isStoreMode, storeName = 'المتجر') {
    const logoText = document.getElementById('main-logo-text');
    const logoIcon = document.querySelector('.header-container .logo i');
    if (logoText && logoIcon) {
        logoIcon.className = `fas ${isStoreMode ? 'fa-store-alt' : 'fa-store'}`;
        logoText.innerText = storeName;
    }

    const isolatedStoreName = document.querySelector('#isolated-header .store-name') || 
                              document.getElementById('iso-store-name') ||
                              document.querySelector('#isolated-header span');
    if (isolatedStoreName) {
        isolatedStoreName.innerText = storeName;
    }
};

// =========================================================================
// المراقب الذكي المطور (يتحكم بالرئيسية والتنقل بين الأقسام تلقائياً)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    let navObserverTimeout;
    
    const navObserver = new MutationObserver(() => {
        clearTimeout(navObserverTimeout);
        navObserverTimeout = setTimeout(() => {
            const openPages = document.querySelectorAll('.page-overlay.open');
            const cartPanel = document.getElementById('cart-modern-panel');
            const isCartOpen = cartPanel && cartPanel.classList.contains('active');
            
            if (openPages.length > 0 || isCartOpen) {
                let activePageId = isCartOpen ? 'cart-page' : openPages[openPages.length - 1].id;
                
                if (typeof updateBottomNavActive === 'function') updateBottomNavActive(activePageId);
                
                if (typeof updateIsolatedNavActiveState === 'function') {
                    const navMap = {
                        'search-page': 'search',
                        'profile-page': 'orders',
                        'favorites-page': 'favorites',
                        'cart-page': 'cart'
                    };
                    updateIsolatedNavActiveState(navMap[activePageId] || 'home');
                }
            } else {
                if (typeof updateBottomNavActive === 'function') updateBottomNavActive('home');
                if (typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('home');
            }
        }, 50); 
    });

    navObserver.observe(document.body, { 
        attributes: true, 
        subtree: true, 
        attributeFilter: ['class'] 
    });
});

// =========================================================================
// تطبيق إعدادات التنقل من config (يُستدعى من storefront-engine.js)
// =========================================================================
window.applyNavigationSettings = function(config) {
    const navSettings = config?.navigation_settings || {};
    const DEFAULT_ITEMS = [
        { id: 'home',      label: 'الرئيسية', icon: 'fa-home',          visible: true,  order: 1 },
        { id: 'search',    label: 'بحث',       icon: 'fa-search',        visible: true,  order: 2 },
        { id: 'orders',    label: 'طلباتي',    icon: 'fa-box-open',      visible: true,  order: 3 },
        { id: 'favorites', label: 'المفضلة',  icon: 'fa-heart',          visible: true,  order: 4 },
        { id: 'cart',      label: 'السلة',     icon: 'fa-shopping-cart', visible: true,  order: 5 },
    ];
    const rawBottomItems = Array.isArray(navSettings.bottom_bar?.items) && navSettings.bottom_bar.items.length
        ? navSettings.bottom_bar.items
        : DEFAULT_ITEMS;
    const normalizedBottomItems = [...rawBottomItems]
        .map(item => ({ ...item, visible: item.visible !== false, order: Number(item.order) || 0 }));
    const visibleBottomItems = [...normalizedBottomItems]
        .filter(item => item.visible)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    const minimumVisibleBottomItems = 2;
    const protectedBottomIds = new Set(['home', 'cart']);
    const safeVisibleBottomItems = visibleBottomItems.length >= minimumVisibleBottomItems
        ? visibleBottomItems
        : [...DEFAULT_ITEMS]
            .map(item => ({ ...item, visible: protectedBottomIds.has(item.id) || (normalizedBottomItems.find(norm => norm.id === item.id)?.visible !== false) }))
            .filter(item => item.visible)
            .slice(0, minimumVisibleBottomItems);
    const defaultTopBarCfg = { show_logo_icon: true, logo_icon: 'fa-store', show_dark_mode_btn: true, show_profile_btn: true, show_search_btn: true };
    const topBarCfg = { ...defaultTopBarCfg, ...(navSettings.top_bar || {}) };

    // ── 1. الشريط السفلي الرئيسي ──
    const bottomBar = document.getElementById('mobile-bar');
    if (bottomBar) {
        const items = safeVisibleBottomItems;

        const ACTION_MAP = {
            home:      { onclick: "goHome()",                          idAttr: 'id="nav-home"' },
            search:    { onclick: "togglePage('search-page', true)",   idAttr: 'id="nav-search"' },
            orders:    { onclick: "handleProfileClick()",              idAttr: 'id="orders-nav-item"' },
            favorites: { onclick: "togglePage('favorites-page', true)",idAttr: 'id="nav-favorites"' },
            cart:      { onclick: "handleCartClick()",                 idAttr: 'id="nav-cart"' },
        };

        bottomBar.innerHTML = items.map(item => {
            const def = ACTION_MAP[item.id] || { onclick: '', idAttr: '' };
            const badgeHtml = item.id === 'cart'
                ? `<span id="cart-count" class="cart-badge">0</span>`
                : '';
            return `<div class="nav-item" ${def.idAttr} onclick="${def.onclick}">
                <div class="nav-icon-container">
                    <i class="fas ${item.icon}"></i>${badgeHtml}
                </div>
                <span>${item.label}</span>
            </div>`;
        }).join('');
    }

    // ── 2. الشريط السفلي المعزول (للمتجر المستقل) ──
    const isoBar = document.getElementById('isolated-bottom-bar');
    if (isoBar) {
        const items = safeVisibleBottomItems;

        const DATA_MAP = {
            home: 'home', search: 'search', orders: 'orders', favorites: 'favorites', cart: 'cart'
        };

        isoBar.innerHTML = items.map(item => {
            const dataNav = DATA_MAP[item.id] || item.id;
            const badgeHtml = item.id === 'cart'
                ? `<span id="iso-cart-badge" class="cart-badge">0</span>`
                : '';
            return `<div class="nav-item" data-nav="${dataNav}" onclick="handleIsolatedNavClick('${dataNav}')">
                <div class="nav-icon-container">
                    <i class="fas ${item.icon}"></i>${badgeHtml}
                </div>
                <span>${item.label}</span>
            </div>`;
        }).join('');
    }

    // ── 3. الشريط العلوي (الهيدر) ──
    const topBarCfgFinal = topBarCfg;
    if (topBarCfgFinal) {
        // أيقونة الشعار
        const logo = document.querySelector('#header-container .logo');
        const isoLogo = document.querySelector('#isolated-header .logo');
        const logoIcon = document.querySelector('#header-container .logo i');
        const isoLogoIcon = document.querySelector('#isolated-header .logo i');
        const newIconClass = `fas ${topBarCfgFinal.logo_icon || 'fa-store'}`;
        if (logoIcon) logoIcon.className = newIconClass;
        if (isoLogoIcon) isoLogoIcon.className = newIconClass;
        if (logo) logo.style.display = topBarCfgFinal.show_logo_icon === false ? 'none' : '';
        if (isoLogo) isoLogo.style.display = topBarCfgFinal.show_logo_icon === false ? 'none' : '';

        // زر البحث
        const searchBtn = document.getElementById('search-header-btn');
        if (searchBtn) searchBtn.style.display = topBarCfgFinal.show_search_btn === false ? 'none' : '';

        // زر الوضع الليلي
        const darkModeBtn = document.getElementById('dark-mode-header-btn');
        if (darkModeBtn) darkModeBtn.style.display = topBarCfgFinal.show_dark_mode_btn === false ? 'none' : '';

        // زر الحساب الشخصي
        const profileBtn = document.getElementById('profile-header-btn');
        if (profileBtn) profileBtn.style.display = topBarCfgFinal.show_profile_btn === false ? 'none' : '';
    }
};