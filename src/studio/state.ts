/**
 * ========================================================
 * 🧠 Studio State Manager (Reactive Singleton)
 * ========================================================
 */

import { StorefrontConfig, ActiveTabKey, DeviceMode } from './types';
import { DEFAULT_STOREFRONT_CONFIG, sanitizeStorefrontConfig } from '../config/storefrontConfigSchema';
import { WORKER_API_URL } from '../core/ApiClient';

export type StateChangeType = 'tab' | 'device' | 'dark_mode' | 'mobile_view' | 'history' | 'full_sync' | 'live_update';
type Listener = (config: StorefrontConfig, activeTab: ActiveTabKey, changeType: StateChangeType) => void;

export class StudioState {
    private static instance: StudioState;
    public config: StorefrontConfig;
    public activeTab: ActiveTabKey = 'identity';
    public activeProductSubTab: 'portrait' | 'landscape' | 'categories' = 'portrait';
    public currentDevice: DeviceMode = 'mobile';
    public isDarkPreview: boolean = false;
    public selectedCategoryForOverride: string = '';
    
    // 🔐 بيانات وهوية التاجر المعتمد
    public merchantToken: string = '';
    public merchantUsername: string = 'store';
    public merchantStoreName: string = '';
    public merchantUserId: number = 0;
    public merchantPlanType: string = 'free';
    public isCloudSynced: boolean = false;
    public isGuestMode: boolean = false;

    public mobileView: 'controls' | 'preview' = 'controls';
    public storeBaseConfig: StorefrontConfig | null = null;

    private historyStack: string[] = [];
    private historyIndex: number = -1;
    private listeners: Listener[] = [];
    private debounceHistoryTimer: any = null;
    private liveUpdateScheduled: boolean = false;

