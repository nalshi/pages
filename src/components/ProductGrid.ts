/**
 * ========================================================
 * 🏬 ProductGrid.ts - واجهة المتجر الرئيسية الأصلية فائقة السرعة
 * تشمل: كرت الهيرو الديناميكي، صور الكولاج، شرائط الفئات ذات
 * التدرجات اللونية (18 ثيم)، والأقسام المتعددة والسلايدرات
 * ========================================================
 */

import { state } from '../core/StoreState';
import { events } from '../core/EventBus';
import { ProductCard } from './ProductCard';
import { Product, Category } from '../types';

export const CATEGORY_THEMES = [
  { c1: '#FF6B6B', c2: '#FF8E53', icon: 'fa-fire' },
  { c1: '#4E65FF', c2: '#5FC7FF', icon: 'fa-bolt' },
  { c1: '#00C9A7', c2: '#4BE3B4', icon: 'fa-leaf' },
  { c1: '#F857A6', c2: '#FF5D8F', icon: 'fa-heart' },
  { c1: '#8E2DE2', c2: '#C471ED', icon: 'fa-star' },
  { c1: '#11998E', c2: '#38EF7D', icon: 'fa-gem' },
  { c1: '#FC5C7D', c2: '#6A82FB', icon: 'fa-crown' },
  { c1: '#F2994A', c2: '#F2C94C', icon: 'fa-sun' },
  { c1: '#654EA3', c2: '#B196E8', icon: 'fa-moon' },
  { c1: '#1F4287', c2: '#278EA5', icon: 'fa-shield-alt' },
  { c1: '#D65DB1', c2: '#FF6F91', icon: 'fa-gift' },
  { c1: '#0BA360', c2: '#3CBA92', icon: 'fa-feather-alt' },
  { c1: '#EB5757', c2: '#F2994A', icon: 'fa-rocket' },
  { c1: '#2F80ED', c2: '#56CCF2', icon: 'fa-snowflake' },
  { c1: '#9B51E0', c2: '#BB6BD9', icon: 'fa-magic' },
  { c1: '#27AE60', c2: '#6FCF97', icon: 'fa-seedling' },
  { c1: '#F2C94C', c2: '#F2994A', icon: 'fa-award' },
  { c1: '#EB5757', c2: '#9B51E0', icon: 'fa-compass' },
];

export class ProductGrid {
  private static mainContentEl: HTMLElement | null = null;
  private static activeTab: string = '';

