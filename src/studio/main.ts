/**
 * ========================================================
 * 🚀 Nalsh Studio v4.0 - Main Entry & Controller
 * ========================================================
 */

import { studioState, StateChangeType } from './state';
import { ActiveTabKey, DeviceMode } from './types';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { Preview } from './components/Preview';
import { Toast } from './components/Toast';
import { HelpModal } from './components/HelpModal';
import { buildLightPalette, buildDarkPalette, buildLightPaletteFromSeeds, buildDarkPaletteFromSeeds, contrastText, hexToHSL, normalizeHexColor } from './utils/colorUtils';
import { THEME_PRESETS, DEFAULT_STOREFRONT_CONFIG, sanitizeStorefrontConfig } from '../config/storefrontConfigSchema';
import { WORKER_API_URL } from '../core/ApiClient';
import { DEFAULT_NAV_ITEMS, DEFAULT_TOP_BAR_SETTINGS, NAVIGATION_PRESETS, normalizeBottomNavItems, normalizeTopBarSettings } from './navigationDefaults';
import { STORE_STYLE_LIBRARY, StoreStylePresetId } from './styleLibrary';

function buildReusableThemeConfig(sourceConfig: any): Record<string, any> {
    const config = JSON.parse(JSON.stringify(sourceConfig || {}));
    delete config.store_identity;
    delete config.messages;
    delete config.store_messages;
    delete config.modals_customization;
    if (config.marketing?.whatsapp_floating) {
        delete config.marketing.whatsapp_floating.phone;
    }
    return config;
}

function extractImportedStudioConfig(value: any): Record<string, any> {
    const candidate = value?.config && typeof value.config === 'object' ? value.config : value;
    if (!candidate || typeof candidate !== 'object') {
        throw new Error('ملف JSON لا يحتوي على إعدادات صالحة');
    }
    return candidate;
}

function inferSmartDesignFromColor(hex: string) {
    const { h, s, l } = hexToHSL(normalizeHexColor(hex));
    
    // Default smart config
    let font = 'Tajawal';
    let weight = '700';
    let radius = '12px';
    let button_style = 'rounded';
    let button_radius = '14px';
    let anim = 'lift';
    let display = 'by_categories_sections';
    let card_style = 'portrait';
    
    const isGrayscale = s < 15;
    const isPastel = s < 60 && l > 75;
    const isVibrant = s > 70;
    const isDark = l < 35;

    const isWarm = (h >= 0 && h < 45) || (h >= 330 && h <= 360);
    const isEarth = (h >= 45 && h < 75);
    const isNature = (h >= 75 && h < 160);
    const isCool = (h >= 160 && h < 260);
    const isRoyal = (h >= 260 && h < 330);

    if (isGrayscale) {
        font = 'Alexandria'; weight = '600'; radius = '4px'; button_style = 'square'; button_radius = '4px'; anim = 'lift'; display = 'all_flat_grid';
    } else if (isNature) {
        font = 'Almarai'; weight = '700'; radius = '20px'; button_style = 'pill'; button_radius = '9999px'; anim = 'glow'; display = 'tabs_by_category'; card_style = 'portrait';
    } else if (isRoyal) {
        font = 'Readex Pro'; weight = '700'; radius = '28px'; button_style = 'pill'; button_radius = '9999px'; anim = 'scale'; display = 'featured_first'; card_style = 'portrait';
    } else if (isEarth || (isWarm && isDark)) {
        font = 'Changa'; weight = '800'; radius = '0px'; button_style = 'square'; button_radius = '0px'; anim = 'lift'; display = 'by_categories_sections'; card_style = 'landscape';
    } else if (isCool) {
        font = 'Cairo'; weight = '700'; radius = '12px'; button_style = 'rounded'; button_radius = '12px'; anim = 'lift'; display = 'by_categories_sections'; card_style = 'portrait';
    } else if (isWarm && isVibrant) {
        font = 'Tajawal'; weight = '800'; radius = '16px'; button_style = 'rounded'; button_radius = '16px'; anim = 'scale'; display = 'featured_first'; card_style = 'portrait';
    } else if (isPastel) {
        font = 'El Messiri'; weight = '700'; radius = '20px'; button_style = 'pill'; button_radius = '9999px'; anim = 'lift'; display = 'tabs_by_category';
    }

    return { font, weight, radius, button_style, button_radius, anim, display, card_style, l };
}

export class StudioApp {
    private static isInitialized = false;

