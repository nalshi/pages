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

// src/core/ThemeEngine.ts
var ThemeEngine = class _ThemeEngine {
  static instance;
  currentConfig = null;
  constructor() {
    this.setupPostMessageListener();
    this.setupThemeObserver();
  }
  static getInstance() {
    if (!_ThemeEngine.instance) {
      _ThemeEngine.instance = new _ThemeEngine();
    }
    return _ThemeEngine.instance;
  }
  hexToRgba(hex, alpha = 0.25) {
    if (!hex || typeof hex !== "string") return `rgba(99, 102, 241, ${alpha})`;
    let cleanHex = hex.replace("#", "").trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return `rgba(99, 102, 241, ${alpha})`;
    const r = num >> 16 & 255;
    const g = num >> 8 & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  hexToRgbValues(hex) {
    if (!hex || typeof hex !== "string") return "79, 70, 229";
    let cleanHex = hex.replace("#", "").trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return "79, 70, 229";
    const r = num >> 16 & 255;
    const g = num >> 8 & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  }
  loadGoogleFont(fontFamily) {
    if (!fontFamily || fontFamily === "inherit" || fontFamily === "system-ui") return;
    const fontId = `google-font-${fontFamily.toLowerCase().replace(/\s+/g, "-")}`;
    if (document.getElementById(fontId)) return;
    const fontMap = {
      Tajawal: "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap",
      Cairo: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap",
      Almarai: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
      "IBM Plex Sans Arabic": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap",
      "Readex Pro": "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap",
      Alexandria: "https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800;900&display=swap",
      "Noto Kufi Arabic": "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;800&display=swap",
      Changa: "https://fonts.googleapis.com/css2?family=Changa:wght@400;600;700;800&display=swap",
      "El Messiri": "https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;600;700;800&display=swap"
    };
    const fontUrl = fontMap[fontFamily] || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800&display=swap`;
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);
  }
  applyConfig(config) {
    if (!config) return;
    this.currentConfig = config;
    state.setConfig(config);
    try {
      console.groupCollapsed("ThemeEngine.applyConfig \u2014 config summary");
      console.log("theme_name:", config.theme_name);
      console.log("default_theme_mode:", config.default_theme_mode);
      console.log("has_light_colors:", !!(config.light_theme && config.light_theme.colors));
      console.log("has_dark_colors:", !!(config.dark_theme && config.dark_theme.colors));
      console.log("typography.font_family:", config.typography?.font_family);
      console.log("products_settings present:", !!config.products_settings);
      console.log("modals_customization present:", !!config.modals_customization);
      const faLinkEl = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => l).find((l) => l.href && (l.href.includes("font-awesome") || l.href.includes("fontawesome") || l.href.includes("all.min.css")));
      if (!faLinkEl) {
        console.warn("FontAwesome stylesheet not found in DOM. Icons may appear missing.");
      } else {
        console.log("FontAwesome stylesheet found:", faLinkEl.href);
      }
      console.groupEnd();
    } catch (e) {
    }
    const isStudioPreview = window.parent && window.parent !== window || window.location.search.includes("preview=studio");
    if (!isStudioPreview && config.default_theme_mode) {
      const mode = config.default_theme_mode;
      const root = document.documentElement;
      if (mode === "dark") {
        root.classList.add("dark-mode");
      } else if (mode === "light") {
        root.classList.remove("dark-mode");
      } else if (mode === "auto") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark-mode", prefersDark);
      }
    }
    this.applyColorTokens(config);
    if (config.store_identity) {
      this.applyStoreIdentity(config.store_identity);
    }
    if (config.products_settings) {
      this.applyProductsLayout(config.products_settings);
    }
    if (config.marketing) {
      this.applyMarketingWidgets(config.marketing);
    }
    const shapes = config.shapes || {};
    if (shapes.card_style) {
      document.body.dataset.cardStyle = shapes.card_style;
    }
    const anim = config.animations || {};
    if (anim.card_hover) {
      document.body.dataset.cardHover = anim.card_hover;
    }
    window.currentStorefrontConfig = config;
    if (typeof window.HomeUI?.applyLiveConfig === "function" && window.HomeUI?.storeData) {
      window.HomeUI.applyLiveConfig(config);
    }
    events.emit("theme:applied", config);
  }
  isHexDark(hex) {
    if (!hex || typeof hex !== "string") return false;
    let c = hex.replace("#", "").trim();
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    if (c.length !== 6) return false;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    const yiq = (r * 299 + g * 587 + b * 114) / 1e3;
    return yiq < 128;
  }
  applyColorTokens(config) {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark-mode");
    const cfgAny = config;
    const lightColors = config.light_theme?.colors || cfgAny.modes?.light?.colors || {};
    const darkColors = config.dark_theme?.colors || cfgAny.modes?.dark?.colors || {};
    const activeColors = isDark ? darkColors : lightColors;
    const basePrimary = lightColors.primary || "#4F46E5";
    const primary = (isDark ? darkColors.primary || basePrimary : basePrimary) || "#4F46E5";
    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--primary", primary);
    const primaryRgb = this.hexToRgbValues(primary);
    root.style.setProperty("--primary-rgb", primaryRgb);
    root.style.setProperty("--theme-primary-rgb", primaryRgb);
    const primaryHover = activeColors.primary_hover || (isDark ? "#818CF8" : "#4338CA");
    root.style.setProperty("--theme-primary-hover", primaryHover);
    const glow = this.hexToRgba(primary, isDark ? 0.35 : 0.22);
    root.style.setProperty("--theme-primary-glow", glow);
    root.style.setProperty("--primary-glow", glow);
    const accent = (isDark ? darkColors.accent || lightColors.accent : lightColors.accent || "#14B8A6") || "#14B8A6";
    root.style.setProperty("--theme-accent", accent);
    root.style.setProperty("--accent", accent);
    const gradStart = activeColors.primary_gradient_start || primary;
    const gradEnd = activeColors.primary_gradient_end || accent;
    const gradient = `linear-gradient(135deg, ${gradStart}, ${gradEnd})`;
    root.style.setProperty("--theme-primary-gradient", gradient);
    root.style.setProperty("--primary-gradient", gradient);
    const defaultDarkBg = "#0B1120";
    const defaultLightBg = "#F8FAFC";
    const bgBody = activeColors.bg_body || (isDark ? defaultDarkBg : defaultLightBg);
    root.style.setProperty("--theme-background", bgBody);
    root.style.setProperty("--bg-body", bgBody);
    if (document.body) {
      document.body.style.backgroundColor = bgBody;
    }
    const bgCard = activeColors.bg_card || activeColors.card_bg || (isDark ? "#151E2E" : "#FFFFFF");
    root.style.setProperty("--theme-card-bg", bgCard);
    root.style.setProperty("--bg-card", bgCard);
    const bgSurface = activeColors.bg_surface || (isDark ? "#1E293B" : "#F1F5F9");
    root.style.setProperty("--theme-surface", bgSurface);
    root.style.setProperty("--bg-surface", bgSurface);
    const border = activeColors.border || activeColors.card_border || (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)");
    root.style.setProperty("--theme-border", border);
    root.style.setProperty("--border", border);
    const textMain = activeColors.text_main || activeColors.card_title || (isDark ? "#F8FAFC" : "#0F172A");
    root.style.setProperty("--theme-text-primary", textMain);
    root.style.setProperty("--text-main", textMain);
    if (document.body) {
      document.body.style.color = textMain;
    }
    const textMuted = activeColors.text_muted || (isDark ? "#94A3B8" : "#64748B");
    root.style.setProperty("--theme-text-secondary", textMuted);
    root.style.setProperty("--text-muted", textMuted);
    const navbarBg = activeColors.navbar_bg || activeColors.header_bg || bgCard;
    root.style.setProperty("--theme-navbar-bg", navbarBg);
    root.style.setProperty("--navbar-bg", navbarBg);
    const navbarText = activeColors.navbar_text || activeColors.header_text || textMain;
    root.style.setProperty("--theme-navbar-text", navbarText);
    root.style.setProperty("--navbar-text", navbarText);
    const bottomNavBg = activeColors.bottom_bar_bg || activeColors.bottom_nav_bg || bgCard;
    root.style.setProperty("--theme-bottom-nav-bg", bottomNavBg);
    root.style.setProperty("--bottom-bar-bg", bottomNavBg);
    const bottomNavActive = activeColors.bottom_bar_active || activeColors.bottom_nav_active || primary;
    root.style.setProperty("--theme-bottom-nav-active", bottomNavActive);
    root.style.setProperty("--bottom-bar-active", bottomNavActive);
    const bottomNavInactive = activeColors.bottom_bar_inactive || activeColors.bottom_nav_inactive || (isDark ? "#64748B" : "#94A3B8");
    root.style.setProperty("--theme-bottom-nav-inactive", bottomNavInactive);
    root.style.setProperty("--bottom-bar-inactive", bottomNavInactive);
    const chipBg = activeColors.category_chip_bg || bgSurface;
    root.style.setProperty("--theme-cat-chip-bg", chipBg);
    root.style.setProperty("--cat-chip-bg", chipBg);
    root.style.setProperty("--category-chip-bg", chipBg);
    const chipActive = activeColors.category_chip_active || activeColors.category_chip_active_bg || primary;
    root.style.setProperty("--theme-cat-chip-active-bg", chipActive);
    root.style.setProperty("--cat-chip-active", chipActive);
    root.style.setProperty("--category-chip-active", chipActive);
    const chipText = activeColors.category_chip_text || textMain;
    root.style.setProperty("--theme-cat-chip-text", chipText);
    root.style.setProperty("--cat-chip-text", chipText);
    root.style.setProperty("--category-chip-text", chipText);
    const searchBg = activeColors.search_bg || bgSurface;
    root.style.setProperty("--theme-search-bg", searchBg);
    root.style.setProperty("--search-bg", searchBg);
    const searchText = activeColors.search_text || textMain;
    root.style.setProperty("--theme-search-text", searchText);
    const priceColor = activeColors.price_color || primary;
    root.style.setProperty("--theme-price-color", priceColor);
    root.style.setProperty("--price-color", priceColor);
    const oldPriceColor = activeColors.old_price_color || (isDark ? "#64748B" : "#94A3B8");
    root.style.setProperty("--theme-old-price-color", oldPriceColor);
    root.style.setProperty("--old-price-color", oldPriceColor);
    const badgeBg = activeColors.badge_bg || activeColors.discount_badge_bg || "#EF4444";
    root.style.setProperty("--theme-discount-badge-bg", badgeBg);
    root.style.setProperty("--badge-bg", badgeBg);
    const badgeText = activeColors.badge_text || activeColors.discount_badge_text || "#FFFFFF";
    root.style.setProperty("--theme-discount-badge-text", badgeText);
    root.style.setProperty("--badge-text", badgeText);
    const btnPrimaryBg = activeColors.btn_primary_bg || activeColors.button_primary_bg || primary;
    root.style.setProperty("--theme-btn-primary-bg", btnPrimaryBg);
    root.style.setProperty("--btn-primary-bg", btnPrimaryBg);
    const btnPrimaryText = activeColors.btn_primary_text || "#FFFFFF";
    root.style.setProperty("--theme-btn-primary-text", btnPrimaryText);
    root.style.setProperty("--btn-primary-text", btnPrimaryText);
    const chatbotBtnBg = activeColors.chatbot_btn_bg || primary;
    root.style.setProperty("--theme-chatbot-btn-bg", chatbotBtnBg);
    root.style.setProperty("--chatbot-btn-bg", chatbotBtnBg);
    const modalBg = activeColors.modal_bg || bgCard;
    root.style.setProperty("--theme-modal-bg", modalBg);
    root.style.setProperty("--modal-bg", modalBg);
    root.style.setProperty("--bg-modal", modalBg);
    const modalOverlay = activeColors.modal_overlay || (isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(15, 23, 42, 0.6)");
    root.style.setProperty("--theme-modal-overlay", modalOverlay);
    root.style.setProperty("--modal-overlay", modalOverlay);
    const modalHandle = activeColors.modal_handle || border;
    root.style.setProperty("--theme-modal-handle", modalHandle);
    root.style.setProperty("--modal-handle", modalHandle);
    const typo = config.typography || {};
    if (typo.font_family) {
      root.style.setProperty("--theme-font-family", `'${typo.font_family}', sans-serif`);
      this.loadGoogleFont(typo.font_family);
    }
    const mobileBase = typo.base_size_mobile || typo.base_size || "15px";
    const desktopBase = typo.base_size_desktop || typo.base_size || "17px";
    root.style.setProperty("--theme-base-size-mobile", mobileBase);
    root.style.setProperty("--theme-base-size-desktop", desktopBase);
    const shapes = config.shapes || {};
    if (shapes.card_radius) {
      root.style.setProperty("--theme-card-radius", shapes.card_radius);
      root.style.setProperty("--radius-xl", shapes.card_radius);
    }
    if (shapes.button_radius) {
      root.style.setProperty("--theme-button-radius", shapes.button_radius);
      root.style.setProperty("--radius-lg", shapes.button_radius);
    }
    if (shapes.button_style === "pill") {
      root.style.setProperty("--theme-button-radius", "9999px");
      root.style.setProperty("--radius-lg", "9999px");
    } else if (shapes.button_style === "square" || shapes.button_style === "flat") {
      root.style.setProperty("--theme-button-radius", shapes.button_radius || "4px");
      root.style.setProperty("--radius-lg", shapes.button_radius || "4px");
    } else if (shapes.button_style === "rounded") {
      root.style.setProperty("--theme-button-radius", shapes.button_radius || "14px");
      root.style.setProperty("--radius-lg", shapes.button_radius || "14px");
    }
    document.body.classList.add("theme-storefront");
  }
  applyStoreIdentity(identity) {
    if (identity.store_name) {
      document.title = identity.store_name;
      const logoSpan = document.querySelector(".logo span") || document.querySelector(".navbar-brand span");
      if (logoSpan) logoSpan.textContent = identity.store_name;
    }
    const ann = identity.announcement_bar;
    let barEl = document.getElementById("storefront-announcement-bar");
    if (ann && ann.enabled && ann.text) {
      if (!barEl) {
        barEl = document.createElement("div");
        barEl.id = "storefront-announcement-bar";
        barEl.style.cssText = `
          width: 100%;
          padding: 8px 15px;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        document.body.insertBefore(barEl, document.body.firstChild);
      }
      barEl.style.background = ann.bg_color || "var(--theme-primary)";
      barEl.style.color = ann.text_color || "#FFFFFF";
      barEl.innerHTML = `<span>${ann.text}</span>`;
      barEl.style.display = "flex";
    } else if (barEl) {
      barEl.style.display = "none";
    }
  }
  applyProductsLayout(ps) {
    const port = ps.portrait || {};
    const land = ps.landscape || {};
    const pCols = Number(port.grid_columns || 2);
    const lCols = Number(land.grid_columns || 4);
    let styleTag = document.getElementById("dynamic-products-layout-css");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "dynamic-products-layout-css";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
      @media (max-width: 767px) {
        .product-grid, .ultra-product-grid, .store-premium-grid {
          grid-template-columns: repeat(${pCols}, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }
        ${port.card_custom_width > 0 ? `
          .horizontal-scroller .product-card-compact, .horizontal-scroller .fast-card {
            flex: 0 0 ${port.card_custom_width}px !important;
            width: ${port.card_custom_width}px !important;
          }
        ` : ""}
      }
      @media (min-width: 768px) {
        .product-grid, .ultra-product-grid, .store-premium-grid {
          grid-template-columns: repeat(${lCols}, minmax(0, 1fr)) !important;
          gap: 18px !important;
        }
        ${land.card_custom_width > 0 ? `
          .horizontal-scroller .product-card-compact, .horizontal-scroller .fast-card {
            flex: 0 0 ${land.card_custom_width}px !important;
            width: ${land.card_custom_width}px !important;
          }
        ` : ""}
      }
    `;
  }
  applyMarketingWidgets(m) {
    const wa = m.whatsapp_floating;
    let waBtn = document.getElementById("storefront-floating-whatsapp");
    if (wa && wa.enabled && wa.phone) {
      if (!waBtn) {
        waBtn = document.createElement("a");
        waBtn.id = "storefront-floating-whatsapp";
        waBtn.target = "_blank";
        waBtn.rel = "noopener noreferrer";
        waBtn.style.cssText = `
          position: fixed;
          bottom: 85px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #25D366;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          box-shadow: 0 4px 18px rgba(37, 211, 102, 0.4);
          z-index: 999;
          text-decoration: none;
        `;
        document.body.appendChild(waBtn);
      }
      const cleanPhone = wa.phone.replace(/[^0-9]/g, "");
      waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("\u0645\u0631\u062D\u0628\u0627\u064B\u060C \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0628\u062E\u0635\u0648\u0635 \u0627\u0644\u0645\u062A\u062C\u0631")}`;
      if (wa.position === "right") {
        waBtn.style.right = "20px";
        waBtn.style.left = "auto";
      } else {
        waBtn.style.left = "20px";
        waBtn.style.right = "auto";
      }
      waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
      waBtn.style.display = "flex";
    } else if (waBtn) {
      waBtn.style.display = "none";
    }
  }
  setupPostMessageListener() {
    window.addEventListener("message", (event) => {
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type === "NALSH_CONFIG_UPDATE" || event.data.type === "NALSH_THEME_UPDATE") {
        this.applyConfig(event.data.config);
      } else if (event.data.type === "NALSH_TOGGLE_DARK_MODE") {
        const isDark = !!event.data.darkMode;
        document.documentElement.classList.toggle("dark-mode", isDark);
        if (this.currentConfig) {
          this.applyColorTokens(this.currentConfig);
        }
      }
    });
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "NALSH_IFRAME_READY" }, "*");
    }
  }
  setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "attributes" && m.attributeName === "class") {
          if (this.currentConfig) {
            this.applyColorTokens(this.currentConfig);
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }
  async loadInitial() {
    const keys = [
      "nalsh_storefront_config",
      "nalsh_storefront_config_store",
      "nalsh_storefront_config_merchant",
      "nalsh_storefront_config_v2",
      "nalsh_theme_config"
    ];
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get("store");
    const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    const storeFromPath = pathParts.length > 0 && !["", "index.html", "store-builder.html", "login.html"].includes(pathParts[0].toLowerCase()) ? pathParts[0] : null;
    const targetStore = (storeParam || storeFromPath || "").toLowerCase();
    const freshFromCloud = await this._syncFromCloud(targetStore, true).catch(() => void 0);
    if (freshFromCloud) {
      return;
    }
    try {
      const res = await fetch("theme-config.json?v=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === "object" && json.version) {
          this.applyConfig(json);
          return;
        }
      }
    } catch (e) {
    }
    if (targetStore) {
      const saved = localStorage.getItem(`nalsh_storefront_config_${targetStore}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.applyConfig(parsed);
          return;
        } catch {
        }
      }
    }
    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.applyConfig(parsed);
          return;
        } catch {
        }
      }
    }
  }
  async _syncFromCloud(targetStore, preferLatest = false) {
    try {
      const payload = { action: "get_storefront_config" };
      if (targetStore) payload.username = targetStore;
      const res = await fetch(WORKER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: preferLatest ? "no-store" : "default"
      });
      if (!res.ok) return false;
      const json = await res.json().catch(() => null);
      const cfg = json?.data?.config || json?.config || (json?.version ? json : null);
      if (!cfg || typeof cfg !== "object" || !cfg.version) return false;
      try {
        const storeKey = targetStore ? `nalsh_storefront_config_${targetStore}` : "nalsh_storefront_config";
        localStorage.setItem(storeKey, JSON.stringify(cfg));
        localStorage.setItem("nalsh_storefront_config", JSON.stringify(cfg));
      } catch (e) {
      }
      this.applyConfig(cfg);
      return true;
    } catch (err) {
      return false;
    }
  }
};
var themeEngine = ThemeEngine.getInstance();

// src/components/ProductCard.ts
var ProductCard = class {
  static escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static escapeJsAttr(str) {
    if (!str) return "";
    return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, " ");
  }
  static parsePrice(p) {
    let orig = parseFloat(p.price) || 0;
    let disc = parseFloat(p.discount) || 0;
    let curr = disc > 0 ? orig * (1 - disc / 100) : orig;
    if (p.original_price !== void 0) orig = parseFloat(p.original_price);
    if (p.current_price !== void 0) curr = parseFloat(p.current_price);
    if (p.old_price !== void 0 && p.old_price > p.price) {
      orig = parseFloat(p.old_price);
      disc = Math.round((orig - p.price) / orig * 100);
      curr = p.price;
    }
    return { current: curr, original: orig, discount: disc };
  }
  static formatPrice(amount) {
    const currency = state.config?.store_identity?.currency_symbol || "\u0631.\u064A";
    return `${Number(amount || 0).toLocaleString()} ${currency}`;
  }
  static getOptimizedImageUrl(src) {
    if (!src || src.trim() === "") return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    if (src.startsWith("data:") || src.startsWith("http://localhost") || src.startsWith("blob:")) return src;
    return src;
  }
  static render(product, options = {}) {
    const isFav = state.isFavorite(product.id);
    const priceInfo = this.parsePrice(product);
    const isOutOfStock = product.is_out_of_stock || product.stock !== void 0 && product.stock <= 0;
    const rawImg = product.image || product.image_url || product.img || "";
    const imgUrl = this.getOptimizedImageUrl(rawImg);
    const name = this.escapeHTML(product.name);
    const catName = this.escapeHTML(product.category || product.leaf_category || "\u0639\u0627\u0645");
    const merchantName = this.escapeHTML(product.merchant_name || product.store_name || "");
    const rating = product.rating || product.rating_avg || 4.9;
    return `
      <div class="product-card-compact fast-card ${isOutOfStock ? "out-of-stock" : ""}" data-product-id="${product.id}">
        <div class="compact-img-wrapper" onclick="window.NalshStorefront?.openProductDetails('${product.id}')">
          ${priceInfo.discount > 0 ? `<div class="discount-badge-mini">-${Math.round(priceInfo.discount)}%</div>` : ""}
          ${isOutOfStock ? `<div class="stock-badge-mini">\u0646\u0641\u0630\u062A \u0627\u0644\u0643\u0645\u064A\u0629</div>` : product.badge ? `<div class="discount-badge-mini" style="background:var(--primary);">${this.escapeHTML(product.badge)}</div>` : ""}
          
          <div class="image-container-wrapper">
            <i class="fas fa-image placeholder-icon"></i>
            <img loading="lazy" decoding="async" class="p-img" src="${imgUrl}" alt="${name}" 
                 onload="this.classList.add('loaded'); const p = this.parentElement.querySelector('.placeholder-icon'); if(p) p.style.display='none';" 
                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23f1f5f9\\'/><text x=\\'50%\\' y=\\'50%\\' font-size=\\'16\\' fill=\\'%2394a3b8\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0648\u0631\u0629</text></svg>'">
          </div>

          <div class="card-actions-container">
            <button class="action-btn-mini fav-btn ${isFav ? "active" : ""}" onclick="event.stopPropagation(); window.NalshStorefront?.toggleFavorite('${product.id}', this)" aria-label="\u0627\u0644\u0645\u0641\u0636\u0644\u0629">
              <i class="${isFav ? "fas fa-heart" : "far fa-heart"}"></i>
            </button>
            <button class="action-btn-mini share-btn" onclick="event.stopPropagation(); window.NalshStorefront?.openShareModal('${product.id}')" aria-label="\u0645\u0634\u0627\u0631\u0643\u0629">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        <div class="compact-details" onclick="window.NalshStorefront?.openProductDetails('${product.id}')">
          <div class="meta-row-mini">
            <span class="sc-cat-mini p-cat">${catName}</span>
            ${merchantName ? `<div class="merchant-mini-label p-merchant"><i class="fas fa-store"></i> <span class="m-name">${merchantName}</span></div>` : ""}
          </div>

          <h3 class="p-title">${name}</h3>

          <div class="rating-row-mini">
            <div class="stars-mini">
              <i class="fas fa-star text-amber"></i>
              <span class="rating-val">${rating}</span>
            </div>
          </div>

          <div class="price-row-mini">
            <div class="price-box-mini">
              <span class="p-current-price">${this.formatPrice(priceInfo.current)}</span>
              ${priceInfo.discount > 0 && priceInfo.original > priceInfo.current ? `<span class="modern-price-old-wrapper"><del class="p-old-price">${this.formatPrice(priceInfo.original)}</del></span>` : ""}
            </div>

            ${isOutOfStock ? `<button class="modern-add-cart-btn-mini disabled" disabled><i class="fas fa-ban"></i></button>` : `<button class="modern-add-cart-btn-mini" onclick="event.stopPropagation(); window.NalshStorefront?.quickAddToCart('${product.id}')" aria-label="\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629">
                    <i class="fas fa-plus"></i>
                  </button>`}
          </div>
        </div>
      </div>
    `;
  }
};

// src/components/AIChatbot.ts
var AIChatbot = class {
  static modalEl = null;
  static messages = [];
  static isInitialized = false;
  static getAssistantConfig() {
    return {
      enabled: true,
      name: "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634",
      persona: "classic",
      avatar_icon: "fa-robot",
      avatar_emoji: "",
      button_style: "pill",
      position: "bottom-right",
      response_style: "friendly",
      accent_color: "#5D646D",
      status_text: "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A",
      enable_quick_actions: true,
      smart_contextual_actions: true,
      smart_contextual_replies: true,
      quick_actions: ["\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629", "\u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F", "\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A"],
      ...state.config?.messages?.ai_assistant || {}
    };
  }
  static getPageContextInfo() {
    const cartCount = Array.isArray(state.cart?.items) ? state.cart.items.length : 0;
    const path = (window.location.pathname || "").toLowerCase();
    const hasCart = cartCount > 0 || /cart|basket|سلة/.test(path);
    const isProductPage = /product|details|منتج/.test(path);
    const isCheckoutPage = /checkout|payment|الدفع|طلب/.test(path);
    if (hasCart) return { hasCart: true, isProductPage: false, isCheckoutPage: false, pathLabel: "\u0627\u0644\u0633\u0644\u0629" };
    if (isCheckoutPage) return { hasCart: false, isProductPage: false, isCheckoutPage: true, pathLabel: "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628" };
    if (isProductPage) return { hasCart: false, isProductPage: true, isCheckoutPage: false, pathLabel: "\u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0646\u062A\u062C" };
    return { hasCart: false, isProductPage: false, isCheckoutPage: false, pathLabel: "\u0627\u0644\u0645\u062A\u062C\u0631" };
  }
  static getContextualGreeting() {
    const assistant = this.getAssistantConfig();
    const assistantName = assistant.name || "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634";
    const { hasCart, isProductPage, isCheckoutPage, pathLabel } = this.getPageContextInfo();
    const behaviorMode = assistant.behavior_mode || "support";
    const conversationStyle = assistant.conversation_style || "balanced";
    const shortGreeting = `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0623\u0646\u0627 ${assistantName}. \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u0645\u0633\u0627\u0639\u062F\u062A\u0643\u061F`;
    const salesGreeting = `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0623\u0646\u0627 ${assistantName}\u060C \u0648\u0633\u0623\u0633\u0627\u0639\u062F\u0643 \u0641\u064A \u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0641\u0636\u0644 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0635\u0641\u0642\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0643 \u0627\u0644\u064A\u0648\u0645.`;
    const conciergeGreeting = `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0623\u0646\u0627 ${assistantName}. \u0633\u0623\u0631\u0627\u0641\u0642\u0643 \u0628\u062E\u0637\u0648\u0627\u062A \u0630\u0643\u064A\u0629 \u0645\u0646 \u0627\u0644\u0627\u0633\u062A\u0639\u0631\u0627\u0636 \u0625\u0644\u0649 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644.`;
    const advisorGreeting = `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0623\u0646\u0627 ${assistantName}\u060C \u0648\u0623\u0633\u062A\u0637\u064A\u0639 \u0623\u0646 \u0623\u0642\u062F\u0651\u0645 \u0644\u0643 \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u062F\u0642\u064A\u0642\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0645\u0627 \u062A\u0631\u0627\u0647 \u0627\u0644\u0622\u0646.`;
    if (assistant.smart_contextual_replies === false) {
      return state.config?.messages?.chatbot_greeting || (conversationStyle === "short" ? shortGreeting : salesGreeting);
    }
    if (hasCart) {
      const base = behaviorMode === "sales" ? salesGreeting : behaviorMode === "concierge" ? conciergeGreeting : advisorGreeting;
      return `${base} \u0623\u0631\u0649 \u0623\u0646\u0643 \u0641\u064A ${pathLabel} \u0627\u0644\u0622\u0646\u060C \u0648\u0623\u0646\u0627 \u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0628\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0628\u0633\u0631\u0639\u0629 \u0648\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644. \u{1F6D2}`;
    }
    if (isProductPage) {
      const base = behaviorMode === "advisor" ? advisorGreeting : behaviorMode === "sales" ? salesGreeting : conciergeGreeting;
      return `${base} \u0623\u0646\u062A \u0627\u0644\u0622\u0646 \u0641\u064A ${pathLabel}\u060C \u0648\u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0623\u0648 \u0627\u0642\u062A\u0631\u0627\u062D \u0623\u0641\u0636\u0644 \u0645\u0646\u062A\u062C \u064A\u0646\u0627\u0633\u0628\u0643.`;
    }
    if (isCheckoutPage) {
      const base = behaviorMode === "concierge" ? conciergeGreeting : behaviorMode === "sales" ? salesGreeting : advisorGreeting;
      return `${base} \u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628\u060C \u0627\u062E\u062A\u064A\u0627\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639\u060C \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0634\u062D\u0646\u0629 \u0641\u064A \u0623\u0633\u0631\u0639 \u0648\u0642\u062A.`;
    }
    const baseGreeting = behaviorMode === "sales" ? salesGreeting : behaviorMode === "concierge" ? conciergeGreeting : behaviorMode === "advisor" ? advisorGreeting : shortGreeting;
    return `${baseGreeting} \u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0627\u0644\u064A\u0648\u0645 \u0641\u064A \u0627\u0644\u0639\u0631\u0648\u0636\u060C \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0623\u0648 \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062F\u0627\u062E\u0644 ${pathLabel}.`;
  }
  static getContextualQuickActions(customActions = []) {
    const assistant = this.getAssistantConfig();
    const { hasCart, isProductPage, isCheckoutPage } = this.getPageContextInfo();
    const contextActions = [];
    if (hasCart) {
      contextActions.push("\u0623\u0631\u0646\u064A \u0627\u0644\u0633\u0644\u0629 \u0648\u0623\u0643\u0645\u0644 \u0637\u0644\u0628\u064A");
      contextActions.push("\u0647\u0644 \u0647\u0646\u0627\u0643 \u062E\u0635\u0645 \u0639\u0644\u0649 \u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0633\u0644\u0629\u061F");
      contextActions.push("\u0623\u062D\u062A\u0627\u062C \u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639 \u0625\u0644\u0649 \u0639\u0646\u0648\u0627\u0646\u064A");
    } else if (isProductPage) {
      contextActions.push("\u0642\u0627\u0631\u0646 \u0628\u064A\u0646 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u0627\u0644\u0628\u062F\u0627\u0626\u0644");
      contextActions.push("\u0623\u0631\u0646\u064A \u0623\u0641\u0636\u0644 \u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629");
      contextActions.push("\u0623\u062D\u062A\u0627\u062C \u0648\u0635\u0641\u0627\u064B \u062A\u0641\u0635\u064A\u0644\u064A\u0627\u064B \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C");
    } else if (isCheckoutPage) {
      contextActions.push("\u0623\u0631\u0646\u064A \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u062A\u0627\u062D\u0629");
      contextActions.push("\u0643\u064A\u0641 \u0623\u062A\u0627\u0628\u0639 \u0637\u0644\u0628\u064A\u061F");
      contextActions.push("\u0647\u0644 \u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0637\u0644\u0628\u061F");
    } else {
      contextActions.push("\u0623\u0631\u0646\u064A \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062D\u0627\u0644\u064A\u0629");
      contextActions.push("\u0623\u062D\u062A\u0627\u062C \u0627\u0642\u062A\u0631\u0627\u062D \u0645\u0646\u062A\u062C \u062D\u0633\u0628 \u0645\u064A\u0632\u0627\u0646\u062A\u064A");
      contextActions.push("\u0643\u064A\u0641 \u0623\u0637\u0644\u0628 \u0648\u0627\u0633\u062A\u0644\u0645 \u0637\u0644\u0628\u064A\u061F");
    }
    const allActions = assistant.smart_contextual_actions === false ? customActions : [...customActions || [], ...contextActions];
    const uniqueActions = [];
    for (const action of allActions) {
      const clean = (action || "").trim();
      if (!clean) continue;
      if (!uniqueActions.includes(clean)) uniqueActions.push(clean);
    }
    return uniqueActions.slice(0, 4);
  }
  static getAssistantAccent() {
    const assistant = this.getAssistantConfig();
    return assistant.accent_color || {
      classic: "#4F46E5",
      premium: "#8B5CF6",
      futuristic: "#06B6D4",
      luxury: "#B45309",
      fashion: "#EC4899",
      tech: "#22C55E",
      wellness: "#14B8A6",
      beauty: "#F472B6"
    }[assistant.persona] || "#4F46E5";
  }
  static getAssistantVisualMode() {
    const assistant = this.getAssistantConfig();
    return assistant.avatar_style || (assistant.persona === "luxury" ? "halo" : assistant.persona === "futuristic" ? "orb" : assistant.persona === "fashion" ? "hover" : "pulse");
  }
  static getPageContextText() {
    const path = window.location.pathname || "";
    const cartCount = Array.isArray(state.cart?.items) ? state.cart.items.length : 0;
    if (/cart|basket|سلة/.test(path) || cartCount > 0) return "\u0641\u064A \u0627\u0644\u0633\u0644\u0629";
    if (/product|product-details|منتج|details/.test(path)) return "\u0641\u064A \u0635\u0641\u062D\u0629 \u0627\u0644\u0645\u0646\u062A\u062C";
    if (/checkout|payment|الدفع|طلب/.test(path)) return "\u0641\u064A \u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u0637\u0644\u0628";
    return "\u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631";
  }
  static getSmartFallbackReply(text) {
    const normalized = (text || "").toLowerCase();
    const catalog = Array.isArray(state.products) ? state.products.slice() : [];
    const pickProducts = catalog.slice().sort((a, b) => Number(b?.discount || 0) - Number(a?.discount || 0)).slice(0, 3);
    const assistant = this.getAssistantConfig();
    const storeName = state.config?.store_identity?.store_name || "\u0645\u062A\u062C\u0631\u0646\u0627";
    const assistantName = assistant.name || "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634";
    const behaviorMode = assistant.behavior_mode || "support";
    const conversationStyle = assistant.conversation_style || "balanced";
    const shortReply = (msg) => conversationStyle === "short" ? msg : msg;
    const { hasCart, isProductPage, isCheckoutPage } = this.getPageContextInfo();
    const salesBoost = behaviorMode === "sales" ? "\u0633\u0623\u0642\u062A\u0631\u062D \u0644\u0643 \u0627\u0644\u0623\u0641\u0636\u0644 \u062D\u0633\u0628 \u0627\u0644\u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0648\u0627\u0644\u0637\u0644\u0628." : behaviorMode === "concierge" ? "\u0633\u0623\u0631\u0627\u0641\u0642\u0643 \u0628\u062E\u0637\u0648\u0627\u062A \u0633\u0647\u0644\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629." : "\u0633\u0623\u0639\u0637\u064A\u0643 \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u062F\u0642\u064A\u0642\u0629 \u0648\u0645\u0641\u064A\u062F\u0629.";
    if (hasCart && /عرض|عروض|خصم|تخفيض|sale|offer/.test(normalized)) {
      return {
        reply: `${assistantName} \u0623\u0631\u0649 \u0623\u0646 \u0644\u062F\u064A\u0643 \u0639\u0646\u0627\u0635\u0631 \u0641\u064A \u0627\u0644\u0633\u0644\u0629\u060C ${salesBoost} \u0648\u064A\u0645\u0643\u0646\u0646\u064A \u0623\u0646 \u0623\u0633\u0627\u0639\u062F\u0643 \u0628\u0625\u0636\u0627\u0641\u0629 \u062E\u0635\u0645 \u0623\u0648 \u062A\u0648\u062C\u064A\u0647\u0643 \u0644\u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0645\u0627\u062B\u0644\u0629 \u0642\u0628\u0644 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628.`,
        products: pickProducts
      };
    }
    if (isProductPage && /قدمه|اقتراح|اختر|منتج|recommend|product/.test(normalized)) {
      return {
        reply: `${assistantName} \u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0642\u0627\u0631\u0646\u0629 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C \u0645\u0639 \u0627\u0644\u0628\u062F\u0627\u0626\u0644 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0623\u0641\u0636\u0644 \u062D\u0633\u0628 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u062C\u0648\u062F\u0629 ${salesBoost}`,
        products: pickProducts
      };
    }
    if (isCheckoutPage && /دفع|payment|بطاقة|كاش|باي/.test(normalized)) {
      return {
        reply: `\u0623\u0633\u062A\u0637\u064A\u0639 \u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0627\u062E\u062A\u064A\u0627\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643\u060C ${salesBoost} \u0645\u0639 \u062A\u0648\u0636\u064A\u062D \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0623\u0648 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0642\u0628\u0644 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628.`,
        products: []
      };
    }
    if (/عرض|عروض|خصم|تخفيض|sale|offer/.test(normalized)) {
      return {
        reply: `${assistantName} \u064A\u0648\u0635\u064A\u0643 \u0628\u062A\u0635\u0641\u062D \u0623\u062D\u062F\u062B \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0641\u064A ${storeName}. \u0623\u0633\u062A\u0637\u064A\u0639 \u0623\u0646 \u0623\u0638\u0647\u0631 \u0644\u0643 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0630\u0627\u062A \u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u0639\u0627\u0644\u064A \u0641\u0648\u0631\u0627\u064B.`,
        products: pickProducts
      };
    }
    if (/توصيل|شحن|استلام|delivery|shipping/.test(normalized)) {
      return {
        reply: "\u0646\u0648\u0641\u0631 \u062A\u0648\u0635\u064A\u0644 \u0633\u0631\u064A\u0639 \u0625\u0644\u0649 \u0645\u0639\u0638\u0645 \u0627\u0644\u0645\u0646\u0627\u0637\u0642\u060C \u0645\u0639 \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0648\u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u0645\u0648\u062B\u0648\u0642.",
        products: pickProducts
      };
    }
    if (/دفع|payment|بطاقة|كاش|باي/.test(normalized)) {
      return {
        reply: "\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062F\u0641\u0639 \u0628\u0633\u0647\u0648\u0644\u0629 \u0639\u0628\u0631 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0628\u0646\u0643\u064A\u0629\u060C \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645\u060C \u0623\u0648 \u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631.",
        products: pickProducts
      };
    }
    if (/تتبع|طلب|order|tracking/.test(normalized)) {
      return {
        reply: "\u064A\u0645\u0643\u0646\u0643 \u0645\u062A\u0627\u0628\u0639\u0629 \u0637\u0644\u0628\u0643 \u0645\u0646 \u0642\u0633\u0645 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u062A\u062C\u0631\u060C \u0623\u0648 \u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646 \u062D\u0627\u0644\u062A\u0647 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644.",
        products: []
      };
    }
    if (/قدمه|اقتراح|اختر|منتج|recommend|product/.test(normalized)) {
      return {
        reply: `${assistantName} \u064A\u0645\u0643\u0646\u0647 \u0627\u0642\u062A\u0631\u0627\u062D \u0623\u0641\u0636\u0644 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u062D\u0633\u0628 \u0645\u064A\u0632\u0627\u0646\u064A\u062A\u0643 \u0648\u0623\u0633\u0644\u0648\u0628\u0643\u060C \u0648\u0623\u0646\u0627 \u0623\u0633\u062A\u0637\u064A\u0639 \u0623\u0646 \u0623\u0628\u062F\u0623 \u0628\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u0622\u0646.`,
        products: pickProducts
      };
    }
    if (/استرجاع|ارجاع|إرجاع|refund|return/.test(normalized)) {
      return {
        reply: "\u062A\u0648\u062C\u062F \u0633\u064A\u0627\u0633\u0629 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0648\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0645\u0646\u0627\u0633\u0628\u0629 \u0648\u0641\u0642 \u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631\u060C \u0648\u064A\u0645\u0643\u0646\u0646\u064A \u062A\u0648\u0636\u064A\u062D \u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0628\u062F\u0642\u0629 \u0639\u0646\u062F \u0631\u063A\u0628\u062A\u0643.",
        products: []
      };
    }
    const contextualPrefix = hasCart ? "\u0623\u0631\u0649 \u0623\u0646 \u0644\u062F\u064A\u0643 \u0639\u0646\u0627\u0635\u0631 \u0641\u064A \u0627\u0644\u0633\u0644\u0629\u060C " : isProductPage ? "\u0623\u0646\u062A \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0635\u0641\u062D\u0629 \u0645\u0646\u062A\u062C\u060C " : isCheckoutPage ? "\u0623\u0646\u062A \u0641\u064A \u0645\u0631\u062D\u0644\u0629 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628\u060C " : "";
    return {
      reply: `${contextualPrefix}${assistantName} \u0647\u0646\u0627 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0627\u0644\u062A\u0633\u0648\u0642\u060C \u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\u060C \u0623\u0648 \u0645\u0639\u0631\u0641\u0629 \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0641\u064A ${storeName}. \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u062E\u062F\u0645\u062A\u0643\u061F`,
      products: pickProducts
    };
  }
  static refresh() {
    this.isInitialized = false;
    this.init();
  }
  static init() {
    const assistant = this.getAssistantConfig();
    if (this.isInitialized && document.getElementById("ai-chatbot-floating-btn")) {
      this.isInitialized = true;
      this.render();
      return;
    }
    this.isInitialized = true;
    if (assistant.enabled === false) {
      const existingBtn = document.getElementById("ai-chatbot-floating-btn");
      if (existingBtn) existingBtn.remove();
      if (this.modalEl) this.modalEl.remove();
      this.modalEl = null;
      return;
    }
    const assistantName = assistant.name || "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634";
    const position = assistant.position === "bottom-left" ? "left" : "right";
    const buttonStyle = assistant.button_style || "pill";
    const visualMode = this.getAssistantVisualMode();
    let floatBtn = document.getElementById("ai-chatbot-floating-btn");
    if (!floatBtn) {
      floatBtn = document.createElement("button");
      floatBtn.id = "ai-chatbot-floating-btn";
      floatBtn.className = `ai-chatbot-fab ${buttonStyle} ${position} ${visualMode}`;
      floatBtn.setAttribute("aria-label", assistantName);
      floatBtn.style.background = `linear-gradient(135deg, ${this.getAssistantAccent()}, ${assistant.accent_color || "#4F46E5"})`;
      floatBtn.style.boxShadow = `0 12px 28px ${assistant.accent_color || "#4F46E5"}55`;
      floatBtn.innerHTML = `
        <div class="ai-fab-icon">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
        <span class="ai-fab-text">${assistantName}</span>
      `;
      floatBtn.onclick = () => this.toggle();
      document.body.appendChild(floatBtn);
    } else {
      floatBtn.className = `ai-chatbot-fab ${buttonStyle} ${position} ${visualMode}`;
      floatBtn.setAttribute("aria-label", assistantName);
      floatBtn.style.background = `linear-gradient(135deg, ${this.getAssistantAccent()}, ${assistant.accent_color || "#4F46E5"})`;
      floatBtn.style.boxShadow = `0 12px 28px ${assistant.accent_color || "#4F46E5"}55`;
      floatBtn.innerHTML = `
        <div class="ai-fab-icon">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
        <span class="ai-fab-text">${assistantName}</span>
      `;
      floatBtn.onclick = () => this.toggle();
    }
    const greeting = this.getContextualGreeting();
    this.messages = [
      {
        id: "msg_0",
        sender: "assistant",
        text: greeting,
        timestamp: Date.now()
      }
    ];
  }
  static toggle() {
    if (this.getAssistantConfig().enabled === false) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
  static isOpen() {
    return !!this.modalEl?.classList.contains("open");
  }
  static open() {
    if (this.getAssistantConfig().enabled === false) return;
    if (!this.modalEl) {
      this.modalEl = document.createElement("div");
      this.modalEl.id = "ai-chatbot-modal";
      this.modalEl.className = "ai-chat-window";
      document.body.appendChild(this.modalEl);
    }
    this.render();
    this.modalEl.classList.add("open");
    const input = document.getElementById("ai-chat-input");
    if (input) input.focus();
  }
  static render() {
    if (!this.modalEl) return;
    const assistant = this.getAssistantConfig();
    const assistantName = assistant.name || "\u0645\u0633\u0627\u0639\u062F \u0646\u0627\u0644\u0634";
    const quickActions = this.getContextualQuickActions(
      Array.isArray(assistant.quick_actions) && assistant.quick_actions.length ? assistant.quick_actions : ["\u0623\u0631\u064A\u062F \u0623\u0641\u0636\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u0627\u062D\u0629", "\u0643\u064A\u0641 \u0623\u0642\u0648\u0645 \u0628\u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644\u061F", "\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u064A"]
    );
    const accentColor = this.getAssistantAccent();
    const statusText = assistant.status_text || "\u0645\u062A\u0635\u0644 \u0644\u0644\u0631\u062F \u0627\u0644\u0641\u0648\u0631\u064A";
    if (assistant.position === "bottom-left") {
      this.modalEl.style.left = "16px";
      this.modalEl.style.right = "auto";
    } else {
      this.modalEl.style.left = "auto";
      this.modalEl.style.right = "16px";
    }
    this.modalEl.style.setProperty("--ai-accent", accentColor);
    this.modalEl.innerHTML = `
      <div class="ai-chat-header" style="background: linear-gradient(135deg, ${accentColor}, ${assistant.accent_color || accentColor});">
        <div class="ai-header-info">
          <div class="ai-avatar" style="background: rgba(255,255,255,0.2);">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
          <div>
            <h4>${assistantName}</h4>
            <span class="ai-status-dot"></span> <span class="ai-status-txt">${statusText}</span>
          </div>
        </div>
        <button class="ai-close-btn" onclick="window.NalshStorefront?.closeChatbot()" aria-label="\u0625\u063A\u0644\u0627\u0642">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="ai-chat-messages" id="ai-messages-container">
        ${this.messages.map(
      (msg) => `
          <div class="ai-msg ${msg.sender}">
            <div class="ai-msg-bubble">
              <p>${ProductCard.escapeHTML(msg.text)}</p>
              ${msg.products && msg.products.length > 0 ? `
                <div class="ai-msg-products" style="display:flex; gap:8px; overflow-x:auto; margin-top:8px; padding-bottom:4px;">
                  ${msg.products.map((p) => ProductCard.render(p, { compact: true })).join("")}
                </div>
              ` : ""}
            </div>
          </div>
        `
    ).join("")}
      </div>

      ${assistant.enable_quick_actions !== false ? `
      <div class="ai-suggestions-row">
        ${quickActions.slice(0, 3).map((action) => `
          <button class="ai-sug-chip" onclick="window.NalshStorefront?.sendChatbotPrompt('${ProductCard.escapeHTML(action).replace(/'/g, "\\'")}')">${action.length > 18 ? action.slice(0, 18) + "\u2026" : action}</button>
        `).join("")}
      </div>
      ` : ""}

      <div class="ai-chat-input-bar">
        <input type="text" id="ai-chat-input" placeholder="\u0627\u0643\u062A\u0628 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0643 \u0647\u0646\u0627..." onkeydown="if(event.key==='Enter') window.NalshStorefront?.sendChatbotMessage()">
        <button class="ai-send-btn" onclick="window.NalshStorefront?.sendChatbotMessage()" aria-label="\u0625\u0631\u0633\u0627\u0644">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;
    this.scrollToBottom();
  }
  static scrollToBottom() {
    requestAnimationFrame(() => {
      const container = document.getElementById("ai-messages-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
  static async sendMessage(textOverride) {
    const input = document.getElementById("ai-chat-input");
    const text = (textOverride || input?.value || "").trim();
    if (!text) return;
    if (input) input.value = "";
    this.messages.push({
      id: "msg_" + Date.now(),
      sender: "user",
      text,
      timestamp: Date.now()
    });
    this.render();
    try {
      const response = await api("ai_chat", { message: text, store_id: state.storeId }, { silent: true });
      const reply = response?.reply || response?.message || "\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0648\u0627\u0635\u0644\u0643! \u0643\u064A\u0641 \u064A\u0645\u0643\u0646\u0646\u064A \u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629\u061F";
      const products = response?.products || [];
      this.messages.push({
        id: "msg_" + (Date.now() + 1),
        sender: "assistant",
        text: reply,
        products,
        timestamp: Date.now()
      });
    } catch {
      const fallback = this.getSmartFallbackReply(text);
      this.messages.push({
        id: "msg_" + (Date.now() + 1),
        sender: "assistant",
        text: fallback.reply,
        products: fallback.products,
        timestamp: Date.now()
      });
    }
    this.render();
  }
  static close() {
    if (this.modalEl) {
      this.modalEl.classList.remove("open");
    }
  }
};

// src/main.ts
var tryInit = (retries = 0) => {
  if (typeof window.bootJAMstack === "function") {
    bootNalshBridge();
  } else if (retries < 30) {
    setTimeout(() => tryInit(retries + 1), 200);
  }
};
function bootNalshBridge() {
  console.log("\u26A1 [Nalsh TS Bridge] Initializing...");
  loadInitialTheme();
  bindStudioSync();
  syncDarkMode();
  exposeStorefrontCompatAPI();
  AIChatbot.init();
  events.on("config:updated", () => {
    AIChatbot.refresh();
  });
  console.log("\u2705 [Nalsh TS Bridge] Ready \u2014 all original JS features active.");
}
function loadInitialTheme() {
  try {
    themeEngine.loadInitial();
  } catch (e) {
  }
}
function bindStudioSync() {
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;
    const { type, payload } = event.data;
    switch (type) {
      case "NALSH_CONFIG_UPDATE":
      case "STORE_CONFIG_UPDATED":
      case "NALSH_THEME_UPDATE": {
        const liveConfig = payload || event.data.config;
        if (typeof event.data._preview_dark === "boolean") {
          const isDark = event.data._preview_dark;
          document.documentElement.classList.toggle("dark-mode", isDark);
          if (document.body) document.body.classList.toggle("dark-mode", isDark);
        }
        if (liveConfig) {
          themeEngine.applyConfig(liveConfig);
          window.currentStorefrontConfig = liveConfig;
          if (typeof window.initStorefront === "function") {
            window.initStorefront(liveConfig);
          } else if (typeof window.HomeUI?.applyLiveConfig === "function") {
            window.HomeUI.applyLiveConfig(liveConfig);
          }
          try {
            localStorage.setItem("nalsh_storefront_config", JSON.stringify(liveConfig));
          } catch (e) {
          }
        }
        break;
      }
      case "NALSH_TOGGLE_DARK_MODE": {
        const isDark = typeof event.data.darkMode === "boolean" ? event.data.darkMode : typeof payload?.darkMode === "boolean" ? payload.darkMode : !document.documentElement.classList.contains("dark-mode");
        document.documentElement.classList.toggle("dark-mode", isDark);
        if (document.body) document.body.classList.toggle("dark-mode", isDark);
        try {
          localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
        } catch (e) {
        }
        if (window.StorefrontEngine?.reapplyActiveMode) {
          window.StorefrontEngine.reapplyActiveMode();
        }
        break;
      }
      case "PREVIEW_PRODUCT":
        if (payload?.id && typeof window.toggleProductModal === "function") {
          const prod = (window.allProducts || []).find(
            (p) => String(p.id) === String(payload.id)
          );
          if (prod) window.toggleProductModal(true, prod);
        }
        break;
      default:
        break;
    }
  });
}
function syncDarkMode() {
  const isStudio = window.location.search.includes("preview=studio") || window.self !== window.top;
  if (isStudio) return;
  const pref = localStorage.getItem("darkMode");
  if (pref === "enabled") {
    document.documentElement.classList.add("dark-mode");
  } else if (pref === "disabled") {
    document.documentElement.classList.remove("dark-mode");
  }
}
function exposeStorefrontCompatAPI() {
  if (!window.StorefrontEngine) {
    window.StorefrontEngine = {
      init: (cfg) => themeEngine.applyConfig(cfg),
      getConfig: () => window.currentStorefrontConfig || null
    };
  }
  events.on("config:updated", (cfg) => {
    window.currentStorefrontConfig = cfg;
    if (typeof window.HomeUI?.applyLiveConfig === "function") {
      window.HomeUI.applyLiveConfig(cfg);
    }
    AIChatbot.refresh();
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => tryInit());
} else {
  tryInit();
}
