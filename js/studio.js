// src/studio/navigationDefaults.ts
var DEFAULT_NAV_ITEMS = [
  { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-home", visible: true, order: 1 },
  { id: "search", label: "\u0628\u062D\u062B", icon: "fa-search", visible: true, order: 2 },
  { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A\u064A", icon: "fa-box-open", visible: true, order: 3 },
  { id: "favorites", label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", icon: "fa-heart", visible: true, order: 4 },
  { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-shopping-cart", visible: true, order: 5 }
];
var DEFAULT_TOP_BAR_SETTINGS = {
  show_logo_icon: true,
  logo_icon: "fa-store",
  show_dark_mode_btn: true,
  show_profile_btn: true,
  show_search_btn: true
};
var NAVIGATION_PRESETS = {
  default: DEFAULT_NAV_ITEMS.map((item) => ({ ...item })),
  minimal: [
    { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-home", visible: true },
    { id: "search", label: "\u0628\u062D\u062B", icon: "fa-search", visible: false },
    { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A\u064A", icon: "fa-box-open", visible: true },
    { id: "favorites", label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", icon: "fa-heart", visible: false },
    { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-shopping-cart", visible: true }
  ],
  market: [
    { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-house", visible: true },
    { id: "search", label: "\u0628\u062D\u062B", icon: "fa-magnifying-glass", visible: true },
    { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A\u064A", icon: "fa-bag-shopping", visible: true },
    { id: "favorites", label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", icon: "fa-heart", visible: true },
    { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-cart-shopping", visible: true }
  ],
  luxury: [
    { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-store", visible: true },
    { id: "search", label: "\u0627\u0633\u062A\u0639\u0631\u0627\u0636", icon: "fa-magnifying-glass", visible: true },
    { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A\u064A", icon: "fa-box", visible: true },
    { id: "favorites", label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", icon: "fa-star", visible: false },
    { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-shopping-bag", visible: true }
  ],
  premium: [
    { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-house-chimney", visible: true },
    { id: "search", label: "\u0627\u0633\u062A\u0643\u0634\u0641", icon: "fa-compass", visible: true },
    { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A\u064A", icon: "fa-bag-shopping", visible: true },
    { id: "favorites", label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", icon: "fa-heart", visible: true },
    { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-cart-arrow-down", visible: true }
  ],
  wellness: [
    { id: "home", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "fa-seedling", visible: true },
    { id: "search", label: "\u062A\u0635\u0641\u062D", icon: "fa-magnifying-glass", visible: true },
    { id: "orders", label: "\u0637\u0644\u0628\u0627\u062A", icon: "fa-truck-fast", visible: true },
    { id: "favorites", label: "\u0645\u0641\u0636\u0644\u0629", icon: "fa-sparkles", visible: false },
    { id: "cart", label: "\u0627\u0644\u0633\u0644\u0629", icon: "fa-basket-shopping", visible: true }
  ]
};
var NAVIGATION_PRESET_LABELS = {
  default: "\u0627\u0641\u062A\u0631\u0627\u0636\u064A",
  minimal: "\u0645\u0628\u0633\u0637",
  market: "\u062A\u062C\u0627\u0631\u064A",
  luxury: "\u0641\u0627\u062E\u0631",
  premium: "\u0645\u0645\u064A\u0632",
  wellness: "\u0635\u062D\u064A"
};
function getNavigationPresetLabel(key) {
  return NAVIGATION_PRESET_LABELS[key] || "\u0645\u062E\u0635\u0635";
}
function normalizeBottomNavItems(items) {
  const source = Array.isArray(items) && items.length > 0 ? items : DEFAULT_NAV_ITEMS;
  const normalized = source.map((item, index) => ({
    id: String(item?.id || DEFAULT_NAV_ITEMS[index]?.id || `nav_${index + 1}`),
    label: String(item?.label || DEFAULT_NAV_ITEMS[index]?.label || "\u0639\u0646\u0635\u0631"),
    icon: String(item?.icon || DEFAULT_NAV_ITEMS[index]?.icon || "fa-circle"),
    visible: item?.visible !== false,
    order: Number.isFinite(item?.order) ? Number(item.order) : index + 1
  }));
  const visible = normalized.filter((item) => item.visible).sort((a, b) => (a.order || 0) - (b.order || 0));
  if (visible.length >= 2) return normalized.sort((a, b) => (a.order || 0) - (b.order || 0));
  return DEFAULT_NAV_ITEMS.map((item, index) => ({
    ...item,
    visible: index < 2,
    order: index + 1
  }));
}
function normalizeTopBarSettings(settings) {
  return {
    ...DEFAULT_TOP_BAR_SETTINGS,
    ...settings || {}
  };
}

// src/config/storefrontConfigSchema.ts
var ALLOWED_FONTS = [
  "Tajawal",
  "Cairo",
  "Almarai",
  "Readex Pro",
  "Alexandria",
  "IBM Plex Sans Arabic",
  "Noto Kufi Arabic",
  "Changa",
  "El Messiri"
];
var DEFAULT_STOREFRONT_CONFIG = {
  version: "4.0",
  theme_name: "nalsh_indigo",
  default_theme_mode: "light",
  store_identity: {
    store_name: "\u0645\u062A\u062C\u0631\u064A \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
    slogan: "\u0648\u062C\u0647\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649 \u0644\u0623\u0631\u0642\u0649 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A",
    welcome_message: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0645\u062A\u062C\u0631\u0646\u0627! \u0646\u062A\u0645\u0646\u0649 \u0644\u0643\u0645 \u062A\u062C\u0631\u0628\u0629 \u062A\u0633\u0648\u0642 \u0645\u0645\u062A\u0639\u0629.",
    currency_symbol: "YER",
    announcement_bar: {
      enabled: true,
      text: "\u{1F389} \u0639\u0631\u0648\u0636 \u062D\u0635\u0631\u064A\u0629 \u0648\u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639 \u0644\u0643\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u0627\u0637\u0642!",
      bg_color: "#4F46E5",
      text_color: "#FFFFFF"
    }
  },
  products_settings: {
    display_mode: "by_categories_sections",
    sort_by: "latest",
    out_of_stock_display: "badge_at_end",
    show_quick_add: true,
    show_stock_badge: true,
    show_discount_badge: true,
    show_category_tag: true,
    show_old_price: true,
    show_currency: true,
    show_actions: true,
    add_to_cart_btn: {
      style: "circle_icon",
      text: "\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629",
      show_text: false,
      icon: "fa-plus",
      action_animation: "scale"
    },
    portrait: {
      scroll_direction: "horizontal",
      grid_columns: 2,
      grid_rows: 0,
      slider_rows: 1,
      card_orientation: "portrait",
      card_style: "classic",
      card_custom_width: 0,
      card_custom_height: 0,
      img_custom_height: 0,
      card_density: "standard",
      show_badges: true,
      show_quick_add: true,
      show_rating: true,
      show_old_price: true,
      show_currency: true
    },
    landscape: {
      scroll_direction: "horizontal",
      grid_columns: 4,
      grid_rows: 0,
      slider_rows: 1,
      card_orientation: "portrait",
      card_style: "classic",
      card_custom_width: 0,
      card_custom_height: 0,
      img_custom_height: 0,
      card_density: "standard",
      show_badges: true,
      show_quick_add: true,
      show_rating: true,
      show_old_price: true,
      show_currency: true
    },
    category_overrides: {}
  },
  messages: {
    search_placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0623\u0648 \u0627\u0644\u0645\u0627\u0631\u0643\u0627\u062A...",
    empty_cart_title: "\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0641\u0627\u0631\u063A\u0629 \u{1F6D2}",
    empty_cart_desc: "\u0644\u0645 \u062A\u0642\u0645 \u0628\u0625\u0636\u0627\u0641\u0629 \u0623\u064A \u0645\u0646\u062A\u062C\u0627\u062A \u0644\u0644\u0633\u0644\u0629 \u0628\u0639\u062F\u060C \u062A\u0635\u0641\u062D \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0622\u0646!",
    order_success_title: "\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D! \u{1F389}",
    order_success_msg: "\u0634\u0643\u0631\u0627\u064B \u0644\u062B\u0642\u062A\u0643 \u0628\u0646\u0627. \u0633\u064A\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0648\u062A\u0648\u0635\u064A\u0644 \u0637\u0644\u0628\u0643 \u0641\u064A \u0623\u0642\u0631\u0628 \u0648\u0642\u062A.",
    order_track_whatsapp: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u{1F4AC}",
    chatbot_greeting: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0627\u0644\u062A\u0633\u0648\u0642 \u0627\u0644\u064A\u0648\u0645\u061F \u{1F916}",
    ai_assistant: {
      enabled: true,
      name: "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634",
      persona: "classic",
      avatar_icon: "fa-robot",
      avatar_emoji: "\u{1F916}",
      button_style: "pill",
      avatar_style: "pulse",
      position: "bottom-right",
      enable_quick_actions: true,
      smart_contextual_actions: true,
      smart_contextual_replies: true,
      behavior_mode: "support",
      conversation_style: "balanced",
      response_style: "friendly",
      accent_color: "#4F46E5",
      status_text: "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A",
      quick_actions: ["\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629", "\u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F", "\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A"]
    },
    copied_link_msg: "\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637 \u0628\u0646\u062C\u0627\u062D! \u{1F4CB}"
  },
  layout_blocks: [
    {
      id: "block_hero_1",
      type: "hero",
      title: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0645\u062A\u062C\u0631\u0646\u0627",
      subtitle: "\u062A\u0633\u0648\u0642 \u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0623\u0639\u0644\u0649 \u062C\u0648\u062F\u0629 \u0645\u0636\u0645\u0648\u0646\u0629",
      style: "classic",
      visible: true,
      order: 1,
      settings: {
        cta_text: "\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
        cta_link: "#products",
        alignment: "center"
      }
    },
    {
      id: "block_cat_1",
      type: "categories",
      title: "\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0645\u0645\u064A\u0632\u0629",
      style: "bubbles",
      visible: true,
      order: 2,
      settings: {
        layout: "horizontal"
      }
    },
    {
      id: "block_prod_1",
      type: "products",
      title: "\u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0639\u0631\u0648\u0636",
      style: "classic_grid",
      visible: true,
      order: 3,
      settings: {
        limit: 12
      }
    }
  ],
  modals_customization: {
    product_details: {
      cta_button_text: "\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u{1F6CD}\uFE0F",
      border_radius: "24px"
    },
    cart_drawer: {
      header_title: "\u0633\u0644\u0629 \u0645\u0634\u062A\u0631\u064A\u0627\u062A\u064A \u{1F6D2}",
      checkout_btn_text: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639 \u{1F680}",
      empty_message: "\u0633\u0644\u062A\u0643 \u0641\u0627\u0631\u063A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B"
    },
    store_info: {
      title: "\u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0633\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u062E\u062F\u0645\u0629",
      about_text: "\u0645\u062A\u062C\u0631 \u0631\u0627\u0626\u062F \u064A\u0642\u062F\u0645 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0645\u0645\u064A\u0632\u0629.",
      delivery_policy: "\u0646\u0648\u0641\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0639 \u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u062E\u0644\u0627\u0644 3 \u0623\u064A\u0627\u0645."
    },
    order_success: {
      title: "\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D! \u{1F389}",
      whatsapp_btn_text: "\u062A\u0623\u0643\u064A\u062F \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628 \u0628\u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628 \u{1F4AC}"
    }
  },
  light_theme: {
    colors: {
      primary: "#4F46E5",
      primary_hover: "#4338CA",
      primary_gradient_start: "#4F46E5",
      primary_gradient_end: "#06B6D4",
      accent: "#14B8A6",
      bg_body: "#F8FAFC",
      bg_card: "#FFFFFF",
      bg_surface: "#F1F5F9",
      text_main: "#0F172A",
      text_muted: "#64748B",
      border: "#E2E8F0",
      navbar_bg: "#FFFFFF",
      navbar_text: "#0F172A",
      bottom_bar_bg: "#FFFFFF",
      bottom_bar_active: "#4F46E5",
      bottom_bar_inactive: "#94A3B8",
      card_bg: "#FFFFFF",
      card_border: "#E2E8F0",
      card_title: "#0F172A",
      price_color: "#4F46E5",
      old_price_color: "#94A3B8",
      badge_bg: "#EF4444",
      badge_text: "#FFFFFF",
      section_title: "#0F172A",
      category_chip_bg: "#F1F5F9",
      category_chip_active: "#4F46E5",
      category_chip_text: "#0F172A",
      modal_bg: "#FFFFFF",
      modal_overlay: "rgba(15, 23, 42, 0.6)",
      modal_handle: "#CBD5E1",
      btn_primary_bg: "#4F46E5",
      btn_primary_text: "#FFFFFF",
      chatbot_btn_bg: "#4F46E5",
      toast_bg: "#0F172A",
      toast_text: "#FFFFFF"
    }
  },
  dark_theme: {
    colors: {
      primary: "#6366F1",
      primary_hover: "#818CF8",
      primary_gradient_start: "#6366F1",
      primary_gradient_end: "#2DD4BF",
      accent: "#2DD4BF",
      bg_body: "#0B1120",
      bg_card: "#151E2E",
      bg_surface: "#1E293B",
      text_main: "#F8FAFC",
      text_muted: "#94A3B8",
      border: "rgba(255, 255, 255, 0.08)",
      navbar_bg: "#151E2E",
      navbar_text: "#F8FAFC",
      bottom_bar_bg: "#151E2E",
      bottom_bar_active: "#6366F1",
      bottom_bar_inactive: "#64748B",
      card_bg: "#151E2E",
      card_border: "rgba(255, 255, 255, 0.08)",
      card_title: "#F8FAFC",
      price_color: "#818CF8",
      old_price_color: "#64748B",
      badge_bg: "#EF4444",
      badge_text: "#FFFFFF",
      section_title: "#F8FAFC",
      category_chip_bg: "#1E293B",
      category_chip_active: "#6366F1",
      category_chip_text: "#F8FAFC",
      modal_bg: "#151E2E",
      modal_overlay: "rgba(0, 0, 0, 0.85)",
      modal_handle: "#475569",
      btn_primary_bg: "#6366F1",
      btn_primary_text: "#FFFFFF",
      chatbot_btn_bg: "#6366F1",
      toast_bg: "#1E293B",
      toast_text: "#F8FAFC"
    }
  },
  typography: {
    font_family: "Tajawal",
    base_size: "16px",
    base_size_mobile: "15px",
    base_size_desktop: "17px",
    heading_weight: "700",
    heading_size_mobile: "1.15rem",
    heading_size_desktop: "1.45rem",
    price_size_mobile: "1.1rem",
    price_size_desktop: "1.25rem",
    headings: {
      price_size: "1.15rem"
    }
  },
  shapes: {
    card_radius: "20px",
    button_radius: "14px",
    button_style: "rounded",
    card_style: "elevated",
    navbar_style: "solid",
    section_spacing: "normal"
  },
  navigation_settings: {
    bottom_bar: {
      items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS)
    },
    top_bar: normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)
  },
  animations: {
    card_hover: "lift"
  },
  marketing: {
    free_shipping_bar: {
      enabled: false,
      message: "\u{1F69A} \u0634\u062D\u0646 \u0645\u062C\u0627\u0646\u064A \u0644\u0644\u0637\u0644\u0628\u0627\u062A \u0641\u0648\u0642 10,000 \u0631\u064A\u0627\u0644!"
    },
    whatsapp_floating: {
      enabled: true,
      phone: "",
      position: "left"
    }
  }
};
var THEME_PRESETS = [
  {
    id: "nalsh_indigo",
    name: "\u0628\u0646\u0641\u0633\u062C\u064A \u0646\u0627\u0644\u0634 \u0627\u0644\u0639\u0635\u0631\u064A \u{1F48E}",
    category: "\u062A\u0642\u0646\u064A\u0629 \u0648\u062D\u062F\u064A\u062B",
    description: "\u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0644\u0645\u0646\u0635\u0629 \u0646\u0627\u0644\u0634 \u0628\u062A\u062F\u0631\u062C\u0627\u062A \u0625\u0646\u062F\u064A\u063A\u0648 \u0648\u062A\u0631\u0643\u0648\u0627\u0632\u064A\u0629 \u062D\u064A\u0648\u064A\u0629 \u0648\u0639\u0635\u0631\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#4F46E5",
        primary_hover: "#4338CA",
        primary_gradient_start: "#4F46E5",
        primary_gradient_end: "#06B6D4",
        accent: "#14B8A6",
        bg_body: "#F8FAFC",
        bg_card: "#FFFFFF",
        bg_surface: "#F1F5F9",
        text_main: "#0F172A",
        text_muted: "#64748B",
        border: "#E2E8F0",
        navbar_bg: "#FFFFFF",
        navbar_text: "#0F172A",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#4F46E5",
        bottom_bar_inactive: "#94A3B8",
        card_bg: "#FFFFFF",
        card_border: "#E2E8F0",
        card_title: "#0F172A",
        price_color: "#4F46E5",
        old_price_color: "#94A3B8",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#0F172A",
        category_chip_bg: "#F1F5F9",
        category_chip_active: "#4F46E5",
        category_chip_text: "#0F172A",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(15, 23, 42, 0.6)",
        modal_handle: "#CBD5E1",
        btn_primary_bg: "#4F46E5",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#4F46E5"
      }
    },
    dark_theme: {
      colors: {
        primary: "#6366F1",
        primary_hover: "#818CF8",
        primary_gradient_start: "#6366F1",
        primary_gradient_end: "#2DD4BF",
        accent: "#2DD4BF",
        bg_body: "#0B1120",
        bg_card: "#151E2E",
        bg_surface: "#1E293B",
        text_main: "#F8FAFC",
        text_muted: "#94A3B8",
        border: "#2D3B55",
        navbar_bg: "#151E2E",
        navbar_text: "#F8FAFC",
        bottom_bar_bg: "#151E2E",
        bottom_bar_active: "#6366F1",
        bottom_bar_inactive: "#64748B",
        card_bg: "#151E2E",
        card_border: "#2D3B55",
        card_title: "#F8FAFC",
        price_color: "#818CF8",
        old_price_color: "#64748B",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#F8FAFC",
        category_chip_bg: "#1E293B",
        category_chip_active: "#6366F1",
        category_chip_text: "#F8FAFC",
        modal_bg: "#151E2E",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#475569",
        btn_primary_bg: "#6366F1",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#6366F1"
      }
    },
    typography: { font_family: "Tajawal", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "20px", button_radius: "14px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "emerald_royal",
    name: "\u0632\u0645\u0631\u062F\u064A \u0645\u0644\u0643\u064A \u0641\u0627\u062E\u0631 \u{1F451}",
    category: "\u0641\u062E\u0627\u0645\u0629 \u0648\u0639\u0637\u0648\u0631",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0632\u0645\u0631\u062F \u0627\u0644\u0623\u062E\u0636\u0631 \u0627\u0644\u0641\u0627\u062E\u0631 \u0644\u0644\u0623\u0646\u0627\u0642\u0629 \u0648\u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0645\u0645\u064A\u0632\u0629 \u0648\u0627\u0644\u0639\u0637\u0648\u0631",
    light_theme: {
      colors: {
        primary: "#059669",
        primary_hover: "#047857",
        primary_gradient_start: "#059669",
        primary_gradient_end: "#34D399",
        accent: "#10B981",
        bg_body: "#F0FDF4",
        bg_card: "#FFFFFF",
        bg_surface: "#DCFCE7",
        text_main: "#064E3B",
        text_muted: "#047857",
        border: "#BBF7D0",
        navbar_bg: "#FFFFFF",
        navbar_text: "#064E3B",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#059669",
        bottom_bar_inactive: "#047857",
        card_bg: "#FFFFFF",
        card_border: "#BBF7D0",
        card_title: "#064E3B",
        price_color: "#059669",
        old_price_color: "#047857",
        badge_bg: "#E11D48",
        badge_text: "#FFFFFF",
        section_title: "#064E3B",
        category_chip_bg: "#DCFCE7",
        category_chip_active: "#059669",
        category_chip_text: "#064E3B",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(6, 78, 59, 0.6)",
        modal_handle: "#BBF7D0",
        btn_primary_bg: "#059669",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#059669"
      }
    },
    dark_theme: {
      colors: {
        primary: "#10B981",
        primary_hover: "#34D399",
        primary_gradient_start: "#10B981",
        primary_gradient_end: "#6EE7B7",
        accent: "#34D399",
        bg_body: "#022C22",
        bg_card: "#064E3B",
        bg_surface: "#065F46",
        text_main: "#ECFDF5",
        text_muted: "#A7F3D0",
        border: "#0F766E",
        navbar_bg: "#064E3B",
        navbar_text: "#ECFDF5",
        bottom_bar_bg: "#064E3B",
        bottom_bar_active: "#10B981",
        bottom_bar_inactive: "#A7F3D0",
        card_bg: "#064E3B",
        card_border: "#0F766E",
        card_title: "#ECFDF5",
        price_color: "#34D399",
        old_price_color: "#A7F3D0",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#ECFDF5",
        category_chip_bg: "#065F46",
        category_chip_active: "#10B981",
        category_chip_text: "#ECFDF5",
        modal_bg: "#064E3B",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#0F766E",
        btn_primary_bg: "#10B981",
        btn_primary_text: "#022C22",
        chatbot_btn_bg: "#10B981"
      }
    },
    typography: { font_family: "Cairo", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "16px", button_radius: "12px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "ruby_red",
    name: "\u064A\u0627\u0642\u0648\u062A\u064A \u0623\u062D\u0645\u0631 \u0648\u062C\u0631\u064A\u0621 \u{1F339}",
    category: "\u0623\u0632\u064A\u0627\u0621 \u0648\u0645\u0643\u064A\u0627\u062C",
    description: "\u062A\u0635\u0645\u064A\u0645 \u062F\u0627\u0641\u0626 \u0648\u062C\u0631\u064A\u0621 \u0628\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u064A\u0627\u0642\u0648\u062A \u0627\u0644\u0623\u062D\u0645\u0631 \u0644\u0644\u0623\u0632\u064A\u0627\u0621 \u0648\u0627\u0644\u0645\u0648\u0636\u0629 \u0648\u0627\u0644\u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A",
    light_theme: {
      colors: {
        primary: "#E11D48",
        primary_hover: "#BE123C",
        primary_gradient_start: "#E11D48",
        primary_gradient_end: "#FB7185",
        accent: "#FB7185",
        bg_body: "#FFF1F2",
        bg_card: "#FFFFFF",
        bg_surface: "#FFE4E6",
        text_main: "#1C1917",
        text_muted: "#78716C",
        border: "#FECDD3",
        navbar_bg: "#FFFFFF",
        navbar_text: "#1C1917",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#E11D48",
        bottom_bar_inactive: "#78716C",
        card_bg: "#FFFFFF",
        card_border: "#FECDD3",
        card_title: "#1C1917",
        price_color: "#E11D48",
        old_price_color: "#78716C",
        badge_bg: "#BE123C",
        badge_text: "#FFFFFF",
        section_title: "#1C1917",
        category_chip_bg: "#FFE4E6",
        category_chip_active: "#E11D48",
        category_chip_text: "#1C1917",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(28, 25, 23, 0.6)",
        modal_handle: "#FECDD3",
        btn_primary_bg: "#E11D48",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#E11D48"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FB7185",
        primary_hover: "#FDA4AF",
        primary_gradient_start: "#FB7185",
        primary_gradient_end: "#E11D48",
        accent: "#F43F5E",
        bg_body: "#18181B",
        bg_card: "#27272A",
        bg_surface: "#3F3F46",
        text_main: "#FAFAFA",
        text_muted: "#A1A1AA",
        border: "#3F3F46",
        navbar_bg: "#27272A",
        navbar_text: "#FAFAFA",
        bottom_bar_bg: "#27272A",
        bottom_bar_active: "#FB7185",
        bottom_bar_inactive: "#A1A1AA",
        card_bg: "#27272A",
        card_border: "#3F3F46",
        card_title: "#FAFAFA",
        price_color: "#FB7185",
        old_price_color: "#A1A1AA",
        badge_bg: "#E11D48",
        badge_text: "#FFFFFF",
        section_title: "#FAFAFA",
        category_chip_bg: "#3F3F46",
        category_chip_active: "#FB7185",
        category_chip_text: "#FAFAFA",
        modal_bg: "#27272A",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#52525B",
        btn_primary_bg: "#FB7185",
        btn_primary_text: "#18181B",
        chatbot_btn_bg: "#FB7185"
      }
    },
    typography: { font_family: "Readex Pro", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "24px", button_radius: "9999px", button_style: "pill", card_style: "elevated" }
  },
  {
    id: "amber_gold",
    name: "\u0630\u0647\u0628\u064A \u0639\u0646\u0628\u0631\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u{1F3C6}",
    category: "\u0645\u062C\u0648\u0647\u0631\u0627\u062A \u0648\u0633\u0627\u0639\u0627\u062A",
    description: "\u0641\u062E\u0627\u0645\u0629 \u0645\u0644\u0643\u064A\u0629 \u0645\u0639 \u062D\u062F\u0648\u062F \u0648\u0627\u0636\u062D\u0629 \u0648\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0639\u0646\u0628\u0631 \u0648\u0627\u0644\u0630\u0647\u0628 \u0644\u0644\u0645\u062C\u0648\u0647\u0631\u0627\u062A \u0648\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0641\u0627\u062E\u0631\u0629",
    light_theme: {
      colors: {
        primary: "#D97706",
        primary_hover: "#B45309",
        primary_gradient_start: "#D97706",
        primary_gradient_end: "#FBBF24",
        accent: "#F59E0B",
        bg_body: "#FFFBEB",
        bg_card: "#FFFFFF",
        bg_surface: "#FEF3C7",
        text_main: "#1E293B",
        text_muted: "#64748B",
        border: "#FDE68A",
        navbar_bg: "#FFFFFF",
        navbar_text: "#1E293B",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#D97706",
        bottom_bar_inactive: "#64748B",
        card_bg: "#FFFFFF",
        card_border: "#FDE68A",
        card_title: "#1E293B",
        price_color: "#D97706",
        old_price_color: "#64748B",
        badge_bg: "#DC2626",
        badge_text: "#FFFFFF",
        section_title: "#1E293B",
        category_chip_bg: "#FEF3C7",
        category_chip_active: "#D97706",
        category_chip_text: "#1E293B",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(30, 41, 59, 0.6)",
        modal_handle: "#FDE68A",
        btn_primary_bg: "#D97706",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#D97706"
      }
    },
    dark_theme: {
      colors: {
        primary: "#F59E0B",
        primary_hover: "#FBBF24",
        primary_gradient_start: "#F59E0B",
        primary_gradient_end: "#D97706",
        accent: "#FBBF24",
        bg_body: "#0F172A",
        bg_card: "#1E293B",
        bg_surface: "#334155",
        text_main: "#F8FAFC",
        text_muted: "#94A3B8",
        border: "#334155",
        navbar_bg: "#1E293B",
        navbar_text: "#F8FAFC",
        bottom_bar_bg: "#1E293B",
        bottom_bar_active: "#F59E0B",
        bottom_bar_inactive: "#94A3B8",
        card_bg: "#1E293B",
        card_border: "#334155",
        card_title: "#F8FAFC",
        price_color: "#FBBF24",
        old_price_color: "#94A3B8",
        badge_bg: "#DC2626",
        badge_text: "#FFFFFF",
        section_title: "#F8FAFC",
        category_chip_bg: "#334155",
        category_chip_active: "#F59E0B",
        category_chip_text: "#F8FAFC",
        modal_bg: "#1E293B",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#475569",
        btn_primary_bg: "#F59E0B",
        btn_primary_text: "#0F172A",
        chatbot_btn_bg: "#F59E0B"
      }
    },
    typography: { font_family: "Almarai", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "14px", button_radius: "8px", button_style: "rounded", card_style: "bordered" }
  },
  {
    id: "deep_ocean",
    name: "\u0623\u0632\u0631\u0642 \u0627\u0644\u0645\u062D\u064A\u0637 \u0627\u0644\u0635\u0627\u0641\u064A \u{1F30A}",
    category: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u062E\u062F\u0645\u0627\u062A",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0623\u0632\u0631\u0642 \u0627\u0644\u0628\u062D\u0631\u064A \u0627\u0644\u0635\u0627\u0641\u064A \u0648\u0627\u0644\u0639\u0645\u064A\u0642 \u0644\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062D\u062F\u064A\u062B\u0629",
    light_theme: {
      colors: {
        primary: "#0284C7",
        primary_hover: "#0369A1",
        primary_gradient_start: "#0284C7",
        primary_gradient_end: "#38BDF8",
        accent: "#0EA5E9",
        bg_body: "#F0F9FF",
        bg_card: "#FFFFFF",
        bg_surface: "#E0F2FE",
        text_main: "#0C4A6E",
        text_muted: "#0369A1",
        border: "#BAE6FD",
        navbar_bg: "#FFFFFF",
        navbar_text: "#0C4A6E",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#0284C7",
        bottom_bar_inactive: "#0369A1",
        card_bg: "#FFFFFF",
        card_border: "#BAE6FD",
        card_title: "#0C4A6E",
        price_color: "#0284C7",
        old_price_color: "#0369A1",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#0C4A6E",
        category_chip_bg: "#E0F2FE",
        category_chip_active: "#0284C7",
        category_chip_text: "#0C4A6E",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(12, 74, 110, 0.6)",
        modal_handle: "#BAE6FD",
        btn_primary_bg: "#0284C7",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#0284C7"
      }
    },
    dark_theme: {
      colors: {
        primary: "#38BDF8",
        primary_hover: "#7DD3FC",
        primary_gradient_start: "#38BDF8",
        primary_gradient_end: "#0284C7",
        accent: "#0EA5E9",
        bg_body: "#082F49",
        card_bg: "#0C4A6E",
        bg_card: "#0C4A6E",
        bg_surface: "#075985",
        text_main: "#F0F9FF",
        text_muted: "#BAE6FD",
        border: "#0369A1",
        navbar_bg: "#0C4A6E",
        navbar_text: "#F0F9FF",
        bottom_bar_bg: "#0C4A6E",
        bottom_bar_active: "#38BDF8",
        bottom_bar_inactive: "#BAE6FD",
        card_border: "#0369A1",
        card_title: "#F0F9FF",
        price_color: "#38BDF8",
        old_price_color: "#BAE6FD",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#F0F9FF",
        category_chip_bg: "#075985",
        category_chip_active: "#38BDF8",
        category_chip_text: "#F0F9FF",
        modal_bg: "#0C4A6E",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#0369A1",
        btn_primary_bg: "#38BDF8",
        btn_primary_text: "#082F49",
        chatbot_btn_bg: "#38BDF8"
      }
    },
    typography: { font_family: "Alexandria", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "16px", button_radius: "10px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "cyber_cyan",
    name: "\u0633\u0645\u0627\u0648\u064A \u0633\u0627\u064A\u0628\u0631 \u0646\u064A\u0648\u0646 \u26A1",
    category: "\u0623\u0644\u0639\u0627\u0628 \u0648\u062A\u0642\u0646\u064A\u0629",
    description: "\u0623\u0644\u0648\u0627\u0646 \u0633\u0627\u064A\u0628\u0631 \u0628\u0627\u0646\u0643 \u0648\u0646\u064A\u0648\u0646 \u0645\u0636\u064A\u0621 \u0644\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0631\u0642\u0645\u064A\u0629\u060C \u0627\u0644\u0623\u0644\u0639\u0627\u0628\u060C \u0648\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0639\u0629",
    light_theme: {
      colors: {
        primary: "#0891B2",
        primary_hover: "#0E7490",
        primary_gradient_start: "#0891B2",
        primary_gradient_end: "#06B6D4",
        accent: "#06B6D4",
        bg_body: "#ECFEFF",
        bg_card: "#FFFFFF",
        bg_surface: "#CFFAFE",
        text_main: "#164E63",
        text_muted: "#0891B2",
        border: "#A5F3FC",
        navbar_bg: "#FFFFFF",
        navbar_text: "#164E63",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#0891B2",
        bottom_bar_inactive: "#0891B2",
        card_bg: "#FFFFFF",
        card_border: "#A5F3FC",
        card_title: "#164E63",
        price_color: "#0891B2",
        old_price_color: "#0891B2",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#164E63",
        category_chip_bg: "#CFFAFE",
        category_chip_active: "#0891B2",
        category_chip_text: "#164E63",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(22, 78, 99, 0.6)",
        modal_handle: "#A5F3FC",
        btn_primary_bg: "#0891B2",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#0891B2"
      }
    },
    dark_theme: {
      colors: {
        primary: "#22D3EE",
        primary_hover: "#67E8F9",
        primary_gradient_start: "#22D3EE",
        primary_gradient_end: "#A855F7",
        accent: "#A855F7",
        bg_body: "#08131F",
        card_bg: "#0E2338",
        bg_card: "#0E2338",
        bg_surface: "#153350",
        text_main: "#ECFEFF",
        text_muted: "#A5F3FC",
        border: "#155E75",
        navbar_bg: "#0E2338",
        navbar_text: "#ECFEFF",
        bottom_bar_bg: "#0E2338",
        bottom_bar_active: "#22D3EE",
        bottom_bar_inactive: "#A5F3FC",
        card_border: "#155E75",
        card_title: "#ECFEFF",
        price_color: "#22D3EE",
        old_price_color: "#A5F3FC",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#ECFEFF",
        category_chip_bg: "#153350",
        category_chip_active: "#22D3EE",
        category_chip_text: "#ECFEFF",
        modal_bg: "#0E2338",
        modal_overlay: "rgba(0, 0, 0, 0.9)",
        modal_handle: "#155E75",
        btn_primary_bg: "#22D3EE",
        btn_primary_text: "#08131F",
        chatbot_btn_bg: "#22D3EE"
      }
    },
    typography: { font_family: "Cairo", base_size: "16px", heading_weight: "900" },
    shapes: { card_radius: "12px", button_radius: "6px", button_style: "square", card_style: "bordered" }
  },
  {
    id: "fashion_rose",
    name: "\u0648\u0631\u062F\u064A \u0623\u0646\u064A\u0642 \u0648\u0641\u0627\u0634\u0646 \u{1F338}",
    category: "\u0623\u0632\u064A\u0627\u0621 \u0648\u062C\u0645\u0627\u0644",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0648\u0631\u062F\u064A \u0648\u0627\u0644\u0631\u0648\u0632 \u0627\u0644\u0646\u0627\u0639\u0645\u0629 \u0648\u0627\u0644\u0623\u0646\u064A\u0642\u0629 \u0644\u0644\u0623\u0632\u064A\u0627\u0621 \u0627\u0644\u0646\u0633\u0627\u0626\u064A\u0629\u060C \u0627\u0644\u0639\u0637\u0648\u0631\u060C \u0648\u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u0627\u0644\u062A\u062C\u0645\u064A\u0644",
    light_theme: {
      colors: {
        primary: "#DB2777",
        primary_hover: "#BE185D",
        primary_gradient_start: "#DB2777",
        primary_gradient_end: "#F472B6",
        accent: "#F472B6",
        bg_body: "#FDF2F8",
        bg_card: "#FFFFFF",
        bg_surface: "#FCE7F3",
        text_main: "#831843",
        text_muted: "#9D174D",
        border: "#FBCFE8",
        navbar_bg: "#FFFFFF",
        navbar_text: "#831843",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#DB2777",
        bottom_bar_inactive: "#9D174D",
        card_bg: "#FFFFFF",
        card_border: "#FBCFE8",
        card_title: "#831843",
        price_color: "#DB2777",
        old_price_color: "#9D174D",
        badge_bg: "#9D174D",
        badge_text: "#FFFFFF",
        section_title: "#831843",
        category_chip_bg: "#FCE7F3",
        category_chip_active: "#DB2777",
        category_chip_text: "#831843",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(131, 24, 67, 0.6)",
        modal_handle: "#FBCFE8",
        btn_primary_bg: "#DB2777",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#DB2777"
      }
    },
    dark_theme: {
      colors: {
        primary: "#F472B6",
        primary_hover: "#FBCFE8",
        primary_gradient_start: "#F472B6",
        primary_gradient_end: "#DB2777",
        accent: "#FB7185",
        bg_body: "#1F0A16",
        card_bg: "#371228",
        bg_card: "#371228",
        bg_surface: "#4C1D3A",
        text_main: "#FDF2F8",
        text_muted: "#FBCFE8",
        border: "#831843",
        navbar_bg: "#371228",
        navbar_text: "#FDF2F8",
        bottom_bar_bg: "#371228",
        bottom_bar_active: "#F472B6",
        bottom_bar_inactive: "#FBCFE8",
        card_border: "#831843",
        card_title: "#FDF2F8",
        price_color: "#F472B6",
        old_price_color: "#FBCFE8",
        badge_bg: "#DB2777",
        badge_text: "#FFFFFF",
        section_title: "#FDF2F8",
        category_chip_bg: "#4C1D3A",
        category_chip_active: "#F472B6",
        category_chip_text: "#FDF2F8",
        modal_bg: "#371228",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#831843",
        btn_primary_bg: "#F472B6",
        btn_primary_text: "#1F0A16",
        chatbot_btn_bg: "#F472B6"
      }
    },
    typography: { font_family: "Readex Pro", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "24px", button_radius: "9999px", button_style: "pill", card_style: "elevated" }
  },
  {
    id: "imperial_purple",
    name: "\u0623\u0631\u062C\u0648\u0627\u0646\u064A \u0645\u0644\u0643\u064A \u0641\u0627\u062E\u0631 \u{1F52E}",
    category: "\u0641\u062E\u0627\u0645\u0629 \u0648\u0647\u062F\u0627\u064A\u0627",
    description: "\u0623\u0631\u062C\u0648\u0627\u0646\u064A \u0639\u0645\u064A\u0642 \u0648\u0633\u0627\u062D\u0631 \u064A\u0639\u0643\u0633 \u0627\u0644\u062A\u0645\u064A\u0632 \u0648\u0627\u0644\u0641\u062E\u0627\u0645\u0629 \u0644\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0631\u0627\u0642\u064A\u0629 \u0648\u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0627\u0644\u0641\u0627\u062E\u0631\u0629",
    light_theme: {
      colors: {
        primary: "#7C3AED",
        primary_hover: "#6D28D9",
        primary_gradient_start: "#7C3AED",
        primary_gradient_end: "#A78BFA",
        accent: "#A78BFA",
        bg_body: "#FAF5FF",
        bg_card: "#FFFFFF",
        bg_surface: "#F3E8FF",
        text_main: "#3B0764",
        text_muted: "#581C87",
        border: "#E9D5FF",
        navbar_bg: "#FFFFFF",
        navbar_text: "#3B0764",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#7C3AED",
        bottom_bar_inactive: "#581C87",
        card_bg: "#FFFFFF",
        card_border: "#E9D5FF",
        card_title: "#3B0764",
        price_color: "#7C3AED",
        old_price_color: "#581C87",
        badge_bg: "#EC4899",
        badge_text: "#FFFFFF",
        section_title: "#3B0764",
        category_chip_bg: "#F3E8FF",
        category_chip_active: "#7C3AED",
        category_chip_text: "#3B0764",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(59, 7, 100, 0.6)",
        modal_handle: "#E9D5FF",
        btn_primary_bg: "#7C3AED",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#7C3AED"
      }
    },
    dark_theme: {
      colors: {
        primary: "#A78BFA",
        primary_hover: "#C4B5FD",
        primary_gradient_start: "#A78BFA",
        primary_gradient_end: "#7C3AED",
        accent: "#C084FC",
        bg_body: "#160826",
        card_bg: "#291045",
        bg_card: "#291045",
        bg_surface: "#3B1A60",
        text_main: "#FAF5FF",
        text_muted: "#DDD6FE",
        border: "#581C87",
        navbar_bg: "#291045",
        navbar_text: "#FAF5FF",
        bottom_bar_bg: "#291045",
        bottom_bar_active: "#A78BFA",
        bottom_bar_inactive: "#DDD6FE",
        card_border: "#581C87",
        card_title: "#FAF5FF",
        price_color: "#A78BFA",
        old_price_color: "#DDD6FE",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#FAF5FF",
        category_chip_bg: "#3B1A60",
        category_chip_active: "#A78BFA",
        category_chip_text: "#FAF5FF",
        modal_bg: "#291045",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#581C87",
        btn_primary_bg: "#A78BFA",
        btn_primary_text: "#160826",
        chatbot_btn_bg: "#A78BFA"
      }
    },
    typography: { font_family: "Tajawal", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "18px", button_radius: "12px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "fresh_mint",
    name: "\u0623\u062E\u0636\u0631 \u0646\u0639\u0646\u0627\u0639\u064A \u0645\u0646\u0639\u0634 \u{1F343}",
    category: "\u0635\u062D\u0629 \u0648\u0637\u0628\u064A\u0639\u0629",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0648\u0627\u0644\u062A\u0631\u0643\u0648\u0627\u0632 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0648\u0627\u0644\u0645\u0631\u064A\u062D\u0629 \u0644\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0635\u062D\u064A\u0629\u060C \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629\u060C \u0648\u0627\u0644\u0623\u063A\u0630\u064A\u0629 \u0627\u0644\u0635\u062D\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#0D9488",
        primary_hover: "#0F766E",
        primary_gradient_start: "#0D9488",
        primary_gradient_end: "#2DD4BF",
        accent: "#2DD4BF",
        bg_body: "#F0FDFA",
        bg_card: "#FFFFFF",
        bg_surface: "#CCFBF1",
        text_main: "#134E4A",
        text_muted: "#115E59",
        border: "#99F6E4",
        navbar_bg: "#FFFFFF",
        navbar_text: "#134E4A",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#0D9488",
        bottom_bar_inactive: "#115E59",
        card_bg: "#FFFFFF",
        card_border: "#99F6E4",
        card_title: "#134E4A",
        price_color: "#0D9488",
        old_price_color: "#115E59",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#134E4A",
        category_chip_bg: "#CCFBF1",
        category_chip_active: "#0D9488",
        category_chip_text: "#134E4A",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(19, 78, 74, 0.6)",
        modal_handle: "#99F6E4",
        btn_primary_bg: "#0D9488",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#0D9488"
      }
    },
    dark_theme: {
      colors: {
        primary: "#2DD4BF",
        primary_hover: "#5EEAD4",
        primary_gradient_start: "#2DD4BF",
        primary_gradient_end: "#0D9488",
        accent: "#14B8A6",
        bg_body: "#042320",
        card_bg: "#0B3B36",
        bg_card: "#0B3B36",
        bg_surface: "#104F49",
        text_main: "#F0FDFA",
        text_muted: "#99F6E4",
        border: "#134E4A",
        navbar_bg: "#0B3B36",
        navbar_text: "#F0FDFA",
        bottom_bar_bg: "#0B3B36",
        bottom_bar_active: "#2DD4BF",
        bottom_bar_inactive: "#99F6E4",
        card_border: "#134E4A",
        card_title: "#F0FDFA",
        price_color: "#2DD4BF",
        old_price_color: "#99F6E4",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#F0FDFA",
        category_chip_bg: "#104F49",
        category_chip_active: "#2DD4BF",
        category_chip_text: "#F0FDFA",
        modal_bg: "#0B3B36",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#134E4A",
        btn_primary_bg: "#2DD4BF",
        btn_primary_text: "#042320",
        chatbot_btn_bg: "#2DD4BF"
      }
    },
    typography: { font_family: "Almarai", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "20px", button_radius: "14px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "sunset_coral",
    name: "\u0628\u0631\u062A\u0642\u0627\u0644\u064A \u0645\u0631\u062C\u0627\u0646\u064A \u062F\u0627\u0641\u0626 \u{1F305}",
    category: "\u0645\u0623\u0643\u0648\u0644\u0627\u062A \u0648\u0631\u064A\u0627\u0636\u0629",
    description: "\u062F\u0641\u0621 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u063A\u0631\u0648\u0628 \u0648\u0627\u0644\u0645\u0631\u062C\u0627\u0646 \u0627\u0644\u0646\u0627\u0628\u0636 \u0628\u0627\u0644\u062D\u064A\u0627\u0629\u060C \u0645\u062B\u0627\u0644\u064A \u0644\u0644\u0645\u0637\u0627\u0639\u0645 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629",
    light_theme: {
      colors: {
        primary: "#EA580C",
        primary_hover: "#C2410C",
        primary_gradient_start: "#EA580C",
        primary_gradient_end: "#FB923C",
        accent: "#F97316",
        bg_body: "#FFF7ED",
        bg_card: "#FFFFFF",
        bg_surface: "#FFEDD5",
        text_main: "#431407",
        text_muted: "#7C2D12",
        border: "#FED7AA",
        navbar_bg: "#FFFFFF",
        navbar_text: "#431407",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#EA580C",
        bottom_bar_inactive: "#7C2D12",
        card_bg: "#FFFFFF",
        card_border: "#FED7AA",
        card_title: "#431407",
        price_color: "#EA580C",
        old_price_color: "#7C2D12",
        badge_bg: "#DC2626",
        badge_text: "#FFFFFF",
        section_title: "#431407",
        category_chip_bg: "#FFEDD5",
        category_chip_active: "#EA580C",
        category_chip_text: "#431407",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(67, 20, 7, 0.6)",
        modal_handle: "#FED7AA",
        btn_primary_bg: "#EA580C",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#EA580C"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FB923C",
        primary_hover: "#FDBA74",
        primary_gradient_start: "#FB923C",
        primary_gradient_end: "#EA580C",
        accent: "#F97316",
        bg_body: "#1C0B04",
        card_bg: "#361608",
        bg_card: "#361608",
        bg_surface: "#4D2210",
        text_main: "#FFF7ED",
        text_muted: "#FED7AA",
        border: "#7C2D12",
        navbar_bg: "#361608",
        navbar_text: "#FFF7ED",
        bottom_bar_bg: "#361608",
        bottom_bar_active: "#FB923C",
        bottom_bar_inactive: "#FED7AA",
        card_border: "#7C2D12",
        card_title: "#FFF7ED",
        price_color: "#FB923C",
        old_price_color: "#FED7AA",
        badge_bg: "#EA580C",
        badge_text: "#FFFFFF",
        section_title: "#FFF7ED",
        category_chip_bg: "#4D2210",
        category_chip_active: "#FB923C",
        category_chip_text: "#FFF7ED",
        modal_bg: "#361608",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#7C2D12",
        btn_primary_bg: "#FB923C",
        btn_primary_text: "#1C0B04",
        chatbot_btn_bg: "#FB923C"
      }
    },
    typography: { font_family: "Changa", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "16px", button_radius: "10px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "warm_mocha",
    name: "\u0645\u0648\u0643\u0627 \u0648\u0628\u0646 \u0643\u0627\u0641\u064A\u0647 \u2615",
    category: "\u0645\u0642\u0627\u0647\u064A \u0648\u062D\u0644\u0648\u064A\u0627\u062A",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0628\u0646 \u0648\u0627\u0644\u0643\u0631\u0627\u0645\u064A\u0644 \u0648\u0627\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u062F\u0627\u0641\u0626\u0629 \u0644\u0644\u0645\u0642\u0627\u0647\u064A\u060C \u0627\u0644\u0645\u062E\u0627\u0628\u0632\u060C \u0648\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u062D\u0644\u0648\u064A\u0627\u062A \u0627\u0644\u0631\u0627\u0642\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#92400E",
        primary_hover: "#78350F",
        primary_gradient_start: "#92400E",
        primary_gradient_end: "#D97706",
        accent: "#B45309",
        bg_body: "#FFFBEB",
        bg_card: "#FFFFFF",
        bg_surface: "#FEF3C7",
        text_main: "#451A03",
        text_muted: "#78350F",
        border: "#FDE68A",
        navbar_bg: "#FFFFFF",
        navbar_text: "#451A03",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#92400E",
        bottom_bar_inactive: "#78350F",
        card_bg: "#FFFFFF",
        card_border: "#FDE68A",
        card_title: "#451A03",
        price_color: "#92400E",
        old_price_color: "#78350F",
        badge_bg: "#B91C1C",
        badge_text: "#FFFFFF",
        section_title: "#451A03",
        category_chip_bg: "#FEF3C7",
        category_chip_active: "#92400E",
        category_chip_text: "#451A03",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(69, 26, 3, 0.6)",
        modal_handle: "#FDE68A",
        btn_primary_bg: "#92400E",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#92400E"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FBBF24",
        primary_hover: "#FCD34D",
        primary_gradient_start: "#FBBF24",
        primary_gradient_end: "#B45309",
        accent: "#D97706",
        bg_body: "#180D04",
        card_bg: "#2D1808",
        bg_card: "#2D1808",
        bg_surface: "#40240E",
        text_main: "#FFFBEB",
        text_muted: "#FDE68A",
        border: "#78350F",
        navbar_bg: "#2D1808",
        navbar_text: "#FFFBEB",
        bottom_bar_bg: "#2D1808",
        bottom_bar_active: "#FBBF24",
        bottom_bar_inactive: "#FDE68A",
        card_border: "#78350F",
        card_title: "#FFFBEB",
        price_color: "#FBBF24",
        old_price_color: "#FDE68A",
        badge_bg: "#DC2626",
        badge_text: "#FFFFFF",
        section_title: "#FFFBEB",
        category_chip_bg: "#40240E",
        category_chip_active: "#FBBF24",
        category_chip_text: "#FFFBEB",
        modal_bg: "#2D1808",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#78350F",
        btn_primary_bg: "#FBBF24",
        btn_primary_text: "#180D04",
        chatbot_btn_bg: "#FBBF24"
      }
    },
    typography: { font_family: "Amiri", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "14px", button_radius: "8px", button_style: "rounded", card_style: "bordered" }
  },
  {
    id: "midnight_navy",
    name: "\u0643\u062D\u0644\u064A \u0644\u064A\u0644\u064A \u0641\u0627\u062E\u0631 \u{1F30C}",
    category: "\u0634\u0631\u0643\u0627\u062A \u0648\u0623\u062C\u0647\u0632\u0629",
    description: "\u0623\u0632\u0631\u0642 \u0643\u062D\u0644\u064A \u0631\u0635\u064A\u0646 \u0648\u0631\u0633\u0645\u064A \u0645\u0639 \u0644\u0645\u0633\u0627\u062A \u0632\u0631\u0642\u0627\u0621 \u0633\u0627\u0637\u0639\u0629 \u064A\u0639\u0643\u0633 \u0627\u0644\u062B\u0642\u0629 \u0648\u0627\u0644\u0645\u0635\u062F\u0627\u0642\u064A\u0629 \u0627\u0644\u0639\u0627\u0644\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#1E40AF",
        primary_hover: "#1E3A8A",
        primary_gradient_start: "#1E40AF",
        primary_gradient_end: "#3B82F6",
        accent: "#60A5FA",
        bg_body: "#F8FAFC",
        bg_card: "#FFFFFF",
        bg_surface: "#EFF6FF",
        text_main: "#0F172A",
        text_muted: "#475569",
        border: "#DBEAFE",
        navbar_bg: "#FFFFFF",
        navbar_text: "#0F172A",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#1E40AF",
        bottom_bar_inactive: "#475569",
        card_bg: "#FFFFFF",
        card_border: "#DBEAFE",
        card_title: "#0F172A",
        price_color: "#1E40AF",
        old_price_color: "#475569",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#0F172A",
        category_chip_bg: "#EFF6FF",
        category_chip_active: "#1E40AF",
        category_chip_text: "#0F172A",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(15, 23, 42, 0.6)",
        modal_handle: "#DBEAFE",
        btn_primary_bg: "#1E40AF",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#1E40AF"
      }
    },
    dark_theme: {
      colors: {
        primary: "#60A5FA",
        primary_hover: "#93C5FD",
        primary_gradient_start: "#60A5FA",
        primary_gradient_end: "#1E40AF",
        accent: "#38BDF8",
        bg_body: "#0A1128",
        card_bg: "#111D44",
        bg_card: "#111D44",
        bg_surface: "#1A2C63",
        text_main: "#F8FAFC",
        text_muted: "#94A3B8",
        border: "#1E3A8A",
        navbar_bg: "#111D44",
        navbar_text: "#F8FAFC",
        bottom_bar_bg: "#111D44",
        bottom_bar_active: "#60A5FA",
        bottom_bar_inactive: "#94A3B8",
        card_border: "#1E3A8A",
        card_title: "#F8FAFC",
        price_color: "#60A5FA",
        old_price_color: "#94A3B8",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#F8FAFC",
        category_chip_bg: "#1A2C63",
        category_chip_active: "#60A5FA",
        category_chip_text: "#F8FAFC",
        modal_bg: "#111D44",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#1E3A8A",
        btn_primary_bg: "#60A5FA",
        btn_primary_text: "#0A1128",
        chatbot_btn_bg: "#60A5FA"
      }
    },
    typography: { font_family: "Alexandria", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "16px", button_radius: "10px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "minimal_charcoal",
    name: "\u0641\u062D\u0645 \u0648\u0645\u0648\u0646\u0648\u0643\u0631\u0648\u0645 \u0639\u0635\u0631\u064A \u{1F5A4}",
    category: "\u0645\u064A\u0646\u064A\u0645\u0627\u0644 \u0648\u0628\u0633\u064A\u0637",
    description: "\u0623\u0633\u0644\u0648\u0628 \u0645\u0648\u0646\u0648\u0643\u0631\u0648\u0645 \u0645\u064A\u0646\u064A\u0645\u0627\u0644 \u0647\u0627\u062F\u0626 \u0648\u0646\u0638\u064A\u0641 \u064A\u0631\u0643\u0632 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0639\u0644\u0649 \u0625\u0628\u0631\u0627\u0632 \u0635\u0648\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u062F\u0642\u0629",
    light_theme: {
      colors: {
        primary: "#18181B",
        primary_hover: "#27272A",
        primary_gradient_start: "#18181B",
        primary_gradient_end: "#3F3F46",
        accent: "#52525B",
        bg_body: "#FAFAFA",
        bg_card: "#FFFFFF",
        bg_surface: "#F4F4F5",
        text_main: "#18181B",
        text_muted: "#71717A",
        border: "#E4E4E7",
        navbar_bg: "#FFFFFF",
        navbar_text: "#18181B",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#18181B",
        bottom_bar_inactive: "#71717A",
        card_bg: "#FFFFFF",
        card_border: "#E4E4E7",
        card_title: "#18181B",
        price_color: "#18181B",
        old_price_color: "#71717A",
        badge_bg: "#18181B",
        badge_text: "#FFFFFF",
        section_title: "#18181B",
        category_chip_bg: "#F4F4F5",
        category_chip_active: "#18181B",
        category_chip_text: "#FFFFFF",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(24, 24, 27, 0.6)",
        modal_handle: "#E4E4E7",
        btn_primary_bg: "#18181B",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#18181B"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FAFAFA",
        primary_hover: "#FFFFFF",
        primary_gradient_start: "#FAFAFA",
        primary_gradient_end: "#E4E4E7",
        accent: "#A1A1AA",
        bg_body: "#09090B",
        card_bg: "#18181B",
        bg_card: "#18181B",
        bg_surface: "#27272A",
        text_main: "#FAFAFA",
        text_muted: "#A1A1AA",
        border: "#27272A",
        navbar_bg: "#18181B",
        navbar_text: "#FAFAFA",
        bottom_bar_bg: "#18181B",
        bottom_bar_active: "#FAFAFA",
        bottom_bar_inactive: "#A1A1AA",
        card_border: "#27272A",
        card_title: "#FAFAFA",
        price_color: "#FAFAFA",
        old_price_color: "#71717A",
        badge_bg: "#FAFAFA",
        badge_text: "#09090B",
        section_title: "#FAFAFA",
        category_chip_bg: "#27272A",
        category_chip_active: "#FAFAFA",
        category_chip_text: "#09090B",
        modal_bg: "#18181B",
        modal_overlay: "rgba(0, 0, 0, 0.9)",
        modal_handle: "#3F3F46",
        btn_primary_bg: "#FAFAFA",
        btn_primary_text: "#09090B",
        chatbot_btn_bg: "#FAFAFA"
      }
    },
    typography: { font_family: "Tajawal", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "8px", button_radius: "4px", button_style: "square", card_style: "bordered" }
  },
  {
    id: "velvet_berry",
    name: "\u062A\u0648\u062A\u064A \u0645\u062E\u0645\u0644\u064A \u0645\u0644\u0643\u064A \u{1F347}",
    category: "\u0639\u0637\u0648\u0631 \u0648\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629",
    description: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062A\u0648\u062A \u0648\u0627\u0644\u0628\u0646\u0641\u0633\u062C \u0627\u0644\u0645\u062E\u0645\u0644\u064A \u0627\u0644\u0641\u0627\u062E\u0631 \u0644\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u0627\u0644\u0639\u0637\u0648\u0631\u060C \u0648\u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0641\u0627\u062E\u0631\u0629",
    light_theme: {
      colors: {
        primary: "#9333EA",
        primary_hover: "#7E22CE",
        primary_gradient_start: "#9333EA",
        primary_gradient_end: "#C084FC",
        accent: "#C084FC",
        bg_body: "#FAF5FF",
        bg_card: "#FFFFFF",
        bg_surface: "#F3E8FF",
        text_main: "#2E1065",
        text_muted: "#581C87",
        border: "#E9D5FF",
        navbar_bg: "#FFFFFF",
        navbar_text: "#2E1065",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#9333EA",
        bottom_bar_inactive: "#581C87",
        card_bg: "#FFFFFF",
        card_border: "#E9D5FF",
        card_title: "#2E1065",
        price_color: "#9333EA",
        old_price_color: "#581C87",
        badge_bg: "#BE185D",
        badge_text: "#FFFFFF",
        section_title: "#2E1065",
        category_chip_bg: "#F3E8FF",
        category_chip_active: "#9333EA",
        category_chip_text: "#2E1065",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(46, 16, 101, 0.6)",
        modal_handle: "#E9D5FF",
        btn_primary_bg: "#9333EA",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#9333EA"
      }
    },
    dark_theme: {
      colors: {
        primary: "#C084FC",
        primary_hover: "#E9D5FF",
        primary_gradient_start: "#C084FC",
        primary_gradient_end: "#9333EA",
        accent: "#E879F9",
        bg_body: "#17072B",
        card_bg: "#2B0E4E",
        bg_card: "#2B0E4E",
        bg_surface: "#3F1570",
        text_main: "#FAF5FF",
        text_muted: "#E9D5FF",
        border: "#581C87",
        navbar_bg: "#2B0E4E",
        navbar_text: "#FAF5FF",
        bottom_bar_bg: "#2B0E4E",
        bottom_bar_active: "#C084FC",
        bottom_bar_inactive: "#E9D5FF",
        card_border: "#581C87",
        card_title: "#FAF5FF",
        price_color: "#C084FC",
        old_price_color: "#E9D5FF",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#FAF5FF",
        category_chip_bg: "#3F1570",
        category_chip_active: "#C084FC",
        category_chip_text: "#FAF5FF",
        modal_bg: "#2B0E4E",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#581C87",
        btn_primary_bg: "#C084FC",
        btn_primary_text: "#17072B",
        chatbot_btn_bg: "#C084FC"
      }
    },
    typography: { font_family: "Readex Pro", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "22px", button_radius: "14px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "forest_olive",
    name: "\u0632\u064A\u062A\u0648\u0646\u064A \u0648\u063A\u0627\u0628\u0627\u062A \u0637\u0628\u064A\u0639\u064A\u0629 \u{1F332}",
    category: "\u0632\u0631\u0627\u0639\u0629 \u0648\u0623\u0639\u0634\u0627\u0628",
    description: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0632\u064A\u062A\u0648\u0646\u064A \u0648\u0627\u0644\u063A\u0627\u0628\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u062A\u0639\u0632\u0632 \u0627\u0644\u0625\u062D\u0633\u0627\u0633 \u0628\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0648\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0646\u0642\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#4D7C0F",
        primary_hover: "#3F6212",
        primary_gradient_start: "#4D7C0F",
        primary_gradient_end: "#84CC16",
        accent: "#84CC16",
        bg_body: "#F7FEE7",
        bg_card: "#FFFFFF",
        bg_surface: "#ECFCCB",
        text_main: "#1A2E05",
        text_muted: "#365314",
        border: "#D9F99D",
        navbar_bg: "#FFFFFF",
        navbar_text: "#1A2E05",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#4D7C0F",
        bottom_bar_inactive: "#365314",
        card_bg: "#FFFFFF",
        card_border: "#D9F99D",
        card_title: "#1A2E05",
        price_color: "#4D7C0F",
        old_price_color: "#365314",
        badge_bg: "#B91C1C",
        badge_text: "#FFFFFF",
        section_title: "#1A2E05",
        category_chip_bg: "#ECFCCB",
        category_chip_active: "#4D7C0F",
        category_chip_text: "#1A2E05",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(26, 46, 5, 0.6)",
        modal_handle: "#D9F99D",
        btn_primary_bg: "#4D7C0F",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#4D7C0F"
      }
    },
    dark_theme: {
      colors: {
        primary: "#A3E635",
        primary_hover: "#BEF264",
        primary_gradient_start: "#A3E635",
        primary_gradient_end: "#4D7C0F",
        accent: "#84CC16",
        bg_body: "#0B1703",
        card_bg: "#182F07",
        bg_card: "#182F07",
        bg_surface: "#24440B",
        text_main: "#F7FEE7",
        text_muted: "#D9F99D",
        border: "#365314",
        navbar_bg: "#182F07",
        navbar_text: "#F7FEE7",
        bottom_bar_bg: "#182F07",
        bottom_bar_active: "#A3E635",
        bottom_bar_inactive: "#D9F99D",
        card_border: "#365314",
        card_title: "#F7FEE7",
        price_color: "#A3E635",
        old_price_color: "#D9F99D",
        badge_bg: "#EA580C",
        badge_text: "#FFFFFF",
        section_title: "#F7FEE7",
        category_chip_bg: "#24440B",
        category_chip_active: "#A3E635",
        category_chip_text: "#F7FEE7",
        modal_bg: "#182F07",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#365314",
        btn_primary_bg: "#A3E635",
        btn_primary_text: "#0B1703",
        chatbot_btn_bg: "#A3E635"
      }
    },
    typography: { font_family: "Almarai", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "16px", button_radius: "10px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "turquoise_lagoon",
    name: "\u062A\u0631\u0643\u0648\u0627\u0632 \u0644\u0627\u062C\u0648\u0646 \u0627\u0633\u062A\u0648\u0627\u0626\u064A \u{1F3DD}\uFE0F",
    category: "\u0635\u064A\u0641 \u0648\u0631\u062D\u0644\u0627\u062A",
    description: "\u0645\u0632\u064A\u062C \u062D\u064A\u0648\u064A \u0645\u0646 \u0627\u0644\u062A\u0631\u0643\u0648\u0627\u0632 \u0648\u0627\u0644\u0623\u0632\u0631\u0642 \u0627\u0644\u0627\u0633\u062A\u0648\u0627\u0626\u064A \u064A\u0646\u0627\u0633\u0628 \u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0635\u064A\u0641\u060C \u0627\u0644\u0631\u062D\u0644\u0627\u062A\u060C \u0648\u0627\u0644\u0631\u064A\u0627\u0636\u0627\u062A \u0627\u0644\u0645\u0627\u0626\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#0284C7",
        primary_hover: "#0369A1",
        primary_gradient_start: "#0284C7",
        primary_gradient_end: "#14B8A6",
        accent: "#14B8A6",
        bg_body: "#F0FDFA",
        bg_card: "#FFFFFF",
        bg_surface: "#CCFBF1",
        text_main: "#0C4A6E",
        text_muted: "#0F766E",
        border: "#99F6E4",
        navbar_bg: "#FFFFFF",
        navbar_text: "#0C4A6E",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#0284C7",
        bottom_bar_inactive: "#0F766E",
        card_bg: "#FFFFFF",
        card_border: "#99F6E4",
        card_title: "#0C4A6E",
        price_color: "#0284C7",
        old_price_color: "#0F766E",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#0C4A6E",
        category_chip_bg: "#CCFBF1",
        category_chip_active: "#0284C7",
        category_chip_text: "#0C4A6E",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(12, 74, 110, 0.6)",
        modal_handle: "#99F6E4",
        btn_primary_bg: "#0284C7",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#0284C7"
      }
    },
    dark_theme: {
      colors: {
        primary: "#2DD4BF",
        primary_hover: "#5EEAD4",
        primary_gradient_start: "#2DD4BF",
        primary_gradient_end: "#38BDF8",
        accent: "#38BDF8",
        bg_body: "#031D24",
        card_bg: "#08333E",
        bg_card: "#08333E",
        bg_surface: "#0D4A59",
        text_main: "#F0FDFA",
        text_muted: "#99F6E4",
        border: "#115E59",
        navbar_bg: "#08333E",
        navbar_text: "#F0FDFA",
        bottom_bar_bg: "#08333E",
        bottom_bar_active: "#2DD4BF",
        bottom_bar_inactive: "#99F6E4",
        card_border: "#115E59",
        card_title: "#F0FDFA",
        price_color: "#2DD4BF",
        old_price_color: "#99F6E4",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#F0FDFA",
        category_chip_bg: "#0D4A59",
        category_chip_active: "#2DD4BF",
        category_chip_text: "#F0FDFA",
        modal_bg: "#08333E",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#115E59",
        btn_primary_bg: "#2DD4BF",
        btn_primary_text: "#031D24",
        chatbot_btn_bg: "#2DD4BF"
      }
    },
    typography: { font_family: "Tajawal", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "18px", button_radius: "12px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "french_bronze",
    name: "\u0628\u0631\u0648\u0646\u0632\u064A \u0648\u0628\u0646\u064A \u0643\u0644\u0627\u0633\u064A\u0643 \u{1F3FA}",
    category: "\u0623\u0646\u062A\u064A\u0643 \u0648\u062C\u0644\u0648\u062F",
    description: "\u0641\u062E\u0627\u0645\u0629 \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062C\u0644\u062F \u0648\u0627\u0644\u0628\u0631\u0648\u0646\u0632 \u0644\u0644\u0645\u0635\u0646\u0648\u0639\u0627\u062A \u0627\u0644\u064A\u062F\u0648\u064A\u0629\u060C \u0627\u0644\u0633\u0644\u0639 \u0627\u0644\u062C\u0644\u062F\u064A\u0629\u060C \u0648\u0627\u0644\u062A\u062D\u0641",
    light_theme: {
      colors: {
        primary: "#854D0E",
        primary_hover: "#713F12",
        primary_gradient_start: "#854D0E",
        primary_gradient_end: "#CA8A04",
        accent: "#CA8A04",
        bg_body: "#FEFCE8",
        bg_card: "#FFFFFF",
        bg_surface: "#FEF9C3",
        text_main: "#422006",
        text_muted: "#713F12",
        border: "#FEF08A",
        navbar_bg: "#FFFFFF",
        navbar_text: "#422006",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#854D0E",
        bottom_bar_inactive: "#713F12",
        card_bg: "#FFFFFF",
        card_border: "#FEF08A",
        card_title: "#422006",
        price_color: "#854D0E",
        old_price_color: "#713F12",
        badge_bg: "#B91C1C",
        badge_text: "#FFFFFF",
        section_title: "#422006",
        category_chip_bg: "#FEF9C3",
        category_chip_active: "#854D0E",
        category_chip_text: "#422006",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(66, 32, 6, 0.6)",
        modal_handle: "#FEF08A",
        btn_primary_bg: "#854D0E",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#854D0E"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FACC15",
        primary_hover: "#FDE047",
        primary_gradient_start: "#FACC15",
        primary_gradient_end: "#854D0E",
        accent: "#EAB308",
        bg_body: "#1B1202",
        card_bg: "#312105",
        bg_card: "#312105",
        bg_surface: "#473209",
        text_main: "#FEFCE8",
        text_muted: "#FEF08A",
        border: "#713F12",
        navbar_bg: "#312105",
        navbar_text: "#FEFCE8",
        bottom_bar_bg: "#312105",
        bottom_bar_active: "#FACC15",
        bottom_bar_inactive: "#FEF08A",
        card_border: "#713F12",
        card_title: "#FEFCE8",
        price_color: "#FACC15",
        old_price_color: "#FEF08A",
        badge_bg: "#EA580C",
        badge_text: "#FFFFFF",
        section_title: "#FEFCE8",
        category_chip_bg: "#473209",
        category_chip_active: "#FACC15",
        category_chip_text: "#FEFCE8",
        modal_bg: "#312105",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#713F12",
        btn_primary_bg: "#FACC15",
        btn_primary_text: "#1B1202",
        chatbot_btn_bg: "#FACC15"
      }
    },
    typography: { font_family: "Amiri", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "12px", button_radius: "6px", button_style: "square", card_style: "bordered" }
  },
  {
    id: "soft_lavender",
    name: "\u0628\u0627\u0633\u062A\u064A\u0644 \u0644\u0627\u0641\u0646\u062F\u0631 \u0647\u0627\u062F\u0626 \u{1FABB}",
    category: "\u0643\u062A\u0628 \u0648\u0642\u0631\u0637\u0627\u0633\u064A\u0629",
    description: "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0628\u0627\u0633\u062A\u064A\u0644 \u0648\u0627\u0644\u0644\u0627\u0641\u0646\u062F\u0631 \u0627\u0644\u0647\u0627\u062F\u0626\u0629 \u0648\u0627\u0644\u0645\u0631\u064A\u062D\u0629 \u0644\u0644\u0645\u0643\u062A\u0628\u0627\u062A\u060C \u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0623\u0637\u0641\u0627\u0644\u060C \u0648\u0627\u0644\u0642\u0631\u0637\u0627\u0633\u064A\u0629 \u0627\u0644\u0631\u0627\u0642\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#6366F1",
        primary_hover: "#4F46E5",
        primary_gradient_start: "#6366F1",
        primary_gradient_end: "#818CF8",
        accent: "#818CF8",
        bg_body: "#EEF2FF",
        bg_card: "#FFFFFF",
        bg_surface: "#E0E7FF",
        text_main: "#1E1B4B",
        text_muted: "#4338CA",
        border: "#C7D2FE",
        navbar_bg: "#FFFFFF",
        navbar_text: "#1E1B4B",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#6366F1",
        bottom_bar_inactive: "#4338CA",
        card_bg: "#FFFFFF",
        card_border: "#C7D2FE",
        card_title: "#1E1B4B",
        price_color: "#6366F1",
        old_price_color: "#4338CA",
        badge_bg: "#EC4899",
        badge_text: "#FFFFFF",
        section_title: "#1E1B4B",
        category_chip_bg: "#E0E7FF",
        category_chip_active: "#6366F1",
        category_chip_text: "#1E1B4B",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(30, 27, 75, 0.6)",
        modal_handle: "#C7D2FE",
        btn_primary_bg: "#6366F1",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#6366F1"
      }
    },
    dark_theme: {
      colors: {
        primary: "#818CF8",
        primary_hover: "#A5B4FC",
        primary_gradient_start: "#818CF8",
        primary_gradient_end: "#6366F1",
        accent: "#A78BFA",
        bg_body: "#0D102B",
        card_bg: "#171B47",
        bg_card: "#171B47",
        bg_surface: "#222863",
        text_main: "#EEF2FF",
        text_muted: "#C7D2FE",
        border: "#3730A3",
        navbar_bg: "#171B47",
        navbar_text: "#EEF2FF",
        bottom_bar_bg: "#171B47",
        bottom_bar_active: "#818CF8",
        bottom_bar_inactive: "#C7D2FE",
        card_border: "#3730A3",
        card_title: "#EEF2FF",
        price_color: "#818CF8",
        old_price_color: "#C7D2FE",
        badge_bg: "#F43F5E",
        badge_text: "#FFFFFF",
        section_title: "#EEF2FF",
        category_chip_bg: "#222863",
        category_chip_active: "#818CF8",
        category_chip_text: "#EEF2FF",
        modal_bg: "#171B47",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#3730A3",
        btn_primary_bg: "#818CF8",
        btn_primary_text: "#0D102B",
        chatbot_btn_bg: "#818CF8"
      }
    },
    typography: { font_family: "Readex Pro", base_size: "16px", heading_weight: "700" },
    shapes: { card_radius: "20px", button_radius: "9999px", button_style: "pill", card_style: "elevated" }
  },
  {
    id: "burgundy_wine",
    name: "\u0646\u0628\u064A\u0630\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0641\u0627\u062E\u0631 \u{1F377}",
    category: "\u0641\u062E\u0627\u0645\u0629 \u0648\u0633\u0647\u0631\u0627\u062A",
    description: "\u0623\u062D\u0645\u0631 \u0639\u0646\u0627\u0628\u064A \u0641\u0627\u062E\u0631 \u0648\u0643\u0644\u0627\u0633\u064A\u0643\u064A \u064A\u0639\u0643\u0633 \u0623\u0635\u0627\u0644\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0648\u0633\u0647\u0631\u0627\u062A \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
    light_theme: {
      colors: {
        primary: "#9F1239",
        primary_hover: "#881337",
        primary_gradient_start: "#9F1239",
        primary_gradient_end: "#BE123C",
        accent: "#BE123C",
        bg_body: "#FFF1F2",
        bg_card: "#FFFFFF",
        bg_surface: "#FFE4E6",
        text_main: "#4C0519",
        text_muted: "#881337",
        border: "#FECDD3",
        navbar_bg: "#FFFFFF",
        navbar_text: "#4C0519",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#9F1239",
        bottom_bar_inactive: "#881337",
        card_bg: "#FFFFFF",
        card_border: "#FECDD3",
        card_title: "#4C0519",
        price_color: "#9F1239",
        old_price_color: "#881337",
        badge_bg: "#881337",
        badge_text: "#FFFFFF",
        section_title: "#4C0519",
        category_chip_bg: "#FFE4E6",
        category_chip_active: "#9F1239",
        category_chip_text: "#4C0519",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(76, 5, 25, 0.6)",
        modal_handle: "#FECDD3",
        btn_primary_bg: "#9F1239",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#9F1239"
      }
    },
    dark_theme: {
      colors: {
        primary: "#FB7185",
        primary_hover: "#FDA4AF",
        primary_gradient_start: "#FB7185",
        primary_gradient_end: "#9F1239",
        accent: "#E11D48",
        bg_body: "#1F040C",
        card_bg: "#3B0A19",
        bg_card: "#3B0A19",
        bg_surface: "#520F24",
        text_main: "#FFF1F2",
        text_muted: "#FECDD3",
        border: "#881337",
        navbar_bg: "#3B0A19",
        navbar_text: "#FFF1F2",
        bottom_bar_bg: "#3B0A19",
        bottom_bar_active: "#FB7185",
        bottom_bar_inactive: "#FECDD3",
        card_border: "#881337",
        card_title: "#FFF1F2",
        price_color: "#FB7185",
        old_price_color: "#FECDD3",
        badge_bg: "#9F1239",
        badge_text: "#FFFFFF",
        section_title: "#FFF1F2",
        category_chip_bg: "#520F24",
        category_chip_active: "#FB7185",
        category_chip_text: "#FFF1F2",
        modal_bg: "#3B0A19",
        modal_overlay: "rgba(0, 0, 0, 0.85)",
        modal_handle: "#881337",
        btn_primary_bg: "#FB7185",
        btn_primary_text: "#1F040C",
        chatbot_btn_bg: "#FB7185"
      }
    },
    typography: { font_family: "Cairo", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "16px", button_radius: "10px", button_style: "rounded", card_style: "elevated" }
  },
  {
    id: "electric_lime",
    name: "\u0644\u064A\u0645\u0648\u0646\u064A \u0646\u064A\u0648\u0646 \u0631\u064A\u0627\u0636\u064A \u{1F50B}",
    category: "\u0631\u064A\u0627\u0636\u0629 \u0648\u0644\u064A\u0627\u0642\u0629",
    description: "\u0623\u062E\u0636\u0631 \u0644\u064A\u0645\u0648\u0646\u064A \u0646\u064A\u0648\u0646 \u0645\u0634\u0639 \u0648\u062D\u064A\u0648\u064A \u0648\u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0623\u062D\u0630\u064A\u0629 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0648\u0627\u0644\u0645\u0643\u0645\u0644\u0627\u062A \u0648\u0627\u0644\u0644\u064A\u0627\u0642\u0629 \u0627\u0644\u0628\u062F\u0646\u064A\u0629",
    light_theme: {
      colors: {
        primary: "#65A30D",
        primary_hover: "#4D7C0F",
        primary_gradient_start: "#65A30D",
        primary_gradient_end: "#84CC16",
        accent: "#84CC16",
        bg_body: "#F7FEE7",
        bg_card: "#FFFFFF",
        bg_surface: "#ECFCCB",
        text_main: "#1A2E05",
        text_muted: "#365314",
        border: "#D9F99D",
        navbar_bg: "#FFFFFF",
        navbar_text: "#1A2E05",
        bottom_bar_bg: "#FFFFFF",
        bottom_bar_active: "#65A30D",
        bottom_bar_inactive: "#365314",
        card_bg: "#FFFFFF",
        card_border: "#D9F99D",
        card_title: "#1A2E05",
        price_color: "#65A30D",
        old_price_color: "#365314",
        badge_bg: "#DC2626",
        badge_text: "#FFFFFF",
        section_title: "#1A2E05",
        category_chip_bg: "#ECFCCB",
        category_chip_active: "#65A30D",
        category_chip_text: "#1A2E05",
        modal_bg: "#FFFFFF",
        modal_overlay: "rgba(26, 46, 5, 0.6)",
        modal_handle: "#D9F99D",
        btn_primary_bg: "#65A30D",
        btn_primary_text: "#FFFFFF",
        chatbot_btn_bg: "#65A30D"
      }
    },
    dark_theme: {
      colors: {
        primary: "#A3E635",
        primary_hover: "#BEF264",
        primary_gradient_start: "#A3E635",
        primary_gradient_end: "#22C55E",
        accent: "#22C55E",
        bg_body: "#071302",
        card_bg: "#112606",
        bg_card: "#112606",
        bg_surface: "#1B390B",
        text_main: "#F7FEE7",
        text_muted: "#D9F99D",
        border: "#365314",
        navbar_bg: "#112606",
        navbar_text: "#F7FEE7",
        bottom_bar_bg: "#112606",
        bottom_bar_active: "#A3E635",
        bottom_bar_inactive: "#D9F99D",
        card_border: "#365314",
        card_title: "#F7FEE7",
        price_color: "#A3E635",
        old_price_color: "#D9F99D",
        badge_bg: "#EF4444",
        badge_text: "#FFFFFF",
        section_title: "#F7FEE7",
        category_chip_bg: "#1B390B",
        category_chip_active: "#A3E635",
        category_chip_text: "#F7FEE7",
        modal_bg: "#112606",
        modal_overlay: "rgba(0, 0, 0, 0.9)",
        modal_handle: "#365314",
        btn_primary_bg: "#A3E635",
        btn_primary_text: "#071302",
        chatbot_btn_bg: "#A3E635"
      }
    },
    typography: { font_family: "Changa", base_size: "16px", heading_weight: "800" },
    shapes: { card_radius: "14px", button_radius: "6px", button_style: "square", card_style: "bordered" }
  }
];
function sanitizeStorefrontConfig(inputConfig = {}, _tier = "free") {
  const notices = [];
  if (!inputConfig || typeof inputConfig !== "object") {
    return { sanitizedConfig: JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG)), notices };
  }
  const merged = {
    ...DEFAULT_STOREFRONT_CONFIG,
    ...inputConfig,
    store_identity: { ...DEFAULT_STOREFRONT_CONFIG.store_identity, ...inputConfig.store_identity || {} },
    products_settings: { ...DEFAULT_STOREFRONT_CONFIG.products_settings, ...inputConfig.products_settings || {} },
    messages: { ...DEFAULT_STOREFRONT_CONFIG.messages, ...inputConfig.messages || {} },
    modals_customization: { ...DEFAULT_STOREFRONT_CONFIG.modals_customization, ...inputConfig.modals_customization || {} },
    light_theme: {
      ...DEFAULT_STOREFRONT_CONFIG.light_theme,
      ...inputConfig.light_theme || {},
      colors: { ...DEFAULT_STOREFRONT_CONFIG.light_theme.colors, ...inputConfig.light_theme?.colors || inputConfig.modes?.light?.colors || {} }
    },
    dark_theme: {
      ...DEFAULT_STOREFRONT_CONFIG.dark_theme,
      ...inputConfig.dark_theme || {},
      colors: { ...DEFAULT_STOREFRONT_CONFIG.dark_theme.colors, ...inputConfig.dark_theme?.colors || inputConfig.modes?.dark?.colors || {} }
    },
    typography: { ...DEFAULT_STOREFRONT_CONFIG.typography, ...inputConfig.typography || {} },
    shapes: { ...DEFAULT_STOREFRONT_CONFIG.shapes, ...inputConfig.shapes || {} },
    navigation_settings: {
      bottom_bar: {
        items: normalizeBottomNavItems(inputConfig.navigation_settings?.bottom_bar?.items)
      },
      top_bar: normalizeTopBarSettings({
        ...DEFAULT_STOREFRONT_CONFIG.navigation_settings.top_bar,
        ...inputConfig.navigation_settings?.top_bar || {}
      })
    },
    marketing: { ...DEFAULT_STOREFRONT_CONFIG.marketing, ...inputConfig.marketing || {} },
    layout_blocks: Array.isArray(inputConfig.layout_blocks) && inputConfig.layout_blocks.length > 0 ? inputConfig.layout_blocks : DEFAULT_STOREFRONT_CONFIG.layout_blocks
  };
  const safeNavigationSettings = merged.navigation_settings ?? DEFAULT_STOREFRONT_CONFIG.navigation_settings;
  const visibleBottomCount = safeNavigationSettings.bottom_bar.items.filter((item) => item.visible !== false).length;
  if (visibleBottomCount < 2) {
    safeNavigationSettings.bottom_bar.items = DEFAULT_STOREFRONT_CONFIG.navigation_settings.bottom_bar.items.map((item, index) => ({
      ...item,
      visible: index < 2,
      order: index + 1
    }));
    merged.navigation_settings = safeNavigationSettings;
    notices.push("\u062A\u0645 \u0625\u0635\u0644\u0627\u062D \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0639\u0646\u0635\u0631\u064A\u0646 \u0645\u0631\u0626\u064A\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.");
  }
  return { sanitizedConfig: merged, notices };
}

// src/core/EventBus.ts
var EventBus = class _EventBus {
  static instance;
  listeners = /* @__PURE__ */ new Map();
  constructor() {
  }
  static getInstance() {
    if (!_EventBus.instance) {
      _EventBus.instance = new _EventBus();
    }
    return _EventBus.instance;
  }
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }
  once(event, handler) {
    const wrapped = (payload) => {
      this.off(event, wrapped);
      handler(payload);
    };
    this.on(event, wrapped);
  }
  off(event, handler) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(handler);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in event listener for "${event}":`, err);
        }
      });
    }
  }
  clear() {
    this.listeners.clear();
  }
};
var events = EventBus.getInstance();

// src/core/StoreState.ts
var StoreState = class _StoreState {
  static instance;
  user = { loggedIn: false };
  products = [];
  categories = [];
  activeCategory = "all";
  favorites = /* @__PURE__ */ new Set();
  cart = {
    items: [],
    discount_amount: 0,
    delivery_fee: 0
  };
  config = null;
  storeId = "nalsh_mall";
  constructor() {
    this.initFromStorage();
    this.setupStorageListener();
  }
  static getInstance() {
    if (!_StoreState.instance) {
      _StoreState.instance = new _StoreState();
    }
    return _StoreState.instance;
  }
  initFromStorage() {
    try {
      const savedUser = localStorage.getItem("nalsh_user_session");
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
      const savedCart = localStorage.getItem("nalsh_cart_items");
      if (savedCart) {
        this.cart.items = JSON.parse(savedCart);
      }
      const savedFavs = localStorage.getItem("nalsh_favorites");
      if (savedFavs) {
        const favArray = JSON.parse(savedFavs);
        this.favorites = new Set(favArray);
      }
    } catch (e) {
      console.warn("[StoreState] Failed to initialize state from storage:", e);
    }
  }
  setupStorageListener() {
    window.addEventListener("storage", (e) => {
      if (e.key === "nalsh_cart_items" && e.newValue) {
        try {
          this.cart.items = JSON.parse(e.newValue);
          events.emit("cart:updated", this.getCart());
        } catch {
        }
      } else if (e.key === "nalsh_user_session" && e.newValue) {
        try {
          this.user = JSON.parse(e.newValue);
          events.emit("user:changed", this.user);
        } catch {
        }
      } else if (e.key === "nalsh_favorites" && e.newValue) {
        try {
          this.favorites = new Set(JSON.parse(e.newValue));
          events.emit("favorites:updated", Array.from(this.favorites));
        } catch {
        }
      }
    });
  }
  // === User Session ===
  setUser(user) {
    this.user = user;
    if (user.loggedIn && user.token) {
      localStorage.setItem("customer_token", user.token);
      localStorage.setItem("nalsh_user_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("nalsh_user_session");
    }
    events.emit("user:changed", this.user);
  }
  logout() {
    this.setUser({ loggedIn: false });
  }
  // === Products & Catalog ===
  setProducts(products) {
    this.products = products;
    window.allProducts = products;
    events.emit("products:loaded", products);
  }
  setCategories(categories) {
    this.categories = categories;
    events.emit("categories:loaded", categories);
  }
  setActiveCategory(categoryId) {
    this.activeCategory = categoryId;
    events.emit("category:selected", categoryId);
  }
  // === Cart Management ===
  addToCart(item) {
    const qty = item.quantity || 1;
    const existingIndex = this.cart.items.findIndex((i) => {
      if (item.selected_variation && i.selected_variation) {
        return i.product_id === item.product_id && i.selected_variation.id === item.selected_variation.id;
      }
      return i.product_id === item.product_id;
    });
    if (existingIndex > -1) {
      this.cart.items[existingIndex].quantity += qty;
    } else {
      this.cart.items.push({ ...item, quantity: qty });
    }
    this.saveCart();
    events.emit("cart:item-added", item);
  }
  updateCartItemQuantity(index, delta) {
    if (index >= 0 && index < this.cart.items.length) {
      const item = this.cart.items[index];
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.cart.items.splice(index, 1);
      }
      this.saveCart();
    }
  }
  removeCartItem(index) {
    if (index >= 0 && index < this.cart.items.length) {
      this.cart.items.splice(index, 1);
      this.saveCart();
    }
  }
  clearCart() {
    this.cart.items = [];
    this.cart.discount_amount = 0;
    this.cart.coupon_code = void 0;
    this.saveCart();
  }
  saveCart() {
    localStorage.setItem("nalsh_cart_items", JSON.stringify(this.cart.items));
    events.emit("cart:updated", this.getCart());
  }
  getCart() {
    const subtotal = this.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = this.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = Math.max(0, subtotal - this.cart.discount_amount + this.cart.delivery_fee);
    return {
      ...this.cart,
      totalItems,
      subtotal,
      total
    };
  }
  // === Favorites / Wishlist ===
  toggleFavorite(productId) {
    const isFav = this.favorites.has(productId);
    if (isFav) {
      this.favorites.delete(productId);
    } else {
      this.favorites.add(productId);
    }
    const favArray = Array.from(this.favorites);
    localStorage.setItem("nalsh_favorites", JSON.stringify(favArray));
    events.emit("favorites:updated", favArray);
    return !isFav;
  }
  isFavorite(productId) {
    return this.favorites.has(productId);
  }
  // === Theme & Configuration ===
  setConfig(config) {
    this.config = config;
    events.emit("config:updated", config);
  }
};
var state = StoreState.getInstance();

// src/core/ApiClient.ts
var MAIN_API_URL = "https://api.nalsh.dpdns.org/api.php";
function resolveWorkerApiUrl() {
  if (typeof window !== "undefined") {
    const configured = window.WORKER_API_URL || window.CF_WORKER_URL || window.CLOUDFLARE_WORKER_URL;
    if (configured) {
      if (typeof configured === "string") {
        const trimmed = configured.trim();
        if (trimmed === "/api/worker" || trimmed === "/api/worker/") {
          return "/api/worker/";
        }
        if (trimmed.includes("://")) {
          const withoutSlash = trimmed.replace(/\/$/, "");
          return withoutSlash.endsWith("/api/worker") ? `${withoutSlash}/` : `${withoutSlash}/api/worker/`;
        }
        return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
      }
    }
    const directRoot = window.CF_WORKER_URL;
    if (typeof directRoot === "string") {
      return `${directRoot.replace(/\/$/, "")}/api/worker/`;
    }
  }
  const fallbackWorkers = [
    "/api/worker/",
    "https://api.nalsh.dpdns.org/api.php"
  ];
  return fallbackWorkers[0];
}
var WORKER_API_URL = resolveWorkerApiUrl();
var WORKER_ACTIONS = /* @__PURE__ */ new Set([
  "check_customer_session",
  "verify_cart_live",
  "create_order",
  "get_user_orders",
  "add_to_cart",
  "get_cart",
  "save_product",
  "list_products",
  "delete_product",
  "toggle_availability",
  "get_merchant_orders",
  "get_orders",
  "update_order_status",
  "cancel_order",
  "confirm_delivery_code",
  "get_stats",
  "get_merchant_settings",
  "save_merchant_settings",
  "save_fcm_token",
  "get_firebase_config",
  "get_categories_tree",
  "get_public_products",
  "get_ai_assistant_config",
  "save_ai_assistant_config",
  "get_whatsapp_config",
  "save_whatsapp_config",
  "ai_chat"
]);
var ApiClient = class {
  static async request(action, data = {}, options = {}) {
    const {
      method = "POST",
      silent = false,
      timeoutMs = 12e3,
      retries = 1
    } = options;
    const payload = { action, ...data };
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const token = localStorage.getItem("customer_token");
    const useWorker = WORKER_ACTIONS.has(action);
    if (token) {
      headers["Authorization"] = "Bearer " + token;
      if (!useWorker) {
        payload["auth_token"] = token;
      }
    }
    const targetUrl = useWorker ? WORKER_API_URL : MAIN_API_URL;
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const response = await fetch(targetUrl, {
          method,
          headers,
          credentials: useWorker ? "omit" : "include",
          body: method === "GET" ? void 0 : JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (response.status === 401) {
          state.logout();
          events.emit("auth:unauthorized");
          if (!silent) {
            events.emit("toast:show", {
              message: "\u0627\u0646\u062A\u0647\u062A \u0627\u0644\u062C\u0644\u0633\u0629\u060C \u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062C\u062F\u062F\u0627\u064B",
              type: "error"
            });
          }
          throw new Error("Unauthorized");
        }
        const result = await response.json();
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < retries && err.name !== "AbortError") {
          await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
        }
      }
    }
    console.error(`[ApiClient] Request failed for action "${action}":`, lastError);
    throw lastError;
  }
};
var api = ApiClient.request;

// src/studio/state.ts
var StudioState = class _StudioState {
  static instance;
  config;
  activeTab = "identity";
  activeProductSubTab = "portrait";
  currentDevice = "mobile";
  isDarkPreview = false;
  selectedCategoryForOverride = "";
  // 🔐 بيانات وهوية التاجر المعتمد
  merchantToken = "";
  merchantUsername = "store";
  merchantStoreName = "";
  merchantUserId = 0;
  merchantPlanType = "free";
  isCloudSynced = false;
  isGuestMode = false;
  mobileView = "controls";
  storeBaseConfig = null;
  historyStack = [];
  historyIndex = -1;
  listeners = [];
  debounceHistoryTimer = null;
  liveUpdateScheduled = false;
  constructor() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG));
  }
  static getInstance() {
    if (!_StudioState.instance) {
      _StudioState.instance = new _StudioState();
    }
    return _StudioState.instance;
  }
  init() {
    this.extractMerchantAuth();
    this.loadInitialConfig();
    this.pushHistory();
  }
  /**
   * التحقق من جلسة التاجر واستخراج هويته مع دعم الوضع التجريبي
   */
  extractMerchantAuth() {
    const token = localStorage.getItem("merchant_token") || sessionStorage.getItem("merchant_token");
    if (!token) {
      this.isGuestMode = true;
      this.merchantUsername = "demo_store";
      this.merchantStoreName = "\u0645\u062A\u062C\u0631 \u062A\u062C\u0631\u064A\u0628\u064A";
      this.merchantPlanType = "premium";
      return;
    }
    this.merchantToken = token;
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp && Date.now() >= payload.exp * 1e3) {
          localStorage.removeItem("merchant_token");
          sessionStorage.removeItem("merchant_token");
          this.isGuestMode = true;
          this.merchantUsername = "demo_store";
          this.merchantStoreName = "\u0645\u062A\u062C\u0631 \u062A\u062C\u0631\u064A\u0628\u064A (\u062C\u0644\u0633\u0629 \u0645\u0646\u062A\u0647\u064A\u0629)";
          return;
        }
        if (payload.role !== "merchant") {
          this.isGuestMode = true;
          this.merchantUsername = "demo_store";
          this.merchantStoreName = "\u0645\u062A\u062C\u0631 \u062A\u062C\u0631\u064A\u0628\u064A";
          return;
        }
        this.merchantUsername = payload.username || "store";
        this.merchantStoreName = payload.store_name || payload.username || "\u0645\u062A\u062C\u0631\u064A";
        this.merchantUserId = Number(payload.user_id || payload.id || 0);
        this.merchantPlanType = payload.plan_type || "free";
      }
    } catch (e) {
      console.error("Error decoding merchant token:", e);
      this.isGuestMode = true;
    }
  }
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
  notify(changeType = "live_update") {
    this.listeners.forEach((fn) => fn(this.config, this.activeTab, changeType));
  }
  setActiveTab(tab) {
    this.activeTab = tab;
    if (tab === "light_colors") {
      this.setPreviewDarkMode(false);
    } else if (tab === "dark_colors") {
      this.setPreviewDarkMode(true);
    }
    this.notify("tab");
  }
  setProductSubTab(subTab) {
    this.activeProductSubTab = subTab;
    if (subTab === "landscape") {
      this.setDevice("desktop");
    } else if (subTab === "portrait") {
      this.setDevice("mobile");
    } else {
      this.notify("full_sync");
    }
  }
  setDevice(device) {
    this.currentDevice = device;
    if (this.activeTab === "products_layout") {
      if (device === "mobile" && this.activeProductSubTab !== "portrait" && this.activeProductSubTab !== "categories") {
        this.activeProductSubTab = "portrait";
      } else if ((device === "desktop" || device === "tablet") && this.activeProductSubTab !== "landscape" && this.activeProductSubTab !== "categories") {
        this.activeProductSubTab = "landscape";
      }
    }
    this.notify("device");
  }
  setMobileView(view) {
    this.mobileView = view;
    this.notify("mobile_view");
  }
  setPreviewDarkMode(isDark) {
    this.isDarkPreview = isDark;
    this.syncIframeTheme(isDark);
    this.sendLiveUpdateToPreview();
    this.notify("dark_mode");
  }
  togglePreviewDarkMode() {
    this.setPreviewDarkMode(!this.isDarkPreview);
  }
  pushHistory() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }
    this.historyStack.push(JSON.stringify(this.config));
    if (this.historyStack.length > 40) this.historyStack.shift();
    this.historyIndex = this.historyStack.length - 1;
  }
  canUndo() {
    return this.historyIndex > 0;
  }
  canRedo() {
    return this.historyIndex < this.historyStack.length - 1;
  }
  undo() {
    if (this.canUndo()) {
      this.historyIndex--;
      this.config = JSON.parse(this.historyStack[this.historyIndex]);
      this.sendLiveUpdateToPreview();
      this.notify("history");
      return true;
    }
    return false;
  }
  redo() {
    if (this.canRedo()) {
      this.historyIndex++;
      this.config = JSON.parse(this.historyStack[this.historyIndex]);
      this.sendLiveUpdateToPreview();
      this.notify("history");
      return true;
    }
    return false;
  }
  updateConfig(mutator, saveHistory = true, changeType = "live_update") {
    if (saveHistory) {
      if (changeType === "live_update") {
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
  resetToDefaults() {
    this.pushHistory();
    this.config = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG));
    try {
      localStorage.removeItem(`nalsh_storefront_config_${this.merchantUsername}`);
    } catch (e) {
    }
    this.sendLiveUpdateToPreview();
    this.notify("full_sync");
  }
  sendLiveUpdateToPreview() {
    if (this.liveUpdateScheduled) return;
    this.liveUpdateScheduled = true;
    requestAnimationFrame(() => {
      this.liveUpdateScheduled = false;
      const iframe = document.getElementById("store-preview-frame");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: "NALSH_CONFIG_UPDATE",
          config: this.config,
          payload: this.config,
          _preview_dark: this.isDarkPreview
        }, "*");
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            iframeDoc.documentElement.classList.toggle("dark-mode", this.isDarkPreview);
            if (iframeDoc.body) iframeDoc.body.classList.toggle("dark-mode", this.isDarkPreview);
          }
        } catch (e) {
        }
      }
    });
  }
  /**
   * تحقن CSS مباشرة في الـ iframe لتغيير أبعاد الكروت بدون أي لاغ.
   * يُستخدم عند تحريك الـ sliders فقط — الحفظ في الـ state يتم بـ debounce.
   */
  applyDimensionsDirectlyToCSS(orientKey, dims) {
    const iframe = document.getElementById("store-preview-frame");
    if (!iframe || !iframe.contentDocument) return;
    let styleTag = iframe.contentDocument.getElementById("studio-live-dims-css");
    if (!styleTag) {
      styleTag = iframe.contentDocument.createElement("style");
      styleTag.id = "studio-live-dims-css";
      iframe.contentDocument.head.appendChild(styleTag);
    }
    const ps = this.config.products_settings || {};
    const port = ps.portrait || {};
    const land = ps.landscape || {};
    const portDims = orientKey === "portrait" ? { ...port, ...dims } : port;
    const landDims = orientKey === "landscape" ? { ...land, ...dims } : land;
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
                }` : ""}
                ${Number(portDims.card_custom_height) > 0 ? `
                .product-card-compact, .fast-card {
                    height: ${portDims.card_custom_height}px !important;
                    min-height: ${portDims.card_custom_height}px !important;
                }` : ""}
                ${Number(portDims.img_custom_height) > 0 ? `
                .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-wrap, .ct-glass-img-wrap, .ct-mag-img {
                    height: ${portDims.img_custom_height}px !important;
                    aspect-ratio: auto !important;
                    padding-top: 0 !important;
                }` : ""}
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
                }` : ""}
                ${Number(landDims.card_custom_height) > 0 ? `
                .product-card-compact, .fast-card {
                    height: ${landDims.card_custom_height}px !important;
                    min-height: ${landDims.card_custom_height}px !important;
                }` : ""}
                ${Number(landDims.img_custom_height) > 0 ? `
                .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-wrap, .ct-glass-img-wrap, .ct-mag-img {
                    height: ${landDims.img_custom_height}px !important;
                    aspect-ratio: auto !important;
                    padding-top: 0 !important;
                }` : ""}
            }
        `;
  }
  syncIframeTheme(isDark) {
    const iframe = document.getElementById("store-preview-frame");
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({
          type: "NALSH_TOGGLE_DARK_MODE",
          darkMode: isDark,
          payload: { darkMode: isDark }
        }, "*");
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.documentElement.classList.toggle("dark-mode", isDark);
        iframeDoc.body?.classList.toggle("dark-mode", isDark);
        iframe.contentWindow.localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
        if (iframe.contentWindow.StorefrontEngine) {
          iframe.contentWindow.StorefrontEngine.reapplyActiveMode();
        }
      } catch (e) {
      }
    }
  }
  async loadInitialConfig() {
    let hasLocalDraft = false;
    try {
      const saved = localStorage.getItem(`nalsh_storefront_config_${this.merchantUsername}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const { sanitizedConfig } = sanitizeStorefrontConfig(parsed, this.merchantPlanType);
          this.config = sanitizedConfig;
          this.storeBaseConfig = sanitizedConfig;
          hasLocalDraft = true;
        }
      }
    } catch (e) {
    }
    if (!hasLocalDraft) {
      try {
        const assetUrl = `${WORKER_API_URL}stores/${encodeURIComponent(this.merchantUsername)}/storefront_config.json`;
        const res = await fetch(`${assetUrl}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json && typeof json === "object") {
            const { sanitizedConfig } = sanitizeStorefrontConfig(json, this.merchantPlanType);
            this.config = sanitizedConfig;
            this.storeBaseConfig = sanitizedConfig;
            this.sendLiveUpdateToPreview();
            this.notify("full_sync");
          }
        }
      } catch (err) {
        console.warn(`[Studio] \u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 ${this.merchantUsername} \u0645\u0646 \u0645\u0633\u0627\u0631\u0647 \u0627\u0644\u0645\u0646\u0634\u0648\u0631.`, err);
      }
    }
  }
  async buildPublishConfig() {
    let baseConfig = this.storeBaseConfig || this.config;
    try {
      const assetUrl = `${WORKER_API_URL}stores/${encodeURIComponent(this.merchantUsername)}/storefront_config.json`;
      const response = await fetch(`${assetUrl}?v=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        const remoteConfig = await response.json();
        if (remoteConfig && typeof remoteConfig === "object") {
          baseConfig = remoteConfig;
        }
      }
    } catch (error) {
      console.warn("[Studio] \u062A\u0639\u0630\u0631 \u062A\u062D\u062F\u064A\u062B \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0642\u0628\u0644 \u0627\u0644\u0646\u0634\u0631\u060C \u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062A\u0627\u062D\u0629.", error);
    }
    const designConfig = JSON.parse(JSON.stringify(this.config));
    const result = JSON.parse(JSON.stringify(baseConfig || {}));
    this.mergeConfig(result, designConfig);
    const base = baseConfig;
    if (base?.store_identity !== void 0 && JSON.stringify(designConfig.store_identity || {}) === JSON.stringify(base.store_identity)) {
      result.store_identity = JSON.parse(JSON.stringify(base.store_identity));
    }
    const designPhone = designConfig.marketing?.whatsapp_floating?.phone;
    if (base?.marketing?.whatsapp_floating?.phone !== void 0 && (!designPhone || designPhone === base.marketing.whatsapp_floating.phone)) {
      result.marketing = result.marketing || {};
      result.marketing.whatsapp_floating = result.marketing.whatsapp_floating || {};
      result.marketing.whatsapp_floating.phone = base.marketing.whatsapp_floating.phone;
    }
    const { sanitizedConfig } = sanitizeStorefrontConfig(result, this.merchantPlanType);
    this.storeBaseConfig = sanitizedConfig;
    this.config = sanitizedConfig;
    return sanitizedConfig;
  }
  mergeConfig(target, source) {
    Object.entries(source || {}).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
        this.mergeConfig(target[key], value);
      } else {
        target[key] = value;
      }
    });
  }
};
var studioState = StudioState.getInstance();

// src/studio/components/Topbar.ts
var Topbar = class {
  static render() {
    const { isDarkPreview, merchantUsername, isGuestMode } = studioState;
    const canUndo = studioState.canUndo();
    const canRedo = studioState.canRedo();
    return `
        <header class="sb-topbar" id="sb-app-topbar">
            <!-- \u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u0623\u064A\u0645\u0646: \u0627\u0644\u0631\u062C\u0648\u0639 \u0648\u0627\u0644\u0634\u0639\u0627\u0631 \u0648\u0627\u0644\u0627\u0633\u0645 -->
            <div class="sb-topbar-start">
                <a href="merchant-app.html" class="sb-btn-back" title="\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u062A\u0627\u062C\u0631">
                    <i class="fas fa-arrow-right"></i>
                    <span>\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u0627\u062C\u0631</span>
                </a>

                <div class="sb-store-badge">
                    <div class="pulse-indicator" style="${isGuestMode ? "background:#F59E0B;" : ""}"></div>
                    <i class="fas fa-store" style="color:var(--sb-primary);"></i>
                    <div class="sb-store-meta">
                        <span id="ui-merchant-name">${studioState.merchantStoreName || studioState.merchantUsername}</span>
                        <small>@${studioState.merchantUsername}</small>
                    </div>
                    ${isGuestMode ? '<span class="sb-beta-tag" style="background:rgba(245,158,11,0.18); color:#F59E0B; border:1px solid rgba(245,158,11,0.3);"><i class="fas fa-eye"></i> \u0648\u0636\u0639 \u062A\u062C\u0631\u064A\u0628\u064A</span>' : '<span class="sb-beta-tag"><i class="fas fa-palette"></i> \u0645\u062E\u0635\u0635</span>'}
                </div>

                <a href="index.html?store=${encodeURIComponent(studioState.merchantUsername)}" target="_blank" class="sb-btn sb-btn-ghost hide-mobile" title="\u0641\u062A\u062D \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0641\u064A \u062A\u0628\u0648\u064A\u0628 \u062C\u062F\u064A\u062F" style="color:#38BDF8; text-decoration:none; font-size:0.82rem; font-weight:700;">
                    <i class="fas fa-external-link-alt"></i>
                    <span>\u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u062A\u062C\u0631</span>
                </a>
            </div>

            <!-- \u0627\u0644\u0648\u0633\u0637: \u0623\u062F\u0648\u0627\u062A \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0644\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629 -->
            <div class="sb-topbar-center">
                <div class="sb-history-group">
                    <button class="sb-icon-tool" data-history-action="undo" onclick="window.StudioUI.undo()" title="\u062A\u0631\u0627\u062C\u0639 (Ctrl+Z)" ${!canUndo ? "disabled" : ""}>
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="sb-icon-tool" data-history-action="redo" onclick="window.StudioUI.redo()" title="\u0625\u0639\u0627\u062F\u0629 (Ctrl+Y)" ${!canRedo ? "disabled" : ""}>
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>

            <!-- \u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u0623\u064A\u0633\u0631: \u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0648\u0627\u0644\u0646\u0634\u0631 \u0648\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0632\u064A\u062F -->
            <div class="sb-topbar-end">
                <!-- \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629 -->
                <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.toggleDarkMode()" title="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A/\u0627\u0644\u0646\u0647\u0627\u0631\u064A \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629">
                    <i class="fas ${isDarkPreview ? "fa-sun" : "fa-moon"}" id="sb-theme-icon" style="color:${isDarkPreview ? "#FBBF24" : "inherit"};"></i>
                    <span class="hide-mobile" id="sb-theme-mode-text">${isDarkPreview ? "\u0641\u0627\u062A\u062D" : "\u062F\u0627\u0643\u0646"}</span>
                </button>

                <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062D\u0627\u0633\u0648\u0628 \u0648\u0627\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629 -->
                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="window.StudioUI.openHelpModal()" title="\u062F\u0644\u064A\u0644 \u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648">
                    <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                    <span>\u062A\u0639\u0644\u064A\u0645\u0627\u062A</span>
                </button>

                <input type="file" id="json-file-input" style="display:none;" accept=".json,application/json" onchange="window.StudioUI.handleJsonFileUpload(event)" />

                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="document.getElementById('json-file-input').click()" title="\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0623\u0648 \u0642\u0627\u0644\u0628 JSON">
                    <i class="fas fa-upload"></i>
                </button>

                <button class="sb-btn sb-btn-ghost hide-mobile" onclick="window.StudioUI.downloadJson()" title="\u062A\u0635\u062F\u064A\u0631 \u0648\u062A\u0646\u0632\u064A\u0644 \u0645\u0644\u0641 JSON">
                    <i class="fas fa-download"></i>
                </button>

                <button class="sb-btn sb-btn-ghost hide-mobile" style="color:#F87171;" onclick="window.StudioUI.resetAllDefaults()" title="\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629">
                    <i class="fas fa-trash-restore"></i>
                </button>

                <!-- \u0642\u0627\u0626\u0645\u0629 "\u0627\u0644\u0645\u0632\u064A\u062F" \u0627\u0644\u0645\u0646\u0633\u062F\u0644\u0629 \u0644\u0644\u0647\u0648\u0627\u062A\u0641 \u0648\u0627\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0635\u063A\u064A\u0631\u0629 -->
                <div class="sb-topbar-more-container">
                    <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.toggleMoreMenu(event)" title="\u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0623\u062F\u0648\u0627\u062A">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="sb-more-dropdown" id="sb-more-dropdown">
                        <button class="sb-dropdown-item" onclick="window.StudioUI.openHelpModal(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                            <span>\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629</span>
                        </button>
                        <button class="sb-dropdown-item" onclick="document.getElementById('json-file-input').click(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-upload" style="color:#38BDF8;"></i>
                            <span>\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0645\u0644\u0641 JSON</span>
                        </button>
                        <button class="sb-dropdown-item" onclick="window.StudioUI.downloadJson(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-download" style="color:#10B981;"></i>
                            <span>\u062A\u0635\u062F\u064A\u0631 \u0645\u0644\u0641 JSON</span>
                        </button>
                        <a href="index.html?store=${encodeURIComponent(studioState.merchantUsername)}" target="_blank" class="sb-dropdown-item" style="text-decoration:none;">
                            <i class="fas fa-external-link-alt" style="color:#6366F1;"></i>
                            <span>\u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0645\u0628\u0627\u0634\u0631</span>
                        </a>
                        <div style="height:1px; background:var(--sb-border); margin:4px 0;"></div>
                        <button class="sb-dropdown-item" style="color:#F87171;" onclick="window.StudioUI.resetAllDefaults(); window.StudioUI.toggleMoreMenu();">
                            <i class="fas fa-trash-restore"></i>
                            <span>\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0627\u062A</span>
                        </button>
                    </div>
                </div>

                <!-- \u0632\u0631 \u0627\u0644\u0646\u0634\u0631 \u0627\u0644\u0631\u0626\u064A\u0633\u064A -->
                <button id="btn-publish-live" class="sb-btn sb-btn-primary" onclick="window.StudioUI.publishTheme()" title="\u0646\u0634\u0631 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631 \u0645\u0628\u0627\u0634\u0631\u0629">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>\u0646\u0634\u0631 \u{1F680}</span>
                </button>
            </div>
        </header>
        `;
  }
};

// src/studio/components/tabs/IdentityTab.ts
var IdentityTab = class {
  static render() {
    const id = studioState.config.store_identity || {};
    const ann = id.announcement_bar || {};
    const defaultMode = studioState.config.default_theme_mode || "light";
    return `
        <div class="sb-tab-pane">
            <div class="sb-quick-actions">
                <button class="sb-quick-action active" onclick="window.StudioUI.setActiveTab('ai_palette')">
                    <i class="fas fa-palette"></i>
                    <span>\u0627\u062E\u062A\u064A\u0627\u0631 \u062B\u064A\u0645 \u062C\u0627\u0647\u0632</span>
                </button>
                <button class="sb-quick-action" onclick="window.StudioUI.setActiveTab('light_colors')">
                    <i class="fas fa-sun"></i>
                    <span>\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u062A\u062C\u0631</span>
                </button>
                <button class="sb-quick-action" onclick="window.StudioUI.setActiveTab('navigation')">
                    <i class="fas fa-bars"></i>
                    <span>\u062A\u0646\u0642\u0644 \u0627\u0644\u0645\u062A\u062C\u0631</span>
                </button>
            </div>

            <div class="sb-identity-banner">
                <div class="sb-identity-banner-head">
                    <span class="sb-badge-pill active">\u062C\u0627\u0647\u0632 \u0644\u0644\u0639\u0631\u0636</span>
                    <span class="sb-badge-pill">\u0645\u062A\u062C\u0631 \u062D\u062F\u064A\u062B</span>
                </div>
                <h3>\u0627\u0628\u062F\u0623 \u0628\u062A\u062E\u0635\u064A\u0635 \u0645\u062A\u062C\u0631 \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0641\u064A 3 \u062E\u0637\u0648\u0627\u062A</h3>
                <div class="sb-stat-row">
                    <div class="sb-stat-item">
                        <strong>1</strong>
                        <span>\u0627\u062E\u062A\u0631 \u0627\u0644\u062B\u064A\u0645</span>
                    </div>
                    <div class="sb-stat-item">
                        <strong>2</strong>
                        <span>\u0639\u062F\u0644 \u0627\u0644\u0623\u0644\u0648\u0627\u0646</span>
                    </div>
                    <div class="sb-stat-item">
                        <strong>3</strong>
                        <span>\u0627\u0646\u0634\u0631 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629</span>
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-store" style="color:var(--sb-primary);"></i>
                    <h3>\u0647\u0648\u064A\u0629 \u0648\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629</h3>
                </div>
                
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631 (Store Name)</label>
                        <input type="text" class="sb-input" value="${id.store_name || ""}" 
                               placeholder="\u0645\u062B\u0627\u0644: \u0645\u062A\u062C\u0631 \u0627\u0644\u0623\u0646\u0627\u0642\u0629 \u0627\u0644\u0641\u0627\u062E\u0631\u0629"
                               oninput="window.StudioUI.handleIdentityChange('store_name', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0644\u0634\u0639\u0627\u0631 \u0627\u0644\u062A\u0633\u0648\u064A\u0642\u064A (Slogan)</label>
                        <input type="text" class="sb-input" value="${id.slogan || ""}" 
                               placeholder="\u0645\u062B\u0627\u0644: \u0648\u062C\u0647\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649 \u0644\u0623\u0631\u0642\u0649 \u0627\u0644\u0623\u0632\u064A\u0627\u0621 \u0648\u0627\u0644\u0639\u0637\u0648\u0631"
                               oninput="window.StudioUI.handleIdentityChange('slogan', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062A\u0631\u062D\u064A\u0628 \u0623\u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u062C\u0631</label>
                        <textarea class="sb-textarea" placeholder="\u0623\u0647\u0644\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0645\u062A\u062C\u0631\u0646\u0627!"
                                  oninput="window.StudioUI.handleIdentityChange('welcome_message', this.value)">${id.welcome_message || ""}</textarea>
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0631\u0645\u0632 \u0627\u0644\u0639\u0645\u0644\u0629 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629</label>
                        <select class="sb-select" onchange="window.StudioUI.handleIdentityChange('currency_symbol', this.value)">
                            <option value="YER" ${id.currency_symbol === "YER" ? "selected" : ""}>\u0631\u064A\u0627\u0644 \u064A\u0645\u0646\u064A (YER)</option>
                            <option value="SAR" ${id.currency_symbol === "SAR" ? "selected" : ""}>\u0631\u064A\u0627\u0644 \u0633\u0639\u0648\u062F\u064A (SAR)</option>
                            <option value="USD" ${id.currency_symbol === "USD" ? "selected" : ""}>\u062F\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064A\u0643\u064A (USD)</option>
                        </select>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">
                            <span>\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0639\u0646\u062F \u0623\u0648\u0644 \u0632\u064A\u0627\u0631\u0629 \u0644\u0644\u0645\u062A\u0633\u0648\u0642 (Default Theme)</span>
                            <span class="sb-badge-info">\u0623\u0648\u0644 \u0641\u062A\u062D \u0644\u0644\u0645\u062A\u062C\u0631</span>
                        </label>
                        <div class="sb-segmented-control">
                            <button class="sb-seg-btn ${defaultMode === "light" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('light')">
                                \u2600\uFE0F \u0648\u0636\u0639 \u0641\u0627\u062A\u062D (Light)
                            </button>
                            <button class="sb-seg-btn ${defaultMode === "dark" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('dark')">
                                \u{1F319} \u0648\u0636\u0639 \u062F\u0627\u0643\u0646 (Dark)
                            </button>
                            <button class="sb-seg-btn ${defaultMode === "auto" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleDefaultThemeModeChange('auto')">
                                \u{1F5A5}\uFE0F \u062D\u0633\u0628 \u062C\u0647\u0627\u0632 \u0627\u0644\u0639\u0645\u064A\u0644
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- \u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-bullhorn" style="color:#EC4899;"></i>
                    <h3>\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A (Announcement Bar)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">\u062A\u0641\u0639\u064A\u0644 \u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0623\u0639\u0644\u0649 \u0627\u0644\u0647\u064A\u062F\u0631</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${ann.enabled ? "checked" : ""} 
                                       onchange="window.StudioUI.handleAnnouncementChange('enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>
                        
                        <input type="text" class="sb-input" value="${ann.text || ""}" 
                               placeholder="\u0646\u0635 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A\u060C \u0645\u062B\u0627\u0644: \u{1F389} \u0639\u0631\u0648\u0636 \u062D\u0635\u0631\u064A\u0629 \u0648\u062A\u0648\u0635\u064A\u0644 \u0645\u062C\u0627\u0646\u064A!"
                               oninput="window.StudioUI.handleAnnouncementChange('text', this.value)" />

                        <div style="display:flex; gap:12px; margin-top:10px;">
                            <div class="sb-color-inline" style="flex:1;">
                                <span>\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0634\u0631\u064A\u0637:</span>
                                <input type="color" class="sb-color-input" value="${ann.bg_color || "#4F46E5"}" 
                                       oninput="window.StudioUI.handleAnnouncementChange('bg_color', this.value)" />
                            </div>
                            <div class="sb-color-inline" style="flex:1;">
                                <span>\u0644\u0648\u0646 \u0627\u0644\u0646\u0635:</span>
                                <input type="color" class="sb-color-input" value="${ann.text_color || "#FFFFFF"}" 
                                       oninput="window.StudioUI.handleAnnouncementChange('text_color', this.value)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/ProductsTab.ts
var ProductsTab = class {
  static render() {
    const ps = studioState.config.products_settings || {
      portrait: {},
      landscape: {},
      category_overrides: {}
    };
    const activeSub = studioState.activeProductSubTab || "portrait";
    const currentOrientSettings = activeSub === "landscape" ? ps.landscape || {} : ps.portrait || {};
    let catList = ["\u0627\u0644\u0639\u0637\u0648\u0631 \u0648\u0627\u0644\u0639\u0648\u062F", "\u0627\u0644\u0645\u0644\u0627\u0628\u0633 \u0648\u0627\u0644\u0623\u0632\u064A\u0627\u0621", "\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0648\u0627\u0644\u0645\u062C\u0648\u0647\u0631\u0627\u062A", "\u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0630\u0643\u064A\u0629", "\u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0648\u0627\u0644\u062C\u0645\u0627\u0644"];
    try {
      const iframe = document.getElementById("store-preview-frame");
      if (iframe?.contentWindow?.App?.storeData?.categories?.length) {
        catList = iframe.contentWindow.App.storeData.categories.map((c) => c.name);
      }
    } catch (e) {
    }
    if (!studioState.selectedCategoryForOverride && catList.length > 0) {
      studioState.selectedCategoryForOverride = catList[0];
    }
    const activeCatOverride = studioState.selectedCategoryForOverride && ps.category_overrides?.[studioState.selectedCategoryForOverride] || null;
    const isCatOverrideActive = activeCatOverride && activeCatOverride.enabled !== false;
    return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card accent">
                    <span class="label">\u0648\u0636\u0639 \u0627\u0644\u0639\u0631\u0636</span>
                    <strong>${activeSub === "portrait" ? "\u062C\u0648\u0627\u0644" : activeSub === "landscape" ? "\u0643\u0645\u0628\u064A\u0648\u062A\u0631" : "\u0623\u0642\u0633\u0627\u0645"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0631\u062A\u0628\u0629 \u0627\u0644\u062A\u0631\u062A\u064A\u0628</span>
                    <strong>${ps.sort_by || "latest"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u062A\u062C\u0631</span>
                    <strong>${catList.length}</strong>
                </div>
            </div>

            <div class="sb-alert-box info">
                <i class="fas fa-magic"></i>
                <div>
                    <strong>\u062A\u062D\u0643\u0645 \u0645\u062A\u0643\u0627\u0645\u0644 \u0641\u064A \u0639\u0631\u0636 \u0648\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u26A1</strong>
                    <span>\u0627\u0644\u062A\u0628\u062F\u064A\u0644 \u0628\u064A\u0646 \u0648\u0636\u0639 \u0627\u0644\u062C\u0648\u0627\u0644 \u0648\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u064A\u063A\u064A\u0631 <strong>\u0634\u0627\u0634\u0629 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B</strong> \u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u062D\u064A\u0629 \u0648\u0645\u062B\u0627\u0644\u064A\u0629!</span>
                </div>
            </div>

            <div class="sb-product-mini-actions">
                <button class="sb-product-mini-btn ${activeSub === "portrait" ? "active" : ""}" onclick="window.StudioUI.switchProductSubTab('portrait')">
                    <i class="fas fa-mobile-alt"></i>
                    <span>\u062C\u0648\u0627\u0644</span>
                </button>
                <button class="sb-product-mini-btn ${activeSub === "landscape" ? "active" : ""}" onclick="window.StudioUI.switchProductSubTab('landscape')">
                    <i class="fas fa-desktop"></i>
                    <span>\u0643\u0645\u0628\u064A\u0648\u062A\u0631</span>
                </button>
                <button class="sb-product-mini-btn ${activeSub === "categories" ? "active" : ""}" onclick="window.StudioUI.switchProductSubTab('categories')">
                    <i class="fas fa-folder-tree"></i>
                    <span>\u0623\u0642\u0633\u0627\u0645</span>
                </button>
            </div>

            <!-- \u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0648\u0627\u0644\u0641\u0631\u0632 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-boxes-stacked" style="color:var(--sb-primary);"></i>
                    <h3>\u0646\u0645\u0637 \u0648\u062A\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.2); padding: 14px 16px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-layer-group" style="color: var(--sb-primary); font-size: 1.2rem;"></i>
                            <div>
                                <strong style="font-size: 0.95rem; display: block; color: var(--sb-text);">\u0646\u0645\u0637 \u0627\u0644\u0639\u0631\u0636: \u0623\u0642\u0633\u0627\u0645 \u0645\u0633\u062A\u0642\u0644\u0629 \u0644\u0643\u0644 \u0641\u0626\u0629 \u{1F4C2}</strong>
                                <small style="font-size: 0.78rem; color: var(--sb-muted);">\u064A\u062A\u0645 \u062A\u0646\u0638\u064A\u0645 \u0645\u0646\u062A\u062C\u0627\u062A \u0645\u062A\u062C\u0631\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0641\u064A \u0635\u0641\u0648\u0641 \u0648\u0623\u0642\u0633\u0627\u0645 \u062C\u0630\u0627\u0628\u0629 \u0628\u062D\u0633\u0628 \u062A\u0635\u0646\u064A\u0641\u0627\u062A\u0647\u0627</small>
                            </div>
                        </div>
                        <span class="sb-badge-info" style="background: var(--sb-primary); color: #fff; font-weight: 800; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem;">\u0646\u0634\u0637 \u0648\u0645\u0641\u0639\u0644 \u2B50</span>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A (Sort By)</label>
                        <select class="sb-select" onchange="window.StudioUI.handleProductsSettingChange('sort_by', this.value)">
                            <option value="latest" ${ps.sort_by === "latest" ? "selected" : ""}>\u0627\u0644\u0623\u062D\u062F\u062B \u0646\u0632\u0648\u0644\u0627\u064B \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631 (Default)</option>
                            <option value="price_low" ${ps.sort_by === "price_low" ? "selected" : ""}>\u0645\u0646 \u0627\u0644\u0623\u0642\u0644 \u0633\u0639\u0631\u0627\u064B \u0644\u0644\u0623\u0639\u0644\u0649 \u{1F4B5}</option>
                            <option value="price_high" ${ps.sort_by === "price_high" ? "selected" : ""}>\u0645\u0646 \u0627\u0644\u0623\u0639\u0644\u0649 \u0633\u0639\u0631\u0627\u064B \u0644\u0644\u0623\u0642\u0644 \u{1F48E}</option>
                            <option value="discount" ${ps.sort_by === "discount" ? "selected" : ""}>\u0627\u0644\u0623\u0639\u0644\u0649 \u0646\u0633\u0628\u0629 \u062E\u0635\u0645 \u0648\u0639\u0631\u0648\u0636 \u{1F525}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- \u062A\u0628\u0648\u064A\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u0633\u062A\u0642\u0644 (\u062C\u0648\u0627\u0644 / \u0643\u0645\u0628\u064A\u0648\u062A\u0631 / \u0623\u0642\u0633\u0627\u0645) -->
            <div class="sb-card-group highlight">
                <div class="sb-subtab-switcher">
                    <button class="sb-subtab-btn ${activeSub === "portrait" ? "active" : ""}" 
                            onclick="window.StudioUI.switchProductSubTab('portrait')">
                        <i class="fas fa-mobile-alt"></i>
                        <span>\u{1F4F1} \u0634\u0627\u0634\u0627\u062A \u0627\u0644\u062C\u0648\u0627\u0644</span>
                    </button>
                    <button class="sb-subtab-btn ${activeSub === "landscape" ? "active" : ""}" 
                            onclick="window.StudioUI.switchProductSubTab('landscape')">
                        <i class="fas fa-desktop"></i>
                        <span>\u{1F4BB} \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u0648\u0627\u0644\u0634\u0627\u0634\u0627\u062A</span>
                    </button>
                    <button class="sb-subtab-btn ${activeSub === "categories" ? "active" : ""}" 
                            onclick="window.StudioUI.switchProductSubTab('categories')">
                        <i class="fas fa-folder-tree"></i>
                        <span>\u{1F4C2} \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0623\u0642\u0633\u0627\u0645</span>
                    </button>
                </div>

                ${activeSub === "portrait" ? `
                    <!-- \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062C\u0648\u0627\u0644 (Portrait) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u0627\u0644\u062C\u0648\u0627\u0644</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.scroll_direction || "horizontal") === "horizontal" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'scroll_direction', 'horizontal')">
                                    \u2194\uFE0F \u0623\u0641\u0642\u064A (\u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u0644\u0645\u0633 \u{1F446})
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.scroll_direction === "vertical" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'scroll_direction', 'vertical')">
                                    \u2195\uFE0F \u0639\u0645\u0648\u062F\u064A (\u0634\u0628\u0643\u0629 \u062A\u0646\u0632\u0644 \u0644\u0644\u0623\u0633\u0641\u0644)
                                </button>
                            </div>
                        </div>

                        <!-- \u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0628\u0627\u0644\u062C\u0648\u0627\u0644 -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : currentOrientSettings.card_orientation === "landscape" || currentOrientSettings.card_style === "landscape_row" ? "opacity:0.6; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0628\u0627\u0644\u062C\u0648\u0627\u0644</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns || 2) === 1 || (currentOrientSettings.card_orientation === "landscape" || currentOrientSettings.card_style === "landscape_row") ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 1)">
                                    1\uFE0F\u20E3 \u0639\u0645\u0648\u062F 1
                                </button>
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.grid_columns || 2) === 2 || !currentOrientSettings.grid_columns) && !(currentOrientSettings.card_orientation === "landscape" || currentOrientSettings.card_style === "landscape_row") ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 2)">
                                    2\uFE0F\u20E3 \u0639\u0645\u0648\u062F\u064A\u0646 \u2B50
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns) === 3 && !(currentOrientSettings.card_orientation === "landscape" || currentOrientSettings.card_style === "landscape_row") ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_columns', 3)">
                                    3\uFE0F\u20E3 3 \u0623\u0639\u0645\u062F\u0629
                                </button>
                            </div>
                            ${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : currentOrientSettings.card_orientation === "landscape" || currentOrientSettings.card_style === "landscape_row" ? '<span style="font-size:0.72rem; color:#06B6D4; display:block; margin-top:4px;">\u0627\u0644\u0643\u0631\u062A \u0628\u0627\u0644\u0639\u0631\u0636 \u064A\u0645\u0644\u0623 \u0639\u0631\u0636 \u0627\u0644\u0634\u0627\u0634\u0629 (\u0639\u0645\u0648\u062F 1) \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B</span>' : ""}
                        </div>

                        <!-- \u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0628\u0627\u0644\u062C\u0648\u0627\u0644 -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629 \u0628\u0627\u0644\u062C\u0648\u0627\u0644</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows || 0) === 0 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_rows', 0)">
                                    \u267E\uFE0F \u0627\u0644\u0643\u0644
                                </button>
                                ${[1, 2, 3, 4].map((num) => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows) === num ? "active" : ""}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'grid_rows', ${num})">
                                        ${num} \u0635\u0641
                                    </button>
                                `).join("")}
                            </div>
                            ${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : ""}
                        </div>

                        <!-- \u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u062C\u0648\u0627\u0644 -->
                        <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u062C\u0648\u0627\u0644</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.slider_rows) || 1) === 1 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'slider_rows', 1)">
                                    \u0635\u0641 \u0648\u0627\u062D\u062F \u0643\u0644\u0627\u0633\u064A\u0643\u064A
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.slider_rows) === 2 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'slider_rows', 2)">
                                    \u0635\u0641\u064A\u0646 \u0645\u0632\u062F\u0648\u062C\u064A\u0646 \u26A1
                                </button>
                            </div>
                            ${currentOrientSettings.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0623\u0641\u0642\u064A (\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631)</span>' : ""}
                        </div>

                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u0643\u0631\u062A \u0627\u0644\u0645\u0646\u062A\u062C \u0628\u0627\u0644\u062C\u0648\u0627\u0644</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || "portrait") === "portrait" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'card_orientation', 'portrait')">
                                    \u{1F4F1} \u0628\u0627\u0644\u0637\u0648\u0644
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.card_orientation === "landscape" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('portrait', 'card_orientation', 'landscape')">
                                    \u{1F5A5}\uFE0F \u0628\u0627\u0644\u0639\u0631\u0636
                                </button>
                            </div>
                        </div>

                        <!-- \u0627\u062E\u062A\u064A\u0627\u0631 \u0634\u0643\u0644 \u0627\u0644\u0643\u0631\u062A \u0644\u0644\u062C\u0648\u0627\u0644 -->
                        <div class="sb-field-card" style="margin-top:12px;">
                            <label class="sb-field-label">\u{1F3A8} \u0634\u0643\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0643\u0631\u062A (\u0627\u0644\u062C\u0648\u0627\u0644)</label>
                            <div class="sb-card-style-grid">
                                ${[
      { key: "classic", icon: "\u{1F7E6}", label: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A" },
      { key: "minimal", icon: "\u{1F32B}\uFE0F", label: "\u0645\u0628\u0633\u0637" },
      { key: "bold", icon: "\u{1F521}", label: "\u0628\u0648\u0644\u062F" },
      { key: "landscape_row", icon: "\u2194\uFE0F", label: "\u0639\u0631\u064A\u0636 \u0623\u0641\u0642\u064A" },
      { key: "magazine", icon: "\u{1F4F0}", label: "\u0645\u062C\u0644\u0629" },
      { key: "glass", icon: "\u{1F52E}", label: "\u0632\u062C\u0627\u062C\u064A" }
    ].map((s) => `
                                    <button class="sb-card-style-btn ${(currentOrientSettings.card_style || "classic") === s.key ? "active" : ""}"
                                            onclick="window.StudioUI.handleCardStyleChange('portrait', '${s.key}')">
                                        <span class="csb-icon">${s.icon}</span>
                                        <span class="csb-label">${s.label}</span>
                                    </button>
                                `).join("")}
                            </div>
                        </div>

                        <!-- \u0623\u0634\u0631\u0637\u0629 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062A \u0644\u0644\u062C\u0648\u0627\u0644 (\u0628\u0644\u0627 \u0644\u0627\u063A) -->
                        <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px;">
                            <div class="sb-group-header" style="margin-bottom:12px;">
                                <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                <h4 style="margin:0; font-size:0.9rem;">\u{1F4D0} \u0623\u0628\u0639\u0627\u062F \u0648\u062D\u062C\u0645 \u0627\u0644\u0643\u0631\u0648\u062A</h4>
                            </div>
                            
                            <div class="sb-fields-grid">
                                <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                    <div class="sb-slider-label">
                                        <span>\u2194\uFE0F \u0639\u0631\u0636 \u0627\u0644\u0643\u0631\u062A:</span>
                                        <strong id="val-port-width">${(currentOrientSettings.card_custom_width || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.card_custom_width || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="360" step="5" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_width || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-width').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'card_custom_width', v);
                                           " />
                                    ${currentOrientSettings.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0627\u0644\u0623\u0641\u0642\u064A</span>' : ""}
                                </div>

                                <div class="sb-field-card">
                                    <div class="sb-slider-label">
                                        <span>\u2195\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0643\u0631\u062A \u0643\u0627\u0645\u0644:</span>
                                        <strong id="val-port-height">${(currentOrientSettings.card_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.card_custom_height || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'card_custom_height', v);
                                           " />
                                </div>

                                <div class="sb-field-card" style="grid-column: 1 / -1;">
                                    <div class="sb-slider-label">
                                        <span>\u{1F5BC}\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u0641\u0642\u0637:</span>
                                        <strong id="val-port-img-height">${(currentOrientSettings.img_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.img_custom_height || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="300" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.img_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-port-img-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('portrait', 'img_custom_height', v);
                                           " />
                                </div>
                            </div>
                        </div>
                    </div>
                ` : activeSub === "landscape" ? `
                    <!-- \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 (Landscape) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.scroll_direction || "horizontal") === "horizontal" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'scroll_direction', 'horizontal')">
                                    \u2194\uFE0F \u0623\u0641\u0642\u064A (\u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u0645\u0627\u0648\u0633 \u{1F5B1}\uFE0F)
                                </button>
                                <button class="sb-seg-btn ${currentOrientSettings.scroll_direction === "vertical" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'scroll_direction', 'vertical')">
                                    \u2195\uFE0F \u0639\u0645\u0648\u062F\u064A (\u0634\u0628\u0643\u0629 \u0643\u0628\u0631\u0649)
                                </button>
                            </div>
                        </div>

                        <!-- \u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</label>
                            <div class="sb-segmented-control">
                                ${[2, 3, 4, 5, 6].map((num) => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_columns || 4) === num ? "active" : ""}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_columns', ${num})">
                                        ${num} ${num === 4 ? "\u2B50" : ""}
                                    </button>
                                `).join("")}
                            </div>
                            ${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : ""}
                        </div>

                        <!-- \u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 -->
                        <div class="sb-field-card" style="${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows || 0) === 0 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_rows', 0)">
                                    \u267E\uFE0F \u0627\u0644\u0643\u0644
                                </button>
                                ${[1, 2, 3, 4, 5].map((num) => `
                                    <button class="sb-seg-btn ${Number(currentOrientSettings.grid_rows) === num ? "active" : ""}"
                                            onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'grid_rows', ${num})">
                                        ${num} \u0635\u0641
                                    </button>
                                `).join("")}
                            </div>
                            ${(currentOrientSettings.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : ""}
                        </div>

                        <!-- \u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 -->
                        <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                            <label class="sb-field-label">\u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(Number(currentOrientSettings.slider_rows) || 1) === 1 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'slider_rows', 1)">
                                    \u0635\u0641 \u0648\u0627\u062D\u062F \u0643\u0644\u0627\u0633\u064A\u0643\u064A
                                </button>
                                <button class="sb-seg-btn ${Number(currentOrientSettings.slider_rows) === 2 ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'slider_rows', 2)">
                                    \u0635\u0641\u064A\u0646 \u0645\u0632\u062F\u0648\u062C\u064A\u0646 \u26A1
                                </button>
                            </div>
                            ${currentOrientSettings.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0623\u0641\u0642\u064A (\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631)</span>' : ""}
                        </div>

                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u0643\u0631\u062A \u0627\u0644\u0645\u0646\u062A\u062C \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || "portrait") === "portrait" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'card_orientation', 'portrait')">
                                    \u{1F4F1} \u0628\u0627\u0644\u0637\u0648\u0644
                                </button>
                                <button class="sb-seg-btn ${(currentOrientSettings.card_orientation || "landscape") === "landscape" ? "active" : ""}"
                                        onclick="window.StudioUI.handleOrientationSettingChange('landscape', 'card_orientation', 'landscape')">
                                    \u{1F5A5}\uFE0F \u0628\u0627\u0644\u0639\u0631\u0636 (\u0623\u0646\u064A\u0642 \u0644\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u{1F31F})
                                </button>
                            </div>
                        </div>

                        <!-- \u0627\u062E\u062A\u064A\u0627\u0631 \u0634\u0643\u0644 \u0627\u0644\u0643\u0631\u062A \u0644\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 -->
                        <div class="sb-field-card" style="margin-top:12px;">
                            <label class="sb-field-label">\u{1F3A8} \u0634\u0643\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0643\u0631\u062A (\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631)</label>
                            <div class="sb-card-style-grid">
                                ${[
      { key: "classic", icon: "\u{1F7E6}", label: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A" },
      { key: "minimal", icon: "\u{1F32B}\uFE0F", label: "\u0645\u0628\u0633\u0637" },
      { key: "bold", icon: "\u{1F521}", label: "\u0628\u0648\u0644\u062F" },
      { key: "landscape_row", icon: "\u2194\uFE0F", label: "\u0639\u0631\u064A\u0636 \u0623\u0641\u0642\u064A" },
      { key: "magazine", icon: "\u{1F4F0}", label: "\u0645\u062C\u0644\u0629" },
      { key: "glass", icon: "\u{1F52E}", label: "\u0632\u062C\u0627\u062C\u064A" }
    ].map((s) => `
                                    <button class="sb-card-style-btn ${(currentOrientSettings.card_style || "classic") === s.key ? "active" : ""}"
                                            onclick="window.StudioUI.handleCardStyleChange('landscape', '${s.key}')">
                                        <span class="csb-icon">${s.icon}</span>
                                        <span class="csb-label">${s.label}</span>
                                    </button>
                                `).join("")}
                            </div>
                        </div>

                        <!-- \u0623\u0634\u0631\u0637\u0629 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062A \u0644\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 (\u0628\u0644\u0627 \u0644\u0627\u063A) -->
                        <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px;">
                            <div class="sb-group-header" style="margin-bottom:12px;">
                                <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                <h4 style="margin:0; font-size:0.9rem;">\u{1F4D0} \u0623\u0628\u0639\u0627\u062F \u0648\u062D\u062C\u0645 \u0627\u0644\u0643\u0631\u0648\u062A \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</h4>
                            </div>
                            
                            <div class="sb-fields-grid">
                                <div class="sb-field-card" style="${currentOrientSettings.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                    <div class="sb-slider-label">
                                        <span>\u2194\uFE0F \u0639\u0631\u0636 \u0627\u0644\u0643\u0631\u062A:</span>
                                        <strong id="val-land-width">${(currentOrientSettings.card_custom_width || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.card_custom_width || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="450" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_width || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-width').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'card_custom_width', v);
                                           " />
                                    ${currentOrientSettings.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0627\u0644\u0623\u0641\u0642\u064A</span>' : ""}
                                </div>

                                <div class="sb-field-card">
                                    <div class="sb-slider-label">
                                        <span>\u2195\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0643\u0631\u062A \u0643\u0627\u0645\u0644:</span>
                                        <strong id="val-land-height">${(currentOrientSettings.card_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.card_custom_height || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="500" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.card_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'card_custom_height', v);
                                           " />
                                </div>

                                <div class="sb-field-card" style="grid-column: 1 / -1;">
                                    <div class="sb-slider-label">
                                        <span>\u{1F5BC}\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u0641\u0642\u0637:</span>
                                        <strong id="val-land-img-height">${(currentOrientSettings.img_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (currentOrientSettings.img_custom_height || 0) + "px"}</strong>
                                    </div>
                                    <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                           value="${currentOrientSettings.img_custom_height || 0}"
                                           oninput="
                                               const v = Number(this.value);
                                               document.getElementById('val-land-img-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                               window.StudioUI.handleDimensionSliderChange('landscape', 'img_custom_height', v);
                                           " />
                                </div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629 (Categories) -->
                    <div class="sb-fields-grid" style="margin-top:14px;">
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0645\u0631\u0627\u062F \u062A\u062E\u0635\u064A\u0635\u0647</label>
                            <select class="sb-select" onchange="window.StudioUI.handleCategorySelectForOverride(this.value)">
                                ${catList.map((cat) => `
                                    <option value="${cat}" ${studioState.selectedCategoryForOverride === cat ? "selected" : ""}>
                                        ${cat} ${ps.category_overrides?.[cat]?.enabled ? "\u2B50 (\u0645\u062E\u0635\u0635)" : ""}
                                    </option>
                                `).join("")}
                            </select>
                        </div>

                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="sb-field-label" style="margin-bottom:0;">\u062A\u0641\u0639\u064A\u0644 \u062A\u0635\u0645\u064A\u0645 \u0641\u0631\u064A\u062F \u0644\u0642\u0633\u0645 (${studioState.selectedCategoryForOverride})</label>
                                <label class="sb-switch">
                                    <input type="checkbox" ${isCatOverrideActive ? "checked" : ""} 
                                           onchange="window.StudioUI.toggleCategoryOverrideEnabled('${studioState.selectedCategoryForOverride}', this.checked)" />
                                    <span class="sb-slider"></span>
                                </label>
                            </div>
                        </div>

                        ${isCatOverrideActive ? `
                            <div class="sb-field-card">
                                <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 \u0644\u0642\u0633\u0645 (${studioState.selectedCategoryForOverride})</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(activeCatOverride.scroll_direction || "horizontal") === "horizontal" ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'scroll_direction', 'horizontal')">
                                        \u2194\uFE0F \u0623\u0641\u0642\u064A (\u0633\u0644\u0627\u064A\u062F\u0631)
                                    </button>
                                    <button class="sb-seg-btn ${activeCatOverride.scroll_direction === "vertical" ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'scroll_direction', 'vertical')">
                                        \u2195\uFE0F \u0639\u0645\u0648\u062F\u064A (\u0634\u0628\u0643\u0629)
                                    </button>
                                </div>
                            </div>

                            <!-- \u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 -->
                            <div class="sb-field-card" style="${(activeCatOverride.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645</label>
                                <div class="sb-segmented-control">
                                    ${[1, 2, 3, 4, 5, 6].map((num) => `
                                        <button class="sb-seg-btn ${Number(activeCatOverride.grid_columns || 2) === num ? "active" : ""}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_columns', ${num})">
                                            ${num}
                                        </button>
                                    `).join("")}
                                </div>
                                ${(activeCatOverride.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : ""}
                            </div>

                            <!-- \u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 -->
                            <div class="sb-field-card" style="${(activeCatOverride.scroll_direction || "horizontal") !== "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0648\u0641 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${Number(activeCatOverride.grid_rows || 0) === 0 ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_rows', 0)">
                                        \u267E\uFE0F \u0627\u0644\u0643\u0644
                                    </button>
                                    ${[1, 2, 3, 4].map((num) => `
                                        <button class="sb-seg-btn ${Number(activeCatOverride.grid_rows) === num ? "active" : ""}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'grid_rows', ${num})">
                                            ${num} \u0635\u0641
                                        </button>
                                    `).join("")}
                                </div>
                                ${(activeCatOverride.scroll_direction || "horizontal") !== "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0639\u0645\u0648\u062F\u064A\u0629</span>' : ""}
                            </div>

                            <!-- \u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 -->
                            <div class="sb-field-card" style="${activeCatOverride.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                <label class="sb-field-label">\u0635\u0641\u0648\u0641 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(Number(activeCatOverride.slider_rows) || 1) === 1 ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'slider_rows', 1)">
                                        \u0635\u0641 \u0648\u0627\u062D\u062F
                                    </button>
                                    <button class="sb-seg-btn ${Number(activeCatOverride.slider_rows) === 2 ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'slider_rows', 2)">
                                        \u0635\u0641\u064A\u0646 \u0645\u0632\u062F\u0648\u062C\u064A\u0646 \u26A1
                                    </button>
                                </div>
                                ${activeCatOverride.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:4px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0623\u0641\u0642\u064A (\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631)</span>' : ""}
                            </div>

                            <div class="sb-field-card">
                                <label class="sb-field-label">\u0627\u062A\u062C\u0627\u0647 \u0643\u0631\u062A \u0627\u0644\u0645\u0646\u062A\u062C \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645</label>
                                <div class="sb-segmented-control">
                                    <button class="sb-seg-btn ${(activeCatOverride.card_orientation || "portrait") === "portrait" ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_orientation', 'portrait')">
                                        \u{1F4F1} \u0628\u0627\u0644\u0637\u0648\u0644
                                    </button>
                                    <button class="sb-seg-btn ${activeCatOverride.card_orientation === "landscape" ? "active" : ""}"
                                            onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_orientation', 'landscape')">
                                        \u{1F5A5}\uFE0F \u0628\u0627\u0644\u0639\u0631\u0636
                                    </button>
                                </div>
                            </div>

                            <!-- \u0627\u062E\u062A\u064A\u0627\u0631 \u0634\u0643\u0644 \u0627\u0644\u0643\u0631\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 -->
                            <div class="sb-field-card">
                                <label class="sb-field-label">\u{1F3A8} \u0634\u0643\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0643\u0631\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645</label>
                                <div class="sb-card-style-grid">
                                    ${[
      { key: "classic", icon: "\u{1F7E6}", label: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A" },
      { key: "minimal", icon: "\u{1F32B}\uFE0F", label: "\u0645\u0628\u0633\u0637" },
      { key: "bold", icon: "\u{1F521}", label: "\u0628\u0648\u0644\u062F" },
      { key: "landscape_row", icon: "\u2194\uFE0F", label: "\u0639\u0631\u064A\u0636 \u0623\u0641\u0642\u064A" },
      { key: "magazine", icon: "\u{1F4F0}", label: "\u0645\u062C\u0644\u0629" },
      { key: "glass", icon: "\u{1F52E}", label: "\u0632\u062C\u0627\u062C\u064A" }
    ].map((s) => `
                                        <button class="sb-card-style-btn ${(activeCatOverride.card_style || "classic") === s.key ? "active" : ""}"
                                                onclick="window.StudioUI.handleCategoryOverrideChange('${studioState.selectedCategoryForOverride}', 'card_style', '${s.key}')">
                                            <span class="csb-icon">${s.icon}</span>
                                            <span class="csb-label">${s.label}</span>
                                        </button>
                                    `).join("")}
                                </div>
                            </div>

                            <!-- \u0623\u0634\u0631\u0637\u0629 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 -->
                            <div class="sb-card-group" style="background:var(--sb-surface); margin-top:16px; grid-column: 1 / -1;">
                                <div class="sb-group-header" style="margin-bottom:12px;">
                                    <i class="fas fa-ruler-combined" style="color:var(--sb-accent);"></i>
                                    <h4 style="margin:0; font-size:0.9rem;">\u{1F4D0} \u0623\u0628\u0639\u0627\u062F \u0643\u0631\u0648\u062A \u0642\u0633\u0645 (${studioState.selectedCategoryForOverride})</h4>
                                </div>
                                
                                <div class="sb-fields-grid">
                                    <div class="sb-field-card" style="${activeCatOverride.scroll_direction === "vertical" ? "opacity:0.45; pointer-events:none;" : ""}">
                                        <div class="sb-slider-label">
                                            <span>\u2194\uFE0F \u0639\u0631\u0636 \u0627\u0644\u0643\u0631\u062A:</span>
                                            <strong id="val-cat-width">${(activeCatOverride.card_custom_width || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (activeCatOverride.card_custom_width || 0) + "px"}</strong>
                                        </div>
                                        <input type="range" min="0" max="420" step="5" class="sb-range-slider"
                                               value="${activeCatOverride.card_custom_width || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-width').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'card_custom_width', v);
                                               " />
                                        ${activeCatOverride.scroll_direction === "vertical" ? '<span style="font-size:0.72rem; color:#EF4444; display:block; margin-top:3px;">\u0645\u062A\u0627\u062D \u0641\u0642\u0637 \u0641\u064A \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0627\u0644\u0623\u0641\u0642\u064A</span>' : ""}
                                    </div>

                                    <div class="sb-field-card">
                                        <div class="sb-slider-label">
                                            <span>\u2195\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0643\u0631\u062A \u0643\u0627\u0645\u0644:</span>
                                            <strong id="val-cat-height">${(activeCatOverride.card_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (activeCatOverride.card_custom_height || 0) + "px"}</strong>
                                        </div>
                                        <input type="range" min="0" max="480" step="10" class="sb-range-slider"
                                               value="${activeCatOverride.card_custom_height || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'card_custom_height', v);
                                               " />
                                    </div>

                                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                                        <div class="sb-slider-label">
                                            <span>\u{1F5BC}\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0641\u0642\u0637:</span>
                                            <strong id="val-cat-img-height">${(activeCatOverride.img_custom_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (activeCatOverride.img_custom_height || 0) + "px"}</strong>
                                        </div>
                                        <input type="range" min="0" max="380" step="10" class="sb-range-slider"
                                               value="${activeCatOverride.img_custom_height || 0}"
                                               oninput="
                                                   const v = Number(this.value);
                                                   document.getElementById('val-cat-img-height').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                   window.StudioUI.handleCategoryDimensionChange('${studioState.selectedCategoryForOverride}', 'img_custom_height', v);
                                               " />
                                    </div>
                                </div>
                            </div>

                            <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end;">
                                <button class="sb-btn sb-btn-danger" onclick="window.StudioUI.deleteCategoryOverride('${studioState.selectedCategoryForOverride}')">
                                    \u{1F5D1}\uFE0F \u062D\u0630\u0641 \u062A\u062E\u0635\u064A\u0635 ${studioState.selectedCategoryForOverride} \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0639\u0627\u0645
                                </button>
                            </div>
                        ` : `
                            <div style="grid-column: 1 / -1; text-align:center; padding:20px; color:var(--sb-muted); font-size:0.85rem;">
                                \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u064A\u062A\u0628\u0639 \u062D\u0627\u0644\u064A\u0627\u064B \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0644\u0645\u062A\u062C\u0631. \u0642\u0645 \u0628\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062E\u064A\u0627\u0631 \u0623\u0639\u0644\u0627\u0647 \u0644\u0636\u0628\u0637 \u0645\u0638\u0647\u0631 \u062E\u0627\u0635 \u0628\u0647!
                            </div>
                        `}
                    </div>
                `}
            </div>

            <!-- \u0628\u0637\u0627\u0642\u0629 \u062A\u062E\u0635\u064A\u0635 \u0648\u062A\u0635\u0645\u064A\u0645 \u0632\u0631 \u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 -->
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-cart-plus" style="color:var(--sb-accent);"></i>
                    <h3>\u062A\u062E\u0635\u064A\u0635 \u0648\u062A\u0635\u0645\u064A\u0645 \u0632\u0631 \u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <label class="sb-field-label" style="margin-bottom:2px;">\u0625\u0638\u0647\u0627\u0631 \u0632\u0631 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0644\u0644\u0633\u0644\u0629 \u0641\u064A \u0627\u0644\u0643\u0631\u0648\u062A</label>
                                <small style="font-size:0.75rem; color:var(--sb-muted);">\u064A\u062A\u064A\u062D \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0646\u0642\u0631\u0629 \u0648\u0627\u062D\u062F\u0629</small>
                            </div>
                            <label class="sb-switch">
                                <input type="checkbox" ${ps.show_quick_add !== false ? "checked" : ""} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_quick_add', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>
                    </div>

                    ${ps.show_quick_add !== false ? `
                        <!-- \u0623\u0634\u0643\u0627\u0644 \u0648\u062A\u0635\u0627\u0645\u064A\u0645 \u0627\u0644\u0632\u0631 -->
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">\u{1F3A8} \u0634\u0643\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0632\u0631 \u0627\u0644\u0633\u0644\u0629</label>
                            <div class="sb-card-style-grid" style="grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));">
                                ${[
      { key: "circle_icon", icon: "\u{1F518}", label: "\u062F\u0627\u0626\u0631\u064A \u0646\u0627\u0639\u0645" },
      { key: "pill_text", icon: "\u{1F48A}", label: "\u0643\u0628\u0633\u0648\u0644\u064A \u0628\u0646\u0635" },
      { key: "rounded_box", icon: "\u2B1B", label: "\u0645\u0631\u0628\u0639 \u0646\u0627\u0639\u0645" },
      { key: "full_bottom", icon: "\u{1F31F}", label: "\u0639\u0631\u064A\u0636 \u0628\u0627\u0644\u0623\u0633\u0641\u0644" },
      { key: "outlined", icon: "\u{1F532}", label: "\u0645\u0624\u0637\u0631 \u0634\u0641\u0627\u0641" },
      { key: "gradient_glow", icon: "\u{1F52E}", label: "\u0645\u062A\u062F\u0631\u062C \u0645\u062A\u0648\u0647\u062C" },
      { key: "floating_action", icon: "\u26A1", label: "\u0639\u0627\u0626\u0645 \u0628\u0627\u0644\u0635\u0648\u0631\u0629" }
    ].map((b) => {
      const currentStyle = ps.add_to_cart_btn?.style || "circle_icon";
      return `
                                        <button class="sb-card-style-btn ${currentStyle === b.key ? "active" : ""}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('style', '${b.key}')">
                                            <span class="csb-icon">${b.icon}</span>
                                            <span class="csb-label">${b.label}</span>
                                        </button>
                                    `;
    }).join("")}
                            </div>
                        </div>

                        <!-- \u0623\u064A\u0642\u0648\u0646\u0629 \u0627\u0644\u0632\u0631 -->
                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0623\u064A\u0642\u0648\u0646\u0629 \u0627\u0644\u0632\u0631</label>
                            <div class="sb-segmented-control">
                                ${[
      { icon: "fa-plus", label: "\u2795 \u0632\u0627\u0626\u062F" },
      { icon: "fa-shopping-cart", label: "\u{1F6D2} \u0639\u0631\u0628\u0629" },
      { icon: "fa-shopping-bag", label: "\u{1F6CD}\uFE0F \u0643\u064A\u0633" },
      { icon: "fa-shopping-basket", label: "\u{1F9FA} \u0633\u0644\u0629" },
      { icon: "fa-bolt", label: "\u26A1 \u0628\u0631\u0642" }
    ].map((ic) => {
      const currentIcon = ps.add_to_cart_btn?.icon || "fa-plus";
      return `
                                        <button class="sb-seg-btn ${currentIcon === ic.icon ? "active" : ""}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('icon', '${ic.icon}')">
                                            ${ic.label}
                                        </button>
                                    `;
    }).join("")}
                            </div>
                        </div>

                        <!-- \u0646\u0635 \u0627\u0644\u0632\u0631 -->
                        <div class="sb-field-card">
                            <label class="sb-field-label">\u0646\u0635 \u0627\u0644\u0632\u0631 (\u0639\u0646\u062F \u0627\u0644\u062A\u0641\u0639\u064A\u0644)</label>
                            <input type="text" class="sb-input" value="${ps.add_to_cart_btn?.text || "\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629"}"
                                   placeholder="\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629"
                                   oninput="window.StudioUI.handleAddToCartBtnSettingChange('text', this.value, false)" />
                        </div>

                        <!-- \u062D\u0631\u0643\u0629 \u0648\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0636\u063A\u0637 -->
                        <div class="sb-field-card" style="grid-column: 1 / -1;">
                            <label class="sb-field-label">\u062D\u0631\u0643\u0629 \u0648\u062A\u0623\u062B\u064A\u0631 \u0627\u0644\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0644\u0632\u0631</label>
                            <div class="sb-segmented-control">
                                ${[
      { key: "scale", label: "\u{1F50D} \u0636\u063A\u0637 \u0648\u062A\u0643\u0628\u064A\u0631 (Scale)" },
      { key: "bounce", label: "\u{1F680} \u0627\u0631\u062A\u062F\u0627\u062F \u0645\u0631\u062D (Bounce)" },
      { key: "glow", label: "\u2728 \u062A\u0648\u0647\u062C \u0636\u0648\u0626\u064A (Glow)" },
      { key: "none", label: "\u{1F6AB} \u0628\u062F\u0648\u0646 \u062D\u0631\u0643\u0629" }
    ].map((a) => {
      const currentAnim = ps.add_to_cart_btn?.action_animation || "scale";
      return `
                                        <button class="sb-seg-btn ${currentAnim === a.key ? "active" : ""}"
                                                onclick="window.StudioUI.handleAddToCartBtnSettingChange('action_animation', '${a.key}')">
                                            ${a.label}
                                        </button>
                                    `;
    }).join("")}
                            </div>
                        </div>
                    ` : ""}
                </div>
            </div>

            <!-- \u062E\u064A\u0627\u0631\u0627\u062A \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0643\u0631\u0648\u062A \u0648\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-tags" style="color:#F59E0B;"></i>
                    <h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u0627\u0644\u0645\u062E\u0632\u0648\u0646</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div class="sb-toggles-list">
                            <label class="sb-toggle-row">
                                <span>\u0632\u0631 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0644\u0644\u0633\u0644\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629</span>
                                <input type="checkbox" ${ps.show_quick_add !== false ? "checked" : ""} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_quick_add', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>\u0634\u0627\u0631\u0629 \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 (\u0645\u062A\u0648\u0641\u0631 / \u0645\u062D\u062F\u0648\u062F)</span>
                                <input type="checkbox" ${ps.show_stock_badge !== false ? "checked" : ""} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_stock_badge', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>\u0634\u0627\u0631\u0629 \u0646\u0633\u0628\u0629 \u0627\u0644\u062E\u0635\u0645 \u0648\u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u{1F525}</span>
                                <input type="checkbox" ${ps.show_discount_badge !== false ? "checked" : ""} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_discount_badge', this.checked)" />
                            </label>
                            <label class="sb-toggle-row">
                                <span>\u0648\u0633\u0645 / \u0641\u0626\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0623\u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629</span>
                                <input type="checkbox" ${ps.show_category_tag !== false ? "checked" : ""} 
                                       onchange="window.StudioUI.handleProductsSettingChange('show_category_tag', this.checked)" />
                            </label>
                        </div>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0646\u062A\u0647\u064A\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646</label>
                        <select class="sb-select" onchange="window.StudioUI.handleProductsSettingChange('out_of_stock_display', this.value)">
                            <option value="badge_at_end" ${ps.out_of_stock_display === "badge_at_end" ? "selected" : ""}>\u0646\u0642\u0644\u0647\u0627 \u0644\u0622\u062E\u0631 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0645\u0639 \u0634\u0627\u0631\u0629 (\u0646\u0641\u062F \u0627\u0644\u0645\u062E\u0632\u0648\u0646)</option>
                            <option value="hide" ${ps.out_of_stock_display === "hide" ? "selected" : ""}>\u0625\u062E\u0641\u0627\u0624\u0647\u0627 \u062A\u0645\u0627\u0645\u0627\u064B \u0645\u0646 \u0627\u0644\u0645\u062A\u062C\u0631</option>
                            <option value="normal" ${ps.out_of_stock_display === "normal" ? "selected" : ""}>\u0625\u0628\u0642\u0627\u0624\u0647\u0627 \u0641\u064A \u0645\u0648\u0642\u0639\u0647\u0627 \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0645\u0639 \u0634\u0627\u0631\u0629</option>
                        </select>
                    </div>

                    <div style="grid-column: 1 / -1;">
                        <button class="sb-btn sb-btn-ghost" style="width:100%; justify-content:center; color:#F87171;" 
                                onclick="window.StudioUI.resetProductsLayoutDefaults()">
                            \u{1F504} \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/MessagesTab.ts
var MessagesTab = class {
  static render() {
    const sm = studioState.config.messages || studioState.config.store_messages || {};
    const assistant = sm.ai_assistant || {};
    const quickActionsText = Array.isArray(assistant.quick_actions) && assistant.quick_actions.length ? assistant.quick_actions.join(", ") : "\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629, \u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F, \u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A";
    const iconOptions = [
      "fa-robot",
      "fa-headset",
      "fa-user-tie",
      "fa-message",
      "fa-comments",
      "fa-store",
      "fa-cart-shopping",
      "fa-box",
      "fa-bolt",
      "fa-sparkles",
      "fa-circle-question",
      "fa-shield-alt"
    ];
    const selectedIcon = assistant.avatar_icon || "fa-robot";
    return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card ${assistant.enabled !== false ? "accent" : ""}">
                    <span class="label">\u0627\u0644\u0645\u0633\u0627\u0639\u062F</span>
                    <strong>${assistant.enabled !== false ? "\u0645\u0641\u0639\u0651\u0644" : "\u0645\u062A\u0648\u0642\u0641"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0627\u0644\u0634\u062E\u0635\u064A\u0629</span>
                    <strong>${assistant.persona || "classic"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0627\u0644\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A</span>
                    <strong>${assistant.smart_contextual_actions !== false ? "\u0630\u0643\u064A\u0629" : "\u0628\u0633\u064A\u0637\u0629"}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-shopping-cart" style="color:var(--sb-primary);"></i>
                    <h3>\u0631\u0633\u0627\u0626\u0644 \u0648\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0633\u0644\u0629 \u0648\u0627\u0644\u0634\u0631\u0627\u0621</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0631\u0633\u0627\u0644\u0629 \u0646\u062C\u0627\u062D \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629</label>
                        <input type="text" class="sb-input" value="${sm.add_to_cart_success || "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0625\u0644\u0649 \u0633\u0644\u062A\u0643 \u0628\u0646\u062C\u0627\u062D"}" 
                               oninput="window.StudioUI.handleStoreMessageChange('add_to_cart_success', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u062A\u0646\u0628\u064A\u0647 \u0646\u0641\u0627\u062F \u0627\u0644\u0643\u0645\u064A\u0629 / \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631</label>
                        <input type="text" class="sb-input" value="${sm.out_of_stock_msg || "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u062D\u0627\u0644\u064A\u0627\u064B"}" 
                               oninput="window.StudioUI.handleStoreMessageChange('out_of_stock_msg', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0633\u0644\u0629 \u0627\u0644\u0641\u0627\u0631\u063A\u0629</label>
                        <input type="text" class="sb-input" value="${sm.empty_cart_title || sm.cart_empty_msg || "\u0633\u0644\u0629 \u0645\u0634\u062A\u0631\u064A\u0627\u062A\u0643 \u0641\u0627\u0631\u063A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B"}" 
                               oninput="window.StudioUI.handleStoreMessageChange('empty_cart_title', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0646\u0635 \u0632\u0631 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639</label>
                        <input type="text" class="sb-input" value="${sm.checkout_btn_label || "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639"}" 
                               oninput="window.StudioUI.handleStoreMessageChange('checkout_btn_label', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-robot" style="color:var(--sb-primary);"></i>
                    <h3>\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A</h3>
                </div>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <input type="text" class="sb-input" value="${assistant.name || "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634"}" oninput="window.StudioUI.handleAssistantConfigChange('name', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0623\u064A\u0642\u0648\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <div class="sb-icon-select-grid">
                            ${iconOptions.map((icon) => `
                                <button type="button"
                                    class="sb-icon-choice ${selectedIcon === icon ? "active" : ""}"
                                    title="${icon}"
                                    onclick="window.StudioUI.handleAssistantConfigChange('avatar_icon', '${icon}')">
                                    <i class="fas ${icon}"></i>
                                </button>
                            `).join("")}
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.enabled !== false ? "checked" : ""} onchange="window.StudioUI.handleAssistantConfigChange('enabled', this.checked)" />
                            <span>\u0645\u062A\u0627\u062D \u0644\u0644\u0632\u0648\u0627\u0631</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0630\u0643\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0635\u0641\u062D\u0629</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.smart_contextual_actions !== false ? "checked" : ""} onchange="window.StudioUI.handleAssistantConfigChange('smart_contextual_actions', this.checked)" />
                            <span>\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u0648\u0627\u0644\u0635\u0641\u062D\u0627\u062A</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0631\u062F\u0648\u062F \u0630\u0643\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0633\u064A\u0627\u0642</label>
                        <label class="sb-toggle-row">
                            <input type="checkbox" ${assistant.smart_contextual_replies !== false ? "checked" : ""} onchange="window.StudioUI.handleAssistantConfigChange('smart_contextual_replies', this.checked)" />
                            <span>\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u062D\u0633\u0628 \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0623\u0648 \u0627\u0644\u0633\u0644\u0629</span>
                        </label>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0644\u0648\u0646 \u062A\u0645\u064A\u064A\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <input type="color" class="sb-color-input" value="${assistant.accent_color || "#4F46E5"}" onchange="window.StudioUI.handleAssistantConfigChange('accent_color', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <div class="sb-segmented-control" style="grid-template-columns: repeat(4, minmax(0,1fr)); display:grid; gap:6px;">
                            <button class="sb-seg-btn ${assistant.persona === "classic" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('classic')">\u0643\u0644\u0627\u0633\u064A\u0643\u064A</button>
                            <button class="sb-seg-btn ${assistant.persona === "premium" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('premium')">\u0645\u0645\u064A\u0632</button>
                            <button class="sb-seg-btn ${assistant.persona === "futuristic" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('futuristic')">\u0645\u0633\u062A\u0642\u0628\u0644\u064A</button>
                            <button class="sb-seg-btn ${assistant.persona === "luxury" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('luxury')">\u0641\u0627\u062E\u0631</button>
                            <button class="sb-seg-btn ${assistant.persona === "fashion" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('fashion')">\u0645\u0648\u0636\u0629</button>
                            <button class="sb-seg-btn ${assistant.persona === "tech" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('tech')">\u062A\u0642\u0646\u064A\u0629</button>
                            <button class="sb-seg-btn ${assistant.persona === "wellness" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('wellness')">\u0635\u062D\u0629</button>
                            <button class="sb-seg-btn ${assistant.persona === "beauty" ? "active" : ""}" onclick="window.StudioUI.applyAssistantPreset('beauty')">\u062C\u0645\u0627\u0644</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0631\u062F</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.response_style === "friendly" || !assistant.response_style ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'friendly')">\u0648\u062F\u0648\u062F</button>
                            <button class="sb-seg-btn ${assistant.response_style === "sales" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'sales')">\u0645\u0628\u064A\u0639\u0627\u062A</button>
                            <button class="sb-seg-btn ${assistant.response_style === "luxury" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'luxury')">\u0641\u0627\u062E\u0631</button>
                            <button class="sb-seg-btn ${assistant.response_style === "professional" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('response_style', 'professional')">\u0645\u0647\u0646\u064A</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0633\u0627\u0639\u062F</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.behavior_mode === "support" || !assistant.behavior_mode ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'support')">\u062F\u0639\u0645</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === "sales" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'sales')">\u0645\u0628\u064A\u0639\u0627\u062A</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === "advisor" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'advisor')">\u0645\u0633\u062A\u0634\u0627\u0631</button>
                            <button class="sb-seg-btn ${assistant.behavior_mode === "concierge" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('behavior_mode', 'concierge')">\u0645\u0631\u0627\u0641\u0642</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0637\u0648\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644</label>
                        <div class="sb-segmented-control grid-3">
                            <button class="sb-seg-btn ${assistant.conversation_style === "short" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'short')">\u0642\u0635\u064A\u0631</button>
                            <button class="sb-seg-btn ${assistant.conversation_style === "balanced" || !assistant.conversation_style ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'balanced')">\u0645\u062A\u0648\u0627\u0632\u0646</button>
                            <button class="sb-seg-btn ${assistant.conversation_style === "detailed" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('conversation_style', 'detailed')">\u062A\u0641\u0635\u064A\u0644\u064A</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0634\u0643\u0644 \u0627\u0644\u0632\u0631 \u0627\u0644\u0639\u0627\u0626\u0645</label>
                        <div class="sb-segmented-control grid-3">
                            <button class="sb-seg-btn ${assistant.button_style === "pill" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'pill')">Pill</button>
                            <button class="sb-seg-btn ${assistant.button_style === "bubble" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'bubble')">Bubble</button>
                            <button class="sb-seg-btn ${assistant.button_style === "minimal" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('button_style', 'minimal')">Minimal</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0634\u0643\u0644 \u0627\u0644\u0631\u0648\u0628\u0648\u062A</label>
                        <div class="sb-segmented-control grid-4">
                            <button class="sb-seg-btn ${assistant.avatar_style === "pulse" || !assistant.avatar_style ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'pulse')">\u0646\u0628\u0636</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === "orb" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'orb')">\u0643\u0631\u064A\u0629</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === "halo" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'halo')">\u0647\u0627\u0644\u0629</button>
                            <button class="sb-seg-btn ${assistant.avatar_style === "hover" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('avatar_style', 'hover')">\u062A\u062D\u0631\u064A\u0643</button>
                        </div>
                    </div>
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0645\u0643\u0627\u0646 \u0627\u0644\u0632\u0631</label>
                        <div class="sb-segmented-control grid-2">
                            <button class="sb-seg-btn ${assistant.position !== "bottom-left" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('position', 'bottom-right')">\u064A\u0645\u064A\u0646</button>
                            <button class="sb-seg-btn ${assistant.position === "bottom-left" ? "active" : ""}" onclick="window.StudioUI.handleAssistantConfigChange('position', 'bottom-left')">\u064A\u0633\u0627\u0631</button>
                        </div>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0648\u0636\u0639 \u0627\u0644\u0645\u0633\u0627\u0639\u062F (\u0627\u0644\u062D\u0627\u0644\u0629)</label>
                        <input type="text" class="sb-input" value="${assistant.status_text || "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A"}" oninput="window.StudioUI.handleAssistantConfigChange('status_text', this.value)" />
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0627\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleAssistantQuickActionsChange(this.value)">${quickActionsText}</textarea>
                    </div>
                    <div class="sb-field-card" style="grid-column:1 / -1;">
                        <label class="sb-field-label">\u0631\u0633\u0627\u0644\u0629 \u062A\u0631\u062D\u064A\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A</label>
                        <input type="text" class="sb-input" value="${sm.chatbot_greeting || "\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0627\u0644\u064A\u0648\u0645\u061F \u{1F916}"}" 
                               oninput="window.StudioUI.handleStoreMessageChange('chatbot_greeting', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-search" style="color:#06B6D4;"></i>
                    <h3>\u0646\u0635\u0648\u0635 \u0627\u0644\u0628\u062D\u062B \u0648\u0627\u0644\u062A\u0648\u0627\u0635\u0644</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u062A\u0644\u0645\u064A\u062D \u062D\u0642\u0644 \u0627\u0644\u0628\u062D\u062B (Placeholder)</label>
                        <input type="text" class="sb-input" value="${sm.search_placeholder || "\u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0646\u062A\u062C\u060C \u0641\u0626\u0629\u060C \u0623\u0648 \u0645\u0627\u0631\u0643\u0629..."}" 
                               oninput="window.StudioUI.handleStoreMessageChange('search_placeholder', this.value)" />
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0631\u0633\u0627\u0644\u0629 \u0646\u062C\u0627\u062D \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0644\u0628</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleStoreMessageChange('order_success_msg', this.value)">${sm.order_success_msg || "\u0634\u0643\u0631\u0627\u064B \u0644\u062B\u0642\u062A\u0643 \u0628\u0646\u0627. \u0633\u064A\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0648\u062A\u0648\u0635\u064A\u0644 \u0637\u0644\u0628\u0643 \u0641\u064A \u0623\u0642\u0631\u0628 \u0648\u0642\u062A."}</textarea>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/SectionsTab.ts
var SectionsTab = class {
  static render() {
    const ps = studioState.config.products_settings || DEFAULT_STOREFRONT_CONFIG.products_settings;
    if (!Array.isArray(studioState.config.layout_blocks) || studioState.config.layout_blocks.length === 0) {
      studioState.config.layout_blocks = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG.layout_blocks || []));
    }
    const blocks = studioState.config.layout_blocks || [];
    return `
        <div class="sb-tab-pane">
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-layer-group" style="color:var(--sb-primary);"></i>
                    <h3>\u0642\u0648\u0627\u0644\u0628 \u0647\u064A\u0643\u0644\u064A\u0629 \u0630\u0643\u064A\u0629 \u0644\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</h3>
                </div>
                <div class="sb-segmented-control grid-4">
                    <button class="sb-seg-btn active" onclick="window.StudioUI.applySectionPreset('balanced')">\u0645\u062A\u0648\u0627\u0632\u0646</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('catalog')">\u0643\u062A\u0627\u0644\u0648\u062C</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('luxury')">\u0641\u0627\u062E\u0631</button>
                    <button class="sb-seg-btn" onclick="window.StudioUI.applySectionPreset('promo')">\u062A\u0631\u0648\u064A\u062C\u064A</button>
                </div>
            </div>

            <!-- \u0628\u0637\u0627\u0642\u0629 \u0646\u0645\u0637 \u0648\u062A\u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 -->
            <div class="sb-card-group highlight">
                <div class="sb-group-header">
                    <i class="fas fa-boxes-stacked" style="color:var(--sb-primary);"></i>
                    <h3>\u0637\u0631\u064A\u0642\u0629 \u0648\u0646\u0645\u0637 \u0639\u0631\u0636 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u0639\u0627\u0645 \u0644\u0639\u0631\u0636 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0628\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</label>
                        <div class="sb-segmented-control grid-2">
                            <button class="sb-seg-btn ${ps.display_mode === "by_categories_sections" || !ps.display_mode ? "active" : ""}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'by_categories_sections')">
                                \u{1F4C2} \u0623\u0642\u0633\u0627\u0645 \u0644\u0643\u0644 \u0641\u0626\u0629
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === "tabs_by_category" ? "active" : ""}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'tabs_by_category')">
                                \u{1F4D1} \u062A\u0628\u0648\u064A\u0628\u0627\u062A \u0641\u0626\u0627\u062A
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === "all_flat_grid" ? "active" : ""}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'all_flat_grid')">
                                \u{1F4E6} \u0634\u0628\u0643\u0629 \u0645\u0648\u062D\u062F\u0629
                            </button>
                            <button class="sb-seg-btn ${ps.display_mode === "featured_first" ? "active" : ""}"
                                    onclick="window.StudioUI.handleProductsSettingChange('display_mode', 'featured_first')">
                                \u2B50 \u0627\u0644\u0645\u0645\u064A\u0632\u0629 \u0623\u0648\u0644\u0627\u064B
                            </button>
                        </div>
                    </div>

                    <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end;">
                        <button class="sb-btn sb-btn-secondary" style="font-size:0.85rem;" onclick="window.StudioUI.setActiveTab('products_layout')">
                            <i class="fas fa-sliders-h"></i> <span>\u062A\u062E\u0635\u064A\u0635 \u0623\u0639\u0645\u062F\u0629 \u0648\u0633\u0644\u0627\u064A\u062F\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u{1F448}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- \u0628\u0637\u0627\u0642\u0629 \u062A\u0631\u062A\u064A\u0628 \u0648\u0647\u064A\u0643\u0644 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-layer-group" style="color:var(--sb-primary);"></i>
                    <h3>\u062A\u0631\u062A\u064A\u0628 \u0648\u0638\u0647\u0648\u0631 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0641\u064A \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</h3>
                </div>

                <div class="sb-sections-list">
                    ${blocks.map((b, idx) => {
      const isVisible = b.visible !== false;
      const s = b.settings || {};
      const icon = b.type === "hero" ? "fa-store" : b.type === "categories" ? "fa-tags" : b.type === "products" ? "fa-boxes-stacked" : b.type === "banner" ? "fa-bullhorn" : "fa-star";
      const typeName = b.type === "hero" ? "\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u0643\u0631\u062A \u0627\u0644\u0631\u0626\u064A\u0633\u064A" : b.type === "categories" ? "\u0634\u0631\u064A\u0637 \u0627\u0644\u0641\u0626\u0627\u062A \u0648\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A" : b.type === "products" ? "\u0645\u0646\u0637\u0642\u0629 \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" : b.type === "banner" ? "\u0628\u0627\u0646\u0631 \u0625\u0639\u0644\u0627\u0646\u064A \u062A\u0631\u0648\u064A\u062C\u064A" : "\u0642\u0633\u0645 \u0645\u062E\u0635\u0635";
      return `
                            <div class="sb-accordion-card ${isVisible ? "" : "disabled"}" id="sec-acc-${idx}">
                                <div class="sb-accordion-header" onclick="window.StudioUI.toggleAccordion(${idx})">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <i class="fas ${icon}" style="color:var(--sb-primary);"></i>
                                        <div>
                                            <strong style="font-size:0.92rem; color:var(--sb-text); display:block;">${b.title || typeName}</strong>
                                            <small style="font-size:0.75rem; color:var(--sb-muted);">${typeName}</small>
                                        </div>
                                    </div>
                                    <div class="sb-accordion-actions" onclick="event.stopPropagation();">
                                        <button class="sb-icon-tool" onclick="window.StudioUI.moveSectionBlock(${idx}, -1)" title="\u062A\u062D\u0631\u064A\u0643 \u0644\u0623\u0639\u0644\u0649" ${idx === 0 ? "disabled" : ""}>
                                            <i class="fas fa-arrow-up"></i>
                                        </button>
                                        <button class="sb-icon-tool" onclick="window.StudioUI.moveSectionBlock(${idx}, 1)" title="\u062A\u062D\u0631\u064A\u0643 \u0644\u0623\u0633\u0641\u0644" ${idx === blocks.length - 1 ? "disabled" : ""}>
                                            <i class="fas fa-arrow-down"></i>
                                        </button>
                                        <button class="sb-icon-tool" onclick="window.StudioUI.toggleSectionVisibility(${idx})" title="${isVisible ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0642\u0633\u0645" : "\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0642\u0633\u0645"}">
                                            <i class="fas ${isVisible ? "fa-eye" : "fa-eye-slash"}" style="${!isVisible ? "color:#EF4444" : ""}"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="sb-accordion-body">
                                    <div class="sb-field-card">
                                        <label class="sb-field-label">\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0642\u0633\u0645</label>
                                        <input type="text" class="sb-input" value="${b.title || ""}" 
                                               oninput="window.StudioUI.handleBlockFieldChange(${idx}, 'title', this.value)" />
                                    </div>

                                    <div class="sb-field-card">
                                        <label class="sb-field-label">\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0641\u0631\u0639\u064A / \u0627\u0644\u0648\u0635\u0641</label>
                                        <input type="text" class="sb-input" value="${b.subtitle || ""}" 
                                               oninput="window.StudioUI.handleBlockFieldChange(${idx}, 'subtitle', this.value)" />
                                    </div>

                                    ${b.type === "hero" ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">\u0646\u0635 \u0632\u0631 \u0627\u0644\u062F\u0639\u0648\u0629 \u0644\u0644\u0634\u0631\u0627\u0621 (CTA Button)</label>
                                            <input type="text" class="sb-input" value="${s.cta_text || "\u062A\u0633\u0648\u0642 \u0627\u0644\u0622\u0646"}" 
                                                   oninput="window.StudioUI.handleBlockSettingChange(${idx}, 'cta_text', this.value)" />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>\u{1F4F1} \u0627\u0631\u062A\u0641\u0627\u0639 \u0643\u0631\u062A \u0627\u0644\u0647\u064A\u0631\u0648 \u0628\u0627\u0644\u062C\u0648\u0627\u0644:</span>
                                                <strong id="val-hero-mob-${idx}">${(s.hero_mobile_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (s.hero_mobile_height || 0) + "px"}</strong>
                                            </div>
                                            <input type="range" min="0" max="450" step="10" class="sb-range-slider"
                                                   value="${s.hero_mobile_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-hero-mob-${idx}').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'hero_mobile_height', v);
                                                   " />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>\u{1F4BB} \u0627\u0631\u062A\u0641\u0627\u0639 \u0643\u0631\u062A \u0627\u0644\u0647\u064A\u0631\u0648 \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631:</span>
                                                <strong id="val-hero-desk-${idx}">${(s.hero_desktop_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (s.hero_desktop_height || 0) + "px"}</strong>
                                            </div>
                                            <input type="range" min="0" max="600" step="10" class="sb-range-slider"
                                                   value="${s.hero_desktop_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-hero-desk-${idx}').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'hero_desktop_height', v);
                                                   " />
                                        </div>
                                    ` : ""}

                                    ${b.type === "categories" ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">\u0637\u0631\u064A\u0642\u0629 \u0639\u0631\u0636 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A</label>
                                            <div class="sb-segmented-control">
                                                <button class="sb-seg-btn ${(s.categories_style || "chips_slider") === "chips_slider" ? "active" : ""}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'categories_style', 'chips_slider'); window.StudioUI.handleBlockSettingChange(${idx}, 'style', 'slider');">
                                                    \u2194\uFE0F \u0634\u0631\u064A\u0637 \u0633\u0644\u0627\u064A\u062F\u0631
                                                </button>
                                                <button class="sb-seg-btn ${s.categories_style === "grid_matrix" ? "active" : ""}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'categories_style', 'grid_matrix'); window.StudioUI.handleBlockSettingChange(${idx}, 'style', 'grid');">
                                                    \u{1F4E6} \u0634\u0628\u0643\u0629 \u0623\u0639\u0645\u062F\u0629
                                                </button>
                                            </div>
                                        </div>

                                        <div class="sb-field-card">
                                            <label class="sb-field-label">\u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 (\u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0634\u0628\u0643\u0629)</label>
                                            <div class="sb-segmented-control">
                                                ${[2, 3, 4, 5, 6].map((num) => `
                                                    <button class="sb-seg-btn ${Number(s.grid_columns || 4) === num ? "active" : ""}"
                                                            onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'grid_columns', ${num})">
                                                        ${num}
                                                    </button>
                                                `).join("")}
                                            </div>
                                        </div>

                                        <div class="sb-field-card">
                                            <label class="sb-field-label">\u062D\u062C\u0645 \u0623\u064A\u0642\u0648\u0646\u0627\u062A \u0627\u0644\u0641\u0626\u0627\u062A</label>
                                            <div class="sb-segmented-control">
                                                <button class="sb-seg-btn ${s.icon_size === "small" ? "active" : ""}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'small')">\u0635\u063A\u064A\u0631</button>
                                                <button class="sb-seg-btn ${s.icon_size === "medium" || !s.icon_size ? "active" : ""}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'medium')">\u0645\u062A\u0648\u0633\u0637 \u2B50</button>
                                                <button class="sb-seg-btn ${s.icon_size === "large" ? "active" : ""}"
                                                        onclick="window.StudioUI.handleBlockSettingChange(${idx}, 'icon_size', 'large')">\u0643\u0628\u064A\u0631</button>
                                            </div>
                                        </div>
                                    ` : ""}

                                    ${b.type === "banner" ? `
                                        <div class="sb-field-card">
                                            <label class="sb-field-label">\u0646\u0635 \u0627\u0644\u0632\u0631 \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A</label>
                                            <input type="text" class="sb-input" value="${s.cta_text || "\u0627\u0643\u062A\u0634\u0641 \u0627\u0644\u0645\u0632\u064A\u062F"}" 
                                                   oninput="window.StudioUI.handleBlockSettingChange(${idx}, 'cta_text', this.value)" />
                                        </div>

                                        <div class="sb-field-card">
                                            <div class="sb-slider-label">
                                                <span>\u2195\uFE0F \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0628\u0627\u0646\u0631 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u064A:</span>
                                                <strong id="val-banner-${idx}">${(s.banner_height || 0) === 0 ? "\u062A\u0644\u0642\u0627\u0626\u064A" : (s.banner_height || 0) + "px"}</strong>
                                            </div>
                                            <input type="range" min="0" max="400" step="10" class="sb-range-slider"
                                                   value="${s.banner_height || 0}"
                                                   oninput="
                                                       const v = Number(this.value);
                                                       document.getElementById('val-banner-${idx}').textContent = v === 0 ? '\u062A\u0644\u0642\u0627\u0626\u064A' : v + 'px';
                                                       window.StudioUI.handleBlockSettingChange(${idx}, 'banner_height', v);
                                                   " />
                                        </div>
                                    ` : ""}
                                </div>
                            </div>
                        `;
    }).join("")}
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/ModalsTab.ts
var ModalsTab = class {
  static render() {
    const mc = studioState.config.modals_customization || {};
    const pd = mc.product_details || {};
    const cd = mc.cart_drawer || {};
    const si = mc.store_info || {};
    return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card">
                    <span class="label">\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C</span>
                    <strong>${pd.cta_button_text ? "\u0645\u0647\u064A\u0623\u0629" : "\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629"}</strong>
                </div>
                <div class="sb-product-summary-card accent">
                    <span class="label">\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</span>
                    <strong>${cd.header_title ? "\u0645\u062E\u0635\u0635\u0629" : "\u0623\u0633\u0627\u0633\u064A\u0629"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0633\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631</span>
                    <strong>${si.delivery_policy ? "\u0645\u0643\u062A\u0648\u0628\u0629" : "\u063A\u064A\u0631 \u0645\u0641\u0639\u0644\u0629"}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-box-open" style="color:var(--sb-primary);"></i>
                    <h3>\u0634\u064A\u062A \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C (Product Details Sheet)</h3>
                </div>

                <div class="sb-product-mini-actions">
                    <button type="button" class="sb-product-mini-btn active" onclick="window.StudioUI.handleModalFieldChange('product_details', 'cta_button_text', '\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u{1F6CD}\uFE0F')">
                        <i class="fas fa-cart-plus"></i> \u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629
                    </button>
                    <button type="button" class="sb-product-mini-btn" onclick="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', '20px')">
                        <i class="fas fa-crop-simple"></i> \u0632\u0627\u0648\u064A\u0629 20
                    </button>
                    <button type="button" class="sb-product-mini-btn" onclick="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', '32px')">
                        <i class="fas fa-crop"></i> \u0632\u0627\u0648\u064A\u0629 32
                    </button>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0646\u0635 \u0632\u0631 \u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629</label>
                        <input type="text" class="sb-input" value="${pd.cta_button_text || "\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u{1F6CD}\uFE0F"}" 
                               oninput="window.StudioUI.handleModalFieldChange('product_details', 'cta_button_text', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0633\u062A\u062F\u0627\u0631\u0629 \u062D\u0648\u0627\u0641 \u0627\u0644\u0634\u064A\u062A \u0627\u0644\u0639\u0644\u0648\u064A</label>
                        <input type="text" class="sb-input" value="${pd.border_radius || "24px"}" 
                               onchange="window.StudioUI.handleModalFieldChange('product_details', 'border_radius', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-shopping-bag" style="color:#EC4899;"></i>
                    <h3>\u0646\u0627\u0641\u0630\u0629 \u0648\u0634\u064A\u062A \u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A (Cart Drawer)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0639\u0646\u0648\u0627\u0646 \u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0633\u0644\u0629</label>
                        <input type="text" class="sb-input" value="${cd.header_title || "\u0633\u0644\u0629 \u0645\u0634\u062A\u0631\u064A\u0627\u062A\u064A \u{1F6D2}"}" 
                               oninput="window.StudioUI.handleModalFieldChange('cart_drawer', 'header_title', this.value)" />
                    </div>

                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0646\u0635 \u0632\u0631 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639</label>
                        <input type="text" class="sb-input" value="${cd.checkout_btn_text || "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062F\u0641\u0639 \u{1F680}"}" 
                               oninput="window.StudioUI.handleModalFieldChange('cart_drawer', 'checkout_btn_text', this.value)" />
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-info-circle" style="color:#06B6D4;"></i>
                    <h3>\u0646\u0627\u0641\u0630\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0633\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 (Store Info)</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0644\u0636\u0645\u0627\u0646</label>
                        <textarea class="sb-textarea" oninput="window.StudioUI.handleModalFieldChange('store_info', 'delivery_policy', this.value)">${si.delivery_policy || "\u0646\u0648\u0641\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0639 \u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0631\u062C\u0627\u0639."}</textarea>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/ColorsTab.ts
var COLOR_FIELDS = [
  { key: "primary", label: "\u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A (Primary)", desc: "\u0627\u0644\u0623\u0632\u0631\u0627\u0631\u060C \u0627\u0644\u0631\u0648\u0627\u0628\u0637\u060C \u0648\u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0646\u0634\u0637\u0629" },
  { key: "primary_hover", label: "\u0644\u0648\u0646 \u0627\u0644\u062A\u0645\u0631\u064A\u0631 (Primary Hover)", desc: "\u0644\u0648\u0646 \u0627\u0644\u0623\u0632\u0631\u0627\u0631 \u0639\u0646\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0645 \u0648\u0627\u0644\u0644\u0645\u0633" },
  { key: "accent", label: "\u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u062A\u0643\u0645\u064A\u0644\u064A (Accent)", desc: "\u0627\u0644\u062A\u062F\u0631\u062C\u0627\u062A \u0648\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0645\u064A\u0632 \u0648\u0627\u0644\u0639\u0631\u0648\u0636" },
  { key: "bg_body", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 (Body BG)", desc: "\u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0643\u0627\u0641\u0629 \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631" },
  { key: "bg_card", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0643\u0631\u0648\u062A (Card BG)", desc: "\u0643\u0631\u0648\u062A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u0642\u0648\u0627\u0626\u0645" },
  { key: "bg_surface", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0633\u0637\u0648\u062D \u0648\u0627\u0644\u0634\u0631\u0627\u0626\u062D (Surface)", desc: "\u062E\u0644\u0641\u064A\u0627\u062A \u0627\u0644\u0628\u062D\u062B \u0648\u0634\u0631\u0627\u0626\u062D \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A" },
  { key: "text_main", label: "\u0627\u0644\u0646\u0635 \u0627\u0644\u0623\u0633\u0627\u0633\u064A (Text Main)", desc: "\u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 \u0648\u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0628\u0627\u0631\u0632\u0629" },
  { key: "text_muted", label: "\u0627\u0644\u0646\u0635 \u0627\u0644\u062B\u0627\u0646\u0648\u064A (Text Muted)", desc: "\u0627\u0644\u0648\u0635\u0641 \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" },
  { key: "border", label: "\u0644\u0648\u0646 \u0627\u0644\u062D\u062F\u0648\u062F (Border)", desc: "\u0625\u0637\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0631\u0648\u062A \u0648\u0627\u0644\u0641\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u062A\u062D\u062F\u064A\u062F" },
  { key: "navbar_bg", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A (Navbar)", desc: "\u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0639\u0644\u0648\u064A \u0644\u0644\u0645\u062A\u062C\u0631" },
  { key: "bottom_bar_bg", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A (Bottom Bar)", desc: "\u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0642\u0644 \u0641\u064A \u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644" },
  { key: "price_color", label: "\u0644\u0648\u0646 \u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C (Price)", desc: "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u062D\u0627\u0644\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u0645\u0646\u062A\u062C" },
  { key: "badge_bg", label: "\u0628\u0627\u062F\u062C \u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A \u0648\u0627\u0644\u0639\u0631\u0648\u0636", desc: "\u062E\u0644\u0641\u064A\u0629 \u0634\u0627\u0631\u0629 \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0648\u0646\u0641\u0627\u062F \u0627\u0644\u0645\u062E\u0632\u0648\u0646" },
  { key: "btn_primary_bg", label: "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", desc: "\u0623\u0632\u0631\u0627\u0631 \u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629 \u0648\u0627\u0644\u0634\u0631\u0627\u0621 \u0627\u0644\u0641\u0648\u0631\u064A" },
  { key: "chatbot_btn_bg", label: "\u0632\u0631 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A / \u0627\u0644\u0634\u0627\u062A", desc: "\u0627\u0644\u0632\u0631 \u0627\u0644\u0639\u0627\u0626\u0645 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629" }
];
var ColorsTab = class {
  static render(targetMode) {
    const isLightTab = targetMode === "light";
    const modeKey = isLightTab ? "light_theme" : "dark_theme";
    const colors = studioState.config[modeKey]?.colors || {};
    const currentPrimary = colors.primary || (isLightTab ? "#4F46E5" : "#6366F1");
    const currentBg = colors.bg_body || (isLightTab ? "#F8FAFC" : "#0B1120");
    const currentText = colors.text_main || (isLightTab ? "#0F172A" : "#F8FAFC");
    const currentAccent = colors.accent || (isLightTab ? "#14B8A6" : "#2DD4BF");
    return `
        <div class="sb-tab-pane">
            <div class="sb-color-topbar">
                <button class="sb-seg-btn ${isLightTab ? "active" : ""}" 
                        onclick="window.StudioUI.setActiveTab('light_colors')">
                    \u2600\uFE0F \u0641\u0627\u062A\u062D
                </button>
                <button class="sb-seg-btn ${!isLightTab ? "active" : ""}" 
                        onclick="window.StudioUI.setActiveTab('dark_colors')">
                    \u{1F319} \u062F\u0627\u0643\u0646
                </button>
            </div>

            <div class="sb-color-banner">
                <div>
                    <strong>\u{1F4A1} \u062B\u064A\u0645\u0627\u062A \u062C\u0627\u0647\u0632\u0629</strong>
                    <span>\u0627\u062E\u062A\u064E\u0631 \u0646\u0645\u0637\u064B\u0627 \u0645\u062A\u0646\u0627\u0633\u0642\u064B\u0627 \u0644\u062F\u064A\u0643 \u0641\u064A \u062B\u0648\u0627\u0646\u064D\u060C \u0623\u0648 \u0639\u062F\u0651\u0644 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u064A\u062F\u0648\u064A\u064B\u0627.</span>
                </div>
                <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:6px 10px; font-weight:700; white-space:nowrap;"
                        onclick="window.StudioUI.setActiveTab('ai_palette')">
                    <i class="fas fa-palette" style="color:#A78BFA;"></i>
                    <span>\u062A\u0635\u0641\u062D 20 \u062B\u064A\u0645</span>
                </button>
            </div>

            <!-- \u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0630\u0643\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0644\u0644\u0648\u0636\u0639 \u0627\u0644\u062D\u0627\u0644\u064A -->
            <div class="sb-card-group highlight" style="background: ${isLightTab ? "rgba(245, 158, 11, 0.06)" : "rgba(99, 102, 241, 0.08)"}; border-color: ${isLightTab ? "rgba(245, 158, 11, 0.3)" : "rgba(99, 102, 241, 0.3)"};">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:${isLightTab ? "#F59E0B" : "#818CF8"};"></i>
                    <h3>${isLightTab ? "\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F" : "\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u{1F319}"}</h3>
                </div>

                <p style="font-size:0.82rem; color:var(--sb-muted); line-height:1.45; margin-bottom:12px;">
                    \u0627\u062E\u062A\u0631 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062A\u064A \u062A\u0631\u064A\u062F\u0647\u0627 (\u0627\u0644\u0623\u0633\u0627\u0633\u064A\u060C \u0627\u0644\u062E\u0644\u0641\u064A\u0629\u060C \u0627\u0644\u062E\u0637\u060C \u0627\u0644\u062A\u0645\u064A\u064A\u0632) \u0648\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0645\u0648\u0644\u062F \u0628\u062A\u0646\u0633\u064A\u0642 \u0648\u0627\u0634\u062A\u0642\u0627\u0642 \u0628\u0627\u0642\u064A \u0639\u0646\u0627\u0635\u0631 \u0648\u0645\u0643\u0648\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u0627\u0646\u0633\u062C\u0627\u0645 \u062A\u0627\u0645:
                </p>

                <!-- \u0634\u0628\u0643\u0629 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0644\u0645\u0648\u0644\u062F -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:14px;">
                    <!-- \u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">\u{1F3A8} \u0627\u0644\u0623\u0633\u0627\u0633\u064A (Primary)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-primary-${modeKey}" value="${currentPrimary}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentPrimary}</span>
                        </div>
                    </div>

                    <!-- \u0644\u0648\u0646 \u0627\u0644\u062E\u0644\u0641\u064A\u0629 -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">\u{1F5BC}\uFE0F \u0627\u0644\u062E\u0644\u0641\u064A\u0629 (Background)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-bg-${modeKey}" value="${currentBg}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentBg}</span>
                        </div>
                    </div>

                    <!-- \u0644\u0648\u0646 \u0627\u0644\u062E\u0637 -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">\u270D\uFE0F \u0644\u0648\u0646 \u0627\u0644\u0646\u0635 (Text)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-text-${modeKey}" value="${currentText}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentText}</span>
                        </div>
                    </div>

                    <!-- \u0644\u0648\u0646 \u0627\u0644\u062A\u0645\u064A\u064A\u0632 -->
                    <div class="sb-field-card" style="padding:8px 10px;">
                        <label style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-bottom:4px; font-weight:700;">\u26A1 \u0627\u0644\u062A\u0645\u064A\u064A\u0632 (Accent)</label>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <input type="color" id="seed-accent-${modeKey}" value="${currentAccent}" class="sb-color-input" style="width:34px; height:30px;" />
                            <span style="font-size:0.75rem; font-family:monospace; color:var(--sb-text);">${currentAccent}</span>
                        </div>
                    </div>
                </div>

                <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0648\u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u062E\u0635\u0635 -->
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <!-- \u0632\u0631 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0644\u0648\u0636\u0639 -->
                    <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:11px; font-weight:800;"
                            onclick="window.StudioUI.generateSmartForMode('${isLightTab ? "light" : "dark"}')">
                        <i class="fas fa-magic"></i>
                        <span>\u062A\u0648\u0644\u064A\u062F \u0648\u062A\u0646\u0633\u064A\u0642 \u0630\u0643\u064A \u0644\u0643\u0627\u0641\u0629 \u0623\u0644\u0648\u0627\u0646 ${isLightTab ? "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F" : "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u{1F319}"}</span>
                    </button>

                    <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u0646\u0641\u0635\u0644 \u0644\u0643\u0644 \u062C\u0632\u0621 -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:6px;">
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? "light" : "dark"}', 'bg')">
                            <i class="fas fa-layer-group"></i>
                            <span>\u0627\u0644\u062E\u0644\u0641\u064A\u0627\u062A \u0648\u0627\u0644\u0643\u0631\u0648\u062A</span>
                        </button>
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? "light" : "dark"}', 'buttons')">
                            <i class="fas fa-hand-pointer"></i>
                            <span>\u0627\u0644\u0623\u0632\u0631\u0627\u0631 \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631</span>
                        </button>
                        <button class="sb-btn sb-btn-outline" style="font-size:0.76rem; padding:7px 4px; justify-content:center; text-align:center;"
                                onclick="window.StudioUI.generateSmartSectionForMode('${isLightTab ? "light" : "dark"}', 'text')">
                            <i class="fas fa-font"></i>
                            <span>\u0627\u0644\u0646\u0635\u0648\u0635 \u0648\u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0644\u0648\u0646\u064A\u0629 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629 \u0644\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u064A\u062F\u0648\u064A \u0627\u0644\u062F\u0642\u064A\u0642 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas ${isLightTab ? "fa-sliders-h" : "fa-sliders-h"}" style="color:${isLightTab ? "#F59E0B" : "#818CF8"};"></i>
                    <h3>${isLightTab ? "\u062A\u062E\u0635\u064A\u0635 \u0643\u0644 \u0644\u0648\u0646 \u0641\u064A \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644" : "\u062A\u062E\u0635\u064A\u0635 \u0643\u0644 \u0644\u0648\u0646 \u0641\u064A \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644"}</h3>
                </div>

                <div class="sb-color-cards-list">
                    ${COLOR_FIELDS.map((f) => {
      const val = colors[f.key] || (isLightTab ? "#4F46E5" : "#6366F1");
      const safeHex = val.startsWith("#") && (val.length === 7 || val.length === 4 || val.length === 9) ? val : isLightTab ? "#4F46E5" : "#6366F1";
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
    }).join("")}
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/AIPaletteTab.ts
var AIPaletteTab = class {
  static render() {
    const seedPrimary = studioState.config.light_theme?.colors?.primary || "#4F46E5";
    const seedLightBg = studioState.config.light_theme?.colors?.bg_body || "#F8FAFC";
    const seedDarkBg = studioState.config.dark_theme?.colors?.bg_body || "#0B1120";
    const seedAccent = studioState.config.light_theme?.colors?.accent || "#14B8A6";
    const currentThemeId = studioState.config.theme_name || "";
    const typo = studioState.config.typography || {};
    const ps = studioState.config.products_settings || {};
    const port = ps.portrait || {};
    const land = ps.landscape || {};
    const categories = ["\u0627\u0644\u0643\u0644", ...Array.from(new Set(THEME_PRESETS.map((p) => p.category || "\u0639\u0627\u0645")))];
    return `
        <div class="sb-tab-pane">
            <!-- \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062A\u0648\u062C\u064A\u0647 \u0648\u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0644\u0644\u062A\u0627\u062C\u0631 -->
            <div class="sb-card-group highlight" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12)); border-color: rgba(168, 85, 247, 0.35);">
                <div class="sb-group-header" style="margin-bottom:8px;">
                    <i class="fas fa-palette" style="color:#A78BFA; font-size:1.2rem;"></i>
                    <h3 style="font-size:1.05rem;">\u0643\u064A\u0641 \u062A\u0631\u064A\u062F \u062A\u062E\u0635\u064A\u0635 \u0645\u0638\u0647\u0631 \u0648\u0623\u0644\u0648\u0627\u0646 \u0645\u062A\u062C\u0631\u0643\u061F</h3>
                </div>
                <p style="font-size:0.84rem; color:var(--sb-muted); line-height:1.5; margin-bottom:12px;">
                    \u064A\u0645\u0643\u0646\u0643 \u0627\u062E\u062A\u064A\u0627\u0631 <strong>\u062B\u064A\u0645 \u0645\u062A\u0646\u0627\u0633\u0642 \u062C\u0627\u0647\u0632 \u0645\u0646 \u0628\u064A\u0646 20 \u062B\u064A\u0645 \u0645\u0635\u0645\u0645 \u0628\u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629</strong> \u0644\u0644\u0648\u0636\u0639\u064A\u0646 \u0627\u0644\u0641\u0627\u062A\u062D \u0648\u0627\u0644\u062F\u0627\u0643\u0646\u060C \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 <strong>\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0648\u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u062D\u0631</strong> \u0644\u0643\u0644 \u0644\u0648\u0646:
                </p>

                <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0628\u064A\u0646 \u0637\u0631\u0642 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                    <button type="button" class="sb-btn sb-btn-primary" style="justify-content:center; padding:10px 8px; font-size:0.82rem; font-weight:800;" onclick="document.getElementById('section-ready-themes')?.scrollIntoView({behavior:'smooth'})">
                        <i class="fas fa-swatchbook"></i>
                        <span>\u062A\u0635\u0641\u062D 20 \u062B\u064A\u0645 \u062C\u0627\u0647\u0632 \u{1F3A8}</span>
                    </button>
                    <button type="button" class="sb-btn sb-btn-outline" style="justify-content:center; padding:10px 8px; font-size:0.82rem; font-weight:800;" onclick="document.getElementById('section-ai-generator')?.scrollIntoView({behavior:'smooth'})">
                        <i class="fas fa-wand-magic-sparkles" style="color:#A78BFA;"></i>
                        <span>\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0648\u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u062D\u0631 \u26A1</span>
                    </button>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- \u{1F31F} \u0642\u0633\u0645 \u0627\u0644\u0640 20 \u062B\u064A\u0645 \u0645\u062A\u0646\u0627\u0633\u0642 \u062C\u0627\u0647\u0632 \u0644\u0644\u062F\u0627\u0643\u0646 \u0648\u0627\u0644\u0641\u0627\u062A\u062D -->
            <!-- ============================================== -->
            <div class="sb-card-group" id="section-ready-themes">
                <div class="sb-group-header">
                    <i class="fas fa-sparkles" style="color:#F59E0B;"></i>
                    <div>
                        <h3 style="font-size:1rem;">\u0628\u0627\u0642\u0629 \u0627\u0644\u0640 20 \u062B\u064A\u0645 \u0627\u0644\u062C\u0627\u0647\u0632\u0629 \u0648\u0627\u0644\u0645\u062A\u0646\u0627\u0633\u0642\u0629 (${THEME_PRESETS.length} \u062B\u064A\u0645)</h3>
                        <span style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-top:2px;">
                            \u0627\u062E\u062A\u0631 \u0627\u0644\u062B\u064A\u0645 \u0648\u0637\u0628\u0651\u0642\u0647 \u0639\u0644\u0649 \u0627\u0644\u0648\u0636\u0639\u064A\u0646 \u0645\u0639\u0627\u064B \u0623\u0648 \u0639\u0644\u0649 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D \u0623\u0648 \u0627\u0644\u062F\u0627\u0643\u0646 \u0641\u0642\u0637:
                        </span>
                    </div>
                </div>

                <!-- \u0634\u0631\u064A\u0637 \u0641\u0644\u062A\u0631\u0629 \u0627\u0644\u0641\u0626\u0627\u062A \u0644\u0644\u062B\u064A\u0645\u0627\u062A \u0627\u0644\u0640 20 -->
                <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:12px;" id="theme-category-pills">
                    ${categories.map((cat, idx) => `
                        <button class="sb-badge-pill ${idx === 0 ? "active" : ""}" 
                                onclick="window.StudioUI.filterPresetCards('${cat}', this)"
                                style="cursor:pointer; padding:5px 12px; font-size:0.78rem; white-space:nowrap; transition:all 0.2s;">
                            ${cat === "\u0627\u0644\u0643\u0644" ? "\u{1F31F} \u0627\u0644\u0643\u0644 (20)" : cat}
                        </button>
                    `).join("")}
                </div>

                <!-- \u0634\u0628\u0643\u0629 \u0643\u0631\u0648\u062A \u0627\u0644\u0640 20 \u062B\u064A\u0645 -->
                <div class="sb-themes-grid" style="display:grid; grid-template-columns: 1fr; gap:14px;">
                    ${THEME_PRESETS.map((p, idx) => {
      const isActive = currentThemeId === p.id;
      const lColors = p.light_theme?.colors || {};
      const dColors = p.dark_theme?.colors || {};
      return `
                        <div class="sb-preset-theme-card" data-category="${p.category || "\u0639\u0627\u0645"}" 
                             style="content-visibility:auto; contain-intrinsic-size:0 160px; border:1px solid ${isActive ? "var(--sb-primary)" : "var(--sb-border)"}; background:var(--sb-card); border-radius:14px; padding:12px 14px; position:relative; box-shadow:${isActive ? "0 0 0 2px var(--sb-primary)" : "none"}; transition:all 0.2s;">
                            
                            <!-- \u0631\u0623\u0633 \u0627\u0644\u0643\u0631\u062A -->
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <strong style="font-size:0.95rem; color:var(--sb-text); font-weight:800;">${p.name}</strong>
                                        <span style="font-size:0.7rem; background:rgba(99, 102, 241, 0.12); color:#818CF8; padding:2px 8px; border-radius:6px; font-weight:600;">
                                            ${p.category || "\u0639\u0627\u0645"}
                                        </span>
                                    </div>
                                    <p style="font-size:0.78rem; color:var(--sb-muted); line-height:1.4; margin-top:4px;">${p.description}</p>
                                </div>
                                <span style="font-size:0.74rem; color:var(--sb-muted); font-family:monospace; background:var(--sb-surface); padding:2px 6px; border-radius:4px;">#${idx + 1}</span>
                            </div>

                            <!-- \u0645\u0639\u0627\u064A\u0646\u0629 \u0628\u0627\u0644\u064A\u062A \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0644\u0644\u0641\u0627\u062A\u062D \u0648\u0627\u0644\u062F\u0627\u0643\u0646 -->
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin:10px 0; background:var(--sb-surface); padding:8px 10px; border-radius:10px;">
                                <!-- \u0627\u0644\u0641\u0627\u062A\u062D -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <span style="font-size:0.72rem; color:var(--sb-muted); font-weight:700;">\u2600\uFE0F \u0627\u0644\u0641\u0627\u062A\u062D:</span>
                                        <span style="font-size:0.68rem; font-family:monospace; color:${lColors.primary || "#4F46E5"};">${lColors.primary || "#4F46E5"}</span>
                                    </div>
                                    <div style="display:flex; gap:4px;">
                                        <div title="\u0627\u0644\u0623\u0633\u0627\u0633\u064A" style="width:20px; height:20px; border-radius:4px; background:${lColors.primary || "#4F46E5"};"></div>
                                        <div title="\u0627\u0644\u062A\u0645\u064A\u064A\u0632" style="width:20px; height:20px; border-radius:4px; background:${lColors.accent || "#14B8A6"};"></div>
                                        <div title="\u0627\u0644\u062E\u0644\u0641\u064A\u0629" style="width:20px; height:20px; border-radius:4px; background:${lColors.bg_body || "#F8FAFC"}; border:1px solid #CBD5E1;"></div>
                                        <div title="\u0627\u0644\u0643\u0631\u0648\u062A" style="width:20px; height:20px; border-radius:4px; background:${lColors.bg_card || "#FFFFFF"}; border:1px solid #CBD5E1;"></div>
                                        <div title="\u0627\u0644\u0646\u0635" style="width:20px; height:20px; border-radius:4px; background:${lColors.text_main || "#0F172A"};"></div>
                                    </div>
                                </div>

                                <!-- \u0627\u0644\u062F\u0627\u0643\u0646 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <span style="font-size:0.72rem; color:var(--sb-muted); font-weight:700;">\u{1F319} \u0627\u0644\u062F\u0627\u0643\u0646:</span>
                                        <span style="font-size:0.68rem; font-family:monospace; color:${dColors.primary || "#6366F1"};">${dColors.primary || "#6366F1"}</span>
                                    </div>
                                    <div style="display:flex; gap:4px;">
                                        <div title="\u0627\u0644\u0623\u0633\u0627\u0633\u064A" style="width:20px; height:20px; border-radius:4px; background:${dColors.primary || "#6366F1"};"></div>
                                        <div title="\u0627\u0644\u062A\u0645\u064A\u064A\u0632" style="width:20px; height:20px; border-radius:4px; background:${dColors.accent || "#2DD4BF"};"></div>
                                        <div title="\u0627\u0644\u062E\u0644\u0641\u064A\u0629" style="width:20px; height:20px; border-radius:4px; background:${dColors.bg_body || "#0B1120"}; border:1px solid #334155;"></div>
                                        <div title="\u0627\u0644\u0643\u0631\u0648\u062A" style="width:20px; height:20px; border-radius:4px; background:${dColors.bg_card || "#151E2E"}; border:1px solid #334155;"></div>
                                        <div title="\u0627\u0644\u0646\u0635" style="width:20px; height:20px; border-radius:4px; background:${dColors.text_main || "#F8FAFC"};"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u062B\u0644\u0627\u062B\u0629 (\u0644\u0644\u0648\u0636\u0639\u064A\u0646 / \u0644\u0644\u0641\u0627\u062A\u062D / \u0644\u0644\u062F\u0627\u0643\u0646) -->
                            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:6px; margin-top:8px;">
                                <button class="sb-btn sb-btn-primary" style="font-size:0.78rem; padding:8px 4px; justify-content:center; font-weight:800;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'both')">
                                    <i class="fas fa-wand-magic-sparkles"></i>
                                    <span>\u062A\u0637\u0628\u064A\u0642 \u0644\u0644\u0648\u0636\u0639\u064A\u0646 \u2728</span>
                                </button>
                                <button class="sb-btn sb-btn-outline" style="font-size:0.74rem; padding:8px 2px; justify-content:center; font-weight:700;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'light')">
                                    <i class="fas fa-sun" style="color:#F59E0B;"></i>
                                    <span>\u0644\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F</span>
                                </button>
                                <button class="sb-btn sb-btn-outline" style="font-size:0.74rem; padding:8px 2px; justify-content:center; font-weight:700;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'dark')">
                                    <i class="fas fa-moon" style="color:#818CF8;"></i>
                                    <span>\u0644\u0644\u062F\u0627\u0643\u0646 \u{1F319}</span>
                                </button>
                            </div>
                        </div>
                        `;
    }).join("")}
                </div>
            </div>

            <!-- ============================================== -->
            <!-- \u26A1 \u0642\u0633\u0645 \u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0628\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u0648\u062C\u0647\u0629 \u0648\u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u062D\u0631 -->
            <!-- ============================================== -->
            <div class="sb-card-group highlight" id="section-ai-generator">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:#A78BFA;"></i>
                    <h3>\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0644\u0647\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0638\u0647\u0631 (AI Smart Studio)</h3>
                </div>

                <div class="sb-ai-generator-box">
                    <p style="font-size:0.84rem; color:var(--sb-muted); line-height:1.5;">
                        \u062D\u062F\u062F \u0623\u0644\u0648\u0627\u0646 \u0647\u0648\u064A\u062A\u0643 \u0648\u062E\u0644\u0641\u064A\u0627\u062A\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0648\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u0628\u062A\u0646\u0633\u064A\u0642 \u0648\u0627\u0634\u062A\u0642\u0627\u0642 \u0627\u0644\u0648\u0636\u0639\u064A\u0646 \u0627\u0644\u0641\u0627\u062A\u062D \u0648\u0627\u0644\u062F\u0627\u0643\u0646 \u0648\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u062E\u0637\u0648\u0637 \u0648\u0627\u0644\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u0645\u062A\u0646\u0627\u063A\u0645\u0629 \u0645\u0639\u0647\u0627 \u0641\u0648\u0631\u0627\u064B!
                    </p>

                    <!-- \u0634\u0628\u0643\u0629 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u0648\u062C\u0647\u0629 \u0644\u0644\u062A\u0648\u0644\u064A\u062F -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:12px;">
                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">\u{1F3A8} \u0644\u0648\u0646 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A (Primary)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-primary" value="${seedPrimary}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-primary-hex').value = this.value" />
                                <input type="text" id="ai-seed-primary-hex" class="sb-input" value="${seedPrimary}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-primary').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">\u26A1 \u0644\u0648\u0646 \u0627\u0644\u062A\u0645\u064A\u064A\u0632 \u0627\u0644\u062A\u0643\u0645\u064A\u0644\u064A (Accent)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-accent" value="${seedAccent}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-accent-hex').value = this.value" />
                                <input type="text" id="ai-seed-accent-hex" class="sb-input" value="${seedAccent}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-accent').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">\u2600\uFE0F \u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0641\u0627\u062A\u062D \u0627\u0644\u0645\u0641\u0636\u0644\u0629 (Light BG)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-lightbg" value="${seedLightBg}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-lightbg-hex').value = this.value" />
                                <input type="text" id="ai-seed-lightbg-hex" class="sb-input" value="${seedLightBg}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-lightbg').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">\u{1F319} \u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u062F\u0627\u0643\u0646 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 (Dark BG)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-darkbg" value="${seedDarkBg}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-darkbg-hex').value = this.value" />
                                <input type="text" id="ai-seed-darkbg-hex" class="sb-input" value="${seedDarkBg}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-darkbg').value = this.value" />
                            </div>
                        </div>
                    </div>

                    <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0648\u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0630\u0643\u064A -->
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px;">
                        <!-- \u0627\u0644\u0632\u0631 \u0627\u0644\u0634\u0627\u0645\u0644 -->
                        <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:12px; font-weight:900;" 
                                onclick="window.StudioUI.generateSmartHarmony('intelligent')">
                            <i class="fas fa-wand-magic-sparkles"></i>
                            <span>\u062A\u0648\u0644\u064A\u062F \u0630\u0643\u064A \u0634\u0627\u0645\u0644 (\u0627\u0644\u0648\u0636\u0639\u064A\u0646 + \u0627\u0644\u062E\u0637\u0648\u0637 + \u0627\u0644\u0623\u0634\u0643\u0627\u0644 + \u0627\u0644\u0639\u0631\u0636) \u{1F680}</span>
                        </button>

                        <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0644\u0643\u0644 \u0648\u0636\u0639 \u0644\u062D\u0627\u0644\u0647 -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                            <button class="sb-btn sb-btn-outline" style="justify-content:center; padding:9px; font-weight:700;"
                                    onclick="window.StudioUI.generateSmartForMode('light')">
                                <i class="fas fa-sun" style="color:#F59E0B;"></i>
                                <span>\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0641\u0627\u062A\u062D \u0644\u062D\u0627\u0644\u0647 \u2600\uFE0F</span>
                            </button>

                            <button class="sb-btn sb-btn-outline" style="justify-content:center; padding:9px; font-weight:700;"
                                    onclick="window.StudioUI.generateSmartForMode('dark')">
                                <i class="fas fa-moon" style="color:#818CF8;"></i>
                                <span>\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u062F\u0627\u0643\u0646 \u0644\u062D\u0627\u0644\u0647 \u{1F319}</span>
                            </button>
                        </div>

                        <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A \u0644\u0643\u0644 \u0648\u0636\u0639 -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                            <button class="sb-btn sb-btn-secondary" style="font-size:0.78rem; justify-content:center; padding:7px;"
                                    onclick="window.StudioUI.setActiveTab('light_colors')">
                                <i class="fas fa-sliders-h"></i>
                                <span>\u062A\u062E\u0635\u064A\u0635 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0641\u0627\u062A\u062D \u062A\u0641\u0635\u064A\u0644\u064A\u0627\u064B \u2600\uFE0F</span>
                            </button>

                            <button class="sb-btn sb-btn-secondary" style="font-size:0.78rem; justify-content:center; padding:7px;"
                                    onclick="window.StudioUI.setActiveTab('dark_colors')">
                                <i class="fas fa-sliders-h"></i>
                                <span>\u062A\u062E\u0635\u064A\u0635 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062F\u0627\u0643\u0646 \u062A\u0641\u0635\u064A\u0644\u064A\u0627\u064B \u{1F319}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- \u0645\u0644\u062E\u0635 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u0637\u0628\u0642\u0629 \u062D\u0627\u0644\u064A\u0627\u064B -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-id-card" style="color:var(--sb-accent);"></i>
                    <h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u0637\u0628\u0642\u0629 \u062D\u0627\u0644\u064A\u0627\u064B</h3>
                </div>

                <div class="sb-field-card">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
                        <div>
                            <span style="font-size:0.78rem; color:var(--sb-muted); display:block; margin-bottom:6px;">\u2600\uFE0F \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0641\u0627\u062A\u062D:</span>
                            <div style="display:flex; gap:6px;">
                                <div title="\u0627\u0644\u0623\u0633\u0627\u0633\u064A" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.primary || "#4F46E5"};"></div>
                                <div title="\u0627\u0644\u062A\u0645\u064A\u064A\u0632" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.accent || "#14B8A6"};"></div>
                                <div title="\u0627\u0644\u062E\u0644\u0641\u064A\u0629" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.bg_body || "#F8FAFC"}; border:1px solid #CBD5E1;"></div>
                            </div>
                        </div>
                        <div>
                            <span style="font-size:0.78rem; color:var(--sb-muted); display:block; margin-bottom:6px;">\u{1F319} \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062F\u0627\u0643\u0646:</span>
                            <div style="display:flex; gap:6px;">
                                <div title="\u0627\u0644\u0623\u0633\u0627\u0633\u064A" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.primary || "#6366F1"};"></div>
                                <div title="\u0627\u0644\u062A\u0645\u064A\u064A\u0632" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.accent || "#2DD4BF"};"></div>
                                <div title="\u0627\u0644\u062E\u0644\u0641\u064A\u0629" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.bg_body || "#0B1120"}; border:1px solid #334155;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="border-top:1px dashed var(--sb-border); padding-top:10px; display:flex; flex-direction:column; gap:6px; font-size:0.84rem;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">\u270D\uFE0F \u0627\u0644\u062E\u0637 \u0627\u0644\u0645\u062E\u062A\u0627\u0631:</span>
                            <strong style="color:var(--sb-primary);">${typo.font_family || "Tajawal"}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">\u{1F4F1} \u0639\u0631\u0636 \u0627\u0644\u062C\u0648\u0627\u0644:</span>
                            <strong style="color:#A5B4FC;">${(port.scroll_direction || "horizontal") === "horizontal" ? "\u2194\uFE0F \u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u0644\u0645\u0633" : "\u2195\uFE0F \u0634\u0628\u0643\u0629 \u0639\u0645\u0648\u062F\u064A\u0629"} (${port.grid_columns || 2} \u0623\u0639\u0645\u062F\u0629)</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">\u{1F4BB} \u0639\u0631\u0636 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631:</span>
                            <strong style="color:#38BDF8;">${(land.scroll_direction || "horizontal") === "horizontal" ? "\u2194\uFE0F \u0633\u0644\u0627\u064A\u062F\u0631 \u0628\u0627\u0644\u0645\u0627\u0648\u0633" : "\u2195\uFE0F \u0634\u0628\u0643\u0629 \u0643\u0628\u0631\u0649"} (${land.grid_columns || 4} \u0623\u0639\u0645\u062F\u0629)</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/TypographyTab.ts
var TypographyTab = class {
  static render() {
    const typo = studioState.config.typography || {};
    const currentFont = typo.font_family || "Tajawal";
    const mobileBasePx = parseInt(typo.base_size_mobile || "15") || 15;
    const desktopBasePx = parseInt(typo.base_size_desktop || "17") || 17;
    const mobilePricePx = parseFloat(typo.price_size_mobile || "1.1") || 1.1;
    const desktopPricePx = parseFloat(typo.price_size_desktop || "1.25") || 1.25;
    const mobileHeadPx = parseFloat(typo.heading_size_mobile || "1.15") || 1.15;
    const desktopHeadPx = parseFloat(typo.heading_size_desktop || "1.45") || 1.45;
    return `
        <div class="sb-tab-pane">
            <div class="sb-typography-summary">
                <div class="sb-typography-summary-card">
                    <span>\u0627\u0644\u062E\u0637</span>
                    <strong>${currentFont}</strong>
                </div>
                <div class="sb-typography-summary-card accent">
                    <span>\u0627\u0644\u0648\u0632\u0646</span>
                    <strong>${typo.heading_weight || "700"}</strong>
                </div>
                <div class="sb-typography-summary-card">
                    <span>\u0627\u0644\u062D\u062C\u0645</span>
                    <strong>${desktopBasePx}px</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-font" style="color:var(--sb-accent);"></i>
                    <h3>\u0646\u0648\u0639 \u0627\u0644\u062E\u0637 \u0627\u0644\u0639\u0631\u0628\u064A \u0627\u0644\u0631\u0633\u0645\u064A \u0644\u0644\u0645\u062A\u062C\u0631</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u0637 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0644\u0644\u0648\u0627\u062C\u0647\u0629</label>
                        <select class="sb-select" onchange="window.StudioUI.handleTypographyChange('font_family', this.value, true)">
                            ${ALLOWED_FONTS.map((font) => `
                                <option value="${font}" ${currentFont === font ? "selected" : ""}>${font} - \u0627\u0644\u062E\u0637 \u0627\u0644\u0639\u0631\u0628\u064A</option>
                            `).join("")}
                        </select>
                    </div>

                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <label class="sb-field-label">\u0633\u0645\u0627\u0643\u0629 \u0648\u0648\u0632\u0646 \u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0623\u0642\u0633\u0627\u0645</label>
                        <div class="sb-segmented-control">
                            <button class="sb-seg-btn ${(typo.heading_weight || "700") === "600" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '600')">
                                \u0645\u062A\u0648\u0633\u0637 (600)
                            </button>
                            <button class="sb-seg-btn ${(typo.heading_weight || "700") === "700" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '700')">
                                \u0639\u0631\u064A\u0636 (700) \u2B50
                            </button>
                            <button class="sb-seg-btn ${typo.heading_weight === "800" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '800')">
                                \u0628\u0627\u0631\u0632 \u062C\u062F\u0627\u064B (800)
                            </button>
                            <button class="sb-seg-btn ${typo.heading_weight === "900" ? "active" : ""}" 
                                    onclick="window.StudioUI.handleTypographyChange('heading_weight', '900')">
                                \u0628\u0644\u0627\u0643 (900)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- \u0623\u062D\u062C\u0627\u0645 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0645\u062A\u062C\u0627\u0648\u0628\u0629 \u0628\u062E\u0637 \u062A\u0645\u0631\u064A\u0631 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-text-height" style="color:#FBBF24;"></i>
                    <h3>\u{1F39A}\uFE0F \u062D\u062C\u0645 \u062E\u0637 \u0627\u0644\u0646\u0635 \u0627\u0644\u0623\u0633\u0627\u0633\u064A</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4F1} \u062D\u062C\u0645 \u0627\u0644\u062E\u0637 \u0628\u0627\u0644\u062C\u0648\u0627\u0644:</span>
                            <strong id="val-font-mobile">${mobileBasePx}px</strong>
                        </div>
                        <input type="range" min="12" max="20" step="1" class="sb-range-slider"
                               value="${mobileBasePx}"
                               oninput="
                                   document.getElementById('val-font-mobile').textContent = this.value + 'px';
                                   window.StudioUI.handleTypographyChange('base_size_mobile', this.value + 'px', false);
                               " />
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--sb-muted); margin-top:4px;">
                            <span>12px</span><span>\u0635\u063A\u064A\u0631 14</span><span>\u2B5015</span><span>16</span><span>20px</span>
                        </div>
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4BB} \u062D\u062C\u0645 \u0627\u0644\u062E\u0637 \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631:</span>
                            <strong id="val-font-desktop">${desktopBasePx}px</strong>
                        </div>
                        <input type="range" min="13" max="22" step="1" class="sb-range-slider"
                               value="${desktopBasePx}"
                               oninput="
                                   document.getElementById('val-font-desktop').textContent = this.value + 'px';
                                   window.StudioUI.handleTypographyChange('base_size_desktop', this.value + 'px', false);
                               " />
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--sb-muted); margin-top:4px;">
                            <span>13px</span><span>15</span><span>\u2B5017</span><span>19</span><span>22px</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- \u062D\u062C\u0645 \u062E\u0637 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-heading" style="color:#A78BFA;"></i>
                    <h3>\u{1F39A}\uFE0F \u062D\u062C\u0645 \u062E\u0637 \u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4F1} \u062D\u062C\u0645 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0628\u0627\u0644\u062C\u0648\u0627\u0644:</span>
                            <strong id="val-head-mobile">${(mobileHeadPx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="90" max="160" step="5" class="sb-range-slider"
                               value="${Math.round(mobileHeadPx * 100)}"
                               oninput="
                                   document.getElementById('val-head-mobile').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('heading_size_mobile', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4BB} \u062D\u062C\u0645 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631:</span>
                            <strong id="val-head-desktop">${(desktopHeadPx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="100" max="200" step="5" class="sb-range-slider"
                               value="${Math.round(desktopHeadPx * 100)}"
                               oninput="
                                   document.getElementById('val-head-desktop').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('heading_size_desktop', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>
                </div>
            </div>

            <!-- \u062D\u062C\u0645 \u062E\u0637 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-tag" style="color:#10B981;"></i>
                    <h3>\u{1F39A}\uFE0F \u062D\u062C\u0645 \u062E\u0637 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0639\u0644\u0649 \u0627\u0644\u0643\u0631\u0648\u062A</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4F1} \u062D\u062C\u0645 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062C\u0648\u0627\u0644:</span>
                            <strong id="val-price-mobile">${(mobilePricePx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="80" max="160" step="5" class="sb-range-slider"
                               value="${Math.round(mobilePricePx * 100)}"
                               oninput="
                                   document.getElementById('val-price-mobile').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('price_size_mobile', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>

                    <div class="sb-field-card">
                        <div class="sb-slider-label">
                            <span>\u{1F4BB} \u062D\u062C\u0645 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631:</span>
                            <strong id="val-price-desktop">${(desktopPricePx * 100).toFixed(0)}%</strong>
                        </div>
                        <input type="range" min="90" max="180" step="5" class="sb-range-slider"
                               value="${Math.round(desktopPricePx * 100)}"
                               oninput="
                                   document.getElementById('val-price-desktop').textContent = this.value + '%';
                                   window.StudioUI.handleTypographyChange('price_size_desktop', (this.value/100).toFixed(2) + 'rem', false);
                               " />
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/MarketingTab.ts
var MarketingTab = class {
  static render() {
    const m = studioState.config.marketing || {};
    const wa = m.whatsapp_floating || {};
    const ship = m.free_shipping_bar || {};
    return `
        <div class="sb-tab-pane">
            <div class="sb-product-summary">
                <div class="sb-product-summary-card ${wa.enabled ? "accent" : ""}">
                    <span class="label">\u0648\u0627\u062A\u0633\u0627\u0628</span>
                    <strong>${wa.enabled ? "\u0645\u0641\u0639\u0651\u0644" : "\u0645\u062A\u0648\u0642\u0641"}</strong>
                </div>
                <div class="sb-product-summary-card ${ship.enabled ? "accent" : ""}">
                    <span class="label">\u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0645\u062C\u0627\u0646\u064A</span>
                    <strong>${ship.enabled ? "\u0646\u0634\u0637" : "\u0645\u0639\u0637\u0644"}</strong>
                </div>
                <div class="sb-product-summary-card">
                    <span class="label">\u0645\u0648\u0642\u0639 \u0627\u0644\u0632\u0631</span>
                    <strong>${(wa.position || "left") === "left" ? "\u064A\u0633\u0627\u0631" : "\u064A\u0645\u064A\u0646"}</strong>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fab fa-whatsapp" style="color:#22C55E;"></i>
                    <h3>\u0632\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0639\u0627\u0626\u0645 \u0644\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631</h3>
                </div>

                <div class="sb-product-mini-actions">
                    <button type="button" class="sb-product-mini-btn ${wa.enabled ? "active" : ""}" onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'enabled', ${wa.enabled ? false : true})">
                        <i class="fab fa-whatsapp"></i> \u0648\u0627\u062A\u0633\u0627\u0628
                    </button>
                    <button type="button" class="sb-product-mini-btn ${ship.enabled ? "active" : ""}" onclick="window.StudioUI.handleMarketingChange('free_shipping_bar', 'enabled', ${ship.enabled ? false : true})">
                        <i class="fas fa-truck-fast"></i> \u0634\u062D\u0646 \u0645\u062C\u0627\u0646\u064A
                    </button>
                    <button type="button" class="sb-product-mini-btn ${(wa.position || "left") === "right" ? "active" : ""}" onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', '${(wa.position || "left") === "left" ? "right" : "left"}')">
                        <i class="fas fa-location-dot"></i> ${(wa.position || "left") === "left" ? "\u064A\u0645\u064A\u0646" : "\u064A\u0633\u0627\u0631"}
                    </button>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">\u062A\u0641\u0639\u064A\u0644 \u0632\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628 \u0627\u0644\u0639\u0627\u0626\u0645</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${wa.enabled ? "checked" : ""} 
                                       onchange="window.StudioUI.handleMarketingChange('whatsapp_floating', 'enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>

                        <input type="text" class="sb-input" value="${wa.phone || ""}" 
                               placeholder="\u0631\u0642\u0645 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628 \u0645\u0639 \u0627\u0644\u0645\u0641\u062A\u0627\u062D \u0627\u0644\u062F\u0648\u0644\u064A\u060C \u0645\u062B\u0627\u0644: 967777000000"
                               oninput="window.StudioUI.handleMarketingChange('whatsapp_floating', 'phone', this.value)" />

                        <div style="margin-top:10px;">
                            <label class="sb-field-label">\u0645\u0648\u0642\u0639 \u0627\u0644\u0632\u0631 \u0627\u0644\u0639\u0627\u0626\u0645 \u0641\u064A \u0627\u0644\u0634\u0627\u0634\u0629</label>
                            <div class="sb-segmented-control">
                                <button class="sb-seg-btn ${(wa.position || "left") === "left" ? "active" : ""}" 
                                        onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', 'left')">
                                    \u{1F448} \u0623\u0633\u0641\u0644 \u0627\u0644\u064A\u0633\u0627\u0631 (\u0645\u0648\u0635\u0649 \u0628\u0647)
                                </button>
                                <button class="sb-seg-btn ${wa.position === "right" ? "active" : ""}" 
                                        onclick="window.StudioUI.handleMarketingChange('whatsapp_floating', 'position', 'right')">
                                    \u{1F449} \u0623\u0633\u0641\u0644 \u0627\u0644\u064A\u0645\u064A\u0646
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- \u0634\u0631\u064A\u0637 \u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0645\u062C\u0627\u0646\u064A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-truck-fast" style="color:#06B6D4;"></i>
                    <h3>\u0634\u0631\u064A\u0637 \u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0645\u062C\u0627\u0646\u064A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A</h3>
                </div>

                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column: 1 / -1;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <label class="sb-field-label" style="margin-bottom:0;">\u062A\u0641\u0639\u064A\u0644 \u0634\u0631\u064A\u0637 \u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0645\u062C\u0627\u0646\u064A</label>
                            <label class="sb-switch">
                                <input type="checkbox" ${ship.enabled ? "checked" : ""} 
                                       onchange="window.StudioUI.handleMarketingChange('free_shipping_bar', 'enabled', this.checked)" />
                                <span class="sb-slider"></span>
                            </label>
                        </div>

                        <input type="text" class="sb-input" value="${ship.message || "\u{1F69A} \u0634\u062D\u0646 \u0645\u062C\u0627\u0646\u064A \u0644\u0644\u0637\u0644\u0628\u0627\u062A \u0641\u0648\u0642 10,000 \u0631\u064A\u0627\u0644!"}" 
                               placeholder="\u0646\u0635 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0645\u062C\u0627\u0646\u064A"
                               oninput="window.StudioUI.handleMarketingChange('free_shipping_bar', 'message', this.value)" />
                    </div>
                </div>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/JsonTab.ts
var JsonTab = class {
  static render() {
    const jsonText = JSON.stringify(studioState.config, null, 2);
    const promptConfig = {
      store_name: studioState.config.store_name || "\u0645\u062A\u062C\u0631\u064A",
      store_tagline: studioState.config.store_tagline || "\u0645\u062A\u062C\u0631 \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A",
      language: "ar",
      currency: studioState.config.currency || "SAR",
      default_theme_mode: studioState.config.default_theme_mode || "light",
      primary_color: studioState.config.light_theme?.colors?.primary || "#4F46E5",
      accent_color: studioState.config.light_theme?.colors?.accent || "#8B5CF6",
      background_color: studioState.config.light_theme?.colors?.bg_body || "#F8FAFC",
      typography: {
        font_family: studioState.config.typography?.font_family || "Tajawal",
        heading_weight: studioState.config.typography?.heading_weight || "700",
        base_size: studioState.config.typography?.base_size || 16
      },
      navigation: studioState.config.navigation_settings || {},
      marketing: studioState.config.marketing || {},
      messages: studioState.config.messages || studioState.config.store_messages || {},
      modals: studioState.config.modals_customization || {},
      sections: Array.isArray(studioState.config.sections) ? studioState.config.sections : [],
      products_settings: studioState.config.products_settings || {}
    };
    const merchantPrompt = `\u0623\u0646\u062A \u0645\u0635\u0645\u0645 \u0645\u062A\u062C\u0631 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A \u0648\u0645\u062A\u062E\u0635\u0635. \u0627\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u062A\u062E\u0635\u064A\u0635 \u0645\u062A\u062C\u0631 \u0643\u0627\u0645\u0644\u060C \u0648\u0627\u0628\u0642\u0650 \u0627\u0644\u0628\u0646\u064A\u0629 \u0646\u0641\u0633\u0647\u0627\u060C \u0648\u0644\u0627 \u062A\u0643\u062A\u0628 \u0634\u0631\u062D\u0627\u064B \u0625\u0636\u0627\u0641\u064A\u0627\u064B\u060C \u0641\u0642\u0637 \u0623\u0639\u062F \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0645\u062A\u062C\u0631 \u0648\u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0646\u0627\u062A\u062C \u0635\u0627\u0644\u062D JSON:

${JSON.stringify(promptConfig, null, 2)}`;
    return `
        <div class="sb-tab-pane">
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-code" style="color:var(--sb-accent);"></i>
                    <h3>\u0628\u0631\u0648\u0645\u0628\u062A \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0643\u0627\u0645\u0644 + JSON \u0645\u0628\u0627\u0634\u0631</h3>
                </div>

                <div class="sb-fields-grid">
                    <div style="grid-column: 1 / -1;">
                        <div class="sb-json-note">
                            <i class="fas fa-lightbulb"></i>
                            <span>\u064A\u0645\u0643\u0646\u0643 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0623\u0648 \u0645\u0644\u0641 \u0642\u0627\u0644\u0628 \u0645\u0633\u062A\u0642\u0644 \u0635\u0627\u062F\u0631 \u0645\u0646 \u0627\u0644\u0627\u0633\u062A\u062F\u064A\u0648\u060C \u0648\u0633\u064A\u062A\u0645 \u0623\u062E\u0630 config \u0627\u0644\u0645\u0648\u062C\u0648\u062F \u062F\u0627\u062E\u0644\u0647 \u0648\u062A\u0637\u0628\u064A\u0642\u0647 \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0645\u0628\u0627\u0634\u0631\u0629.</span>
                        </div>
                    </div>

                    <div style="grid-column: 1 / -1;">
                        <textarea id="store-merchant-prompt" class="sb-json-editor sb-json-prompt-editor" spellcheck="false">${merchantPrompt}</textarea>
                    </div>

                    <div style="grid-column: 1 / -1; display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                        <button class="sb-btn sb-btn-primary" style="flex:1; min-width:180px;" onclick="window.StudioUI.copyMerchantPromptClipboard()">
                            <i class="fas fa-copy"></i> \u0646\u0633\u062E \u0627\u0644\u0628\u0631\u0648\u0645\u0628\u062A
                        </button>
                        <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.resetMerchantPrompt()">
                            <i class="fas fa-rotate-right"></i> \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u062D\u0645\u064A\u0644
                        </button>
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-file-code" style="color:var(--sb-primary);"></i>
                    <h3>\u0645\u062D\u0631\u0631 \u0643\u0648\u062F JSON \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0645\u062A\u062C\u0631\u0643</h3>
                </div>

                <div class="sb-fields-grid">
                    <div style="grid-column: 1 / -1;">
                        <textarea id="live-json-editor" class="sb-json-editor" spellcheck="false">${jsonText}</textarea>
                    </div>

                    <div style="grid-column: 1 / -1; display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                        <button class="sb-btn sb-btn-primary" style="flex:1; min-width:180px;" onclick="window.StudioUI.handleJsonApplyFromText()">
                            <i class="fas fa-sync-alt"></i> \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0640 JSON
                        </button>
                        <button class="sb-btn sb-btn-ghost" onclick="document.getElementById('json-file-input').click()">
                            <i class="fas fa-file-upload"></i> \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0645\u0644\u0641
                        </button>
                        <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.downloadJson()">
                            <i class="fas fa-file-download"></i> \u062A\u0635\u062F\u064A\u0631
                        </button>
                        <button class="sb-btn sb-btn-ghost" onclick="window.StudioUI.copyJsonClipboard()">
                            <i class="fas fa-copy"></i> \u0646\u0633\u062E JSON
                        </button>
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-box-open" style="color:var(--sb-accent);"></i>
                    <h3>\u062A\u0635\u062F\u064A\u0631 \u0643\u0642\u0627\u0644\u0628 \u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0627\u062C\u0631</h3>
                </div>
                <div class="sb-json-note">
                    <i class="fas fa-circle-info"></i>
                    <span>\u064A\u0646\u0634\u0626 \u0645\u0644\u0641 JSON \u0645\u0633\u062A\u0642\u0644\u064B\u0627 \u0628\u0627\u0633\u0645 \u0627\u0644\u0642\u0627\u0644\u0628 \u0648\u062A\u0635\u0645\u064A\u0645\u0647 \u0627\u0644\u0643\u0627\u0645\u0644. \u0628\u0645\u062C\u0631\u062F \u0648\u0636\u0639\u0647 \u062F\u0627\u062E\u0644 \u0645\u062C\u0644\u062F templates/themes/ \u064A\u0638\u0647\u0631 \u0641\u0648\u0631\u0627\u064B \u0644\u0644\u062A\u0627\u062C\u0631 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0644\u064A\u062E\u062A\u0627\u0631\u0647 \u0648\u064A\u062E\u0635\u0635\u0647 \u0644\u0645\u062A\u062C\u0631\u0647 \u0628\u062F\u0648\u0646 \u0627\u0644\u062D\u0627\u062C\u0629 \u0644\u0623\u064A \u0645\u0644\u0641 manifest.</span>
                </div>
                <div class="sb-fields-grid" style="margin-top:12px;">
                    <label class="sb-field">
                        <span>\u0645\u0639\u0631\u0641 \u0627\u0644\u0642\u0627\u0644\u0628</span>
                        <input id="theme-export-id" value="${studioState.config.theme_name || "custom_theme"}" placeholder="modern_blue">
                    </label>
                    <label class="sb-field">
                        <span>\u0627\u0633\u0645 \u0627\u0644\u0642\u0627\u0644\u0628</span>
                        <input id="theme-export-name" value="\u0642\u0627\u0644\u0628 \u0645\u062A\u062C\u0631 \u062C\u062F\u064A\u062F" placeholder="\u0627\u0633\u0645 \u064A\u0638\u0647\u0631 \u0644\u0644\u062A\u0627\u062C\u0631">
                    </label>
                    <label class="sb-field" style="grid-column:1 / -1;">
                        <span>\u0648\u0635\u0641 \u0627\u0644\u0642\u0627\u0644\u0628</span>
                        <input id="theme-export-description" value="\u062A\u0635\u0645\u064A\u0645 \u062C\u0627\u0647\u0632 \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u062E\u0635\u064A\u0635 \u0644\u0645\u062A\u062C\u0631\u0643." placeholder="\u0648\u0635\u0641 \u0645\u062E\u062A\u0635\u0631">
                    </label>
                </div>
                <button class="sb-btn sb-btn-primary" style="width:100%; margin-top:12px;" onclick="window.StudioUI.downloadThemeTemplate()">
                    <i class="fas fa-file-export"></i> \u062A\u0646\u0632\u064A\u0644 \u0645\u0644\u0641 \u0627\u0644\u0642\u0627\u0644\u0628
                </button>
            </div>
        </div>
        `;
  }
};

// src/studio/components/tabs/NavigationTab.ts
var DEFAULT_BOTTOM_ITEMS = DEFAULT_NAV_ITEMS;
var ICON_OPTIONS = {
  home: ["fa-home", "fa-house", "fa-store", "fa-shop"],
  search: ["fa-search", "fa-magnifying-glass", "fa-binoculars"],
  orders: ["fa-box-open", "fa-box", "fa-clipboard-list", "fa-receipt", "fa-truck"],
  favorites: ["fa-heart", "fa-star", "fa-bookmark", "fa-thumbs-up"],
  cart: ["fa-shopping-cart", "fa-shopping-bag", "fa-basket-shopping", "fa-cart-plus"]
};
var NavigationTab = class {
  static render() {
    const cfg = studioState.config;
    const navSettings = cfg.navigation_settings || {};
    const bottomItems = normalizeBottomNavItems(navSettings.bottom_bar?.items || DEFAULT_BOTTOM_ITEMS);
    const topBar = normalizeTopBarSettings(navSettings.top_bar || DEFAULT_TOP_BAR_SETTINGS);
    const topBarStyle = topBar.navbar_style || navSettings.bottom_bar?.style || "solid";
    const bottomBarStyle = navSettings.bottom_bar?.style || topBarStyle;
    const topBarSize = navSettings.top_bar?.style_settings?.[topBarStyle] || {};
    const bottomBarSize = navSettings.bottom_bar?.style_settings?.[bottomBarStyle] || {};
    const styleOptions = [
      { key: "solid", label: "\u0646\u0638\u064A\u0641", icon: "fa-square" },
      { key: "glass", label: "\u0632\u062C\u0627\u062C\u064A", icon: "fa-layer-group" },
      { key: "floating", label: "\u0639\u0627\u0626\u0645", icon: "fa-wand-magic-sparkles" },
      { key: "neon", label: "\u0646\u064A\u0648\u0646", icon: "fa-bolt" },
      { key: "minimal", label: "\u062E\u0641\u064A\u0641", icon: "fa-minus" },
      { key: "island", label: "\u062C\u0632\u064A\u0631\u0629", icon: "fa-circle-half-stroke" }
    ];
    const renderStyleOptions = (selected, handler) => styleOptions.map((style) => `
            <button class="sb-card-style-btn ${selected === style.key ? "active" : ""}" style="min-height:58px;"
                onclick="window.StudioUI.${handler}('${style.key}')">
                <i class="fas ${style.icon}"></i><span>${style.label}</span>
            </button>`).join("");
    const renderSizeControls = (bar, style, values) => {
      const defaultHeight = bar === "top" ? 58 : 64;
      const defaultRadius = style === "solid" ? 0 : bar === "top" ? 18 : 22;
      const height = values.height ?? defaultHeight;
      const radius = values.radius ?? defaultRadius;
      const border = values.border ?? 1;
      const desktopWidth = values.desktop_width ?? 560;
      const desktopBottom = values.desktop_bottom ?? 22;
      const desktopLayout = values.desktop_layout || "dock";
      const itemRadius = values.item_radius ?? (bar === "top" ? 12 : 999);
      const iconSize = values.icon_size ?? (bar === "top" ? 1.1 : 1.2);
      const itemGap = values.item_gap ?? 8;
      const showLabels = values.show_labels !== false;
      const barColor = values.bar_color || "#6366f1";
      const activeColor = values.active_color || "#ffffff";
      const mobileWidth = values.mobile_width ?? 100;
      const mobileBottom = values.mobile_bottom ?? 0;
      const mobileShape = values.mobile_shape || "classic";
      const mobileShapes = [
        { key: "classic", label: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A" },
        { key: "pill", label: "\u0643\u0628\u0633\u0648\u0644\u0629" },
        { key: "icons", label: "\u0623\u064A\u0642\u0648\u0646\u0627\u062A" },
        { key: "elevated", label: "\u0628\u0637\u0627\u0642\u0627\u062A" },
        { key: "center", label: "\u0645\u0631\u0643\u0632 \u0628\u0627\u0631\u0632" }
      ];
      return `
            <div class="sb-nav-size-controls">
                <div class="sb-nav-size-heading">
                    <strong>\u062D\u062C\u0645 \u0646\u0645\u0637 ${styleOptions.find((option) => option.key === style)?.label || style}</strong>
                    <span>\u064A\u064F\u062D\u0641\u0638 \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0646\u0645\u0637</span>
                </div>
                <div class="sb-nav-mini-preview" data-nav-preview="${bar}-${style}">
                    <div class="sb-nav-mini-preview-label"><i class="fas fa-eye"></i> \u0645\u0639\u0627\u064A\u0646\u0629 \u0633\u0631\u064A\u0639\u0629</div>
                    <div class="sb-nav-mini-canvas">
                        <div class="sb-nav-mini-device">
                            <div class="sb-nav-mini-content"></div>
                            <div class="sb-nav-mini-bar ${style}" style="height:${Math.min(bar === "top" ? height : values.desktop_height ?? height, 82)}px;border-radius:${Math.min(radius, 32)}px;--preview-bar-color:${barColor};--preview-active-color:${activeColor};">
                                ${[1, 2, 3, 4, 5].map((index) => `<span style="width:${Math.max(8, Math.min(24, iconSize * 12))}px;height:${Math.max(8, Math.min(24, iconSize * 12))}px;border-radius:${Math.min(itemRadius, 16)}px;opacity:${index === 3 ? 1 : 0.58};"></span>`).join("")}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sb-nav-style-tools">
                    <button type="button" onclick="window.StudioUI.handleNavCopyStyle('${bar}','${style}')">
                        <i class="fas fa-copy"></i> \u0646\u0633\u062E \u0644\u0643\u0644 \u0627\u0644\u0623\u0634\u0643\u0627\u0644
                    </button>
                    <button type="button" onclick="window.StudioUI.handleNavResetStyle('${bar}','${style}')">
                        <i class="fas fa-rotate-left"></i> \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0647\u0630\u0627 \u0627\u0644\u0634\u0643\u0644
                    </button>
                </div>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u062D\u062C\u0645 <b id="nav-${bar}-height-value">${height}px</b></span>
                    <input type="range" min="${bar === "top" ? 48 : 56}" max="${bar === "top" ? 88 : 96}" step="1"
                        value="${height}"
                        oninput="document.getElementById('nav-${bar}-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','height',this.value)">
                </label>
                <div class="sb-nav-color-row">
                    <label><span>\u0644\u0648\u0646 \u0627\u0644\u0634\u0631\u064A\u0637</span><input type="color" value="${barColor}" onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','bar_color',this.value)"></label>
                    <label><span>\u0644\u0648\u0646 \u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0634\u0637</span><input type="color" value="${activeColor}" onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','active_color',this.value)"></label>
                </div>
                <label class="sb-nav-range">
                    <span>\u0627\u0633\u062A\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0648\u0627\u0641 <b id="nav-${bar}-radius-value">${radius}px</b></span>
                    <input type="range" min="0" max="32" step="1"
                        value="${radius}"
                        oninput="document.getElementById('nav-${bar}-radius-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','radius',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0633\u0645\u0643 \u0627\u0644\u062D\u062F\u0648\u062F <b id="nav-${bar}-border-value">${border}px</b></span>
                    <input type="range" min="0" max="3" step="1"
                        value="${border}"
                        oninput="document.getElementById('nav-${bar}-border-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','border',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0633\u062A\u062F\u0627\u0631\u0629 \u0627\u0644\u0623\u0632\u0631\u0627\u0631 <b id="nav-${bar}-item-radius-value">${itemRadius}px</b></span>
                    <input type="range" min="0" max="999" step="1" value="${itemRadius}"
                        oninput="document.getElementById('nav-${bar}-item-radius-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','item_radius',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u062D\u062C\u0645 \u0627\u0644\u0623\u064A\u0642\u0648\u0646\u0627\u062A <b id="nav-${bar}-icon-size-value">${iconSize}rem</b></span>
                    <input type="range" min="0.8" max="1.8" step="0.1" value="${iconSize}"
                        oninput="document.getElementById('nav-${bar}-icon-size-value').textContent=this.value+'rem'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','icon_size',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0628\u064A\u0646 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 <b id="nav-${bar}-item-gap-value">${itemGap}px</b></span>
                    <input type="range" min="0" max="24" step="1" value="${itemGap}"
                        oninput="document.getElementById('nav-${bar}-item-gap-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','item_gap',this.value)">
                </label>
                <label class="sb-nav-check">
                    <input type="checkbox" ${showLabels ? "checked" : ""} onchange="window.StudioUI.handleNavBarDimensionChange('${bar}','${style}','show_labels',this.checked)">
                    <span>\u0625\u0638\u0647\u0627\u0631 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0639\u0646\u0627\u0635\u0631</span>
                </label>
                ${bar === "bottom" ? `
                <div class="sb-nav-desktop-title"><i class="fas fa-mobile-screen-button"></i> \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641</div>
                <label class="sb-nav-select">
                    <span>\u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u0639\u0635\u0631\u064A \u0644\u0644\u0647\u0627\u062A\u0641</span>
                    <select onchange="window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_shape',this.value)">
                        ${mobileShapes.map((shape) => `<option value="${shape.key}" ${mobileShape === shape.key ? "selected" : ""}>${shape.label}</option>`).join("")}
                    </select>
                </label>
                <div class="sb-nav-presets">
                    <span>\u0642\u0648\u0627\u0644\u0628 \u0633\u0631\u064A\u0639\u0629</span>
                    <div>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','balanced')">\u0645\u062A\u0648\u0627\u0632\u0646</button>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','minimal')">\u062E\u0641\u064A\u0641</button>
                        <button type="button" onclick="window.StudioUI.handleNavMobilePreset('${style}','focus')">\u062A\u0631\u0643\u064A\u0632</button>
                    </div>
                </div>
                <label class="sb-nav-range">
                    <span>\u0639\u0631\u0636 \u0627\u0644\u0634\u0631\u064A\u0637 <b id="nav-bottom-mobile-width-value">${mobileWidth}%</b></span>
                    <input type="range" min="86" max="100" step="1" value="${mobileWidth}"
                        oninput="document.getElementById('nav-bottom-mobile-width-value').textContent=this.value+'%'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_width',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u0627\u0631\u062A\u0641\u0627\u0639 <b id="nav-bottom-mobile-height-value">${values.mobile_height ?? height}px</b></span>
                    <input type="range" min="54" max="94" step="1" value="${values.mobile_height ?? height}"
                        oninput="document.getElementById('nav-bottom-mobile-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_height',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0641\u0644 <b id="nav-bottom-mobile-bottom-value">${mobileBottom}px</b></span>
                    <input type="range" min="0" max="28" step="1" value="${mobileBottom}"
                        oninput="document.getElementById('nav-bottom-mobile-bottom-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','mobile_bottom',this.value)">
                </label>
                <div class="sb-nav-desktop-title"><i class="fas fa-desktop"></i> \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</div>
                <label class="sb-nav-range">
                    <span>\u0639\u0631\u0636 \u0627\u0644\u0634\u0631\u064A\u0637 <b id="nav-bottom-width-value">${desktopWidth}px</b></span>
                    <input type="range" min="320" max="1100" step="10" value="${desktopWidth}"
                        oninput="document.getElementById('nav-bottom-width-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_width',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u0627\u0631\u062A\u0641\u0627\u0639 \u0641\u064A \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 <b id="nav-bottom-desktop-height-value">${values.desktop_height ?? height}px</b></span>
                    <input type="range" min="52" max="100" step="1" value="${values.desktop_height ?? height}"
                        oninput="document.getElementById('nav-bottom-desktop-height-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_height',this.value)">
                </label>
                <label class="sb-nav-range">
                    <span>\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0641\u0644 <b id="nav-bottom-bottom-value">${desktopBottom}px</b></span>
                    <input type="range" min="0" max="80" step="1" value="${desktopBottom}"
                        oninput="document.getElementById('nav-bottom-bottom-value').textContent=this.value+'px'; window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_bottom',this.value)">
                </label>
                <label class="sb-nav-select">
                    <span>\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</span>
                    <select onchange="window.StudioUI.handleNavBarDimensionChange('bottom','${style}','desktop_layout',this.value)">
                        <option value="dock" ${desktopLayout === "dock" ? "selected" : ""}>Dock \u0648\u0633\u0637 \u0627\u0644\u0634\u0627\u0634\u0629</option>
                        <option value="wide" ${desktopLayout === "wide" ? "selected" : ""}>\u0634\u0631\u064A\u0637 \u0639\u0631\u064A\u0636</option>
                        <option value="compact" ${desktopLayout === "compact" ? "selected" : ""}>\u0645\u0636\u063A\u0648\u0637</option>
                    </select>
                </label>` : ""}
                ${bar === "bottom" ? `
                <div class="sb-nav-presets">
                    <span>\u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631</span>
                    <div>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','dock')">Dock \u0623\u0646\u064A\u0642</button>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','wide')">\u0639\u0631\u064A\u0636</button>
                        <button type="button" onclick="window.StudioUI.handleNavDesktopPreset('${style}','compact')">\u0645\u0636\u063A\u0648\u0637</button>
                    </div>
                </div>` : ""}
            </div>`;
    };
    const renderIconSelect = (itemId, currentIcon) => {
      const opts = ICON_OPTIONS[itemId] || ["fa-circle"];
      let html = `<select class="sb-select" style="font-size:0.78rem;padding:5px 8px;width:auto;min-width:110px;" onchange="window.StudioUI.handleNavBottomItemChange('${itemId}','icon',this.value)">`;
      for (const ic of opts) {
        html += `<option value="${ic}"${currentIcon === ic ? " selected" : ""}>${ic.replace("fa-", "")}</option>`;
      }
      html += "</select>";
      return html;
    };
    let itemsHtml = "";
    for (let idx = 0; idx < bottomItems.length; idx++) {
      const item = bottomItems[idx];
      const isFirst = idx === 0;
      const isLast = idx === bottomItems.length - 1;
      itemsHtml += `<div draggable="true" ondragstart="window.StudioUI.handleNavBottomItemDragStart('${item.id}')" ondragover="event.preventDefault()" ondrop="window.StudioUI.handleNavBottomItemDrop('${item.id}')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--sb-card);border:1px solid var(--sb-border);border-radius:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);${!item.visible ? "opacity:0.55;" : ""}">
               <div title="\u0627\u0633\u062D\u0628 \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0639\u0646\u0635\u0631" style="width:38px;height:38px;border-radius:10px;background:var(--sb-primary-gradient);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.95rem;flex-shrink:0;cursor:grab;box-shadow:0 4px 12px var(--sb-primary-glow);"><i class="fas ${item.icon}"></i></div>
                <div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;">
                    <button onclick="window.StudioUI.handleNavBottomItemMove('${item.id}','up')" ${isFirst ? "disabled" : ""} style="background:var(--sb-surface);color:var(--sb-text);border:1px solid var(--sb-border);border-radius:6px;width:28px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;${isFirst ? "opacity:0.3;cursor:not-allowed;" : ""}" title="\u062A\u062D\u0631\u064A\u0643 \u0644\u0623\u0639\u0644\u0649">\u2191</button>
                    <button onclick="window.StudioUI.handleNavBottomItemMove('${item.id}','down')" ${isLast ? "disabled" : ""} style="background:var(--sb-surface);color:var(--sb-text);border:1px solid var(--sb-border);border-radius:6px;width:28px;height:24px;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;${isLast ? "opacity:0.3;cursor:not-allowed;" : ""}" title="\u062A\u062D\u0631\u064A\u0643 \u0644\u0623\u0633\u0641\u0644">\u2193</button>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-size:0.68rem;color:var(--sb-muted);display:inline-flex;align-items:center;gap:4px;letter-spacing:0.02em;">\u22EE\u22EE <span>\u0631\u062A\u0628</span></span>
                        <input type="text" class="sb-input" value="${item.label}" style="font-size:0.82rem;padding:6px 8px;flex:1;min-width:60px;" onchange="window.StudioUI.handleNavBottomItemChange('${item.id}','label',this.value)" placeholder="\u0627\u0644\u0627\u0633\u0645">
                        ${renderIconSelect(item.id, item.icon)}
                    </div>
                </div>
                <label class="sb-toggle" style="flex-shrink:0;">
                    <input type="checkbox" ${item.visible ? "checked" : ""} onchange="window.StudioUI.handleNavBottomItemChange('${item.id}','visible',this.checked)">
                    <span class="sb-toggle-slider"></span>
                </label>
            </div>`;
    }
    const logoIcons = [
      ["fa-store", "\u0645\u062A\u062C\u0631"],
      ["fa-shopping-bag", "\u062D\u0642\u064A\u0628\u0629"],
      ["fa-tag", "\u0628\u0637\u0627\u0642\u0629"],
      ["fa-star", "\u0646\u062C\u0645\u0629"],
      ["fa-gem", "\u062C\u0648\u0647\u0631\u0629"],
      ["fa-fire", "\u0646\u0627\u0631"],
      ["fa-bolt", "\u0628\u0631\u0642"],
      ["fa-crown", "\u062A\u0627\u062C"]
    ];
    let logoIconsHtml = "";
    for (const [ic, lbl] of logoIcons) {
      const isActive = topBar.logo_icon === ic;
      logoIconsHtml += `<button title="${lbl}" onclick="window.StudioUI.handleNavTopBarChange('logo_icon','${ic}')"
                style="width:44px;height:44px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;
                border:2px solid ${isActive ? "var(--sb-primary)" : "var(--sb-border)"};
                background:${isActive ? "rgba(99,102,241,0.18)" : "var(--sb-surface)"};
                font-size:1.1rem;color:${isActive ? "var(--sb-primary)" : "var(--sb-muted)"};"><i class="fas ${ic}"></i></button>`;
    }
    const presetButtons = Object.keys(NAVIGATION_PRESETS).map((key) => `
            <button class="sb-btn-outline" style="font-size:0.75rem;padding:6px 10px;" onclick="window.StudioUI.handleNavPreset('${key}')">
                ${getNavigationPresetLabel(key)}
            </button>`).join("");
    return `<div class="sb-tab-pane">
            <div class="sb-alert-box info">
                <i class="fas fa-bars"></i>
                <div><strong>\u062A\u062D\u0643\u0645 \u0643\u0627\u0645\u0644 \u0628\u0623\u0634\u0631\u0637\u0629 \u0627\u0644\u062A\u0646\u0642\u0644 \u{1F9ED}</strong>
                <span>\u062E\u0635\u0651\u0635 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u0648\u0627\u0644\u0639\u0644\u0648\u064A \u2014 \u0631\u062A\u0651\u0628 \u0648\u0623\u062E\u0641\u0650 \u0648\u0623\u0639\u0650\u062F \u062A\u0633\u0645\u064A\u0629 \u0643\u0644 \u0639\u0646\u0635\u0631 \u0648\u0634\u0627\u0647\u062F \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0641\u0648\u0631\u0627\u064B \u0641\u064A \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062D\u064A\u0629.</span></div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:var(--sb-primary);"></i>
                    <h3>\u0642\u0648\u0627\u0644\u0628 \u0630\u0643\u064A\u0629</h3>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">${presetButtons}</div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-grip-horizontal" style="color:var(--sb-primary);"></i>
                    <h3>\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A</h3>
                </div>
                <p style="font-size:0.82rem;color:var(--sb-muted,#6b7280);margin:0 0 14px;padding:0 4px;">\u0631\u062A\u0651\u0628 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0623\u0648 \u063A\u064A\u0651\u0631 \u0627\u0633\u0645\u0647\u0627 \u0648\u0623\u064A\u0642\u0648\u0646\u062A\u0647\u0627 \u0648\u0638\u0647\u0648\u0631\u0647\u0627. \u0633\u064A\u062A\u0645 \u0627\u0644\u062D\u0641\u0627\u0638 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0644\u0649 \u0639\u0646\u0635\u0631\u064A\u0646 \u0645\u0631\u0626\u064A\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.</p>
                ${itemsHtml}
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="sb-btn-outline" style="flex:1;min-width:140px;margin-top:10px;font-size:0.82rem;" onclick="window.StudioUI.handleNavResetBottomBar()">
                        <i class="fas fa-undo"></i> \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0636\u0628\u0637 \u0644\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A
                    </button>
                    <button class="sb-btn-primary" style="flex:1;min-width:140px;margin-top:10px;font-size:0.82rem;" onclick="window.StudioUI.handleNavSmartProtect()">
                        <i class="fas fa-shield-heart"></i> \u062D\u0645\u0627\u064A\u0629 \u0630\u0643\u064A\u0629
                    </button>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-mobile-screen-button" style="color:var(--sb-primary);"></i>
                    <h3>\u0645\u0638\u0647\u0631 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A</h3>
                </div>
                <p class="sb-settings-hint">\u0627\u062E\u062A\u0631 \u0627\u0644\u0634\u0643\u0644 \u0623\u0648\u0644\u0627\u064B\u060C \u062B\u0645 \u0627\u0636\u0628\u0637 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0648\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u0634\u0643\u0644.</p>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064A</label>
                        <div class="sb-card-style-grid">${renderStyleOptions(bottomBarStyle, "handleNavBottomBarStyleChange")}</div>
                        ${renderSizeControls("bottom", bottomBarStyle, bottomBarSize)}
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-bars" style="color:var(--sb-primary);"></i>
                    <h3>\u0645\u0638\u0647\u0631 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A</h3>
                </div>
                <p class="sb-settings-hint">\u0647\u0630\u0647 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u062A\u062E\u0635 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A \u0641\u0642\u0637\u060C \u0648\u064A\u0645\u0643\u0646 \u062D\u0641\u0638\u0647\u0627 \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644 \u0644\u0643\u0644 \u0634\u0643\u0644.</p>
                <div class="sb-fields-grid">
                    <div class="sb-field-card">
                        <label class="sb-field-label">\u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064A</label>
                        <div class="sb-card-style-grid">${renderStyleOptions(topBarStyle, "handleNavTopBarStyleChange")}</div>
                        ${renderSizeControls("top", topBarStyle, topBarSize)}
                    </div>
                </div>
            </div>

            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-sliders" style="color:var(--sb-primary);"></i>
                    <h3>\u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A</h3>
                </div>
                <div class="sb-fields-grid">
                    <div class="sb-field-card" style="grid-column:1/-1;">
                        <label class="sb-field-label">\u0623\u064A\u0642\u0648\u0646\u0629 \u0627\u0644\u0634\u0639\u0627\u0631 / \u0627\u0644\u0644\u0648\u062C\u0648</label>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;">${logoIconsHtml}</div>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0634\u0639\u0627\u0631 \u{1F3EC}</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">\u0625\u062E\u0641\u0627\u0621/\u0625\u0638\u0647\u0627\u0631 \u0623\u064A\u0642\u0648\u0646\u0629 \u0627\u0644\u0634\u0639\u0627\u0631 \u0641\u064A \u0627\u0644\u0647\u064A\u062F\u0631</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_logo_icon !== false ? "checked" : ""} onchange="window.StudioUI.handleNavTopBarChange('show_logo_icon',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">\u0632\u0631 \u0627\u0644\u0628\u062D\u062B \u{1F50E}</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0632\u0631 \u0627\u0644\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0647\u064A\u062F\u0631</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_search_btn !== false ? "checked" : ""} onchange="window.StudioUI.handleNavTopBarChange('show_search_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">\u0632\u0631 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A \u{1F319}</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0632\u0631 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u0641\u064A \u0627\u0644\u0647\u064A\u062F\u0631</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_dark_mode_btn !== false ? "checked" : ""} onchange="window.StudioUI.handleNavTopBarChange('show_dark_mode_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="sb-field-card" style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <label class="sb-field-label" style="margin:0;">\u0632\u0631 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0634\u062E\u0635\u064A \u{1F464}</label>
                            <p style="font-size:0.75rem;color:var(--sb-muted,#6b7280);margin:3px 0 0;">\u0625\u0638\u0647\u0627\u0631/\u0625\u062E\u0641\u0627\u0621 \u0632\u0631 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A \u0641\u064A \u0627\u0644\u0647\u064A\u062F\u0631</p>
                        </div>
                        <label class="sb-toggle">
                            <input type="checkbox" ${topBar.show_profile_btn !== false ? "checked" : ""} onchange="window.StudioUI.handleNavTopBarChange('show_profile_btn',this.checked)">
                            <span class="sb-toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>`;
  }
};

// src/studio/components/Sidebar.ts
var Sidebar = class _Sidebar {
  static TAB_ITEMS = [
    { key: "identity", label: "\u0627\u0644\u0647\u0648\u064A\u0629", icon: "fa-store", color: "#6366F1", group: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u062A\u0631\u0648\u064A\u062C" },
    { key: "ai_palette", label: "20 \u062B\u064A\u0645", icon: "fa-palette", color: "#A78BFA", group: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0628\u0627\u0642\u0629 \u0627\u0644\u062B\u064A\u0645\u0627\u062A \u0627\u0644\u0645\u062A\u0646\u0627\u0633\u0642\u0629" },
    { key: "light_colors", label: "\u0627\u0644\u0641\u0627\u062A\u062D", icon: "fa-sun", color: "#F59E0B", group: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0623\u0644\u0648\u0627\u0646 \u0648\u0645\u0638\u0647\u0631 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0646\u0647\u0627\u0631\u064A" },
    { key: "dark_colors", label: "\u0627\u0644\u062F\u0627\u0643\u0646", icon: "fa-moon", color: "#818CF8", group: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0623\u0644\u0648\u0627\u0646 \u0648\u0645\u0638\u0647\u0631 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A" },
    { key: "products_layout", label: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", icon: "fa-boxes-stacked", color: "#10B981", group: "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0623\u0639\u0645\u062F\u0629 \u0648\u0633\u0644\u0627\u064A\u062F\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
    { key: "sections", label: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645", icon: "fa-layer-group", color: "#06B6D4", group: "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u062A\u0631\u062A\u064A\u0628 \u0648\u0638\u0647\u0648\u0631 \u0627\u0644\u0623\u0642\u0633\u0627\u0645" },
    { key: "navigation", label: "\u0627\u0644\u0623\u0634\u0631\u0637\u0629", icon: "fa-bars", color: "#0EA5E9", group: "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0623\u0634\u0631\u0637\u0629 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0639\u0644\u0648\u064A\u0629 \u0648\u0627\u0644\u0633\u0641\u0644\u064A\u0629" },
    { key: "typography", label: "\u0627\u0644\u062E\u0637\u0648\u0637", icon: "fa-font", color: "#14B8A6", group: "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u062A\u062C\u0631", kicker: "\u0627\u0644\u062E\u0637\u0648\u0637 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0623\u062D\u062C\u0627\u0645 \u0627\u0644\u0646\u0635\u0648\u0635" },
    { key: "messages", label: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644", icon: "fa-comments", color: "#EC4899", group: "\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", kicker: "\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A" },
    { key: "modals", label: "\u0627\u0644\u0646\u0648\u0627\u0641\u0630", icon: "fa-window-restore", color: "#F43F5E", group: "\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", kicker: "\u0634\u064A\u062A \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0648\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A" },
    { key: "marketing", label: "\u062A\u0633\u0648\u064A\u0642", icon: "fa-bullhorn", color: "#EF4444", group: "\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", kicker: "\u0648\u0627\u062A\u0633\u0627\u0628 \u0639\u0627\u0626\u0645 \u0648\u0634\u0631\u064A\u0637 \u0627\u0644\u0634\u062D\u0646" },
    { key: "json", label: "JSON", icon: "fa-code", color: "#94A3B8", group: "\u0645\u062A\u0642\u062F\u0645", kicker: "\u0645\u062D\u0631\u0631 \u0627\u0644\u0628\u0631\u0648\u0645\u0628\u062A \u0648\u0645\u0644\u0641 JSON" }
  ];
  static TAB_GROUPS = [
    {
      title: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631",
      tabs: ["identity", "ai_palette", "light_colors", "dark_colors"]
    },
    {
      title: "\u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u0645\u062A\u062C\u0631",
      tabs: ["products_layout", "sections", "navigation", "typography"]
    },
    {
      title: "\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645",
      tabs: ["messages", "modals", "marketing"]
    },
    {
      title: "\u0645\u062A\u0642\u062F\u0645",
      tabs: ["json"]
    }
  ];
  static getTabInfo(tabKey) {
    return _Sidebar.TAB_ITEMS.find((item) => item.key === tabKey) || _Sidebar.TAB_ITEMS[0];
  }
  static renderTabContent(tabKey = studioState.activeTab) {
    switch (tabKey) {
      case "identity":
        return IdentityTab.render();
      case "products_layout":
        return ProductsTab.render();
      case "messages":
        return MessagesTab.render();
      case "sections":
        return SectionsTab.render();
      case "modals":
        return ModalsTab.render();
      case "light_colors":
        return ColorsTab.render("light");
      case "dark_colors":
        return ColorsTab.render("dark");
      case "ai_palette":
        return AIPaletteTab.render();
      case "typography":
        return TypographyTab.render();
      case "navigation":
        return NavigationTab.render();
      case "marketing":
        return MarketingTab.render();
      case "json":
        return JsonTab.render();
      default:
        return IdentityTab.render();
    }
  }
  static render() {
    const { activeTab } = studioState;
    const currentTab = _Sidebar.getTabInfo(activeTab);
    const tabContentHtml = _Sidebar.renderTabContent(activeTab);
    return `
        <aside class="sb-sidebar-pane">
            <!-- 1. \u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0639\u0645\u0648\u062F\u064A \u0627\u0644\u0643\u0644\u0627\u0633\u064A\u0643\u064A (\u064A\u0638\u0647\u0631 \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0634\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629) -->
            <nav class="sb-nav-rail" id="sb-tabs-rail" aria-label="\u062A\u0628\u0648\u064A\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0635\u064A\u0635">
                ${_Sidebar.TAB_GROUPS.map((group) => `
                    <div class="sb-rail-group">
                        <span class="sb-rail-group-title">${group.title}</span>
                        ${group.tabs.map((tabKey) => {
      const tab = _Sidebar.getTabInfo(tabKey);
      return `
                                <button class="sb-rail-btn ${activeTab === tab.key ? "active" : ""}" 
                                        data-tab="${tab.key}"
                                        onclick="window.StudioUI.setActiveTab('${tab.key}')" 
                                        title="${tab.label}">
                                    <div class="sb-rail-icon" style="color: ${tab.color};">
                                        <i class="fas ${tab.icon}"></i>
                                    </div>
                                    <span class="sb-rail-label">${tab.label}</span>
                                </button>
                            `;
    }).join("")}
                    </div>
                `).join("")}
            </nav>

            <!-- 2. \u062C\u0633\u0645 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A -->
            <div class="sb-sidebar-main">
                <!-- \u0631\u0623\u0633 \u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062B\u0627\u0628\u062A (\u0644\u0627 \u064A\u062E\u062A\u0641\u064A \u0639\u0646\u062F \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062A\u0628\u0648\u064A\u0628\u0627\u062A) -->
                <div class="sb-sidebar-header">
                    <div>
                        <span class="sb-sidebar-kicker" id="sb-active-kicker">${currentTab.kicker}</span>
                        <div class="sb-sidebar-title-row">
                            <h2 id="sb-active-title">${currentTab.label}</h2>
                            <span class="sb-setting-count">${_Sidebar.TAB_ITEMS.length} \u0625\u0639\u062F\u0627\u062F\u0627\u062A</span>
                        </div>
                    </div>
                    <button class="sb-mini-btn" onclick="window.StudioUI.openHelpModal()" title="\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648">
                        <i class="fas fa-lightbulb" style="color:#FBBF24;"></i>
                    </button>
                </div>

                <!-- \u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0628\u0648\u064A\u0628\u0627\u062A \u0627\u0644\u0623\u0641\u0642\u064A \u0644\u0644\u0647\u0648\u0627\u062A\u0641 \u0648\u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0644\u0648\u062D\u064A\u0629 (\u064A\u0638\u0647\u0631 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0634\u0627\u062A <900px) -->
                <nav class="sb-mobile-tabs-bar" id="sb-mobile-tabs-bar" aria-label="\u062A\u0628\u0648\u064A\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644">
                    ${_Sidebar.TAB_ITEMS.map((tab) => `
                        <button class="sb-mobile-tab-pill ${activeTab === tab.key ? "active" : ""}" 
                                data-tab="${tab.key}"
                                onclick="window.StudioUI.setActiveTab('${tab.key}')">
                            <i class="fas ${tab.icon}" style="color: ${tab.color};"></i>
                            <span>${tab.label}</span>
                        </button>
                    `).join("")}
                </nav>

                <!-- \u0645\u0646\u0637\u0642\u0629 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u062A\u0628\u0648\u064A\u0628 \u0627\u0644\u0646\u0634\u0637 (\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0627\u0646\u0633\u064A\u0627\u0628\u064A) -->
                <div class="sb-tab-content-wrapper" id="sb-tab-content-area">
                    ${tabContentHtml}
                </div>
            </div>
        </aside>
        `;
  }
};

// src/studio/components/Preview.ts
var Preview = class {
  static render() {
    const { currentDevice } = studioState;
    const deviceClass = `preview-frame-${currentDevice}`;
    return `
        <section class="sb-preview-pane">
            <div class="sb-preview-device-switcher ${currentDevice === "desktop" ? "is-desktop" : ""}" id="preview-device-switcher" aria-label="\u0627\u062E\u062A\u064A\u0627\u0631 \u062D\u062C\u0645 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629">
                <button class="sb-device-btn ${currentDevice === "mobile" ? "active" : ""}" data-device="mobile" onclick="window.StudioUI.setDevice('mobile')" title="\u062C\u0648\u0627\u0644">
                    <i class="fas fa-mobile-alt"></i>
                    <span>\u062C\u0648\u0627\u0644</span>
                </button>
                <button class="sb-device-btn ${currentDevice === "tablet" ? "active" : ""}" data-device="tablet" onclick="window.StudioUI.setDevice('tablet')" title="\u062A\u0627\u0628\u0644\u062A">
                    <i class="fas fa-tablet-alt"></i>
                    <span>\u062A\u0627\u0628\u0644\u062A</span>
                </button>
                <button class="sb-device-btn ${currentDevice === "desktop" ? "active" : ""}" data-device="desktop" onclick="window.StudioUI.setDevice('desktop')" title="\u0643\u0645\u0628\u064A\u0648\u062A\u0631">
                    <i class="fas fa-desktop"></i>
                    <span>\u0643\u0645\u0628\u064A\u0648\u062A\u0631</span>
                </button>
            </div>
            <div class="sb-preview-wrapper ${deviceClass}" id="preview-wrapper">
                <div class="sb-device-header ${currentDevice === "desktop" ? "hidden" : ""}" id="preview-device-header">
                    <div class="sb-device-speaker"></div>
                    <div class="sb-device-camera"></div>
                </div>
                <iframe id="store-preview-frame" class="sb-preview-iframe" src="index.html?store=${encodeURIComponent(studioState.merchantUsername || "store")}&preview=studio" title="\u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0644\u0645\u062A\u062C\u0631"></iframe>
            </div>
        </section>
        `;
  }
};

// src/studio/components/Toast.ts
var Toast = class _Toast {
  static timeoutId = null;
  static show(message, type = "success") {
    let toastEl = document.getElementById("builder-toast");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "builder-toast";
      toastEl.className = "builder-toast";
      document.body.appendChild(toastEl);
    }
    const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-triangle" : "fa-info-circle";
    toastEl.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
    toastEl.className = `builder-toast show ${type}`;
    if (_Toast.timeoutId) clearTimeout(_Toast.timeoutId);
    _Toast.timeoutId = setTimeout(() => {
      if (toastEl) toastEl.classList.remove("show");
    }, 3200);
  }
};

// src/studio/components/HelpModal.ts
var HelpModal = class {
  static render() {
    return `
        <div id="guide-modal" class="guide-modal-overlay" onclick="if(event.target === this) window.StudioUI.closeHelpModal()">
            <div class="guide-modal-card">
                <div class="guide-modal-header">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="guide-icon-box">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <div>
                            <h3 style="font-size:1.15rem; font-weight:900; color:var(--sb-text);">\u062F\u0644\u064A\u0644 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u0635\u0645\u0645 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \u{1F680}</h3>
                            <p style="font-size:0.8rem; color:var(--sb-muted);">\u062E\u0637\u0648\u0627\u062A \u0648\u0625\u0631\u0634\u0627\u062F\u0627\u062A \u0633\u0631\u064A\u0639\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u062E\u0635\u064A\u0635 \u0648\u0627\u062C\u0647\u0629 \u0645\u062A\u062C\u0631\u0643 \u0628\u0623\u0639\u0644\u0649 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0648\u0633\u0631\u0639\u0629</p>
                        </div>
                    </div>
                    <button class="guide-close-btn" onclick="window.StudioUI.closeHelpModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="guide-steps-list">
                    <div class="guide-step-card">
                        <div class="guide-step-num">1</div>
                        <div>
                            <strong class="guide-step-title">\u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A</strong>
                            <p class="guide-step-desc">
                                \u0641\u064A \u062A\u0628\u0648\u064A\u0628 <strong>\u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u062A\u062C\u0631</strong>: \u062D\u062F\u062F \u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0631\u0633\u0645\u064A\u060C \u0627\u0644\u0634\u0639\u0627\u0631 \u0627\u0644\u062A\u0633\u0648\u064A\u0642\u064A\u060C \u0648\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A \u0627\u0644\u0630\u064A \u064A\u0638\u0647\u0631 \u0644\u0644\u0632\u0648\u0627\u0631 \u0641\u064A \u0642\u0645\u0629 \u0627\u0644\u0645\u062A\u062C\u0631.
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">2</div>
                        <div>
                            <strong class="guide-step-title">\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0639\u0631\u0636 \u0644\u0644\u062C\u0648\u0627\u0644 \u0648\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u0628\u0634\u0643\u0644 \u0645\u0633\u062A\u0642\u0644</strong>
                            <p class="guide-step-desc">
                                \u0641\u064A \u062A\u0628\u0648\u064A\u0628 <strong>\u0637\u0631\u064A\u0642\u0629 \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A</strong>: \u064A\u0645\u0643\u0646\u0643 \u062A\u062E\u0635\u064A\u0635 \u0639\u062F\u062F \u0627\u0644\u0623\u0639\u0645\u062F\u0629 \u0648\u0627\u0644\u0635\u0641\u0648\u0641 \u0648\u0634\u0643\u0644 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631 \u0644\u0644\u062C\u0648\u0627\u0644 (\u{1F4F1} \u0639\u0645\u0648\u062F\u064A\u0646 \u0628\u0627\u0644\u0644\u0645\u0633) \u0648\u0644\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 (\u{1F4BB} 3-4 \u0623\u0639\u0645\u062F\u0629) \u0628\u0634\u0643\u0644 \u0645\u0646\u0641\u0635\u0644 \u0648\u062A\u0644\u0642\u0627\u0626\u064A!
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">3</div>
                        <div>
                            <strong class="guide-step-title">\u062A\u062E\u0635\u064A\u0635 \u0643\u0644 \u0642\u0633\u0645 \u0639\u0644\u0649 \u062D\u062F\u0629 (Per-Category)</strong>
                            <p class="guide-step-desc">
                                \u064A\u0645\u0643\u0646\u0643 \u0645\u0646\u062D \u0623\u064A \u0642\u0633\u0645 \u0645\u0646 \u0623\u0642\u0633\u0627\u0645\u0643 (\u0645\u062B\u0644\u0627\u064B \u0627\u0644\u0639\u0637\u0648\u0631 \u0623\u0648 \u0627\u0644\u0645\u0644\u0627\u0628\u0633) \u0645\u0638\u0647\u0631\u0627\u064B \u0641\u0631\u064A\u062F\u0627\u064B \u0648\u0645\u0633\u062A\u0642\u0644\u0627\u064B (\u0643\u0633\u0644\u0627\u064A\u062F\u0631 \u0645\u062A\u0637\u0648\u0631 \u0623\u0648 \u0634\u0628\u0643\u0629 \u0639\u0645\u0648\u062F\u064A\u0629) \u062F\u0648\u0646 \u0627\u0644\u062A\u0623\u062B\u064A\u0631 \u0639\u0644\u0649 \u0628\u0627\u0642\u064A \u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u062A\u062C\u0631.
                            </p>
                        </div>
                    </div>

                    <div class="guide-step-card">
                        <div class="guide-step-num">4</div>
                        <div>
                            <strong class="guide-step-title">\u0627\u0644\u0623\u0644\u0648\u0627\u0646\u060C \u0627\u0644\u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u062C\u0627\u0647\u0632\u0629 \u0648\u0627\u0644\u0646\u0634\u0631 \u0627\u0644\u0633\u062D\u0627\u0628\u064A</strong>
                            <p class="guide-step-desc">
                                \u0627\u062E\u062A\u0631 \u0642\u0627\u0644\u0628\u0627\u064B \u062C\u0627\u0647\u0632\u0627\u064B \u0628\u0636\u063A\u0637\u0629 \u0632\u0631 \u0623\u0648 \u0648\u0644\u0651\u062F \u0623\u0644\u0648\u0627\u0646\u0627\u064B \u0630\u0643\u064A\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A\u060C \u062B\u0645 \u0627\u0636\u063A\u0637 <strong>\u0646\u0634\u0631 \u{1F680}</strong> \u0644\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0648\u062A\u0637\u0628\u064A\u0642\u0647\u0627 \u0641\u0648\u0631\u0627\u064B \u0639\u0644\u0649 \u0645\u062A\u062C\u0631\u0643 \u0644\u0644\u0639\u0645\u0644\u0627\u0621.
                            </p>
                        </div>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.StudioUI.closeHelpModal()">
                        \u0641\u0647\u0645\u062A\u060C \u0644\u0646\u0628\u062F\u0623 \u0627\u0644\u062A\u062E\u0635\u064A\u0635! \u2728
                    </button>
                </div>
            </div>
        </div>
        `;
  }
  static open() {
    const modal = document.getElementById("guide-modal");
    if (modal) modal.classList.add("show");
  }
  static close() {
    const modal = document.getElementById("guide-modal");
    if (modal) modal.classList.remove("show");
  }
};

// src/studio/utils/colorUtils.ts
function normalizeHexColor(hex, fallback = "#4F46E5") {
  if (typeof hex !== "string") return fallback;
  let value = hex.trim();
  if (!value) return fallback;
  const namedColors = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    grey: "#808080",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#10B981",
    yellow: "#F59E0B",
    orange: "#F97316",
    purple: "#8B5CF6",
    pink: "#EC4899",
    brown: "#92400E",
    navy: "#1E3A8A",
    maroon: "#991B1B",
    teal: "#14B8A6",
    olive: "#65A30D",
    silver: "#E2E8F0",
    cyan: "#06B6D4",
    magenta: "#D946EF",
    indigo: "#4F46E5",
    rose: "#F43F5E",
    amber: "#D97706",
    emerald: "#059669",
    violet: "#7C3AED"
  };
  const lower = value.toLowerCase();
  if (namedColors[lower]) return namedColors[lower].toUpperCase();
  const rgbMatch = value.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10)));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
  }
  const hslMatch = value.match(/hsla?\s*\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%/i);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    return hslToHex(h, s, l);
  }
  if (value[0] !== "#") value = "#" + value;
  if (value.length === 4 && /^#[0-9A-Fa-f]{3}$/.test(value)) {
    value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  if (value.length === 9 && /^#[0-9A-Fa-f]{8}$/.test(value)) {
    value = value.slice(0, 7);
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value.toUpperCase();
  return fallback;
}
function hexToHSL(hex) {
  const normalized = normalizeHexColor(hex, "#4F46E5");
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToHex(h, s, l) {
  const hue = (h % 360 + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const light = Math.max(0, Math.min(100, l)) / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) => {
    const k = (n + hue / 30) % 12;
    const c = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function generateAccent(hex) {
  const safeHex = normalizeHexColor(hex, "#4F46E5");
  const { h, s, l } = hexToHSL(safeHex);
  if (s <= 12) {
    const accentHue = l > 60 ? 220 : 200;
    const accentSat = l > 60 ? 26 : 32;
    const accentLight = l > 60 ? 62 : 52;
    return hslToHex(accentHue, accentSat, accentLight);
  }
  return hslToHex((h + 150) % 360, Math.max(65, s), 50);
}
function contrastText(hex) {
  const safeHex = normalizeHexColor(hex, "#4F46E5");
  const r = parseInt(safeHex.slice(1, 3), 16);
  const g = parseInt(safeHex.slice(3, 5), 16);
  const b = parseInt(safeHex.slice(5, 7), 16);
  const yiq = 0.299 * r + 0.587 * g + 0.114 * b;
  return yiq > 152 ? "#0F172A" : "#FFFFFF";
}
function buildLightPaletteFromSeeds(seeds = {}) {
  const primarySeed = normalizeHexColor(seeds.primary, "#4F46E5");
  const { h: pH, s: pS, l: pL } = hexToHSL(primarySeed);
  const primaryFinal = pL > 85 ? hslToHex(pH, Math.max(60, pS), 55) : pL < 20 ? hslToHex(pH, pS, 35) : primarySeed;
  const primaryContrast = contrastText(primaryFinal);
  const accentFinal = seeds.accent ? normalizeHexColor(seeds.accent) : generateAccent(primarySeed);
  const hoverColor = hslToHex(pH, Math.min(100, pS + 6), Math.max(20, pL - 10));
  let bgBody;
  let bgCard;
  let bgSurface;
  let border;
  if (seeds.bg && seeds.bg.trim()) {
    const rawBg = normalizeHexColor(seeds.bg);
    const { h: bgH, s: bgS, l: bgL } = hexToHSL(rawBg);
    const safeBgL = bgL < 75 ? 97 : bgL;
    bgBody = hslToHex(bgH, Math.min(25, bgS), safeBgL);
    bgCard = "#FFFFFF";
    bgSurface = hslToHex(bgH, Math.min(20, bgS), Math.max(90, safeBgL - 3));
    border = hslToHex(bgH, Math.min(30, bgS + 5), Math.max(82, safeBgL - 9));
  } else {
    const neutralHue = pS <= 12 ? 215 : pH;
    bgBody = hslToHex(neutralHue, 12, 98);
    bgCard = "#FFFFFF";
    bgSurface = hslToHex(neutralHue, 14, 95);
    border = hslToHex(neutralHue, 18, 90);
  }
  let textMain;
  let textMuted;
  if (seeds.text && seeds.text.trim()) {
    const rawText = normalizeHexColor(seeds.text);
    const { h: tH, s: tS, l: tL } = hexToHSL(rawText);
    const safeTextL = tL > 45 ? 12 : tL;
    textMain = hslToHex(tH, Math.min(35, tS), safeTextL);
    textMuted = hslToHex(tH, Math.max(0, tS - 10), Math.min(60, safeTextL + 30));
  } else {
    textMain = "#0F172A";
    textMuted = "#64748B";
  }
  return {
    primary: primaryFinal,
    primary_hover: hoverColor,
    primary_gradient_start: primaryFinal,
    primary_gradient_end: accentFinal,
    accent: accentFinal,
    bg_body: bgBody,
    bg_card: bgCard,
    bg_surface: bgSurface,
    text_main: textMain,
    text_muted: textMuted,
    border,
    navbar_bg: bgCard,
    navbar_text: textMain,
    bottom_bar_bg: bgCard,
    bottom_bar_active: primaryFinal,
    bottom_bar_inactive: "#94A3B8",
    card_bg: bgCard,
    card_border: border,
    card_title: textMain,
    price_color: primaryFinal,
    old_price_color: "#94A3B8",
    badge_bg: "#EF4444",
    badge_text: "#FFFFFF",
    section_title: textMain,
    category_chip_bg: bgSurface,
    category_chip_active: primaryFinal,
    category_chip_text: textMain,
    modal_bg: bgCard,
    modal_overlay: "rgba(15, 23, 42, 0.55)",
    modal_handle: "#CBD5E1",
    btn_primary_bg: primaryFinal,
    btn_primary_text: primaryContrast,
    chatbot_btn_bg: primaryFinal,
    toast_bg: textMain,
    toast_text: "#FFFFFF"
  };
}
function buildDarkPaletteFromSeeds(seeds = {}) {
  const primarySeed = normalizeHexColor(seeds.primary, "#6366F1");
  const { h: pH, s: pS, l: pL } = hexToHSL(primarySeed);
  const darkL = pL < 45 ? Math.min(pL + 22, 68) : Math.min(pL + 6, 75);
  const darkPrimary = hslToHex(pH, pS <= 12 ? Math.max(pS, 20) : Math.min(pS + 10, 92), darkL);
  const darkAccent = seeds.accent ? normalizeHexColor(seeds.accent) : generateAccent(primarySeed);
  const btnText = contrastText(darkPrimary);
  const hoverColor = hslToHex(pH, Math.min(92, pS + 6), Math.min(darkL + 8, 82));
  let bgBody;
  let bgCard;
  let bgSurface;
  let border;
  let navBg;
  if (seeds.bg && seeds.bg.trim()) {
    const rawBg = normalizeHexColor(seeds.bg);
    const { h: bgH, s: bgS, l: bgL } = hexToHSL(rawBg);
    const safeBgL = bgL > 30 ? 7 : Math.max(4, bgL);
    bgBody = hslToHex(bgH, Math.min(40, Math.max(12, bgS)), safeBgL);
    bgCard = hslToHex(bgH, Math.min(36, bgS + 2), safeBgL + 6);
    bgSurface = hslToHex(bgH, Math.min(34, bgS + 4), safeBgL + 11);
    navBg = hslToHex(bgH, Math.min(36, bgS + 2), safeBgL + 5);
    border = hslToHex(bgH, Math.min(30, bgS + 5), safeBgL + 14);
  } else {
    const neutralHue = pS <= 12 ? 220 : pH;
    bgBody = hslToHex(neutralHue, 28, 6);
    bgCard = hslToHex(neutralHue, 26, 11);
    bgSurface = hslToHex(neutralHue, 24, 15);
    navBg = hslToHex(neutralHue, 26, 10);
    border = hslToHex(neutralHue, 20, 20);
  }
  let textMain;
  let textMuted;
  if (seeds.text && seeds.text.trim()) {
    const rawText = normalizeHexColor(seeds.text);
    const { h: tH, s: tS, l: tL } = hexToHSL(rawText);
    const safeTextL = tL < 65 ? 96 : tL;
    textMain = hslToHex(tH, Math.min(25, tS), safeTextL);
    textMuted = hslToHex(tH, Math.max(0, tS - 10), Math.max(50, safeTextL - 32));
  } else {
    textMain = "#F8FAFC";
    textMuted = "#94A3B8";
  }
  return {
    primary: darkPrimary,
    primary_hover: hoverColor,
    primary_gradient_start: darkPrimary,
    primary_gradient_end: darkAccent,
    accent: darkAccent,
    bg_body: bgBody,
    bg_card: bgCard,
    bg_surface: bgSurface,
    text_main: textMain,
    text_muted: textMuted,
    border,
    navbar_bg: navBg,
    navbar_text: textMain,
    bottom_bar_bg: navBg,
    bottom_bar_active: darkPrimary,
    bottom_bar_inactive: "#64748B",
    card_bg: bgCard,
    card_border: border,
    card_title: textMain,
    price_color: hoverColor,
    old_price_color: "#64748B",
    badge_bg: "#EF4444",
    badge_text: "#FFFFFF",
    section_title: textMain,
    category_chip_bg: bgSurface,
    category_chip_active: darkPrimary,
    category_chip_text: textMain,
    modal_bg: bgCard,
    modal_overlay: "rgba(0, 0, 0, 0.85)",
    modal_handle: "#475569",
    btn_primary_bg: darkPrimary,
    btn_primary_text: btnText,
    chatbot_btn_bg: darkPrimary,
    toast_bg: bgSurface,
    toast_text: textMain
  };
}

// src/studio/styleLibrary.ts
var STORE_STYLE_LIBRARY = {
  "modern-soft": {
    id: "modern-soft",
    name: "Modern Soft",
    label: "\u062D\u062F\u064A\u062B \u0646\u0627\u0639\u0645",
    description: "\u0645\u0638\u0647\u0631 \u0623\u0646\u064A\u0642 \u0644\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u062D\u062F\u064A\u062B \u0645\u0639 \u062D\u0648\u0627\u0641 \u062F\u0642\u064A\u0642\u0629 \u0648\u0623\u0632\u0631\u0627\u0631 \u0645\u0631\u064A\u062D\u0629.",
    accent: "#6366F1",
    cardRadius: "18px",
    buttonStyle: "pill",
    buttonRadius: "9999px",
    animation: "lift",
    displayMode: "by_categories_sections",
    cardStyle: "classic",
    cardOrientation: "portrait",
    navbarStyle: "glass",
    spacing: "normal",
    botPersona: "classic",
    botButtonStyle: "pill",
    botAvatarStyle: "pulse"
  },
  glass: {
    id: "glass",
    name: "Glass",
    label: "\u0632\u062C\u0627\u062C\u064A",
    description: "\u0634\u0628\u0647 \u0634\u0641\u0627\u0641 \u0645\u0639 \u0637\u0628\u0642\u0627\u062A \u0632\u062C\u0627\u062C\u064A\u0629\u060C \u0645\u0645\u062A\u0627\u0632 \u0644\u0644\u062A\u0635\u0627\u0645\u064A\u0645 \u0627\u0644\u0641\u0627\u062E\u0631\u0629.",
    accent: "#8B5CF6",
    cardRadius: "24px",
    buttonStyle: "rounded",
    buttonRadius: "16px",
    animation: "glow",
    displayMode: "featured_first",
    cardStyle: "glass",
    cardOrientation: "landscape",
    navbarStyle: "glass",
    spacing: "relaxed",
    botPersona: "premium",
    botButtonStyle: "bubble",
    botAvatarStyle: "halo"
  },
  luxury: {
    id: "luxury",
    name: "Luxury",
    label: "\u0641\u0627\u062E\u0631",
    description: "\u0623\u0644\u0648\u0627\u0646 \u0623\u0646\u064A\u0642\u0629\u060C \u0641\u0648\u0627\u0635\u0644 \u0648\u0627\u0633\u0639\u0629\u060C \u0648\u0632\u0627\u0648\u064A\u0629 \u0645\u0645\u064A\u0632\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u0631\u0627\u0642\u064A\u0629.",
    accent: "#B45309",
    cardRadius: "26px",
    buttonStyle: "pill",
    buttonRadius: "9999px",
    animation: "scale",
    displayMode: "featured_first",
    cardStyle: "magazine",
    cardOrientation: "landscape",
    navbarStyle: "floating",
    spacing: "relaxed",
    botPersona: "luxury",
    botButtonStyle: "bubble",
    botAvatarStyle: "halo"
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    label: "\u0628\u0633\u064A\u0637",
    description: "\u0623\u0642\u0644 \u062A\u0641\u0627\u0635\u064A\u0644 \u0648\u0623\u0643\u062B\u0631 \u0648\u0636\u0648\u062D\u060C \u0645\u062B\u0627\u0644\u064A \u0644\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0639\u0635\u0631\u064A\u0629.",
    accent: "#111827",
    cardRadius: "10px",
    buttonStyle: "square",
    buttonRadius: "8px",
    animation: "none",
    displayMode: "all_flat_grid",
    cardStyle: "minimal",
    cardOrientation: "portrait",
    navbarStyle: "solid",
    spacing: "compact",
    botPersona: "classic",
    botButtonStyle: "minimal",
    botAvatarStyle: "pulse"
  },
  tech: {
    id: "tech",
    name: "Tech",
    label: "\u062A\u0642\u0646\u064A",
    description: "\u0623\u0633\u0644\u0648\u0628 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A \u0645\u0639 \u062D\u0648\u0627\u0641 \u0645\u062A\u0646\u0627\u0633\u0642\u0629 \u0648\u0623\u062F\u0648\u0627\u062A \u062A\u0645\u062B\u064A\u0644\u064A\u0629 \u062D\u062F\u064A\u062B\u0629.",
    accent: "#06B6D4",
    cardRadius: "16px",
    buttonStyle: "rounded",
    buttonRadius: "14px",
    animation: "glow",
    displayMode: "tabs_by_category",
    cardStyle: "bold",
    cardOrientation: "portrait",
    navbarStyle: "glass",
    spacing: "normal",
    botPersona: "tech",
    botButtonStyle: "minimal",
    botAvatarStyle: "orb"
  },
  fashion: {
    id: "fashion",
    name: "Fashion",
    label: "\u0645\u0648\u0636\u0629",
    description: "\u0642\u0648\u0629 \u0627\u0644\u0644\u0648\u0646\u060C \u0625\u064A\u0642\u0627\u0639 \u0623\u0646\u064A\u0642\u060C \u0648\u0645\u0638\u0647\u0631 \u0645\u0631\u0646 \u0644\u0623\u0632\u064A\u0627\u0621 \u0648\u0645\u0627\u0631\u0643\u0627\u062A lifestyle.",
    accent: "#EC4899",
    cardRadius: "22px",
    buttonStyle: "pill",
    buttonRadius: "9999px",
    animation: "scale",
    displayMode: "featured_first",
    cardStyle: "magazine",
    cardOrientation: "portrait",
    navbarStyle: "floating",
    spacing: "relaxed",
    botPersona: "fashion",
    botButtonStyle: "bubble",
    botAvatarStyle: "hover"
  },
  bold: {
    id: "bold",
    name: "Bold",
    label: "\u062C\u0631\u064A\u0621",
    description: "\u0639\u0646\u0627\u0635\u0631 \u0648\u0627\u0636\u062D\u0629\u060C \u0623\u0644\u0648\u0627\u0646 \u0645\u062A\u064A\u0646\u0629\u060C \u0648\u0645\u0638\u0647\u0631 \u062A\u0637\u0644\u0628\u064A \u064A\u0644\u0641\u062A \u0627\u0644\u0627\u0646\u062A\u0628\u0627\u0647.",
    accent: "#F59E0B",
    cardRadius: "28px",
    buttonStyle: "rounded",
    buttonRadius: "18px",
    animation: "scale",
    displayMode: "featured_first",
    cardStyle: "bold",
    cardOrientation: "landscape",
    navbarStyle: "floating",
    spacing: "relaxed",
    botPersona: "premium",
    botButtonStyle: "bubble",
    botAvatarStyle: "halo"
  },
  organic: {
    id: "organic",
    name: "Organic",
    label: "\u0637\u0628\u064A\u0639\u064A",
    description: "\u0645\u0638\u0647\u0631 \u0646\u0627\u0639\u0645 \u0648\u0645\u0631\u064A\u062D \u064A\u0646\u0627\u0633\u0628 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0635\u062D\u064A\u0629 \u0648\u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629.",
    accent: "#10B981",
    cardRadius: "20px",
    buttonStyle: "pill",
    buttonRadius: "9999px",
    animation: "lift",
    displayMode: "by_categories_sections",
    cardStyle: "classic",
    cardOrientation: "portrait",
    navbarStyle: "glass",
    spacing: "normal",
    botPersona: "wellness",
    botButtonStyle: "pill",
    botAvatarStyle: "pulse"
  },
  futuristic: {
    id: "futuristic",
    name: "Futuristic",
    label: "\u0645\u0633\u062A\u0642\u0628\u0644\u064A",
    description: "\u0623\u0646\u064A\u0642\u060C \u062D\u062F\u064A\u062B\u060C \u0648\u0645\u0644\u064A\u0621 \u0628\u0627\u0644\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0627\u0644\u0631\u0642\u0645\u064A\u0629 \u0648\u0627\u0644\u0639\u0627\u0643\u0633\u0627\u062A.",
    accent: "#06B6D4",
    cardRadius: "30px",
    buttonStyle: "rounded",
    buttonRadius: "16px",
    animation: "glow",
    displayMode: "tabs_by_category",
    cardStyle: "glass",
    cardOrientation: "landscape",
    navbarStyle: "glass",
    spacing: "relaxed",
    botPersona: "futuristic",
    botButtonStyle: "minimal",
    botAvatarStyle: "orb"
  },
  premium: {
    id: "premium",
    name: "Premium",
    label: "\u0645\u0645\u064A\u0632",
    description: "\u0623\u0633\u0644\u0648\u0628 \u0645\u0645\u064A\u0632 \u064A\u0646\u0642\u0644 \u0627\u0644\u0645\u062A\u062C\u0631 \u0625\u0644\u0649 \u062A\u062C\u0631\u0628\u0629 \u0639\u0644\u0627\u0645\u0629 \u062A\u062C\u0627\u0631\u064A\u0629 \u0645\u062A\u0642\u062F\u0645\u0629.",
    accent: "#8B5CF6",
    cardRadius: "22px",
    buttonStyle: "pill",
    buttonRadius: "9999px",
    animation: "lift",
    displayMode: "featured_first",
    cardStyle: "magazine",
    cardOrientation: "landscape",
    navbarStyle: "floating",
    spacing: "relaxed",
    botPersona: "premium",
    botButtonStyle: "bubble",
    botAvatarStyle: "halo"
  },
  classic: {
    id: "classic",
    name: "Classic",
    label: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A",
    description: "\u0645\u0638\u0647\u0631 \u0645\u062A\u0648\u0627\u0632\u0646 \u064A\u0639\u0631\u0641\u0647 \u0627\u0644\u0632\u0628\u0648\u0646 \u0648\u064A\u0634\u0639\u0631\u0647 \u0628\u0627\u0644\u062B\u0642\u0629.",
    accent: "#4F46E5",
    cardRadius: "14px",
    buttonStyle: "rounded",
    buttonRadius: "12px",
    animation: "lift",
    displayMode: "by_categories_sections",
    cardStyle: "classic",
    cardOrientation: "portrait",
    navbarStyle: "solid",
    spacing: "normal",
    botPersona: "classic",
    botButtonStyle: "pill",
    botAvatarStyle: "pulse"
  },
  market: {
    id: "market",
    name: "Market",
    label: "\u062A\u062C\u0627\u0631\u064A",
    description: "\u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0643\u0628\u064A\u0631\u0629 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0632\u0648\u062F\u0629 \u0628\u062E\u0635\u0648\u0645\u0627\u062A \u0648\u062A\u062C\u0627\u0631\u064A\u0627\u062A.",
    accent: "#FB7185",
    cardRadius: "16px",
    buttonStyle: "rounded",
    buttonRadius: "14px",
    animation: "scale",
    displayMode: "by_categories_sections",
    cardStyle: "bold",
    cardOrientation: "portrait",
    navbarStyle: "solid",
    spacing: "normal",
    botPersona: "tech",
    botButtonStyle: "pill",
    botAvatarStyle: "pulse"
  }
};
var STORE_STYLE_LIBRARY_LIST = Object.values(STORE_STYLE_LIBRARY);

// src/studio/main.ts
function buildReusableThemeConfig(sourceConfig) {
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
function extractImportedStudioConfig(value) {
  const candidate = value?.config && typeof value.config === "object" ? value.config : value;
  if (!candidate || typeof candidate !== "object") {
    throw new Error("\u0645\u0644\u0641 JSON \u0644\u0627 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0635\u0627\u0644\u062D\u0629");
  }
  return candidate;
}
function inferSmartDesignFromColor(hex) {
  const { h, s, l } = hexToHSL(normalizeHexColor(hex));
  let font = "Tajawal";
  let weight = "700";
  let radius = "12px";
  let button_style = "rounded";
  let button_radius = "14px";
  let anim = "lift";
  let display = "by_categories_sections";
  let card_style = "portrait";
  const isGrayscale = s < 15;
  const isPastel = s < 60 && l > 75;
  const isVibrant = s > 70;
  const isDark = l < 35;
  const isWarm = h >= 0 && h < 45 || h >= 330 && h <= 360;
  const isEarth = h >= 45 && h < 75;
  const isNature = h >= 75 && h < 160;
  const isCool = h >= 160 && h < 260;
  const isRoyal = h >= 260 && h < 330;
  if (isGrayscale) {
    font = "Alexandria";
    weight = "600";
    radius = "4px";
    button_style = "square";
    button_radius = "4px";
    anim = "lift";
    display = "all_flat_grid";
  } else if (isNature) {
    font = "Almarai";
    weight = "700";
    radius = "20px";
    button_style = "pill";
    button_radius = "9999px";
    anim = "glow";
    display = "tabs_by_category";
    card_style = "portrait";
  } else if (isRoyal) {
    font = "Readex Pro";
    weight = "700";
    radius = "28px";
    button_style = "pill";
    button_radius = "9999px";
    anim = "scale";
    display = "featured_first";
    card_style = "portrait";
  } else if (isEarth || isWarm && isDark) {
    font = "Changa";
    weight = "800";
    radius = "0px";
    button_style = "square";
    button_radius = "0px";
    anim = "lift";
    display = "by_categories_sections";
    card_style = "landscape";
  } else if (isCool) {
    font = "Cairo";
    weight = "700";
    radius = "12px";
    button_style = "rounded";
    button_radius = "12px";
    anim = "lift";
    display = "by_categories_sections";
    card_style = "portrait";
  } else if (isWarm && isVibrant) {
    font = "Tajawal";
    weight = "800";
    radius = "16px";
    button_style = "rounded";
    button_radius = "16px";
    anim = "scale";
    display = "featured_first";
    card_style = "portrait";
  } else if (isPastel) {
    font = "El Messiri";
    weight = "700";
    radius = "20px";
    button_style = "pill";
    button_radius = "9999px";
    anim = "lift";
    display = "tabs_by_category";
  }
  return { font, weight, radius, button_style, button_radius, anim, display, card_style, l };
}
var StudioApp = class _StudioApp {
  static isInitialized = false;
  static init() {
    if (_StudioApp.isInitialized) return;
    _StudioApp.isInitialized = true;
    studioState.init();
    _StudioApp.mountWindowBridge();
    _StudioApp.mountApp();
    studioState.subscribe((_config, activeTab, changeType) => {
      _StudioApp.handleStateUpdate(activeTab, changeType);
    });
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        _StudioApp.undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        _StudioApp.redo();
      }
    });
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "NALSH_IFRAME_READY") {
        setTimeout(() => {
          studioState.sendLiveUpdateToPreview();
          studioState.syncIframeTheme(studioState.isDarkPreview);
        }, 100);
      }
    });
  }
  static mountApp() {
    const root = document.getElementById("studio-app-root");
    if (!root) return;
    const { mobileView } = studioState;
    const viewClass = mobileView === "preview" ? "view-mode-preview" : "view-mode-controls";
    root.innerHTML = `
            ${Topbar.render()}
            <main class="sb-workspace ${viewClass}">
                ${Sidebar.render()}
                ${Preview.render()}
            </main>
            ${HelpModal.render()}
            <div class="sb-mobile-view-switcher">
                <div class="sb-history-group sb-mobile-history-group" aria-label="\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u062A\u0631\u0627\u062C\u0639">
                    <button class="sb-icon-tool" data-history-action="undo" onclick="window.StudioUI.undo()" title="\u062A\u0631\u0627\u062C\u0639 (Ctrl+Z)" ${!studioState.canUndo() ? "disabled" : ""}>
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="sb-icon-tool" data-history-action="redo" onclick="window.StudioUI.redo()" title="\u0625\u0639\u0627\u062F\u0629 (Ctrl+Y)" ${!studioState.canRedo() ? "disabled" : ""}>
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
                <button class="sb-m-view-btn ${mobileView === "controls" ? "active" : ""}" onclick="window.StudioUI.setMobileView('controls')">
                    <i class="fas fa-sliders-h"></i> <span>\u0627\u0644\u062A\u062E\u0635\u064A\u0635</span>
                </button>
                <button class="sb-m-view-btn ${mobileView === "preview" ? "active" : ""}" onclick="window.StudioUI.setMobileView('preview')">
                    <i class="fas fa-eye"></i> <span>\u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629</span>
                </button>
            </div>
        `;
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("sb-more-dropdown");
      if (dropdown && dropdown.classList.contains("show")) {
        const target = e.target;
        if (!target?.closest(".sb-topbar-more-container")) {
          dropdown.classList.remove("show");
        }
      }
    });
  }
  static refreshActiveTab(preserveScroll = true) {
    const currentTabInfo = Sidebar.getTabInfo(studioState.activeTab);
    const kickerEl = document.getElementById("sb-active-kicker");
    const titleEl = document.getElementById("sb-active-title");
    if (kickerEl) kickerEl.textContent = currentTabInfo.kicker;
    if (titleEl) titleEl.textContent = currentTabInfo.label;
    document.querySelectorAll("#sb-tabs-rail .sb-rail-btn").forEach((btn) => {
      const tab = btn.getAttribute("data-tab");
      btn.classList.toggle("active", tab === studioState.activeTab);
    });
    document.querySelectorAll("#sb-mobile-tabs-bar .sb-mobile-tab-pill").forEach((btn) => {
      const tab = btn.getAttribute("data-tab");
      const isActive = tab === studioState.activeTab;
      btn.classList.toggle("active", isActive);
      if (isActive) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    });
    const area = document.getElementById("sb-tab-content-area");
    if (!area) return;
    const currentScroll = preserveScroll ? area.scrollTop : 0;
    area.innerHTML = Sidebar.renderTabContent(studioState.activeTab);
    if (preserveScroll) {
      area.scrollTop = currentScroll;
    }
  }
  static handleStateUpdate(activeTab, changeType) {
    document.querySelectorAll('[data-history-action="undo"]').forEach((button) => {
      button.disabled = !studioState.canUndo();
    });
    document.querySelectorAll('[data-history-action="redo"]').forEach((button) => {
      button.disabled = !studioState.canRedo();
    });
    if (changeType === "tab") {
      _StudioApp.refreshActiveTab(false);
    } else if (changeType === "device") {
      const pw = document.getElementById("preview-wrapper");
      if (pw) {
        pw.className = `sb-preview-wrapper preview-frame-${studioState.currentDevice}`;
      }
      const previewDeviceSwitcher = document.getElementById("preview-device-switcher");
      if (previewDeviceSwitcher) {
        previewDeviceSwitcher.classList.toggle("is-desktop", studioState.currentDevice === "desktop");
      }
      const dh = document.getElementById("preview-device-header");
      if (dh) {
        dh.classList.toggle("hidden", studioState.currentDevice === "desktop");
      }
      const deviceBtns = document.querySelectorAll(".sb-device-btn");
      deviceBtns.forEach((btn) => {
        const isMatch = btn.getAttribute("data-device") === studioState.currentDevice;
        btn.classList.toggle("active", isMatch);
      });
      if (studioState.activeTab === "products_layout") {
        _StudioApp.refreshActiveTab(true);
      }
    } else if (changeType === "dark_mode") {
      const icon = document.getElementById("sb-theme-icon");
      const text = document.getElementById("sb-theme-mode-text");
      if (icon) icon.className = `fas ${studioState.isDarkPreview ? "fa-sun" : "fa-moon"}`;
      if (text) text.textContent = studioState.isDarkPreview ? "\u0641\u0627\u062A\u062D" : "\u062F\u0627\u0643\u0646";
    } else if (changeType === "mobile_view") {
      const ws = document.querySelector(".sb-workspace");
      if (ws) {
        ws.className = `sb-workspace view-mode-${studioState.mobileView}`;
      }
      const mBtns = document.querySelectorAll(".sb-m-view-btn");
      mBtns.forEach((btn) => {
        const isMatch = studioState.mobileView === "controls" && btn.innerHTML.includes("\u0627\u0644\u062A\u062E\u0635\u064A\u0635") || studioState.mobileView === "preview" && btn.innerHTML.includes("\u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629");
        btn.classList.toggle("active", isMatch);
      });
    } else if (changeType === "history" || changeType === "full_sync") {
      _StudioApp.refreshActiveTab(true);
    }
  }
  static undo() {
    if (studioState.undo()) {
      Toast.show("\u062A\u0645 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u21A9\uFE0F", "info");
    }
  }
  static redo() {
    if (studioState.redo()) {
      Toast.show("\u062A\u0645\u062A \u0627\u0644\u0625\u0639\u0627\u062F\u0629 \u21AA\uFE0F", "info");
    }
  }
  static mountWindowBridge() {
    window.StudioUI = {
      setActiveTab: (tab) => studioState.setActiveTab(tab),
      switchProductSubTab: (sub) => {
        studioState.setProductSubTab(sub);
        _StudioApp.refreshActiveTab(true);
      },
      setDevice: (d) => studioState.setDevice(d),
      setMobileView: (v) => studioState.setMobileView(v),
      toggleDarkMode: () => studioState.togglePreviewDarkMode(),
      undo: () => _StudioApp.undo(),
      redo: () => _StudioApp.redo(),
      openHelpModal: () => HelpModal.open(),
      closeHelpModal: () => HelpModal.close(),
      toggleMoreMenu: (e) => {
        if (e) {
          e.stopPropagation();
        }
        const dropdown = document.getElementById("sb-more-dropdown");
        if (dropdown) {
          dropdown.classList.toggle("show");
        }
      },
      handleIdentityChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.store_identity) cfg.store_identity = {};
          cfg.store_identity[key] = value;
        }, true, "live_update");
      },
      handleAnnouncementChange: (key, value, rerender = false) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.store_identity) cfg.store_identity = {};
          if (!cfg.store_identity.announcement_bar) {
            cfg.store_identity.announcement_bar = { enabled: true, text: "", bg_color: "#4F46E5", text_color: "#FFFFFF" };
          }
          cfg.store_identity.announcement_bar[key] = value;
        }, true, rerender ? "full_sync" : "live_update");
        if (rerender) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleDefaultThemeModeChange: (mode) => {
        studioState.updateConfig((cfg) => {
          cfg.default_theme_mode = mode;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A: ${mode === "dark" ? "\u0627\u0644\u062F\u0627\u0643\u0646 \u{1F319}" : mode === "light" ? "\u0627\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F" : "\u062A\u0644\u0642\u0627\u0626\u064A \u{1F5A5}\uFE0F"}`);
      },
      handleProductsSettingChange: (key, value, rerender = true) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings) cfg.products_settings = {};
          cfg.products_settings[key] = value;
        }, true, rerender ? "full_sync" : "live_update");
        if (rerender) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleOrientationSettingChange: (orientKey, key, value, rerender = true) => {
        const structuralKeys = ["scroll_direction", "grid_columns", "grid_rows", "slider_rows", "card_orientation", "items_per_row"];
        const needsRebuild = rerender || structuralKeys.includes(key);
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings) cfg.products_settings = {};
          if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {};
          cfg.products_settings[orientKey][key] = value;
          if (orientKey === "portrait") {
            cfg.products_settings[key] = value;
          }
        }, true, needsRebuild ? "full_sync" : "live_update");
        if (needsRebuild) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleCategorySelectForOverride: (cat) => {
        studioState.selectedCategoryForOverride = cat;
        _StudioApp.refreshActiveTab(true);
      },
      /**
       * معالج sliders الأبعاد بدون لاغ:
       * 1. يحقن CSS مباشرة في الـ iframe (فوري = 0ms)
       * 2. يحفظ القيمة في الـ state بـ debounce (500ms)
       */
      handleDimensionSliderChange: (orientKey, key, value) => {
        studioState.applyDimensionsDirectlyToCSS(orientKey, { [key]: value });
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings) cfg.products_settings = {};
          if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {};
          cfg.products_settings[orientKey][key] = value;
        }, true, "live_update");
      },
      handleCardStyleChange: (orientKey, style) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings) cfg.products_settings = {};
          if (!cfg.products_settings[orientKey]) cfg.products_settings[orientKey] = {};
          cfg.products_settings[orientKey]["card_style"] = style;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0634\u0643\u0644 \u0627\u0644\u0643\u0631\u0648\u062A \u0625\u0644\u0649 "${style}" \u2728`);
      },
      handleAddToCartBtnSettingChange: (key, value, rerender = true) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings) cfg.products_settings = {};
          if (!cfg.products_settings.add_to_cart_btn) cfg.products_settings.add_to_cart_btn = {};
          cfg.products_settings.add_to_cart_btn[key] = value;
        }, true, "full_sync");
        if (rerender) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      toggleCategoryOverrideEnabled: (cat, isEnabled) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
          if (!cfg.products_settings.category_overrides[cat]) {
            cfg.products_settings.category_overrides[cat] = {
              enabled: isEnabled,
              scroll_direction: "horizontal",
              items_per_row: 2,
              grid_columns: 2,
              grid_rows: 0,
              slider_rows: 1,
              card_orientation: "portrait"
            };
          } else {
            cfg.products_settings.category_overrides[cat].enabled = isEnabled;
          }
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      handleCategoryOverrideChange: (cat, key, value, rerender = true) => {
        const structuralKeys = ["scroll_direction", "grid_columns", "grid_rows", "slider_rows", "card_orientation", "items_per_row", "card_style"];
        const needsRebuild = rerender || structuralKeys.includes(key);
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
          if (!cfg.products_settings.category_overrides[cat]) {
            cfg.products_settings.category_overrides[cat] = { enabled: true };
          }
          cfg.products_settings.category_overrides[cat][key] = value;
        }, true, needsRebuild ? "full_sync" : "live_update");
        if (needsRebuild) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleCategoryDimensionChange: (cat, key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.products_settings.category_overrides) cfg.products_settings.category_overrides = {};
          if (!cfg.products_settings.category_overrides[cat]) {
            cfg.products_settings.category_overrides[cat] = { enabled: true };
          }
          cfg.products_settings.category_overrides[cat][key] = value;
        }, true, "live_update");
      },
      deleteCategoryOverride: (cat) => {
        if (!confirm(`\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u0633\u062A\u0642\u0644 \u0644\u0642\u0633\u0645 "${cat}" \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629\u061F`)) return;
        studioState.updateConfig((cfg) => {
          if (cfg.products_settings?.category_overrides?.[cat]) {
            delete cfg.products_settings.category_overrides[cat];
          }
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062D\u0630\u0641 \u062A\u062E\u0635\u064A\u0635 ${cat} \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0646\u0645\u0637 \u0627\u0644\u0639\u0627\u0645 \u{1F504}`);
      },
      resetProductsLayoutDefaults: () => {
        if (!confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0644\u0637\u0631\u064A\u0642\u0629 \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u061F")) return;
        studioState.updateConfig((cfg) => {
          cfg.products_settings = JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG.products_settings));
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u0646\u062C\u0627\u062D \u{1F504}");
      },
      handleColorChange: (modeKey, colorKey, value, sourceEl) => {
        const normalizedValue = typeof value === "string" ? value.trim() : "";
        const isDark = modeKey === "dark_theme";
        if (studioState.isDarkPreview !== isDark) {
          studioState.setPreviewDarkMode(isDark);
        }
        studioState.updateConfig((cfg) => {
          if (!cfg[modeKey]) cfg[modeKey] = { colors: {} };
          if (!cfg[modeKey].colors) cfg[modeKey].colors = {};
          if (normalizedValue) cfg[modeKey].colors[colorKey] = normalizedValue;
          if (["primary", "badge_bg", "btn_primary_bg", "chatbot_btn_bg"].includes(colorKey) && /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)) {
            const autoText = contrastText(normalizedValue);
            if (colorKey === "badge_bg") cfg[modeKey].colors.badge_text = autoText;
            if (colorKey === "btn_primary_bg") cfg[modeKey].colors.btn_primary_text = autoText;
          }
        }, true, "live_update");
        if (sourceEl) {
          const card = sourceEl.closest(".sb-color-card");
          if (card) {
            const colorInput = card.querySelector(".sb-color-input");
            const hexInput = card.querySelector(".sb-hex-input");
            if (sourceEl === colorInput && hexInput) {
              hexInput.value = normalizedValue;
            } else if (sourceEl === hexInput && colorInput && /^#[0-9A-Fa-f]{6}$/.test(normalizedValue)) {
              colorInput.value = normalizedValue;
            }
          }
        }
      },
      generateSmartForMode: (mode, manualPrimary) => {
        const modeKey = mode === "light" ? "light_theme" : "dark_theme";
        const currentColors = studioState.config[modeKey]?.colors || {};
        const seedPrimary = manualPrimary || document.getElementById(`seed-primary-${modeKey}`)?.value || document.getElementById("ai-seed-primary")?.value || currentColors.primary || (mode === "light" ? "#4F46E5" : "#6366F1");
        const seedBg = document.getElementById(`seed-bg-${modeKey}`)?.value || (mode === "light" ? document.getElementById("ai-seed-lightbg")?.value : document.getElementById("ai-seed-darkbg")?.value) || currentColors.bg_body || (mode === "light" ? "#F8FAFC" : "#0B1120");
        const seedText = document.getElementById(`seed-text-${modeKey}`)?.value || currentColors.text_main || (mode === "light" ? "#0F172A" : "#F8FAFC");
        const seedAccent = document.getElementById(`seed-accent-${modeKey}`)?.value || document.getElementById("ai-seed-accent")?.value || currentColors.accent || (mode === "light" ? "#14B8A6" : "#2DD4BF");
        studioState.updateConfig((cfg) => {
          if (mode === "light") {
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
        }, true, "full_sync");
        studioState.setPreviewDarkMode(mode === "dark");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0648\u0644\u064A\u062F \u0648\u062A\u0646\u0633\u064A\u0642 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0648\u0636\u0639 ${mode === "light" ? "\u0627\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F" : "\u0627\u0644\u062F\u0627\u0643\u0646 \u{1F319}"} \u0628\u0646\u062C\u0627\u062D \u2728`);
      },
      generateSmartSectionForMode: (mode, section) => {
        const modeKey = mode === "light" ? "light_theme" : "dark_theme";
        const currentColors = studioState.config[modeKey]?.colors || {};
        const seedPrimary = document.getElementById(`seed-primary-${modeKey}`)?.value || document.getElementById("ai-seed-primary")?.value || currentColors.primary || (mode === "light" ? "#4F46E5" : "#6366F1");
        const seedBg = document.getElementById(`seed-bg-${modeKey}`)?.value || (mode === "light" ? document.getElementById("ai-seed-lightbg")?.value : document.getElementById("ai-seed-darkbg")?.value) || currentColors.bg_body || (mode === "light" ? "#F8FAFC" : "#0B1120");
        const seedText = document.getElementById(`seed-text-${modeKey}`)?.value || currentColors.text_main || (mode === "light" ? "#0F172A" : "#F8FAFC");
        const seedAccent = document.getElementById(`seed-accent-${modeKey}`)?.value || document.getElementById("ai-seed-accent")?.value || currentColors.accent || (mode === "light" ? "#14B8A6" : "#2DD4BF");
        const generated = mode === "light" ? buildLightPaletteFromSeeds({ primary: seedPrimary, bg: seedBg, text: seedText, accent: seedAccent }) : buildDarkPaletteFromSeeds({ primary: seedPrimary, bg: seedBg, text: seedText, accent: seedAccent });
        studioState.updateConfig((cfg) => {
          if (!cfg[modeKey]) cfg[modeKey] = { colors: {} };
          if (!cfg[modeKey].colors) cfg[modeKey].colors = {};
          if (section === "bg") {
            cfg[modeKey].colors.bg_body = generated.bg_body;
            cfg[modeKey].colors.bg_card = generated.bg_card;
            cfg[modeKey].colors.bg_surface = generated.bg_surface;
            cfg[modeKey].colors.navbar_bg = generated.navbar_bg;
            cfg[modeKey].colors.bottom_bar_bg = generated.bottom_bar_bg;
            cfg[modeKey].colors.border = generated.border;
            cfg[modeKey].colors.card_bg = generated.card_bg;
            cfg[modeKey].colors.card_border = generated.card_border;
            cfg[modeKey].colors.modal_bg = generated.modal_bg;
          } else if (section === "buttons") {
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
          } else if (section === "text") {
            cfg[modeKey].colors.text_main = generated.text_main;
            cfg[modeKey].colors.text_muted = generated.text_muted;
            cfg[modeKey].colors.card_title = generated.card_title;
            cfg[modeKey].colors.section_title = generated.section_title;
            cfg[modeKey].colors.navbar_text = generated.navbar_text;
            cfg[modeKey].colors.category_chip_text = generated.category_chip_text;
          }
        }, true, "full_sync");
        studioState.setPreviewDarkMode(mode === "dark");
        _StudioApp.refreshActiveTab(true);
        const sectionNames = { bg: "\u0627\u0644\u062E\u0644\u0641\u064A\u0627\u062A \u0648\u0627\u0644\u0643\u0631\u0648\u062A", buttons: "\u0627\u0644\u0623\u0632\u0631\u0627\u0631 \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631", text: "\u0627\u0644\u0646\u0635\u0648\u0635 \u0648\u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646" };
        Toast.show(`\u062A\u0645 \u062A\u062E\u0635\u064A\u0635 \u0648\u062A\u0648\u0644\u064A\u062F ${sectionNames[section] || "\u0627\u0644\u0639\u0646\u0627\u0635\u0631"} \u0628\u0646\u062C\u0627\u062D \u2728`);
      },
      generateSmartHarmony: (targetScope = "intelligent") => {
        const seedPrimary = document.getElementById("ai-seed-primary")?.value || document.getElementById("ai-seed-primary-hex")?.value || document.getElementById("ai-seed-color")?.value || studioState.config.light_theme?.colors?.primary || "#4F46E5";
        const seedLightBg = document.getElementById("ai-seed-lightbg")?.value || document.getElementById("ai-seed-lightbg-hex")?.value || studioState.config.light_theme?.colors?.bg_body || "#F8FAFC";
        const seedDarkBg = document.getElementById("ai-seed-darkbg")?.value || document.getElementById("ai-seed-darkbg-hex")?.value || studioState.config.dark_theme?.colors?.bg_body || "#0B1120";
        const seedAccent = document.getElementById("ai-seed-accent")?.value || document.getElementById("ai-seed-accent-hex")?.value || studioState.config.light_theme?.colors?.accent || "#14B8A6";
        studioState.updateConfig((cfg) => {
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
          if (targetScope === "intelligent") {
            const smart = inferSmartDesignFromColor(seedPrimary);
            if (!cfg.typography) cfg.typography = {};
            if (!cfg.shapes) cfg.shapes = {};
            if (!cfg.animations) cfg.animations = {};
            if (!cfg.products_settings) cfg.products_settings = {};
            if (!cfg.products_settings.portrait) cfg.products_settings.portrait = {};
            if (!cfg.products_settings.landscape) cfg.products_settings.landscape = {};
            cfg.typography.font_family = smart.font;
            cfg.typography.heading_weight = smart.weight;
            cfg.shapes.card_radius = smart.radius;
            cfg.shapes.button_style = smart.button_style;
            cfg.shapes.button_radius = smart.button_radius;
            cfg.animations.card_hover = smart.anim;
            cfg.products_settings.display_mode = smart.display;
            cfg.products_settings.portrait = {
              ...cfg.products_settings.portrait,
              card_orientation: smart.card_style === "landscape" ? "landscape" : "portrait",
              grid_columns: smart.display === "tabs_by_category" ? 2 : 2,
              scroll_direction: "vertical"
            };
            cfg.products_settings.landscape = {
              ...cfg.products_settings.landscape,
              card_orientation: smart.card_style,
              grid_columns: smart.card_style === "landscape" ? 3 : 4,
              scroll_direction: "horizontal"
            };
            cfg.default_theme_mode = smart.l < 40 ? "dark" : "light";
          }
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u062A\u0648\u0644\u064A\u062F \u0647\u0648\u064A\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0628\u0630\u0643\u0627\u0621 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0623\u0644\u0648\u0627\u0646\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u2728\u{1F3A8}");
      },
      applySmartIndustryBundle: (bundleId) => {
        const seeds = {
          luxury: "#D97706",
          tech: "#06B6D4",
          fashion: "#EC4899",
          organic: "#059669",
          artisan: "#B45309",
          modern: "#8B5CF6"
        };
        const seedColor = seeds[bundleId] || "#4F46E5";
        const colorEl = document.getElementById("ai-seed-color");
        const hexEl = document.getElementById("ai-seed-hex");
        if (colorEl) colorEl.value = seedColor;
        if (hexEl) hexEl.value = seedColor;
        const presetEl = document.getElementById("ai-style-preset");
        if (presetEl) presetEl.value = bundleId;
        window.StudioUI.generateSmartHarmony("intelligent");
      },
      handlePresetApply: (presetId, targetMode = "both") => {
        const p = THEME_PRESETS.find((x) => x.id === presetId);
        if (!p) return;
        studioState.updateConfig((cfg) => {
          cfg.theme_name = p.id;
          if (targetMode === "both") {
            cfg.light_theme = JSON.parse(JSON.stringify(p.light_theme || {}));
            cfg.dark_theme = JSON.parse(JSON.stringify(p.dark_theme || {}));
            if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
            if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
          } else if (targetMode === "light") {
            cfg.light_theme = JSON.parse(JSON.stringify(p.light_theme || {}));
            if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
            if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
          } else if (targetMode === "dark") {
            cfg.dark_theme = JSON.parse(JSON.stringify(p.dark_theme || {}));
            if (p.typography) cfg.typography = { ...cfg.typography, ...p.typography };
            if (p.shapes) cfg.shapes = { ...cfg.shapes, ...p.shapes };
          }
        }, true, "full_sync");
        if (targetMode === "light") {
          studioState.setPreviewDarkMode(false);
        } else if (targetMode === "dark") {
          studioState.setPreviewDarkMode(true);
        }
        _StudioApp.refreshActiveTab(true);
        const modeLabel = targetMode === "both" ? "\u0627\u0644\u0648\u0636\u0639\u064A\u0646 \u0645\u0639\u0627\u064B" : targetMode === "light" ? "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062A\u062D \u2600\uFE0F" : "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646 \u{1F319}";
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u062B\u064A\u0645 "${p.name}" \u0644\u0640 (${modeLabel}) \u0628\u0646\u062C\u0627\u062D \u2728`);
      },
      filterPresetCards: (category, clickedBtn) => {
        const pillContainer = document.getElementById("theme-category-pills");
        if (pillContainer) {
          pillContainer.querySelectorAll(".sb-badge-pill").forEach((b) => {
            b.classList.remove("active");
          });
        }
        if (clickedBtn) {
          clickedBtn.classList.add("active");
        }
        const cards = document.querySelectorAll(".sb-preset-theme-card");
        cards.forEach((c) => {
          const el = c;
          const cardCat = el.getAttribute("data-category") || "\u0639\u0627\u0645";
          if (category === "\u0627\u0644\u0643\u0644" || cardCat === category) {
            el.style.display = "block";
          } else {
            el.style.display = "none";
          }
        });
      },
      handleStoreMessageChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.messages) cfg.messages = {};
          if (!cfg.store_messages) cfg.store_messages = {};
          cfg.messages[key] = value;
          cfg.store_messages[key] = value;
        }, true, "live_update");
      },
      handleModalFieldChange: (modalKey, fieldKey, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.modals_customization) cfg.modals_customization = {};
          if (!cfg.modals_customization[modalKey]) cfg.modals_customization[modalKey] = {};
          cfg.modals_customization[modalKey][fieldKey] = value;
        }, true, "live_update");
      },
      toggleAccordion: (idx) => {
        const acc = document.getElementById(`sec-acc-${idx}`);
        if (acc) acc.classList.toggle("open");
      },
      moveSectionBlock: (idx, dir) => {
        studioState.updateConfig((cfg) => {
          const blocks = cfg.layout_blocks || [];
          const target = idx + dir;
          if (target < 0 || target >= blocks.length) return;
          const temp = blocks[idx];
          blocks[idx] = blocks[target];
          blocks[target] = temp;
          blocks.forEach((b, i) => b.order = i + 1);
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u2728");
      },
      toggleSectionVisibility: (idx) => {
        studioState.updateConfig((cfg) => {
          const blocks = cfg.layout_blocks || [];
          if (blocks[idx]) blocks[idx].visible = !blocks[idx].visible;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      handleBlockFieldChange: (idx, field, value) => {
        studioState.updateConfig((cfg) => {
          const blocks = cfg.layout_blocks || [];
          if (blocks[idx]) blocks[idx][field] = value;
        }, true, "live_update");
      },
      handleBlockSettingChange: (idx, settingKey, value) => {
        studioState.updateConfig((cfg) => {
          const blocks = cfg.layout_blocks || [];
          if (blocks[idx]) {
            if (!blocks[idx].settings) blocks[idx].settings = {};
            blocks[idx].settings[settingKey] = value;
          }
        }, true, "live_update");
      },
      handleTypographyChange: (key, value, rerender = false) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.typography) cfg.typography = {};
          cfg.typography[key] = value;
        }, true, rerender ? "full_sync" : "live_update");
        if (rerender) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleShapeChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.shapes) cfg.shapes = {};
          cfg.shapes[key] = value;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      handleButtonStyleChange: (style, radius) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.shapes) cfg.shapes = {};
          cfg.shapes.button_style = style;
          cfg.shapes.button_radius = radius;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      applyStyleLibraryPreset: (presetId) => {
        const preset = STORE_STYLE_LIBRARY[presetId] || STORE_STYLE_LIBRARY["modern-soft"];
        if (!preset) return;
        studioState.updateConfig((cfg) => {
          const cfgAny = cfg;
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
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0646\u0645\u0637 "${preset.label}" \u0628\u0646\u062C\u0627\u062D \u2728`);
      },
      handleAnimationChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.animations) cfg.animations = {};
          cfg.animations[key] = value;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      handleMarketingChange: (section, key, value, rerender = false) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.marketing) cfg.marketing = {};
          if (!cfg.marketing[section]) cfg.marketing[section] = {};
          cfg.marketing[section][key] = value;
        }, true, rerender ? "full_sync" : "live_update");
        if (rerender) {
          _StudioApp.refreshActiveTab(true);
        }
      },
      handleJsonApplyFromText: () => {
        const el = document.getElementById("live-json-editor");
        if (!el) return;
        try {
          const parsed = JSON.parse(el.value);
          const { sanitizedConfig } = sanitizeStorefrontConfig(extractImportedStudioConfig(parsed));
          studioState.pushHistory();
          studioState.config = sanitizedConfig;
          studioState.sendLiveUpdateToPreview();
          _StudioApp.refreshActiveTab(true);
          Toast.show("\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0645\u0644\u0641 JSON \u0628\u0646\u062C\u0627\u062D \u2705");
        } catch (err) {
          alert("\u062E\u0637\u0623 \u0641\u064A \u0635\u064A\u063A\u0629 JSON: " + err.message);
        }
      },
      handleJsonFileUpload: (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const parsed = JSON.parse(e.target?.result);
            const { sanitizedConfig } = sanitizeStorefrontConfig(extractImportedStudioConfig(parsed));
            studioState.pushHistory();
            studioState.config = sanitizedConfig;
            studioState.sendLiveUpdateToPreview();
            _StudioApp.refreshActiveTab(true);
            Toast.show(`\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u0645\u0644\u0641 "${file.name}" \u0628\u0646\u062C\u0627\u062D \u2705`);
          } catch (err) {
            alert("\u062E\u0637\u0623 \u0641\u064A \u0642\u0631\u0627\u0621\u0629 \u0645\u0644\u0641 JSON: " + err.message);
          }
        };
        reader.readAsText(file);
        event.target.value = "";
      },
      copyJsonClipboard: () => {
        navigator.clipboard.writeText(JSON.stringify(studioState.config, null, 2)).then(() => {
          Toast.show("\u062A\u0645 \u0646\u0633\u062E JSON \u0644\u0644\u062D\u0627\u0641\u0638\u0629 \u{1F4CB}");
        });
      },
      copyMerchantPromptClipboard: () => {
        const el = document.getElementById("store-merchant-prompt");
        const value = el?.value || (() => {
          const config = studioState.config;
          const promptConfig = {
            store_name: config.store_name || "\u0645\u062A\u062C\u0631\u064A",
            store_tagline: config.store_tagline || "\u0645\u062A\u062C\u0631 \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A",
            language: "ar",
            currency: config.currency || "SAR",
            default_theme_mode: config.default_theme_mode || "light",
            primary_color: config.light_theme?.colors?.primary || "#4F46E5",
            accent_color: config.light_theme?.colors?.accent || "#8B5CF6",
            background_color: config.light_theme?.colors?.bg_body || "#F8FAFC",
            typography: {
              font_family: config.typography?.font_family || "Tajawal",
              heading_weight: config.typography?.heading_weight || "700",
              base_size: config.typography?.base_size || 16
            },
            navigation: config.navigation_settings || {},
            marketing: config.marketing || {},
            messages: config.messages || config.store_messages || {},
            modals: config.modals_customization || {},
            sections: Array.isArray(config.sections) ? config.sections : [],
            products_settings: config.products_settings || {}
          };
          return `\u0623\u0646\u062A \u0645\u0635\u0645\u0645 \u0645\u062A\u062C\u0631 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A \u0648\u0645\u062A\u062E\u0635\u0635. \u0627\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u062A\u062E\u0635\u064A\u0635 \u0645\u062A\u062C\u0631 \u0643\u0627\u0645\u0644\u060C \u0648\u0627\u0628\u0642\u0650 \u0627\u0644\u0628\u0646\u064A\u0629 \u0646\u0641\u0633\u0647\u0627\u060C \u0648\u0644\u0627 \u062A\u0643\u062A\u0628 \u0634\u0631\u062D\u0627\u064B \u0625\u0636\u0627\u0641\u064A\u0627\u064B\u060C \u0641\u0642\u0637 \u0623\u0639\u062F \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0645\u062A\u062C\u0631 \u0648\u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0646\u0627\u062A\u062C \u0635\u0627\u0644\u062D JSON:

${JSON.stringify(promptConfig, null, 2)}`;
        })();
        navigator.clipboard.writeText(value).then(() => {
          Toast.show("\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0628\u0631\u0648\u0645\u0628\u062A \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u0644\u062D\u0627\u0641\u0638\u0629 \u270D\uFE0F");
        }).catch(() => {
          if (el) {
            el.select();
            document.execCommand("copy");
          }
          Toast.show("\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0628\u0631\u0648\u0645\u0628\u062A \u0644\u0644\u062D\u0627\u0641\u0638\u0629 \u270D\uFE0F");
        });
      },
      resetMerchantPrompt: () => {
        const el = document.getElementById("store-merchant-prompt");
        if (!el) return;
        const config = studioState.config;
        const promptConfig = {
          store_name: config.store_name || "\u0645\u062A\u062C\u0631\u064A",
          store_tagline: config.store_tagline || "\u0645\u062A\u062C\u0631 \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A",
          language: "ar",
          currency: config.currency || "SAR",
          default_theme_mode: config.default_theme_mode || "light",
          primary_color: config.light_theme?.colors?.primary || "#4F46E5",
          accent_color: config.light_theme?.colors?.accent || "#8B5CF6",
          background_color: config.light_theme?.colors?.bg_body || "#F8FAFC",
          typography: {
            font_family: config.typography?.font_family || "Tajawal",
            heading_weight: config.typography?.heading_weight || "700",
            base_size: config.typography?.base_size || 16
          },
          navigation: config.navigation_settings || {},
          marketing: config.marketing || {},
          messages: config.messages || config.store_messages || {},
          modals: config.modals_customization || {},
          sections: Array.isArray(config.sections) ? config.sections : [],
          products_settings: config.products_settings || {}
        };
        el.value = `\u0623\u0646\u062A \u0645\u0635\u0645\u0645 \u0645\u062A\u062C\u0631 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0639\u0631\u0628\u064A \u0639\u0635\u0631\u064A \u0648\u0645\u062A\u062E\u0635\u0635. \u0627\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u0642\u0627\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u062A\u062E\u0635\u064A\u0635 \u0645\u062A\u062C\u0631 \u0643\u0627\u0645\u0644\u060C \u0648\u0627\u0628\u0642\u0650 \u0627\u0644\u0628\u0646\u064A\u0629 \u0646\u0641\u0633\u0647\u0627\u060C \u0648\u0644\u0627 \u062A\u0643\u062A\u0628 \u0634\u0631\u062D\u0627\u064B \u0625\u0636\u0627\u0641\u064A\u0627\u064B\u060C \u0641\u0642\u0637 \u0623\u0639\u062F \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0645\u062A\u062C\u0631 \u0648\u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0646\u0627\u062A\u062C \u0635\u0627\u0644\u062D JSON:

${JSON.stringify(promptConfig, null, 2)}`;
        el.focus();
        Toast.show("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u0631\u0648\u0645\u0628\u062A \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0645\u062A\u062C\u0631 \u{1F504}");
      },
      downloadJson: () => {
        const fileName = `storefront_config_${studioState.merchantUsername}.json`;
        const blob = new Blob([JSON.stringify(studioState.config, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        Toast.show("\u062A\u0645 \u062A\u0646\u0632\u064A\u0644 \u0645\u0644\u0641 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u{1F4E5}");
      },
      downloadThemeTemplate: () => {
        const idInput = document.getElementById("theme-export-id");
        const nameInput = document.getElementById("theme-export-name");
        const descriptionInput = document.getElementById("theme-export-description");
        const id = (idInput?.value || "custom_theme").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
        if (!id) {
          Toast.show("\u0623\u062F\u062E\u0644 \u0645\u0639\u0631\u0641\u064B\u0627 \u0635\u0627\u0644\u062D\u064B\u0627 \u0644\u0644\u0642\u0627\u0644\u0628 \u0623\u0648\u0644\u0627\u064B", "error");
          return;
        }
        const config = buildReusableThemeConfig(studioState.config);
        const colors = config.light_theme?.colors || {};
        const template = {
          id,
          name: (nameInput?.value || "\u0642\u0627\u0644\u0628 \u0645\u062A\u062C\u0631 \u062C\u062F\u064A\u062F").trim(),
          description: (descriptionInput?.value || "\u062A\u0635\u0645\u064A\u0645 \u062C\u0627\u0647\u0632 \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u062E\u0635\u064A\u0635 \u0644\u0645\u062A\u062C\u0631\u0643.").trim(),
          category: "\u0642\u0648\u0627\u0644\u0628 \u0645\u062E\u0635\u0635\u0629",
          preview: {
            primary: colors.primary || "#4F46E5",
            accent: colors.accent || "#06B6D4",
            background: colors.bg_body || "#F8FAFC"
          },
          config
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `theme_${id}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        Toast.show(`\u062A\u0645 \u062A\u0646\u0632\u064A\u0644 \u0645\u0644\u0641 \u0627\u0644\u0642\u0627\u0644\u0628 (${template.name}). \u0636\u0639\u0647 \u062F\u0627\u062E\u0644 \u0645\u062C\u0644\u062F templates/themes/ \u0648\u0633\u064A\u0638\u0647\u0631 \u0644\u0644\u062A\u0627\u062C\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u{1F4E6}`, "success");
      },
      resetAllDefaults: () => {
        if (!confirm("\u26A0\uFE0F \u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0643\u0627\u0641\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0625\u0644\u0649 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u061F \u0633\u062A\u0641\u0642\u062F \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u063A\u064A\u0631 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629.")) return;
        studioState.resetToDefaults();
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0643\u0627\u0641\u0629 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u{1F504}");
      },
      publishTheme: async () => {
        const btn = document.getElementById("btn-publish-live");
        const oldHtml = btn ? btn.innerHTML : "";
        if (btn) {
          btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>\u062C\u0627\u0631\u064A \u0627\u0644\u0646\u0634\u0631 \u0627\u0644\u0633\u062D\u0627\u0628\u064A...</span>`;
          btn.disabled = true;
        }
        try {
          const token = studioState.merchantToken || localStorage.getItem("merchant_token") || sessionStorage.getItem("merchant_token");
          const publishConfig = await studioState.buildPublishConfig();
          if (studioState.isGuestMode || !token) {
            try {
              const cfgStr = JSON.stringify(publishConfig);
              localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
              localStorage.setItem("nalsh_storefront_config_guest_draft", cfgStr);
            } catch (e) {
            }
            Toast.show("\u062A\u0645 \u062D\u0641\u0638 \u062A\u0635\u0645\u064A\u0645\u0643 \u0645\u062D\u0644\u064A\u0627\u064B \u0643\u0645\u0633\u0648\u062F\u0629 \u0628\u0646\u062C\u0627\u062D! \u{1F4BE}", "success");
            if (confirm("\u0623\u0646\u062A \u062D\u0627\u0644\u064A\u0627\u064B \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A. \u062A\u0645 \u062D\u0641\u0638 \u0643\u0627\u0641\u0629 \u062A\u0639\u062F\u064A\u0644\u0627\u062A\u0643 \u0645\u062D\u0644\u064A\u0627\u064B. \u0647\u0644 \u062A\u0648\u062F \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0646\u0634\u0631\u0647\u0627 \u0633\u062D\u0627\u0628\u064A\u0627\u064B \u0639\u0644\u0649 \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u061F")) {
              window.location.href = "login.html?redirect=store-builder.html";
            }
            return;
          }
          const { sanitizedConfig, notices } = sanitizeStorefrontConfig(publishConfig, studioState.merchantPlanType);
          studioState.config = sanitizedConfig;
          const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          };
          const res = await fetch(WORKER_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({
              action: "save_storefront_config",
              merchant_username: studioState.merchantUsername,
              config: sanitizedConfig
            })
          });
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("merchant_token");
            sessionStorage.removeItem("merchant_token");
            Toast.show("\u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u062C\u0644\u0633\u0629. \u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062C\u062F\u062F\u0627\u064B \u{1F512}", "error");
            setTimeout(() => {
              window.location.replace("login.html?redirect=store-builder.html&expired=1");
            }, 1200);
            return;
          }
          const result = await res.json().catch(() => null);
          const isSuccessfulPublish = !!(res.ok && result && (result.status === "success" || result.status === "ok" || result.success === true || result.saved === true || result.updated === true));
          if (res.ok && isSuccessfulPublish) {
            try {
              const cfgStr = JSON.stringify(sanitizedConfig);
              localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
            } catch (e) {
            }
            fetch(WORKER_API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
              body: JSON.stringify({
                action: "update_theme_config_file",
                merchant_username: studioState.merchantUsername,
                config: sanitizedConfig
              })
            }).catch(() => {
            });
            studioState.sendLiveUpdateToPreview();
            const noticeText = Array.isArray(notices) && notices.length > 0 ? ` (${notices[0]})` : "";
            Toast.show(`\u062A\u0645 \u0646\u0634\u0631 \u0645\u0638\u0647\u0631 \u0645\u062A\u062C\u0631\u0643 \u0633\u062D\u0627\u0628\u064A\u0627\u064B \u0628\u0646\u062C\u0627\u062D! \u{1F680}${noticeText}`, "success");
          } else {
            const errMsg = result?.message || "\u062A\u0639\u0630\u0631 \u0627\u0644\u0646\u0634\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u0627\u062F\u0645 \u0627\u0644\u0633\u062D\u0627\u0628\u064A";
            try {
              const cfgStr = JSON.stringify(sanitizedConfig);
              localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, cfgStr);
            } catch (e) {
            }
            Toast.show(`\u26A0\uFE0F \u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0645\u062D\u0644\u064A\u0627\u064B \u0643\u0645\u0633\u0648\u062F\u0629 (${errMsg})`, "info");
          }
        } catch (e) {
          console.error("Publish error:", e);
          try {
            localStorage.setItem(`nalsh_storefront_config_${studioState.merchantUsername}`, JSON.stringify(studioState.config));
          } catch (err) {
          }
          Toast.show("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0645\u062D\u0644\u064A\u0627\u064B \u0643\u0645\u0633\u0648\u062F\u0629 (\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0644\u0644\u0646\u0634\u0631 \u0627\u0644\u0633\u062D\u0627\u0628\u064A) \u{1F3A8}", "info");
        } finally {
          if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
          }
        }
      },
      handleAssistantConfigChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          const messages = cfg.messages || (cfg.store_messages || {});
          cfg.messages = messages;
          if (!messages.ai_assistant) messages.ai_assistant = {
            enabled: true,
            name: "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634",
            persona: "classic",
            avatar_icon: "fa-robot",
            avatar_emoji: "",
            button_style: "pill",
            avatar_style: "pulse",
            position: "bottom-right",
            enable_quick_actions: true,
            smart_contextual_actions: true,
            smart_contextual_replies: true,
            behavior_mode: "support",
            conversation_style: "balanced",
            response_style: "friendly",
            accent_color: "#5D646D",
            status_text: "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A",
            quick_actions: ["\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629", "\u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F", "\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A"]
          };
          messages.ai_assistant[key] = value;
        }, true, "live_update");
        _StudioApp.refreshActiveTab(true);
      },
      handleAssistantQuickActionsChange: (value) => {
        const items = (value || "").split(/[،,\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 6);
        studioState.updateConfig((cfg) => {
          const messages = cfg.messages || (cfg.store_messages || {});
          cfg.messages = messages;
          if (!messages.ai_assistant) messages.ai_assistant = {};
          messages.ai_assistant.quick_actions = items;
        }, true, "live_update");
        _StudioApp.refreshActiveTab(true);
      },
      applyAssistantPreset: (preset) => {
        const presets = {
          classic: { enabled: true, name: "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634", persona: "classic", avatar_icon: "fa-robot", avatar_emoji: "", button_style: "pill", avatar_style: "pulse", position: "bottom-right", response_style: "friendly", accent_color: "#5D646D", status_text: "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "support", conversation_style: "balanced", quick_actions: ["\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629", "\u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F", "\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A"] },
          premium: { enabled: true, name: "\u0645\u0633\u0627\u0639\u062F \u0630\u0643\u064A", persona: "premium", avatar_icon: "fa-star", avatar_emoji: "", button_style: "bubble", avatar_style: "halo", position: "bottom-right", response_style: "sales", accent_color: "#6C757D", status_text: "\u0645\u0633\u062A\u0639\u062F \u0644\u0639\u0631\u0636 \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "sales", conversation_style: "balanced", quick_actions: ["\u0623\u0641\u0636\u0644 \u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u064A\u0648\u0645", "\u0623\u0631\u0646\u064A \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u0645\u064A\u0632\u0629", "\u0623\u062D\u062A\u0627\u062C \u0645\u0633\u0627\u0639\u062F\u0629 \u0641\u064A \u0627\u0644\u0637\u0644\u0628"] },
          futuristic: { enabled: true, name: "AI Assistant", persona: "futuristic", avatar_icon: "fa-microchip", avatar_emoji: "", button_style: "minimal", avatar_style: "orb", position: "bottom-left", response_style: "professional", accent_color: "#6B727A", status_text: "\u0627\u0644\u0628\u0648\u062A \u0645\u062A\u0635\u0644 \u0645\u0639 \u062F\u0639\u0645 \u0641\u0648\u0631\u064A", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "advisor", conversation_style: "short", quick_actions: ["\u0627\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062D\u062F\u064A\u062B\u0629", "\u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639", "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"] },
          luxury: { enabled: true, name: "\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0641\u062E\u0627\u0645\u0629", persona: "luxury", avatar_icon: "fa-crown", avatar_emoji: "", button_style: "bubble", avatar_style: "halo", position: "bottom-right", response_style: "luxury", accent_color: "#7A6E63", status_text: "\u062E\u062F\u0645\u0629 \u0641\u0627\u062E\u0631\u0629 \u0648\u062F\u0639\u0645 \u0634\u062E\u0635\u064A", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "concierge", conversation_style: "balanced", quick_actions: ["\u0645\u0646\u062A\u062C\u0627\u062A \u0641\u0627\u062E\u0631\u0629", "\u062E\u062F\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621", "\u0623\u0631\u0646\u064A \u0622\u062E\u0631 \u0627\u0644\u0639\u0631\u0648\u0636"] },
          fashion: { enabled: true, name: "\u0645\u0633\u062A\u0634\u0627\u0631 \u0627\u0644\u0645\u0648\u0636\u0629", persona: "fashion", avatar_icon: "fa-shirt", avatar_emoji: "", button_style: "bubble", avatar_style: "hover", position: "bottom-right", response_style: "friendly", accent_color: "#7F8086", status_text: "\u0623\u0633\u0627\u0639\u062F\u0643 \u0628\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0633\u062A\u0627\u064A\u0644 \u0627\u0644\u0645\u0646\u0627\u0633\u0628", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "advisor", conversation_style: "balanced", quick_actions: ["\u0623\u0631\u0646\u064A \u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0648\u062F\u064A\u0644\u0627\u062A", "\u0627\u062E\u062A\u064A\u0627\u0631\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u0645\u0648\u0633\u0645", "\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A \u0623\u0646\u064A\u0642\u0629"] },
          tech: { enabled: true, name: "\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u062A\u0642\u0646\u064A\u0629", persona: "tech", avatar_icon: "fa-laptop", avatar_emoji: "", button_style: "minimal", avatar_style: "orb", position: "bottom-left", response_style: "professional", accent_color: "#6F7277", status_text: "\u0623\u0642\u0641\u0632 \u0644\u0643 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u062A\u0642\u0646\u064A\u0629", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "advisor", conversation_style: "short", quick_actions: ["\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u062D\u062F\u064A\u062B\u0629", "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A", "\u0623\u0631\u0646\u064A \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062A\u0642\u0646\u064A\u0629"] },
          wellness: { enabled: true, name: "\u0645\u0633\u062A\u0634\u0627\u0631 \u0627\u0644\u0635\u062D\u0629", persona: "wellness", avatar_icon: "fa-spa", avatar_emoji: "", button_style: "pill", avatar_style: "pulse", position: "bottom-right", response_style: "friendly", accent_color: "#7D8682", status_text: "\u0623\u062E\u062A\u0627\u0631 \u0644\u0643 \u0627\u0644\u0623\u0641\u0636\u0644 \u0644\u0644\u062C\u0633\u0645 \u0648\u0627\u0644\u0639\u0646\u0627\u064A\u0629", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "advisor", conversation_style: "balanced", quick_actions: ["\u0645\u0646\u062A\u062C\u0627\u062A \u0635\u062D\u064A\u0629", "\u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629", "\u0623\u0631\u0646\u064A \u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0639\u0646\u0627\u064A\u0629"] },
          beauty: { enabled: true, name: "\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u062C\u0645\u0627\u0644", persona: "beauty", avatar_icon: "fa-magic", avatar_emoji: "", button_style: "bubble", avatar_style: "halo", position: "bottom-right", response_style: "luxury", accent_color: "#8B8E94", status_text: "\u0623\u0631\u0634\u062F\u0643 \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0623\u0641\u0636\u0644 \u0644\u0644\u062C\u0645\u0627\u0644", smart_contextual_actions: true, smart_contextual_replies: true, behavior_mode: "concierge", conversation_style: "balanced", quick_actions: ["\u0623\u062D\u062F\u062B \u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u0627\u0644\u062A\u062C\u0645\u064A\u0644", "\u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0646\u0627\u064A\u0629", "\u0645\u062C\u0645\u0648\u0639\u0629 \u0639\u0646\u0627\u064A\u0629 \u0643\u0627\u0645\u0644\u0629"] }
        };
        const chosen = presets[preset] || presets.classic;
        studioState.updateConfig((cfg) => {
          const messages = cfg.messages || (cfg.store_messages || {});
          cfg.messages = messages;
          messages.ai_assistant = {
            ...messages.ai_assistant || {},
            ...chosen,
            enable_quick_actions: true,
            smart_contextual_actions: true,
            smart_contextual_replies: true
          };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        const labels = {
          classic: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A",
          premium: "\u0645\u0645\u064A\u0632",
          futuristic: "\u0645\u0633\u062A\u0642\u0628\u0644\u064A",
          luxury: "\u0641\u0627\u062E\u0631",
          fashion: "\u0645\u0648\u0636\u0629",
          tech: "\u062A\u0642\u0646\u064A\u0629",
          wellness: "\u0635\u062D\u0629",
          beauty: "\u062C\u0645\u0627\u0644"
        };
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0623\u0633\u0644\u0648\u0628 ${labels[preset] || "\u0645\u062E\u0635\u0635"} \u2705`);
      },
      // ── Navigation Handlers ──────────────────────────────────────────
      handleNavBottomItemChange: (itemId, key, value) => {
        const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          if (!cfg.navigation_settings.bottom_bar) cfg.navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
          const items = cfg.navigation_settings.bottom_bar.items;
          const item = items.find((i) => i.id === itemId);
          if (!item) return;
          if (key === "visible" && value === false) {
            const visibleCount = items.filter((i) => i.visible).length;
            if (visibleCount <= 2) {
              Toast.show("\u064A\u062C\u0628 \u0627\u0644\u0625\u0628\u0642\u0627\u0621 \u0639\u0644\u0649 \u0639\u0646\u0635\u0631\u064A\u0646 \u0645\u0631\u0626\u064A\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u26A0\uFE0F", "error");
              return;
            }
          }
          item[key] = value;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u062D\u062F\u064A\u062B ${key === "visible" ? "\u0625\u0638\u0647\u0627\u0631" : key === "label" ? "\u0627\u0633\u0645" : "\u0623\u064A\u0642\u0648\u0646\u0629"} \u0627\u0644\u0639\u0646\u0635\u0631 \u2705`);
      },
      handleNavBottomItemDragStart: (itemId) => {
        window.__navDragItemId = itemId;
      },
      handleNavBottomItemDrop: (targetItemId) => {
        const draggedId = window.__navDragItemId;
        if (!draggedId || draggedId === targetItemId) return;
        const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          if (!cfg.navigation_settings.bottom_bar) cfg.navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
          const items = cfg.navigation_settings.bottom_bar.items.sort((a, b) => (a.order || 0) - (b.order || 0));
          const from = items.findIndex((i) => i.id === draggedId);
          const to = items.findIndex((i) => i.id === targetItemId);
          if (from < 0 || to < 0) return;
          const [moved] = items.splice(from, 1);
          items.splice(to, 0, moved);
          items.forEach((item, index) => item.order = index + 1);
        }, true, "full_sync");
        window.__navDragItemId = null;
        _StudioApp.refreshActiveTab(true);
      },
      handleNavBottomItemMove: (itemId, direction) => {
        const defaultItems = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          if (!cfg.navigation_settings.bottom_bar) cfg.navigation_settings.bottom_bar = { items: JSON.parse(JSON.stringify(defaultItems)) };
          const items = cfg.navigation_settings.bottom_bar.items.sort((a, b) => (a.order || 0) - (b.order || 0));
          const idx = items.findIndex((i) => i.id === itemId);
          if (idx < 0) return;
          const swapIdx = direction === "up" ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= items.length) return;
          const tmpOrder = items[idx].order;
          items[idx].order = items[swapIdx].order;
          items[swapIdx].order = tmpOrder;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
      },
      handleNavTopBarChange: (key, value) => {
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          if (!cfg.navigation_settings.top_bar) cfg.navigation_settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS);
          cfg.navigation_settings.top_bar[key] = value;
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A \u2705");
      },
      handleNavTopBarStyleChange: (style) => {
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          settings.top_bar = { ...normalizeTopBarSettings(settings.top_bar), navbar_style: style };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0634\u0643\u0644 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A \u2705");
      },
      handleNavBottomBarStyleChange: (style) => {
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          settings.bottom_bar = { ...settings.bottom_bar || {}, style };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0634\u0643\u0644 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u2705");
      },
      handleNavBarDimensionChange: (bar, style, key, value) => {
        const stringValueKeys = ["desktop_layout", "mobile_shape", "show_labels", "bar_color", "active_color"];
        const numericValue = stringValueKeys.includes(key) ? value : Math.max(0, Number(value) || 0);
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          const section = bar === "top" ? settings.top_bar || (settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)) : settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
          if (!section.style_settings) section.style_settings = {};
          if (!section.style_settings[style]) section.style_settings[style] = {};
          section.style_settings[style][key] = numericValue;
        }, true, "full_sync");
      },
      handleNavCopyStyle: (bar, style) => {
        if (!confirm("\u0633\u064A\u062A\u0645 \u0646\u0633\u062E \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u0634\u0643\u0644 \u0625\u0644\u0649 \u0628\u0642\u064A\u0629 \u0627\u0644\u0623\u0634\u0643\u0627\u0644. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F")) return;
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          const section = bar === "top" ? settings.top_bar || (settings.top_bar = normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)) : settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
          const source = section.style_settings?.[style] || {};
          if (!section.style_settings) section.style_settings = {};
          ["solid", "glass", "floating", "neon", "minimal", "island"].forEach((targetStyle) => {
            section.style_settings[targetStyle] = { ...source };
          });
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645 \u0646\u0633\u062E \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0634\u0643\u0644 \u0625\u0644\u0649 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0634\u0643\u0627\u0644 \u2705");
      },
      handleNavResetStyle: (bar, style) => {
        if (!confirm("\u0633\u064A\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u0634\u0643\u0644 \u0641\u0642\u0637. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F")) return;
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          const section = bar === "top" ? settings.top_bar : settings.bottom_bar;
          if (section?.style_settings?.[style]) {
            delete section.style_settings[style];
          }
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0641\u0642\u0637 \u{1F504}");
      },
      handleNavMobilePreset: (style, preset) => {
        const presets = {
          balanced: { mobile_shape: "classic", mobile_width: 100, mobile_height: 66, mobile_bottom: 0, item_radius: 14, icon_size: 1.15, item_gap: 8, show_labels: true },
          minimal: { mobile_shape: "pill", mobile_width: 92, mobile_height: 58, mobile_bottom: 12, item_radius: 999, icon_size: 1.05, item_gap: 5, show_labels: false },
          focus: { mobile_shape: "center", mobile_width: 96, mobile_height: 72, mobile_bottom: 8, item_radius: 18, icon_size: 1.3, item_gap: 10, show_labels: true }
        };
        const selected = presets[preset];
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          const bottom = settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
          if (!bottom.style_settings) bottom.style_settings = {};
          bottom.style_settings[style] = { ...bottom.style_settings[style] || {}, ...selected };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0642\u0627\u0644\u0628 \u0627\u0644\u0647\u0627\u062A\u0641: ${preset === "balanced" ? "\u0645\u062A\u0648\u0627\u0632\u0646" : preset === "minimal" ? "\u062E\u0641\u064A\u0641" : "\u062A\u0631\u0643\u064A\u0632"} \u2705`);
      },
      handleNavDesktopPreset: (style, preset) => {
        const presets = {
          dock: { desktop_layout: "dock", desktop_width: 560, desktop_height: 64, desktop_bottom: 22, radius: 999, item_radius: 999, icon_size: 1.2, item_gap: 8, show_labels: true },
          wide: { desktop_layout: "wide", desktop_width: 920, desktop_height: 70, desktop_bottom: 18, radius: 22, item_radius: 16, icon_size: 1.15, item_gap: 12, show_labels: true },
          compact: { desktop_layout: "compact", desktop_width: 440, desktop_height: 56, desktop_bottom: 14, radius: 18, item_radius: 12, icon_size: 1.05, item_gap: 5, show_labels: false }
        };
        const selected = presets[preset];
        studioState.updateConfig((cfg) => {
          const settings = cfg.navigation_settings || (cfg.navigation_settings = {});
          const bottom = settings.bottom_bar || (settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) });
          if (!bottom.style_settings) bottom.style_settings = {};
          bottom.style_settings[style] = { ...bottom.style_settings[style] || {}, ...selected };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0642\u0627\u0644\u0628 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631: ${preset === "dock" ? "Dock \u0623\u0646\u064A\u0642" : preset === "wide" ? "\u0639\u0631\u064A\u0636" : "\u0645\u0636\u063A\u0648\u0637"} \u2705`);
      },
      handleNavPreset: (presetKey) => {
        const preset = NAVIGATION_PRESETS[presetKey] || NAVIGATION_PRESETS.default;
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          cfg.navigation_settings.bottom_bar = {
            items: normalizeBottomNavItems(preset)
          };
          cfg.navigation_settings.top_bar = normalizeTopBarSettings(cfg.navigation_settings.top_bar || DEFAULT_TOP_BAR_SETTINGS);
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0642\u0627\u0644\u0628 ${presetKey === "default" ? "\u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A" : presetKey === "minimal" ? "\u0627\u0644\u0645\u0628\u0633\u0637" : presetKey === "market" ? "\u0627\u0644\u062A\u062C\u0627\u0631\u064A" : presetKey === "luxury" ? "\u0627\u0644\u0641\u0627\u062E\u0631" : presetKey === "premium" ? "\u0627\u0644\u0645\u0645\u064A\u0632" : presetKey === "wellness" ? "\u0627\u0644\u0635\u062D\u064A" : "\u0645\u062E\u0635\u0635"} \u2705`);
      },
      handleNavResetBottomBar: () => {
        if (!confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u0644\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629\u061F")) return;
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          cfg.navigation_settings.bottom_bar = {
            items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS)
          };
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u{1F504}");
      },
      applySectionPreset: (presetId) => {
        const presets = {
          balanced: [
            { id: "block_hero_1", type: "hero", title: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0645\u062A\u062C\u0631\u0646\u0627", subtitle: "\u062A\u0633\u0648\u0642 \u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631", style: "classic", visible: true, order: 1, settings: { cta_text: "\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", cta_link: "#products", alignment: "center" } },
            { id: "block_cat_1", type: "categories", title: "\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0645\u0645\u064A\u0632\u0629", style: "bubbles", visible: true, order: 2, settings: { layout: "horizontal" } },
            { id: "block_prod_1", type: "products", title: "\u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0639\u0631\u0648\u0636", style: "classic_grid", visible: true, order: 3, settings: { limit: 12 } }
          ],
          catalog: [
            { id: "block_cat_1", type: "categories", title: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A", style: "chips_slider", visible: true, order: 1, settings: { layout: "horizontal" } },
            { id: "block_prod_1", type: "products", title: "\u0627\u0644\u0645\u062A\u062C\u0631", style: "flat_grid", visible: true, order: 2, settings: { limit: 18 } },
            { id: "block_banner_1", type: "banner", title: "\u0639\u0631\u0636 \u062E\u0627\u0635", subtitle: "\u062E\u0635\u0648\u0645\u0627\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 50%", style: "classic", visible: true, order: 3, settings: { banner_height: 180 } }
          ],
          luxury: [
            { id: "block_hero_1", type: "hero", title: "\u062A\u062C\u0631\u0628\u0629 \u0634\u0631\u0627\u0621 \u0641\u0627\u062E\u0631\u0629", subtitle: "\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u062E\u062A\u0627\u0631\u0629 \u0628\u0639\u0646\u0627\u064A\u0629", style: "luxury", visible: true, order: 1, settings: { cta_text: "\u0627\u0633\u062A\u0639\u0631\u0636 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629", cta_link: "#products", alignment: "center" } },
            { id: "block_banner_1", type: "banner", title: "\u062A\u0633\u0648\u0642 \u0628\u0636\u063A\u0637\u0629 \u0648\u0627\u062D\u062F\u0629", subtitle: "\u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0636\u0645\u0627\u0646 \u0627\u0644\u062C\u0648\u062F\u0629", style: "minimal", visible: true, order: 2, settings: { banner_height: 160 } },
            { id: "block_prod_1", type: "products", title: "\u0625\u0628\u062F\u0627\u0639\u0627\u062A\u0646\u0627 \u0627\u0644\u0645\u0645\u064A\u0632\u0629", style: "glass", visible: true, order: 3, settings: { limit: 10 } }
          ],
          promo: [
            { id: "block_banner_1", type: "banner", title: "\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062D\u0627\u0644\u064A\u0629", subtitle: "\u062E\u0635\u0648\u0645\u0627\u062A \u0642\u0648\u064A\u0629 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", style: "classic", visible: true, order: 1, settings: { banner_height: 190 } },
            { id: "block_prod_1", type: "products", title: "\u0623\u0643\u062B\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0637\u0644\u0628\u0627\u064B", style: "classic_grid", visible: true, order: 2, settings: { limit: 14 } },
            { id: "block_cat_1", type: "categories", title: "\u062A\u0635\u0641\u062D \u062D\u0633\u0628 \u0627\u0644\u0641\u0626\u0629", style: "bubbles", visible: true, order: 3, settings: { layout: "horizontal" } }
          ]
        };
        const chosen = presets[presetId] || presets.balanced;
        studioState.updateConfig((cfg) => {
          cfg.layout_blocks = JSON.parse(JSON.stringify(chosen));
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show(`\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0647\u064A\u0643\u0644 ${presetId === "balanced" ? "\u0627\u0644\u0645\u062A\u0648\u0627\u0632\u0646" : presetId === "catalog" ? "\u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" : presetId === "luxury" ? "\u0627\u0644\u0641\u0627\u062E\u0631" : "\u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A"} \u2705`);
      },
      handleNavSmartProtect: () => {
        studioState.updateConfig((cfg) => {
          if (!cfg.navigation_settings) cfg.navigation_settings = {};
          if (!cfg.navigation_settings.bottom_bar) cfg.navigation_settings.bottom_bar = { items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS) };
          const items = cfg.navigation_settings.bottom_bar.items;
          const protectedIds = /* @__PURE__ */ new Set(["home", "cart"]);
          if (!items.length) {
            cfg.navigation_settings.bottom_bar.items = normalizeBottomNavItems(DEFAULT_NAV_ITEMS);
            return;
          }
          items.forEach((item) => {
            if (protectedIds.has(item.id)) item.visible = true;
          });
          const visible = items.filter((item) => item.visible);
          if (visible.length < 2) {
            items.forEach((item) => {
              if (item.id === "home" || item.id === "cart") item.visible = true;
            });
          }
          items.forEach((item, index) => {
            item.order = index + 1;
          });
        }, true, "full_sync");
        _StudioApp.refreshActiveTab(true);
        Toast.show("\u062A\u0645\u062A \u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0641\u064A \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0633\u0641\u0644\u064A \u{1F6E1}\uFE0F");
      }
    };
  }
};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => StudioApp.init());
} else {
  StudioApp.init();
}
export {
  StudioApp
};
