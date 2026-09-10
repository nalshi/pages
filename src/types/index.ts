/**
 * ========================================================
 * 🏷️ Nalsh Storefront & Engine TypeScript Domain Types
 * تعريفات الأنواع الشاملة للمتجر والمنتجات والسلة والطلبات
 * ========================================================
 */

// === 1. Store Identity & Configuration ===
export type ThemeMode = 'light' | 'dark' | 'auto';
export type CardOrientation = 'portrait' | 'landscape';
export type ScrollDirection = 'horizontal' | 'vertical';
export type ButtonStyle = 'rounded' | 'pill' | 'flat' | 'square';
export type CardStyle = 'elevated' | 'bordered' | 'flat' | 'glass' | 'classic';
export type CardHoverEffect = 'lift' | 'glow' | 'zoom' | 'scale' | 'none';

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  bg_color?: string;
  text_color?: string;
  link?: string;
}

export interface StoreIdentity {
  store_id?: string;
  store_name: string;
  slogan?: string;
  welcome_message?: string;
  logo_url?: string;
  banner_url?: string;
  currency_symbol: string;
  phone?: string;
  whatsapp?: string;
  announcement_bar?: AnnouncementBarConfig;
}

export interface DeviceLayoutSettings {
  scroll_direction: ScrollDirection;
  grid_columns: number;
  grid_rows?: number;
  slider_rows?: number;
  card_orientation: CardOrientation;
  card_custom_width: number;
  card_custom_height: number;
  img_custom_height: number;
  card_density?: 'compact' | 'standard' | 'spacious';
  show_badges?: boolean;
  show_quick_add?: boolean;
  show_rating?: boolean;
  show_old_price?: boolean;
  show_currency?: boolean;
}

export interface ProductsSettings {
  display_mode: 'by_categories_sections' | 'all_grid' | 'masonry' | 'carousel';
  sort_by: 'latest' | 'price_asc' | 'price_desc' | 'popular';
  out_of_stock_display: 'badge_at_end' | 'hide' | 'dimmed';
  show_quick_add: boolean;
  show_stock_badge: boolean;
  show_discount_badge: boolean;
  show_category_tag: boolean;
  show_old_price: boolean;
  show_currency: boolean;
  show_actions: boolean;
  portrait: DeviceLayoutSettings;
  landscape: DeviceLayoutSettings;
  category_overrides?: Record<string, Partial<DeviceLayoutSettings>>;
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
  search_placeholder: string;
  empty_cart_title: string;
  empty_cart_desc: string;
  order_success_title: string;
  order_success_msg: string;
  order_track_whatsapp: string;
  chatbot_greeting: string;
  ai_assistant?: AssistantConfig;
  copied_link_msg: string;
}

export interface ThemeColors {
  primary: string;
  primary_hover?: string;
  primary_gradient_start?: string;
  primary_gradient_end?: string;
  accent: string;
  bg_body: string;
  bg_card: string;
  bg_surface: string;
  text_main: string;
  text_muted: string;
  border: string;
  navbar_bg?: string;
  navbar_text?: string;
  header_bg?: string;
  header_text?: string;
  bottom_bar_bg?: string;
  bottom_bar_active?: string;
  bottom_bar_inactive?: string;
  bottom_nav_bg?: string;
  bottom_nav_active?: string;
  bottom_nav_inactive?: string;
  card_bg?: string;
  card_border?: string;
  card_title?: string;
  price_color?: string;
  old_price_color?: string;
  badge_bg?: string;
  badge_text?: string;
  discount_badge_bg?: string;
  discount_badge_text?: string;
  section_title?: string;
  category_chip_bg?: string;
  category_chip_active?: string;
  category_chip_active_bg?: string;
  category_chip_text?: string;
  search_bg?: string;
  search_text?: string;
  modal_bg?: string;
  modal_overlay?: string;
  modal_handle?: string;
  btn_primary_bg?: string;
  btn_primary_text?: string;
  button_primary_bg?: string;
  chatbot_btn_bg?: string;
  toast_bg?: string;
  toast_text?: string;
  [key: string]: any;
}

export interface ThemeTypography {
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
  };
}

export interface ThemeShapes {
  card_radius: string;
  button_radius: string;
  button_style: ButtonStyle;
  card_style: CardStyle;
  navbar_style?: string;
  section_spacing?: string;
}

export interface LayoutBlock {
  id: string;
  type: 'hero' | 'categories' | 'products' | 'features' | 'banner' | 'custom_html';
  title?: string;
  subtitle?: string;
  style?: string;
  visible: boolean;
  order: number;
  settings?: Record<string, any>;
}

export interface StorefrontConfig {
  version: string;
  theme_name: string;
  default_theme_mode: ThemeMode;
  store_identity: StoreIdentity;
  products_settings: ProductsSettings;
  messages: StoreMessages;
  layout_blocks: LayoutBlock[];
  light_theme: { colors: ThemeColors };
  dark_theme: { colors: ThemeColors };
  typography: ThemeTypography;
  shapes: ThemeShapes;
  navigation_settings?: {
    top_bar?: { navbar_style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island'; [key: string]: any };
    bottom_bar?: { style?: 'solid' | 'glass' | 'floating' | 'neon' | 'minimal' | 'island'; [key: string]: any };
  };
  animations?: { card_hover: CardHoverEffect };
  marketing?: {
    free_shipping_bar?: { enabled: boolean; message: string; min_amount?: number };
    whatsapp_floating?: { enabled: boolean; phone: string; position?: 'left' | 'right' };
  };
  modals_customization?: Record<string, any>;
}

// === 2. Products & Categories ===
export interface ProductVariation {
  id: string | number;
  name: string;
  price: number;
  old_price?: number;
  sku?: string;
  stock?: number;
  image?: string;
  options?: Record<string, string>;
}

export interface Product {
  id: string | number;
  name: string;
  name_ar?: string;
  name_en?: string;
  category: string;
  category_id?: string | number;
  price: number;
  old_price?: number;
  description?: string;
  image?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  badge?: string;
  is_featured?: boolean;
  variations?: ProductVariation[];
  created_at?: string;
}

export interface Category {
  id: string | number;
  name: string;
  icon?: string;
  image?: string;
  count?: number;
  parent_id?: string | number | null;
  children?: Category[];
}

// === 3. Cart & Orders ===
export interface CartItem {
  id: string | number;
  product_id: string | number;
  name: string;
  price: number;
  old_price?: number;
  quantity: number;
  image?: string;
  selected_variation?: ProductVariation | null;
  selected_options?: Record<string, string>;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  coupon_code?: string;
  discount_amount: number;
  delivery_fee: number;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  neighborhood?: string;
  notes?: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  whatsapp?: string;
  notes?: string;
}

export interface Order {
  id: string | number;
  order_number: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  currency: string;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  delivery_location?: DeliveryLocation;
  delivery_code?: string;
  created_at: string;
}

// === 4. User Session & Auth ===
export interface UserSession {
  loggedIn: boolean;
  user_id?: string | number;
  phone?: string;
  full_name?: string;
  token?: string;
  created_at?: string;
}

// === 5. AI Assistant ===
export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  products?: Product[];
  timestamp: number;
}

export interface AIAssistantConfig {
  enabled: boolean;
  assistant_name: string;
  welcome_greeting: string;
  system_instructions?: string;
  suggested_queries: string[];
}
