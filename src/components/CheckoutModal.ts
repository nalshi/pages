/**
 * ========================================================
 * 💳 CheckoutModal.ts - نافذة إتمام الطلب واختيار الموقع
 * ========================================================
 */

import { state } from '../core/StoreState';
import { api } from '../core/ApiClient';
import { LazyLoader } from '../core/LazyLoader';
import { Toast } from './Toast';
import { ProductCard } from './ProductCard';
import { OrderCustomerInfo, DeliveryLocation } from '../types';

export class CheckoutModal {
  private static modalEl: HTMLElement | null = null;
  private static selectedLocation: DeliveryLocation | null = null;
  private static mapInstance: any = null;

  public static open(): void {
    const cart = state.getCart();
    if (cart.items.length === 0) {
      Toast.show('سلة المشتريات فارغة!', 'warning');
      return;
    }

    if (!this.modalEl) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'checkout-modal';
      this.modalEl.className = 'sheet-modal checkout-sheet-modal';
      document.body.appendChild(this.modalEl);
    }

    const savedUser = state.user;
    const defaultName = savedUser?.full_name || '';
    const defaultPhone = savedUser?.phone || '';

    this.modalEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeCheckout()"></div>
      <div class="sheet-content">
        <div class="sheet-handle-bar"></div>
        <div class="sheet-header">
          <h3>تأكيد وإتمام الطلب 🚀</h3>
          <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeCheckout()" aria-label="إغلاق">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sheet-body checkout-sheet-body">
          <!-- بيانات العميل -->
          <div class="form-group">
            <label>الاسم الكامل *</label>
            <input type="text" id="checkout-name" class="form-input" placeholder="أدخل اسمك الكريم" value="${ProductCard.escapeHTML(defaultName)}">
          </div>

          <div class="form-group">
            <label>رقم الهاتف / الواتساب *</label>
            <input type="tel" id="checkout-phone" class="form-input" placeholder="77XXXXXXX" value="${ProductCard.escapeHTML(defaultPhone)}">
          </div>

          <div class="form-group">
            <label>العنوان بالتفصيل *</label>
            <textarea id="checkout-address" class="form-input" rows="2" placeholder="المدينة، الحي، الشارع، أقرب معلم..."></textarea>
          </div>

          <!-- زر تحديد الموقع عبر الخريطة -->
          <div class="map-picker-section">
            <button type="button" class="btn-action outline" id="btn-toggle-map" onclick="window.NalshStorefront?.toggleDeliveryMap()">
              <i class="fas fa-map-marker-alt"></i>
              <span>تحديد الموقع بدقة على الخريطة (اختياري)</span>
            </button>
            <div id="checkout-map-container" style="display:none; height:200px; border-radius:var(--radius-lg); margin-top:10px; border:1px solid var(--border);"></div>
          </div>

          <!-- ملاحظات إضافية -->
          <div class="form-group" style="margin-top:12px;">
            <label>ملاحظات خاصة بالتوصيل</label>
            <input type="text" id="checkout-notes" class="form-input" placeholder="أي تعليمات إضافية للمندوب...">
          </div>

