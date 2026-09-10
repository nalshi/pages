/**
 * NavigationTab Component v1.0
 */

import { studioState } from '../../state';
import { DEFAULT_NAV_ITEMS, DEFAULT_TOP_BAR_SETTINGS, NAVIGATION_PRESETS, getNavigationPresetLabel, normalizeBottomNavItems, normalizeTopBarSettings } from '../../navigationDefaults';

export const DEFAULT_BOTTOM_ITEMS = DEFAULT_NAV_ITEMS;

const ICON_OPTIONS: Record<string, string[]> = {
    home:      ['fa-home', 'fa-house', 'fa-store', 'fa-shop'],
    search:    ['fa-search', 'fa-magnifying-glass', 'fa-binoculars'],
    orders:    ['fa-box-open', 'fa-box', 'fa-clipboard-list', 'fa-receipt', 'fa-truck'],
    favorites: ['fa-heart', 'fa-star', 'fa-bookmark', 'fa-thumbs-up'],
    cart:      ['fa-shopping-cart', 'fa-shopping-bag', 'fa-basket-shopping', 'fa-cart-plus'],
};

export class NavigationTab {
    public static render(): string {
        const cfg = studioState.config;
        const navSettings = (cfg as any).navigation_settings || {};
        const bottomItems = normalizeBottomNavItems(navSettings.bottom_bar?.items || DEFAULT_BOTTOM_ITEMS);
        const topBar = normalizeTopBarSettings(navSettings.top_bar || DEFAULT_TOP_BAR_SETTINGS);
        const topBarStyle = topBar.navbar_style || navSettings.bottom_bar?.style || 'solid';
        const bottomBarStyle = navSettings.bottom_bar?.style || topBarStyle;
        const topBarSize = navSettings.top_bar?.style_settings?.[topBarStyle] || {};
        const bottomBarSize = navSettings.bottom_bar?.style_settings?.[bottomBarStyle] || {};
        const styleOptions = [
            { key: 'solid', label: 'نظيف', icon: 'fa-square' },
            { key: 'glass', label: 'زجاجي', icon: 'fa-layer-group' },
            { key: 'floating', label: 'عائم', icon: 'fa-wand-magic-sparkles' },
            { key: 'neon', label: 'نيون', icon: 'fa-bolt' },
            { key: 'minimal', label: 'خفيف', icon: 'fa-minus' },
            { key: 'island', label: 'جزيرة', icon: 'fa-circle-half-stroke' },
        ];
        const renderStyleOptions = (selected: string, handler: string): string => styleOptions.map(style => `
            <button class="sb-card-style-btn ${selected === style.key ? 'active' : ''}" style="min-height:58px;"
                onclick="window.StudioUI.${handler}('${style.key}')">
                <i class="fas ${style.icon}"></i><span>${style.label}</span>
            </button>`).join('');
        const renderSizeControls = (bar: 'top' | 'bottom', style: string, values: any): string => {
            const defaultHeight = bar === 'top' ? 58 : 64;
            const defaultRadius = style === 'solid' ? 0 : (bar === 'top' ? 18 : 22);
            const height = values.height ?? defaultHeight;
            const radius = values.radius ?? defaultRadius;
            const border = values.border ?? 1;
            const desktopWidth = values.desktop_width ?? 560;
            const desktopBottom = values.desktop_bottom ?? 22;
            const desktopLayout = values.desktop_layout || 'dock';
            const itemRadius = values.item_radius ?? (bar === 'top' ? 12 : 999);
            const iconSize = values.icon_size ?? (bar === 'top' ? 1.1 : 1.2);
            const itemGap = values.item_gap ?? 8;
            const showLabels = values.show_labels !== false;
            const barColor = values.bar_color || '#6366f1';
            const activeColor = values.active_color || '#ffffff';
            const mobileWidth = values.mobile_width ?? 100;
            const mobileBottom = values.mobile_bottom ?? 0;
            const mobileShape = values.mobile_shape || 'classic';
            const mobileShapes = [
                { key: 'classic', label: 'كلاسيكي' },
                { key: 'pill', label: 'كبسولة' },
                { key: 'icons', label: 'أيقونات' },
                { key: 'elevated', label: 'بطاقات' },
                { key: 'center', label: 'مركز بارز' }
            ];
            return `
            <div class="sb-nav-size-controls">
                <div class="sb-nav-size-heading">
                    <strong>حجم نمط ${styleOptions.find(option => option.key === style)?.label || style}</strong>
                    <span>يُحفظ بشكل مستقل لهذا النمط</span>
                </div>
                <div class="sb-nav-mini-preview" data-nav-preview="${bar}-${style}">
                    <div class="sb-nav-mini-preview-label"><i class="fas fa-eye"></i> معاينة سريعة</div>
                    <div class="sb-nav-mini-canvas">
                        <div class="sb-nav-mini-device">
                            <div class="sb-nav-mini-content"></div>
                            <div class="sb-nav-mini-bar ${style}" style="height:${Math.min(bar === 'top' ? height : (values.desktop_height ?? height), 82)}px;border-radius:${Math.min(radius, 32)}px;--preview-bar-color:${barColor};--preview-active-color:${activeColor};">
                                ${[1, 2, 3, 4, 5].map(index => `<span style="width:${Math.max(8, Math.min(24, iconSize * 12))}px;height:${Math.max(8, Math.min(24, iconSize * 12))}px;border-radius:${Math.min(itemRadius, 16)}px;opacity:${index === 3 ? 1 : 0.58};"></span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sb-nav-style-tools">
                    <button type="button" onclick="window.StudioUI.handleNavCopyStyle('${bar}','${style}')">
                        <i class="fas fa-copy"></i> نسخ لكل الأشكال
                    </button>
                    <button type="button" onclick="window.StudioUI.handleNavResetStyle('${bar}','${style}')">
                        <i class="fas fa-rotate-left"></i> إعادة ضبط هذا الشكل
                    </button>
                </div>
                <label class="sb-nav-range">
                    <span>الحجم <b id="nav-${bar}-height-value">${height}px</b></span>
                    <input type="range" min="${bar === 'top' ? 48 : 56}" max="${bar === 'top' ? 88 : 96}" step="1"
                        value="${height}"
                        oninput="document.getElementById('nav-${bar}-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','height',this.value)">
                </label>
                <div class="sb-nav-color-row">
                    <label><span>لون الشريط</span><input type="color" value="${barColor}" onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','bar_color',this.value)"></label>
                    <label><span>لون العنصر النشط</span><input type="color" value="${activeColor}" onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','active_color',this.value)"></label>
                </div>
                <label class="sb-nav-range">
                    <span>استدارة الحواف <b id="nav-${bar}-radius-value">${radius}px</b></span>
                    <input type="range" min="0" max="32" step="1"
                        value="${radius}"
                        oninput="document.getElementById('nav-${bar}-radius-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','radius',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>سمك الحدود <b id="nav-${bar}-border-value">${border}px</b></span>
                    <input type="range" min="0" max="3" step="1"
                        value="${border}"
                        oninput="document.getElementById('nav-${bar}-border-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','border',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>استدارة الأزرار <b id="nav-${bar}-item-radius-value">${itemRadius}px</b></span>
                    <input type="range" min="0" max="999" step="1" value="${itemRadius}"
                        oninput="document.getElementById('nav-${bar}-item-radius-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','item_radius',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>حجم الأيقونات <b id="nav-${bar}-icon-size-value">${iconSize}rem</b></span>
                    <input type="range" min="0.8" max="1.8" step="0.1" value="${iconSize}"
                        oninput="document.getElementById('nav-${bar}-icon-size-value').textContent=this.value+'rem'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','icon_size',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>المسافة بين العناصر <b id="nav-${bar}-item-gap-value">${itemGap}px</b></span>
                    <input type="range" min="0" max="24" step="1" value="${itemGap}"
                        oninput="document.getElementById('nav-${bar}-item-gap-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','item_gap',this.value)">
                </label>
                <label class="sb-nav-check">
                    <input type="checkbox" ${showLabels ? 'checked' : ''} onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','show_labels',this.checked)">
                    <span>إظهار أسماء العناصر</span>
                </label>
                ${bar === 'bottom' ? `
                <div class="sb-nav-desktop-title"><i class="fas fa-mobile-screen-button"></i> إعدادات الهاتف</div>
                <label class="sb-nav-select">
                    <span>الشكل العصري للهاتف</span>
                    <select onchange="window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_shape',this.value)">
                        ${mobileShapes.map(shape => `<option value="${shape.key}" ${mobileShape === shape.key ? 'selected' : ''}>${shape.label}</option>`).join('')}
                    </select>
                </label>
                <div class="sb-nav-presets">
                    <span>قوالب سريعة</span>
                    <div>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','balanced')">متوازن</button>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','minimal')">خفيف</button>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','focus')">تركيز</button>
                    </div>
                </div>
                <label class="sb-nav-range">
                    <span>عرض الشريط <b id="nav-bottom-mobile-width-value">${mobileWidth}%</b></span>
                    <input type="range" min="86" max="100" step="1" value="${mobileWidth}"
                        oninput="document.getElementById('nav-bottom-mobile-width-value').textContent=this.value+'%'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_width',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>الارتفاع <b id="nav-bottom-mobile-height-value">${values.mobile_height ?? height}px</b></span>
                    <input type="range" min="54" max="94" step="1" value="${values.mobile_height ?? height}"
                        oninput="document.getElementById('nav-bottom-mobile-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_height',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>المسافة من الأسفل <b id="nav-bottom-mobile-bottom-value">${mobileBottom}px</b></span>
                    <input type="range" min="0" max="28" step="1" value="${mobileBottom}"
                        oninput="document.getElementById('nav-bottom-mobile-bottom-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_bottom',this.value)">
                </label>
                <div class="sb-nav-desktop-title"><i class="fas fa-desktop"></i> إعدادات الكمبيوتر</div>
                <label class="sb-nav-range">
                    <span>عرض الشريط <b id="nav-bottom-width-value">${desktopWidth}px</b></span>
                    <input type="range" min="320" max="1100" step="10" value="${desktopWidth}"
                        oninput="document.getElementById('nav-bottom-width-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_width',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>الارتفاع في الكمبيوتر <b id="nav-bottom-desktop-height-value">${values.desktop_height ?? height}px</b></span>
                    <input type="range" min="52" max="100" step="1" value="${values.desktop_height ?? height}"
                        oninput="document.getElementById('nav-bottom-desktop-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_height',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>المسافة من الأسفل <b id="nav-bottom-bottom-value">${desktopBottom}px</b></span>
                    <input type="range" min="0" max="80" step="1" value="${desktopBottom}"
                        oninput="document.getElementById('nav-bottom-bottom-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_bottom',this.value)">
                </label>
                <label class="sb-nav-select">
                    <span>تخطيط الكمبيوتر</span>
                    <select onchange="window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_layout',this.value)">
                        <option value="dock" ${desktopLayout === 'dock' ? 'selected' : ''}>Dock وسط الشاشة</option>
                        <option value="wide" ${desktopLayout === 'wide' ? 'selected' : ''}>شريط عريض</option>
                        <option value="compact" ${desktopLayout === 'compact' ? 'selected' : ''}>مضغوط</option>
                    </select>
                </label>` : ''}
                ${bar === 'bottom' ? `
                <div class="sb-nav-presets">
                    <span>قوالب الكمبيوتر</span>
                    <div>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','dock')">Dock أنيق</button>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','wide')">عريض</button>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','compact')">مضغوط</button>
                    </div>
                </div>` : ''}
            </div>`;
        };

        const renderIconSelect = (itemId: string, currentIcon: string): string => {
            const opts = ICON_OPTIONS[itemId] || ['fa-circle'];
            let html = `<select class="sb-select" style="font-size:0.78rem;padding:5px 8px;width:auto;min-width:110px;" onchange="window.StudioUI.handleNavBottomItemChange('${itemId}','icon',this.value)">`;
            for (const ic of opts) {
                html += `<option value="${ic}"${currentIcon === ic ? ' selected' : ''}>${ic.replace('fa-','')}</option>`;
            }
            html += '</select>';
            return html;
        };

        let itemsHtml = '';
        for (let idx = 0; idx < bottomItems.length; idx++) {
            const item = bottomItems[idx];
            const isFirst = idx === 0;
            const isLast = idx === bottomItems.length - 1;
            itemsHtml += `<div draggable="true" ondragstart="window.StudioUI.handleNavBottomItemDragStart('${item.id}')" ondragover="event.preventDefault()" ondrop="window.StudioUI.handleNavBottomItemDrop('${item.id}')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--sb-card);border:1px solid var(--sb-border);border-radius:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);${!item.visible ? 'opacity:0.55;' : ''}">
               <div title="اسحب لإعادة ترتيب العنصر" style="width:38px;height:38px;border-radius:10px;background:var(--sb-primary-gradient);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.95rem;flex-shrink:0;cursor:grab;box-shadow:0 4px 12px var(--sb-primary-glow);"><i class="fas ${item.icon}"></i></div>
                <div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;">
                    <button onclick="window.StudioUI.handleNavBottomItemMove('${item.id}','up')" ${isFirst ? 'disabled' : ''} style="background:var(--sb-surface);color:var(--sb-text);border:1px solid var(--sb-border);border-radius:6px;width:28px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;${isFirst ? 'opacity:0.3;cursor:not-allowed;' : ''}" title="تحريك لأعلى">↑</button>
                    <button onclick="window.StudioUI.handleNavBottomItemMove('${item.id}','down')" ${isLast ? 'disabled' : ''} style="background:var(--sb-surface);color:var(--sb-text);border:1px solid var(--sb-border);border-radius:6px;width:28px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;${isLast ? 'opacity:0.3;cursor:not-allowed;' : ''}" title="تحريك لأسفل">↓</button>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:0.68rem;color:var(--sb-muted);display:inline-flex;align-items:center;gap:4px;letter-spacing:0.02em;">⋮⋮ <span>رتب</span></span>
                        <input type="text" class="sb-input" value="${item.label}" style="font-size:0.82rem;padding:6px 8px;flex:1;min-width:60px;" onchange="window.StudioUI.handleNavBottomItemChange('${item.id}','label',this.value)" placeholder="الاسم">
                        ${renderIconSelect(item.id, item.icon)}
                    </div>
                </div>
                <label class="sb-toggle" style="flex-shrink:0;">
                    <input type="checkbox" ${item.visible ? 'checked' : ''} onchange="window.StudioUI.handleNavBottomItemChange('${item.id}','visible',this.checked)">
                    <span class="sb-toggle-slider"></span>
                </label>
            </div>`;
        }

        const logoIcons = [
            ['fa-store','متجر'],['fa-shopping-bag','حقيبة'],['fa-tag','بطاقة'],['fa-star','نجمة'],
            ['fa-gem','جوهرة'],['fa-fire','نار'],['fa-bolt','برق'],['fa-crown','تاج']
        ];
        let logoIconsHtml = '';
        for (const [ic, lbl] of logoIcons) {
            const isActive = topBar.logo_icon === ic;
            logoIconsHtml += `<button title="${lbl}" onclick="window.StudioUI.handleNavTopBarChange('logo_icon','${ic}')"
                style="width:44px;height:44px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;
                border:2px solid ${isActive ? 'var(--sb-primary)' : 'var(--sb-border)'};
                background:${isActive ? 'rgba(99,102,241,0.18)' : 'var(--sb-surface)'};
                font-size:1.1rem;color:${isActive ? 'var(--sb-primary)' : 'var(--sb-muted)'};"><i class="fas ${ic}"></i></button>`;
        }

        const presetButtons = Object.keys(NAVIGATION_PRESETS).map((key) => `
            <button class="sb-btn-outline" style="font-size:0.75rem;padding:6px 10px;" onclick="window.StudioUI.handleNavPreset('${key}')">
                ${getNavigationPresetLabel(key)}
            </button>`).join('');

        return `<div class="sb-tab-pane">
            <div class="sb-alert-box info">
                <i class="fas fa-bars"></i>
                <div><strong>تحكم كامل بأشرطة التنقل 🧭</strong>
                <span>خصّص الشريط السفلي والعلوي — رتّب وأخفِ وأعِد تسمية كل عنصر وشاهد التغيير فوراً في المعاينة الحية.</span></div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:var(--sb-primary);"></i>
                    <h3>قوالب ذكية</h3>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">${presetButtons}</div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-grip-horizontal" style="color:var(--sb-primary);"></i>
                    <h3>عناصر الشريط السفلي</h3>
                </div>
                <p style="font-size:0.82rem;color:var(--sb-muted,#6b7280);margin:0 0 14px;padding:0 4px;">رتّب العناصر أو غيّر اسمها وأيقونتها وظهورها. سيتم الحفاظ تلقائياً على عنصرين مرئيين على الأقل.</p>
                ${itemsHtml}
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="sb-btn-outline" style="flex:1;min-width:140px;margin-top:10px;font-size:0.82rem;" onclick="window.StudioUI.handleNavResetBottomBar()">
                        <i class="fas fa-undo"></i> إعادة الضبط للافتراضي
                    </button>
                    <button class="sb-btn-primary" style="flex:1;min-width:140px;margin-top:10px;font-size:0.82rem;" onclick="window.StudioUI.handleNavSmartProtect()">
                        <i class="fas fa-shield-heart"></i> حماية ذكية
                    </button>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-mobile-screen-button" style="color:var(--sb-primary);"></i>
                    <h3>مظهر الشريط السفلي</h3>
                </div>
                <p class="sb-settings-hint">اختر الشكل أولاً، ثم اضبط إعدادات الهاتف والكمبيوتر الخاصة بهذا الشكل.</p>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">الشكل الأساسي</label>
                        <div class="sb-card-style-grid">${renderStyleOptions(bottomBarStyle, 'handleNavBottomBarStyleChange')}</div>
                        ${renderSizeControls('bottom', bottomBarStyle, bottomBarSize)}
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-bars" style="color:var(--sb-primary);"></i>
                    <h3>مظهر الشريط العلوي</h3>
                </div>
                <p class="sb-settings-hint">هذه الإعدادات تخص الشريط العلوي فقط، ويمكن حفظها بشكل مستقل لكل شكل.</p>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">الشكل الأساسي</label>
                        <div class="sb-card-style-grid">${renderStyleOptions(topBarStyle, 'handleNavTopBarStyleChange')}</div>
                        ${renderSizeControls('top', topBarStyle, topBarSize)}
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-sliders" style="color:var(--sb-primary);"></i>
                    <h3>أزرار الشريط العلوي</h3>
                </div>
                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column:1/-1;">
                        <label class="sb-field-label">أيقونة الشعار / اللوجو</label>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;">${logoIconsHtml}</div>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">إظهار الشعار 🏬</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">إخفاء/إظهار أيقونة الشعار في الهيدر</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_logo_icon !== false ? 'checked' : ''} onchange="window.StudioUI.handleNavTopBarChange('show_logo_icon',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">زر البحث 🔎</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">إظهار/إخفاء زر البحث في الهيدر</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_search_btn !== false ? 'checked' : ''} onchange="window.StudioUI.handleNavTopBarChange('show_search_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">زر الوضع الليلي 🌙</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">إظهار/إخفاء زر تبديل الوضع الداكن في الهيدر</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_dark_mode_btn !== false ? 'checked' : ''} onchange="window.StudioUI.handleNavTopBarChange('show_dark_mode_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">زر الحساب الشخصي 👤</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">إظهار/إخفاء زر الملف الشخصي في الهيدر</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_profile_btn !== false ? 'checked' : ''} onchange="window.StudioUI.handleNavTopBarChange('show_profile_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>`;
    }
}