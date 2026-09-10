/**
 * ========================================================
 * 🪟 ModalsTab Component
 * ========================================================
 */

import { studioState } from '../../state';

export class ModalsTab {
    public static render(): string {
        const mc = studioState.config.modals_customization || {};
        const pd = mc.product_details || {};
        const cd = mc.cart_drawer || {};
        const si = mc.store_info || {};

        return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card">
                    <span class="label">تفاصيل المنتج</span>
                    <strong>${pd.cta_button_text ? 'مهيأة' : 'افتراضية'}</strong>
                </div>
                <div class="sb-product-summary-card accent">
                    <span class="label">سلة المشتريات</span>
                    <strong>${cd.header_title ? 'مخصصة' : 'أساسية'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">سياسات المتجر</span>
                    <strong>${si.delivery_policy ? 'مكتوبة' : 'غير مفعلة'}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-box-open" style="color:var(--sb-primary);"></i>
                    <h3>شيت تفاصيل المنتج (Product Details Sheet)</h3>
                </div>

                <div class="sb-product-mini-actions">
                    <button type="button" class="sb-product-mini-btn active" onclick="window.StudioUI.handleModalFieldChange('product_details', 'cta_button_text', 'إضافة إلى السلة 🛍️')">
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                    <button type="button" class="sb-product-mini-btn" onclick="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', '20px')">
                        <i class="fas fa-crop-simple"></i> زاوية 20
                    </button>
                    <button type="button" class="sb-product-mini-btn" onclick="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', '32px')">
                        <i class="fas fa-crop"></i> زاوية 32
                    </button>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">نص زر إضافة للسلة</label>
                        <input type="text" class="sb-input" value="${pd.cta_button_text || 'إضافة إلى السلة 🛍️'}" 
                               oninput="window.StudioUI.handleModalFieldChange('product_details', 'cta_button_text', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">استدارة حواف الشيت العلوي</label>
                        <input type="text" class="sb-input" value="${pd.border_radius || '24px'}" 
                               onchange="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-shopping-bag" style="color:#EC4899;"></i>
                    <h3>نافذة وشيت سلة المشتريات (Cart Drawer)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">عنوان نافذة السلة</label>
                        <input type="text" class="sb-input" value="${cd.header_title || 'سلة مشترياتي 🛒'}" 
                               oninput="window.StudioUI.handleModalFieldChange('cart_drawer', 'header_title', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">نص زر إتمام الطلب والدفع</label>
                        <input type="text" class="sb-input" value="${cd.checkout_btn_text || 'متابعة الطلب والدفع 🚀'}" 
                               oninput="window.StudioUI.handleModalFieldChange('cart_drawer', 'checkout_btn_text', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-info-circle" style="color:#06B6D4;"></i>
                    <h3>نافذة معلومات وسياسات المتجر (Store Info)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">سياسة التوصيل والضمان</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleModalFieldChange('store_info', 'delivery_policy', this.value)">${si.delivery_policy || 'نوفر التوصيل السريع والدفع عند الاستلام مع ضمان الاسترجاع.'}</textarea>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
