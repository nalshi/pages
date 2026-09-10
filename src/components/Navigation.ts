/**
 * ========================================================
 * 🧭 Navigation.ts - شريط التنقل العلوي والسفلي المتجاوب
 * ========================================================
 */

import { state } from '../core/StoreState';
import { events } from '../core/EventBus';

export class Navigation {
  private static navWrapper: HTMLElement | null = null;

  public static init(): void {
    this.navWrapper = document.getElementById('navigation-wrapper');
    if (!this.navWrapper) return;

    this.render();
    this.bindEvents();
  }

  public static render(): void {
    if (!this.navWrapper) return;

    const cart = state.getCart();
    const favCount = state.favorites.size;
    const isDark = document.documentElement.classList.contains('dark-mode');
    const storeName = state.config?.store_identity?.store_name || 'نالش';

    this.navWrapper.innerHTML = `
      <!-- الشريط العلوي الفائق الحداثة -->
      <header class="header-container transition-element">
        <div class="header-inner">
          <div class="header-right">
            <button class="nav-icon-btn" onclick="window.NalshStorefront?.toggleSearch(true)" aria-label="بحث">
              <i class="fas fa-search"></i>
            </button>
            <button class="nav-icon-btn" onclick="window.NalshStorefront?.toggleDarkMode()" aria-label="الوضع الداكن">
              <i class="${isDark ? 'fas fa-sun' : 'fas fa-moon'}"></i>
            </button>
          </div>

          <div class="header-center">
            <div class="store-brand" onclick="window.NalshStorefront?.scrollToTop()">
              <span class="brand-text">${storeName}</span>
            </div>
          </div>

          <div class="header-left">
            <button class="nav-icon-btn" onclick="window.NalshStorefront?.openFavorites()" aria-label="المفضلة">
              <i class="far fa-heart"></i>
              <span class="badge-count fav-badge-count" style="${favCount > 0 ? '' : 'display:none;'}">${favCount}</span>
            </button>
            <button class="nav-icon-btn cart-btn-top" onclick="window.NalshStorefront?.openCart()" aria-label="سلة المشتريات">
              <i class="fas fa-shopping-bag"></i>
              <span class="badge-count cart-badge-count" style="${cart.totalItems > 0 ? '' : 'display:none;'}">${cart.totalItems}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- الشريط السفلي للجوال -->
      <nav id="mobile-bar" class="bottom-nav-container">
        <button class="bottom-nav-item active" onclick="window.NalshStorefront?.navigateTo('home')">
          <i class="fas fa-store"></i>
          <span>الرئيسية</span>
        </button>
        <button class="bottom-nav-item" onclick="window.NalshStorefront?.toggleSearch(true)">
          <i class="fas fa-search"></i>
          <span>بحث</span>
        </button>
        <button class="bottom-nav-item cart-bottom-item" onclick="window.NalshStorefront?.openCart()">
          <div class="cart-icon-wrapper">
            <i class="fas fa-shopping-bag"></i>
            <span class="badge-count cart-badge-count" style="${cart.totalItems > 0 ? '' : 'display:none;'}">${cart.totalItems}</span>
          </div>
          <span>السلة</span>
        </button>
        <button class="bottom-nav-item" onclick="window.NalshStorefront?.openOrders()">
          <i class="fas fa-receipt"></i>
          <span>طلباتي</span>
        </button>
        <button class="bottom-nav-item" onclick="window.NalshStorefront?.openProfile()">
          <i class="far fa-user"></i>
          <span>حسابي</span>
        </button>
      </nav>
    `;
  }

  private static bindEvents(): void {
    events.on('cart:updated', () => this.updateBadges());
    events.on('favorites:updated', () => this.updateBadges());
    events.on('user:changed', () => this.render());
  }

  public static updateBadges(): void {
    const cart = state.getCart();
    const favCount = state.favorites.size;

    document.querySelectorAll('.cart-badge-count').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.textContent = String(cart.totalItems);
      htmlEl.style.display = cart.totalItems > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.fav-badge-count').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.textContent = String(favCount);
      htmlEl.style.display = favCount > 0 ? 'flex' : 'none';
    });
  }
}
