/**
 * ========================================================
 * 🎨 Nalsh Studio Types & Interfaces
 * ========================================================
 */

export interface ColorScheme {
    primary: string;
    primary_hover?: string;
    primary_gradient_start?: string;
    primary_gradient_end?: string;
    accent?: string;
    bg_body: string;
    bg_card: string;
    bg_surface?: string;
    text_main: string;
    text_muted: string;
    border: string;
    navbar_bg: string;
    navbar_text?: string;
    bottom_bar_bg: string;
    bottom_bar_active: string;
    bottom_bar_inactive?: string;
    card_bg?: string;
    card_border?: string;
    card_title?: string;
    price_color: string;
    old_price_color?: string;
    badge_bg: string;
    badge_text?: string;
    section_title?: string;
    category_chip_bg?: string;
    category_chip_active?: string;
    category_chip_text?: string;
    modal_bg?: string;
    modal_overlay?: string;
    modal_handle?: string;
    btn_primary_bg: string;
    btn_primary_text?: string;
    chatbot_btn_bg?: string;
    toast_bg?: string;
    toast_text?: string;
    [key: string]: string | undefined;
}

export interface OrientationSettings {
    scroll_direction?: 'horizontal' | 'vertical';
    grid_columns?: number;
    grid_rows?: number;
    items_per_row?: number;
    slider_rows?: number;
    card_orientation?: 'portrait' | 'landscape';
    card_style?: 'classic' | 'minimal' | 'bold' | 'landscape_row' | 'magazine' | 'glass' | string;
    card_custom_width?: number;
    card_custom_height?: number;
    img_custom_height?: number;
    card_density?: 'standard' | 'compact' | 'relaxed';
    show_badges?: boolean;
    show_quick_add?: boolean;
    show_rating?: boolean;
    show_old_price?: boolean;
    show_currency?: boolean;
    [key: string]: any;
}

export interface CategoryOverride extends OrientationSettings {
    enabled?: boolean;
}

export interface AddToCartButtonSettings {
    style?: 'circle_icon' | 'pill_text' | 'rounded_box' | 'full_bottom' | 'outlined' | 'gradient_glow' | 'floating_action' | string;
    text?: string;
    show_text?: boolean;
    icon?: string;
    action_animation?: 'scale' | 'bounce' | 'ripple' | 'glow' | 'none';
    custom_color?: string;
    custom_text_color?: string;
}

export interface ProductsSettings {
    display_mode?: 'tabs_by_category' | 'by_categories_sections' | 'all_flat_grid' | 'featured_first';
    sort_by?: 'latest' | 'price_low' | 'price_high' | 'discount';
    out_of_stock_display?: 'badge_at_end' | 'hide' | 'normal';
    show_quick_add?: boolean;
    show_stock_badge?: boolean;
    show_discount_badge?: boolean;
    show_category_tag?: boolean;
    show_old_price?: boolean;
    show_currency?: boolean;
    show_actions?: boolean;
    add_to_cart_btn?: AddToCartButtonSettings;
    portrait: OrientationSettings;
    landscape: OrientationSettings;
    category_overrides: Record<string, CategoryOverride>;
    [key: string]: any;
}

export interface StoreIdentity {
    store_name: string;
    slogan: string;
    welcome_message: string;
    currency_symbol: string;
    announcement_bar?: {
        enabled: boolean;
        text: string;
        bg_color: string;
        text_color: string;
    };
    [key: string]: any;
}

export interface AssistantConfig {
    enabled?: boolean;
    name?: string;
    persona?: 'classic' | 'premium' | 'futuristic' | 'friendly' | 'luxury' | 'fashion' | 'tech' | 'wellness' | 'beauty';
    avatar_icon?: string;
    avatar_emoji?: string;
    button_style?: 'pill' | 'bubble' | 'minimal';
    avatar_style?: 'pulse' | 'orb' | 'halo' | 'hover';
    position?: 'bottom-right' | 'bottom-left';
    enable_quick_actions?: boolean;
    smart_contextual_actions?: boolean;
    smart_contextual_replies?: boolean;
    behavior_mode?: 'support' | 'sales' | 'advisor' | 'concierge';
    conversation_style?: 'short' | 'balanced' | 'detailed';
    quick_actions?: string[];
    response_style?: 'friendly' | 'sales' | 'luxury' | 'professional';
    accent_color?: string;
    status_text?: string;
    [key: string]: any;
}

