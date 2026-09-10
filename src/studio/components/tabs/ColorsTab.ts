/**
 * ========================================================
 * 🎨 ColorsTab Component (Light & Dark Mode) v4.0
 * يدعم التوليد الذكي متعدد المدخلات والتخصيص المستقل والتفصيلي
 * ========================================================
 */

import { studioState } from '../../state';

const COLOR_FIELDS = [
    { key: 'primary', label: 'اللون الأساسي (Primary)', desc: 'الأزرار، الروابط، والعناصر النشطة' },
    { key: 'primary_hover', label: 'لون التمرير (Primary Hover)', desc: 'لون الأزرار عند التحويم واللمس' },
    { key: 'accent', label: 'اللون التكميلي (Accent)', desc: 'التدرجات وشارات التميز والعروض' },
    { key: 'bg_body', label: 'خلفية المتجر (Body BG)', desc: 'الخلفية العامة لكافة صفحات المتجر' },
    { key: 'bg_card', label: 'خلفية الكروت (Card BG)', desc: 'كروت المنتجات والأقسام والقوائم' },
    { key: 'bg_surface', label: 'خلفية السطوح والشرائح (Surface)', desc: 'خلفيات البحث وشرائح التصنيفات' },
    { key: 'text_main', label: 'النص الأساسي (Text Main)', desc: 'العناوين والنصوص البارزة' },
    { key: 'text_muted', label: 'النص الثانوي (Text Muted)', desc: 'الوصف والأسعار القديمة والتفاصيل' },
    { key: 'border', label: 'لون الحدود (Border)', desc: 'إطارات الكروت والفواصل والتحديد' },
    { key: 'navbar_bg', label: 'خلفية الشريط العلوي (Navbar)', desc: 'شريط التنقل العلوي للمتجر' },
    { key: 'bottom_bar_bg', label: 'خلفية الشريط السفلي (Bottom Bar)', desc: 'شريط التنقل في الموبايل' },
    { key: 'price_color', label: 'لون سعر المنتج (Price)', desc: 'السعر الحالي المباشر للمنتج' },
    { key: 'badge_bg', label: 'بادج الخصومات والعروض', desc: 'خلفية شارة التخفيض ونفاد المخزون' },
    { key: 'btn_primary_bg', label: 'خلفية الأزرار الرئيسية', desc: 'أزرار إضافة للسلة والشراء الفوري' },
    { key: 'chatbot_btn_bg', label: 'زر المساعد الذكي / الشات', desc: 'الزر العائم للمحادثة الفورية' }
];

