/* ==========================================================================
   Store UI & Logic (store.js) - نالش
   يحتوي على: التنقل بين الأقسام، شريط الفئات اللاصق، وعرض الشبكة الكاملة
   ========================================================================== */

// ⭐ إصلاح: يجمع منتجات القسم + كل منتجات أقسامه الفرعية مهما كان عمق التداخل.
// نفس منطق HomeUI.getAllProductsDeep، مكرَّرة هنا كدالة مستقلة حتى لا يعتمد
// هذا الملف على ترتيب تحميل home.js قبله.
function getAllProductsDeep(category) {
    let all = (category.products || []).slice();
    if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
            all = all.concat(getAllProductsDeep(sub));
        });
    }
    return all;
}

window.StoreUI = {
    // حفظ حالة الصفحة الرئيسية عند فتح قسم كامل
    savedHomeHtml: '',
    // الفئة المفتوحة حالياً في صفحة "عرض الكل" (لاستخدامها في فلترة الفئات الفرعية)
    _currentFullViewCategory: null,

    // 1. بناء شريط الفئات العائم (Sticky Category Bar) - اختياري، بديل لشريط الفئات العصري (Chips)
    // يمكن استدعاء هذه الدالة من home.js لحقن الشريط تحت الغلاف
    buildStickyCategoryBar: function(categories) {
        if (!categories || categories.length === 0) return '';

        let html = '<div class="sticky-category-bar" id="store-sticky-bar">';
        categories.forEach((cat, index) => {
            const activeClass = index === 0 ? 'active' : '';
            html += `<button class="premium-cat-btn ${activeClass}" onclick="StoreUI.scrollToCategory('${cat.name}', this)">
                        ${cat.name}
                     </button>`;
        });
        html += '</div>';

        return html;
    },

    // 2. التمرير السلس إلى القسم عند النقر على اسمه في الشريط
    scrollToCategory: function(catName, btnElement) {
        // تحديث الزر النشط
        document.querySelectorAll('.premium-cat-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');

        // البحث عن القسم في الصفحة
        const blocks = document.querySelectorAll('.store-category-block');
        for (let block of blocks) {
            const titleElement = block.querySelector('.store-category-title');
            if (titleElement && titleElement.innerText.trim() === catName.trim()) {
                
                // حساب المسافة مع مراعاة الهيدر والشريط العائم
                const offset = 130; // مسافة الهيدر + الشريط اللاصق
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = block.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                break;
            }
        }
    },

    // 3. فتح القسم بالكامل (عند الضغط على "عرض الكل" أو عند الضغط على فئة من الواجهة الرئيسية)
    // يعرض منتجات الفئة الأب بالكامل، ويحوّل الشريط العلوي الحقيقي (وليس هيدر مكرر داخل الصفحة)
    // لعرض اسم الفئة + زر رجوع + شرائح الفئات الفرعية للتصفية السريعة
    //
    // ملاحظة أداء مهمة: نخفي محتوى الصفحة الرئيسية (Home) بدل استبداله بنص HTML، لأن كروت
    // المنتجات تُبنى كعقد DOM حقيقية وأحداثها (onclick) مرتبطة برمجياً (لا تُحفظ داخل innerHTML).
    // استبدال innerHTML كان سيفقد كل أزرار "المفضلة/أضف للسلة/فتح التفاصيل" عند العودة للرئيسية.
    openCategoryFullView: function(categoryName) {
        const store = window.App.storeData;
        const category = store.categories.find(c => c.name === categoryName);
        if (!category) return;

        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // نلف محتوى الصفحة الرئيسية الحالي (أول مرة فقط) في حاوية واحدة قابلة للإخفاء
        let homeRoot = document.getElementById('home-view-root');
        if (!homeRoot) {
            homeRoot = document.createElement('div');
            homeRoot.id = 'home-view-root';
            while (mainContent.firstChild) {
                homeRoot.appendChild(mainContent.firstChild);
            }
            mainContent.appendChild(homeRoot);
        }
        homeRoot.style.display = 'none';

        // إزالة أي صفحة فئة مفتوحة سابقاً
        const existingPage = document.getElementById('category-full-view-root');
        if (existingPage) existingPage.remove();

        const categoryPage = document.createElement('div');
        categoryPage.id = 'category-full-view-root';
        // padding-top: تضمن أن المنتجات تُعرض تحت الشريط العلوي الثابت وليس خلفه
        categoryPage.className = 'category-full-page category-page open fade-in-item';
        categoryPage.style.cssText = 'padding-top: 130px; padding-bottom: 80px;';
        categoryPage.innerHTML = `
            <!-- زر رجوع مخفي: يُستخدم فقط ليكتشفه نظام "السحب للرجوع" من حافة الشاشة، فالرجوع الفعلي عبر زر الشعار بالشريط العلوي -->
            <button class="back-btn" style="display:none;" onclick="StoreUI.closeCategoryFullView()"></button>

            <!-- شبكة المنتجات (متجاوبة) -->
            <div class="store-premium-grid" id="category-page-grid"></div>
        `;

        mainContent.appendChild(categoryPage);
        this._currentFullViewCategory = category;
        window.scrollTo(0, 0); // الصعود لأعلى الصفحة

        // تحويل الشريط العلوي الحقيقي: زر رجوع + اسم الفئة + شرائح الفئات الفرعية
        if (typeof window.enterCategoryTopBar === 'function') {
            window.enterCategoryTopBar(category);
        }

        // رسم كل منتجات الفئة (الأب) بمحرك الرسم السريع (دفعات عبر requestAnimationFrame)
        const grid = document.getElementById('category-page-grid');
        if (grid && typeof window.renderThousandsOfProducts === 'function') {
            // ⭐ إصلاح: نشمل منتجات كل الأقسام الفرعية المتداخلة، وليس فقط
            // المنتجات المرتبطة مباشرة بهذا القسم.
            window.renderThousandsOfProducts(getAllProductsDeep(category), grid, true);
        }
    },

    // تصفية صفحة الفئة حسب فئة فرعية معينة (أو "الكل" للعودة لكامل منتجات الأب)
    // تُستدعى من شرائح الفئات الفرعية المعروضة الآن داخل الشريط العلوي نفسه (#sub-navbar)
    filterCategoryPageBySub: function(subName, chipEl) {
        const category = this._currentFullViewCategory;
        if (!category) return;

        if (chipEl && typeof window.setActiveSubNav === 'function') {
            window.setActiveSubNav(chipEl);
        }

        let products = getAllProductsDeep(category);
        if (subName !== '__all__') {
            const sub = (category.subcategories || []).find(s => s.name === subName);
            products = sub ? getAllProductsDeep(sub) : [];
        }

        const grid = document.getElementById('category-page-grid');
        if (grid && typeof window.renderThousandsOfProducts === 'function') {
            window.renderThousandsOfProducts(products, grid, true);
        }
    },

    // 4. إغلاق القسم والعودة للرئيسية (نُظهر الحاوية الأصلية الحية بدل إعادة رسمها من نص HTML)
    closeCategoryFullView: function() {
        const categoryPage = document.getElementById('category-full-view-root');
        if (categoryPage) categoryPage.remove();

        const homeRoot = document.getElementById('home-view-root');
        if (homeRoot) homeRoot.style.display = '';

        // استعادة الشريط العلوي الأصلي (الشعار + فئات الأب)
        if (typeof window.exitCategoryTopBar === 'function') {
            window.exitCategoryTopBar();
        }

        this._currentFullViewCategory = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 5. فتح نافذة معلومات المتجر (سياسات، تواصل، فروع)
    openStoreInfoModal: function() {
        const store = window.App.storeData;
        if (!store) return;

        // إنشاء نافذة منبثقة سفلية (Bottom Sheet)
        let modal = document.getElementById('store-info-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'store-info-modal';
            modal.className = 'sheet-modal';
            document.body.appendChild(modal);

            // إنشاء خلفية داكنة (Overlay)
            const overlay = document.createElement('div');
            overlay.id = 'store-info-overlay';
            overlay.className = 'modal-overlay';
            overlay.onclick = () => this.closeStoreInfoModal();
            document.body.appendChild(overlay);
        }

        modal.innerHTML = `
            <div class="sheet-handle"><div></div></div>
            <button class="modern-close-sheet" onclick="StoreUI.closeStoreInfoModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="sheet-body" style="padding-top: 20px;">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div class="ultra-avatar" style="margin: 0 auto 15px; width: 70px; height: 70px;">
                        ${store.name.charAt(0)}
                    </div>
                    <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin-bottom: 5px;">${store.name}</h2>
                    <span style="color: var(--primary); font-family: monospace; font-weight: bold;">${store.username}</span>
                </div>

                <div class="info-group" style="background: var(--bg-body); padding: 15px; border-radius: 16px; margin-bottom: 15px; border: 1px solid var(--border);">
                    <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 8px; font-weight: 800;"><i class="fas fa-info-circle" style="color: var(--primary); margin-left: 5px;"></i> عن المتجر</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${store.bio}</p>
                </div>

                <div class="info-group" style="background: var(--bg-body); padding: 15px; border-radius: 16px; margin-bottom: 15px; border: 1px solid var(--border);">
                    <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 8px; font-weight: 800;"><i class="fas fa-truck" style="color: var(--primary); margin-left: 5px;"></i> سياسة التوصيل</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">التوصيل متوفر لجميع المناطق عبر مندوبين نالش. قد تختلف الأسعار حسب المسافة.</p>
                </div>

                <div class="contact-links" style="display: flex; gap: 10px; margin-top: 20px;">
                    <a href="#" class="btn-action" style="flex: 1; background: #25D366; color: white; text-decoration: none; font-size: 1rem;">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </a>
                    <a href="#" class="btn-action" style="flex: 1; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); text-decoration: none; font-size: 1rem;">
                        <i class="fas fa-share-alt"></i> مشاركة
                    </a>
                </div>
            </div>
        `;

        // إظهار النافذة
        document.getElementById('store-info-overlay').classList.add('open');
        setTimeout(() => modal.classList.add('open'), 50);
        document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
    },

    closeStoreInfoModal: function() {
        const modal = document.getElementById('store-info-modal');
        const overlay = document.getElementById('store-info-overlay');
        if (modal) modal.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// =====================================================
// ✅ ملاحظة: تم ربط هذا الملف تلقائياً الآن
// =====================================================
// - home.js يقوم بحقن شريط الفئات العصري (Chips) أعلى صفحة المتجر عبر
//   window.createCategoryChipsStrip(store.categories) والذي يستدعي
//   StoreUI.openCategoryFullView(name) عند الضغط على أي فئة.
// - كل قسم فئة في الصفحة الرئيسية يملك زر "عرض الكل" يستدعي نفس الدالة.
// - صفحة "عرض الكل" تعرض شرائح الفئات الفرعية (إن وجدت) للتصفية السريعة
//   عبر StoreUI.filterCategoryPageBySub(name).