export interface StoreMessages {
    search_placeholder?: string;
    empty_cart_title?: string;
    empty_cart_desc?: string;
    order_success_title?: string;
    order_success_msg?: string;
    order_track_whatsapp?: string;
    chatbot_greeting?: string;
    ai_assistant?: AssistantConfig;
    copied_link_msg?: string;
    add_to_cart_success?: string;
    out_of_stock_msg?: string;
    cart_empty_msg?: string;
    checkout_btn_label?: string;
    delivery_code_hint?: string;
    no_search_results?: string;
    filter_all_categories?: string;
    [key: string]: any;
}

export interface LayoutBlock {
    id: string;
    type: 'hero' | 'categories' | 'products' | 'features' | 'banner' | string;
    title: string;
    subtitle?: string;
    style?: string;
    visible: boolean;
    order: number;
    settings?: Record<string, any>;
}

export interface TypographySettings {
    font_family: string;
    base_size?: string;
    base_size_mobile?: string;
    base_size_desktop?: string;
    heading_weight?: string;
    heading_size_mobile?: string;
    heading_size_desktop?: string;
    price_size_mobile?: string;
    price_size_desktop?: string;
    headings?: {
        price_size?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface ShapesSettings {
    card_radius?: string;
    button_radius?: string;
    button_style?: 'rounded' | 'pill' | 'square';
    card_style?: 'elevated' | 'bordered' | 'flat';
    navbar_style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island';
    section_spacing?: 'compact' | 'normal' | 'relaxed';
    [key: string]: any;
}

export interface MarketingSettings {
    free_shipping_bar?: {
        enabled: boolean;
        message: string;
    };
    whatsapp_floating?: {
        enabled: boolean;
        phone: string;
        position: 'left' | 'right';
    };
    [key: string]: any;
}

export interface NavBarItem {
    id: string;
    label: string;
    icon: string;
    visible: boolean;
    order: number;
}

export interface TopBarSettings {
    show_logo_icon: boolean;
    logo_icon: string;
    show_dark_mode_btn: boolean;
    show_profile_btn: boolean;
    show_search_btn: boolean;
    navbar_style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island';
}

export interface NavigationSettings {
    bottom_bar: {
        items: NavBarItem[];
        style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island';
    };
    top_bar: TopBarSettings;
}

export interface StorefrontConfig {
    version: string;
    theme_name: string;
    default_theme_mode: 'light' | 'dark' | 'auto';
    store_identity: StoreIdentity;
    products_settings: ProductsSettings;
    messages?: StoreMessages;
    store_messages?: StoreMessages;
    layout_blocks: LayoutBlock[];
    modals_customization?: Record<string, any>;
    light_theme: { colors: ColorScheme };
    dark_theme: { colors: ColorScheme };
    typography: TypographySettings;
    shapes: ShapesSettings;
    navigation_settings?: NavigationSettings;
    animations?: {
        card_hover?: string;
        [key: string]: any;
    };
    style_library?: {
        current?: string;
        [key: string]: any;
    };
    marketing?: MarketingSettings;
    [key: string]: any;
}

export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    category?: string;
    light_theme: { colors: Partial<ColorScheme> };
    dark_theme: { colors: Partial<ColorScheme> };
    typography?: Partial<TypographySettings>;
    shapes?: Partial<ShapesSettings>;
}

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
export type ActiveTabKey = 
    | 'identity'
    | 'products_layout'
    | 'messages'
    | 'sections'
    | 'modals'
    | 'light_colors'
    | 'dark_colors'
    | 'ai_palette'
    | 'typography'
    | 'navigation'
    | 'marketing'
    | 'presets'
    | 'json';