export class ColorsTab {
    public static render(targetMode: 'light' | 'dark'): string {
        const isLightTab = targetMode === 'light';
        const modeKey = isLightTab ? 'light_theme' : 'dark_theme';
        const colors = studioState.config[modeKey]?.colors || {};

        const currentPrimary = colors.primary || (isLightTab ? '#4F46E5' : '#6366F1');
        const currentBg = colors.bg_body || (isLightTab ? '#F8FAFC' : '#0B1120');
        const currentText = colors.text_main || (isLightTab ? '#0F172A' : '#F8FAFC');
        const currentAccent = colors.accent || (isLightTab ? '#14B8A6' : '#2DD4BF');

        return `
        <div class="sb-tab-pane">
            <div class="sb-color-topbar">
                <button class="sb-seg-btn ${isLightTab ? 'active' : ''}" 
                        onclick="window.StudioUI.setActiveTab('light_colors')">
                    ☀️ فاتح
                </button>
                <button class="sb-seg-btn ${!isLightTab ? 'active' : ''}" 
                        onclick="window.StudioUI.setActiveTab('dark_colors')">
                    🌙 داكن
                </button>
            </div>

            <div class="sb-color-banner">
                <div>
                    <strong>💡 ثيمات جاهزة</strong>
                    <span>اختَر نمطًا متناسقًا لديك في ثوانٍ، أو عدّل الألوان يدويًا.</span>
                </div>
                <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:6px 10px; font-weight:700; white-space:nowrap;"
                        onclick="window.StudioUI.setActiveTab('ai_palette')">
                    <i class="fas fa-palette" style="color:#A78BFA;"></i>
                    <span>تصفح 20 ثيم</span>
                </button>
            </div>

            <!-- صندوق التوليد الذكي متعدد الألوان للوضع الحالي -->
            <div class="sb-card-group highlight" style="background: ${isLightTab ? 'rgba(245, 158, 11, 0.06)' : 'rgba(99, 102, 241, 0.08)'}; border-color: ${isLightTab ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)'};">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:${isLightTab ? '#F59E0B' : '#818CF8'};"></i>
                    <h3>${isLightTab ? 'المولد الذكي لألوان الوضع الفاتح ☀️' : 'المولد الذكي لألوان الوضع الداكن 🌙'}</h3>
                </div>

                <p style="font-size:0.82rem; color:var(--sb-muted); line-height:1.45; margin-bottom:12px;">
                    اختر الألوان التي تريدها (الأساسي، الخلفية، الخط، التمييز) وسيقوم المولد بتنسيق واشتقاق باقي عناصر ومكونات المتجر بانسجام تام:
                </p>

                <!-- شبكة اختيار الألوان الأساسية للمولد -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:14px;">
                    <!-- اللون الأساسي -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">🎨 الأساسي (Primary)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-primary-${modeKey}" value="${currentPrimary}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentPrimary}</span>
                        </div>
                    </div>

                    <!-- لون الخلفية -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">🖼️ الخلفية (Background)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-bg-${modeKey}" value="${currentBg}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentBg}</span>
                        </div>
                    </div>

                    <!-- لون الخط -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">✍️ لون النص (Text)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-text-${modeKey}" value="${currentText}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentText}</span>
                        </div>
                    </div>

                    <!-- لون التمييز -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">⚡ التمييز (Accent)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-accent-${modeKey}" value="${currentAccent}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentAccent}</span>
                        </div>
                    </div>
                </div>

                <!-- أزرار التوليد والتخصيص المخصص -->
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <!-- زر التوليد الشامل للوضع -->
                    <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:11px; font-weight:800;"
                            onclick="window.StudioUI.generateSmartForMode('${isLightTab ? 'light' : 'dark'}')">
                        <i class="fas fa-magic"></i>
                        <span>توليد وتنسيق ذكي لكافة ألوان ${isLightTab ? 'الوضع الفاتح ☀️' : 'الوضع الداكن 🌙'}</span>
                    </button>

                    <!-- أزرار التخصيص المنفصل لكل جزء -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:6px;">
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? 'light' : 'dark'}', 'bg')">
                            <i class="fas fa-layer-group"></i>
                            <span>الخلفيات والكروت</span>
                        </button>
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? 'light' : 'dark'}', 'buttons')">
                            <i class="fas fa-hand-pointer"></i>
                            <span>الأزرار والأسعار</span>
                        </button>
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? 'light' : 'dark'}', 'text')">
                            <i class="fas fa-font"></i>
                            <span>النصوص والعناوين</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- قائمة الحقول اللونية التفصيلية للتخصيص اليدوي الدقيق -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas ${isLightTab ? 'fa-sliders-h' : 'fa-sliders-h'}" style="color:${isLightTab ? '#F59E0B' : '#818CF8'};"></i>
                    <h3>${isLightTab ? 'تخصيص كل لون في الوضع الفاتح بالتفصيل' : 'تخصيص كل لون في الوضع الداكن بالتفصيل'}</h3>
                </div>

                <div class="sb-color-cards-list">
                    ${COLOR_FIELDS.map(f => {
                        const val = colors[f.key] || (isLightTab ? '#4F46E5' : '#6366F1');
                        const safeHex = val.startsWith('#') && (val.length === 7 || val.length === 4 || val.length === 9) ? val : (isLightTab ? '#4F46E5' : '#6366F1');
                        return `
                            <div class="sb-color-card">
                                <div class="sb-color-info">
                                    <span class="sb-color-title">${f.label}</span>
                                    <span class="sb-color-desc">${f.desc}</span>
                                </div>
                                <div class="sb-color-controls">
                                    <input type="color" class="sb-color-input" value="${safeHex}"
                                           oninput="window.StudioUI.handleColorChange('${modeKey}', '${f.key}', this.value, this)" />
                                    <input type="text" class="sb-hex-input" value="${val}" maxlength="9"
                                           oninput="window.StudioUI.handleColorChange('${modeKey}', '${f.key}', this.value, this)"
                                           onchange="window.StudioUI.handleColorChange('${modeKey}', '${f.key}', this.value, this)" />
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
