/**
 * ========================================================
 * ❤️ FavoritesModal.ts - قائمة المفضلة السريعة
 * ========================================================
 */

import { state } from '../core/StoreState';
import { ProductCard } from './ProductCard';

export class FavoritesModal {
  private static modalEl: HTMLElement | null = null;

  public static open(): void {
    if (!this.modalEl) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'favorites-modal';
      this.modalEl.className = 'sheet-modal fav-sheet-modal';
      document.body.appendChild(this.modalEl);
    }

    this.render();
    requestAnimationFrame(() => {
      this.modalEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  public static render(): void {
    if (!this.modalEl) return;

    const favProducts = state.products.filter((p) => state.isFavorite(p.id));
    const isEmpty = favProducts.length === 0;

    this.modalEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeFavorites()"></div>
      <div class="sheet-content">
        <div class="sheet-handle-bar"></div>
        <div class="sheet-header">
          <h3>قائمة المفضلة ❤️ (${favProducts.length})</h3>
          <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeFavorites()" aria-label="إغلاق">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sheet-body fav-sheet-body">
          ${
            isEmpty
              ? `
              <div style="padding:40px 20px; text-align:center; color:var(--text-muted);">
                <i class="far fa-heart" style="font-size:3.5rem; opacity:0.3; margin-bottom:15px; display:block;"></i>
                <h4 style="font-weight:800; margin-bottom:6px;">قائمة المفضلة فارغة</h4>
                <p style="font-size:0.9rem;">انقر على رمز القلب عند أي منتج لحفظه والرجوع إليه بسهولة لاحقاً.</p>
              </div>
            `
              : `
              <div class="product-grid ultra-product-grid">
                ${favProducts.map((p) => ProductCard.render(p)).join('')}
              </div>
            `
          }
        </div>
      </div>
    `;
  }

  public static close(): void {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        this.modalEl?.remove();
        this.modalEl = null;
      }, 300);
    }
  }
}
