/**
 * ========================================================
 * 🔗 ShareModal.ts - نافذة مشاركة المنتجات والمتجر
 * ========================================================
 */

import { state } from '../core/StoreState';
import { Toast } from './Toast';
import { ProductCard } from './ProductCard';

export class ShareModal {
  private static modalEl: HTMLElement | null = null;

  public static open(productId?: string | number): void {
    let title = state.config?.store_identity?.store_name || 'متجر نالش';
    let url = window.location.href;
    let desc = state.config?.store_identity?.slogan || 'تسوق أحدث المنتجات بأفضل الأسعار';

    if (productId) {
      const prod = state.products.find((p) => String(p.id) === String(productId));
      if (prod) {
        title = prod.name;
        desc = `شاهد "${prod.name}" بسعر ${ProductCard.formatPrice(prod.price)}`;
        const baseUrl = window.location.origin + window.location.pathname;
        url = `${baseUrl}?p=${productId}`;
      }
    }

    if (navigator.share) {
      navigator
        .share({ title, text: desc, url })
        .catch(() => this.showModal(title, desc, url));
    } else {
      this.showModal(title, desc, url);
    }
  }

  private static showModal(title: string, desc: string, url: string): void {
    if (!this.modalEl) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'share-modal';
      this.modalEl.className = 'sheet-modal share-sheet-modal';
      document.body.appendChild(this.modalEl);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${desc}\n${url}`)}`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

    this.modalEl.innerHTML = `
      <div class="sheet-backdrop" onclick="window.NalshStorefront?.closeShareModal()"></div>
      <div class="sheet-content" style="text-align:center;">
        <div class="sheet-handle-bar"></div>
        <div class="sheet-header">
          <h3>مشاركة 🔗</h3>
          <button class="sheet-close-btn" onclick="window.NalshStorefront?.closeShareModal()" aria-label="إغلاق">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sheet-body" style="padding:20px;">
          <h4 style="font-weight:900; margin-bottom:6px;">${ProductCard.escapeHTML(title)}</h4>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">${ProductCard.escapeHTML(desc)}</p>

          <div style="display:flex; justify-content:center; gap:16px; margin-bottom:20px;">
            <a href="${waUrl}" target="_blank" class="share-icon-btn" style="background:#25D366; color:#FFF; width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.6rem; text-decoration:none;">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="${tgUrl}" target="_blank" class="share-icon-btn" style="background:#0088cc; color:#FFF; width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; text-decoration:none;">
              <i class="fab fa-telegram-plane"></i>
            </a>
            <button class="share-icon-btn" onclick="window.NalshStorefront?.copyShareLink('${url}')" style="background:var(--bg-surface); color:var(--text-main); border:1px solid var(--border); width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; cursor:pointer;">
              <i class="fas fa-link"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      this.modalEl?.classList.add('open');
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
}
