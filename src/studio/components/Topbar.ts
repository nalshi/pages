/**
 * ========================================================
 * 🚀 Studio Topbar Component v4.5
 * شريط علوي متجاوب بالكامل في سطر واحد ثابت مع قائمة للمزيد على الموبايل
 * ========================================================
 */

import { studioState } from '../state';

export class Topbar {
    public static render(): string {
        const { isDarkPreview, merchantUsername, isGuestMode } = studioState;
        const canUndo = studioState.canUndo();
        const canRedo = studioState.canRedo();

        return `
        <header class="sb-topbar" id="sb-app-topbar">
            <!-- الطرف الأيمن: الرجوع والشعار والاسم -->
            <div class="sb-topbar-start">
                <a href="merchant-app.html" class="sb-btn-back" title="العودة إلى لوحة تحكم التاجر">
                    <i class="fas fa-arrow-right"></i>
                    <span>لوحة التاجر</span>
                </a>

                <div class="sb-store-badge">
                    <div class="pulse-indicator" style="${isGuestMode ? 'background:#F59E0B;' : ''}"></div>
                    <i class="fas fa-store" style="color:var(--sb-primary);"></i>
                    <div class="sb-store-meta">
                        <span id="ui-merchant-name">${studioState.merchantStoreName || studioState.merchantUsername}</span>
                        <small>@${studioState.merchantUsername}</small>
                    </div>
                    ${isGuestMode 
                        ? '<span class="sb-beta-tag" style="background:rgba(245,158,11,0.18); color:#F59E0B; border:1px solid rgba(245,158,11,0.3);"><i class="fas fa-eye"></i> وضع تجريبي</span>' 
                        : '<span class="sb-beta-tag"><i class="fas fa-palette"></i> مخصص</span>'}
                </div>

                <a href="index.html?store=${encodeURIComponent(studioState.merchantUsername)}" target="_blank" class="sb-btn sb-btn-ghost hide-mobile" title="فتح واجهة المتجر الحالية في تبويب جديد" style="color:#38BDF8; text-decoration:none; font-size:0.82rem; font-weight:700;">
                    <i class="fas fa-external-link-alt"></i>
                    <span>زيارة المتجر</span>
                </a>
            </div>

            <!-- الوسط: أدوات التراجع للشاشات الكبيرة -->
            <div class="sb-topbar-center">
                <div class="sb-history-group">
                    <button class="sb-icon-tool" data-history-action="undo" onclick="window.StudioUI.undo()" title="تراجع (Ctrl+Z)" ${!canUndo ? 'disabled' : ''}>
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="sb-icon-tool" data-history-action="redo" onclick="window.StudioUI.redo()" title="إعادة (Ctrl+Y)" ${!canRedo ? 'disabled' : ''}>
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>

            <!-- الطرف الأيسر: الإجراءات والنشر وقائمة المزيد -->
            <div class="sb-topbar-end">
                <!-- تبديل الوضع الليلي للمعاينة -->
                <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.toggleDarkMode()" title="تبديل الوضع الليلي/النهاري للمعاينة">
                    <i class="fas ${isDarkPreview ? 'fa-sun' : 'fa-moon'}" id="sb-theme-icon" style="color:${isDarkPreview ? '#FBBF24' : 'inherit'};"></i>
                    <span class="hide-mobile" id="sb-theme-mode-text">${isDarkPreview ? 'فاتح' : 'داكن'}</span>
                </button>

                <!-- أزرار الحاسوب والشاشات الكبيرة -->
                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="window.StudioUI.openHelpModal()" title="دليل تعليمات الاستوديو">
                    <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                    <span>تعليمات</span>
                </button>

                <input type="file" id="json-file-input" style="display:none;" accept=".json,application/json" onchange="window.StudioUI.handleJsonFileUpload(event)" />

                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="document.getElementById('json-file-input').click()" title="استيراد إعدادات أو قالب JSON">
                    <i class="fas fa-upload"></i>
                </button>

                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="window.StudioUI.downloadJson()" title="تصدير وتنزيل ملف JSON">
                    <i class="fas fa-download"></i>
                </button>

                <button class="sb-btn sb-btn-ghost hide-mobile" style="color:#F87171;" onclick="window.StudioUI.resetAllDefaults()" title="استعادة الإعدادات الافتراضية">
                    <i class="fas fa-trash-restore"></i>
                </button>

                <!-- قائمة "المزيد" المنسدلة للهواتف والشاشات الصغيرة -->
                <div class="sb-topbar-more-container">
                    <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.toggleMoreMenu(event)" title="المزيد من الأدوات">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="sb-more-dropdown" id="sb-more-dropdown">
                        <button class="sb-dropdown-item" onclick="window.StudioUI.openHelpModal(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                            <span>دليل التعليمات والمساعدة</span>
                        </button>
                        <button class="sb-dropdown-item" onclick="document.getElementById('json-file-input').click(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-upload" style="color:#38BDF8;"></i>
                            <span>استيراد ملف JSON</span>
                        </button>
                        <button class="sb-dropdown-item" onclick="window.StudioUI.downloadJson(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-download" style="color:#10B981;"></i>
                            <span>تصدير ملف JSON</span>
                        </button>
                        <a href="index.html?store=${encodeURIComponent(studioState.merchantUsername)}" target="_blank" class="sb-dropdown-item" style="text-decoration:none;">
                            <i class="fas fa-external-link-alt" style="color:#6366F1;"></i>
                            <span>زيارة المتجر المباشر</span>
                        </a>
                        <div style="height:1px; background:var(--sb-border); margin:4px 0;"></div>
                        <button class="sb-dropdown-item" style="color:#F87171;" onclick="window.StudioUI.resetAllDefaults(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-trash-restore"></i>
                            <span>استعادة الافتراضيات</span>
                        </button>
                    </div>
                </div>

                <!-- زر النشر الرئيسي -->
                <button id="btn-publish-live" class="sb-btn sb-btn-primary" onclick="window.StudioUI.publishTheme()" title="نشر التعديلات على المتجر مباشرة">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>نشر 🚀</span>
                </button>
            </div>
        </header>
        `;
    }
}