    private constructor() {
        this.config = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG));
    }

    public static getInstance(): StudioState {
        if (!StudioState.instance) {
            StudioState.instance = new StudioState();
        }
        return StudioState.instance;
    }

    public init(): void {
        this.extractMerchantAuth();
        this.loadInitialConfig();
        this.pushHistory();
    }

    /**
     * التحقق من جلسة التاجر واستخراج هويته مع دعم الوضع التجريبي
     */
    private extractMerchantAuth(): void {
        const token = localStorage.getItem('merchant_token') || sessionStorage.getItem('merchant_token');
        if (!token) {
            this.isGuestMode = true;
            this.merchantUsername = 'demo_store';
            this.merchantStoreName = 'متجر تجريبي';
            this.merchantPlanType = 'premium';
            return;
        }

        this.merchantToken = token;

        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                if (payload.exp && Date.now() >= payload.exp * 1000) {
                    localStorage.removeItem('merchant_token');
                    sessionStorage.removeItem('merchant_token');
                    this.isGuestMode = true;
                    this.merchantUsername = 'demo_store';
                    this.merchantStoreName = 'متجر تجريبي (جلسة منتهية)';
                    return;
                }
                if (payload.role !== 'merchant') {
                    this.isGuestMode = true;
                    this.merchantUsername = 'demo_store';
                    this.merchantStoreName = 'متجر تجريبي';
                    return;
                }

                this.merchantUsername = payload.username || 'store';
                this.merchantStoreName = payload.store_name || payload.username || 'متجري';
                this.merchantUserId = Number(payload.user_id || payload.id || 0);
                this.merchantPlanType = payload.plan_type || 'free';
            }
        } catch (e) {
            console.error('Error decoding merchant token:', e);
            this.isGuestMode = true;
        }
    }



    public subscribe(fn: Listener): () => void {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    public notify(changeType: StateChangeType = 'live_update'): void {
        this.listeners.forEach(fn => fn(this.config, this.activeTab, changeType));
    }

    public setActiveTab(tab: ActiveTabKey): void {
        this.activeTab = tab;
        if (tab === 'light_colors') {
            this.setPreviewDarkMode(false);
        } else if (tab === 'dark_colors') {
            this.setPreviewDarkMode(true);
        }
        this.notify('tab');
    }

    public setProductSubTab(subTab: 'portrait' | 'landscape' | 'categories'): void {
        this.activeProductSubTab = subTab;
        // 🌟 Crucial requirement: Auto-switch preview device when modifying computer/mobile layout!
        if (subTab === 'landscape') {
            this.setDevice('desktop');
        } else if (subTab === 'portrait') {
            this.setDevice('mobile');
        } else {
            this.notify('full_sync');
        }
    }

    public setDevice(device: DeviceMode): void {
        this.currentDevice = device;
        // Synchronize product subtab if currently on products tab
        if (this.activeTab === 'products_layout') {
            if (device === 'mobile' && this.activeProductSubTab !== 'portrait' && this.activeProductSubTab !== 'categories') {
                this.activeProductSubTab = 'portrait';
            } else if ((device === 'desktop' || device === 'tablet') && this.activeProductSubTab !== 'landscape' && this.activeProductSubTab !== 'categories') {
                this.activeProductSubTab = 'landscape';
            }
        }
        this.notify('device');
    }

    public setMobileView(view: 'controls' | 'preview'): void {
        this.mobileView = view;
        this.notify('mobile_view');
    }

    public setPreviewDarkMode(isDark: boolean): void {
        this.isDarkPreview = isDark;
        this.syncIframeTheme(isDark);
        this.sendLiveUpdateToPreview();
        this.notify('dark_mode');
    }

    public togglePreviewDarkMode(): void {
        this.setPreviewDarkMode(!this.isDarkPreview);
    }

    public pushHistory(): void {
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
        }
        this.historyStack.push(JSON.stringify(this.config));
        if (this.historyStack.length > 40) this.historyStack.shift();
        this.historyIndex = this.historyStack.length - 1;
    }

    public canUndo(): boolean {
        return this.historyIndex > 0;
    }

    public canRedo(): boolean {
        return this.historyIndex < this.historyStack.length - 1;
    }

    public undo(): boolean {
        if (this.canUndo()) {
            this.historyIndex--;
            this.config = JSON.parse(this.historyStack[this.historyIndex]);
            this.sendLiveUpdateToPreview();
            this.notify('history');
            return true;
        }
        return false;
    }

    public redo(): boolean {
        if (this.canRedo()) {
            this.historyIndex++;
            this.config = JSON.parse(this.historyStack[this.historyIndex]);
            this.sendLiveUpdateToPreview();
            this.notify('history');
            return true;
        }
        return false;
    }

    public updateConfig(
        mutator: (cfg: StorefrontConfig) => void, 
        saveHistory = true, 
        changeType: StateChangeType = 'live_update'
    ): void {
        if (saveHistory) {
            if (changeType === 'live_update') {
                if (!this.debounceHistoryTimer) {
                    this.pushHistory();
                }
                if (this.debounceHistoryTimer) clearTimeout(this.debounceHistoryTimer);
                this.debounceHistoryTimer = setTimeout(() => {
                    this.pushHistory();
                    this.debounceHistoryTimer = null;
                }, 600);
            } else {
                this.pushHistory();
            }
        }
        mutator(this.config);
        this.sendLiveUpdateToPreview();
        this.notify(changeType);
    }

    public resetToDefaults(): void {
        this.pushHistory();
        this.config = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG));
        try {
            localStorage.removeItem(`nalsh_storefront_config_${this.merchantUsername}`);
        } catch (e) {}
        this.sendLiveUpdateToPreview();
        this.notify('full_sync');
    }

    public sendLiveUpdateToPreview(): void {
        if (this.liveUpdateScheduled) return;
        this.liveUpdateScheduled = true;

        requestAnimationFrame(() => {
            this.liveUpdateScheduled = false;
            const iframe = document.getElementById('store-preview-frame') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'NALSH_CONFIG_UPDATE',
                    config: this.config,
                    payload: this.config,
                    _preview_dark: this.isDarkPreview
                }, '*');

                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        iframeDoc.documentElement.classList.toggle('dark-mode', this.isDarkPreview);
                        if (iframeDoc.body) iframeDoc.body.classList.toggle('dark-mode', this.isDarkPreview);
                    }
                } catch (e) {}
            }
        });
    }

    /**
     * تحقن CSS مباشرة في الـ iframe لتغيير أبعاد الكروت بدون أي لاغ.
     * يُستخدم عند تحريك الـ sliders فقط — الحفظ في الـ state يتم بـ debounce.
     */
    public applyDimensionsDirectlyToCSS(orientKey: 'portrait' | 'landscape', dims: Record<string, number>): void {
        const iframe = document.getElementById('store-preview-frame') as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return;

        let styleTag = iframe.contentDocument.getElementById('studio-live-dims-css') as HTMLStyleElement;
        if (!styleTag) {
            styleTag = iframe.contentDocument.createElement('style') as HTMLStyleElement;
            styleTag.id = 'studio-live-dims-css';
            iframe.contentDocument.head.appendChild(styleTag);
        }

        // اقرأ القيم الحالية من الـ config أولاً، ثم طبّق التعديل الجديد
        const ps = this.config.products_settings || {};
        const port = ps.portrait || {} as any;
        const land = ps.landscape || {} as any;

        // دمج التعديل الجديد مع القيم الحالية
        const portDims = orientKey === 'portrait' ? { ...port, ...dims } : port;
        const landDims = orientKey === 'landscape' ? { ...land, ...dims } : land;

        const pCols = Number(portDims.grid_columns || 2);
        const lCols = Number(landDims.grid_columns || 4);

        styleTag.textContent = `
            @media (max-width: 767px) {
                .product-grid, .ultra-product-grid, .store-premium-grid {
                    grid-template-columns: repeat(${pCols}, minmax(0, 1fr)) !important;
                }
                ${Number(portDims.card_custom_width) > 0 ? `
                .horizontal-scroller .product-card-compact, .horizontal-scroller .fast-card {
                    flex: 0 0 ${portDims.card_custom_width}px !important;
                    width: ${portDims.card_custom_width}px !important;
                    min-width: ${portDims.card_custom_width}px !important;
                }` : ''}
                ${Number(portDims.card_custom_height) > 0 ? `
                .product-card-compact, .fast-card {
                    height: ${portDims.card_custom_height}px !important;
                    min-height: ${portDims.card_custom_height}px !important;
                }` : ''}
                ${Number(portDims.img_custom_height) > 0 ? `
                .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-wrap, .ct-glass-img-wrap, .ct-mag-img {
                    height: ${portDims.img_custom_height}px !important;
                    aspect-ratio: auto !important;
                    padding-top: 0 !important;
                }` : ''}
            }
            @media (min-width: 768px) {
                .product-grid, .ultra-product-grid, .store-premium-grid {
                    grid-template-columns: repeat(${lCols}, minmax(0, 1fr)) !important;
                }
                ${Number(landDims.card_custom_width) > 0 ? `
                .horizontal-scroller .product-card-compact, .horizontal-scroller .fast-card {
                    flex: 0 0 ${landDims.card_custom_width}px !important;
                    width: ${landDims.card_custom_width}px !important;
                    min-width: ${landDims.card_custom_width}px !important;
                }` : ''}
                ${Number(landDims.card_custom_height) > 0 ? `
                .product-card-compact, .fast-card {
                    height: ${landDims.card_custom_height}px !important;
                    min-height: ${landDims.card_custom_height}px !important;
                }` : ''}
                ${Number(landDims.img_custom_height) > 0 ? `
                .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-wrap, .ct-glass-img-wrap, .ct-mag-img {
                    height: ${landDims.img_custom_height}px !important;
                    aspect-ratio: auto !important;
                    padding-top: 0 !important;
                }` : ''}
            }
        `;
    }

    public syncIframeTheme(isDark: boolean): void {
        const iframe = document.getElementById('store-preview-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage({
                    type: 'NALSH_TOGGLE_DARK_MODE',
                    darkMode: isDark,
                    payload: { darkMode: isDark }
                }, '*');
                const iframeDoc = iframe.contentWindow.document;
                iframeDoc.documentElement.classList.toggle('dark-mode', isDark);
                iframeDoc.body?.classList.toggle('dark-mode', isDark);
                iframe.contentWindow.localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
                if ((iframe.contentWindow as any).StorefrontEngine) {
                    (iframe.contentWindow as any).StorefrontEngine.reapplyActiveMode();
                }
            } catch (e) {}
        }
    }

    private async loadInitialConfig(): Promise<void> {
        let hasLocalDraft = false;
        try {
            const saved = localStorage.getItem(`nalsh_storefront_config_${this.merchantUsername}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    const { sanitizedConfig } = sanitizeStorefrontConfig(parsed, this.merchantPlanType);
                    this.config = sanitizedConfig;
                    this.storeBaseConfig = sanitizedConfig;
                    hasLocalDraft = true;
                }
            }
        } catch (e) {}

        // كل تاجر يقرأ إعداداته المنشورة من مجلده المعزول.
        if (!hasLocalDraft) {
            try {
                const assetUrl = `${WORKER_API_URL}stores/${encodeURIComponent(this.merchantUsername)}/storefront_config.json`;
                const res = await fetch(`${assetUrl}?v=${Date.now()}`, { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && typeof json === 'object') {
                        const { sanitizedConfig } = sanitizeStorefrontConfig(json, this.merchantPlanType);
                        this.config = sanitizedConfig;
                        this.storeBaseConfig = sanitizedConfig;
                        this.sendLiveUpdateToPreview();
                        this.notify('full_sync');
                    }
                }
            } catch (err) {
                console.warn(`[Studio] تعذر تحميل إعدادات المتجر ${this.merchantUsername} من مساره المنشور.`, err);
            }
        }
    }

    public async buildPublishConfig(): Promise<StorefrontConfig> {
            let baseConfig = this.storeBaseConfig || this.config;
            try {
                const assetUrl = `${WORKER_API_URL}stores/${encodeURIComponent(this.merchantUsername)}/storefront_config.json`;
                const response = await fetch(`${assetUrl}?v=${Date.now()}`, { cache: 'no-store' });
                if (response.ok) {
                    const remoteConfig = await response.json();
                    if (remoteConfig && typeof remoteConfig === 'object') {
                        baseConfig = remoteConfig as StorefrontConfig;
                    }
                }
            } catch (error) {
                console.warn('[Studio] تعذر تحديث إعدادات المتجر قبل النشر، سيتم استخدام آخر نسخة متاحة.', error);
            }

            const designConfig = JSON.parse(JSON.stringify(this.config)) as Record<string, any>;
            const result = JSON.parse(JSON.stringify(baseConfig || {})) as Record<string, any>;
            this.mergeConfig(result, designConfig);

            const base = baseConfig as any;
            if (base?.store_identity !== undefined
                && JSON.stringify(designConfig.store_identity || {}) === JSON.stringify(base.store_identity)) {
                result.store_identity = JSON.parse(JSON.stringify(base.store_identity));
            }
            const designPhone = designConfig.marketing?.whatsapp_floating?.phone;
            if (base?.marketing?.whatsapp_floating?.phone !== undefined
                && (!designPhone || designPhone === base.marketing.whatsapp_floating.phone)) {
                result.marketing = result.marketing || {};
                result.marketing.whatsapp_floating = result.marketing.whatsapp_floating || {};
                result.marketing.whatsapp_floating.phone = base.marketing.whatsapp_floating.phone;
            }

            const { sanitizedConfig } = sanitizeStorefrontConfig(result, this.merchantPlanType);
            this.storeBaseConfig = sanitizedConfig;
            this.config = sanitizedConfig;
            return sanitizedConfig;
        }

        private mergeConfig(target: Record<string, any>, source: Record<string, any>): void {
            Object.entries(source || {}).forEach(([key, value]) => {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
                    this.mergeConfig(target[key], value);
                } else {
                    target[key] = value;
                }
            });
        }
    }

export const studioState = StudioState.getInstance();
