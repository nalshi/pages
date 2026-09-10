/* ==========================================================================
   Home UI (home.js) - نالش
   محرك عرض وتخطيط المنتجات الذكي: متجاوب، معياري، وسهل الصيانة 100%
   يدعم: الأقسام، التبويبات، الشبكة الموحدة، المميزة أولاً، تخصيص كل قسم، 
   السلايدر متعدد الصفوف، والترتيب الديناميكي وحالات المخزون
   ========================================================================== */

// 1. ثيمات وهوية التصنيفات
window.CATEGORY_THEMES = [
    { c1: '#FF6B6B', c2: '#FF8E53', icon: 'fa-fire' },
    { c1: '#4E65FF', c2: '#5FC7FF', icon: 'fa-bolt' },
    { c1: '#00C9A7', c2: '#4BE3B4', icon: 'fa-leaf' },
    { c1: '#F857A6', c2: '#FF5D8F', icon: 'fa-heart' },
    { c1: '#8E2DE2', c2: '#C471ED', icon: 'fa-star' },
    { c1: '#11998E', c2: '#38EF7D', icon: 'fa-gem' },
    { c1: '#FC5C7D', c2: '#6A82FB', icon: 'fa-crown' },
    { c1: '#F2994A', c2: '#F2C94C', icon: 'fa-sun' },
    { c1: '#654EA3', c2: '#B196E8', icon: 'fa-moon' },
    { c1: '#1F4287', c2: '#278EA5', icon: 'fa-shield-alt' },
    { c1: '#D65DB1', c2: '#FF6F91', icon: 'fa-gift' },
    { c1: '#0BA360', c2: '#3CBA92', icon: 'fa-feather-alt' },
    { c1: '#EB5757', c2: '#F2994A', icon: 'fa-rocket' },
    { c1: '#2F80ED', c2: '#56CCF2', icon: 'fa-snowflake' },
    { c1: '#9B51E0', c2: '#BB6BD9', icon: 'fa-magic' },
    { c1: '#27AE60', c2: '#6FCF97', icon: 'fa-seedling' },
    { c1: '#F2C94C', c2: '#F2994A', icon: 'fa-award' },
    { c1: '#EB5757', c2: '#9B51E0', icon: 'fa-compass' }
];

window.hashCategoryName = function(str) {
    let h = 0;
    str = str || '';
    for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
};

window.getCategoryIdentity = function(name, index) {
    const h = window.hashCategoryName(name);
    const theme = window.CATEGORY_THEMES[h % window.CATEGORY_THEMES.length];
    const shape = (h + (index || 0)) % 4;
    return { c1: theme.c1, c2: theme.c2, icon: theme.icon, shape: shape };
};

window.createCategoryChipsStrip = function(categories, activeCatName = '') {
    if (!categories || categories.length === 0) return '';
    const config = window.currentStorefrontConfig || {};
    const catBlock = (config.layout_blocks || []).find(b => b.type === 'categories') || {};
    const catSettings = catBlock.settings || {};
    const isGrid = catSettings.style === 'grid' || catSettings.categories_style === 'grid_matrix';
    const gridCols = Number(catSettings.grid_columns || (window.innerWidth <= 768 ? 4 : 6));
    const chipSize = catSettings.icon_size || 'medium';

    const chips = categories.map((cat, idx) => {
        const id = window.getCategoryIdentity(cat.name, idx);
        const isActive = activeCatName === cat.name ? 'active' : '';
        return `
            <button class="cat-chip cat-shape-${id.shape} ${isActive} size-${chipSize}" style="--c1:${id.c1};--c2:${id.c2};"
                onclick="HomeUI.handleCategoryChipClick('${window.escapeJsAttr(cat.name)}')">
                <span class="cat-chip-icon"><i class="fas ${id.icon}"></i></span>
                <span class="cat-chip-label">${cat.name}</span>
            </button>
        `;
    }).join('');
    
    if (isGrid) {
        return `<div id="home-category-chips" class="cat-chips-grid-matrix" style="display:grid; grid-template-columns: repeat(${gridCols}, minmax(0, 1fr)); gap:10px; padding:10px 15px 20px;">${chips}</div>`;
    }
    return `<div id="home-category-chips" class="cat-chips-strip">${chips}</div>`;
};

