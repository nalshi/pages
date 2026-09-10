/**
 * ========================================================
 * 🎨 Studio Color Utilities & Multi-Seed AI HSL Generator v4.0
 * محرك توليد وتنسيق الألوان الذكي المتقدم للوضعين الفاتح والداكن
 * ========================================================
 */

import { ColorScheme } from '../types';

export function normalizeHexColor(hex?: string, fallback = '#4F46E5'): string {
    if (typeof hex !== 'string') return fallback;
    let value = hex.trim();
    if (!value) return fallback;

    const namedColors: Record<string, string> = {
        black: '#000000', white: '#FFFFFF', gray: '#808080', grey: '#808080',
        red: '#EF4444', blue: '#3B82F6', green: '#10B981', yellow: '#F59E0B',
        orange: '#F97316', purple: '#8B5CF6', pink: '#EC4899', brown: '#92400E',
        navy: '#1E3A8A', maroon: '#991B1B', teal: '#14B8A6', olive: '#65A30D',
        silver: '#E2E8F0', cyan: '#06B6D4', magenta: '#D946EF', indigo: '#4F46E5',
        rose: '#F43F5E', amber: '#D97706', emerald: '#059669', violet: '#7C3AED'
    };
    const lower = value.toLowerCase();
    if (namedColors[lower]) return namedColors[lower].toUpperCase();

    // Check if it's rgb(...) or rgba(...)
    const rgbMatch = value.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
    if (rgbMatch) {
        const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10)));
        const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10)));
        const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10)));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    }

    // Check if it's hsl(...) or hsla(...)
    const hslMatch = value.match(/hsla?\s*\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%/i);
    if (hslMatch) {
        const h = parseFloat(hslMatch[1]);
        const s = parseFloat(hslMatch[2]);
        const l = parseFloat(hslMatch[3]);
        return hslToHex(h, s, l);
    }

    if (value[0] !== '#') value = '#' + value;

    // Expand 3-digit hex #RGB -> #RRGGBB
    if (value.length === 4 && /^#[0-9A-Fa-f]{3}$/.test(value)) {
        value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }

    // Truncate 8-digit hex #RRGGBBAA -> #RRGGBB
    if (value.length === 9 && /^#[0-9A-Fa-f]{8}$/.test(value)) {
        value = value.slice(0, 7);
    }

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value.toUpperCase();
    return fallback;
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const normalized = normalizeHexColor(hex, '#4F46E5');
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
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            default: h = ((r - g) / d + 4) / 6;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
    const hue = ((h % 360) + 360) % 360;
    const sat = Math.max(0, Math.min(100, s)) / 100;
    const light = Math.max(0, Math.min(100, l)) / 100;
    const a = sat * Math.min(light, 1 - light);
    const f = (n: number) => {
        const k = (n + hue / 30) % 12;
        const c = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function generateAccent(hex: string): string {
    const safeHex = normalizeHexColor(hex, '#4F46E5');
    const { h, s, l } = hexToHSL(safeHex);
    if (s <= 12) {
        const accentHue = l > 60 ? 220 : 200;
        const accentSat = l > 60 ? 26 : 32;
        const accentLight = l > 60 ? 62 : 52;
        return hslToHex(accentHue, accentSat, accentLight);
    }
    return hslToHex((h + 150) % 360, Math.max(65, s), 50);
}

export function contrastText(hex: string): string {
    const safeHex = normalizeHexColor(hex, '#4F46E5');
    const r = parseInt(safeHex.slice(1, 3), 16);
    const g = parseInt(safeHex.slice(3, 5), 16);
    const b = parseInt(safeHex.slice(5, 7), 16);
    // Standard relative luminance / YIQ perceived brightness
    const yiq = (0.299 * r + 0.587 * g + 0.114 * b);
    return yiq > 152 ? '#0F172A' : '#FFFFFF';
}

export interface PaletteSeeds {
    primary?: string;
    bg?: string;
    text?: string;
    accent?: string;
}

/**
 * ☀️ توليد لوحة الوضع الفاتح الذكية بناءً على عدة مدخلات ألوان (Multi-Seed)
 */
export function buildLightPaletteFromSeeds(seeds: PaletteSeeds = {}): ColorScheme {
    const primarySeed = normalizeHexColor(seeds.primary, '#4F46E5');
    const { h: pH, s: pS, l: pL } = hexToHSL(primarySeed);

    const primaryFinal = pL > 85 ? hslToHex(pH, Math.max(60, pS), 55) : (pL < 20 ? hslToHex(pH, pS, 35) : primarySeed);
    const primaryContrast = contrastText(primaryFinal);
    const accentFinal = seeds.accent ? normalizeHexColor(seeds.accent) : generateAccent(primarySeed);
    const hoverColor = hslToHex(pH, Math.min(100, pS + 6), Math.max(20, pL - 10));

    // معالجة الخلفية
    let bgBody: string;
    let bgCard: string;
    let bgSurface: string;
    let border: string;

    if (seeds.bg && seeds.bg.trim()) {
        const rawBg = normalizeHexColor(seeds.bg);
        const { h: bgH, s: bgS, l: bgL } = hexToHSL(rawBg);
        // إذا اختار المستخدم لوناً داكناً بالخطأ كخلفية للوضع الفاتح، نحوله لنفس الصبغة بدرجة فاتحة نقية
        const safeBgL = bgL < 75 ? 97 : bgL;
        bgBody = hslToHex(bgH, Math.min(25, bgS), safeBgL);
        bgCard = '#FFFFFF';
        bgSurface = hslToHex(bgH, Math.min(20, bgS), Math.max(90, safeBgL - 3));
        border = hslToHex(bgH, Math.min(30, bgS + 5), Math.max(82, safeBgL - 9));
    } else {
        const neutralHue = pS <= 12 ? 215 : pH;
        bgBody = hslToHex(neutralHue, 12, 98);
        bgCard = '#FFFFFF';
        bgSurface = hslToHex(neutralHue, 14, 95);
        border = hslToHex(neutralHue, 18, 90);
    }

    // معالجة النصوص
    let textMain: string;
    let textMuted: string;
    if (seeds.text && seeds.text.trim()) {
        const rawText = normalizeHexColor(seeds.text);
        const { h: tH, s: tS, l: tL } = hexToHSL(rawText);
        const safeTextL = tL > 45 ? 12 : tL;
        textMain = hslToHex(tH, Math.min(35, tS), safeTextL);
        textMuted = hslToHex(tH, Math.max(0, tS - 10), Math.min(60, safeTextL + 30));
    } else {
        textMain = '#0F172A';
        textMuted = '#64748B';
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
        border: border,
        navbar_bg: bgCard,
        navbar_text: textMain,
        bottom_bar_bg: bgCard,
        bottom_bar_active: primaryFinal,
        bottom_bar_inactive: '#94A3B8',
        card_bg: bgCard,
        card_border: border,
        card_title: textMain,
        price_color: primaryFinal,
        old_price_color: '#94A3B8',
        badge_bg: '#EF4444',
        badge_text: '#FFFFFF',
        section_title: textMain,
        category_chip_bg: bgSurface,
        category_chip_active: primaryFinal,
        category_chip_text: textMain,
        modal_bg: bgCard,
        modal_overlay: 'rgba(15, 23, 42, 0.55)',
        modal_handle: '#CBD5E1',
        btn_primary_bg: primaryFinal,
        btn_primary_text: primaryContrast,
        chatbot_btn_bg: primaryFinal,
        toast_bg: textMain,
        toast_text: '#FFFFFF'
    };
}

/**
 * 🌙 توليد لوحة الوضع الداكن الذكية مع احترام واشتقاق الألوان الفخمة (Multi-Seed)
 */
export function buildDarkPaletteFromSeeds(seeds: PaletteSeeds = {}): ColorScheme {
    const primarySeed = normalizeHexColor(seeds.primary, '#6366F1');
    const { h: pH, s: pS, l: pL } = hexToHSL(primarySeed);

    // تفتيح اللون الأساسي ليكون بارزاً ومضيئاً في الوضع الداكن
    const darkL = pL < 45 ? Math.min(pL + 22, 68) : Math.min(pL + 6, 75);
    const darkPrimary = hslToHex(pH, pS <= 12 ? Math.max(pS, 20) : Math.min(pS + 10, 92), darkL);
    const darkAccent = seeds.accent ? normalizeHexColor(seeds.accent) : generateAccent(primarySeed);
    const btnText = contrastText(darkPrimary);
    const hoverColor = hslToHex(pH, Math.min(92, pS + 6), Math.min(darkL + 8, 82));

    // معالجة الخلفية الداكنة بدقة واشتقاق كروت أنيقة من نفس نغمة اللون
    let bgBody: string;
    let bgCard: string;
    let bgSurface: string;
    let border: string;
    let navBg: string;

    if (seeds.bg && seeds.bg.trim()) {
        const rawBg = normalizeHexColor(seeds.bg);
        const { h: bgH, s: bgS, l: bgL } = hexToHSL(rawBg);
        
        // إذا اختار المستخدم لوناً فاتحاً كخلفية للوضع الداكن بالخطأ، نحوله تلقائياً لنفس صبغته لكن بدرجة داكنة فخمة
        const safeBgL = bgL > 30 ? 7 : Math.max(4, bgL);
        bgBody = hslToHex(bgH, Math.min(40, Math.max(12, bgS)), safeBgL);
        
        // اشتقاق كروت وسطوح أعلى في الإضاءة لعمق ثلاثي الأبعاد مع قيم HEX صلبة وصالحة 100%
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

    // معالجة النصوص الداكنة
    let textMain: string;
    let textMuted: string;
    if (seeds.text && seeds.text.trim()) {
        const rawText = normalizeHexColor(seeds.text);
        const { h: tH, s: tS, l: tL } = hexToHSL(rawText);
        const safeTextL = tL < 65 ? 96 : tL;
        textMain = hslToHex(tH, Math.min(25, tS), safeTextL);
        textMuted = hslToHex(tH, Math.max(0, tS - 10), Math.max(50, safeTextL - 32));
    } else {
        textMain = '#F8FAFC';
        textMuted = '#94A3B8';
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
        border: border,
        navbar_bg: navBg,
        navbar_text: textMain,
        bottom_bar_bg: navBg,
        bottom_bar_active: darkPrimary,
        bottom_bar_inactive: '#64748B',
        card_bg: bgCard,
        card_border: border,
        card_title: textMain,
        price_color: hoverColor,
        old_price_color: '#64748B',
        badge_bg: '#EF4444',
        badge_text: '#FFFFFF',
        section_title: textMain,
        category_chip_bg: bgSurface,
        category_chip_active: darkPrimary,
        category_chip_text: textMain,
        modal_bg: bgCard,
        modal_overlay: 'rgba(0, 0, 0, 0.85)',
        modal_handle: '#475569',
        btn_primary_bg: darkPrimary,
        btn_primary_text: btnText,
        chatbot_btn_bg: darkPrimary,
        toast_bg: bgSurface,
        toast_text: textMain
    };
}

/**
 * توافق مع الدوال القديمة (Backward Compatibility)
 */
export function buildLightPalette(seed: string): ColorScheme {
    return buildLightPaletteFromSeeds({ primary: seed });
}

export function buildDarkPalette(seed: string): ColorScheme {
    return buildDarkPaletteFromSeeds({ primary: seed });
}
