/**
 * ========================================================
 * 📢 MarketingTab Component
 * ========================================================
 */

import { studioState } from '../../state';

export class MarketingTab {
    public static render(): string {
        const m = studioState.config.marketing || {};
        const wa = m.whatsapp_floating || ({} as any);
        const ship = m.free_shipping_bar || ({} as any);

        return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card ${wa.enabled ? 'accent' : ''}">
                    <span class="label">واتساب</span>
                    <strong>${wa.enabled ? 'مفعّل' : 'متوقف'}</strong>
                </div>
                <div class="sb-product-summary-card ${ship.enabled ? 'accent' : ''}">
                    <span class="label">الشحن المجاني</span>
                    <strong>${ship.enabled ? 'نشط' : 'معطل'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">موقع الزر</span>
                    <strong>${(wa.position || 'left') === 'left' ? 'يسار' : 'يمين'}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fab fa-whatsapp" style="color:#22C55E;"></i>
                    <h3>زر الواتساب العائم للتواصل المباشر</h3>
                </div>

                <div class="sb-product-mini-actions">
                    <button type="button" class="sb-product-mini-btn ${wa.enabled ? 'active' : ''}" onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'enabled', ${wa.enabled ? false : true})">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </button>
                    <button type="button" class="sb-product-mini-btn ${ship.enabled ? 'active' : ''}" onclick="window.StudioUI.handleMarketingChange('free_shipping_bar', 'enabled', ${ship.enabled ? false : true})">
                        <i class="fas fa-truck-fast"></i> شحن مجاني
                    </button>
                    <button type="button" class="sb-product-mini-btn ${(wa.position || 'left') === 'right' ? 'active' : ''}" onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', '${(wa.position || 'left') === 'left' ? 'right' : 'left'}')">
                        <i class="fas fa-location-dot"></i> ${((wa.position || 'left') === 'left') ? 'يمين' : 'يسار'}
                    </button>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">تفعيل زر الواتساب العائم</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${wa.enabled ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleMarketingChange('whatsapp_floating', 'enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>

                        <input type="text" class="sb-input" value="${wa.phone || ''}" 
                               placeholder="رقم الواتساب مع المفتاح الدولي، مثال: 967777000000"
                               oninput="window.StudioUI.handleMarketingChange('whatsapp_floating', 'phone', this.value)" />

                        <div style="margin-top:10px;">
                            <label class="sb-field-label">موقع الزر العائم في الشاشة</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(wa.position || 'left') === 'left' ? 'active' : ''}" 
                                        onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', 'left')">
                                    👈 أسفل اليسار (موصى به)
                                </button>
                                <button class="sb-seg-btn ${wa.position === 'right' ? 'active' : ''}" 
                                        onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', 'right')">
                                    👉 أسفل اليمين
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- شريط الشحن المجاني الترويجي -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-truck-fast" style="color:#06B6D4;"></i>
                    <h3>شريط الشحن المجاني الترويجي</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">تفعيل شريط الشحن المجاني</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${ship.enabled ? 'checked' : ''} 
                                       onchange="window.StudioUI.handleMarketingChange('free_shipping_bar', 'enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>

                        <input type="text" class="sb-input" value="${ship.message || '🚚 شحن مجاني للطلبات فوق 10,000 ريال!'}" 
                               placeholder="نص رسالة الشحن المجاني"
                               oninput="window.StudioUI.handleMarketingChange('free_shipping_bar', 'message', this.value)" />
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