// 2. كائن واجهة المتجر الرئيسي (HomeUI)
window.HomeUI = {
    storeData: null,
    activeCategories: [],
    currentCatIndex: 0,
    verticalObserver: null,
    horizontalObservers: new Map(),
    activeTabCategory: null,

    // جلب وضبط إعدادات التخطيط العامة
    getGlobalLayoutSettings: function() {
        const config = window.currentStorefrontConfig || {};
        const ps = config.products_settings || {};
        const isMobile = window.innerWidth <= 768;
        const orient = isMobile ? (ps.portrait || {}) : (ps.landscape || {});
        
        return {
            display_mode: ps.display_mode || 'by_categories_sections',
            sort_by: ps.sort_by || 'latest',
            out_of_stock_display: ps.out_of_stock_display || 'badge_at_end',
            scroll_direction: orient.scroll_direction || (isMobile ? 'horizontal' : 'horizontal'),
            grid_columns: Number(orient.grid_columns || orient.items_per_row || orient.columns_count || (isMobile ? 2 : 4)),
            grid_rows: Number(orient.grid_rows || 0),
            slider_rows: Number(orient.slider_rows || 1),
            card_orientation: orient.card_orientation || 'portrait',
            card_density: orient.card_density || 'standard',
            show_badges: orient.show_badges !== false,
            show_quick_add: orient.show_quick_add !== false,
            show_rating: orient.show_rating !== false,
            category_overrides: ps.category_overrides || {},
            isMobile: isMobile
        };
    },

    // استخراج إعدادات التخطيط لقسم محدد (مع دعم التخصيص المستقل لكل قسم)
    getCategoryLayoutSettings: function(categoryName) {
        const globalLayout = this.getGlobalLayoutSettings();
        const overrides = globalLayout.category_overrides[categoryName];

        if (overrides && overrides.enabled !== false) {
            return {
                ...globalLayout,
                scroll_direction: overrides.scroll_direction || globalLayout.scroll_direction,
                grid_columns: Number(overrides.grid_columns || overrides.items_per_row || globalLayout.grid_columns),
                grid_rows: Number(overrides.grid_rows !== undefined ? overrides.grid_rows : globalLayout.grid_rows),
                slider_rows: Number(overrides.slider_rows || globalLayout.slider_rows),
                card_orientation: overrides.card_orientation || globalLayout.card_orientation
            };
        }

        return globalLayout;
    },

    // فرز وتصفية المنتجات وفق إعدادات الترتيب والمخزون
    processProducts: function(products, layout) {
        if (!products || !Array.isArray(products)) return [];
        let list = products.slice();

        // 1. معالجة المنتجات منتهية المخزون
        if (layout.out_of_stock_display === 'hide') {
            list = list.filter(p => !p.is_out_of_stock && (p.quantity === undefined || Number(p.quantity) > 0));
        }

        // 2. الفرز والترتيب (Sort By)
        if (layout.sort_by === 'price_low') {
            list.sort((a, b) => (window.parsePrice(a).current) - (window.parsePrice(b).current));
        } else if (layout.sort_by === 'price_high') {
            list.sort((a, b) => (window.parsePrice(b).current) - (window.parsePrice(a).current));
        } else if (layout.sort_by === 'discount') {
            list.sort((a, b) => (parseFloat(b.discount || 0)) - (parseFloat(a.discount || 0)));
        }

        // 3. نقل المنتجات منتهية المخزون لآخر القائمة إذا كان الخيار مفعلاً
        if (layout.out_of_stock_display === 'badge_at_end') {
            const inStock = [];
            const outStock = [];
            list.forEach(p => {
                const isOut = p.is_out_of_stock || (p.quantity !== undefined && Number(p.quantity) === 0);
                if (isOut) outStock.push(p);
                else inStock.push(p);
            });
            list = inStock.concat(outStock);
        }

        return list;
    },

    // نقطة البداية الرئيسية للرندر
    render: function(store) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        this.storeData = store || window.App?.storeData || { categories: [] };
        this.activeCategories = (this.storeData && this.storeData.categories) ? this.storeData.categories : [];
        this.currentCatIndex = 0;
        this.activeTabCategory = null;

        // أثناء معاينة قالب، تكون الإعدادات المركبة من ملف JSON أعلى أولوية من config المتجر المنشور.
        const isTemplatePreview = new URLSearchParams(window.location.search).has('template_preview');
        const activeConfig = (isTemplatePreview && window.currentStorefrontConfig)
            ? window.currentStorefrontConfig
            : (this.storeData?.storefront_config || window.currentStorefrontConfig);

        this._isRendering = true;
        if (activeConfig) {
            window.currentStorefrontConfig = activeConfig;
            try {
                if (typeof window.initStorefront === 'function') {
                    window.initStorefront(activeConfig, this.storeData);
                }
            } catch (e) {
                console.warn("Storefront Engine notice:", e);
            }
        }
        this._isRendering = false;

        this.buildFullLayout();
    },

    // بناء الواجهة كاملة وفق الأقسام والنمط المختار
    buildFullLayout: function() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // التحقق من وجود بيانات المتجر
        if (!this.storeData) {
            this.storeData = window.App?.storeData || { categories: [] };
            this.activeCategories = this.storeData.categories || [];
        }

        const config = window.currentStorefrontConfig || {};
        const layout = this.getGlobalLayoutSettings();
        const rawBlocks = Array.isArray(config.layout_blocks) && config.layout_blocks.length > 0
            ? config.layout_blocks
            : [
                { type: 'hero', visible: true, order: 1 },
                { type: 'categories', visible: true, order: 2 },
                { type: 'products', visible: true, order: 3 }
            ];
        const blocks = rawBlocks.slice().sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        if (this.activeCategories.length === 0) {
            const heroBlock = blocks.find(b => b.type === 'hero' && b.visible !== false);
            let html = heroBlock ? this.buildStoreHero(this.storeData, heroBlock) : '';
            html += `
                <div class="empty-store-state fade-in-item">
                    <i class="fas fa-box-open"></i>
                    <h3>المتجر قيد التجهيز</h3>
                    <p>صاحب المتجر لم يقم بإضافة منتجات حتى الآن، عد إلينا قريباً!</p>
                </div>
            `;
            mainContent.innerHTML = html;
            return;
        }

        let html = '';
        let hasProductsBlock = false;
        let hasFeaturedBlock = false;

        blocks.forEach(block => {
            if (block.visible === false) return;

            if (block.type === 'hero') {
                html += this.buildStoreHero(this.storeData, block);
            } else if (block.type === 'categories') {
                const activeCat = layout.display_mode === 'tabs_by_category'
                    ? (this.activeTabCategory || this.activeCategories[0]?.name || '')
                    : '';
                html += window.createCategoryChipsStrip(this.activeCategories, activeCat);
            } else if (block.type === 'banner') {
                const s = block.settings || {};
                const bannerH = Number(s.banner_height || 0);
                const bannerStyle = bannerH > 0 ? `min-height: ${bannerH}px; display:flex; flex-direction:column; justify-content:center;` : '';
                html += `
                    <div class="store-promo-banner fade-in-item" style="margin: 15px; padding: 22px 20px; border-radius: var(--theme-card-radius, 18px); background: var(--theme-primary-gradient, linear-gradient(135deg, #4F46E5, #06B6D4)); color: white; text-align: center; box-shadow: 0 4px 18px rgba(0,0,0,0.15); ${bannerStyle}">
                        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 6px;">${block.title || 'عروض حصرية مميزة 🔥'}</h3>
                        <p style="font-size: 0.92rem; opacity: 0.95; margin-bottom: ${s.cta_text ? '14px' : '0'};">${block.subtitle || 'تسوق الآن واستمتع بأفضل الأسعار والتوصيل السريع!'}</p>
                        ${s.cta_text ? `<a href="${s.cta_link || '#products'}" class="btn-action" style="display:inline-block; padding: 8px 24px; background: white; color: var(--theme-primary, #4F46E5); font-weight: 800; border-radius: var(--theme-button-radius, 12px); text-decoration:none; margin: 0 auto;">${s.cta_text}</a>` : ''}
                    </div>
                `;
            } else if (block.type === 'products') {
                hasProductsBlock = true;

                // نمط 1: شبكة موحدة لكل المنتجات (all_flat_grid)
                if (layout.display_mode === 'all_flat_grid') {
                    html += `
                        <div class="store-category-block fade-in-item" style="padding-top: 10px;">
                            ${block.title ? `<h3 class="store-category-title" style="font-size: 1.15rem; font-weight: 900; margin: 0 20px 12px;">${block.title}</h3>` : ''}
                            <div class="product-grid" id="flat-products-grid" style="grid-template-columns: repeat(${layout.grid_columns}, minmax(0, 1fr)) !important; gap: ${layout.isMobile ? '12px' : '20px'} !important; padding: 10px 15px 30px;"></div>
                        </div>
                    `;
                } else if (layout.display_mode === 'tabs_by_category') {
                    // نمط 2: تبويبات الفئات (tabs_by_category)
                    const firstCat = this.activeTabCategory || this.activeCategories[0]?.name || '';
                    this.activeTabCategory = firstCat;
                    html += `
                        <div class="store-category-block fade-in-item" style="padding-top: 10px;">
                            <div class="product-grid" id="tab-products-grid" style="grid-template-columns: repeat(${layout.grid_columns}, minmax(0, 1fr)) !important; gap: ${layout.isMobile ? '12px' : '20px'} !important; padding: 10px 15px 30px;"></div>
                        </div>
                    `;
                } else {
                    // نمط 3: أقسام لكل فئة (by_categories_sections أو featured_first)
                    if (layout.display_mode === 'featured_first') {
                        const allProducts = this.getAllStoreProducts();
                        const discounted = allProducts.filter(p => parseFloat(p.discount || 0) > 0);
                        if (discounted.length > 0) {
                            hasFeaturedBlock = true;
                            html += `
                                <div class="store-category-block fade-in-item" id="featured-block">
                                    <h3 class="store-category-title" style="font-size: 1.15rem; font-weight: 900; margin: 0 20px 15px; display: flex; align-items: center; gap: 10px;">
                                        <div class="cat-title-icon" style="background: linear-gradient(135deg, #EF4444, #F97316); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                                            <i class="fas fa-fire"></i>
                                        </div>
                                        <span style="flex:1;">عروض وخصومات مميزة 🔥 <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold;">(${discounted.length})</span></span>
                                    </h3>
                                    <div class="horizontal-scroller virtual-scroller" id="scroller-featured" style="padding-bottom: 20px;"></div>
                                </div>
                            `;
                        }
                    }

                    html += `<div id="categories-wrapper"></div>`;
                    html += `<div id="vertical-sentinel" style="height: 60px; width: 100%; display: flex; justify-content: center; align-items: center; color: var(--primary);"><i class="fas fa-circle-notch fa-spin"></i></div>`;
                }
            }
        });

        mainContent.innerHTML = html;

        if (hasProductsBlock) {
            if (layout.display_mode === 'all_flat_grid') {
                this.renderFlatGridProducts();
            } else if (layout.display_mode === 'tabs_by_category') {
                this.renderTabCategoryProducts(this.activeTabCategory || this.activeCategories[0]?.name || '');
            } else {
                if (hasFeaturedBlock) {
                    const featContainer = document.getElementById('scroller-featured');
                    if (featContainer) {
                        const allProducts = this.getAllStoreProducts();
                        const processed = this.processProducts(allProducts.filter(p => parseFloat(p.discount || 0) > 0), layout);
                        processed.slice(0, 15).forEach(p => {
                            featContainer.appendChild(window.generateFastCardNode(p, true));
                        });
                    }
                }
                this.setupVerticalObserver();
                this.loadNextCategories(2);
            }
        }

        this.initAnimations();
        window._homeLayoutRendered = true;
    },

    // معالجة النقر على شريحة الفئة
    handleCategoryChipClick: function(catName) {
        const layout = this.getGlobalLayoutSettings();
        if (layout.display_mode === 'tabs_by_category') {
            this.activeTabCategory = catName;
            document.querySelectorAll('#home-category-chips .cat-chip').forEach(btn => {
                const label = btn.querySelector('.cat-chip-label')?.textContent?.trim();
                btn.classList.toggle('active', label === catName);
            });
            this.renderTabCategoryProducts(catName);
        } else {
            StoreUI.openCategoryFullView(catName);
        }
    },

    // عرض منتجات تبويب الفئة المختارة
    renderTabCategoryProducts: function(catName) {
        const container = document.getElementById('tab-products-grid');
        if (!container) return;
        container.innerHTML = '';

        const category = this.activeCategories.find(c => c.name === catName);
        if (!category) return;

        const layout = this.getCategoryLayoutSettings(catName);
        const products = this.processProducts(this.getAllProductsDeep(category), layout);
        products.forEach(p => {
            container.appendChild(window.generateFastCardNode(p, true));
        });
    },

    // عرض شبكة المنتجات الموحدة
    renderFlatGridProducts: function() {
        const container = document.getElementById('flat-products-grid');
        if (!container) return;
        container.innerHTML = '';

        const layout = this.getGlobalLayoutSettings();
        const allProducts = this.processProducts(this.getAllStoreProducts(), layout);
        allProducts.forEach(p => {
            container.appendChild(window.generateFastCardNode(p, true));
        });
    },

    getAllStoreProducts: function() {
        let all = [];
        (this.activeCategories || []).forEach(cat => {
            all = all.concat(this.getAllProductsDeep(cat));
        });
        return all;
    },

    getAllProductsDeep: function(category) {
        let all = (category.products || []).slice();
        if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach(sub => {
                all = all.concat(this.getAllProductsDeep(sub));
            });
        }
        return all;
    },

    // بناء كرت المتجر الهيرو
    buildStoreHero: function(store, block) {
        store = store || {};
        const hashId = window.getCategoryIdentity(store.id || store.name || 'store', 0);
        const gradient = `linear-gradient(135deg, ${hashId.c1}, ${hashId.c2})`;
        
        let locationText = "موقع المتجر";
        let locationHref = "javascript:void(0)";
        
        if (store.settings && store.settings.location) {
            locationHref = store.settings.location; 
        } else if (store.settings && (store.settings.address || store.settings.city)) {
            locationText = store.settings.address || store.settings.city;
        }

        let phoneText = store.phone || "غير متوفر";
        let deliveryText = "توصيل نالش";

        let collageHtml = '';
        if (window.allProducts && window.allProducts.length > 0) {
            const images = window.allProducts
                .map(p => p.image || p.image_url || p.img)
                .filter(img => img && img.trim() !== '')
                .slice(0, 12); 

            if (images.length > 0) {
                const imgTags = images.map(img => `<img src="${img}" loading="lazy">`).join('');
                collageHtml = `<div class="dsc-collage count-${images.length}">${imgTags}</div>`;
            }
        }

        const cfgIdent = window.currentStorefrontConfig?.store_identity || {};
        const effectiveName = (block && block.title) ? block.title : (cfgIdent.store_name || store.name || 'متجر نالش');
        const effectiveBio = (block && block.subtitle) ? block.subtitle : (cfgIdent.slogan || store.bio || 'مرحباً بكم في متجرنا');

        const heroSettings = (block && block.settings) ? block.settings : {};
        const isMobile = window.innerWidth <= 768;
        const heroHeight = Number(isMobile ? (heroSettings.hero_mobile_height || 0) : (heroSettings.hero_desktop_height || 0));
        const heroStyle = heroHeight > 0 ? `min-height: ${heroHeight}px;` : '';

        return `
            <div class="fade-in-item store-hero-wrapper"> 
                <div class="dynamic-store-card ${collageHtml ? 'has-collage' : ''}" style="${heroStyle}">
                    ${collageHtml}
                    <div class="dsc-gradient-overlay" style="background: ${gradient};"></div>
                    <div class="dsc-cover"></div>
                    
                    <div class="dsc-body">
                        <h1 class="dsc-name">${effectiveName}</h1>
                        <div class="dsc-username">${store.username || 'store'}</div>
                        <p class="dsc-bio">${effectiveBio}</p>
                        
                        <div class="dsc-info-grid">
                            <a href="${locationHref}" ${locationHref !== 'javascript:void(0)' ? 'target="_blank"' : ''} class="dsc-info-item" style="text-decoration:none;">
                                <i class="fas fa-map-marker-alt" style="color: ${hashId.c1}"></i>
                                <span>${locationText}</span>
                            </a>
                            <a href="tel:${phoneText}" class="dsc-info-item" style="cursor:pointer; text-decoration:none;">
                                <i class="fas fa-phone-alt" style="color: ${hashId.c1}"></i>
                                <span dir="ltr">${phoneText}</span>
                            </a>
                            <div class="dsc-info-item">
                                <i class="fas fa-motorcycle" style="color: ${hashId.c1}"></i>
                                <span>${deliveryText}</span>
                            </div>
                        </div>
                    </div>
                </div>

               
        `;
    },

    setupVerticalObserver: function() {
        const sentinel = document.getElementById('vertical-sentinel');
        if (!sentinel) return;

        if (this.verticalObserver) this.verticalObserver.disconnect();

        this.verticalObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadNextCategories(1);
            }
        }, { rootMargin: '300px' });

        this.verticalObserver.observe(sentinel);
    },

    loadNextCategories: function(count) {
        const wrapper = document.getElementById('categories-wrapper');
        const sentinel = document.getElementById('vertical-sentinel');
        if (!wrapper) return;

        for (let i = 0; i < count; i++) {
            if (this.currentCatIndex >= this.activeCategories.length) {
                if (sentinel) sentinel.style.display = 'none';
                if (this.verticalObserver) this.verticalObserver.disconnect();
                break;
            }

            const category = this.activeCategories[this.currentCatIndex];
            const catLayout = this.getCategoryLayoutSettings(category.name);
            const categoryProducts = this.processProducts(this.getAllProductsDeep(category), catLayout);
            const catId = window.getCategoryIdentity(category.name, this.currentCatIndex);

            const isVertical = catLayout.scroll_direction === 'vertical';
            const isMultiRow = !isVertical && Number(catLayout.slider_rows) === 2;

            const productsContainerHtml = isVertical
                ? `<div class="product-grid" id="scroller-${this.currentCatIndex}" style="grid-template-columns: repeat(${catLayout.grid_columns}, minmax(0, 1fr)) !important; gap: ${catLayout.isMobile ? '12px' : '18px'} !important; padding: 5px 15px 25px;"></div>`
                : `<div class="horizontal-scroller virtual-scroller ${isMultiRow ? 'multi-row-slider' : ''}" id="scroller-${this.currentCatIndex}" style="padding-bottom: 20px;"></div>`;

            const catHtml = `
                <div class="store-category-block fade-in-item" id="cat-block-${this.currentCatIndex}">
                    <h3 class="store-category-title" style="font-size: 1.15rem; font-weight: 900; margin: 0 20px 12px; display: flex; align-items: center; gap: 10px;">
                        <div class="cat-title-icon" style="background: linear-gradient(135deg, ${catId.c1}, ${catId.c2}); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas ${catId.icon}"></i>
                        </div>
                        <span style="flex:1;">${category.name}
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold;">(${categoryProducts.length})</span></span>
                        <button class="cat-view-all-btn" style="background:none; border:none; color:var(--primary); font-weight:800; font-size:0.85rem; cursor:pointer; white-space:nowrap;" onclick="StoreUI.openCategoryFullView('${window.escapeJsAttr(category.name)}')">
                            عرض الكل <i class="fas fa-chevron-left" style="font-size:0.7rem;"></i>
                        </button>
                    </h3>
                    ${productsContainerHtml}
                </div>
            `;
            wrapper.insertAdjacentHTML('beforeend', catHtml);

            const scrollerContainer = document.getElementById(`scroller-${this.currentCatIndex}`);
            if (isVertical) {
                // تقييد عدد الصفوف إذا كان محدداً
                let prodsToRender = categoryProducts;
                if (catLayout.grid_rows > 0) {
                    const maxItems = catLayout.grid_rows * catLayout.grid_columns;
                    prodsToRender = categoryProducts.slice(0, maxItems);
                }
                prodsToRender.forEach(p => {
                    scrollerContainer.appendChild(window.generateFastCardNode(p, true));
                });
            } else {
                this.renderCategoryScrollerLazy({ ...category, products: categoryProducts }, scrollerContainer);
            }

            this.currentCatIndex++;
        }
    },

    renderCategoryScrollerLazy: function(category, scrollerContainer) {
        if (!scrollerContainer) return;
        const products = category.products || [];
        const BATCH_SIZE = 10;
        let renderedCount = 0;

        if (this.horizontalObservers.has(scrollerContainer)) {
            this.horizontalObservers.get(scrollerContainer).disconnect();
            this.horizontalObservers.delete(scrollerContainer);
        }

        const sentinel = document.createElement('div');
        sentinel.className = 'h-scroll-sentinel';
        sentinel.style.cssText = 'flex:0 0 4px; align-self:stretch;';

        const renderNextBatch = () => {
            const fragment = document.createDocumentFragment();
            const end = Math.min(renderedCount + BATCH_SIZE, products.length);
            for (let i = renderedCount; i < end; i++) {
                fragment.appendChild(window.generateFastCardNode(products[i], true));
            }
            scrollerContainer.insertBefore(fragment, sentinel);
            renderedCount = end;

            if (renderedCount >= products.length) {
                if (this.horizontalObservers.has(scrollerContainer)) {
                    this.horizontalObservers.get(scrollerContainer).disconnect();
                    this.horizontalObservers.delete(scrollerContainer);
                }
                sentinel.remove();
            }
        };

        scrollerContainer.appendChild(sentinel);
        renderNextBatch();

        if (renderedCount < products.length) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    renderNextBatch();
                }
            }, { root: scrollerContainer, rootMargin: '0px 200px 0px 0px', threshold: 0.01 });

            observer.observe(sentinel);
            this.horizontalObservers.set(scrollerContainer, observer);
        }
    },

    filterProducts: function(query) {
        query = query.toLowerCase().trim();
        
        this.currentCatIndex = 0;
        this.horizontalObservers.forEach(obs => obs.disconnect());
        this.horizontalObservers.clear();
        if (this.verticalObserver) this.verticalObserver.disconnect();
        
        const wrapper = document.getElementById('categories-wrapper');
        const sentinel = document.getElementById('vertical-sentinel');
        const chipsStrip = document.getElementById('home-category-chips');
        if (!wrapper) return;

        if (chipsStrip) chipsStrip.style.display = query ? 'none' : 'flex';
        wrapper.innerHTML = ''; 

        if (!query) {
            this.activeCategories = (this.storeData && this.storeData.categories) ? this.storeData.categories : [];
        } else {
            const filtered = [];
            const cats = (this.storeData && this.storeData.categories) ? this.storeData.categories : [];
            cats.forEach(cat => {
                const allCatProducts = this.getAllProductsDeep(cat);
                const matched = allCatProducts.filter(p => (p.name || '').toLowerCase().includes(query));
                if (matched.length > 0) {
                    filtered.push({ name: cat.name, products: matched });
                }
            });
            this.activeCategories = filtered;
        }

        if (this.activeCategories.length === 0) {
            wrapper.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">لا توجد منتجات تطابق بحثك.</div>`;
            if (sentinel) sentinel.style.display = 'none';
        } else {
            if (sentinel) sentinel.style.display = 'flex';
            this.setupVerticalObserver();
            this.loadNextCategories(2); 
        }
    },

    // تطبيق التغييرات الحية القادمة من لوحة التحكم فوراً
    applyLiveConfig: function(config) {
        // تعيين الـ config العالمي أولاً قبل أي قراءة منه في buildFullLayout
        const prevMode = (window.currentStorefrontConfig?.products_settings?.display_mode) || 'by_categories_sections';
        window.currentStorefrontConfig = config;

        const newMode = config?.products_settings?.display_mode || 'by_categories_sections';

        // إعادة ضبط الـ state عند تغيير نمط العرض
        this.currentCatIndex = 0;
        if (prevMode !== newMode) {
            this.activeTabCategory = null;
        }

        this.horizontalObservers.forEach(obs => obs.disconnect());
        this.horizontalObservers.clear();
        if (this.verticalObserver) this.verticalObserver.disconnect();

        if (!this.storeData) {
            this.storeData = window.App?.storeData || { categories: [] };
        }
        this.activeCategories = (this.storeData && this.storeData.categories) ? this.storeData.categories : [];

        // إعادة بناء الواجهة بالنمط الجديد
        this.buildFullLayout();
    },

    initAnimations: function() {
        const items = document.querySelectorAll('.fade-in-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.04}s`;
        });
    }
};

