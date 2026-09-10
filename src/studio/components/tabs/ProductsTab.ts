/**
 * ========================================================
 * 📦 ProductsTab Component (with Auto Device Sync!)
 * ========================================================
 */

import { studioState } from '../../state';

export class ProductsTab {
    public static render(): string {
        const ps = studioState.config.products_settings || {
            portrait: {},
            landscape: {},
            category_overrides: {}
        };
        const activeSub = studioState.activeProductSubTab || 'portrait';
        const currentOrientSettings = activeSub === 'landscape' ? (ps.landscape || {}) : (ps.portrait || {});

        // Fetch categories list from iframe if available
        let catList = ['العطور والعود', 'الملابس والأزياء', 'الساعات والمجوهرات', 'الأجهزة الذكية', 'العناية والجمال'];
        try {
            const iframe = document.getElementById('store-preview-frame') as HTMLIFrameElement;
            if ((iframe?.contentWindow as any)?.App?.storeData?.categories?.length) {
                catList = (iframe.contentWindow as any).App.storeData.categories.map((c: any) => c.name);
            }
        } catch (e) {}

        if (!studioState.selectedCategoryForOverride && catList.length > 0) {
            studioState.selectedCategoryForOverride = catList[0];
        }

        const activeCatOverride = (studioState.selectedCategoryForOverride && ps.category_overrides?.[studioState.selectedCategoryForOverride]) || null;
        const isCatOverrideActive = activeCatOverride && activeCatOverride.enabled !== false;

        return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card accent">
                    <span class="label">وضع العرض</span>
                    <strong>${activeSub === 'portrait' ? 'جوال' : activeSub === 'landscape' ? 'كمبيوتر' : 'أقسام'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">رتبة الترتيب</span>
                    <strong>${ps.sort_by || 'latest'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">أقسام المتجر</span>
                    <strong>${catList.length}</strong>
                </div>
            </div>

            <div class="sb-alert-box info">
                <i class="fas fa-magic"></i>
                <div>
                    <strong>تحكم متكامل في عرض وتخطيط المنتجات ⚡</strong>
                    <span>التبديل بين وضع الجوال والكمبيوتر يغير <strong>شاشة المعاينة تلقائياً</strong> لمعاينة حية ومثالية!</span>
                </div>
            </div>

            <div class="sb-product-mini-actions">
                <button class="sb-product-mini-btn ${activeSub === 'portrait' ? 'active' : ''}" onclick="window.StudioUI.switchProductSubTab('portrait')">
                    <i class="fas fa-mobile-alt"></i>
                    <span>جوال</span>
                </button>
                <button class="sb-product-mini-btn ${activeSub === 'landscape' ? 'active' : ''}" onclick="window.StudioUI.switchProductSubTab('landscape')">
                    <i class="fas fa-desktop"></i>
                    <span>كمبيوتر</span>
                </button>
                <button class="sb-product-mini-btn ${activeSub === 'categories' ? 'active' : ''}" onclick="window.StudioUI.switchProductSubTab('categories')">
                    <i class="fas fa-folder-tree"></i>
                    <span>أقسام</span>
                </button>
            </div>

            <!-- النمط العام للرئيسية والفرز -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-boxes-stacked" style="color:var(--sb-primary);"></i>
                    <h3>نمط وتجميع المنتجات في المتجر</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.2); padding: 14px 16px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-layer-group" style="color: var(--sb-primary); font-size: 1.2rem;"></i>
                            <div>
                                <strong style="font-size: 0.95rem; display: block; color: var(--sb-text);">نمط العرض: أقسام مستقلة لكل فئة 📂</strong>
                                <small style="font-size: 0.78rem; color: var(--sb-muted);">يتم تنظيم منتجات متجرك تلقائياً في صفوف وأقسام جذابة بحسب تصنيفاتها</small>
                            </div>
                        </div>
                        <span class="sb-badge-info" style="background: var(--sb-primary); color: #fff; font-weight: 800; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem;">نشط ومفعل ⭐</span>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">ترتيب المنتجات الافتراضي (Sort By)</label>
                        <select class="sb-select" onchange="window.StudioUI.handleProductsSettingChange('sort_by', this.value)">
                            <option value="latest" ${ps.sort_by === 'latest' ? 'selected' : ''}>الأحدث نزولاً في المتجر (Default)</option>
                            <option value="price_low" ${ps.sort_by === 'price_low' ? 'selected' : ''}>من الأقل سعراً للأعلى 💵</option>
                            <option value="price_high" ${ps.sort_by === 'price_high' ? 'selected' : ''}>من الأعلى سعراً للأقل 💎</option>
                            <option value="discount" ${ps.sort_by === 'discount' ? 'selected' : ''}>الأعلى نسبة خصم وعروض 🔥</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- تبويبات التخصيص المستقل (جوال / كمبيوتر / أقسام) -->
            <div class="sb-card-group highlight">
                <div class="sb-subtab-switcher">
                    <button class="sb-subtab-btn ${activeSub === 'portrait' ? 'active' : ''}" 
                            onclick="window.StudioUI.switchProductSubTab('portrait')">
                        <i class="fas fa-mobile-alt"></i>
                        <span>📱 شاشات الجوال</span>
                    </button>
                    <button class="sb-subtab-btn ${activeSub === 'landscape' ? 'active' : ''}" 
                            onclick="window.StudioUI.switchProductSubTab('landscape')">
                        <i class="fas fa-desktop"></i>
                        <span>💻 الكمبيوتر والشاشات</span>
                    </button>
                    <button class="sb-subtab-btn ${activeSub === 'categories' ? 'active' : ''}" 
                            onclick="window.StudioUI.switchProductSubTab('categories')">
                        <i class="fas fa-folder-tree"></i>
                        <span>📂 تخصيص الأقسام</span>
                    </button>
                </div>

                ${activeSub === 'portrait' ? `
                    <!-- إعدادات الجوال (Portrait) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card">
                            <label class="sb-field-label">اتجاه تمرير المنتجات بالجوال</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.scroll_direction || 'horizontal') === 'horizontal' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'scroll_direction', 'horizontal')">
                                    ↔️ أفقي (سلايدر باللمس 👆)
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.scroll_direction === 'vertical' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'scroll_direction', 'vertical')">
                                    ↕️ عمودي (شبكة تنزل للأسفل)
                                </button>
                            </div>
                        </div>

                        <!-- عدد الأعمدة بالجوال -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : (currentOrientSettings.card_orientation === 'landscape' || currentOrientSettings.card_style === 'landscape_row') ? 'opacity:0.6; pointer-events:none;' : ''}">
                            <label class="sb-field-label">عدد الأعمدة بالجوال</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns || 2) === 1 || (currentOrientSettings.card_orientation === 'landscape' || currentOrientSettings.card_style === 'landscape_row') ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 1)">
                                    1️⃣ عمود 1
                                </button>
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.grid_columns || 2) === 2 || !currentOrientSettings.grid_columns) && !(currentOrientSettings.card_orientation === 'landscape' || currentOrientSettings.card_style === 'landscape_row') ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 2)">
                                    2️⃣ عمودين ⭐
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns) === 3 && !(currentOrientSettings.card_orientation === 'landscape' || currentOrientSettings.card_style === 'landscape_row') ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 3)">
                                    3️⃣ 3 أعمدة
                                </button>
                            </div>
                            ${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : (currentOrientSettings.card_orientation === 'landscape' || currentOrientSettings.card_style === 'landscape_row') ? '<span style="font-size:0.72rem; color:#06B6D4; display:block; margin-top:4px;">الكرت بالعرض يملأ عرض الشاشة (عمود 1) تلقائياً</span>' : ''}
                        </div>

                        <!-- عدد الصفوف بالجوال -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                            <label class="sb-field-label">عدد الصفوف المعروضة بالجوال</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows || 0) === 0 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_rows', 0)">
                                    ♾️ الكل
                                </button>
                                ${[1, 2, 3, 4].map(num => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows) === num ? 'active' : ''}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_rows', ${num})">
                                        ${num} صف
                                    </button>
                                `).join('')}
                            </div>
                            ${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : ''}
                        </div>

                        <!-- صفوف السلايدر بالجوال -->
                        <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                            <label class="sb-field-label">صفوف السلايدر بالجوال</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.slider_rows) || 1) === 1 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'slider_rows', 1)">
                                    صف واحد كلاسيكي
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.slider_rows) === 2 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'slider_rows', 2)">
                                    صفين مزدوجين ⚡
                                </button>
                            </div>
                            ${currentOrientSettings.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع التمرير الأفقي (السلايدر)</span>' : ''}
                        </div>

                        <div class="sb-field-card">
                            <label class="sb-field-label">اتجاه كرت المنتج بالجوال</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || 'portrait') === 'portrait' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'card_orientation', 'portrait')">
                                    📱 بالطول
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.card_orientation === 'landscape' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'card_orientation', 'landscape')">
                                    🖥️ بالعرض
                                </button>
                            </div>
                        </div>

                        <!-- اختيار شكل الكرت للجوال -->
                        <div class="sb-field-card" style="margin-top:12px;">
                            <label class="sb-field-label">🎨 شكل وتصميم الكرت (الجوال)</label>
                            <div class="sb-card-style-grid">
                                ${[
                                    { key: 'classic',       icon: '🟦', label: 'كلاسيكي' },
                                    { key: 'minimal',       icon: '🌫️', label: 'مبسط' },
                                    { key: 'bold',          icon: '🔡', label: 'بولد' },
                                    { key: 'landscape_row', icon: '↔️', label: 'عريض أفقي' },
                                    { key: 'magazine',      icon: '📰', label: 'مجلة' },
                                    { key: 'glass',         icon: '🔮', label: 'زجاجي' }
                                ].map(s => `
                                    <button class="sb-card-style-btn ${(currentOrientSettings.card_style || 'classic') === s.key ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCardStyleChange('portrait', '${s.key}')">
                                        <span class="csb-icon">${s.icon}</span>
                                        <span class="csb-label">${s.label}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- أشرطة المقاسات للجوال (بلا لاغ) -->
                        <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px;">
                            <div class="sb-group-header" style="margin-bottom:12px;">
                                <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                <h4 style="margin:0; font-size:0.9rem;">📐 أبعاد وحجم الكروت</h4>
                            </div>
                            
                            <div class="sb-fields-grid">
                                <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                    <div class="sb-slider-label">
                                        <span>↔️ عرض الكرت:</span>
                                        <strong id="val-port-width">${(currentOrientSettings.card_custom_width || 0) === 0 ? 'تلقائي' : (currentOrientSettings.card_custom_width || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="360" step="5" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_width || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-width').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'card_custom_width', v);
                                           " />
                                    ${currentOrientSettings.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">متاح فقط في السلايدر الأفقي</span>' : ''}
                                </div>

                                <div class="sb-field-card">
                                    <div class="sb-slider-label">
                                        <span>↕️ ارتفاع الكرت كامل:</span>
                                        <strong id="val-port-height">${(currentOrientSettings.card_custom_height || 0) === 0 ? 'تلقائي' : (currentOrientSettings.card_custom_height || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'card_custom_height', v);
                                           " />
                                </div>

                                <div class="sb-field-card" style="grid-column: 1 / -1;">
                                    <div class="sb-slider-label">
                                        <span>🖼️ ارتفاع الصورة فقط:</span>
                                        <strong id="val-port-img-height">${(currentOrientSettings.img_custom_height || 0) === 0 ? 'تلقائي' : (currentOrientSettings.img_custom_height || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="300" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.img_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-img-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'img_custom_height', v);
                                           " />
                                </div>
                            </div>
                        </div>
                    </div>
                ` : activeSub === 'landscape' ? `
                    <!-- إعدادات الكمبيوتر (Landscape) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card">
                            <label class="sb-field-label">اتجاه تمرير المنتجات في الكمبيوتر</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.scroll_direction || 'horizontal') === 'horizontal' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'scroll_direction', 'horizontal')">
                                    ↔️ أفقي (سلايدر بالماوس 🖱️)
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.scroll_direction === 'vertical' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'scroll_direction', 'vertical')">
                                    ↕️ عمودي (شبكة كبرى)
                                </button>
                            </div>
                        </div>

                        <!-- عدد الأعمدة في الكمبيوتر -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                            <label class="sb-field-label">عدد الأعمدة في الكمبيوتر</label>
                            <div class="sb-segmented-control">
                                ${[2, 3, 4, 5, 6].map(num => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns || 4) === num ? 'active' : ''}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_columns', ${num})">
                                        ${num} ${num === 4 ? '⭐' : ''}
                                    </button>
                                `).join('')}
                            </div>
                            ${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : ''}
                        </div>

                        <!-- عدد الصفوف في الكمبيوتر -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                            <label class="sb-field-label">عدد الصفوف في الكمبيوتر</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows || 0) === 0 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_rows', 0)">
                                    ♾️ الكل
                                </button>
                                ${[1, 2, 3, 4, 5].map(num => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows) === num ? 'active' : ''}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_rows', ${num})">
                                        ${num} صف
                                    </button>
                                `).join('')}
                            </div>
                            ${(currentOrientSettings.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : ''}
                        </div>

                        <!-- صفوف السلايدر في الكمبيوتر -->
                        <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                            <label class="sb-field-label">صفوف السلايدر في الكمبيوتر</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.slider_rows) || 1) === 1 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'slider_rows', 1)">
                                    صف واحد كلاسيكي
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.slider_rows) === 2 ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'slider_rows', 2)">
                                    صفين مزدوجين ⚡
                                </button>
                            </div>
                            ${currentOrientSettings.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع التمرير الأفقي (السلايدر)</span>' : ''}
                        </div>

                        <div class="sb-field-card">
                            <label class="sb-field-label">اتجاه كرت المنتج في الكمبيوتر</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || 'portrait') === 'portrait' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'card_orientation', 'portrait')">
                                    📱 بالطول
                                </button>
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || 'landscape') === 'landscape' ? 'active' : ''}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'card_orientation', 'landscape')">
                                    🖥️ بالعرض (أنيق للكمبيوتر 🌟)
                                </button>
                            </div>
                        </div>

                        <!-- اختيار شكل الكرت للكمبيوتر -->
                        <div class="sb-field-card" style="margin-top:12px;">
                            <label class="sb-field-label">🎨 شكل وتصميم الكرت (الكمبيوتر)</label>
                            <div class="sb-card-style-grid">
                                ${[
                                    { key: 'classic',       icon: '🟦', label: 'كلاسيكي' },
                                    { key: 'minimal',       icon: '🌫️', label: 'مبسط' },
                                    { key: 'bold',          icon: '🔡', label: 'بولد' },
                                    { key: 'landscape_row', icon: '↔️', label: 'عريض أفقي' },
                                    { key: 'magazine',      icon: '📰', label: 'مجلة' },
                                    { key: 'glass',         icon: '🔮', label: 'زجاجي' }
                                ].map(s => `
                                    <button class="sb-card-style-btn ${(currentOrientSettings.card_style || 'classic') === s.key ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCardStyleChange('landscape', '${s.key}')">
                                        <span class="csb-icon">${s.icon}</span>
                                        <span class="csb-label">${s.label}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- أشرطة المقاسات للكمبيوتر (بلا لاغ) -->
                        <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px;">
                            <div class="sb-group-header" style="margin-bottom:12px;">
                                <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                <h4 style="margin:0; font-size:0.9rem;">📐 أبعاد وحجم الكروت بالكمبيوتر</h4>
                            </div>
                            
                            <div class="sb-fields-grid">
                                <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                    <div class="sb-slider-label">
                                        <span>↔️ عرض الكرت:</span>
                                        <strong id="val-land-width">${(currentOrientSettings.card_custom_width || 0) === 0 ? 'تلقائي' : (currentOrientSettings.card_custom_width || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="450" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_width || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-width').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'card_custom_width', v);
                                           " />
                                    ${currentOrientSettings.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">متاح فقط في السلايدر الأفقي</span>' : ''}
                                </div>

                                <div class="sb-field-card">
                                    <div class="sb-slider-label">
                                        <span>↕️ ارتفاع الكرت كامل:</span>
                                        <strong id="val-land-height">${(currentOrientSettings.card_custom_height || 0) === 0 ? 'تلقائي' : (currentOrientSettings.card_custom_height || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="500" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'card_custom_height', v);
                                           " />
                                </div>

                                <div class="sb-field-card" style="grid-column: 1 / -1;">
                                    <div class="sb-slider-label">
                                        <span>🖼️ ارتفاع الصورة فقط:</span>
                                        <strong id="val-land-img-height">${(currentOrientSettings.img_custom_height || 0) === 0 ? 'تلقائي' : (currentOrientSettings.img_custom_height || 0) + 'px'}</strong>
                                    </div>
                                    <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.img_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-img-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'img_custom_height', v);
                                           " />
                                </div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- تخصيص الأقسام المستقلة (Categories) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">اختر القسم المراد تخصيصه</label>
                            <select class="sb-select" onchange="window.StudioUI.handleCategorySelectForOverride(this.value)">
                                ${catList.map(cat => `
                                    <option value="${cat}" ${studioState.selectedCategoryForOverride === cat ? 'selected' : ''}>
                                        ${cat} ${ps.category_overrides?.[cat]?.enabled ? '⭐ (مخصص)' : ''}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="sb-field-label" style="margin-bottom:0;">تفعيل تصميم فريد لقسم (${studioState.selectedCategoryForOverride})</label>
                                <label class="sb-switch">
                                    <input type="checkbox" ${isCatOverrideActive ? 'checked' : ''} 
                                           onchange="window.StudioUI.toggleCategoryOverrideEnabled('${studioState.selectedCategoryForOverride}', this.checked)" />
                                    <span class="sb-slider"></span>
                                </label>
                            </div>
                        </div>

                        ${isCatOverrideActive ? `
                            <div class="sb-field-card">
                                <label class="sb-field-label">اتجاه التمرير لقسم (${studioState.selectedCategoryForOverride})</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(activeCatOverride.scroll_direction || 'horizontal') === 'horizontal' ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'scroll_direction', 'horizontal')">
                                        ↔️ أفقي (سلايدر)
                                    </button>
                                    <button class="sb-seg-btn ${activeCatOverride.scroll_direction === 'vertical' ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'scroll_direction', 'vertical')">
                                        ↕️ عمودي (شبكة)
                                    </button>
                                </div>
                            </div>

                            <!-- عدد الأعمدة لهذا القسم -->
                            <div class="sb-field-card" style="${(activeCatOverride.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                <label class="sb-field-label">عدد الأعمدة لهذا القسم</label>
                                <div class="sb-segmented-control">
                                    ${[1, 2, 3, 4, 5, 6].map(num => `
                                        <button class="sb-seg-btn ${Number(activeCatOverride.grid_columns || 2) === num ? 'active' : ''}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_columns', ${num})">
                                            ${num}
                                        </button>
                                    `).join('')}
                                </div>
                                ${(activeCatOverride.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : ''}
                            </div>

                            <!-- عدد الصفوف لهذا القسم -->
                            <div class="sb-field-card" style="${(activeCatOverride.scroll_direction || 'horizontal') !== 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                <label class="sb-field-label">عدد الصفوف لهذا القسم</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${Number(activeCatOverride.grid_rows || 0) === 0 ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_rows', 0)">
                                        ♾️ الكل
                                    </button>
                                    ${[1, 2, 3, 4].map(num => `
                                        <button class="sb-seg-btn ${Number(activeCatOverride.grid_rows) === num ? 'active' : ''}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_rows', ${num})">
                                            ${num} صف
                                        </button>
                                    `).join('')}
                                </div>
                                ${(activeCatOverride.scroll_direction || 'horizontal') !== 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع الشبكة العمودية</span>' : ''}
                            </div>

                            <!-- صفوف السلايدر لهذا القسم -->
                            <div class="sb-field-card" style="${activeCatOverride.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                <label class="sb-field-label">صفوف السلايدر لهذا القسم</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(Number(activeCatOverride.slider_rows) || 1) === 1 ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'slider_rows', 1)">
                                        صف واحد
                                    </button>
                                    <button class="sb-seg-btn ${Number(activeCatOverride.slider_rows) === 2 ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'slider_rows', 2)">
                                        صفين مزدوجين ⚡
                                    </button>
                                </div>
                                ${activeCatOverride.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">متاح فقط في وضع التمرير الأفقي (السلايدر)</span>' : ''}
                            </div>

                            <div class="sb-field-card">
                                <label class="sb-field-label">اتجاه كرت المنتج في هذا القسم</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(activeCatOverride.card_orientation || 'portrait') === 'portrait' ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_orientation', 'portrait')">
                                        📱 بالطول
                                    </button>
                                    <button class="sb-seg-btn ${activeCatOverride.card_orientation === 'landscape' ? 'active' : ''}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_orientation', 'landscape')">
                                        🖥️ بالعرض
                                    </button>
                                </div>
                            </div>

                            <!-- اختيار شكل الكرت لهذا القسم -->
                            <div class="sb-field-card">
                                <label class="sb-field-label">🎨 شكل وتصميم الكرت لهذا القسم</label>
                                <div class="sb-card-style-grid">
                                    ${[
                                        { key: 'classic',       icon: '🟦', label: 'كلاسيكي' },
                                        { key: 'minimal',       icon: '🌫️', label: 'مبسط' },
                                        { key: 'bold',          icon: '🔡', label: 'بولد' },
                                        { key: 'landscape_row', icon: '↔️', label: 'عريض أفقي' },
                                        { key: 'magazine',      icon: '📰', label: 'مجلة' },
                                        { key: 'glass',         icon: '🔮', label: 'زجاجي' }
                                    ].map(s => `
                                        <button class="sb-card-style-btn ${(activeCatOverride.card_style || 'classic') === s.key ? 'active' : ''}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_style', '${s.key}')">
                                            <span class="csb-icon">${s.icon}</span>
                                            <span class="csb-label">${s.label}</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- أشرطة المقاسات لهذا القسم -->
                            <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px; grid-column: 1 / -1;">
                                <div class="sb-group-header" style="margin-bottom:12px;">
                                    <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                    <h4 style="margin:0; font-size:0.9rem;">📐 أبعاد كروت قسم (${studioState.selectedCategoryForOverride})</h4>
                                </div>
                                
                                <div class="sb-fields-grid">
                                    <div class="sb-field-card" style="${activeCatOverride.scroll_direction === 'vertical' ? 'opacity:0.45; pointer-events:none;' : ''}">
                                        <div class="sb-slider-label">
                                            <span>↔️ عرض الكرت:</span>
                                            <strong id="val-cat-width">${(activeCatOverride.card_custom_width || 0) === 0 ? 'تلقائي' : (activeCatOverride.card_custom_width || 0) + 'px'}</strong>
                                        </div>
                                        <input type="range" min="0" max="420" step="5" class="sb-range-slider"
                                               value="${activeCatOverride.card_custom_width || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-width').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'card_custom_width', v);
                                               " />
                                        ${activeCatOverride.scroll_direction === 'vertical' ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">متاح فقط في السلايدر الأفقي</span>' : ''}
                                    </div>

                                    <div class="sb-field-card">
                                        <div class="sb-slider-label">
                                            <span>↕️ ارتفاع الكرت كامل:</span>
                                            <strong id="val-cat-height">${(activeCatOverride.card_custom_height || 0) === 0 ? 'تلقائي' : (activeCatOverride.card_custom_height || 0) + 'px'}</strong>
                                        </div>
                                        <input type="range" min="0" max="480" step="10" class="sb-range-slider"
                                               value="${activeCatOverride.card_custom_height || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'card_custom_height', v);
                                               " />
                                    </div>

                                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                                        <div class="sb-slider-label">
                                            <span>🖼️ ارتفاع صورة المنتج فقط:</span>
                                            <strong id="val-cat-img-height">${(activeCatOverride.img_custom_height || 0) === 0 ? 'تلقائي' : (activeCatOverride.img_custom_height || 0) + 'px'}</strong>
                                        </div>
                                        <input type="range" min="0" max="380" step="10" class="sb-range-slider"
                                               value="${activeCatOverride.img_custom_height || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-img-height').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'img_custom_height', v);
                                               " />
                                    </div>
                                </div>
                            </div>

                            <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end;">
                                <button class="sb-btn sb-btn-danger" onclick="window.StudioUI.deleteCategoryOverride('${studioState.selectedCategoryForOverride}')">
                                    🗑️ حذف تخصيص ${studioState.selectedCategoryForOverride} والعودة للعام
                                </button>
                            </div>
                        ` : `
                            <div style="grid-column: 1 / -1; text-align:center; padding:20px; color:var(--sb-muted); font-size:0.85rem;">
                                هذا القسم يتبع حالياً الإعدادات العامة للمتجر. قم بتفعيل الخيار أعلاه لضبط مظهر خاص به!
                            </div>
                        `}
                    </div>
                `}
            </div>

            <!-- بطاقة تخصيص وتصميم زر إضافة إلى السلة -->
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-cart-plus" style="color:var(--sb-accent);"></i>
                    <h3>تخصيص وتصميم زر إضافة إلى السلة</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <label class="sb-field-label" style="margin-bottom:2px;">إظهار زر الإضافة السريعة للسلة في الكروت</label>
                                <small style="font-size:0.75rem; color:var(--sb-muted);">يتيح للعملاء إضافة المنتج مباشرة بنقرة واحدة</small>
                            </div>
                            <label class="sb-switch">
                                <input type="checkbox" ${ps.show_quick_add !== false ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_quick_add', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>
                    </div>

                    ${ps.show_quick_add !== false ? `
                        <!-- أشكال وتصاميم الزر -->
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">🎨 شكل وتصميم زر السلة</label>
                            <div class="sb-card-style-grid" style="grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));">
                                ${[
                                    { key: 'circle_icon',     icon: '🔘', label: 'دائري ناعم' },
                                    { key: 'pill_text',       icon: '💊', label: 'كبسولي بنص' },
                                    { key: 'rounded_box',     icon: '⬛', label: 'مربع ناعم' },
                                    { key: 'full_bottom',     icon: '🌟', label: 'عريض بالأسفل' },
                                    { key: 'outlined',        icon: '🔲', label: 'مؤطر شفاف' },
                                    { key: 'gradient_glow',   icon: '🔮', label: 'متدرج متوهج' },
                                    { key: 'floating_action', icon: '⚡', label: 'عائم بالصورة' }
                                ].map(b => {
                                    const currentStyle = ps.add_to_cart_btn?.style || 'circle_icon';
                                    return `
                                        <button class="sb-card-style-btn ${currentStyle === b.key ? 'active' : ''}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('style', '${b.key}')">
                                            <span class="csb-icon">${b.icon}</span>
                                            <span class="csb-label">${b.label}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- أيقونة الزر -->
                        <div class="sb-field-card">
                            <label class="sb-field-label">أيقونة الزر</label>
                            <div class="sb-segmented-control">
                                ${[
                                    { icon: 'fa-plus',            label: '➕ زائد' },
                                    { icon: 'fa-shopping-cart',   label: '🛒 عربة' },
                                    { icon: 'fa-shopping-bag',    label: '🛍️ كيس' },
                                    { icon: 'fa-shopping-basket', label: '🧺 سلة' },
                                    { icon: 'fa-bolt',            label: '⚡ برق' }
                                ].map(ic => {
                                    const currentIcon = ps.add_to_cart_btn?.icon || 'fa-plus';
                                    return `
                                        <button class="sb-seg-btn ${currentIcon === ic.icon ? 'active' : ''}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('icon', '${ic.icon}')">
                                            ${ic.label}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- نص الزر -->
                        <div class="sb-field-card">
                            <label class="sb-field-label">نص الزر (عند التفعيل)</label>
                            <input type="text" class="sb-input" value="${ps.add_to_cart_btn?.text || 'أضف للسلة'}"
                                   placeholder="أضف للسلة"
                                   oninput="window.StudioUI.handleAddToCartBtnSettingChange('text', this.value, false)" />
                        </div>

                        <!-- حركة وتفاعل الضغط -->
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">حركة وتأثير النقر على الزر</label>
                            <div class="sb-segmented-control">
                                ${[
                                    { key: 'scale',  label: '🔍 ضغط وتكبير (Scale)' },
                                    { key: 'bounce', label: '🚀 ارتداد مرح (Bounce)' },
                                    { key: 'glow',   label: '✨ توهج ضوئي (Glow)' },
                                    { key: 'none',   label: '🚫 بدون حركة' }
                                ].map(a => {
                                    const currentAnim = ps.add_to_cart_btn?.action_animation || 'scale';
                                    return `
                                        <button class="sb-seg-btn ${currentAnim === a.key ? 'active' : ''}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('action_animation', '${a.key}')">
                                            ${a.label}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- خيارات تفاصيل الكروت وحالات المخزون -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-tags" style="color:#F59E0B;"></i>
                    <h3>تفاصيل بطاقة المنتج والمخزون</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div class="sb-toggles-list">
                            <label class="sb-toggle-row">
                                <span>زر الإضافة السريعة للسلة على البطاقة</span>
                                <input type="checkbox" ${ps.show_quick_add !== false ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_quick_add', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>شارة حالة المخزون (متوفر / محدود)</span>
                                <input type="checkbox" ${ps.show_stock_badge !== false ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_stock_badge', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>شارة نسبة الخصم والتخفيض 🔥</span>
                                <input type="checkbox" ${ps.show_discount_badge !== false ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_discount_badge', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>وسم / فئة المنتج أعلى البطاقة</span>
                                <input type="checkbox" ${ps.show_category_tag !== false ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_category_tag', this.checked)" />
                            </label>
                        </div>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">طريقة التعامل مع المنتجات منتهية المخزون</label>
                        <select class="sb-select" onchange="window.StudioUI.handleProductsSettingChange('out_of_stock_display', this.value)">
                            <option value="badge_at_end" ${ps.out_of_stock_display === 'badge_at_end' ? 'selected' : ''}>نقلها لآخر القائمة مع شارة (نفد المخزون)</option>
                            <option value="hide" ${ps.out_of_stock_display === 'hide' ? 'selected' : ''}>إخفاؤها تماماً من المتجر</option>
                            <option value="normal" ${ps.out_of_stock_display === 'normal' ? 'selected' : ''}>إبقاؤها في موقعها الطبيعي مع شارة</option>
                        </select>
                    </div>

                    <div style="grid-column: 1 / -1;">
                        <button class="sb-btn sb-btn-ghost" style="width:100%; justify-content:center; color:#F87171;" 
                                onclick="window.StudioUI.resetProductsLayoutDefaults()">
                            🔄 استعادة الإعدادات الافتراضية لعرض المنتجات
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