  public static hashCategoryName(str: string): number {
    let h = 0;
    str = str || '';
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  public static getCategoryIdentity(name: string, index: number = 0): { c1: string; c2: string; icon: string; shape: number } {
    const h = this.hashCategoryName(name);
    const theme = CATEGORY_THEMES[h % CATEGORY_THEMES.length];
    const shape = (h + index) % 4;
    return { c1: theme.c1, c2: theme.c2, icon: theme.icon, shape };
  }

  public static init(): void {
    this.mainContentEl = document.getElementById('main-content');
    if (!this.mainContentEl) return;

    this.bindEvents();
  }

  private static bindEvents(): void {
    events.on('products:loaded', () => this.render());
    events.on('categories:loaded', () => this.render());
    events.on('category:selected', (catId) => {
      this.activeTab = String(catId);
      this.render();
    });
    events.on('config:updated', () => this.render());
  }

  public static buildStoreHero(): string {
    const cfg = state.config;
    const storeName = cfg?.store_identity?.store_name || 'متجر نالش';
    const slogan = cfg?.store_identity?.slogan || 'أهلاً بكم في متجرنا! نسعد بتقديم أرقى المنتجات بأفضل الأسعار.';
    const phone = cfg?.store_identity?.phone || '770000000';
    const hashId = this.getCategoryIdentity(storeName, 0);
    const gradient = `linear-gradient(135deg, ${hashId.c1}, ${hashId.c2})`;

    // Collage background from active product images
    let collageHtml = '';
    const images = state.products
      .map((p) => p.image)
      .filter(Boolean)
      .slice(0, 12);

    if (images.length > 0) {
      const imgTags = images.map((img) => `<img src="${ProductCard.getOptimizedImageUrl(img!)}" loading="lazy">`).join('');
      collageHtml = `<div class="dsc-collage count-${images.length}">${imgTags}</div>`;
    }

    return `
      <div class="fade-in-item store-hero-wrapper"> 
        <div class="dynamic-store-card ${collageHtml ? 'has-collage' : ''}">
          ${collageHtml}
          <div class="dsc-gradient-overlay" style="background: ${gradient};"></div>
          <div class="dsc-cover"></div>
          
          <div class="dsc-body">
            <h1 class="dsc-name">${ProductCard.escapeHTML(storeName)}</h1>
            <div class="dsc-username">@nalsh_store</div>
            <p class="dsc-bio">${ProductCard.escapeHTML(slogan)}</p>
            
            <div class="dsc-info-grid">
              <a href="https://maps.google.com" target="_blank" class="dsc-info-item" style="text-decoration:none;">
                <i class="fas fa-map-marker-alt" style="color: ${hashId.c1}"></i>
                <span>موقع المتجر</span>
              </a>
              <a href="tel:${phone}" class="dsc-info-item" style="cursor:pointer; text-decoration:none;">
                <i class="fas fa-phone-alt" style="color: ${hashId.c1}"></i>
                <span dir="ltr">${phone}</span>
              </a>
              <div class="dsc-info-item">
                <i class="fas fa-motorcycle" style="color: ${hashId.c1}"></i>
                <span>توصيل نالش</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modern-search-wrapper">
          <div class="search-input-box" onclick="window.NalshStorefront?.toggleSearch(true)">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="modern-search-input" placeholder="ابحث عن منتج داخل المتجر..." readonly>
          </div>
        </div>
      </div>
    `;
  }

  public static buildCategoryChips(): string {
    const cats = state.categories.length > 0 ? state.categories : this.extractCategoriesFromProducts();
    if (cats.length === 0) return '';

    const activeCat = this.activeTab || 'all';

    const chips = cats.map((cat, idx) => {
      const id = this.getCategoryIdentity(cat.name, idx);
      const isSelected = activeCat === cat.id || activeCat === cat.name;
      return `
        <button class="cat-chip cat-shape-${id.shape} ${isSelected ? 'active' : ''}" 
                style="--c1:${id.c1};--c2:${id.c2};"
                onclick="window.NalshStorefront?.selectCategory('${ProductCard.escapeJsAttr(String(cat.id || cat.name))}')">
          <span class="cat-chip-icon"><i class="fas ${id.icon}"></i></span>
          <span class="cat-chip-label">${ProductCard.escapeHTML(cat.name)}</span>
        </button>
      `;
    }).join('');

    return `<div id="home-category-chips" class="cat-chips-strip">${chips}</div>`;
  }

  private static extractCategoriesFromProducts(): Category[] {
    const names = Array.from(new Set(state.products.map((p) => p.category).filter(Boolean)));
    const list: Category[] = [{ id: 'all', name: 'الكل' }];
    names.forEach((name) => list.push({ id: name, name }));
    return list;
  }

  public static render(): void {
    if (!this.mainContentEl) return;

    if (state.products.length === 0) {
      this.mainContentEl.innerHTML = `
        ${this.buildStoreHero()}
        <div class="empty-store-state fade-in-item" style="text-align:center; padding:50px 20px;">
          <i class="fas fa-box-open" style="font-size:3.5rem; color:var(--text-muted); opacity:0.4; margin-bottom:15px; display:block;"></i>
          <h3 style="font-weight:900; margin-bottom:8px;">المتجر قيد التجهيز</h3>
          <p style="color:var(--text-muted);">عد إلينا قريباً لإضافة تشكيلة مميزة من المنتجات!</p>
        </div>
      `;
      return;
    }

    const displayMode = state.config?.products_settings?.display_mode || 'by_categories_sections';
    let html = this.buildStoreHero();
    html += this.buildCategoryChips();

    // Mode 1: Unified Flat Grid
    if (displayMode === 'all_grid') {
      const prods = this.getFilteredProducts();
      html += `
        <div class="store-category-block fade-in-item" style="padding:10px 15px 30px;">
          <div class="product-grid ultra-product-grid">
            ${prods.map((p) => ProductCard.render(p)).join('')}
          </div>
        </div>
      `;
      this.mainContentEl.innerHTML = html;
      return;
    }

    // Mode 2: By Categories Sections (Original Default)
    const cats = state.categories.filter((c) => c.id !== 'all' && c.name !== 'الكل');
    const categoriesToRender = cats.length > 0 ? cats : this.extractCategoriesFromProducts().filter((c) => c.id !== 'all');

    // Section for Featured / Discounted products
    const discounted = state.products.filter((p) => ProductCard.parsePrice(p).discount > 0);
    if (discounted.length > 0) {
      html += `
        <div class="store-category-block fade-in-item" id="featured-block">
          <h3 class="store-category-title" style="font-size:1.15rem; font-weight:900; margin:0 20px 15px; display:flex; align-items:center; gap:10px;">
            <div class="cat-title-icon" style="background:linear-gradient(135deg, #EF4444, #F97316); width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white;">
              <i class="fas fa-fire"></i>
            </div>
            <span style="flex:1;">عروض وخصومات مميزة 🔥 <span style="font-size:0.8rem; color:var(--text-muted); font-weight:bold;">(${discounted.length})</span></span>
          </h3>
          <div class="horizontal-scroller virtual-scroller" style="display:flex; gap:14px; overflow-x:auto; padding:0 20px 20px; scrollbar-width:none;">
            ${discounted.map((p) => ProductCard.render(p, { isHorizontal: true })).join('')}
          </div>
        </div>
      `;
    }

    // Render each category block
    categoriesToRender.forEach((cat, idx) => {
      const catProds = state.products.filter((p) => p.category === cat.name || p.category_id === cat.id);
      if (catProds.length === 0) return;

      const id = this.getCategoryIdentity(cat.name, idx);

      html += `
        <div class="store-category-block fade-in-item" id="cat-block-${idx}">
          <h3 class="store-category-title" style="font-size:1.15rem; font-weight:900; margin:20px 20px 15px; display:flex; align-items:center; gap:10px;">
            <div class="cat-title-icon" style="background:linear-gradient(135deg, ${id.c1}, ${id.c2}); width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white;">
              <i class="fas ${id.icon}"></i>
            </div>
            <span style="flex:1;">${ProductCard.escapeHTML(cat.name)} <span style="font-size:0.8rem; color:var(--text-muted); font-weight:bold;">(${catProds.length})</span></span>
          </h3>
          <div class="horizontal-scroller virtual-scroller" style="display:flex; gap:14px; overflow-x:auto; padding:0 20px 20px; scrollbar-width:none;">
            ${catProds.map((p) => ProductCard.render(p, { isHorizontal: true })).join('')}
          </div>
        </div>
      `;
    });

    this.mainContentEl.innerHTML = html;
  }

  private static getFilteredProducts(): Product[] {
    if (!this.activeTab || this.activeTab === 'all' || this.activeTab === 'الكل') {
      return state.products;
    }
    return state.products.filter((p) => p.category === this.activeTab || p.category_id === this.activeTab);
  }
}