// الاستماع لتغيير حجم الشاشة لإعادة ضبط الأعمدة بسلاسة
window.addEventListener('resize', () => {
    if (window.HomeUI && window.HomeUI.storeData) {
        clearTimeout(window._homeResizeTimeout);
        window._homeResizeTimeout = setTimeout(() => {
            if (window.HomeUI.buildFullLayout) {
                window.HomeUI.applyLiveConfig(window.currentStorefrontConfig || {});
            }
        }, 150);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const EDGE_THRESHOLD = 40; 
    const SWIPE_THRESHOLD = 60; 

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleEdgeSwipe();
    }, { passive: true });

    function handleEdgeSwipe() {
        const screenWidth = window.innerWidth;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (touchStartX < EDGE_THRESHOLD && deltaX > 0) {
                triggerAppBack();
            }
            else if (touchStartX > (screenWidth - EDGE_THRESHOLD) && deltaX < 0) {
                triggerAppBack();
            }
        }
    }

    function triggerAppBack() {
        const activeSheets = document.querySelectorAll('.sheet-modal.open');
        if (activeSheets.length > 0) {
            const topSheet = activeSheets[activeSheets.length - 1];
            const closeBtn = topSheet.querySelector('.modern-close-sheet, .close-btn, button[onclick*="close"]');
            if (closeBtn) closeBtn.click();
            return; 
        }

        const activeOverlays = document.querySelectorAll('.page-overlay.open, .category-page.open');
        if (activeOverlays.length > 0) {
            const topOverlay = activeOverlays[activeOverlays.length - 1];
            const backBtn = topOverlay.querySelector('.back-btn, .close-btn, button[onclick*="close"]');
            if (backBtn) backBtn.click();
            return;
        }

        if (typeof NavigationUI !== 'undefined' && typeof NavigationUI.goBack === 'function') {
            NavigationUI.goBack();
        }
    }
});