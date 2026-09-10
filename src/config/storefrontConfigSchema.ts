/**
 * ========================================================
 * 🎨 Nalsh Storefront Dynamic Configuration Schema v4.0 (TypeScript)
 * ========================================================
 */

import { StorefrontConfig, ThemePreset } from '../studio/types';
import { DEFAULT_NAV_ITEMS, DEFAULT_TOP_BAR_SETTINGS, normalizeBottomNavItems, normalizeTopBarSettings } from '../studio/navigationDefaults';

export const ALLOWED_FONTS: string[] = [
    'Tajawal',
    'Cairo',
    'Almarai',
    'Readex Pro',
    'Alexandria',
    'IBM Plex Sans Arabic',
    'Noto Kufi Arabic',
    'Changa',
    'El Messiri'
];

export const DEFAULT_STOREFRONT_CONFIG: StorefrontConfig = {
    version: '4.0',
    theme_name: 'nalsh_indigo',
    default_theme_mode: 'light',
    store_identity: {
        store_name: 'متجري الإلكتروني',
        slogan: 'وجهتك الأولى لأرقى المنتجات والخدمات',
        welcome_message: 'أهلاً بكم في متجرنا! نتمنى لكم تجربة تسوق ممتعة.',
        currency_symbol: 'YER',
        announcement_bar: {
            enabled: true,
            text: '🎉 عروض حصرية وتوصيل سريع لكافة المناطق!',
            bg_color: '#4F46E5',
            text_color: '#FFFFFF'
        }
    },
    products_settings: {
        display_mode: 'by_categories_sections',
        sort_by: 'latest',
        out_of_stock_display: 'badge_at_end',
        show_quick_add: true,
        show_stock_badge: true,
        show_discount_badge: true,
        show_category_tag: true,
        show_old_price: true,
        show_currency: true,
        show_actions: true,
        add_to_cart_btn: {
            style: 'circle_icon',
            text: 'أضف للسلة',
            show_text: false,
            icon: 'fa-plus',
            action_animation: 'scale'
        },
        portrait: {
            scroll_direction: 'horizontal',
            grid_columns: 2,
            grid_rows: 0,
            slider_rows: 1,
            card_orientation: 'portrait',
            card_style: 'classic',
            card_custom_width: 0,
            card_custom_height: 0,
            img_custom_height: 0,
            card_density: 'standard',
            show_badges: true,
            show_quick_add: true,
            show_rating: true,
            show_old_price: true,
            show_currency: true
        },
        landscape: {
            scroll_direction: 'horizontal',
            grid_columns: 4,
            grid_rows: 0,
            slider_rows: 1,
            card_orientation: 'portrait',
            card_style: 'classic',
            card_custom_width: 0,
            card_custom_height: 0,
            img_custom_height: 0,
            card_density: 'standard',
            show_badges: true,
            show_quick_add: true,
            show_rating: true,
            show_old_price: true,
            show_currency: true
        },
        category_overrides: {}
    },
    messages: {
        search_placeholder: 'ابحث عن المنتجات أو الماركات...',
        empty_cart_title: 'سلة المشتريات فارغة 🛒',
        empty_cart_desc: 'لم تقم بإضافة أي منتجات للسلة بعد، تصفح المتجر الآن!',
        order_success_title: 'تم استلام طلبك بنجاح! 🎉',
        order_success_msg: 'شكراً لثقتك بنا. سيتم تجهيز وتوصيل طلبك في أقرب وقت.',
        order_track_whatsapp: 'متابعة وتأكيد الطلب عبر واتساب 💬',
        chatbot_greeting: 'أهلاً بك! كيف يمكنني مساعدتك في التسوق اليوم؟ 🤖',
        ai_assistant: {
            enabled: true,
            name: 'مساعد نالش',
            persona: 'classic',
            avatar_icon: 'fa-robot',
            avatar_emoji: '🤖',
            button_style: 'pill',
            avatar_style: 'pulse',
            position: 'bottom-right',
            enable_quick_actions: true,
            smart_contextual_actions: true,
            smart_contextual_replies: true,
            behavior_mode: 'support',
            conversation_style: 'balanced',
            response_style: 'friendly',
            accent_color: '#4F46E5',
            status_text: 'متصل للرد الفوري',
            quick_actions: ['أريد أفضل العروض المتاحة', 'كيف أقوم بالطلب والتوصيل؟', 'تتبع طلبي']
        },
        copied_link_msg: 'تم نسخ الرابط بنجاح! 📋'
    },
    layout_blocks: [
        {
            id: 'block_hero_1',
            type: 'hero',
            title: 'أهلاً بكم في متجرنا',
            subtitle: 'تسوق أحدث المنتجات بأفضل الأسعار وأعلى جودة مضمونة',
            style: 'classic',
            visible: true,
            order: 1,
            settings: {
                cta_text: 'تصفح المنتجات',
                cta_link: '#products',
                alignment: 'center'
            }
        },
        {
            id: 'block_cat_1',
            type: 'categories',
            title: 'التصنيفات المميزة',
            style: 'bubbles',
            visible: true,
            order: 2,
            settings: {
                layout: 'horizontal'
            }
        },
        {
            id: 'block_prod_1',
            type: 'products',
            title: 'أحدث المنتجات والعروض',
            style: 'classic_grid',
            visible: true,
            order: 3,
            settings: {
                limit: 12
            }
        }
    ],
    modals_customization: {
        product_details: {
            cta_button_text: 'إضافة إلى السلة 🛍️',
            border_radius: '24px'
        },
        cart_drawer: {
            header_title: 'سلة مشترياتي 🛒',
            checkout_btn_text: 'متابعة الطلب والدفع 🚀',
            empty_message: 'سلتك فارغة حالياً'
        },
        store_info: {
            title: 'عن المتجر وسياسات الخدمة',
            about_text: 'متجر رائد يقدم أفضل المنتجات والخدمات المميزة.',
            delivery_policy: 'نوفر التوصيل السريع والدفع عند الاستلام مع ضمان الاسترجاع خلال 3 أيام.'
        },
        order_success: {
            title: 'تم استلام طلبك بنجاح! 🎉',
            whatsapp_btn_text: 'تأكيد ومتابعة الطلب بالواتساب 💬'
        }
    },
    light_theme: {
        colors: {
            primary: '#4F46E5',
            primary_hover: '#4338CA',
            primary_gradient_start: '#4F46E5',
            primary_gradient_end: '#06B6D4',
            accent: '#14B8A6',
            bg_body: '#F8FAFC',
            bg_card: '#FFFFFF',
            bg_surface: '#F1F5F9',
            text_main: '#0F172A',
            text_muted: '#64748B',
            border: '#E2E8F0',
            navbar_bg: '#FFFFFF',
            navbar_text: '#0F172A',
            bottom_bar_bg: '#FFFFFF',
            bottom_bar_active: '#4F46E5',
            bottom_bar_inactive: '#94A3B8',
            card_bg: '#FFFFFF',
            card_border: '#E2E8F0',
            card_title: '#0F172A',
            price_color: '#4F46E5',
            old_price_color: '#94A3B8',
            badge_bg: '#EF4444',
            badge_text: '#FFFFFF',
            section_title: '#0F172A',
            category_chip_bg: '#F1F5F9',
            category_chip_active: '#4F46E5',
            category_chip_text: '#0F172A',
            modal_bg: '#FFFFFF',
            modal_overlay: 'rgba(15, 23, 42, 0.6)',
            modal_handle: '#CBD5E1',
            btn_primary_bg: '#4F46E5',
            btn_primary_text: '#FFFFFF',
            chatbot_btn_bg: '#4F46E5',
            toast_bg: '#0F172A',
            toast_text: '#FFFFFF'
        }
    },
    dark_theme: {
        colors: {
            primary: '#6366F1',
            primary_hover: '#818CF8',
            primary_gradient_start: '#6366F1',
            primary_gradient_end: '#2DD4BF',
            accent: '#2DD4BF',
            bg_body: '#0B1120',
            bg_card: '#151E2E',
            bg_surface: '#1E293B',
            text_main: '#F8FAFC',
            text_muted: '#94A3B8',
            border: 'rgba(255, 255, 255, 0.08)',
            navbar_bg: '#151E2E',
            navbar_text: '#F8FAFC',
            bottom_bar_bg: '#151E2E',
            bottom_bar_active: '#6366F1',
            bottom_bar_inactive: '#64748B',
            card_bg: '#151E2E',
            card_border: 'rgba(255, 255, 255, 0.08)',
            card_title: '#F8FAFC',
            price_color: '#818CF8',
            old_price_color: '#64748B',
            badge_bg: '#EF4444',
            badge_text: '#FFFFFF',
            section_title: '#F8FAFC',
            category_chip_bg: '#1E293B',
            category_chip_active: '#6366F1',
            category_chip_text: '#F8FAFC',
            modal_bg: '#151E2E',
            modal_overlay: 'rgba(0, 0, 0, 0.85)',
            modal_handle: '#475569',
            btn_primary_bg: '#6366F1',
            btn_primary_text: '#FFFFFF',
            chatbot_btn_bg: '#6366F1',
            toast_bg: '#1E293B',
            toast_text: '#F8FAFC'
        }
    },
    typography: {
        font_family: 'Tajawal',
        base_size: '16px',
        base_size_mobile: '15px',
        base_size_desktop: '17px',
        heading_weight: '700',
        heading_size_mobile: '1.15rem',
        heading_size_desktop: '1.45rem',
        price_size_mobile: '1.1rem',
        price_size_desktop: '1.25rem',
        headings: {
            price_size: '1.15rem'
        }
    },
    shapes: {
        card_radius: '20px',
        button_radius: '14px',
        button_style: 'rounded',
        card_style: 'elevated',
        navbar_style: 'solid',
        section_spacing: 'normal'
    },
    navigation_settings: {
        bottom_bar: {
            items: normalizeBottomNavItems(DEFAULT_NAV_ITEMS)
        },
        top_bar: normalizeTopBarSettings(DEFAULT_TOP_BAR_SETTINGS)
    },
    animations: {
        card_hover: 'lift'
    },
    marketing: {
        free_shipping_bar: {
            enabled: false,
            message: '🚚 شحن مجاني للطلبات فوق 10,000 ريال!'
        },
        whatsapp_floating: {
            enabled: true,
            phone: '',
            position: 'left'
        }
    }
};

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'nalsh_indigo',
        name: 'بنفسجي نالش العصري 💎',
        category: 'تقنية وحديث',
        description: 'الهوية الرسمية لمنصة نالش بتدرجات إنديغو وتركوازية حيوية وعصرية',
        light_theme: {
            colors: {
                primary: '#4F46E5', primary_hover: '#4338CA', primary_gradient_start: '#4F46E5', primary_gradient_end: '#06B6D4', accent: '#14B8A6',
                bg_body: '#F8FAFC', bg_card: '#FFFFFF', bg_surface: '#F1F5F9', text_main: '#0F172A', text_muted: '#64748B', border: '#E2E8F0',
                navbar_bg: '#FFFFFF', navbar_text: '#0F172A', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#4F46E5', bottom_bar_inactive: '#94A3B8',
                card_bg: '#FFFFFF', card_border: '#E2E8F0', card_title: '#0F172A', price_color: '#4F46E5', old_price_color: '#94A3B8',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#0F172A', category_chip_bg: '#F1F5F9', category_chip_active: '#4F46E5', category_chip_text: '#0F172A',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(15, 23, 42, 0.6)', modal_handle: '#CBD5E1', btn_primary_bg: '#4F46E5', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#4F46E5'
            }
        },
        dark_theme: {
            colors: {
                primary: '#6366F1', primary_hover: '#818CF8', primary_gradient_start: '#6366F1', primary_gradient_end: '#2DD4BF', accent: '#2DD4BF',
                bg_body: '#0B1120', bg_card: '#151E2E', bg_surface: '#1E293B', text_main: '#F8FAFC', text_muted: '#94A3B8', border: '#2D3B55',
                navbar_bg: '#151E2E', navbar_text: '#F8FAFC', bottom_bar_bg: '#151E2E', bottom_bar_active: '#6366F1', bottom_bar_inactive: '#64748B',
                card_bg: '#151E2E', card_border: '#2D3B55', card_title: '#F8FAFC', price_color: '#818CF8', old_price_color: '#64748B',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#F8FAFC', category_chip_bg: '#1E293B', category_chip_active: '#6366F1', category_chip_text: '#F8FAFC',
                modal_bg: '#151E2E', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#475569', btn_primary_bg: '#6366F1', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#6366F1'
            }
        },
        typography: { font_family: 'Tajawal', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '20px', button_radius: '14px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'emerald_royal',
        name: 'زمردي ملكي فاخر 👑',
        category: 'فخامة وعطور',
        description: 'درجات الزمرد الأخضر الفاخر للأناقة والمتاجر المميزة والعطور',
        light_theme: {
            colors: {
                primary: '#059669', primary_hover: '#047857', primary_gradient_start: '#059669', primary_gradient_end: '#34D399', accent: '#10B981',
                bg_body: '#F0FDF4', bg_card: '#FFFFFF', bg_surface: '#DCFCE7', text_main: '#064E3B', text_muted: '#047857', border: '#BBF7D0',
                navbar_bg: '#FFFFFF', navbar_text: '#064E3B', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#059669', bottom_bar_inactive: '#047857',
                card_bg: '#FFFFFF', card_border: '#BBF7D0', card_title: '#064E3B', price_color: '#059669', old_price_color: '#047857',
                badge_bg: '#E11D48', badge_text: '#FFFFFF', section_title: '#064E3B', category_chip_bg: '#DCFCE7', category_chip_active: '#059669', category_chip_text: '#064E3B',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(6, 78, 59, 0.6)', modal_handle: '#BBF7D0', btn_primary_bg: '#059669', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#059669'
            }
        },
        dark_theme: {
            colors: {
                primary: '#10B981', primary_hover: '#34D399', primary_gradient_start: '#10B981', primary_gradient_end: '#6EE7B7', accent: '#34D399',
                bg_body: '#022C22', bg_card: '#064E3B', bg_surface: '#065F46', text_main: '#ECFDF5', text_muted: '#A7F3D0', border: '#0F766E',
                navbar_bg: '#064E3B', navbar_text: '#ECFDF5', bottom_bar_bg: '#064E3B', bottom_bar_active: '#10B981', bottom_bar_inactive: '#A7F3D0',
                card_bg: '#064E3B', card_border: '#0F766E', card_title: '#ECFDF5', price_color: '#34D399', old_price_color: '#A7F3D0',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#ECFDF5', category_chip_bg: '#065F46', category_chip_active: '#10B981', category_chip_text: '#ECFDF5',
                modal_bg: '#064E3B', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#0F766E', btn_primary_bg: '#10B981', btn_primary_text: '#022C22', chatbot_btn_bg: '#10B981'
            }
        },
        typography: { font_family: 'Cairo', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '16px', button_radius: '12px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'ruby_red',
        name: 'ياقوتي أحمر وجريء 🌹',
        category: 'أزياء ومكياج',
        description: 'تصميم دافئ وجريء بألوان الياقوت الأحمر للأزياء والموضة والمستحضرات',
        light_theme: {
            colors: {
                primary: '#E11D48', primary_hover: '#BE123C', primary_gradient_start: '#E11D48', primary_gradient_end: '#FB7185', accent: '#FB7185',
                bg_body: '#FFF1F2', bg_card: '#FFFFFF', bg_surface: '#FFE4E6', text_main: '#1C1917', text_muted: '#78716C', border: '#FECDD3',
                navbar_bg: '#FFFFFF', navbar_text: '#1C1917', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#E11D48', bottom_bar_inactive: '#78716C',
                card_bg: '#FFFFFF', card_border: '#FECDD3', card_title: '#1C1917', price_color: '#E11D48', old_price_color: '#78716C',
                badge_bg: '#BE123C', badge_text: '#FFFFFF', section_title: '#1C1917', category_chip_bg: '#FFE4E6', category_chip_active: '#E11D48', category_chip_text: '#1C1917',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(28, 25, 23, 0.6)', modal_handle: '#FECDD3', btn_primary_bg: '#E11D48', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#E11D48'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FB7185', primary_hover: '#FDA4AF', primary_gradient_start: '#FB7185', primary_gradient_end: '#E11D48', accent: '#F43F5E',
                bg_body: '#18181B', bg_card: '#27272A', bg_surface: '#3F3F46', text_main: '#FAFAFA', text_muted: '#A1A1AA', border: '#3F3F46',
                navbar_bg: '#27272A', navbar_text: '#FAFAFA', bottom_bar_bg: '#27272A', bottom_bar_active: '#FB7185', bottom_bar_inactive: '#A1A1AA',
                card_bg: '#27272A', card_border: '#3F3F46', card_title: '#FAFAFA', price_color: '#FB7185', old_price_color: '#A1A1AA',
                badge_bg: '#E11D48', badge_text: '#FFFFFF', section_title: '#FAFAFA', category_chip_bg: '#3F3F46', category_chip_active: '#FB7185', category_chip_text: '#FAFAFA',
                modal_bg: '#27272A', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#52525B', btn_primary_bg: '#FB7185', btn_primary_text: '#18181B', chatbot_btn_bg: '#FB7185'
            }
        },
        typography: { font_family: 'Readex Pro', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '24px', button_radius: '9999px', button_style: 'pill', card_style: 'elevated' }
    },
    {
        id: 'amber_gold',
        name: 'ذهبي عنبري كلاسيكي 🏆',
        category: 'مجوهرات وساعات',
        description: 'فخامة ملكية مع حدود واضحة وألوان العنبر والذهب للمجوهرات والساعات الفاخرة',
        light_theme: {
            colors: {
                primary: '#D97706', primary_hover: '#B45309', primary_gradient_start: '#D97706', primary_gradient_end: '#FBBF24', accent: '#F59E0B',
                bg_body: '#FFFBEB', bg_card: '#FFFFFF', bg_surface: '#FEF3C7', text_main: '#1E293B', text_muted: '#64748B', border: '#FDE68A',
                navbar_bg: '#FFFFFF', navbar_text: '#1E293B', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#D97706', bottom_bar_inactive: '#64748B',
                card_bg: '#FFFFFF', card_border: '#FDE68A', card_title: '#1E293B', price_color: '#D97706', old_price_color: '#64748B',
                badge_bg: '#DC2626', badge_text: '#FFFFFF', section_title: '#1E293B', category_chip_bg: '#FEF3C7', category_chip_active: '#D97706', category_chip_text: '#1E293B',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(30, 41, 59, 0.6)', modal_handle: '#FDE68A', btn_primary_bg: '#D97706', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#D97706'
            }
        },
        dark_theme: {
            colors: {
                primary: '#F59E0B', primary_hover: '#FBBF24', primary_gradient_start: '#F59E0B', primary_gradient_end: '#D97706', accent: '#FBBF24',
                bg_body: '#0F172A', bg_card: '#1E293B', bg_surface: '#334155', text_main: '#F8FAFC', text_muted: '#94A3B8', border: '#334155',
                navbar_bg: '#1E293B', navbar_text: '#F8FAFC', bottom_bar_bg: '#1E293B', bottom_bar_active: '#F59E0B', bottom_bar_inactive: '#94A3B8',
                card_bg: '#1E293B', card_border: '#334155', card_title: '#F8FAFC', price_color: '#FBBF24', old_price_color: '#94A3B8',
                badge_bg: '#DC2626', badge_text: '#FFFFFF', section_title: '#F8FAFC', category_chip_bg: '#334155', category_chip_active: '#F59E0B', category_chip_text: '#F8FAFC',
                modal_bg: '#1E293B', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#475569', btn_primary_bg: '#F59E0B', btn_primary_text: '#0F172A', chatbot_btn_bg: '#F59E0B'
            }
        },
        typography: { font_family: 'Almarai', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '14px', button_radius: '8px', button_style: 'rounded', card_style: 'bordered' }
    },
    {
        id: 'deep_ocean',
        name: 'أزرق المحيط الصافي 🌊',
        category: 'إلكترونيات وخدمات',
        description: 'درجات الأزرق البحري الصافي والعميق للإلكترونيات والأجهزة والخدمات الحديثة',
        light_theme: {
            colors: {
                primary: '#0284C7', primary_hover: '#0369A1', primary_gradient_start: '#0284C7', primary_gradient_end: '#38BDF8', accent: '#0EA5E9',
                bg_body: '#F0F9FF', bg_card: '#FFFFFF', bg_surface: '#E0F2FE', text_main: '#0C4A6E', text_muted: '#0369A1', border: '#BAE6FD',
                navbar_bg: '#FFFFFF', navbar_text: '#0C4A6E', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#0284C7', bottom_bar_inactive: '#0369A1',
                card_bg: '#FFFFFF', card_border: '#BAE6FD', card_title: '#0C4A6E', price_color: '#0284C7', old_price_color: '#0369A1',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#0C4A6E', category_chip_bg: '#E0F2FE', category_chip_active: '#0284C7', category_chip_text: '#0C4A6E',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(12, 74, 110, 0.6)', modal_handle: '#BAE6FD', btn_primary_bg: '#0284C7', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#0284C7'
            }
        },
        dark_theme: {
            colors: {
                primary: '#38BDF8', primary_hover: '#7DD3FC', primary_gradient_start: '#38BDF8', primary_gradient_end: '#0284C7', accent: '#0EA5E9',
                bg_body: '#082F49', card_bg: '#0C4A6E', bg_card: '#0C4A6E', bg_surface: '#075985', text_main: '#F0F9FF', text_muted: '#BAE6FD', border: '#0369A1',
                navbar_bg: '#0C4A6E', navbar_text: '#F0F9FF', bottom_bar_bg: '#0C4A6E', bottom_bar_active: '#38BDF8', bottom_bar_inactive: '#BAE6FD',
                card_border: '#0369A1', card_title: '#F0F9FF', price_color: '#38BDF8', old_price_color: '#BAE6FD',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#F0F9FF', category_chip_bg: '#075985', category_chip_active: '#38BDF8', category_chip_text: '#F0F9FF',
                modal_bg: '#0C4A6E', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#0369A1', btn_primary_bg: '#38BDF8', btn_primary_text: '#082F49', chatbot_btn_bg: '#38BDF8'
            }
        },
        typography: { font_family: 'Alexandria', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '16px', button_radius: '10px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'cyber_cyan',
        name: 'سماوي سايبر نيون ⚡',
        category: 'ألعاب وتقنية',
        description: 'ألوان سايبر بانك ونيون مضيء للمتاجر الرقمية، الألعاب، والإلكترونيات السريعة',
        light_theme: {
            colors: {
                primary: '#0891B2', primary_hover: '#0E7490', primary_gradient_start: '#0891B2', primary_gradient_end: '#06B6D4', accent: '#06B6D4',
                bg_body: '#ECFEFF', bg_card: '#FFFFFF', bg_surface: '#CFFAFE', text_main: '#164E63', text_muted: '#0891B2', border: '#A5F3FC',
                navbar_bg: '#FFFFFF', navbar_text: '#164E63', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#0891B2', bottom_bar_inactive: '#0891B2',
                card_bg: '#FFFFFF', card_border: '#A5F3FC', card_title: '#164E63', price_color: '#0891B2', old_price_color: '#0891B2',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#164E63', category_chip_bg: '#CFFAFE', category_chip_active: '#0891B2', category_chip_text: '#164E63',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(22, 78, 99, 0.6)', modal_handle: '#A5F3FC', btn_primary_bg: '#0891B2', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#0891B2'
            }
        },
        dark_theme: {
            colors: {
                primary: '#22D3EE', primary_hover: '#67E8F9', primary_gradient_start: '#22D3EE', primary_gradient_end: '#A855F7', accent: '#A855F7',
                bg_body: '#08131F', card_bg: '#0E2338', bg_card: '#0E2338', bg_surface: '#153350', text_main: '#ECFEFF', text_muted: '#A5F3FC', border: '#155E75',
                navbar_bg: '#0E2338', navbar_text: '#ECFEFF', bottom_bar_bg: '#0E2338', bottom_bar_active: '#22D3EE', bottom_bar_inactive: '#A5F3FC',
                card_border: '#155E75', card_title: '#ECFEFF', price_color: '#22D3EE', old_price_color: '#A5F3FC',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#ECFEFF', category_chip_bg: '#153350', category_chip_active: '#22D3EE', category_chip_text: '#ECFEFF',
                modal_bg: '#0E2338', modal_overlay: 'rgba(0, 0, 0, 0.9)', modal_handle: '#155E75', btn_primary_bg: '#22D3EE', btn_primary_text: '#08131F', chatbot_btn_bg: '#22D3EE'
            }
        },
        typography: { font_family: 'Cairo', base_size: '16px', heading_weight: '900' },
        shapes: { card_radius: '12px', button_radius: '6px', button_style: 'square', card_style: 'bordered' }
    },
    {
        id: 'fashion_rose',
        name: 'وردي أنيق وفاشن 🌸',
        category: 'أزياء وجمال',
        description: 'درجات الوردي والروز الناعمة والأنيقة للأزياء النسائية، العطور، ومستحضرات التجميل',
        light_theme: {
            colors: {
                primary: '#DB2777', primary_hover: '#BE185D', primary_gradient_start: '#DB2777', primary_gradient_end: '#F472B6', accent: '#F472B6',
                bg_body: '#FDF2F8', bg_card: '#FFFFFF', bg_surface: '#FCE7F3', text_main: '#831843', text_muted: '#9D174D', border: '#FBCFE8',
                navbar_bg: '#FFFFFF', navbar_text: '#831843', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#DB2777', bottom_bar_inactive: '#9D174D',
                card_bg: '#FFFFFF', card_border: '#FBCFE8', card_title: '#831843', price_color: '#DB2777', old_price_color: '#9D174D',
                badge_bg: '#9D174D', badge_text: '#FFFFFF', section_title: '#831843', category_chip_bg: '#FCE7F3', category_chip_active: '#DB2777', category_chip_text: '#831843',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(131, 24, 67, 0.6)', modal_handle: '#FBCFE8', btn_primary_bg: '#DB2777', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#DB2777'
            }
        },
        dark_theme: {
            colors: {
                primary: '#F472B6', primary_hover: '#FBCFE8', primary_gradient_start: '#F472B6', primary_gradient_end: '#DB2777', accent: '#FB7185',
                bg_body: '#1F0A16', card_bg: '#371228', bg_card: '#371228', bg_surface: '#4C1D3A', text_main: '#FDF2F8', text_muted: '#FBCFE8', border: '#831843',
                navbar_bg: '#371228', navbar_text: '#FDF2F8', bottom_bar_bg: '#371228', bottom_bar_active: '#F472B6', bottom_bar_inactive: '#FBCFE8',
                card_border: '#831843', card_title: '#FDF2F8', price_color: '#F472B6', old_price_color: '#FBCFE8',
                badge_bg: '#DB2777', badge_text: '#FFFFFF', section_title: '#FDF2F8', category_chip_bg: '#4C1D3A', category_chip_active: '#F472B6', category_chip_text: '#FDF2F8',
                modal_bg: '#371228', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#831843', btn_primary_bg: '#F472B6', btn_primary_text: '#1F0A16', chatbot_btn_bg: '#F472B6'
            }
        },
        typography: { font_family: 'Readex Pro', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '24px', button_radius: '9999px', button_style: 'pill', card_style: 'elevated' }
    },
    {
        id: 'imperial_purple',
        name: 'أرجواني ملكي فاخر 🔮',
        category: 'فخامة وهدايا',
        description: 'أرجواني عميق وساحر يعكس التميز والفخامة للمتاجر الراقية والهدايا الفاخرة',
        light_theme: {
            colors: {
                primary: '#7C3AED', primary_hover: '#6D28D9', primary_gradient_start: '#7C3AED', primary_gradient_end: '#A78BFA', accent: '#A78BFA',
                bg_body: '#FAF5FF', bg_card: '#FFFFFF', bg_surface: '#F3E8FF', text_main: '#3B0764', text_muted: '#581C87', border: '#E9D5FF',
                navbar_bg: '#FFFFFF', navbar_text: '#3B0764', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#7C3AED', bottom_bar_inactive: '#581C87',
                card_bg: '#FFFFFF', card_border: '#E9D5FF', card_title: '#3B0764', price_color: '#7C3AED', old_price_color: '#581C87',
                badge_bg: '#EC4899', badge_text: '#FFFFFF', section_title: '#3B0764', category_chip_bg: '#F3E8FF', category_chip_active: '#7C3AED', category_chip_text: '#3B0764',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(59, 7, 100, 0.6)', modal_handle: '#E9D5FF', btn_primary_bg: '#7C3AED', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#7C3AED'
            }
        },
        dark_theme: {
            colors: {
                primary: '#A78BFA', primary_hover: '#C4B5FD', primary_gradient_start: '#A78BFA', primary_gradient_end: '#7C3AED', accent: '#C084FC',
                bg_body: '#160826', card_bg: '#291045', bg_card: '#291045', bg_surface: '#3B1A60', text_main: '#FAF5FF', text_muted: '#DDD6FE', border: '#581C87',
                navbar_bg: '#291045', navbar_text: '#FAF5FF', bottom_bar_bg: '#291045', bottom_bar_active: '#A78BFA', bottom_bar_inactive: '#DDD6FE',
                card_border: '#581C87', card_title: '#FAF5FF', price_color: '#A78BFA', old_price_color: '#DDD6FE',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#FAF5FF', category_chip_bg: '#3B1A60', category_chip_active: '#A78BFA', category_chip_text: '#FAF5FF',
                modal_bg: '#291045', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#581C87', btn_primary_bg: '#A78BFA', btn_primary_text: '#160826', chatbot_btn_bg: '#A78BFA'
            }
        },
        typography: { font_family: 'Tajawal', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '18px', button_radius: '12px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'fresh_mint',
        name: 'أخضر نعناعي منعش 🍃',
        category: 'صحة وطبيعة',
        description: 'درجات النعناع والتركواز الهادئة والمريحة للمنتجات الصحية، الطبيعية، والأغذية الصحية',
        light_theme: {
            colors: {
                primary: '#0D9488', primary_hover: '#0F766E', primary_gradient_start: '#0D9488', primary_gradient_end: '#2DD4BF', accent: '#2DD4BF',
                bg_body: '#F0FDFA', bg_card: '#FFFFFF', bg_surface: '#CCFBF1', text_main: '#134E4A', text_muted: '#115E59', border: '#99F6E4',
                navbar_bg: '#FFFFFF', navbar_text: '#134E4A', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#0D9488', bottom_bar_inactive: '#115E59',
                card_bg: '#FFFFFF', card_border: '#99F6E4', card_title: '#134E4A', price_color: '#0D9488', old_price_color: '#115E59',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#134E4A', category_chip_bg: '#CCFBF1', category_chip_active: '#0D9488', category_chip_text: '#134E4A',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(19, 78, 74, 0.6)', modal_handle: '#99F6E4', btn_primary_bg: '#0D9488', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#0D9488'
            }
        },
        dark_theme: {
            colors: {
                primary: '#2DD4BF', primary_hover: '#5EEAD4', primary_gradient_start: '#2DD4BF', primary_gradient_end: '#0D9488', accent: '#14B8A6',
                bg_body: '#042320', card_bg: '#0B3B36', bg_card: '#0B3B36', bg_surface: '#104F49', text_main: '#F0FDFA', text_muted: '#99F6E4', border: '#134E4A',
                navbar_bg: '#0B3B36', navbar_text: '#F0FDFA', bottom_bar_bg: '#0B3B36', bottom_bar_active: '#2DD4BF', bottom_bar_inactive: '#99F6E4',
                card_border: '#134E4A', card_title: '#F0FDFA', price_color: '#2DD4BF', old_price_color: '#99F6E4',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#F0FDFA', category_chip_bg: '#104F49', category_chip_active: '#2DD4BF', category_chip_text: '#F0FDFA',
                modal_bg: '#0B3B36', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#134E4A', btn_primary_bg: '#2DD4BF', btn_primary_text: '#042320', chatbot_btn_bg: '#2DD4BF'
            }
        },
        typography: { font_family: 'Almarai', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '20px', button_radius: '14px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'sunset_coral',
        name: 'برتقالي مرجاني دافئ 🌅',
        category: 'مأكولات ورياضة',
        description: 'دفء ألوان الغروب والمرجان النابض بالحياة، مثالي للمطاعم والمنتجات الرياضية السريعة',
        light_theme: {
            colors: {
                primary: '#EA580C', primary_hover: '#C2410C', primary_gradient_start: '#EA580C', primary_gradient_end: '#FB923C', accent: '#F97316',
                bg_body: '#FFF7ED', bg_card: '#FFFFFF', bg_surface: '#FFEDD5', text_main: '#431407', text_muted: '#7C2D12', border: '#FED7AA',
                navbar_bg: '#FFFFFF', navbar_text: '#431407', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#EA580C', bottom_bar_inactive: '#7C2D12',
                card_bg: '#FFFFFF', card_border: '#FED7AA', card_title: '#431407', price_color: '#EA580C', old_price_color: '#7C2D12',
                badge_bg: '#DC2626', badge_text: '#FFFFFF', section_title: '#431407', category_chip_bg: '#FFEDD5', category_chip_active: '#EA580C', category_chip_text: '#431407',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(67, 20, 7, 0.6)', modal_handle: '#FED7AA', btn_primary_bg: '#EA580C', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#EA580C'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FB923C', primary_hover: '#FDBA74', primary_gradient_start: '#FB923C', primary_gradient_end: '#EA580C', accent: '#F97316',
                bg_body: '#1C0B04', card_bg: '#361608', bg_card: '#361608', bg_surface: '#4D2210', text_main: '#FFF7ED', text_muted: '#FED7AA', border: '#7C2D12',
                navbar_bg: '#361608', navbar_text: '#FFF7ED', bottom_bar_bg: '#361608', bottom_bar_active: '#FB923C', bottom_bar_inactive: '#FED7AA',
                card_border: '#7C2D12', card_title: '#FFF7ED', price_color: '#FB923C', old_price_color: '#FED7AA',
                badge_bg: '#EA580C', badge_text: '#FFFFFF', section_title: '#FFF7ED', category_chip_bg: '#4D2210', category_chip_active: '#FB923C', category_chip_text: '#FFF7ED',
                modal_bg: '#361608', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#7C2D12', btn_primary_bg: '#FB923C', btn_primary_text: '#1C0B04', chatbot_btn_bg: '#FB923C'
            }
        },
        typography: { font_family: 'Changa', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '16px', button_radius: '10px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'warm_mocha',
        name: 'موكا وبن كافيه ☕',
        category: 'مقاهي وحلويات',
        description: 'درجات البن والكراميل والقهوة الدافئة للمقاهي، المخابز، ومتاجر الحلويات الراقية',
        light_theme: {
            colors: {
                primary: '#92400E', primary_hover: '#78350F', primary_gradient_start: '#92400E', primary_gradient_end: '#D97706', accent: '#B45309',
                bg_body: '#FFFBEB', bg_card: '#FFFFFF', bg_surface: '#FEF3C7', text_main: '#451A03', text_muted: '#78350F', border: '#FDE68A',
                navbar_bg: '#FFFFFF', navbar_text: '#451A03', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#92400E', bottom_bar_inactive: '#78350F',
                card_bg: '#FFFFFF', card_border: '#FDE68A', card_title: '#451A03', price_color: '#92400E', old_price_color: '#78350F',
                badge_bg: '#B91C1C', badge_text: '#FFFFFF', section_title: '#451A03', category_chip_bg: '#FEF3C7', category_chip_active: '#92400E', category_chip_text: '#451A03',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(69, 26, 3, 0.6)', modal_handle: '#FDE68A', btn_primary_bg: '#92400E', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#92400E'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FBBF24', primary_hover: '#FCD34D', primary_gradient_start: '#FBBF24', primary_gradient_end: '#B45309', accent: '#D97706',
                bg_body: '#180D04', card_bg: '#2D1808', bg_card: '#2D1808', bg_surface: '#40240E', text_main: '#FFFBEB', text_muted: '#FDE68A', border: '#78350F',
                navbar_bg: '#2D1808', navbar_text: '#FFFBEB', bottom_bar_bg: '#2D1808', bottom_bar_active: '#FBBF24', bottom_bar_inactive: '#FDE68A',
                card_border: '#78350F', card_title: '#FFFBEB', price_color: '#FBBF24', old_price_color: '#FDE68A',
                badge_bg: '#DC2626', badge_text: '#FFFFFF', section_title: '#FFFBEB', category_chip_bg: '#40240E', category_chip_active: '#FBBF24', category_chip_text: '#FFFBEB',
                modal_bg: '#2D1808', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#78350F', btn_primary_bg: '#FBBF24', btn_primary_text: '#180D04', chatbot_btn_bg: '#FBBF24'
            }
        },
        typography: { font_family: 'Amiri', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '14px', button_radius: '8px', button_style: 'rounded', card_style: 'bordered' }
    },
    {
        id: 'midnight_navy',
        name: 'كحلي ليلي فاخر 🌌',
        category: 'شركات وأجهزة',
        description: 'أزرق كحلي رصين ورسمي مع لمسات زرقاء ساطعة يعكس الثقة والمصداقية العالية',
        light_theme: {
            colors: {
                primary: '#1E40AF', primary_hover: '#1E3A8A', primary_gradient_start: '#1E40AF', primary_gradient_end: '#3B82F6', accent: '#60A5FA',
                bg_body: '#F8FAFC', bg_card: '#FFFFFF', bg_surface: '#EFF6FF', text_main: '#0F172A', text_muted: '#475569', border: '#DBEAFE',
                navbar_bg: '#FFFFFF', navbar_text: '#0F172A', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#1E40AF', bottom_bar_inactive: '#475569',
                card_bg: '#FFFFFF', card_border: '#DBEAFE', card_title: '#0F172A', price_color: '#1E40AF', old_price_color: '#475569',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#0F172A', category_chip_bg: '#EFF6FF', category_chip_active: '#1E40AF', category_chip_text: '#0F172A',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(15, 23, 42, 0.6)', modal_handle: '#DBEAFE', btn_primary_bg: '#1E40AF', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#1E40AF'
            }
        },
        dark_theme: {
            colors: {
                primary: '#60A5FA', primary_hover: '#93C5FD', primary_gradient_start: '#60A5FA', primary_gradient_end: '#1E40AF', accent: '#38BDF8',
                bg_body: '#0A1128', card_bg: '#111D44', bg_card: '#111D44', bg_surface: '#1A2C63', text_main: '#F8FAFC', text_muted: '#94A3B8', border: '#1E3A8A',
                navbar_bg: '#111D44', navbar_text: '#F8FAFC', bottom_bar_bg: '#111D44', bottom_bar_active: '#60A5FA', bottom_bar_inactive: '#94A3B8',
                card_border: '#1E3A8A', card_title: '#F8FAFC', price_color: '#60A5FA', old_price_color: '#94A3B8',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#F8FAFC', category_chip_bg: '#1A2C63', category_chip_active: '#60A5FA', category_chip_text: '#F8FAFC',
                modal_bg: '#111D44', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#1E3A8A', btn_primary_bg: '#60A5FA', btn_primary_text: '#0A1128', chatbot_btn_bg: '#60A5FA'
            }
        },
        typography: { font_family: 'Alexandria', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '16px', button_radius: '10px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'minimal_charcoal',
        name: 'فحم ومونوكروم عصري 🖤',
        category: 'مينيمال وبسيط',
        description: 'أسلوب مونوكروم مينيمال هادئ ونظيف يركز بالكامل على إبراز صور المنتجات بدقة',
        light_theme: {
            colors: {
                primary: '#18181B', primary_hover: '#27272A', primary_gradient_start: '#18181B', primary_gradient_end: '#3F3F46', accent: '#52525B',
                bg_body: '#FAFAFA', bg_card: '#FFFFFF', bg_surface: '#F4F4F5', text_main: '#18181B', text_muted: '#71717A', border: '#E4E4E7',
                navbar_bg: '#FFFFFF', navbar_text: '#18181B', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#18181B', bottom_bar_inactive: '#71717A',
                card_bg: '#FFFFFF', card_border: '#E4E4E7', card_title: '#18181B', price_color: '#18181B', old_price_color: '#71717A',
                badge_bg: '#18181B', badge_text: '#FFFFFF', section_title: '#18181B', category_chip_bg: '#F4F4F5', category_chip_active: '#18181B', category_chip_text: '#FFFFFF',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(24, 24, 27, 0.6)', modal_handle: '#E4E4E7', btn_primary_bg: '#18181B', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#18181B'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FAFAFA', primary_hover: '#FFFFFF', primary_gradient_start: '#FAFAFA', primary_gradient_end: '#E4E4E7', accent: '#A1A1AA',
                bg_body: '#09090B', card_bg: '#18181B', bg_card: '#18181B', bg_surface: '#27272A', text_main: '#FAFAFA', text_muted: '#A1A1AA', border: '#27272A',
                navbar_bg: '#18181B', navbar_text: '#FAFAFA', bottom_bar_bg: '#18181B', bottom_bar_active: '#FAFAFA', bottom_bar_inactive: '#A1A1AA',
                card_border: '#27272A', card_title: '#FAFAFA', price_color: '#FAFAFA', old_price_color: '#71717A',
                badge_bg: '#FAFAFA', badge_text: '#09090B', section_title: '#FAFAFA', category_chip_bg: '#27272A', category_chip_active: '#FAFAFA', category_chip_text: '#09090B',
                modal_bg: '#18181B', modal_overlay: 'rgba(0, 0, 0, 0.9)', modal_handle: '#3F3F46', btn_primary_bg: '#FAFAFA', btn_primary_text: '#09090B', chatbot_btn_bg: '#FAFAFA'
            }
        },
        typography: { font_family: 'Tajawal', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '8px', button_radius: '4px', button_style: 'square', card_style: 'bordered' }
    },
    {
        id: 'velvet_berry',
        name: 'توتي مخملي ملكي 🍇',
        category: 'عطور وشوكولاتة',
        description: 'درجات التوت والبنفسج المخملي الفاخر للشوكولاتة، العطور، والمتاجر الفاخرة',
        light_theme: {
            colors: {
                primary: '#9333EA', primary_hover: '#7E22CE', primary_gradient_start: '#9333EA', primary_gradient_end: '#C084FC', accent: '#C084FC',
                bg_body: '#FAF5FF', bg_card: '#FFFFFF', bg_surface: '#F3E8FF', text_main: '#2E1065', text_muted: '#581C87', border: '#E9D5FF',
                navbar_bg: '#FFFFFF', navbar_text: '#2E1065', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#9333EA', bottom_bar_inactive: '#581C87',
                card_bg: '#FFFFFF', card_border: '#E9D5FF', card_title: '#2E1065', price_color: '#9333EA', old_price_color: '#581C87',
                badge_bg: '#BE185D', badge_text: '#FFFFFF', section_title: '#2E1065', category_chip_bg: '#F3E8FF', category_chip_active: '#9333EA', category_chip_text: '#2E1065',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(46, 16, 101, 0.6)', modal_handle: '#E9D5FF', btn_primary_bg: '#9333EA', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#9333EA'
            }
        },
        dark_theme: {
            colors: {
                primary: '#C084FC', primary_hover: '#E9D5FF', primary_gradient_start: '#C084FC', primary_gradient_end: '#9333EA', accent: '#E879F9',
                bg_body: '#17072B', card_bg: '#2B0E4E', bg_card: '#2B0E4E', bg_surface: '#3F1570', text_main: '#FAF5FF', text_muted: '#E9D5FF', border: '#581C87',
                navbar_bg: '#2B0E4E', navbar_text: '#FAF5FF', bottom_bar_bg: '#2B0E4E', bottom_bar_active: '#C084FC', bottom_bar_inactive: '#E9D5FF',
                card_border: '#581C87', card_title: '#FAF5FF', price_color: '#C084FC', old_price_color: '#E9D5FF',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#FAF5FF', category_chip_bg: '#3F1570', category_chip_active: '#C084FC', category_chip_text: '#FAF5FF',
                modal_bg: '#2B0E4E', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#581C87', btn_primary_bg: '#C084FC', btn_primary_text: '#17072B', chatbot_btn_bg: '#C084FC'
            }
        },
        typography: { font_family: 'Readex Pro', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '22px', button_radius: '14px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'forest_olive',
        name: 'زيتوني وغابات طبيعية 🌲',
        category: 'زراعة وأعشاب',
        description: 'ألوان الزيتوني والغابات الطبيعية تعزز الإحساس بالمواد الطبيعية والأعشاب النقية',
        light_theme: {
            colors: {
                primary: '#4D7C0F', primary_hover: '#3F6212', primary_gradient_start: '#4D7C0F', primary_gradient_end: '#84CC16', accent: '#84CC16',
                bg_body: '#F7FEE7', bg_card: '#FFFFFF', bg_surface: '#ECFCCB', text_main: '#1A2E05', text_muted: '#365314', border: '#D9F99D',
                navbar_bg: '#FFFFFF', navbar_text: '#1A2E05', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#4D7C0F', bottom_bar_inactive: '#365314',
                card_bg: '#FFFFFF', card_border: '#D9F99D', card_title: '#1A2E05', price_color: '#4D7C0F', old_price_color: '#365314',
                badge_bg: '#B91C1C', badge_text: '#FFFFFF', section_title: '#1A2E05', category_chip_bg: '#ECFCCB', category_chip_active: '#4D7C0F', category_chip_text: '#1A2E05',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(26, 46, 5, 0.6)', modal_handle: '#D9F99D', btn_primary_bg: '#4D7C0F', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#4D7C0F'
            }
        },
        dark_theme: {
            colors: {
                primary: '#A3E635', primary_hover: '#BEF264', primary_gradient_start: '#A3E635', primary_gradient_end: '#4D7C0F', accent: '#84CC16',
                bg_body: '#0B1703', card_bg: '#182F07', bg_card: '#182F07', bg_surface: '#24440B', text_main: '#F7FEE7', text_muted: '#D9F99D', border: '#365314',
                navbar_bg: '#182F07', navbar_text: '#F7FEE7', bottom_bar_bg: '#182F07', bottom_bar_active: '#A3E635', bottom_bar_inactive: '#D9F99D',
                card_border: '#365314', card_title: '#F7FEE7', price_color: '#A3E635', old_price_color: '#D9F99D',
                badge_bg: '#EA580C', badge_text: '#FFFFFF', section_title: '#F7FEE7', category_chip_bg: '#24440B', category_chip_active: '#A3E635', category_chip_text: '#F7FEE7',
                modal_bg: '#182F07', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#365314', btn_primary_bg: '#A3E635', btn_primary_text: '#0B1703', chatbot_btn_bg: '#A3E635'
            }
        },
        typography: { font_family: 'Almarai', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '16px', button_radius: '10px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'turquoise_lagoon',
        name: 'تركواز لاجون استوائي 🏝️',
        category: 'صيف ورحلات',
        description: 'مزيج حيوي من التركواز والأزرق الاستوائي يناسب متاجر الصيف، الرحلات، والرياضات المائية',
        light_theme: {
            colors: {
                primary: '#0284C7', primary_hover: '#0369A1', primary_gradient_start: '#0284C7', primary_gradient_end: '#14B8A6', accent: '#14B8A6',
                bg_body: '#F0FDFA', bg_card: '#FFFFFF', bg_surface: '#CCFBF1', text_main: '#0C4A6E', text_muted: '#0F766E', border: '#99F6E4',
                navbar_bg: '#FFFFFF', navbar_text: '#0C4A6E', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#0284C7', bottom_bar_inactive: '#0F766E',
                card_bg: '#FFFFFF', card_border: '#99F6E4', card_title: '#0C4A6E', price_color: '#0284C7', old_price_color: '#0F766E',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#0C4A6E', category_chip_bg: '#CCFBF1', category_chip_active: '#0284C7', category_chip_text: '#0C4A6E',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(12, 74, 110, 0.6)', modal_handle: '#99F6E4', btn_primary_bg: '#0284C7', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#0284C7'
            }
        },
        dark_theme: {
            colors: {
                primary: '#2DD4BF', primary_hover: '#5EEAD4', primary_gradient_start: '#2DD4BF', primary_gradient_end: '#38BDF8', accent: '#38BDF8',
                bg_body: '#031D24', card_bg: '#08333E', bg_card: '#08333E', bg_surface: '#0D4A59', text_main: '#F0FDFA', text_muted: '#99F6E4', border: '#115E59',
                navbar_bg: '#08333E', navbar_text: '#F0FDFA', bottom_bar_bg: '#08333E', bottom_bar_active: '#2DD4BF', bottom_bar_inactive: '#99F6E4',
                card_border: '#115E59', card_title: '#F0FDFA', price_color: '#2DD4BF', old_price_color: '#99F6E4',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#F0FDFA', category_chip_bg: '#0D4A59', category_chip_active: '#2DD4BF', category_chip_text: '#F0FDFA',
                modal_bg: '#08333E', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#115E59', btn_primary_bg: '#2DD4BF', btn_primary_text: '#031D24', chatbot_btn_bg: '#2DD4BF'
            }
        },
        typography: { font_family: 'Tajawal', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '18px', button_radius: '12px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'french_bronze',
        name: 'برونزي وبني كلاسيك 🏺',
        category: 'أنتيك وجلود',
        description: 'فخامة درجات الجلد والبرونز للمصنوعات اليدوية، السلع الجلدية، والتحف',
        light_theme: {
            colors: {
                primary: '#854D0E', primary_hover: '#713F12', primary_gradient_start: '#854D0E', primary_gradient_end: '#CA8A04', accent: '#CA8A04',
                bg_body: '#FEFCE8', bg_card: '#FFFFFF', bg_surface: '#FEF9C3', text_main: '#422006', text_muted: '#713F12', border: '#FEF08A',
                navbar_bg: '#FFFFFF', navbar_text: '#422006', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#854D0E', bottom_bar_inactive: '#713F12',
                card_bg: '#FFFFFF', card_border: '#FEF08A', card_title: '#422006', price_color: '#854D0E', old_price_color: '#713F12',
                badge_bg: '#B91C1C', badge_text: '#FFFFFF', section_title: '#422006', category_chip_bg: '#FEF9C3', category_chip_active: '#854D0E', category_chip_text: '#422006',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(66, 32, 6, 0.6)', modal_handle: '#FEF08A', btn_primary_bg: '#854D0E', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#854D0E'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FACC15', primary_hover: '#FDE047', primary_gradient_start: '#FACC15', primary_gradient_end: '#854D0E', accent: '#EAB308',
                bg_body: '#1B1202', card_bg: '#312105', bg_card: '#312105', bg_surface: '#473209', text_main: '#FEFCE8', text_muted: '#FEF08A', border: '#713F12',
                navbar_bg: '#312105', navbar_text: '#FEFCE8', bottom_bar_bg: '#312105', bottom_bar_active: '#FACC15', bottom_bar_inactive: '#FEF08A',
                card_border: '#713F12', card_title: '#FEFCE8', price_color: '#FACC15', old_price_color: '#FEF08A',
                badge_bg: '#EA580C', badge_text: '#FFFFFF', section_title: '#FEFCE8', category_chip_bg: '#473209', category_chip_active: '#FACC15', category_chip_text: '#FEFCE8',
                modal_bg: '#312105', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#713F12', btn_primary_bg: '#FACC15', btn_primary_text: '#1B1202', chatbot_btn_bg: '#FACC15'
            }
        },
        typography: { font_family: 'Amiri', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '12px', button_radius: '6px', button_style: 'square', card_style: 'bordered' }
    },
    {
        id: 'soft_lavender',
        name: 'باستيل لافندر هادئ 🪻',
        category: 'كتب وقرطاسية',
        description: 'ألوان الباستيل واللافندر الهادئة والمريحة للمكتبات، متاجر الأطفال، والقرطاسية الراقية',
        light_theme: {
            colors: {
                primary: '#6366F1', primary_hover: '#4F46E5', primary_gradient_start: '#6366F1', primary_gradient_end: '#818CF8', accent: '#818CF8',
                bg_body: '#EEF2FF', bg_card: '#FFFFFF', bg_surface: '#E0E7FF', text_main: '#1E1B4B', text_muted: '#4338CA', border: '#C7D2FE',
                navbar_bg: '#FFFFFF', navbar_text: '#1E1B4B', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#6366F1', bottom_bar_inactive: '#4338CA',
                card_bg: '#FFFFFF', card_border: '#C7D2FE', card_title: '#1E1B4B', price_color: '#6366F1', old_price_color: '#4338CA',
                badge_bg: '#EC4899', badge_text: '#FFFFFF', section_title: '#1E1B4B', category_chip_bg: '#E0E7FF', category_chip_active: '#6366F1', category_chip_text: '#1E1B4B',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(30, 27, 75, 0.6)', modal_handle: '#C7D2FE', btn_primary_bg: '#6366F1', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#6366F1'
            }
        },
        dark_theme: {
            colors: {
                primary: '#818CF8', primary_hover: '#A5B4FC', primary_gradient_start: '#818CF8', primary_gradient_end: '#6366F1', accent: '#A78BFA',
                bg_body: '#0D102B', card_bg: '#171B47', bg_card: '#171B47', bg_surface: '#222863', text_main: '#EEF2FF', text_muted: '#C7D2FE', border: '#3730A3',
                navbar_bg: '#171B47', navbar_text: '#EEF2FF', bottom_bar_bg: '#171B47', bottom_bar_active: '#818CF8', bottom_bar_inactive: '#C7D2FE',
                card_border: '#3730A3', card_title: '#EEF2FF', price_color: '#818CF8', old_price_color: '#C7D2FE',
                badge_bg: '#F43F5E', badge_text: '#FFFFFF', section_title: '#EEF2FF', category_chip_bg: '#222863', category_chip_active: '#818CF8', category_chip_text: '#EEF2FF',
                modal_bg: '#171B47', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#3730A3', btn_primary_bg: '#818CF8', btn_primary_text: '#0D102B', chatbot_btn_bg: '#818CF8'
            }
        },
        typography: { font_family: 'Readex Pro', base_size: '16px', heading_weight: '700' },
        shapes: { card_radius: '20px', button_radius: '9999px', button_style: 'pill', card_style: 'elevated' }
    },
    {
        id: 'burgundy_wine',
        name: 'نبيذي كلاسيكي فاخر 🍷',
        category: 'فخامة وسهرات',
        description: 'أحمر عنابي فاخر وكلاسيكي يعكس أصالة المنتجات الفاخرة وسهرات الأناقة',
        light_theme: {
            colors: {
                primary: '#9F1239', primary_hover: '#881337', primary_gradient_start: '#9F1239', primary_gradient_end: '#BE123C', accent: '#BE123C',
                bg_body: '#FFF1F2', bg_card: '#FFFFFF', bg_surface: '#FFE4E6', text_main: '#4C0519', text_muted: '#881337', border: '#FECDD3',
                navbar_bg: '#FFFFFF', navbar_text: '#4C0519', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#9F1239', bottom_bar_inactive: '#881337',
                card_bg: '#FFFFFF', card_border: '#FECDD3', card_title: '#4C0519', price_color: '#9F1239', old_price_color: '#881337',
                badge_bg: '#881337', badge_text: '#FFFFFF', section_title: '#4C0519', category_chip_bg: '#FFE4E6', category_chip_active: '#9F1239', category_chip_text: '#4C0519',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(76, 5, 25, 0.6)', modal_handle: '#FECDD3', btn_primary_bg: '#9F1239', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#9F1239'
            }
        },
        dark_theme: {
            colors: {
                primary: '#FB7185', primary_hover: '#FDA4AF', primary_gradient_start: '#FB7185', primary_gradient_end: '#9F1239', accent: '#E11D48',
                bg_body: '#1F040C', card_bg: '#3B0A19', bg_card: '#3B0A19', bg_surface: '#520F24', text_main: '#FFF1F2', text_muted: '#FECDD3', border: '#881337',
                navbar_bg: '#3B0A19', navbar_text: '#FFF1F2', bottom_bar_bg: '#3B0A19', bottom_bar_active: '#FB7185', bottom_bar_inactive: '#FECDD3',
                card_border: '#881337', card_title: '#FFF1F2', price_color: '#FB7185', old_price_color: '#FECDD3',
                badge_bg: '#9F1239', badge_text: '#FFFFFF', section_title: '#FFF1F2', category_chip_bg: '#520F24', category_chip_active: '#FB7185', category_chip_text: '#FFF1F2',
                modal_bg: '#3B0A19', modal_overlay: 'rgba(0, 0, 0, 0.85)', modal_handle: '#881337', btn_primary_bg: '#FB7185', btn_primary_text: '#1F040C', chatbot_btn_bg: '#FB7185'
            }
        },
        typography: { font_family: 'Cairo', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '16px', button_radius: '10px', button_style: 'rounded', card_style: 'elevated' }
    },
    {
        id: 'electric_lime',
        name: 'ليموني نيون رياضي 🔋',
        category: 'رياضة ولياقة',
        description: 'أخضر ليموني نيون مشع وحيوي ومناسب للأحذية الرياضية والمكملات واللياقة البدنية',
        light_theme: {
            colors: {
                primary: '#65A30D', primary_hover: '#4D7C0F', primary_gradient_start: '#65A30D', primary_gradient_end: '#84CC16', accent: '#84CC16',
                bg_body: '#F7FEE7', bg_card: '#FFFFFF', bg_surface: '#ECFCCB', text_main: '#1A2E05', text_muted: '#365314', border: '#D9F99D',
                navbar_bg: '#FFFFFF', navbar_text: '#1A2E05', bottom_bar_bg: '#FFFFFF', bottom_bar_active: '#65A30D', bottom_bar_inactive: '#365314',
                card_bg: '#FFFFFF', card_border: '#D9F99D', card_title: '#1A2E05', price_color: '#65A30D', old_price_color: '#365314',
                badge_bg: '#DC2626', badge_text: '#FFFFFF', section_title: '#1A2E05', category_chip_bg: '#ECFCCB', category_chip_active: '#65A30D', category_chip_text: '#1A2E05',
                modal_bg: '#FFFFFF', modal_overlay: 'rgba(26, 46, 5, 0.6)', modal_handle: '#D9F99D', btn_primary_bg: '#65A30D', btn_primary_text: '#FFFFFF', chatbot_btn_bg: '#65A30D'
            }
        },
        dark_theme: {
            colors: {
                primary: '#A3E635', primary_hover: '#BEF264', primary_gradient_start: '#A3E635', primary_gradient_end: '#22C55E', accent: '#22C55E',
                bg_body: '#071302', card_bg: '#112606', bg_card: '#112606', bg_surface: '#1B390B', text_main: '#F7FEE7', text_muted: '#D9F99D', border: '#365314',
                navbar_bg: '#112606', navbar_text: '#F7FEE7', bottom_bar_bg: '#112606', bottom_bar_active: '#A3E635', bottom_bar_inactive: '#D9F99D',
                card_border: '#365314', card_title: '#F7FEE7', price_color: '#A3E635', old_price_color: '#D9F99D',
                badge_bg: '#EF4444', badge_text: '#FFFFFF', section_title: '#F7FEE7', category_chip_bg: '#1B390B', category_chip_active: '#A3E635', category_chip_text: '#F7FEE7',
                modal_bg: '#112606', modal_overlay: 'rgba(0, 0, 0, 0.9)', modal_handle: '#365314', btn_primary_bg: '#A3E635', btn_primary_text: '#071302', chatbot_btn_bg: '#A3E635'
            }
        },
        typography: { font_family: 'Changa', base_size: '16px', heading_weight: '800' },
        shapes: { card_radius: '14px', button_radius: '6px', button_style: 'square', card_style: 'bordered' }
    }
];

export function sanitizeStorefrontConfig(inputConfig: any = {}, _tier: string = 'free'): { sanitizedConfig: StorefrontConfig; notices: string[] } {
    const notices: string[] = [];
    if (!inputConfig || typeof inputConfig !== 'object') {
        return { sanitizedConfig: JSON.parse(JSON.stringify(DEFAULT_STOREFRONT_CONFIG)), notices };
    }

    const merged: StorefrontConfig = {
        ...DEFAULT_STOREFRONT_CONFIG,
        ...inputConfig,
        store_identity: { ...DEFAULT_STOREFRONT_CONFIG.store_identity, ...(inputConfig.store_identity || {}) },
        products_settings: { ...DEFAULT_STOREFRONT_CONFIG.products_settings, ...(inputConfig.products_settings || {}) },
        messages: { ...DEFAULT_STOREFRONT_CONFIG.messages, ...(inputConfig.messages || {}) },
        modals_customization: { ...DEFAULT_STOREFRONT_CONFIG.modals_customization, ...(inputConfig.modals_customization || {}) },
        light_theme: {
            ...DEFAULT_STOREFRONT_CONFIG.light_theme,
            ...(inputConfig.light_theme || {}),
            colors: { ...DEFAULT_STOREFRONT_CONFIG.light_theme.colors, ...(inputConfig.light_theme?.colors || inputConfig.modes?.light?.colors || {}) }
        },
        dark_theme: {
            ...DEFAULT_STOREFRONT_CONFIG.dark_theme,
            ...(inputConfig.dark_theme || {}),
            colors: { ...DEFAULT_STOREFRONT_CONFIG.dark_theme.colors, ...(inputConfig.dark_theme?.colors || inputConfig.modes?.dark?.colors || {}) }
        },
        typography: { ...DEFAULT_STOREFRONT_CONFIG.typography, ...(inputConfig.typography || {}) },
        shapes: { ...DEFAULT_STOREFRONT_CONFIG.shapes, ...(inputConfig.shapes || {}) },
        navigation_settings: {
            bottom_bar: {
                items: normalizeBottomNavItems(inputConfig.navigation_settings?.bottom_bar?.items)
            },
            top_bar: normalizeTopBarSettings({
                ...DEFAULT_STOREFRONT_CONFIG.navigation_settings!.top_bar,
                ...(inputConfig.navigation_settings?.top_bar || {})
            })
        },
        marketing: { ...DEFAULT_STOREFRONT_CONFIG.marketing, ...(inputConfig.marketing || {}) },
        layout_blocks: Array.isArray(inputConfig.layout_blocks) && inputConfig.layout_blocks.length > 0 
            ? inputConfig.layout_blocks 
            : DEFAULT_STOREFRONT_CONFIG.layout_blocks
    };

    const safeNavigationSettings = merged.navigation_settings ?? DEFAULT_STOREFRONT_CONFIG.navigation_settings!;
    const visibleBottomCount = safeNavigationSettings.bottom_bar.items.filter((item: any) => item.visible !== false).length;
    if (visibleBottomCount < 2) {
        safeNavigationSettings.bottom_bar.items = DEFAULT_STOREFRONT_CONFIG.navigation_settings!.bottom_bar.items.map((item, index) => ({
            ...item,
            visible: index < 2,
            order: index + 1
        }));
        merged.navigation_settings = safeNavigationSettings;
        notices.push('تم إصلاح الشريط السفلي للحفاظ على عنصرين مرئيين على الأقل.');
    }

    return { sanitizedConfig: merged, notices };
}