          <!-- ملخص الفاتورة النهائية -->
          <div class="cart-summary-box" style="margin-top:15px;">
            <div class="summary-row">
              <span>قيمة المنتجات:</span>
              <span>${ProductCard.formatPrice(cart.subtotal)}</span>
            </div>
            ${
              cart.discount_amount > 0
                ? `<div class="summary-row discount"><span>الخصم:</span><span>-${ProductCard.formatPrice(cart.discount_amount)}</span></div>`
                : ''
            }
            <div class="summary-row total">
              <span>المبلغ الإجمالي:</span>
              <span class="total-amount">${ProductCard.formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>

        <div class="sheet-footer">
          <button class="btn-action primary full" id="btn-submit-order" onclick="window.NalshStorefront?.submitOrder()">
            <i class="fas fa-check-circle"></i>
            <span>تأكيد وإرسال الطلب</span>
          </button>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      this.modalEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  public static async toggleMap(): Promise<void> {
    const container = document.getElementById('checkout-map-container');
    if (!container) return;

    if (container.style.display === 'none') {
      container.style.display = 'block';
      container.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">جاري تحميل الخريطة... 🗺️</div>';

      try {
        await LazyLoader.loadMapSuite();
        const L = (window as any).L;
        if (!L) return;

        container.innerHTML = '';
        const defaultLat = 15.3694; // صنعاء
        const defaultLng = 44.191;

        this.mapInstance = L.map(container).setView([defaultLat, defaultLng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(this.mapInstance);

        let marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(this.mapInstance);

        const updateLoc = (lat: number, lng: number) => {
          this.selectedLocation = {
            lat,
            lng,
            address: 'موقع محدد عبر الخريطة',
          };
        };

        updateLoc(defaultLat, defaultLng);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          updateLoc(pos.lat, pos.lng);
        });

        this.mapInstance.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          updateLoc(e.latlng.lat, e.latlng.lng);
        });

        // Auto locate if geolocation is supported
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              this.mapInstance.setView([latitude, longitude], 15);
              marker.setLatLng([latitude, longitude]);
              updateLoc(latitude, longitude);
            },
            () => {}
          );
        }
      } catch (err) {
        console.error('Failed to init map:', err);
        container.innerHTML = '<div style="padding:15px; color:var(--danger);">تعذر تحميل الخريطة، يمكنك كتابة العنوان يدوياً.</div>';
      }
    } else {
      container.style.display = 'none';
    }
  }

  public static async submitOrder(): Promise<void> {
    const nameInput = document.getElementById('checkout-name') as HTMLInputElement;
    const phoneInput = document.getElementById('checkout-phone') as HTMLInputElement;
    const addressInput = document.getElementById('checkout-address') as HTMLTextAreaElement;
    const notesInput = document.getElementById('checkout-notes') as HTMLInputElement;
    const submitBtn = document.getElementById('btn-submit-order') as HTMLButtonElement;

    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const address = addressInput?.value.trim();
    const notes = notesInput?.value.trim() || '';

    if (!name || name.length < 2) {
      Toast.show('يرجى إدخال الاسم الكريم', 'error');
      nameInput?.focus();
      return;
    }

    if (!phone || phone.length < 8) {
      Toast.show('يرجى إدخال رقم هاتف صحيح', 'error');
      phoneInput?.focus();
      return;
    }

    if (!address || address.length < 3) {
      Toast.show('يرجى كتابة تفاصيل العنوان لتسهيل التوصيل', 'error');
      addressInput?.focus();
      return;
    }

    const cart = state.getCart();
    if (cart.items.length === 0) {
      Toast.show('السلة فارغة!', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري إرسال الطلب...</span>';
    }

    const orderPayload = {
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      notes,
      items: cart.items,
      subtotal: cart.subtotal,
      discount: cart.discount_amount,
      delivery_fee: cart.delivery_fee,
      total_amount: cart.total,
      location: this.selectedLocation,
      store_id: state.storeId,
    };

    try {
      const response = await api('create_order', orderPayload);
      if (response && (response.success || response.order_id || response.order_number)) {
        const orderNum = response.order_number || response.order_id || `ORD-${Date.now().toString().slice(-6)}`;
        
        // Save customer session if not logged in
        if (!state.user.loggedIn) {
          state.setUser({
            loggedIn: true,
            full_name: name,
            phone,
            token: response.customer_token || undefined,
          });
        }

        // Clear cart
        state.clearCart();
        this.close();

        // Show success modal
        this.showSuccessModal(orderNum, phone);
      } else {
        throw new Error(response.message || 'فشل إرسال الطلب');
      }
    } catch (err: any) {
      Toast.show(err.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>تأكيد وإرسال الطلب</span>';
      }
    }
  }

  public static showSuccessModal(orderNumber: string, phone: string): void {
    let successEl = document.getElementById('order-success-modal');
    if (!successEl) {
      successEl = document.createElement('div');
      successEl.id = 'order-success-modal';
      successEl.className = 'sheet-modal success-sheet-modal';
      document.body.appendChild(successEl);
    }

    const storeWa = state.config?.store_identity?.whatsapp || '';
    const cleanWa = storeWa.replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(`مرحباً، قمت بتأكيد الطلب رقم #${orderNumber} عبر المتجر.`);

    successEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeSuccessModal()"></div>
      <div class="sheet-content" style="text-align:center;">
        <div class="sheet-handle-bar"></div>
        
        <div class="success-icon-wrapper" style="margin:20px 0 10px; font-size:4rem; color:var(--success);">
          <i class="fas fa-check-circle"></i>
        </div>

        <h2 style="font-size:1.6rem; font-weight:900; margin-bottom:8px;">تم استلام طلبك بنجاح! 🎉</h2>
        <p style="color:var(--text-muted); margin-bottom:15px;">رقم الطلب: <strong style="color:var(--primary); font-size:1.2rem;">#${orderNumber}</strong></p>
        <p style="color:var(--text-main); font-size:0.95rem; margin-bottom:25px;">شكراً لثقتك بنا. سيتم تجهيز طلبك والتواصل معك فوراً.</p>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${
            cleanWa
              ? `
            <a href="https://wa.me/${cleanWa}?text=${waText}" target="_blank" class="btn-action" style="background:#25D366; color:#FFF; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px;">
              <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
              <span>متابعة الطلب عبر واتساب</span>
            </a>
          `
              : ''
          }
          <button class="btn-action primary" onclick="window.NalshStorefront?.closeSuccessModal(); window.NalshStorefront?.openOrders();">
            <i class="fas fa-receipt"></i>
            <span>عرض قائمة طلباتي</span>
          </button>
          <button class="btn-action outline" onclick="window.NalshStorefront?.closeSuccessModal()">العودة للرئيسية</button>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      successEl?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
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

  public static closeSuccessModal(): void {
    const el = document.getElementById('order-success-modal');
    if (el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => el.remove(), 300);
    }
  }
}
