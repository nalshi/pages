/**
 * ========================================================
 * 🎨 Nalsh Storefront Dynamic Rendering & Theme Engine v4.0
 * المحرك المركزي الشامل لربط وتطبيق كافة خصائص وإعدادات
 * استوديو مصمم المتجر (store-builder.html) وملف theme-config.json
 * ========================================================
 */

(function () {
  'use strict';

  let currentStorefrontConfig = null;

  function resolveWorkerApiUrl() {
    const configured = window.WORKER_API_URL || window.CF_WORKER_URL || window.CLOUDFLARE_WORKER_URL;
    if (configured) {
      const value = String(configured).trim();
      if (value === '/api/worker' || value === '/api/worker/') return '/api/worker/';
      if (value.includes('://')) {
        const normalized = value.replace(/\/$/, '');
        return normalized.endsWith('/api/worker') ? normalized + '/' : normalized + '/api/worker/';
      }
      return value.endsWith('/') ? value : value + '/';
    }
    return '/api/worker/';
  }

  // دالة تحويل HEX إلى RGBA لحساب التوهج والشفافية
  function hexToRgba(hex, alpha = 0.25) {
    if (!hex || typeof hex !== 'string') return `rgba(99, 102, 241, ${alpha})`;
    let cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return `rgba(99, 102, 241, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // تحميل الخطوط تلقائياً من Google Fonts
  function loadGoogleFont(fontFamily) {
    if (!fontFamily || fontFamily === 'inherit' || fontFamily === 'system-ui') return;
    const fontId = `google-font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;

    const fontMap = {
      'Tajawal': 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap',
      'Cairo': 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
      'Almarai': 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap',
      'IBM Plex Sans Arabic': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
      'Readex Pro': 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap',
      'Alexandria': 'https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;800;900&display=swap',
      'Noto Kufi Arabic': 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;800&display=swap',
      'Changa': 'https://fonts.googleapis.com/css2?family=Changa:wght@400;600;700;800&display=swap',
      'El Messiri': 'https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;600;700;800&display=swap'
    };

    const fontUrl = fontMap[fontFamily] || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800&display=swap`;
    if (fontUrl) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }

  // فحص درجة سطوع اللون (Luminance check) لضمان عدم تسرب ألوان داكنة للوضع الفاتح أو العكس
  function isHexDark(hex) {
    if (!hex || typeof hex !== 'string') return false;
    let c = hex.replace('#', '').trim();
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length !== 6) return false;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 128;
  }

  /**
   * 1. تطبيق ألوان وهوية المتجر (Theme & Design Tokens)
   */
  function applyColorTokens(config = {}) {
    const root = document.documentElement;
    // الاعتماد المباشر على كلاس الـ DOM الفعلي
    const isDark = root.classList.contains('dark-mode');
    
    // استخراج حزمة الألوان النشطة مع الحفاظ على تناسق الوضعين
    const lightColors = config.light_theme?.colors || config.modes?.light?.colors || {};
    const darkColors = config.dark_theme?.colors || config.modes?.dark?.colors || {};
    const activeColors = isDark ? darkColors : lightColors;

    // 1. ألوان الهوية والعلامة (تتبع اللون المخصص من أي وضع)
    const basePrimary = lightColors.primary || '#4F46E5';
    const primary = (isDark ? (darkColors.primary || basePrimary) : basePrimary);
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--primary', primary);

    const primaryHover = activeColors.primary_hover || (isDark ? '#818CF8' : '#4338CA');
    root.style.setProperty('--theme-primary-hover', primaryHover);

    const glow = hexToRgba(primary, isDark ? 0.35 : 0.22);
    root.style.setProperty('--theme-primary-glow', glow);
    root.style.setProperty('--primary-glow', glow);

    const accent = (isDark ? (darkColors.accent || lightColors.accent) : (lightColors.accent || '#14B8A6')) || '#14B8A6';
    root.style.setProperty('--theme-accent', accent);
    root.style.setProperty('--accent', accent);

    const gradStart = activeColors.primary_gradient_start || primary;
    const gradEnd = activeColors.primary_gradient_end || accent;
    const gradient = `linear-gradient(135deg, ${gradStart}, ${gradEnd})`;
    root.style.setProperty('--theme-primary-gradient', gradient);
    root.style.setProperty('--primary-gradient', gradient);

    // 2. خلفيات المتجر والسطوح (استخدام الألوان المحددة مباشرة مع قيم افتراضية متناسقة)
    const defaultDarkBg = '#0B1120';
    const defaultLightBg = '#F8FAFC';
    let bgBody = activeColors.bg_body || (isDark ? defaultDarkBg : defaultLightBg);
    root.style.setProperty('--theme-background', bgBody);
    root.style.setProperty('--bg-body', bgBody);
    if (document.body) {
      document.body.style.backgroundColor = bgBody;
    }

    let bgCard = activeColors.bg_card || activeColors.card_bg || (isDark ? '#151E2E' : '#FFFFFF');
    root.style.setProperty('--theme-card-bg', bgCard);
    root.style.setProperty('--bg-card', bgCard);

    let bgSurface = activeColors.bg_surface || (isDark ? '#1E293B' : '#F1F5F9');
    root.style.setProperty('--theme-surface', bgSurface);

    const border = activeColors.border || activeColors.card_border || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)');
    root.style.setProperty('--theme-border', border);
    root.style.setProperty('--border', border);

    // 3. النصوص والعناوين
    let textMain = activeColors.text_main || activeColors.card_title || (isDark ? '#F8FAFC' : '#0F172A');
    root.style.setProperty('--theme-text-primary', textMain);
    root.style.setProperty('--text-main', textMain);
    if (document.body) {
      document.body.style.color = textMain;
    }

    let textMuted = activeColors.text_muted || (isDark ? '#94A3B8' : '#64748B');
    root.style.setProperty('--theme-text-secondary', textMuted);
    root.style.setProperty('--text-muted', textMuted);

    // 4. الأشرطة والتنقل
    const navBg = activeColors.navbar_bg || activeColors.header_bg || bgCard;
    root.style.setProperty('--theme-navbar-bg', navBg);
    root.style.setProperty('--navbar-bg', navBg);

    const navText = activeColors.navbar_text || activeColors.header_text || textMain;
    root.style.setProperty('--theme-navbar-text', navText);
    root.style.setProperty('--navbar-text', navText);

    const bottomBg = activeColors.bottom_bar_bg || activeColors.bottom_nav_bg || bgCard;
    root.style.setProperty('--theme-bottom-nav-bg', bottomBg);
    root.style.setProperty('--bottom-bar-bg', bottomBg);

    const bottomActive = activeColors.bottom_bar_active || activeColors.bottom_nav_active || primary;
    root.style.setProperty('--theme-bottom-nav-active', bottomActive);
    root.style.setProperty('--bottom-bar-active', bottomActive);

    const bottomInactive = activeColors.bottom_bar_inactive || activeColors.bottom_nav_inactive || (isDark ? '#64748B' : '#94A3B8');
    root.style.setProperty('--theme-bottom-nav-inactive', bottomInactive);
    root.style.setProperty('--bottom-bar-inactive', bottomInactive);

    // 5. البحث وشريحة الفئات (Category Chips & Sub Navbar)
    const searchBg = activeColors.search_bg || bgSurface;
    root.style.setProperty('--theme-search-bg', searchBg);
    root.style.setProperty('--search-bg', searchBg);

    const searchText = activeColors.search_text || textMain;
    root.style.setProperty('--theme-search-text', searchText);

    const chipBg = activeColors.category_chip_bg || bgSurface;
    root.style.setProperty('--theme-cat-chip-bg', chipBg);
    root.style.setProperty('--cat-chip-bg', chipBg);
    root.style.setProperty('--category-chip-bg', chipBg);

    const chipActive = activeColors.category_chip_active || activeColors.category_chip_active_bg || primary;
    root.style.setProperty('--theme-cat-chip-active-bg', chipActive);
    root.style.setProperty('--cat-chip-active', chipActive);
    root.style.setProperty('--category-chip-active', chipActive);

    const chipText = activeColors.category_chip_text || textMain;
    root.style.setProperty('--theme-cat-chip-text', chipText);
    root.style.setProperty('--cat-chip-text', chipText);
    root.style.setProperty('--category-chip-text', chipText);

    // 6. الأسعار، الشارات، والأزرار
    const priceColor = activeColors.price_color || primary;
    root.style.setProperty('--theme-price-color', priceColor);
    root.style.setProperty('--price-color', priceColor);

    const oldPriceColor = activeColors.old_price_color || (isDark ? '#64748B' : '#94A3B8');
    root.style.setProperty('--theme-old-price-color', oldPriceColor);
    root.style.setProperty('--old-price-color', oldPriceColor);

    const badgeBg = activeColors.badge_bg || activeColors.discount_badge_bg || '#EF4444';
    root.style.setProperty('--theme-discount-badge-bg', badgeBg);
    root.style.setProperty('--badge-bg', badgeBg);

    const badgeText = activeColors.badge_text || activeColors.discount_badge_text || '#FFFFFF';
    root.style.setProperty('--theme-discount-badge-text', badgeText);
    root.style.setProperty('--badge-text', badgeText);

    const btnPrimaryBg = activeColors.btn_primary_bg || activeColors.button_primary_bg || primary;
    root.style.setProperty('--theme-btn-primary-bg', btnPrimaryBg);
    root.style.setProperty('--btn-primary-bg', btnPrimaryBg);

    const btnPrimaryText = activeColors.btn_primary_text || '#FFFFFF';
    root.style.setProperty('--theme-btn-primary-text', btnPrimaryText);
    root.style.setProperty('--btn-primary-text', btnPrimaryText);

    const chatbotBtnBg = activeColors.chatbot_btn_bg || primary;
    root.style.setProperty('--theme-chatbot-btn-bg', chatbotBtnBg);
    root.style.setProperty('--chatbot-btn-bg', chatbotBtnBg);

    // 7. النوافذ، السلة، والشيتات (Modals, Cart & Bottom Sheets)
    const modalBg = activeColors.modal_bg || bgCard;
    root.style.setProperty('--theme-modal-bg', modalBg);
    root.style.setProperty('--modal-bg', modalBg);
    root.style.setProperty('--bg-modal', modalBg);

    const modalOverlay = activeColors.modal_overlay || (isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(15, 23, 42, 0.6)');
    root.style.setProperty('--theme-modal-overlay', modalOverlay);
    root.style.setProperty('--modal-overlay', modalOverlay);

    const modalHandle = activeColors.modal_handle || border;
    root.style.setProperty('--theme-modal-handle', modalHandle);
    root.style.setProperty('--modal-handle', modalHandle);

    // 8. الخطوط والأشكال المتجاوبة للجوال والكمبيوتر
    const typo = config.typography || config.design_tokens?.typography || {};
    if (typo.font_family) {
      root.style.setProperty('--theme-font-family', `'${typo.font_family}', sans-serif`);
      loadGoogleFont(typo.font_family);
    }
    
    // حجم الخط الأساسي
    const mobileBase = typo.base_size_mobile || typo.base_size || '15px';
    const desktopBase = typo.base_size_desktop || typo.base_size || '17px';
    root.style.setProperty('--theme-base-size-mobile', mobileBase);
    root.style.setProperty('--theme-base-size-desktop', desktopBase);
    root.style.setProperty('--theme-base-size', desktopBase);

    // حجم خط العناوين
    const mobileHeading = typo.heading_size_mobile || '1.15rem';
    const desktopHeading = typo.heading_size_desktop || '1.45rem';
    root.style.setProperty('--theme-heading-size-mobile', mobileHeading);
    root.style.setProperty('--theme-heading-size-desktop', desktopHeading);

    // حجم خط الأسعار
    const mobilePrice = typo.price_size_mobile || typo.headings?.price_size || '1.1rem';
    const desktopPrice = typo.price_size_desktop || typo.headings?.price_size || '1.25rem';
    root.style.setProperty('--theme-price-size-mobile', mobilePrice);
    root.style.setProperty('--theme-price-size-desktop', desktopPrice);
    root.style.setProperty('--theme-price-font-size', desktopPrice);

    if (typo.heading_weight) {
      root.style.setProperty('--theme-heading-weight', typo.heading_weight);
    }

    const shapes = config.shapes || config.design_tokens?.shapes || {};
    if (shapes.card_radius) {
      root.style.setProperty('--theme-card-radius', shapes.card_radius);
      root.style.setProperty('--radius-xl', shapes.card_radius);
    }
    if (shapes.button_radius) {
      root.style.setProperty('--theme-button-radius', shapes.button_radius);
      root.style.setProperty('--radius-lg', shapes.button_radius);
    }
    if (shapes.button_style === 'pill') {
      root.style.setProperty('--theme-button-radius', '9999px');
    } else if (shapes.button_style === 'flat') {
      root.style.setProperty('--theme-button-radius', '4px');
    }

    if (shapes.card_style) {
      document.body.dataset.cardStyle = shapes.card_style;
    }

    const anim = config.animations || {};
    if (anim.card_hover) {
      document.body.dataset.cardHover = anim.card_hover;
    }

    document.body.classList.add('theme-storefront');
  }

  /**
   * 2. تطبيق هوية المتجر وشريط الإعلانات (Store Identity & Announcement Bar)
   */
  function applyStoreIdentity(identity = {}) {
    if (!identity) return;

    // اسم المتجر
    if (identity.store_name) {
      document.title = identity.store_name;
      const logoSpan = document.getElementById('main-logo-text') || document.querySelector('.logo span') || document.querySelector('.navbar-brand span');
      if (logoSpan) logoSpan.textContent = identity.store_name;

      const profileName = document.querySelector('.dsc-name') || document.querySelector('.ultra-info h1') || document.getElementById('iso-store-title') || document.querySelector('.iso-text-box h1');
      if (profileName) profileName.textContent = identity.store_name;
    }

    // الوصف / الشعار
    if (identity.slogan !== undefined) {
      const bioEl = document.querySelector('.dsc-bio') || document.querySelector('.ultra-info p') || document.querySelector('.iso-text-box p');
      if (bioEl) bioEl.textContent = identity.slogan;
    }

    // رمز العملة
    if (identity.currency_symbol) {
      window.CURRENCY_SYMBOL = identity.currency_symbol;
      document.querySelectorAll('.p-currency').forEach(el => {
        el.textContent = identity.currency_symbol;
      });
    }

    // شريط الإعلانات الترويجي (Announcement Bar)
    const ann = identity.announcement_bar || {};
    let barEl = document.getElementById('storefront-announcement-bar');
    
    if (ann.enabled && ann.text) {
      if (!barEl) {
        barEl = document.createElement('div');
        barEl.id = 'storefront-announcement-bar';
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
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        document.body.insertBefore(barEl, document.body.firstChild);
      }
      barEl.style.background = ann.bg_color || 'var(--theme-primary)';
      barEl.style.color = ann.text_color || '#FFFFFF';
      barEl.innerHTML = `<span>${ann.text}</span>`;
      barEl.style.display = 'flex';

      // ضبط إزاحة الهيدر لعدم التداخل
      const headerContainer = document.querySelector('.header-container');
      if (headerContainer) {
        headerContainer.style.top = '36px';
      }
    } else if (barEl) {
      barEl.style.display = 'none';
      const headerContainer = document.querySelector('.header-container');
      if (headerContainer) headerContainer.style.top = '0';
    }
  }

  /**
   * 3. تطبيق إعدادات المنتجات وعرض الشبكة والأطوال والأعراض (Products Layout & Dimensions)
   */
  function applyProductsSettings(ps = {}) {
    if (!ps) return;

    const port = ps.portrait || {};
    const land = ps.landscape || {};
    const pCols = Number(port.grid_columns || port.items_per_row || 2);
    const lCols = Number(land.grid_columns || land.items_per_row || 4);

    let styleTag = document.getElementById('dynamic-products-layout-css');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-products-layout-css';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      /* 📱 وضع الجوال والشاشات الصغيرة المستقل */
      @media (max-width: 767px) {
        .product-grid, .ultra-product-grid, .store-premium-grid {
          grid-template-columns: repeat(${pCols}, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }

        ${port.card_custom_width > 0 ? `
          .horizontal-scroller .product-card-compact,
          .horizontal-scroller .fast-card {
            flex: 0 0 ${port.card_custom_width}px !important;
            width: ${port.card_custom_width}px !important;
            min-width: ${port.card_custom_width}px !important;
            max-width: ${port.card_custom_width}px !important;
          }
        ` : ''}

        ${port.card_custom_height > 0 ? `
          .product-card-compact, .fast-card {
            height: ${port.card_custom_height}px !important;
            min-height: ${port.card_custom_height}px !important;
          }
        ` : ''}

        ${port.img_custom_height > 0 ? `
          .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-box, .ct-bold-img-wrap, .ct-glass-img-wrap, .ct-mag-image-wrap {
            height: ${port.img_custom_height}px !important;
            aspect-ratio: auto !important;
            padding-top: 0 !important;
          }
        ` : ''}

        ${port.card_orientation === 'landscape' ? `
          .product-card-compact, .fast-card {
            flex-direction: row !important;
            align-items: center !important;
          }
          .compact-img-wrapper {
            width: 110px !important;
            height: 100% !important;
            flex-shrink: 0 !important;
          }
        ` : ''}

        ${port.show_badges === false ? '.discount-badge-mini, .product-badge, .discount-tag, .sale-badge { display: none !important; }' : ''}
        ${port.show_quick_add === false ? '.modern-add-cart-btn-mini, .add-to-cart-quick, .btn-quick-add, .ct-min-btn, .ct-bold-action-btn, .ct-mag-add, .ct-glass-btn { display: none !important; }' : ''}
        ${port.show_rating === false ? '.product-rating, .rating-stars { display: none !important; }' : ''}
        ${port.show_old_price === false ? '.modern-price-old-wrapper, .p-old-price { display: none !important; }' : ''}
      }

      /* 💻 وضع الكمبيوتر والشاشات الكبيرة المستقل */
      @media (min-width: 768px) {
        .product-grid, .ultra-product-grid, .store-premium-grid {
          grid-template-columns: repeat(${lCols}, minmax(0, 1fr)) !important;
          gap: 18px !important;
        }

        ${land.card_custom_width > 0 ? `
          .horizontal-scroller .product-card-compact,
          .horizontal-scroller .fast-card {
            flex: 0 0 ${land.card_custom_width}px !important;
            width: ${land.card_custom_width}px !important;
            min-width: ${land.card_custom_width}px !important;
            max-width: ${land.card_custom_width}px !important;
          }
        ` : ''}

        ${land.card_custom_height > 0 ? `
          .product-card-compact, .fast-card {
            height: ${land.card_custom_height}px !important;
            min-height: ${land.card_custom_height}px !important;
          }
        ` : ''}

        ${land.img_custom_height > 0 ? `
          .compact-img-wrapper, .sic-img-box, .ppc-img-box, .ct-min-img-box, .ct-bold-img-wrap, .ct-glass-img-wrap, .ct-mag-image-wrap {
            height: ${land.img_custom_height}px !important;
            aspect-ratio: auto !important;
            padding-top: 0 !important;
          }
        ` : ''}

        ${land.card_orientation === 'landscape' ? `
          .product-card-compact, .fast-card {
            flex-direction: row !important;
            align-items: center !important;
          }
          .compact-img-wrapper {
            width: 130px !important;
            height: 100% !important;
            flex-shrink: 0 !important;
          }
        ` : ''}

        ${land.show_badges === false ? '.discount-badge-mini, .product-badge, .discount-tag, .sale-badge { display: none !important; }' : ''}
        ${land.show_quick_add === false ? '.modern-add-cart-btn-mini, .add-to-cart-quick, .btn-quick-add { display: none !important; }' : ''}
        ${land.show_rating === false ? '.product-rating, .rating-stars { display: none !important; }' : ''}
        ${land.show_old_price === false ? '.modern-price-old-wrapper, .p-old-price { display: none !important; }' : ''}
      }
    `;
  }

  /**
   * 4. تطبيق الرسائل والنصوص المخصصة (Store Messages)
   */
  function applyStoreMessages(messages = {}) {
    if (!messages) return;

    if (messages.search_placeholder) {
      document.querySelectorAll('.modern-search-input, .search-input, #search-input').forEach(inp => {
        inp.placeholder = messages.search_placeholder;
      });
    }

    if (messages.empty_cart_title || messages.cart_empty_msg) {
      const emptyMsg = messages.empty_cart_title || messages.cart_empty_msg;
      document.querySelectorAll('.empty-cart-text, .cart-empty-message, .empty-cart-state p').forEach(el => {
        el.textContent = emptyMsg;
      });
    }

    if (messages.checkout_btn_label) {
      document.querySelectorAll('.btn-checkout span, #btn-checkout-label, .checkout-btn-text').forEach(el => {
        el.textContent = messages.checkout_btn_label;
      });
    }

    if (messages.chatbot_greeting) {
      const botGreet = document.querySelector('.bot-welcome-msg, .chatbot-initial-msg');
      if (botGreet) botGreet.textContent = messages.chatbot_greeting;
    }
  }

  /**
   * 5. تطبيق تخصيص النوافذ والشيتات (Modals Customization)
   */
  function applyModalsCustomization(mc = {}) {
    if (!mc) return;

    const pd = mc.product_details || {};
    if (pd.cta_button_text) {
      document.querySelectorAll('#add-to-cart-btn span, .btn-add-main span, .modal-add-btn span').forEach(el => {
        el.textContent = pd.cta_button_text;
      });
    }
    if (pd.border_radius) {
      document.documentElement.style.setProperty('--theme-modal-radius', pd.border_radius);
    }

    const cd = mc.cart_drawer || {};
    if (cd.header_title) {
      const cartTitle = document.querySelector('#cart-drawer-title, .cart-header h3, .cart-modal-title');
      if (cartTitle) cartTitle.textContent = cd.header_title;
    }
    if (cd.checkout_btn_text) {
      document.querySelectorAll('.btn-checkout span, #checkout-btn span').forEach(el => {
        el.textContent = cd.checkout_btn_text;
      });
    }
  }

  /**
   * 6. تطبيق أدوات التسويق والعناصر العائمة (Marketing & Floating Buttons)
   */
  function applyMarketingWidgets(m = {}) {
    if (!m) return;

    // زر الواتساب العائم
    const wa = m.whatsapp_floating || {};
    let waBtn = document.getElementById('storefront-floating-whatsapp');

    if (wa.enabled && wa.phone) {
      if (!waBtn) {
        waBtn = document.createElement('a');
        waBtn.id = 'storefront-floating-whatsapp';
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
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
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
        `;
        document.body.appendChild(waBtn);
      }
      const cleanPhone = wa.phone.replace(/[^0-9]/g, '');
      waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('مرحباً، أود الاستفسار بخصوص المتجر')}`;
      if (wa.position === 'right') {
        waBtn.style.right = '20px';
        waBtn.style.left = 'auto';
      } else {
        waBtn.style.left = '20px';
        waBtn.style.right = 'auto';
      }
      waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
      waBtn.style.display = 'flex';
    } else if (waBtn) {
      waBtn.style.display = 'none';
    }

    // شريط الشحن المجاني الترويجي
    const ship = m.free_shipping_bar || {};
    let shipBar = document.getElementById('storefront-shipping-bar');
    if (ship.enabled && ship.message) {
      if (!shipBar) {
        shipBar = document.createElement('div');
        shipBar.id = 'storefront-shipping-bar';
        shipBar.style.cssText = `
          width: 100%;
          padding: 6px 14px;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 700;
          background: var(--theme-accent, #06B6D4);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          z-index: 10000;
        `;
        const annBar = document.getElementById('storefront-announcement-bar');
        if (annBar && annBar.nextSibling) {
          annBar.parentNode.insertBefore(shipBar, annBar.nextSibling);
        } else {
          document.body.insertBefore(shipBar, document.body.firstChild);
        }
      }
      shipBar.innerHTML = `<i class="fas fa-truck-fast"></i> <span>${ship.message}</span>`;
      shipBar.style.display = 'flex';
    } else if (shipBar) {
      shipBar.style.display = 'none';
    }
  }

  /**
   * 7. المحرك الرئيسي لتشغيل الثيم وتطبيقه بالكامل
   */
  window.initStorefront = function (config, storeData = {}) {
    if (!config) return;

    // تعيين الـ config عالمياً فوراً حتى تقرأه js/home.js و js/storefront-engine.js معاً بدون تضارب
    window.currentStorefrontConfig = config;
    currentStorefrontConfig = config;

    // 0. تطبيق الوضع الافتراضي (فاتح / داكن / تلقائي) - لا نعيد تعيين الوضع إذا كنا داخل استوديو المعاينة
    const isStudioPreview = (window.parent && window.parent !== window) || window.location.search.includes('preview=studio');
    if (!isStudioPreview && config.default_theme_mode) {
      const mode = config.default_theme_mode;
      const root = document.documentElement;
      if (mode === 'dark') {
        root.classList.add('dark-mode');
        document.body?.classList.add('dark-mode');
      } else if (mode === 'light') {
        root.classList.remove('dark-mode');
        document.body?.classList.remove('dark-mode');
      } else if (mode === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark-mode', prefersDark);
        document.body?.classList.toggle('dark-mode', prefersDark);
      }
    }

    // 1. تطبيق الألوان والخطوط والأشكال
    applyColorTokens(config);

    // 2. تطبيق هوية المتجر وشريط الإعلانات
    if (config.store_identity) {
      applyStoreIdentity(config.store_identity);
    }

    // 3. تطبيق إعدادات شبكة المنتجات (CSS فقط)
    if (config.products_settings) {
      applyProductsSettings(config.products_settings);
    }

    // 4. تطبيق الرسائل
    if (config.messages || config.store_messages) {
      applyStoreMessages(config.messages || config.store_messages);
    }

    // 5. تطبيق تخصيص النوافذ
    if (config.modals_customization) {
      applyModalsCustomization(config.modals_customization);
    }

    // 6. تطبيق أدوات التسويق والواتساب
    if (config.marketing) {
      applyMarketingWidgets(config.marketing);
    }

    // 7. تحديث نمط العرض الحي في واجهة المتجر (DOM rebuild فقط إذا كانت الواجهة جاهزة ومبنية مسبقاً)
    if (!window.HomeUI?._isRendering && window._homeLayoutRendered && window.HomeUI && typeof window.HomeUI.applyLiveConfig === 'function' && window.HomeUI.storeData) {
      window.HomeUI.applyLiveConfig(config);
    }

    // 8. تطبيق إعدادات التنقل (الشريط السفلي والعلوي)
    if (config.navigation_settings && typeof window.applyNavigationSettings === 'function') {
      window.applyNavigationSettings(config);
    }

    // 9. تطبيق إعدادات المساعد الذكي
    if (typeof window.applyNalshBotConfig === 'function') {
      window.applyNalshBotConfig();
    }
  };

  /**
   * 7. تحميل الإعدادات عند الإقلاع
   */
  async function loadInitialConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    // Template previews are composed by ThemeEngine; prevent the legacy loader
    // from replacing the requested preset with the published store config.
    if (urlParams.has('template_preview') || urlParams.get('local_preview') === '1') {
      return null;
    }
    const storeParam = urlParams.get('store');
    const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const storeFromPath = pathParts.length > 0 && !['', 'index.html', 'store-builder.html', 'login.html'].includes(pathParts[0].toLowerCase()) ? pathParts[0] : null;
    const targetStore = (storeParam || storeFromPath || '').toLowerCase();

    if (!targetStore) return null;

    try {
      const cdnUrl = window.CF_WORKER_URL || 'https://nalsh.dpdns.org';
      const configUrl = `${cdnUrl.replace(/\/$/, '')}/stores/${encodeURIComponent(targetStore)}/storefront_config.json`;
      let config = null;
      try {
        const res = await fetch(`${configUrl}?v=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) config = await res.json();
      } catch (e) {}

      // Fallback 1: استعلام مباشر عبر API في حال لم يتزامن CDN بعد
      if (!config || typeof config !== 'object') {
        try {
          if (typeof window.apiRequest === 'function') {
            const apiRes = await window.apiRequest('get_storefront_config', { username: targetStore }, 'POST', true);
            if (apiRes && apiRes.data?.config) {
              config = apiRes.data.config;
            }
          }
        } catch (e) {}
      }

      // Fallback 2: كاش محلي
      if (!config || typeof config !== 'object') {
        const cached = localStorage.getItem(`nalsh_storefront_config_${targetStore}`);
        if (cached) {
          try { config = JSON.parse(cached); } catch (e) {}
        }
      }

      if (config && typeof config === 'object') {
        localStorage.setItem(`nalsh_storefront_config_${targetStore}`, JSON.stringify(config));
        window.initStorefront(config);
        return config;
      }
      return null;
    } catch (err) {
      console.warn(`[StorefrontEngine] تعذر تحميل إعدادات ${targetStore}.`, err);
      return null;
    }
  }

  /**
   * 8. مراقبة التبديل بين الوضعين الداكن والفاتح
   */
  function observeThemeMode() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          if (currentStorefrontConfig) {
            applyColorTokens(currentStorefrontConfig);
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  /**
   * 9. الاستماع الفوري لرسائل لوحة التحكم واستوديو المصمم (Live Preview Listener)
   */
  window.addEventListener('message', function (event) {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'NALSH_CONFIG_UPDATE' || event.data.type === 'NALSH_THEME_UPDATE' || event.data.type === 'STORE_CONFIG_UPDATED') {
      const liveConfig = event.data.config || event.data.payload;
      if (typeof event.data._preview_dark === 'boolean') {
        const isDark = event.data._preview_dark;
        document.documentElement.classList.toggle('dark-mode', isDark);
        if (document.body) document.body.classList.toggle('dark-mode', isDark);
      }
      if (liveConfig) {
        window.initStorefront(liveConfig);
      }
    } else if (event.data.type === 'NALSH_TOGGLE_DARK_MODE') {
      const isDark = typeof event.data.darkMode === 'boolean'
        ? event.data.darkMode
        : !document.documentElement.classList.contains('dark-mode');
      document.documentElement.classList.toggle('dark-mode', isDark);
      if (document.body) document.body.classList.toggle('dark-mode', isDark);
      try { localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled'); } catch (e) {}
      if (currentStorefrontConfig) {
        applyColorTokens(currentStorefrontConfig);
      }
    }
  });

  // كائن عالمي للمحرك
  window.StorefrontEngine = {
    init: window.initStorefront,
    getConfig: () => currentStorefrontConfig,
    reapplyActiveMode: () => {
      if (currentStorefrontConfig) applyColorTokens(currentStorefrontConfig);
    },
    load: loadInitialConfig
  };

  // إعلام النافذة الأب في حال كان المتجر معروضاً داخل Iframe استوديو المصمم
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'NALSH_IFRAME_READY' }, '*');
  }

  // تشغيل عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadInitialConfig();
      observeThemeMode();
    });
  } else {
    loadInitialConfig();
    observeThemeMode();
  }

})();
