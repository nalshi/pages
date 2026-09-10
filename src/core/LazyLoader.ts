/**
 * ========================================================
 * 🚀 LazyLoader.ts - نظام التحميل الكسول الذكي عند الطلب
 * ========================================================
 */

export class LazyLoader {
  private static loadedScripts: Set<string> = new Set();
  private static loadedStyles: Set<string> = new Set();
  private static loadingPromises: Map<string, Promise<void>> = new Map();

  /**
   * تحميل ملف جافاسكربت بشكل غير متزامن مع التخزين المؤقت
   */
  public static loadScript(src: string): Promise<void> {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        this.loadedScripts.add(src);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        this.loadedScripts.add(src);
        this.loadingPromises.delete(src);
        resolve();
      };
      script.onerror = (err) => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * تحميل ملف تنسيق CSS بشكل غير متزامن وغير حاجب للرندر
   */
  public static loadStyle(href: string): Promise<void> {
    if (this.loadedStyles.has(href)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) {
        this.loadedStyles.add(href);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      link.onerror = () => {
        console.warn(`[LazyLoader] Failed to load stylesheet: ${href}`);
        resolve(); // Don't block app on style failure
      };
      document.head.appendChild(link);
    });
  }

  /**
   * تحميل حزمة الخرائط والتوجيه فقط عند فتح الخريطة
   */
  public static async loadMapSuite(): Promise<void> {
    if ((window as any).L && (window as any).L.Routing) {
      return;
    }

    // Load styles in parallel
    await Promise.all([
      this.loadStyle('css/leaflet.css'),
      this.loadStyle('css/Control.Geocoder.css'),
      this.loadStyle('css/leaflet-routing-machine.css'),
    ]);

    // Load Leaflet Core first, then plugins
    if (!(window as any).L) {
      await this.loadScript('js/leaflet.js');
    }

    await Promise.all([
      this.loadScript('js/Control.Geocoder.js'),
      this.loadScript('js/leaflet-routing-machine.js'),
    ]);
  }

  /**
   * تحميل مكتبة توليد رمز الاستجابة السريعة (QRious) عند الحاجة
   */
  public static async loadQR(): Promise<void> {
    if ((window as any).QRious) {
      return;
    }
    await this.loadScript('js/qrious.min.js');
  }

  /**
   * تحميل مكتبة البحث الضبابي (Fuse.js)
   */
  public static async loadFuse(): Promise<void> {
    if ((window as any).Fuse) {
      return;
    }
    await this.loadScript('https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js');
  }
}
