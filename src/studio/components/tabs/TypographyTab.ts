/**
 * ========================================================
 * 🔤 TypographyTab Component
 * ========================================================
 */

import { studioState } from '../../state';
import { ALLOWED_FONTS } from '../../../config/storefrontConfigSchema';

export class TypographyTab {
    public static render(): string {
        const typo = studioState.config.typography || {};
        const currentFont = typo.font_family || 'Tajawal';

        // حجم الخط الأساسي — استخراج القيمة العددية للـ slider
        const mobileBasePx = parseInt(typo.base_size_mobile || '15') || 15;
        const desktopBasePx = parseInt(typo.base_size_desktop || '17') || 17;
        // حجم خط الأسعار
        const mobilePricePx = parseFloat(typo.price_size_mobile || '1.1') || 1.1;
        const desktopPricePx = parseFloat(typo.price_size_desktop || '1.25') || 1.25;
        // حجم خط العناوين
        const mobileHeadPx = parseFloat(typo.heading_size_mobile || '1.15') || 1.15;
        const desktopHeadPx = parseFloat(typo.heading_size_desktop || '1.45') || 1.45;

        return `
        <div class="sb-tab-pane">
            <div class="sb-typography-summary">
                <div class="sb-typography-summary-card">
                    <span>الخط</span>
                    <strong>${currentFont}</strong>
                </div>
                <div class="sb-typography-summary-card accent">
                    <span>الوزن</span>
                    <strong>${typo.heading_weight || '700'}</strong>
                </div>
                <div class="sb-typography-summary-card">
                    <span>الحجم</span>
                    <strong>${desktopBasePx}px</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-font" style="color:var(--sb-accent);"></i>
                    <h3>نوع الخط العربي الرسمي للمتجر</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">اختر الخط الأساسي للواجهة</label>
                        <select class="sb-select" onchange="window.StudioUI.handleTypographyChange('font_family', this.value, true)">
                            ${ALLOWED_FONTS.map((font: string) => `
                                <option value="${font}" ${currentFont === font ? 'selected' : ''}>${font} - الخط العربي</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">سماكة ووزن عناوين المنتجات والأقسام</label>
                        <div class="sb-segmented-control">
                            <button class="sb-seg-btn ${(typo.heading_weight || '700') === '600' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '600')">
                                متوسط (600)
                            </button>
                            <button class="sb-seg-btn ${(typo.heading_weight || '700') === '700' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '700')">
                                عريض (700) ⭐
                            </button>
                            <button class="sb-seg-btn ${typo.heading_weight === '800' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '800')">
                                بارز جداً (800)
                            </button>
                            <button class="sb-seg-btn ${typo.heading_weight === '900' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '900')">
                                بلاك (900)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- أحجام النصوص المتجاوبة بخط تمرير -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-text-height" style="color:#FBBF24;"></i>
                    <h3>🎚️ حجم خط النص الأساسي</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>📱 حجم الخط بالجوال:</span>
                            <strong id="val-font-mobile">${mobileBasePx}px</strong>
                        </div>
                        <input type="range" min="12" max="20" step="1" class="sb-range-slider"
                               value="${mobileBasePx}"
                               oninput="
                                   document.getElementById('val-font-mobile').textContent = this.value + 'px';
                                   window.StudioUI.handleTypographyChange('base_size_mobile', this.value + 'px', false);
                               " />
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--sb-muted); margin-top:4px;">
                            <span>12px</span><span>صغير 14</span><span>⭐15</span><span>16</span><span>20px</span>
                        </div>
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>💻 حجم الخط بالكمبيوتر:</span>
                            <strong id="val-font-desktop">${desktopBasePx}px</strong>
                        </div>
                        <input type="range" min="13" max="22" step="1" class="sb-range-slider"
                               value="${desktopBasePx}"
                               oninput="
                                   document.getElementById('val-font-desktop').textContent = this.value + 'px';
                                   window.StudioUI.handleTypographyChange('base_size_desktop', this.value + 'px', false);
                               " />
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--sb-muted); margin-top:4px;">
                            <span>13px</span><span>15</span><span>⭐17</span><span>19</span><span>22px</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- حجم خط العناوين -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-heading" style="color:#A78BFA;"></i>
                    <h3>🎚️ حجم خط عناوين الأقسام والمنتجات</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>📱 حجم العنوان بالجوال:</span>
                            <strong id="val-head-mobile">${(mobileHeadPx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="90" max="160" step="5" class="sb-range-slider"
                               value="${Math.round(mobileHeadPx * 100)}"
                               oninput="
                                   document.getElementById('val-head-mobile').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('heading_size_mobile', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>💻 حجم العنوان بالكمبيوتر:</span>
                            <strong id="val-head-desktop">${(desktopHeadPx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="100" max="200" step="5" class="sb-range-slider"
                               value="${Math.round(desktopHeadPx * 100)}"
                               oninput="
                                   document.getElementById('val-head-desktop').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('heading_size_desktop', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>
                </div>
            </div>

            <!-- حجم خط الأسعار -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-tag" style="color:#10B981;"></i>
                    <h3>🎚️ حجم خط الأسعار على الكروت</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>📱 حجم السعر بالجوال:</span>
                            <strong id="val-price-mobile">${(mobilePricePx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="80" max="160" step="5" class="sb-range-slider"
                               value="${Math.round(mobilePricePx * 100)}"
                               oninput="
                                   document.getElementById('val-price-mobile').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('price_size_mobile', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>💻 حجم السعر بالكمبيوتر:</span>
                            <strong id="val-price-desktop">${(desktopPricePx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="90" max="180" step="5" class="sb-range-slider"
                               value="${Math.round(desktopPricePx * 100)}"
                               oninput="
                                   document.getElementById('val-price-desktop').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('price_size_desktop', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
