/**
 * ========================================================
 * 📑 SectionsTab Component - تخصيص وترتيب أقسام المتجر
 * ========================================================
 */

import { studioState } from '../../state';
import { DEFAULT_STOREFRONT_CONFIG } from '../../../config/storefrontConfigSchema';

export class SectionsTab {
    public static render(): string {
        const ps = studioState.config.products_settings || (DEFAULT_STOREFRONT_CONFIG.products_settings as any);
        
        // Ensure blocks exist
        if (!Array.isArray(studioState.config.layout_blocks) || studioState.config.layout_blocks.length === 0) {
            studioState.config.layout_blocks = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG.layout_blocks || []));
        }

        const blocks = studioState.config.layout_blocks || [];

        return `
        <div class="sb-tab-pane">
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-layer-group" style="color:var(--sb-primary);"></i>
                    <h3>قوالب هيكلية ذكية للصفحة الرئيسية</h3>
                </div>
                <div class="sb-segmented-control grid-4">
                    <button class="sb-seg-btn active" onclick="window.StudioUI.applySectionPreset('balanced')">متوازن</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('catalog')">كتالوج</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('luxury')">فاخر</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('promo')">ترويجي</button>
                </div>
            </div>

            <!-- بطاقة نمط وتجميع الأقسام الرئيسية -->
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-boxes-stacked" style="color:var(--sb-primary);"></i>
                    <h3>طريقة ونمط عرض الأقسام والمنتجات</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">النمط العام لعرض الأقسام بالصفحة الرئيسية</label>
                        <div class="sb-segmented-control grid-2">
                            <button class="sb-seg-btn ${ps.display_mode === 'by_categories_sections' || !ps.display_mode ? 'active' : ''}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'by_categories_sections')">
                                📂 أقسام لكل فئة
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === 'tabs_by_category' ? 'active' : ''}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'tabs_by_category')">
                                📑 تبويبات فئات
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === 'all_flat_grid' ? 'active' : ''}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'all_flat_grid')">
                                📦 شبكة موحدة
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === 'featured_first' ? 'active' : ''}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'featured_first')">
                                ⭐ المميزة أولاً
                            </button>
                        </div>
                    </div>

                    <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end;">
                        <button class="sb-btn sb-btn-secondary" style="font-size:0.85rem;" onclick="window.StudioUI.setActiveTab('products_layout')">
                            <i class="fas fa-sliders-h"></i> <span>تخصيص أعمدة وسلايدر المنتجات 👈</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- بطاقة ترتيب وهيكل الأقسام الرئيسية -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-layer-group" style="color:var(--sb-primary);"></i>
                    <h3>ترتيب وظهور الأقسام في الصفحة الرئيسية</h3>
                </div>

                <div class="sb-sections-list">
                    ${blocks.map((b, idx) => {
                        const isVisible = b.visible !== false;
                        const s = b.settings || {};
                        const icon = b.type === 'hero' ? 'fa-store' : b.type === 'categories' ? 'fa-tags' : b.type === 'products' ? 'fa-boxes-stacked' : b.type === 'banner' ? 'fa-bullhorn' : 'fa-star';
                        const typeName = b.type === 'hero' ? 'واجهة المتجر والكرت الرئيسي' : b.type === 'categories' ? 'شريط الفئات والتصنيفات' : b.type === 'products' ? 'منطقة عرض المنتجات' : b.type === 'banner' ? 'بانر إعلاني ترويجي' : 'قسم مخصص';

                        return `
                            <div class="sb-accordion-card ${isVisible ? '' : 'disabled'}" id="sec-acc-${idx}">
                                <div class="sb-accordion-header" onclick="window.StudioUI.toggleAccordion(${idx})">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <i class="fas ${icon}" style="color:var(--sb-primary);"></i>
                                        <div>
                                            <strong style="font-size:0.92rem; color:var(--sb-text); display:block;">${b.title || typeName}</strong>
                                            <small style="font-size:0.75rem; color:var(--sb-muted);">${typeName}</small>
                                        </div>
                                    </div>
                                    <div class="sb-accordion-actions" onclick="event.stopPropagation();">
                                        <button class="sb-icon-tool" onclick="window.StudioUI.moveSectionBlock(${idx}, -1)" title="تحريك لأعلى" ${idx === 0 ? 'disabled' : ''}>
                                            <i class="fas fa-arrow-up"></i>
                                        </button>
                                        <button class="sb-icon-tool" onclick="window.StudioUI.moveSectionBlock(${idx}, 1)" title="تحريك لأسفل" ${idx === blocks.length - 1 ? 'disabled' : ''}>
                                            <i class="fas fa-arrow-down"></i>
                                        </button>
                                        <button class="sb-icon-tool" onclick="window.StudioUI.toggleSectionVisibility(${idx})" title="${isVisible ? 'إخفاء القسم' : 'إظهار القسم'}">
                                            <i class="fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}" style="${!isVisible ? 'color:#EF4444' : ''}"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="sb-accordion-body">
                                    <div class="sb-field-card">
                                        <label class="sb-field-label">عنوان القسم</label>
                                        <input type="text" class="sb-input" value="${b.title || ''}" 
                                               oninput="window.StudioUI.handleBlockFieldChange(${idx}, 'title', this.value)" />
                                    </div>

                                    <div class="sb-field-card">
                                        <label class="sb-field-label">العنوان الفرعي / الوصف</label>
                                        <input type="text" class="sb-input" value="${b.subtitle || ''}" 
                                               oninput="window.StudioUI.handleBlockFieldChange(${idx}, 'subtitle', this.value)" />
                                    </div>

                                    ${b.type === 'hero' ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">نص زر الدعوة للشراء (CTA Button)</label>
                                            <input type="text" class="sb-input" value="${s.cta_text || 'تسوق الآن'}" 
                                                   oninput="window.StudioUI.handleBlockSettingChange(${idx}, 'cta_text', this.value)" />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>📱 ارتفاع كرت الهيرو بالجوال:</span>
                                                <strong id="val-hero-mob-${idx}">${(s.hero_mobile_height || 0) === 0 ? 'تلقائي' : (s.hero_mobile_height || 0) + 'px'}</strong>
                                            </div>
                                            <input type="range" min="0" max="450" step="10" class="sb-range-slider"
                                                   value="${s.hero_mobile_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-hero-mob-${idx}').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'hero_mobile_height', v);
                                                   " />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>💻 ارتفاع كرت الهيرو بالكمبيوتر:</span>
                                                <strong id="val-hero-desk-${idx}">${(s.hero_desktop_height || 0) === 0 ? 'تلقائي' : (s.hero_desktop_height || 0) + 'px'}</strong>
                                            </div>
                                            <input type="range" min="0" max="600" step="10" class="sb-range-slider"
                                                   value="${s.hero_desktop_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-hero-desk-${idx}').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'hero_desktop_height', v);
                                                   " />
                                        </div>
                                    ` : ''}

                                    ${b.type === 'categories' ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">طريقة عرض التصنيفات</label>
                                            <div class="sb-segmented-control">
                                                <button class="sb-seg-btn ${(s.categories_style || 'chips_slider') === 'chips_slider' ? 'active' : ''}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'categories_style', 'chips_slider'); window.StudioUI.handleBlockSettingChange(${idx}, 'style', 'slider');">
                                                    ↔️ شريط سلايدر
                                                </button>
                                                <button class="sb-seg-btn ${s.categories_style === 'grid_matrix' ? 'active' : ''}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'categories_style', 'grid_matrix'); window.StudioUI.handleBlockSettingChange(${idx}, 'style', 'grid');">
                                                    📦 شبكة أعمدة
                                                </button>
                                            </div>
                                        </div>

                                        <div class="sb-field-card">
                                            <label class="sb-field-label">عدد الأعمدة (في وضع الشبكة)</label>
                                            <div class="sb-segmented-control">
                                                ${[2, 3, 4, 5, 6].map(num => `
                                                    <button class="sb-seg-btn ${Number(s.grid_columns || 4) === num ? 'active' : ''}"
                                                            onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'grid_columns', ${num})">
                                                        ${num}
                                                    </button>
                                                `).join('')}
                                            </div>
                                        </div>

                                        <div class="sb-field-card">
                                            <label class="sb-field-label">حجم أيقونات الفئات</label>
                                            <div class="sb-segmented-control">
                                                <button class="sb-seg-btn ${s.icon_size === 'small' ? 'active' : ''}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'small')">صغير</button>
                                                <button class="sb-seg-btn ${(s.icon_size === 'medium' || !s.icon_size) ? 'active' : ''}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'medium')">متوسط ⭐</button>
                                                <button class="sb-seg-btn ${s.icon_size === 'large' ? 'active' : ''}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'large')">كبير</button>
                                            </div>
                                        </div>
                                    ` : ''}

                                    ${b.type === 'banner' ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">نص الزر الترويجي</label>
                                            <input type="text" class="sb-input" value="${s.cta_text || 'اكتشف المزيد'}" 
                                                   oninput="window.StudioUI.handleBlockSettingChange(${idx}, 'cta_text', this.value)" />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>↕️ ارتفاع البانر الإعلاني:</span>
                                                <strong id="val-banner-${idx}">${(s.banner_height || 0) === 0 ? 'تلقائي' : (s.banner_height || 0) + 'px'}</strong>
                                            </div>
                                            <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                                   value="${s.banner_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-banner-${idx}').textContent = v === 0 ? 'تلقائي' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'banner_height', v);
                                                   " />
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    }
}

