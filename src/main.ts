/**
 * ========================================================
 * 🚀 main.ts - الجسر الذكي بين TypeScript والملفات الأصلية
 * ========================================================
 * 
 * المبدأ:
 * - ملفات js/ الأصلية تعمل كما هي بكامل الشكل والوظائف
 * - TypeScript هنا يتولى:
 *   1. المزامنة الحية مع الاستوديو (store-builder.html)
 *   2. إدارة الإعدادات والثيم (ThemeEngine)
 *   3. الأحداث المشتركة بين المكونات (EventBus)
 *   4. الوظائف المساعدة وسلامة الأنواع (Type Safety)
 * ========================================================
 */

import { themeEngine } from './core/ThemeEngine';
import { events } from './core/EventBus';

// --- نقطة التشغيل: انتظار تهيئة محرك app.js الأصلي أولاً ---
const tryInit = (retries = 0) => {
  if (typeof (window as any).bootJAMstack === 'function') {
    bootNalshBridge();
  } else if (retries < 30) {
    setTimeout(() => tryInit(retries + 1), 200);
  }
};

function bootNalshBridge(): void {
  console.log('⚡ [Nalsh TS Bridge] Initializing...');

  // 1. تحميل ثيم الاستوديو الأولي
  loadInitialTheme();

  // 2. ربط الاستوديو للمزامنة الحية
  bindStudioSync();

  // 3. ربط حالة الوضع الداكن
  syncDarkMode();

  // 4. تهيئة محرك StorefrontEngine القديم من TS (للاستوديو)
  exposeStorefrontCompatAPI();

  console.log('✅ [Nalsh TS Bridge] Ready — all original JS features active.');
}

/** تحميل إعدادات الثيم المحفوظة والسحابية وتطبيقها فوراً مع عزل كل متجر */
function loadInitialTheme(): void {
  try {
    themeEngine.loadInitial();
  } catch (e) {
    // تجاهل هادئ
  }
}

/** المزامنة الحية مع استوديو المصمم عبر window.postMessage */
function bindStudioSync(): void {
  window.addEventListener('message', (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return;
    
    const { type, payload } = event.data;

    switch (type) {
      case 'NALSH_CONFIG_UPDATE':
      case 'STORE_CONFIG_UPDATED':
      case 'NALSH_THEME_UPDATE': {
        const liveConfig = payload || event.data.config;
        if (typeof event.data._preview_dark === 'boolean') {
          const isDark = event.data._preview_dark;
          document.documentElement.classList.toggle('dark-mode', isDark);
          if (document.body) document.body.classList.toggle('dark-mode', isDark);
        }
        if (liveConfig) {
          // تطبيق الإعدادات عبر محرك الثيم
          themeEngine.applyConfig(liveConfig);
          
          // تعيين الـ config العالمي
          (window as any).currentStorefrontConfig = liveConfig;
          
          // استدعاء initStorefront (من storefront-engine.js) — هو سيستدعي applyLiveConfig تلقائياً
          if (typeof (window as any).initStorefront === 'function') {
            (window as any).initStorefront(liveConfig);
          } else if (typeof (window as any).HomeUI?.applyLiveConfig === 'function') {
            // fallback إذا storefront-engine لم يُحمَّل
            (window as any).HomeUI.applyLiveConfig(liveConfig);
          }

          // حفظ الإعدادات
          try {
            const storeKey = getTargetStoreKey();
            if (storeKey) {
              localStorage.setItem(`nalsh_storefront_config_${storeKey}`, JSON.stringify(liveConfig));
            }
          } catch (e) { /* noop */ }
        }

        function getTargetStoreKey(): string {
          const params = new URLSearchParams(window.location.search);
          const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
          const pathStore = pathParts.length > 0 && !['', 'index.html', 'store-builder.html', 'login.html'].includes(pathParts[0].toLowerCase())
            ? pathParts[0]
            : '';
          return (params.get('store') || pathStore).trim().toLowerCase();
        }
        break;
      }
      
      case 'NALSH_TOGGLE_DARK_MODE': {
        const isDark = typeof event.data.darkMode === 'boolean' 
          ? event.data.darkMode 
          : (typeof payload?.darkMode === 'boolean' ? payload.darkMode : !document.documentElement.classList.contains('dark-mode'));
        document.documentElement.classList.toggle('dark-mode', isDark);
        if (document.body) document.body.classList.toggle('dark-mode', isDark);
        try { localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled'); } catch (e) {}
        if ((window as any).StorefrontEngine?.reapplyActiveMode) {
          (window as any).StorefrontEngine.reapplyActiveMode();
        }
        break;
      }

      case 'PREVIEW_PRODUCT':
        if (payload?.id && typeof (window as any).toggleProductModal === 'function') {
          const prod = ((window as any).allProducts || []).find(
            (p: any) => String(p.id) === String(payload.id)
          );
          if (prod) (window as any).toggleProductModal(true, prod);
        }
        break;

      default:
        break;
    }
  });
}

/** مزامنة حالة الوضع الداكن مع نظام CSS الأصلي */
function syncDarkMode(): void {
  const isStudio = window.location.search.includes('preview=studio') || window.self !== window.top;
  if (isStudio) return;
  const pref = localStorage.getItem('darkMode');
  if (pref === 'enabled') {
    document.documentElement.classList.add('dark-mode');
  } else if (pref === 'disabled') {
    document.documentElement.classList.remove('dark-mode');
  }
}

/** كشف API متوافق مع الاستوديو القديم والجديد */
function exposeStorefrontCompatAPI(): void {
  // تصدير StorefrontEngine.init للاستوديو القديم (لا يُعيّن initStorefront إذا كان storefront-engine.js موجوداً)
  if (!(window as any).StorefrontEngine) {
    (window as any).StorefrontEngine = {
      init: (cfg: any) => themeEngine.applyConfig(cfg),
      getConfig: () => (window as any).currentStorefrontConfig || null,
    };
  }

  // دالة مساعدة لإعادة الرسم عند تغيير الثيم (من EventBus الداخلي)
  events.on('config:updated', (cfg: any) => {
    (window as any).currentStorefrontConfig = cfg;
    if (typeof (window as any).HomeUI?.applyLiveConfig === 'function') {
      (window as any).HomeUI.applyLiveConfig(cfg);
    }
  });
}

// --- التشغيل ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => tryInit());
} else {
  tryInit();
}
