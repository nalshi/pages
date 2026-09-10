export interface StudioNavItem {
    id: string;
    label: string;
    icon: string;
    visible: boolean;
    order: number;
}

export interface StudioTopBarSettings {
    show_logo_icon: boolean;
    logo_icon: string;
    show_dark_mode_btn: boolean;
    show_profile_btn: boolean;
    show_search_btn: boolean;
    navbar_style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island';
}

export const DEFAULT_NAV_ITEMS: StudioNavItem[] = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-home', visible: true, order: 1 },
    { id: 'search', label: 'بحث', icon: 'fa-search', visible: true, order: 2 },
    { id: 'orders', label: 'طلباتي', icon: 'fa-box-open', visible: true, order: 3 },
    { id: 'favorites', label: 'المفضلة', icon: 'fa-heart', visible: true, order: 4 },
    { id: 'cart', label: 'السلة', icon: 'fa-shopping-cart', visible: true, order: 5 },
];

export const DEFAULT_TOP_BAR_SETTINGS: StudioTopBarSettings = {
    show_logo_icon: true,
    logo_icon: 'fa-store',
    show_dark_mode_btn: true,
    show_profile_btn: true,
    show_search_btn: true,
};

export const NAVIGATION_PRESETS: Record<string, Pick<StudioNavItem, 'id' | 'label' | 'icon' | 'visible'>[]> = {
    default: DEFAULT_NAV_ITEMS.map(item => ({ ...item })),
    minimal: [
        { id: 'home', label: 'الرئيسية', icon: 'fa-home', visible: true },
        { id: 'search', label: 'بحث', icon: 'fa-search', visible: false },
        { id: 'orders', label: 'طلباتي', icon: 'fa-box-open', visible: true },
        { id: 'favorites', label: 'المفضلة', icon: 'fa-heart', visible: false },
        { id: 'cart', label: 'السلة', icon: 'fa-shopping-cart', visible: true },
    ],
    market: [
        { id: 'home', label: 'الرئيسية', icon: 'fa-house', visible: true },
        { id: 'search', label: 'بحث', icon: 'fa-magnifying-glass', visible: true },
        { id: 'orders', label: 'طلباتي', icon: 'fa-bag-shopping', visible: true },
        { id: 'favorites', label: 'المفضلة', icon: 'fa-heart', visible: true },
        { id: 'cart', label: 'السلة', icon: 'fa-cart-shopping', visible: true },
    ],
    luxury: [
        { id: 'home', label: 'الرئيسية', icon: 'fa-store', visible: true },
        { id: 'search', label: 'استعراض', icon: 'fa-magnifying-glass', visible: true },
        { id: 'orders', label: 'طلباتي', icon: 'fa-box', visible: true },
        { id: 'favorites', label: 'المفضلة', icon: 'fa-star', visible: false },
        { id: 'cart', label: 'السلة', icon: 'fa-shopping-bag', visible: true },
    ],
    premium: [
        { id: 'home', label: 'الرئيسية', icon: 'fa-house-chimney', visible: true },
        { id: 'search', label: 'استكشف', icon: 'fa-compass', visible: true },
        { id: 'orders', label: 'طلباتي', icon: 'fa-bag-shopping', visible: true },
        { id: 'favorites', label: 'المفضلة', icon: 'fa-heart', visible: true },
        { id: 'cart', label: 'السلة', icon: 'fa-cart-arrow-down', visible: true },
    ],
    wellness: [
        { id: 'home', label: 'الرئيسية', icon: 'fa-seedling', visible: true },
        { id: 'search', label: 'تصفح', icon: 'fa-magnifying-glass', visible: true },
        { id: 'orders', label: 'طلبات', icon: 'fa-truck-fast', visible: true },
        { id: 'favorites', label: 'مفضلة', icon: 'fa-sparkles', visible: false },
        { id: 'cart', label: 'السلة', icon: 'fa-basket-shopping', visible: true },
    ],
};

export const NAVIGATION_PRESET_LABELS: Record<string, string> = {
    default: 'افتراضي',
    minimal: 'مبسط',
    market: 'تجاري',
    luxury: 'فاخر',
    premium: 'مميز',
    wellness: 'صحي',
};

export function getNavigationPresetLabel(key: string): string {
    return NAVIGATION_PRESET_LABELS[key] || 'مخصص';
}

export function createPresetNavItems(presetKey: string): StudioNavItem[] {
    const preset = NAVIGATION_PRESETS[presetKey] || NAVIGATION_PRESETS.default;
    return normalizeBottomNavItems(preset.map((item, index) => ({
        ...item,
        order: index + 1,
    })));
}

export function normalizeBottomNavItems(items: Partial<StudioNavItem>[] | undefined): StudioNavItem[] {
    const source = Array.isArray(items) && items.length > 0 ? items : DEFAULT_NAV_ITEMS;
    const normalized = source.map((item, index) => ({
        id: String(item?.id || DEFAULT_NAV_ITEMS[index]?.id || `nav_${index + 1}`),
        label: String(item?.label || DEFAULT_NAV_ITEMS[index]?.label || 'عنصر'),
        icon: String(item?.icon || DEFAULT_NAV_ITEMS[index]?.icon || 'fa-circle'),
        visible: item?.visible !== false,
        order: Number.isFinite(item?.order) ? Number(item.order) : index + 1,
    }));

    const visible = normalized.filter(item => item.visible).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (visible.length >= 2) return normalized.sort((a, b) => (a.order || 0) - (b.order || 0));

    return DEFAULT_NAV_ITEMS.map((item, index) => ({
        ...item,
        visible: index < 2,
        order: index + 1,
    }));
}

export function normalizeTopBarSettings(settings: Partial<StudioTopBarSettings> | undefined): StudioTopBarSettings {
    return {
        ...DEFAULT_TOP_BAR_SETTINGS,
        ...(settings || {}),
    };
}

export const NAVIGATION_STYLE_KEYS = ['solid', 'glass', 'floating', 'neon', 'minimal', 'island'] as const;
