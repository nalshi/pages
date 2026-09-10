/**
 * ========================================================
 * 🏷️ ProductCard.ts - مكون كرت المنتج الأصلي فائق السرعة
 * يدعم كل تفاصيل التصميم الأصلي: الشارات، الخصومات، المفضلة،
 * المشاركة، التقييم، والصور المحسنة
 * ========================================================
 */

import { Product } from '../types';
import { state } from '../core/StoreState';

export class ProductCard {
  public static escapeHTML(str: string): string {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  public static escapeJsAttr(str: string): string {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\r?\n/g, ' ');
  }

  public static parsePrice(p: Product | any): { current: number; original: number; discount: number } {
    let orig = parseFloat(p.price) || 0;
    let disc = parseFloat(p.discount) || 0;
    let curr = disc > 0 ? orig * (1 - disc / 100) : orig;
    if (p.original_price !== undefined) orig = parseFloat(p.original_price);
    if (p.current_price !== undefined) curr = parseFloat(p.current_price);
    if (p.old_price !== undefined && p.old_price > p.price) {
      orig = parseFloat(p.old_price);
      disc = Math.round(((orig - p.price) / orig) * 100);
      curr = p.price;
    }
    return { current: curr, original: orig, discount: disc };
  }

  public static formatPrice(amount: number): string {
    const currency = state.config?.store_identity?.currency_symbol || 'ر.ي';
    return `${Number(amount || 0).toLocaleString()} ${currency}`;
  }

  public static getOptimizedImageUrl(src: string): string {
    if (!src || src.trim() === '') return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    if (src.startsWith('data:') || src.startsWith('http://localhost') || src.startsWith('blob:')) return src;
    return src;
  }

  public static render(product: Product, options: { isHorizontal?: boolean; compact?: boolean } = {}): string {
    const isFav = state.isFavorite(product.id);
    const priceInfo = this.parsePrice(product);
    const isOutOfStock = (product as any).is_out_of_stock || (product.stock !== undefined && product.stock <= 0);

    const rawImg = product.image || (product as any).image_url || (product as any).img || '';
    const imgUrl = this.getOptimizedImageUrl(rawImg);
    const name = this.escapeHTML(product.name);
    const catName = this.escapeHTML(product.category || (product as any).leaf_category || 'عام');
    const merchantName = this.escapeHTML((product as any).merchant_name || (product as any).store_name || '');
    const rating = product.rating || (product as any).rating_avg || 4.9;

    return `
      <div class="product-card-compact fast-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        <div class="compact-img-wrapper" onclick="window.NalshStorefront?.openProductDetails('${product.id}')">
          ${
            priceInfo.discount > 0
              ? `<div class="discount-badge-mini">-${Math.round(priceInfo.discount)}%</div>`
              : ''
          }
          ${
            isOutOfStock
              ? `<div class="stock-badge-mini">نفذت الكمية</div>`
              : product.badge
              ? `<div class="discount-badge-mini" style="background:var(--primary);">${this.escapeHTML(product.badge)}</div>`
              : ''
          }
          
          <div class="image-container-wrapper">
            <i class="fas fa-image placeholder-icon"></i>
            <img loading="lazy" decoding="async" class="p-img" src="${imgUrl}" alt="${name}" 
                 onload="this.classList.add('loaded'); const p = this.parentElement.querySelector('.placeholder-icon'); if(p) p.style.display='none';" 
                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23f1f5f9\\'/><text x=\\'50%\\' y=\\'50%\\' font-size=\\'16\\' fill=\\'%2394a3b8\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>لا توجد صورة</text></svg>'">
          </div>

          <div class="card-actions-container">
            <button class="action-btn-mini fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.NalshStorefront?.toggleFavorite('${product.id}', this)" aria-label="المفضلة">
              <i class="${isFav ? 'fas fa-heart' : 'far fa-heart'}"></i>
            </button>
            <button class="action-btn-mini share-btn" onclick="event.stopPropagation(); window.NalshStorefront?.openShareModal('${product.id}')" aria-label="مشاركة">
              <i class="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        <div class="compact-details" onclick="window.NalshStorefront?.openProductDetails('${product.id}')">
          <div class="meta-row-mini">
            <span class="sc-cat-mini p-cat">${catName}</span>
            ${
              merchantName
                ? `<div class="merchant-mini-label p-merchant"><i class="fas fa-store"></i> <span class="m-name">${merchantName}</span></div>`
                : ''
            }
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
              ${
                priceInfo.discount > 0 && priceInfo.original > priceInfo.current
                  ? `<span class="modern-price-old-wrapper"><del class="p-old-price">${this.formatPrice(priceInfo.original)}</del></span>`
                  : ''
              }
            </div>

            ${
              isOutOfStock
                ? `<button class="modern-add-cart-btn-mini disabled" disabled><i class="fas fa-ban"></i></button>`
                : `<button class="modern-add-cart-btn-mini" onclick="event.stopPropagation(); window.NalshStorefront?.quickAddToCart('${product.id}')" aria-label="إضافة للسلة">
                    <i class="fas fa-plus"></i>
                  </button>`
            }
          </div>
        </div>
      </div>
    `;
  }
}
