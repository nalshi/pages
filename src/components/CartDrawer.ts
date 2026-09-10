/**
 * ========================================================
 * 🛒 CartDrawer.ts - سلة المشتريات التفاعلية السلسة
 * ========================================================
 */

import { state } from '../core/StoreState';
import { events } from '../core/EventBus';
import { ProductCard } from './ProductCard';

export class CartDrawer {
  private static drawerEl: HTMLElement | null = null;

  public static init(): void {
    events.on('cart:updated', () => {
      if (this.isOpen()) {
        this.render();
      }
    });
  }

  public static isOpen(): boolean {
    return !!this.drawerEl?.classList.contains('open');
  }

  public static open(): void {
    if (!this.drawerEl) {
      this.drawerEl = document.createElement('div');
      this.drawerEl.id = 'cart-drawer-modal';
      this.drawerEl.className = 'sheet-modal cart-sheet-modal';
      document.body.appendChild(this.drawerEl);
    }

    this.render();
    requestAnimationFrame(() => {
      this.drawerEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  public static render(): void {
    if (!this.drawerEl) return;

    const cart = state.getCart();
    const isEmpty = cart.items.length === 0;

    this.drawerEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeCart()"></div>
      <div class="sheet-content">
        <div class="sheet-handle-bar"></div>
        <div class="sheet-header">
          <h3>سلة المشتريات (${cart.totalItems})</h3>
          <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeCart()" aria-label="إغلاق">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sheet-body cart-sheet-body">
          ${
            isEmpty
              ? `
              <div class="empty-cart-state">
                <i class="fas fa-shopping-bag empty-icon"></i>
                <h3>سلتك فارغة حالياً</h3>
                <p>تصفح تشكيلة منتجاتنا المميزة وأضف ما يعجبك!</p>
                <button class="btn-action primary" onclick="window.NalshStorefront?.closeCart()">تصفح المتجر الآن</button>
              </div>
            `
              : `
              <div class="cart-items-list">
                ${cart.items
                  .map(
                    (item, idx) => `
                  <div class="cart-item-card">
                    <img src="${item.image || 'images/placeholder.png'}" alt="${ProductCard.escapeHTML(item.name)}" class="cart-item-img">
                    <div class="cart-item-info">
                      <h4 class="cart-item-name">${ProductCard.escapeHTML(item.name)}</h4>
                      <div class="cart-item-price">${ProductCard.formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-actions">
                      <div class="qty-control mini">
                        <button class="qty-btn" onclick="window.NalshStorefront?.updateCartQty(${idx}, -1)"><i class="fas fa-minus"></i></button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="window.NalshStorefront?.updateCartQty(${idx}, 1)"><i class="fas fa-plus"></i></button>
                      </div>
                      <button class="cart-remove-btn" onclick="window.NalshStorefront?.removeCartItem(${idx})" aria-label="حذف">
                        <i class="far fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <!-- ملخص الفاتورة -->
              <div class="cart-summary-box">
                <div class="summary-row">
                  <span>المجموع الفرعي:</span>
                  <span>${ProductCard.formatPrice(cart.subtotal)}</span>
                </div>
                ${
                  cart.discount_amount > 0
                    ? `
                  <div class="summary-row discount">
                    <span>الخصم:</span>
                    <span>-${ProductCard.formatPrice(cart.discount_amount)}</span>
                  </div>
                `
                    : ''
                }
                <div class="summary-row total">
                  <span>الإجمالي النهائي:</span>
                  <span class="total-amount">${ProductCard.formatPrice(cart.total)}</span>
                </div>
              </div>
            `
          }
        </div>

        ${
          !isEmpty
            ? `
          <div class="sheet-footer">
            <button class="btn-action primary full" onclick="window.NalshStorefront?.openCheckout()">
              <span>متابعة الشراء (${ProductCard.formatPrice(cart.total)})</span>
              <i class="fas fa-arrow-left"></i>
            </button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  public static close(): void {
    if (this.drawerEl) {
      this.drawerEl.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        this.drawerEl?.remove();
        this.drawerEl = null;
      }, 300);
    }
  }
}
