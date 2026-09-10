/**
 * ========================================================
 * 🔍 ProductDetailsModal.ts - نافذة تفاصيل المنتج السلسة
 * ========================================================
 */

import { state } from '../core/StoreState';
import { ProductCard } from './ProductCard';
import { Toast } from './Toast';
import { Product, ProductVariation } from '../types';

export class ProductDetailsModal {
  private static currentProduct: Product | null = null;
  private static selectedVariation: ProductVariation | null = null;
  private static quantity: number = 1;

  public static open(productId: string | number): void {
    const product = state.products.find((p) => String(p.id) === String(productId));
    if (!product) return;

    this.currentProduct = product;
    this.selectedVariation = product.variations && product.variations.length > 0 ? product.variations[0] : null;
    this.quantity = 1;

    let modalEl = document.getElementById('product-details-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'product-details-modal';
      modalEl.className = 'sheet-modal product-sheet-modal';
      document.body.appendChild(modalEl);
    }

    const price = this.selectedVariation ? this.selectedVariation.price : product.price;
    const oldPrice = this.selectedVariation?.old_price || product.old_price;
    const hasDiscount = oldPrice && oldPrice > price;
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    modalEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeProductDetails()"></div>
      <div class="sheet-content">
        <div class="sheet-handle-bar"></div>
        <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeProductDetails()" aria-label="إغلاق">
          <i class="fas fa-times"></i>
        </button>

        <div class="sheet-body">
          <div class="product-modal-image-wrapper">
            <img src="${product.image || 'images/placeholder.png'}" alt="${ProductCard.escapeHTML(product.name)}" class="modal-product-img">
          </div>

          <div class="product-modal-details">
            <span class="modal-category">${ProductCard.escapeHTML(product.category || 'عام')}</span>
            <h2 class="modal-product-title">${ProductCard.escapeHTML(product.name)}</h2>
            
            <div class="modal-price-row">
              <span class="modal-price">${ProductCard.formatPrice(price)}</span>
              ${hasDiscount ? `<del class="modal-old-price">${ProductCard.formatPrice(oldPrice!)}</del>` : ''}
            </div>

            ${product.description ? `<p class="modal-description">${ProductCard.escapeHTML(product.description)}</p>` : ''}

            <!-- خيارات المتغيرات إن وجدت -->
            ${
              product.variations && product.variations.length > 0
                ? `
                <div class="modal-variations-section">
                  <span class="var-title">الخيارات المتاحة:</span>
                  <div class="var-chips">
                    ${product.variations
                      .map(
                        (v, idx) => `
                        <button class="var-chip ${idx === 0 ? 'active' : ''}" onclick="window.NalshStorefront?.selectProductVariation(${idx})">
                          ${ProductCard.escapeHTML(v.name)} - ${ProductCard.formatPrice(v.price)}
                        </button>
                      `
                      )
                      .join('')}
                  </div>
                </div>
              `
                : ''
            }

            <!-- عداد الكمية -->
            <div class="modal-quantity-row">
              <span class="qty-label">الكمية:</span>
              <div class="qty-control">
                <button class="qty-btn" onclick="window.NalshStorefront?.changeModalQty(-1)"><i class="fas fa-minus"></i></button>
                <span class="qty-val" id="modal-qty-display">1</span>
                <button class="qty-btn" onclick="window.NalshStorefront?.changeModalQty(1)"><i class="fas fa-plus"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div class="sheet-footer">
          ${
            isOutOfStock
              ? `<button class="btn-action full" disabled>نفذت الكمية</button>`
              : `<button class="btn-action primary full" onclick="window.NalshStorefront?.addModalProductToCart()">
                  <i class="fas fa-shopping-bag"></i>
                  <span>إضافة إلى السلة</span>
                </button>`
          }
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      modalEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  public static changeQuantity(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
    const display = document.getElementById('modal-qty-display');
    if (display) display.textContent = String(this.quantity);
  }

  public static selectVariation(index: number): void {
    if (this.currentProduct?.variations && this.currentProduct.variations[index]) {
      this.selectedVariation = this.currentProduct.variations[index];
      document.querySelectorAll('.var-chip').forEach((el, idx) => {
        el.classList.toggle('active', idx === index);
      });
    }
  }

  public static addToCart(): void {
    if (!this.currentProduct) return;

    state.addToCart({
      id: `${this.currentProduct.id}_${this.selectedVariation?.id || 'default'}`,
      product_id: this.currentProduct.id,
      name: this.currentProduct.name + (this.selectedVariation ? ` (${this.selectedVariation.name})` : ''),
      price: this.selectedVariation ? this.selectedVariation.price : this.currentProduct.price,
      old_price: this.selectedVariation?.old_price || this.currentProduct.old_price,
      quantity: this.quantity,
      image: this.currentProduct.image,
      selected_variation: this.selectedVariation,
    });

    Toast.show('تمت إضافة المنتج إلى السلة بنجاح 🛍️', 'success');
    this.close();
  }

  public static close(): void {
    const modalEl = document.getElementById('product-details-modal');
    if (modalEl) {
      modalEl.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        modalEl?.remove();
      }, 300);
    }
  }
}