    public static init(): void {
        if (StudioApp.isInitialized) return;
        StudioApp.isInitialized = true;

        studioState.init();
        StudioApp.mountWindowBridge();
        StudioApp.mountApp();

        // Subscribe to fine-grained state updates without re-creating the iframe
        studioState.subscribe((_config, activeTab, changeType) => {
            StudioApp.handleStateUpdate(activeTab, changeType);
        });

        // Setup global keyboard shortcuts
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                StudioApp.undo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                StudioApp.redo();
            }
        });

        // Setup listener for iframe readiness
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'NALSH_IFRAME_READY') {
                setTimeout(() => {
                    studioState.sendLiveUpdateToPreview();
                    studioState.syncIframeTheme(studioState.isDarkPreview);
                }, 100);
            }
        });
    }

    public static mountApp(): void {
        const root = document.getElementById('studio-app-root');
        if (!root) return;

        const { mobileView } = studioState;
        const viewClass = mobileView === 'preview' ? 'view-mode-preview' : 'view-mode-controls';

        // Mount the entire app shell ONCE so the preview iframe is never destroyed
        root.innerHTML = `
            ${Topbar.render()}
            <main class="sb-workspace ${viewClass}">
                ${Sidebar.render()}
                ${Preview.render()}
            </main>
            ${HelpModal.render()}
            <div class="sb-mobile-view-switcher">
                <div class="sb-history-group sb-mobile-history-group" aria-label="أدوات التراجع">
                    <button class="sb-icon-tool" data-history-action="undo" onclick="window.StudioUI.undo()" title="تراجع (Ctrl+Z)" ${!studioState.canUndo() ? 'disabled' : ''}>
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="sb-icon-tool" data-history-action="redo" onclick="window.StudioUI.redo()" title="إعادة (Ctrl+Y)" ${!studioState.canRedo() ? 'disabled' : ''}>
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
                <button class="sb-m-view-btn ${mobileView === 'controls' ? 'active' : ''}" onclick="window.StudioUI.setMobileView('controls')">
                    <i class="fas fa-sliders-h"></i> <span>التخصيص</span>
                </button>
                <button class="sb-m-view-btn ${mobileView === 'preview' ? 'active' : ''}" onclick="window.StudioUI.setMobileView('preview')">
                    <i class="fas fa-eye"></i> <span>المعاينة</span>
                </button>
            </div>
        `;

        // إغلاق قائمة "المزيد" تلقائياً عند النقر خارجها
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('sb-more-dropdown');
            if (dropdown && dropdown.classList.contains('show')) {
                const target = e.target as HTMLElement | null;
                if (!target?.closest('.sb-topbar-more-container')) {
                    dropdown.classList.remove('show');
                }
            }
        });
    }

    public static refreshActiveTab(preserveScroll = true): void {
        const currentTabInfo = Sidebar.getTabInfo(studioState.activeTab);
        const kickerEl = document.getElementById('sb-active-kicker');
        const titleEl = document.getElementById('sb-active-title');
        if (kickerEl) kickerEl.textContent = currentTabInfo.kicker;
        if (titleEl) titleEl.textContent = currentTabInfo.label;

        // تحديث التبويب النشط في الشريط العمودي للحاسوب
        document.querySelectorAll('#sb-tabs-rail .sb-rail-btn').forEach(btn => {
            const tab = btn.getAttribute('data-tab');
            btn.classList.toggle('active', tab === studioState.activeTab);
        });

        // تحديث التبويب النشط في شريط الجوال وتمريره للمنتصف بسلاسة
        document.querySelectorAll('#sb-mobile-tabs-bar .sb-mobile-tab-pill').forEach(btn => {
            const tab = btn.getAttribute('data-tab');
            const isActive = tab === studioState.activeTab;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        const area = document.getElementById('sb-tab-content-area');
        if (!area) return;
        const currentScroll = preserveScroll ? area.scrollTop : 0;
        area.innerHTML = Sidebar.renderTabContent(studioState.activeTab);
        if (preserveScroll) {
            area.scrollTop = currentScroll;
        }
    }

    private static handleStateUpdate(activeTab: ActiveTabKey, changeType: StateChangeType): void {
        // 1. Update undo/redo buttons in topbar
        document.querySelectorAll<HTMLButtonElement>('[data-history-action="undo"]')
            .forEach(button => { button.disabled = !studioState.canUndo(); });
        document.querySelectorAll<HTMLButtonElement>('[data-history-action="redo"]')
            .forEach(button => { button.disabled = !studioState.canRedo(); });

        if (changeType === 'tab') {
            StudioApp.refreshActiveTab(false);
        } else if (changeType === 'device') {
            // Update preview wrapper frame class
            const pw = document.getElementById('preview-wrapper');
            if (pw) {
                pw.className = `sb-preview-wrapper preview-frame-${studioState.currentDevice}`;
            }
            const previewDeviceSwitcher = document.getElementById('preview-device-switcher');
            if (previewDeviceSwitcher) {
                previewDeviceSwitcher.classList.toggle('is-desktop', studioState.currentDevice === 'desktop');
            }
            const dh = document.getElementById('preview-device-header');
            if (dh) {
                dh.classList.toggle('hidden', studioState.currentDevice === 'desktop');
            }
            // Update device switcher buttons
            const deviceBtns = document.querySelectorAll('.sb-device-btn');
            deviceBtns.forEach(btn => {
                const isMatch = btn.getAttribute('data-device') === studioState.currentDevice;
                btn.classList.toggle('active', isMatch);
            });
            if (studioState.activeTab === 'products_layout') {
                StudioApp.refreshActiveTab(true);
            }
        } else if (changeType === 'dark_mode') {
            const icon = document.getElementById('sb-theme-icon');
            const text = document.getElementById('sb-theme-mode-text');
            if (icon) icon.className = `fas ${studioState.isDarkPreview ? 'fa-sun' : 'fa-moon'}`;
            if (text) text.textContent = studioState.isDarkPreview ? 'فاتح' : 'داكن';
        } else if (changeType === 'mobile_view') {
            const ws = document.querySelector('.sb-workspace');
            if (ws) {
                ws.className = `sb-workspace view-mode-${studioState.mobileView}`;
            }
            const mBtns = document.querySelectorAll('.sb-m-view-btn');
            mBtns.forEach(btn => {
                const isMatch = (studioState.mobileView === 'controls' && btn.innerHTML.includes('التخصيص')) ||
                                (studioState.mobileView === 'preview' && btn.innerHTML.includes('المعاينة'));
                btn.classList.toggle('active', isMatch);
            });
        } else if (changeType === 'history' || changeType === 'full_sync') {
            StudioApp.refreshActiveTab(true);
        }
        // For 'live_update', we do NOT re-render the tab so user typing and focus remain completely undisturbed!
    }

    public static undo(): void {
        if (studioState.undo()) {
            Toast.show('تم التراجع ↩️', 'info');
        }
    }

    public static redo(): void {
        if (studioState.redo()) {
            Toast.show('تمت الإعادة ↪️', 'info');
        }
    }

    public static mountWindowBridge(): void {
        (window as any).StudioUI = {
            setActiveTab: (tab: ActiveTabKey) => studioState.setActiveTab(tab),
            switchProductSubTab: (sub: 'portrait' | 'landscape' | 'categories') => {
                studioState.setProductSubTab(sub);
                StudioApp.refreshActiveTab(true);
            },
            setDevice: (d: DeviceMode) => studioState.setDevice(d),
            setMobileView: (v: 'controls' | 'preview') => studioState.setMobileView(v),
            toggleDarkMode: () => studioState.togglePreviewDarkMode(),
            undo: () => StudioApp.undo(),
            redo: () => StudioApp.redo(),
            openHelpModal: () => HelpModal.open(),
            closeHelpModal: () => HelpModal.close(),
            toggleMoreMenu: (e?: Event) => {
                if (e) {
                    e.stopPropagation();
                }
                const dropdown = document.getElementById('sb-more-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            },

            handleIdentityChange: (key: string, value: string) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.store_identity) cfg.store_identity = {} as any;
                    cfg.store_identity[key] = value;
                }, true, 'live_update');
            },

            handleAnnouncementChange: (key: string, value: any, rerender = false) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.store_identity) cfg.store_identity = {} as any;
                    if (!cfg.store_identity.announcement_bar) {
                        cfg.store_identity.announcement_bar = { enabled: true, text: '', bg_color: '#4F46E5', text_color: '#FFFFFF' };
                    }
                    (cfg.store_identity.announcement_bar as any)[key] = value;
                }, true, rerender ? 'full_sync' : 'live_update');
                if (rerender) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleDefaultThemeModeChange: (mode: 'light' | 'dark' | 'auto') => {
                studioState.updateConfig(cfg => {
                    cfg.default_theme_mode = mode;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تعيين الوضع الافتراضي: ${mode === 'dark' ? 'الداكن 🌙' : mode === 'light' ? 'الفاتح ☀️' : 'تلقائي 🖥️'}`);
            },

            handleProductsSettingChange: (key: string, value: any, rerender = true) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings) cfg.products_settings = {} as any;
                    cfg.products_settings[key] = value;
                }, true, rerender ? 'full_sync' : 'live_update');
                if (rerender) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleOrientationSettingChange: (orientKey: 'portrait' | 'landscape', key: string, value: any, rerender = true) => {
                // تغييرات هيكلية تتطلب إعادة بناء DOM كاملة (layout rebuild)
                const structuralKeys = ['scroll_direction', 'grid_columns', 'grid_rows', 'slider_rows', 'card_orientation', 'items_per_row'];
                const needsRebuild = rerender || structuralKeys.includes(key);

                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings) cfg.products_settings = {} as any;
                    if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {};
                    cfg.products_settings[orientKey][key] = value;
                    // مزامنة مع المستوى الأول (portrait هو الافتراضي للجوال)
                    if (orientKey === 'portrait') {
                        cfg.products_settings[key] = value;
                    }
                }, true, needsRebuild ? 'full_sync' : 'live_update');
                if (needsRebuild) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleCategorySelectForOverride: (cat: string) => {
                studioState.selectedCategoryForOverride = cat;
                StudioApp.refreshActiveTab(true);
            },

            /**
             * معالج sliders الأبعاد بدون لاغ:
             * 1. يحقن CSS مباشرة في الـ iframe (فوري = 0ms)
             * 2. يحفظ القيمة في الـ state بـ debounce (500ms)
             */
            handleDimensionSliderChange: (orientKey: 'portrait' | 'landscape', key: string, value: number) => {
                // الخطوة 1: تحقن CSS فوري بلا لاغ
                studioState.applyDimensionsDirectlyToCSS(orientKey, { [key]: value });
                // الخطوة 2: حفظ في الـ state مع debounce (لا يتم ical)
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings) cfg.products_settings = {} as any;
                    if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {} as any;
                    (cfg.products_settings[orientKey] as any)[key] = value;
                }, true, 'live_update');
            },

            handleCardStyleChange: (orientKey: 'portrait' | 'landscape', style: string) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings) cfg.products_settings = {} as any;
                    if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {} as any;
                    (cfg.products_settings[orientKey] as any)['card_style'] = style;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تغيير شكل الكروت إلى "${style}" ✨`);
            },

            handleAddToCartBtnSettingChange: (key: string, value: any, rerender = true) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings) cfg.products_settings = {} as any;
                    if (!cfg.products_settings.add_to_cart_btn) cfg.products_settings.add_to_cart_btn = {};
                    (cfg.products_settings.add_to_cart_btn as any)[key] = value;
                }, true, 'full_sync');
                if (rerender) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            toggleCategoryOverrideEnabled: (cat: string, isEnabled: boolean) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
                    if (!cfg.products_settings.category_overrides[cat]) {
                        cfg.products_settings.category_overrides[cat] = {
                            enabled: isEnabled,
                            scroll_direction: 'horizontal',
                            items_per_row: 2,
                            grid_columns: 2,
                            grid_rows: 0,
                            slider_rows: 1,
                            card_orientation: 'portrait'
                        };
                    } else {
                        cfg.products_settings.category_overrides[cat].enabled = isEnabled;
                    }
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            handleCategoryOverrideChange: (cat: string, key: string, value: any, rerender = true) => {
                const structuralKeys = ['scroll_direction', 'grid_columns', 'grid_rows', 'slider_rows', 'card_orientation', 'items_per_row', 'card_style'];
                const needsRebuild = rerender || structuralKeys.includes(key);
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
                    if (!cfg.products_settings.category_overrides[cat]) {
                        cfg.products_settings.category_overrides[cat] = { enabled: true };
                    }
                    cfg.products_settings.category_overrides[cat][key] = value;
                }, true, needsRebuild ? 'full_sync' : 'live_update');
                if (needsRebuild) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleCategoryDimensionChange: (cat: string, key: string, value: number) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
                    if (!cfg.products_settings.category_overrides[cat]) {
                        cfg.products_settings.category_overrides[cat] = { enabled: true };
                    }
                    cfg.products_settings.category_overrides[cat][key] = value;
                }, true, 'live_update');
            },

            deleteCategoryOverride: (cat: string) => {
                if (!confirm(`هل أنت متأكد من حذف التخصيص المستقل لقسم "${cat}" والعودة للإعدادات العامة؟`)) return;
                studioState.updateConfig(cfg => {
                    if (cfg.products_settings?.category_overrides?.[cat]) {
                        delete cfg.products_settings.category_overrides[cat];
                    }
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم حذف تخصيص ${cat} والعودة للنمط العام 🔄`);
            },

            resetProductsLayoutDefaults: () => {
                if (!confirm('هل تريد استعادة الإعدادات الافتراضية لطريقة عرض المنتجات؟')) return;
                studioState.updateConfig(cfg => {
                    cfg.products_settings = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG.products_settings));
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تمت استعادة إعدادات عرض المنتجات بنجاح 🔄');
            },

            handleColorChange: (modeKey: 'light_theme' | 'dark_theme', colorKey: string, value: string, sourceEl?: HTMLElement) => {
                const normalizedValue = typeof value === 'string' ? value.trim() : '';

                // ضمان أن وضع المعاينة يطابق الوضع الذي يعدله التاجر
                const isDark = modeKey === 'dark_theme';
                if (studioState.isDarkPreview !== isDark) {
                    studioState.setPreviewDarkMode(isDark);
                }

                studioState.updateConfig(cfg => {
                    if (!cfg[modeKey]) cfg[modeKey] = { colors: {} as any };
                    if (!cfg[modeKey].colors) cfg[modeKey].colors = {} as any;
                    if (normalizedValue) cfg[modeKey].colors[colorKey] = normalizedValue;

                    if (['primary', 'badge_bg', 'btn_primary_bg', 'chatbot_btn_bg'].includes(colorKey) && /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)) {
                        const autoText = contrastText(normalizedValue);
                        if (colorKey === 'badge_bg') cfg[modeKey].colors.badge_text = autoText;
                        if (colorKey === 'btn_primary_bg') cfg[modeKey].colors.btn_primary_text = autoText;
                    }
                }, true, 'live_update');

                // Real-time synchronization of paired input in DOM without re-rendering the tab
                if (sourceEl) {
                    const card = sourceEl.closest('.sb-color-card');
                    if (card) {
                        const colorInput = card.querySelector('.sb-color-input') as HTMLInputElement;
                        const hexInput = card.querySelector('.sb-hex-input') as HTMLInputElement;
                        if (sourceEl === colorInput && hexInput) {
                            hexInput.value = normalizedValue;
                        } else if (sourceEl === hexInput && colorInput && /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)) {
                            colorInput.value = normalizedValue;
                        }
                    }
                }
            },

            generateSmartForMode: (mode: 'light' | 'dark', manualPrimary?: string) => {
                const modeKey = mode === 'light' ? 'light_theme' : 'dark_theme';
                const currentColors = studioState.config[modeKey]?.colors || {};

                const seedPrimary = manualPrimary
                    || (document.getElementById(`seed-primary-${modeKey}`) as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-primary') as HTMLInputElement)?.value
                    || currentColors.primary
                    || (mode === 'light' ? '#4F46E5' : '#6366F1');

                const seedBg = (document.getElementById(`seed-bg-${modeKey}`) as HTMLInputElement)?.value
                    || (mode === 'light'
                        ? (document.getElementById('ai-seed-lightbg') as HTMLInputElement)?.value
                        : (document.getElementById('ai-seed-darkbg') as HTMLInputElement)?.value)
                    || currentColors.bg_body
                    || (mode === 'light' ? '#F8FAFC' : '#0B1120');

                const seedText = (document.getElementById(`seed-text-${modeKey}`) as HTMLInputElement)?.value
                    || currentColors.text_main
                    || (mode === 'light' ? '#0F172A' : '#F8FAFC');

                const seedAccent = (document.getElementById(`seed-accent-${modeKey}`) as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-accent') as HTMLInputElement)?.value
                    || currentColors.accent
                    || (mode === 'light' ? '#14B8A6' : '#2DD4BF');

                studioState.updateConfig(cfg => {
                    if (mode === 'light') {
                        cfg.light_theme = {
                            colors: buildLightPaletteFromSeeds({
                                primary: seedPrimary,
                                bg: seedBg,
                                text: seedText,
                                accent: seedAccent
                            })
                        };
                    } else {
                        cfg.dark_theme = {
                            colors: buildDarkPaletteFromSeeds({
                                primary: seedPrimary,
                                bg: seedBg,
                                text: seedText,
                                accent: seedAccent
                            })
                        };
                    }
                }, true, 'full_sync');

                studioState.setPreviewDarkMode(mode === 'dark');

                StudioApp.refreshActiveTab(true);
                Toast.show(`تم توليد وتنسيق ألوان الوضع ${mode === 'light' ? 'الفاتح ☀️' : 'الداكن 🌙'} بنجاح ✨`);
            },

            generateSmartSectionForMode: (mode: 'light' | 'dark', section: 'bg' | 'buttons' | 'text') => {
                const modeKey = mode === 'light' ? 'light_theme' : 'dark_theme';
                const currentColors = studioState.config[modeKey]?.colors || {};

                const seedPrimary = (document.getElementById(`seed-primary-${modeKey}`) as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-primary') as HTMLInputElement)?.value
                    || currentColors.primary
                    || (mode === 'light' ? '#4F46E5' : '#6366F1');

                const seedBg = (document.getElementById(`seed-bg-${modeKey}`) as HTMLInputElement)?.value
                    || (mode === 'light'
                        ? (document.getElementById('ai-seed-lightbg') as HTMLInputElement)?.value
                        : (document.getElementById('ai-seed-darkbg') as HTMLInputElement)?.value)
                    || currentColors.bg_body
                    || (mode === 'light' ? '#F8FAFC' : '#0B1120');

                const seedText = (document.getElementById(`seed-text-${modeKey}`) as HTMLInputElement)?.value
                    || currentColors.text_main
                    || (mode === 'light' ? '#0F172A' : '#F8FAFC');

                const seedAccent = (document.getElementById(`seed-accent-${modeKey}`) as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-accent') as HTMLInputElement)?.value
                    || currentColors.accent
                    || (mode === 'light' ? '#14B8A6' : '#2DD4BF');

                const generated = mode === 'light'
                    ? buildLightPaletteFromSeeds({ primary: seedPrimary, bg: seedBg, text: seedText, accent: seedAccent })
                    : buildDarkPaletteFromSeeds({ primary: seedPrimary, bg: seedBg, text: seedText, accent: seedAccent });

                studioState.updateConfig(cfg => {
                    if (!cfg[modeKey]) cfg[modeKey] = { colors: {} as any };
                    if (!cfg[modeKey].colors) cfg[modeKey].colors = {} as any;

                    if (section === 'bg') {
                        cfg[modeKey].colors.bg_body = generated.bg_body;
                        cfg[modeKey].colors.bg_card = generated.bg_card;
                        cfg[modeKey].colors.bg_surface = generated.bg_surface;
                        cfg[modeKey].colors.navbar_bg = generated.navbar_bg;
                        cfg[modeKey].colors.bottom_bar_bg = generated.bottom_bar_bg;
                        cfg[modeKey].colors.border = generated.border;
                        cfg[modeKey].colors.card_bg = generated.card_bg;
                        cfg[modeKey].colors.card_border = generated.card_border;
                        cfg[modeKey].colors.modal_bg = generated.modal_bg;
                    } else if (section === 'buttons') {
                        cfg[modeKey].colors.primary = generated.primary;
                        cfg[modeKey].colors.primary_hover = generated.primary_hover;
                        cfg[modeKey].colors.primary_gradient_start = generated.primary_gradient_start;
                        cfg[modeKey].colors.primary_gradient_end = generated.primary_gradient_end;
                        cfg[modeKey].colors.accent = generated.accent;
                        cfg[modeKey].colors.price_color = generated.price_color;
                        cfg[modeKey].colors.badge_bg = generated.badge_bg;
                        cfg[modeKey].colors.badge_text = generated.badge_text;
                        cfg[modeKey].colors.btn_primary_bg = generated.btn_primary_bg;
                        cfg[modeKey].colors.btn_primary_text = generated.btn_primary_text;
                        cfg[modeKey].colors.chatbot_btn_bg = generated.chatbot_btn_bg;
                        cfg[modeKey].colors.category_chip_active = generated.category_chip_active;
                        cfg[modeKey].colors.bottom_bar_active = generated.bottom_bar_active;
                    } else if (section === 'text') {
                        cfg[modeKey].colors.text_main = generated.text_main;
                        cfg[modeKey].colors.text_muted = generated.text_muted;
                        cfg[modeKey].colors.card_title = generated.card_title;
                        cfg[modeKey].colors.section_title = generated.section_title;
                        cfg[modeKey].colors.navbar_text = generated.navbar_text;
                        cfg[modeKey].colors.category_chip_text = generated.category_chip_text;
                    }
                }, true, 'full_sync');

                studioState.setPreviewDarkMode(mode === 'dark');

                StudioApp.refreshActiveTab(true);
                const sectionNames: Record<string, string> = { bg: 'الخلفيات والكروت', buttons: 'الأزرار والأسعار', text: 'النصوص والعناوين' };
                Toast.show(`تم تخصيص وتوليد ${sectionNames[section] || 'العناصر'} بنجاح ✨`);
            },

            generateSmartHarmony: (targetScope = 'intelligent') => {
                const seedPrimary = (document.getElementById('ai-seed-primary') as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-primary-hex') as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-color') as HTMLInputElement)?.value
                    || studioState.config.light_theme?.colors?.primary
                    || '#4F46E5';

                const seedLightBg = (document.getElementById('ai-seed-lightbg') as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-lightbg-hex') as HTMLInputElement)?.value
                    || studioState.config.light_theme?.colors?.bg_body
                    || '#F8FAFC';

                const seedDarkBg = (document.getElementById('ai-seed-darkbg') as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-darkbg-hex') as HTMLInputElement)?.value
                    || studioState.config.dark_theme?.colors?.bg_body
                    || '#0B1120';

                const seedAccent = (document.getElementById('ai-seed-accent') as HTMLInputElement)?.value
                    || (document.getElementById('ai-seed-accent-hex') as HTMLInputElement)?.value
                    || studioState.config.light_theme?.colors?.accent
                    || '#14B8A6';

                studioState.updateConfig(cfg => {
                    // Update Colors for both modes simultaneously with multi-seed
                    cfg.light_theme = {
                        colors: buildLightPaletteFromSeeds({
                            primary: seedPrimary,
                            bg: seedLightBg,
                            accent: seedAccent
                        })
                    };
                    cfg.dark_theme = {
                        colors: buildDarkPaletteFromSeeds({
                            primary: seedPrimary,
                            bg: seedDarkBg,
                            accent: seedAccent
                        })
                    };

                    if (targetScope === 'intelligent') {
                        const smart = inferSmartDesignFromColor(seedPrimary);
                        
                        if (!cfg.typography) cfg.typography = {} as any;
                        if (!cfg.shapes) cfg.shapes = {} as any;
                        if (!cfg.animations) cfg.animations = {} as any;
                        if (!cfg.products_settings) cfg.products_settings = {} as any;
                        if (!cfg.products_settings.portrait) cfg.products_settings.portrait = {} as any;
                        if (!cfg.products_settings.landscape) cfg.products_settings.landscape = {} as any;

                        // Apply Typography
                        cfg.typography.font_family = smart.font;
                        cfg.typography.heading_weight = smart.weight;
                        
                        // Apply Shapes
                        cfg.shapes.card_radius = smart.radius;
                        cfg.shapes.button_style = smart.button_style as any;
                        cfg.shapes.button_radius = smart.button_radius;
                        
                        // Apply Animations
                        cfg.animations!.card_hover = smart.anim as any;
                        
                        // Apply Layout Modes
                        cfg.products_settings.display_mode = smart.display as any;
                        
                        // Intelligent Layout Merging
                        cfg.products_settings.portrait = {
                            ...cfg.products_settings.portrait,
                            card_orientation: smart.card_style === 'landscape' ? 'landscape' : 'portrait',
                            grid_columns: smart.display === 'tabs_by_category' ? 2 : 2,
                            scroll_direction: 'vertical'
                        };
                        
                        cfg.products_settings.landscape = {
                            ...cfg.products_settings.landscape,
                            card_orientation: smart.card_style as any,
                            grid_columns: smart.card_style === 'landscape' ? 3 : 4,
                            scroll_direction: 'horizontal'
                        };
                        
                        cfg.default_theme_mode = smart.l < 40 ? 'dark' : 'light';
                    }
                }, true, 'full_sync');

                StudioApp.refreshActiveTab(true);
                Toast.show('تم توليد هوية المتجر الكاملة بذكاء بناءً على ألوانك المفضلة ✨🎨');
            },

            applySmartIndustryBundle: (bundleId: string) => {
                const seeds: Record<string, string> = {
                    luxury: '#D97706', tech: '#06B6D4', fashion: '#EC4899', organic: '#059669', artisan: '#B45309', modern: '#8B5CF6'
                };
                const seedColor = seeds[bundleId] || '#4F46E5';
                const colorEl = document.getElementById('ai-seed-color') as HTMLInputElement;
                const hexEl = document.getElementById('ai-seed-hex') as HTMLInputElement;
                if (colorEl) colorEl.value = seedColor;
                if (hexEl) hexEl.value = seedColor;
                const presetEl = document.getElementById('ai-style-preset') as HTMLSelectElement;
                if (presetEl) presetEl.value = bundleId;
                (window as any).StudioUI.generateSmartHarmony('intelligent');
            },

            handlePresetApply: (presetId: string, targetMode: 'both' | 'light' | 'dark' = 'both') => {
                const p = (THEME_PRESETS as any[]).find(x => x.id === presetId);
                if (!p) return;
                studioState.updateConfig(cfg => {
                    cfg.theme_name = p.id;
                    if (targetMode === 'both') {
                        cfg.light_theme = JSON.parse(JSON.stringify(p.light_theme || {}));
                        cfg.dark_theme = JSON.parse(JSON.stringify(p.dark_theme || {}));
                        if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
                        if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
                    } else if (targetMode === 'light') {
                        cfg.light_theme = JSON.parse(JSON.stringify(p.light_theme || {}));
                        if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
                        if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
                    } else if (targetMode === 'dark') {
                        cfg.dark_theme = JSON.parse(JSON.stringify(p.dark_theme || {}));
                        if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
                        if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
                    }
                }, true, 'full_sync');

                if (targetMode === 'light') {
                    studioState.setPreviewDarkMode(false);
                } else if (targetMode === 'dark') {
                    studioState.setPreviewDarkMode(true);
                }

                StudioApp.refreshActiveTab(true);
                const modeLabel = targetMode === 'both' ? 'الوضعين معاً' : (targetMode === 'light' ? 'الوضع الفاتح ☀️' : 'الوضع الداكن 🌙');
                Toast.show(`تم تطبيق ثيم "${p.name}" لـ (${modeLabel}) بنجاح ✨`);
            },

            filterPresetCards: (category: string, clickedBtn: HTMLElement) => {
                // تحديث حالة الأزرار النشطة
                const pillContainer = document.getElementById('theme-category-pills');
                if (pillContainer) {
                    pillContainer.querySelectorAll('.sb-badge-pill').forEach(b => {
                        b.classList.remove('active');
                    });
                }
                if (clickedBtn) {
                    clickedBtn.classList.add('active');
                }

                // إظهار أو إخفاء الكروت
                const cards = document.querySelectorAll('.sb-preset-theme-card');
                cards.forEach(c => {
                    const el = c as HTMLElement;
                    const cardCat = el.getAttribute('data-category') || 'عام';
                    if (category === 'الكل' || cardCat === category) {
                        el.style.display = 'block';
                    } else {
                        el.style.display = 'none';
                    }
                });
            },

            handleStoreMessageChange: (key: string, value: string) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.messages) cfg.messages = {};
                    if (!cfg.store_messages) cfg.store_messages = {};
                    cfg.messages[key] = value;
                    cfg.store_messages[key] = value;
                }, true, 'live_update');
            },

            handleModalFieldChange: (modalKey: string, fieldKey: string, value: string) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.modals_customization) cfg.modals_customization = {};
                    if (!cfg.modals_customization[modalKey]) cfg.modals_customization[modalKey] = {};
                    cfg.modals_customization[modalKey][fieldKey] = value;
                }, true, 'live_update');
            },

            toggleAccordion: (idx: number) => {
                const acc = document.getElementById(`sec-acc-${idx}`);
                if (acc) acc.classList.toggle('open');
            },

            moveSectionBlock: (idx: number, dir: number) => {
                studioState.updateConfig(cfg => {
                    const blocks = cfg.layout_blocks || [];
                    const target = idx + dir;
                    if (target < 0 || target >= blocks.length) return;
                    const temp = blocks[idx];
                    blocks[idx] = blocks[target];
                    blocks[target] = temp;
                    blocks.forEach((b, i) => b.order = i + 1);
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تم تحديث ترتيب الأقسام ✨');
            },

            toggleSectionVisibility: (idx: number) => {
                studioState.updateConfig(cfg => {
                    const blocks = cfg.layout_blocks || [];
                    if (blocks[idx]) blocks[idx].visible = !blocks[idx].visible;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            handleBlockFieldChange: (idx: number, field: string, value: any) => {
                studioState.updateConfig(cfg => {
                    const blocks = cfg.layout_blocks || [];
                    if (blocks[idx]) (blocks[idx] as any)[field] = value;
                }, true, 'live_update');
            },

            handleBlockSettingChange: (idx: number, settingKey: string, value: any) => {
                studioState.updateConfig(cfg => {
                    const blocks = cfg.layout_blocks || [];
                    if (blocks[idx]) {
                        if (!blocks[idx].settings) blocks[idx].settings = {};
                        blocks[idx].settings![settingKey] = value;
                    }
                }, true, 'live_update');
            },

            handleTypographyChange: (key: string, value: any, rerender = false) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.typography) cfg.typography = {} as any;
                    (cfg.typography as any)[key] = value;
                }, true, rerender ? 'full_sync' : 'live_update');
                if (rerender) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleShapeChange: (key: string, value: any) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.shapes) cfg.shapes = {} as any;
                    (cfg.shapes as any)[key] = value;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            handleButtonStyleChange: (style: 'rounded' | 'pill' | 'square' | string, radius: string) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.shapes) cfg.shapes = {} as any;
                    cfg.shapes.button_style = style as any;
                    cfg.shapes.button_radius = radius;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            applyStyleLibraryPreset: (presetId: string) => {
                const preset = STORE_STYLE_LIBRARY[presetId as StoreStylePresetId] || STORE_STYLE_LIBRARY['modern-soft'];
                if (!preset) return;

                studioState.updateConfig(cfg => {
                    const cfgAny = cfg as any;

                    if (!cfgAny.style_library) cfgAny.style_library = {};
                    cfgAny.style_library.current = preset.id;

                    if (!cfgAny.shapes) cfgAny.shapes = {};
                    cfgAny.shapes.card_radius = preset.cardRadius;
                    cfgAny.shapes.button_style = preset.buttonStyle;
                    cfgAny.shapes.button_radius = preset.buttonRadius;

                    if (!cfgAny.animations) cfgAny.animations = {};
                    cfgAny.animations.card_hover = preset.animation;

                    if (!cfgAny.products_settings) cfgAny.products_settings = {};
                    cfgAny.products_settings.display_mode = preset.displayMode;

                    if (!cfgAny.messages) cfgAny.messages = {};
                    if (!cfgAny.messages.ai_assistant) cfgAny.messages.ai_assistant = {};
                    cfgAny.messages.ai_assistant.name = preset.name || preset.label;
                    cfgAny.messages.ai_assistant.persona = preset.botPersona;
                    cfgAny.messages.ai_assistant.button_style = preset.botButtonStyle;
                    cfgAny.messages.ai_assistant.avatar_style = preset.botAvatarStyle;
                    cfgAny.messages.ai_assistant.accent_color = preset.accent;

                    if (!cfgAny.navigation_settings) cfgAny.navigation_settings = {};
                    if (!cfgAny.navigation_settings.top_bar) cfgAny.navigation_settings.top_bar = {};
                    if (!cfgAny.navigation_settings.bottom_bar) cfgAny.navigation_settings.bottom_bar = {};
                    cfgAny.navigation_settings.top_bar.navbar_style = preset.navbarStyle;
                    cfgAny.navigation_settings.bottom_bar.style = preset.navbarStyle;
                }, true, 'full_sync');

                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تطبيق نمط "${preset.label}" بنجاح ✨`);
            },

            handleAnimationChange: (key: string, value: any) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.animations) cfg.animations = {};
                    (cfg.animations as any)[key] = value;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            handleMarketingChange: (section: string, key: string, value: any, rerender = false) => {
                studioState.updateConfig(cfg => {
                    if (!cfg.marketing) cfg.marketing = {};
                    if (!(cfg.marketing as any)[section]) (cfg.marketing as any)[section] = {};
                    (cfg.marketing as any)[section][key] = value;
                }, true, rerender ? 'full_sync' : 'live_update');
                if (rerender) {
                    StudioApp.refreshActiveTab(true);
                }
            },

            handleJsonApplyFromText: () => {
                const el = document.getElementById('live-json-editor') as HTMLTextAreaElement;
                if (!el) return;
                try {
                    const parsed = JSON.parse(el.value);
                    const { sanitizedConfig } = sanitizeStorefrontConfig(extractImportedStudioConfig(parsed));
                    studioState.pushHistory();
                    studioState.config = sanitizedConfig;
                    studioState.sendLiveUpdateToPreview();
                    StudioApp.refreshActiveTab(true);
                    Toast.show('تم تطبيق ملف JSON بنجاح ✅');
                } catch (err: any) {
                    alert('خطأ في صيغة JSON: ' + err.message);
                }
            },

            handleJsonFileUpload: (event: any) => {
                const file = event.target.files && event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const parsed = JSON.parse(e.target?.result as string);
                        const { sanitizedConfig } = sanitizeStorefrontConfig(extractImportedStudioConfig(parsed));
                        studioState.pushHistory();
                        studioState.config = sanitizedConfig;
                        studioState.sendLiveUpdateToPreview();
                        StudioApp.refreshActiveTab(true);
                        Toast.show(`تم استيراد الملف "${file.name}" بنجاح ✅`);
                    } catch (err: any) {
                        alert('خطأ في قراءة ملف JSON: ' + err.message);
                    }
                };
                reader.readAsText(file);
                event.target.value = '';
            },

            copyJsonClipboard: () => {
                navigator.clipboard.writeText(JSON.stringify(studioState.config, null, 2)).then(() => {
                    Toast.show('تم نسخ JSON للحافظة 📋');
                });
            },

            copyMerchantPromptClipboard: () => {
                const el = document.getElementById('store-merchant-prompt') as HTMLTextAreaElement | null;
                const value = el?.value || (() => {
                    const config = studioState.config as any;
                    const promptConfig = {
                        store_name: config.store_name || 'متجري',
                        store_tagline: config.store_tagline || 'متجر عربي عصري',
                        language: 'ar',
                        currency: config.currency || 'SAR',
                        default_theme_mode: config.default_theme_mode || 'light',
                        primary_color: config.light_theme?.colors?.primary || '#4F46E5',
                        accent_color: config.light_theme?.colors?.accent || '#8B5CF6',
                        background_color: config.light_theme?.colors?.bg_body || '#F8FAFC',
                        typography: {
                            font_family: config.typography?.font_family || 'Tajawal',
                            heading_weight: config.typography?.heading_weight || '700',
                            base_size: config.typography?.base_size || 16
                        },
                        navigation: config.navigation_settings || {},
                        marketing: config.marketing || {},
                        messages: config.messages || config.store_messages || {},
                        modals: config.modals_customization || {},
                        sections: Array.isArray(config.sections) ? config.sections : [],
                        products_settings: config.products_settings || {}
                    };
                    return `أنت مصمم متجر إلكتروني عربي عصري ومتخصص. استخدم هذا القالب الكامل لتخصيص متجر كامل، وابقِ البنية نفسها، ولا تكتب شرحاً إضافياً، فقط أعد القيم المناسبة للمتجر وتأكد أن الناتج صالح JSON:\n\n${JSON.stringify(promptConfig, null, 2)}`;
                })();

                navigator.clipboard.writeText(value).then(() => {
                    Toast.show('تم نسخ البرومبت الخاص بالمتجر للحافظة ✍️');
                }).catch(() => {
                    if (el) {
                        el.select();
                        document.execCommand('copy');
                    }
                    Toast.show('تم نسخ البرومبت للحافظة ✍️');
                });
            },

            resetMerchantPrompt: () => {
                const el = document.getElementById('store-merchant-prompt') as HTMLTextAreaElement | null;
                if (!el) return;
                const config = studioState.config as any;
                const promptConfig = {
                    store_name: config.store_name || 'متجري',
                    store_tagline: config.store_tagline || 'متجر عربي عصري',
                    language: 'ar',
                    currency: config.currency || 'SAR',
                    default_theme_mode: config.default_theme_mode || 'light',
                    primary_color: config.light_theme?.colors?.primary || '#4F46E5',
                    accent_color: config.light_theme?.colors?.accent || '#8B5CF6',
                    background_color: config.light_theme?.colors?.bg_body || '#F8FAFC',
                    typography: {
                        font_family: config.typography?.font_family || 'Tajawal',
                        heading_weight: config.typography?.heading_weight || '700',
                        base_size: config.typography?.base_size || 16
                    },
                    navigation: config.navigation_settings || {},
                    marketing: config.marketing || {},
                    messages: config.messages || config.store_messages || {},
                    modals: config.modals_customization || {},
                    sections: Array.isArray(config.sections) ? config.sections : [],
                    products_settings: config.products_settings || {}
                };
                el.value = `أنت مصمم متجر إلكتروني عربي عصري ومتخصص. استخدم هذا القالب الكامل لتخصيص متجر كامل، وابقِ البنية نفسها، ولا تكتب شرحاً إضافياً، فقط أعد القيم المناسبة للمتجر وتأكد أن الناتج صالح JSON:\n\n${JSON.stringify(promptConfig, null, 2)}`;
                el.focus();
                Toast.show('تم تحديث برومبت تخصيص المتجر 🔄');
            },

            downloadJson: () => {
                const fileName = `storefront_config_${studioState.merchantUsername}.json`;
                const blob = new Blob([JSON.stringify(studioState.config, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
                Toast.show('تم تنزيل ملف الإعدادات 📥');
            },

            downloadThemeTemplate: () => {
                const idInput = document.getElementById('theme-export-id') as HTMLInputElement | null;
                const nameInput = document.getElementById('theme-export-name') as HTMLInputElement | null;
                const descriptionInput = document.getElementById('theme-export-description') as HTMLInputElement | null;
                const id = (idInput?.value || 'custom_theme').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
                if (!id) {
                    Toast.show('أدخل معرفًا صالحًا للقالب أولاً', 'error');
                    return;
                }
                const config = buildReusableThemeConfig(studioState.config);
                const colors = config.light_theme?.colors || {};
                const template = {
                    id,
                    name: (nameInput?.value || 'قالب متجر جديد').trim(),
                    description: (descriptionInput?.value || 'تصميم جاهز قابل للتخصيص لمتجرك.').trim(),
                    category: 'قوالب مخصصة',
                    preview: {
                        primary: colors.primary || '#4F46E5',
                        accent: colors.accent || '#06B6D4',
                        background: colors.bg_body || '#F8FAFC'
                    },
                    config
                };
                const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `theme_${id}.json`;
                anchor.click();
                URL.revokeObjectURL(url);
                Toast.show(`تم تنزيل ملف القالب (${template.name}). ضعه داخل مجلد templates/themes/ وسيظهر للتاجر مباشرة 📦`, 'success');
            },

            resetAllDefaults: () => {
                if (!confirm('⚠️ هل أنت متأكد من استعادة كافة إعدادات المتجر إلى الوضع الافتراضي؟ ستفقد التعديلات غير المنشورة.')) return;
                studioState.resetToDefaults();
                StudioApp.refreshActiveTab(true);
                Toast.show('تمت استعادة كافة الإعدادات الافتراضية بنجاح 🔄');
            },

            publishTheme: async () => {
                const btn = document.getElementById('btn-publish-live') as HTMLButtonElement;
                const oldHtml = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>جاري النشر السحابي...</span>`;
                    btn.disabled = true;
                }

                try {
                    const token = studioState.merchantToken || localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
                    const publishConfig = await studioState.buildPublishConfig();
                    if (studioState.isGuestMode || !token) {
                        try {
                            const cfgStr = JSON.stringify(publishConfig);
                            localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
                            localStorage.setItem('nalsh_storefront_config_guest_draft', cfgStr);
                        } catch (e) {}
                        Toast.show('تم حفظ تصميمك محلياً كمسودة بنجاح! 💾', 'success');
                        if (confirm('أنت حالياً في وضع المعاينة التجريبي. تم حفظ كافة تعديلاتك محلياً. هل تود الانتقال إلى تسجيل الدخول لنشرها سحابياً على متجرك المباشر؟')) {
                            window.location.href = 'login.html?redirect=store-builder.html';
                        }
                        return;
                    }

                    // تنقية وفحص تكوين المتجر برمجياً حسب باقة التاجر
                    const { sanitizedConfig, notices } = sanitizeStorefrontConfig(publishConfig, studioState.merchantPlanType);
                    studioState.config = sanitizedConfig;

                    const headers: Record<string, string> = { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    };

                    const res = await fetch(WORKER_API_URL, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            action: 'save_storefront_config',
                            merchant_username: studioState.merchantUsername,
                            config: sanitizedConfig
                        })
                    });

                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('merchant_token');
                        sessionStorage.removeItem('merchant_token');
                        Toast.show('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً 🔒', 'error');
                        setTimeout(() => {
                            window.location.replace('login.html?redirect=store-builder.html&expired=1');
                        }, 1200);
                        return;
                    }

                    const result = await res.json().catch(() => null);

                    const isSuccessfulPublish = !!(
                        res.ok
                        && result
                        && (
                            result.status === 'success'
                            || result.status === 'ok'
                            || result.success === true
                            || result.saved === true
                            || result.updated === true
                        )
                    );

                    if (res.ok && isSuccessfulPublish) {
                        // حفظ مسودة التاجر محلياً كنسخة سريعة للعمل دون اتصال.
                        try {
                            const cfgStr = JSON.stringify(sanitizedConfig);
                            localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
                        } catch (e) {}

                        // ✅ طلب تحديث theme-config.json على السيرفر لضمان تزامن المتجر
                        fetch(WORKER_API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                action: 'update_theme_config_file',
                                merchant_username: studioState.merchantUsername,
                                config: sanitizedConfig
                            })
                        }).catch(() => { /* صامت — تحديث ثانوي */ });

                        studioState.sendLiveUpdateToPreview();

                        const noticeText = Array.isArray(notices) && notices.length > 0 ? ` (${notices[0]})` : '';
                        Toast.show(`تم نشر مظهر متجرك سحابياً بنجاح! 🚀${noticeText}`, 'success');
                    } else {
                        const errMsg = result?.message || 'تعذر النشر على الخادم السحابي';
                        // حفظ محلياً كمسودة بجميع المفاتيح
                        try {
                            const cfgStr = JSON.stringify(sanitizedConfig);
                            localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
                        } catch (e) {}
                        Toast.show(`⚠️ تم حفظ التعديل محلياً كمسودة (${errMsg})`, 'info');
                    }
                } catch (e: any) {
                    console.error('Publish error:', e);
                    try {
                        localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, JSON.stringify(studioState.config));
                    } catch (err) {}
                    Toast.show('تم حفظ التعديلات محلياً كمسودة (تحقق من اتصال الإنترنت للنشر السحابي) 🎨', 'info');
                } finally {
                    if (btn) {
                        btn.innerHTML = oldHtml;
                        btn.disabled = false;
                    }
                }
            },

            handleAssistantConfigChange: (key: string, value: any) => {
                studioState.updateConfig(cfg => {
                    const messages = cfg.messages || ((cfg as any).store_messages || {} as any);
                    cfg.messages = messages;
                    if (!messages.ai_assistant) messages.ai_assistant = {
                        enabled: true,
                        name: 'مساعد نالش',
                        persona: 'classic',
                        avatar_icon: 'fa-robot',
                        avatar_emoji: '',
                        button_style: 'pill',
                        avatar_style: 'pulse',
                        position: 'bottom-right',
                        enable_quick_actions: true,
                        smart_contextual_actions: true,
                        smart_contextual_replies: true,
                        behavior_mode: 'support',
                        conversation_style: 'balanced',
                        response_style: 'friendly',
                        accent_color: '#5D646D',
                        status_text: 'متصل للرد الفوري',
                        quick_actions: ['أريد أفضل العروض المتاحة', 'كيف أقوم بالطلب والتوصيل؟', 'تتبع طلبي']
                    };
                    (messages.ai_assistant as any)[key] = value;
                }, true, 'live_update');
                StudioApp.refreshActiveTab(true);
            },

            handleAssistantQuickActionsChange: (value: string) => {
                const items = (value || '')
                    .split(/[،,\n]/)
                    .map((item: string) => item.trim())
                    .filter(Boolean)
                    .slice(0, 6);
                studioState.updateConfig(cfg => {
                    const messages = cfg.messages || ((cfg as any).store_messages || {} as any);
                    cfg.messages = messages;
                    if (!messages.ai_assistant) messages.ai_assistant = {};
                    messages.ai_assistant.quick_actions = items;
                }, true, 'live_update');
                StudioApp.refreshActiveTab(true);
            },

            applyAssistantPreset: (preset: 'classic' | 'premium' | 'futuristic' | 'luxury' | 'fashion' | 'tech' | 'wellness' | 'beauty') => {
                const presets: Record<string, any> = {
                    classic: { enabled: true, name: 'مساعد نالش', persona: 'classic', avatar_icon: 'fa-robot', avatar_emoji: '', button_style: 'pill', avatar_style: 'pulse', position: 'bottom-right', response_style: 'friendly', accent_color: '#5D646D', status_text: 'متصل للرد الفوري', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'support', conversation_style: 'balanced', quick_actions: ['أريد أفضل العروض المتاحة', 'كيف أقوم بالطلب والتوصيل؟', 'تتبع طلبي'] },
                    premium: { enabled: true, name: 'مساعد ذكي', persona: 'premium', avatar_icon: 'fa-star', avatar_emoji: '', button_style: 'bubble', avatar_style: 'halo', position: 'bottom-right', response_style: 'sales', accent_color: '#6C757D', status_text: 'مستعد لعرض أفضل العروض', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'sales', conversation_style: 'balanced', quick_actions: ['أفضل منتجات اليوم', 'أرني العروض المميزة', 'أحتاج مساعدة في الطلب'] },
                    futuristic: { enabled: true, name: 'AI Assistant', persona: 'futuristic', avatar_icon: 'fa-microchip', avatar_emoji: '', button_style: 'minimal', avatar_style: 'orb', position: 'bottom-left', response_style: 'professional', accent_color: '#6B727A', status_text: 'البوت متصل مع دعم فوري', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'advisor', conversation_style: 'short', quick_actions: ['اعرض المنتجات الحديثة', 'توصيل سريع', 'مقارنة المنتجات'] },
                    luxury: { enabled: true, name: 'مساعد الفخامة', persona: 'luxury', avatar_icon: 'fa-crown', avatar_emoji: '', button_style: 'bubble', avatar_style: 'halo', position: 'bottom-right', response_style: 'luxury', accent_color: '#7A6E63', status_text: 'خدمة فاخرة ودعم شخصي', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'concierge', conversation_style: 'balanced', quick_actions: ['منتجات فاخرة', 'خدمة العملاء', 'أرني آخر العروض'] },
                    fashion: { enabled: true, name: 'مستشار الموضة', persona: 'fashion', avatar_icon: 'fa-shirt', avatar_emoji: '', button_style: 'bubble', avatar_style: 'hover', position: 'bottom-right', response_style: 'friendly', accent_color: '#7F8086', status_text: 'أساعدك باختيار الستايل المناسب', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'advisor', conversation_style: 'balanced', quick_actions: ['أرني أحدث الموديلات', 'اختيارات حسب الموسم', 'إكسسوارات أنيقة'] },
                    tech: { enabled: true, name: 'مساعد التقنية', persona: 'tech', avatar_icon: 'fa-laptop', avatar_emoji: '', button_style: 'minimal', avatar_style: 'orb', position: 'bottom-left', response_style: 'professional', accent_color: '#6F7277', status_text: 'أقفز لك بأفضل التقنية', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'advisor', conversation_style: 'short', quick_actions: ['أفضل الأجهزة الحديثة', 'مقارنة المواصفات', 'أرني العروض التقنية'] },
                    wellness: { enabled: true, name: 'مستشار الصحة', persona: 'wellness', avatar_icon: 'fa-spa', avatar_emoji: '', button_style: 'pill', avatar_style: 'pulse', position: 'bottom-right', response_style: 'friendly', accent_color: '#7D8682', status_text: 'أختار لك الأفضل للجسم والعناية', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'advisor', conversation_style: 'balanced', quick_actions: ['منتجات صحية', 'أفضل العناية اليومية', 'أرني منتجات العناية'] },
                    beauty: { enabled: true, name: 'مساعد الجمال', persona: 'beauty', avatar_icon: 'fa-magic', avatar_emoji: '', button_style: 'bubble', avatar_style: 'halo', position: 'bottom-right', response_style: 'luxury', accent_color: '#8B8E94', status_text: 'أرشدك لاختيار الأفضل للجمال', smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: 'concierge', conversation_style: 'balanced', quick_actions: ['أحدث مستحضرات التجميل', 'أفضل العناية', 'مجموعة عناية كاملة'] }
                };
                const chosen = presets[preset] || presets.classic;
                studioState.updateConfig(cfg => {
                    const messages = cfg.messages || ((cfg as any).store_messages || {} as any);
                    cfg.messages = messages;
                    messages.ai_assistant = {
                        ...(messages.ai_assistant || {}),
                        ...chosen,
                        enable_quick_actions: true,
                        smart_contextual_actions: true,
                        smart_contextual_replies: true
                    };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                const labels: Record<string, string> = {
                    classic: 'كلاسيكي', premium: 'مميز', futuristic: 'مستقبلي', luxury: 'فاخر', fashion: 'موضة', tech: 'تقنية', wellness: 'صحة', beauty: 'جمال'
                };
                Toast.show(`تم تطبيق أسلوب ${labels[preset] || 'مخصص'} ✅`);
            },

            // ── Navigation Handlers ──────────────────────────────────────────
            handleNavBottomItemChange: (itemId: string, key: 'label' | 'icon' | 'visible', value: any) => {
                const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    if (!(cfg as any).navigation_settings.bottom_bar) (cfg as any).navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
                    const items: any[] = (cfg as any).navigation_settings.bottom_bar.items;
                    const item = items.find((i: any) => i.id === itemId);
                    if (!item) return;
                    if (key === 'visible' && value === false) {
                        const visibleCount = items.filter((i: any) => i.visible).length;
                        if (visibleCount <= 2) { Toast.show('يجب الإبقاء على عنصرين مرئيين على الأقل ⚠️', 'error'); return; }
                    }
                    item[key] = value;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تحديث ${key === 'visible' ? 'إظهار' : key === 'label' ? 'اسم' : 'أيقونة'} العنصر ✅`);
            },

            handleNavBottomItemDragStart: (itemId: string) => {
                (window as any).__navDragItemId = itemId;
            },

            handleNavBottomItemDrop: (targetItemId: string) => {
                const draggedId = (window as any).__navDragItemId;
                if (!draggedId || draggedId === targetItemId) return;
                const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    if (!(cfg as any).navigation_settings.bottom_bar) (cfg as any).navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
                    const items: any[] = (cfg as any).navigation_settings.bottom_bar.items
                        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                    const from = items.findIndex((i: any) => i.id === draggedId);
                    const to = items.findIndex((i: any) => i.id === targetItemId);
                    if (from < 0 || to < 0) return;
                    const [moved] = items.splice(from, 1);
                    items.splice(to, 0, moved);
                    items.forEach((item: any, index: number) => item.order = index + 1);
                }, true, 'full_sync');
                (window as any).__navDragItemId = null;
                StudioApp.refreshActiveTab(true);
            },

            handleNavBottomItemMove: (itemId: string, direction: 'up' | 'down') => {
                const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    if (!(cfg as any).navigation_settings.bottom_bar) (cfg as any).navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
                    const items: any[] = (cfg as any).navigation_settings.bottom_bar.items
                        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                    const idx = items.findIndex((i: any) => i.id === itemId);
                    if (idx < 0) return;
                    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
                    if (swapIdx < 0 || swapIdx >= items.length) return;
                    const tmpOrder = items[idx].order;
                    items[idx].order = items[swapIdx].order;
                    items[swapIdx].order = tmpOrder;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
            },

            handleNavTopBarChange: (key: string, value: any) => {
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    if (!(cfg as any).navigation_settings.top_bar) (cfg as any).navigation_settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS);
                    (cfg as any).navigation_settings.top_bar[key] = value;
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تم تحديث إعدادات الشريط العلوي ✅');
            },

            handleNavTopBarStyleChange: (style: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island') => {
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    settings.top_bar = { ...normalizeTopBarSettings(settings.top_bar), navbar_style: style };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تم تحديث شكل الشريط العلوي ✅');
            },

            handleNavBottomBarStyleChange: (style: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island') => {
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    settings.bottom_bar = { ...(settings.bottom_bar || {}), style };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تم تحديث شكل الشريط السفلي ✅');
            },

            handleNavBarDimensionChange: (bar: 'top' | 'bottom', style: string, key: string, value: string | number | boolean) => {
                const stringValueKeys = ['desktop_layout', 'mobile_shape', 'show_labels', 'bar_color', 'active_color'];
                const numericValue = stringValueKeys.includes(key)
                    ? value
                    : Math.max(0, Number(value) || 0);
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    const section = bar === 'top'
                        ? (settings.top_bar || (settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)))
                        : (settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) }));
                    if (!section.style_settings) section.style_settings = {};
                    if (!section.style_settings[style]) section.style_settings[style] = {};
                    section.style_settings[style][key] = numericValue;
                }, true, 'full_sync');
            },

            handleNavCopyStyle: (bar: 'top' | 'bottom', style: string) => {
                if (!confirm('سيتم نسخ إعدادات هذا الشكل إلى بقية الأشكال. هل تريد المتابعة؟')) return;
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    const section = bar === 'top'
                        ? (settings.top_bar || (settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)))
                        : (settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) }));
                    const source = section.style_settings?.[style] || {};
                    if (!section.style_settings) section.style_settings = {};
                    ['solid', 'glass', 'floating', 'neon', 'minimal', 'island'].forEach(targetStyle => {
                        section.style_settings[targetStyle] = { ...source };
                    });
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تم نسخ إعدادات الشكل إلى جميع الأشكال ✅');
            },

            handleNavResetStyle: (bar: 'top' | 'bottom', style: string) => {
                if (!confirm('سيتم إعادة ضبط إعدادات هذا الشكل فقط. هل تريد المتابعة؟')) return;
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    const section = bar === 'top' ? settings.top_bar : settings.bottom_bar;
                    if (section?.style_settings?.[style]) {
                        delete section.style_settings[style];
                    }
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تمت إعادة ضبط الشكل الحالي فقط 🔄');
            },

            handleNavMobilePreset: (style: string, preset: 'balanced' | 'minimal' | 'focus') => {
                const presets = {
                    balanced: { mobile_shape: 'classic', mobile_width: 100, mobile_height: 66, mobile_bottom: 0, item_radius: 14, icon_size: 1.15, item_gap: 8, show_labels: true },
                    minimal: { mobile_shape: 'pill', mobile_width: 92, mobile_height: 58, mobile_bottom: 12, item_radius: 999, icon_size: 1.05, item_gap: 5, show_labels: false },
                    focus: { mobile_shape: 'center', mobile_width: 96, mobile_height: 72, mobile_bottom: 8, item_radius: 18, icon_size: 1.3, item_gap: 10, show_labels: true }
                } as const;
                const selected = presets[preset];
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    const bottom = settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
                    if (!bottom.style_settings) bottom.style_settings = {};
                    bottom.style_settings[style] = { ...(bottom.style_settings[style] || {}), ...selected };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تطبيق قالب الهاتف: ${preset === 'balanced' ? 'متوازن' : preset === 'minimal' ? 'خفيف' : 'تركيز'} ✅`);
            },

            handleNavDesktopPreset: (style: string, preset: 'dock' | 'wide' | 'compact') => {
                const presets = {
                    dock: { desktop_layout: 'dock', desktop_width: 560, desktop_height: 64, desktop_bottom: 22, radius: 999, item_radius: 999, icon_size: 1.2, item_gap: 8, show_labels: true },
                    wide: { desktop_layout: 'wide', desktop_width: 920, desktop_height: 70, desktop_bottom: 18, radius: 22, item_radius: 16, icon_size: 1.15, item_gap: 12, show_labels: true },
                    compact: { desktop_layout: 'compact', desktop_width: 440, desktop_height: 56, desktop_bottom: 14, radius: 18, item_radius: 12, icon_size: 1.05, item_gap: 5, show_labels: false }
                } as const;
                const selected = presets[preset];
                studioState.updateConfig(cfg => {
                    const settings: any = (cfg as any).navigation_settings || ((cfg as any).navigation_settings = {});
                    const bottom = settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
                    if (!bottom.style_settings) bottom.style_settings = {};
                    bottom.style_settings[style] = { ...(bottom.style_settings[style] || {}), ...selected };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تطبيق قالب الكمبيوتر: ${preset === 'dock' ? 'Dock أنيق' : preset === 'wide' ? 'عريض' : 'مضغوط'} ✅`);
            },

            handleNavPreset: (presetKey: string) => {
                const preset = NAVIGATION_PRESETS[presetKey] || NAVIGATION_PRESETS.default;
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    (cfg as any).navigation_settings.bottom_bar = {
                        items: normalizeBottomNavItems(preset)
                    };
                    (cfg as any).navigation_settings.top_bar = normalizeTopBarSettings((cfg as any).navigation_settings.top_bar || DEFAULT_TOP_BAR_SETTINGS);
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تطبيق قالب ${presetKey === 'default' ? 'الافتراضي' : presetKey === 'minimal' ? 'المبسط' : presetKey === 'market' ? 'التجاري' : presetKey === 'luxury' ? 'الفاخر' : presetKey === 'premium' ? 'المميز' : presetKey === 'wellness' ? 'الصحي' : 'مخصص'} ✅`);
            },

            handleNavResetBottomBar: () => {
                if (!confirm('هل تريد إعادة ضبط الشريط السفلي للإعدادات الافتراضية؟')) return;
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    (cfg as any).navigation_settings.bottom_bar = {
                        items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS)
                    };
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تمت إعادة ضبط الشريط السفلي 🔄');
            },

            applySectionPreset: (presetId: string) => {
                const presets: Record<string, any[]> = {
                    balanced: [
                        { id: 'block_hero_1', type: 'hero', title: 'أهلاً بكم في متجرنا', subtitle: 'تسوق أحدث المنتجات بأفضل الأسعار', style: 'classic', visible: true, order: 1, settings: { cta_text: 'تصفح المنتجات', cta_link: '#products', alignment: 'center' } },
                        { id: 'block_cat_1', type: 'categories', title: 'التصنيفات المميزة', style: 'bubbles', visible: true, order: 2, settings: { layout: 'horizontal' } },
                        { id: 'block_prod_1', type: 'products', title: 'أحدث المنتجات والعروض', style: 'classic_grid', visible: true, order: 3, settings: { limit: 12 } }
                    ],
                    catalog: [
                        { id: 'block_cat_1', type: 'categories', title: 'استكشف التصنيفات', style: 'chips_slider', visible: true, order: 1, settings: { layout: 'horizontal' } },
                        { id: 'block_prod_1', type: 'products', title: 'المتجر', style: 'flat_grid', visible: true, order: 2, settings: { limit: 18 } },
                        { id: 'block_banner_1', type: 'banner', title: 'عرض خاص', subtitle: 'خصومات تصل إلى 50%', style: 'classic', visible: true, order: 3, settings: { banner_height: 180 } }
                    ],
                    luxury: [
                        { id: 'block_hero_1', type: 'hero', title: 'تجربة شراء فاخرة', subtitle: 'منتجات مختارة بعناية', style: 'luxury', visible: true, order: 1, settings: { cta_text: 'استعرض المجموعة', cta_link: '#products', alignment: 'center' } },
                        { id: 'block_banner_1', type: 'banner', title: 'تسوق بضغطة واحدة', subtitle: 'التوصيل السريع وضمان الجودة', style: 'minimal', visible: true, order: 2, settings: { banner_height: 160 } },
                        { id: 'block_prod_1', type: 'products', title: 'إبداعاتنا المميزة', style: 'glass', visible: true, order: 3, settings: { limit: 10 } }
                    ],
                    promo: [
                        { id: 'block_banner_1', type: 'banner', title: 'العروض الحالية', subtitle: 'خصومات قوية هذا الأسبوع', style: 'classic', visible: true, order: 1, settings: { banner_height: 190 } },
                        { id: 'block_prod_1', type: 'products', title: 'أكثر المنتجات طلباً', style: 'classic_grid', visible: true, order: 2, settings: { limit: 14 } },
                        { id: 'block_cat_1', type: 'categories', title: 'تصفح حسب الفئة', style: 'bubbles', visible: true, order: 3, settings: { layout: 'horizontal' } }
                    ]
                };
                const chosen = presets[presetId] || presets.balanced;
                studioState.updateConfig(cfg => {
                    cfg.layout_blocks = JSON.parse(JSON.stringify(chosen));
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show(`تم تطبيق الهيكل ${presetId === 'balanced' ? 'المتوازن' : presetId === 'catalog' ? 'الكتالوج' : presetId === 'luxury' ? 'الفاخر' : 'الترويجي'} ✅`);
            },

            handleNavSmartProtect: () => {
                studioState.updateConfig(cfg => {
                    if (!(cfg as any).navigation_settings) (cfg as any).navigation_settings = {};
                    if (!(cfg as any).navigation_settings.bottom_bar) (cfg as any).navigation_settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) };
                    const items: any[] = (cfg as any).navigation_settings.bottom_bar.items;
                    const protectedIds = new Set(['home', 'cart']);
                    if (!items.length) {
                        (cfg as any).navigation_settings.bottom_bar.items = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
                        return;
                    }
                    items.forEach((item: any) => {
                        if (protectedIds.has(item.id)) item.visible = true;
                    });
                    const visible = items.filter((item: any) => item.visible);
                    if (visible.length < 2) {
                        items.forEach((item: any) => { if (item.id === 'home' || item.id === 'cart') item.visible = true; });
                    }
                    items.forEach((item: any, index: number) => { item.order = index + 1; });
                }, true, 'full_sync');
                StudioApp.refreshActiveTab(true);
                Toast.show('تمت حماية العناصر الأساسية في الشريط السفلي 🛡️');
            },
        };
    }
}

// Boot Studio on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StudioApp.init());
} else {
    StudioApp.init();
}
