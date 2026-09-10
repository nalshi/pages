/**
 * ========================================================
 * 🏪 IdentityTab Component
 * ========================================================
 */

import { studioState } from '../../state';

export class IdentityTab {
    public static render(): string {
        const id = studioState.config.store_identity || ({} as any);
        const ann = id.announcement_bar || ({} as any);
        const defaultMode = studioState.config.default_theme_mode || 'light';

        return `
        <div class="sb-tab-pane">
            <div class="sb-quick-actions">
                <button class="sb-quick-action active" onclick="window.StudioUI.setActiveTab('ai_palette')">
                    <i class="fas fa-palette"></i>
                    <span>اختيار ثيم جاهز</span>
                </button>
                <button class="sb-quick-action" onclick="window.StudioUI.setActiveTab('light_colors')">
                    <i class="fas fa-sun"></i>
                    <span>ألوان المتجر</span>
                </button>
                <button class="sb-quick-action" onclick="window.StudioUI.setActiveTab('navigation')">
                    <i class="fas fa-bars"></i>
                    <span>تنقل المتجر</span>
                </button>
            </div>

            <div class="sb-identity-banner">
                <div class="sb-identity-banner-head">
                    <span class="sb-badge-pill active">جاهز للعرض</span>
                    <span class="sb-badge-pill">متجر حديث</span>
                </div>
                <h3>ابدأ بتخصيص متجر احترافي في 3 خطوات</h3>
                <div class="sb-stat-row">
                    <div class="sb-stat-item">
                        <strong>1</strong>
                        <span>اختر الثيم</span>
                    </div>
                    <div class="sb-stat-item">
                        <strong>2</strong>
                        <span>عدل الألوان</span>
                    </div>
                    <div class="sb-stat-item">
                        <strong>3</strong>
                        <span>انشر المعاينة</span>
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-store" style="color:var(--sb-primary);"></i>
                    <h3>هوية وبيانات المتجر الأساسية</h3>
                </div>
                
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">اسم المتجر (Store Name)</label>
                        <input type="text" class="sb-input" value="${id.store_name || ''}" 
                               placeholder="مثال: متجر الأناقة الفاخرة"
                               oninput="window.StudioUI.handleIdentityChange('store_name', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">الشعار التسويقي (Slogan)</label>
                        <input type="text" class="sb-input" value="${id.slogan || ''}" 
                               placeholder="مثال: وجهتك الأولى لأرقى الأزياء والعطور"
                               oninput="window.StudioUI.handleIdentityChange('slogan', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">رسالة الترحيب أعلى المتجر</label>
                        <textarea class="sb-textarea" placeholder="أهلاً بكم في متجرنا!"
                                  oninput="window.StudioUI.handleIdentityChange('welcome_message', this.value)">${id.welcome_message || ''}</textarea>
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">رمز العملة المعروضة</label>
                        <select class="sb-select" onchange="window.StudioUI.handleIdentityChange('currency_symbol', this.value)">
                            <option value="YER" ${id.currency_symbol === 'YER' ? 'selected' : ''}>ريال يمني (YER)</option>
                            <option value="SAR" ${id.currency_symbol === 'SAR' ? 'selected' : ''}>ريال سعودي (SAR)</option>
                            <option value="USD" ${id.currency_symbol === 'USD' ? 'selected' : ''}>دولار أمريكي (USD)</option>
                        </select>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">
                            <span>الوضع الافتراضي عند أول زيارة للمتسوق (Default Theme)</span>
                            <span class="sb-badge-info">أول فتح للمتجر</span>
                        </label>
                        <div class="sb-segmented-control">
                            <button class="sb-seg-btn ${defaultMode === 'light' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('light')">
                                ☀️ وضع فاتح (Light)
                            </button>
                            <button class="sb-seg-btn ${defaultMode === 'dark' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('dark')">
                                🌙 وضع داكن (Dark)
                            </button>
                            <button class="sb-seg-btn ${defaultMode === 'auto' ? 'active' : ''}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('auto')">
                                🖥️ حسب جهاز العميل
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- شريط الإعلانات الترويجي -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-bullhorn" style="color:#EC4899;"></i>
                    <h3>شريط الإعلانات الترويجي (Announcement Bar)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">تفعيل شريط الإعلانات أعلى الهيدر</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${ann.enabled ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleAnnouncementChange('enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>
                        
                        <input type="text" class="sb-input" value="${ann.text || ''}" 
                               placeholder="نص الإعلان الترويجي، مثال: 🎉 عروض حصرية وتوصيل مجاني!"
                               oninput="window.StudioUI.handleAnnouncementChange('text', this.value)" />

                        <div style="display:flex; gap:12px; margin-top:10px;">
                            <div class="sb-color-inline" style="flex:1;">
                                <span>خلفية الشريط:</span>
                                <input type="color" class="sb-color-input" value="${ann.bg_color || '#4F46E5'}" 
                                       oninput="window.StudioUI.handleAnnouncementChange('bg_color', this.value)" />
                            </div>
                            <div class="sb-color-inline" style="flex:1;">
                                <span>لون النص:</span>
                                <input type="color" class="sb-color-input" value="${ann.text_color || '#FFFFFF'}" 
                                       oninput="window.StudioUI.handleAnnouncementChange('text_color', this.value)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
