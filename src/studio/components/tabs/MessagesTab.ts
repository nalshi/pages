/**
 * ========================================================
 * 💬 MessagesTab Component
 * ========================================================
 */

import { studioState } from '../../state';

export class MessagesTab {
    public static render(): string {
        const sm = studioState.config.messages || studioState.config.store_messages || {};
        const assistant = sm.ai_assistant || {};
        const quickActionsText = Array.isArray(assistant.quick_actions) && assistant.quick_actions.length
            ? assistant.quick_actions.join(', ')
            : 'أريد أفضل العروض المتاحة, كيف أقوم بالطلب والتوصيل؟, تتبع طلبي';
        const iconOptions = [
            'fa-robot', 'fa-headset', 'fa-user-tie', 'fa-message', 'fa-comments', 'fa-store',
            'fa-cart-shopping', 'fa-box', 'fa-bolt', 'fa-sparkles', 'fa-circle-question', 'fa-shield-alt'
        ];
        const selectedIcon = assistant.avatar_icon || 'fa-robot';

        return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card ${assistant.enabled !== false ? 'accent' : ''}">
                    <span class="label">المساعد</span>
                    <strong>${assistant.enabled !== false ? 'مفعّل' : 'متوقف'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">الشخصية</span>
                    <strong>${assistant.persona || 'classic'}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">الاقتراحات</span>
                    <strong>${assistant.smart_contextual_actions !== false ? 'ذكية' : 'بسيطة'}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-shopping-cart" style="color:var(--sb-primary);"></i>
                    <h3>رسائل وتنبيهات السلة والشراء</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">رسالة نجاح الإضافة للسلة</label>
                        <input type="text" class="sb-input" value="${sm.add_to_cart_success || 'تمت إضافة المنتج إلى سلتك بنجاح'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('add_to_cart_success', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">تنبيه نفاد الكمية / غير متوفر</label>
                        <input type="text" class="sb-input" value="${sm.out_of_stock_msg || 'عذراً، هذا المنتج غير متوفر حالياً'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('out_of_stock_msg', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">رسالة السلة الفارغة</label>
                        <input type="text" class="sb-input" value="${sm.empty_cart_title || sm.cart_empty_msg || 'سلة مشترياتك فارغة حالياً'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('empty_cart_title', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">نص زر إتمام الطلب والدفع</label>
                        <input type="text" class="sb-input" value="${sm.checkout_btn_label || 'إتمام الطلب والدفع'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('checkout_btn_label', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-robot" style="color:var(--sb-primary);"></i>
                    <h3>تخصيص المساعد الذكي</h3>
                </div>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">اسم المساعد</label>
                        <input type="text" class="sb-input" value="${assistant.name || 'مساعد نالش'}" oninput="window.StudioUI.handleAssistantConfigChange('name', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">أيقونات المساعد</label>
                        <div class="sb-icon-select-grid">
                            ${iconOptions.map((icon) => `
                                <button type="button"
                                    class="sb-icon-choice ${selectedIcon === icon ? 'active' : ''}"
                                    title="${icon}"
                                    onclick="window.StudioUI.handleAssistantConfigChange('avatar_icon', '${icon}')">
                                    <i class="fas ${icon}"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">تفعيل المساعد</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.enabled !== false ? 'checked' : ''} onchange="window.StudioUI.handleAssistantConfigChange('enabled', this.checked)" />
                            <span>متاح للزوار</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">اقتراحات ذكية حسب الصفحة</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.smart_contextual_actions !== false ? 'checked' : ''} onchange="window.StudioUI.handleAssistantConfigChange('smart_contextual_actions', this.checked)" />
                            <span>تغيير المقترحات بناءً على السلة والصفحات</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">ردود ذكية حسب السياق</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.smart_contextual_replies !== false ? 'checked' : ''} onchange="window.StudioUI.handleAssistantConfigChange('smart_contextual_replies', this.checked)" />
                            <span>تخصيص الرسائل حسب صفحة المنتج أو السلة</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">لون تمييز المساعد</label>
                        <input type="color" class="sb-color-input" value="${assistant.accent_color || '#4F46E5'}" onchange="window.StudioUI.handleAssistantConfigChange('accent_color', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">أسلوب المساعد</label>
                        <div class="sb-segmented-control" style="grid-template-columns: repeat(4, minmax(0,1fr)); display:grid; gap:6px;">
                            <button class="sb-seg-btn ${assistant.persona === 'classic' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('classic')">كلاسيكي</button>
                            <button class="sb-seg-btn ${assistant.persona === 'premium' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('premium')">مميز</button>
                            <button class="sb-seg-btn ${assistant.persona === 'futuristic' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('futuristic')">مستقبلي</button>
                            <button class="sb-seg-btn ${assistant.persona === 'luxury' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('luxury')">فاخر</button>
                            <button class="sb-seg-btn ${assistant.persona === 'fashion' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('fashion')">موضة</button>
                            <button class="sb-seg-btn ${assistant.persona === 'tech' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('tech')">تقنية</button>
                            <button class="sb-seg-btn ${assistant.persona === 'wellness' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('wellness')">صحة</button>
                            <button class="sb-seg-btn ${assistant.persona === 'beauty' ? 'active' : ''}" onclick="window.StudioUI.applyAssistantPreset('beauty')">جمال</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">أسلوب الرد</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.response_style === 'friendly' || !assistant.response_style ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'friendly')">ودود</button>
                            <button class="sb-seg-btn ${assistant.response_style === 'sales' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'sales')">مبيعات</button>
                            <button class="sb-seg-btn ${assistant.response_style === 'luxury' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'luxury')">فاخر</button>
                            <button class="sb-seg-btn ${assistant.response_style === 'professional' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'professional')">مهني</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">سلوك المساعد</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.behavior_mode === 'support' || !assistant.behavior_mode ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'support')">دعم</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === 'sales' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'sales')">مبيعات</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === 'advisor' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'advisor')">مستشار</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === 'concierge' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'concierge')">مرافق</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">طول الرسائل</label>
                        <div class="sb-segmented-control grid-3">
                            <button class="sb-seg-btn ${assistant.conversation_style === 'short' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'short')">قصير</button>
                            <button class="sb-seg-btn ${assistant.conversation_style === 'balanced' || !assistant.conversation_style ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'balanced')">متوازن</button>
                            <button class="sb-seg-btn ${assistant.conversation_style === 'detailed' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'detailed')">تفصيلي</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">شكل الزر العائم</label>
                        <div class="sb-segmented-control grid-3">
                            <button class="sb-seg-btn ${assistant.button_style === 'pill' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'pill')">Pill</button>
                            <button class="sb-seg-btn ${assistant.button_style === 'bubble' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'bubble')">Bubble</button>
                            <button class="sb-seg-btn ${assistant.button_style === 'minimal' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'minimal')">Minimal</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">شكل الروبوت</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.avatar_style === 'pulse' || !assistant.avatar_style ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'pulse')">نبض</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === 'orb' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'orb')">كرية</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === 'halo' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'halo')">هالة</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === 'hover' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'hover')">تحريك</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">مكان الزر</label>
                        <div class="sb-segmented-control grid-2">
                            <button class="sb-seg-btn ${assistant.position !== 'bottom-left' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('position', 'bottom-right')">يمين</button>
                            <button class="sb-seg-btn ${assistant.position === 'bottom-left' ? 'active' : ''}" onclick="window.StudioUI.handleAssistantConfigChange('position', 'bottom-left')">يسار</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">وضع المساعد (الحالة)</label>
                        <input type="text" class="sb-input" value="${assistant.status_text || 'متصل للرد الفوري'}" oninput="window.StudioUI.handleAssistantConfigChange('status_text', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">الوظائف الذكية السريعة</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleAssistantQuickActionsChange(this.value)">${quickActionsText}</textarea>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">رسالة ترحيب المساعد الذكي</label>
                        <input type="text" class="sb-input" value="${sm.chatbot_greeting || 'أهلاً بك! كيف يمكنني مساعدتك اليوم؟ 🤖'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('chatbot_greeting', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-search" style="color:#06B6D4;"></i>
                    <h3>نصوص البحث والتواصل</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">تلميح حقل البحث (Placeholder)</label>
                        <input type="text" class="sb-input" value="${sm.search_placeholder || 'ابحث عن منتج، فئة، أو ماركة...'}" 
                               oninput="window.StudioUI.handleStoreMessageChange('search_placeholder', this.value)" />
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">رسالة نجاح استلام الطلب</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleStoreMessageChange('order_success_msg', this.value)">${sm.order_success_msg || 'شكراً لثقتك بنا. سيتم تجهيز وتوصيل طلبك في أقرب وقت.'}</textarea>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
