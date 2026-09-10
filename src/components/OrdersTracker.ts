/**
 * ========================================================
 * 📦 OrdersTracker.ts - تتبع الطلبات وقائمة مشتريات العميل
 * ========================================================
 */

import { state } from '../core/StoreState';
import { api } from '../core/ApiClient';
import { LazyLoader } from '../core/LazyLoader';
import { Toast } from './Toast';
import { ProductCard } from './ProductCard';
import { Order } from '../types';

export class OrdersTracker {
  private static modalEl: HTMLElement | null = null;
  private static orders: Order[] = [];
  private static isLoading: boolean = false;

  public static async open(): Promise<void> {
    if (!this.modalEl) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'orders-tracker-modal';
      this.modalEl.className = 'sheet-modal orders-sheet-modal';
      document.body.appendChild(this.modalEl);
    }

    this.render();
    requestAnimationFrame(() => {
      this.modalEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    await this.fetchOrders();
  }

  public static async fetchOrders(): Promise<void> {
    this.isLoading = true;
    this.render();

    try {
      const response = await api('get_user_orders', { store_id: state.storeId }, { silent: true });
      if (response && Array.isArray(response.orders)) {
        this.orders = response.orders;
      } else if (Array.isArray(response)) {
        this.orders = response;
      }
    } catch (err) {
      console.warn('[OrdersTracker] Failed to load orders:', err);
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  public static render(): void {
    if (!this.modalEl) return;

    const statusLabels: Record<string, { label: string; class: string }> = {
      pending: { label: 'قيد الانتظار ⏳', class: 'status-pending' },
      preparing: { label: 'جاري التجهيز 👨‍🍳', class: 'status-preparing' },
      on_the_way: { label: 'في الطريق إليك 🛵', class: 'status-delivering' },
      delivered: { label: 'تم الاستلام بنجاح ✅', class: 'status-delivered' },
      cancelled: { label: 'ملغي ❌', class: 'status-cancelled' },
    };

    this.modalEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeOrders()"></div>
      <div class="sheet-content">
        <div class="sheet-handle-bar"></div>
        <div class="sheet-header">
          <h3>سجل طلباتي 🧾</h3>
          <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeOrders()" aria-label="إغلاق">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sheet-body orders-sheet-body">
          ${
            this.isLoading
              ? `
              <div style="padding:40px 20px; text-align:center; color:var(--text-muted);">
                <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--primary); margin-bottom:10px;"></i>
                <p>جاري جلب قائمة طلباتك...</p>
              </div>
            `
              : this.orders.length === 0
              ? `
              <div class="empty-orders-state" style="padding:40px 20px; text-align:center;">
                <i class="fas fa-receipt empty-icon" style="font-size:3.5rem; color:var(--text-muted); opacity:0.4; margin-bottom:15px;"></i>
                <h4 style="font-weight:800; margin-bottom:6px;">لا توجد طلبات سابقة</h4>
                <p style="color:var(--text-muted); font-size:0.9rem;">أي طلب تقوم بإنشائه سيظهر هنا مع إمكانية التتبع المباشر.</p>
              </div>
            `
              : `
              <div class="orders-list">
                ${this.orders
                  .map((ord) => {
                    const st = statusLabels[ord.status] || { label: ord.status, class: 'status-pending' };
                    const itemsCount = ord.items?.length || 0;
                    return `
                    <div class="order-card" style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px; margin-bottom:12px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-weight:900; font-size:1rem; color:var(--primary);">#${ord.order_number || ord.id}</span>
                        <span class="order-status-badge ${st.class}" style="padding:4px 10px; border-radius:50px; font-size:0.8rem; font-weight:700;">${st.label}</span>
                      </div>

                      <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">
                        <span>عدد الأصناف: ${itemsCount}</span>
                        <span>${ord.created_at || 'مؤخراً'}</span>
                      </div>

                      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--border); padding-top:10px;">
                        <span style="font-weight:800; font-size:1rem;">الإجمالي: ${ProductCard.formatPrice(ord.total)}</span>
                        ${
                          ord.delivery_code
                            ? `
                          <button class="btn-action outline mini" onclick="window.NalshStorefront?.showOrderQR('${ord.order_number || ord.id}', '${ord.delivery_code}')">
                            <i class="fas fa-qrcode"></i> <span>رمز الاستلام</span>
                          </button>
                        `
                            : ''
                        }
                      </div>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            `
          }
        </div>
      </div>
    `;
  }

  public static async showQRModal(orderNum: string, code: string): Promise<void> {
    let qrEl = document.getElementById('order-qr-modal');
    if (!qrEl) {
      qrEl = document.createElement('div');
      qrEl.id = 'order-qr-modal';
      qrEl.className = 'sheet-modal qr-sheet-modal';
      document.body.appendChild(qrEl);
    }

    qrEl.innerHTML = `
      <div class="sheet-backdrop" onclick="document.getElementById('order-qr-modal')?.remove()"></div>
      <div class="sheet-content" style="text-align:center;">
        <div class="sheet-handle-bar"></div>
        <h3 style="margin:15px 0 10px; font-weight:900;">رمز استلام الطلب #${orderNum}</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:15px;">أظهر هذا الرمز لمندوب التوصيل عند استلام الطلب.</p>

        <div id="qr-canvas-wrapper" style="margin:15px auto; padding:15px; background:#FFF; border-radius:12px; display:inline-block;">
          <canvas id="order-qr-canvas"></canvas>
        </div>

        <div style="font-size:1.8rem; font-weight:900; letter-spacing:4px; color:var(--primary); margin:10px 0;">
          ${code}
        </div>

        <button class="btn-action primary full" onclick="document.getElementById('order-qr-modal')?.remove()" style="margin-top:15px;">إغلاق</button>
      </div>
    `;

    qrEl.classList.add('open');

    try {
      await LazyLoader.loadQR();
      const QRious = (window as any).QRious;
      if (QRious) {
        new QRious({
          element: document.getElementById('order-qr-canvas'),
          value: JSON.stringify({ order: orderNum, code }),
          size: 180,
        });
      }
    } catch (err) {
      console.warn('Failed to render QR canvas:', err);
    }
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
