/**
 * ========================================================
 * 🍞 Toast.ts - نظام الإشعارات والتنبيهات السريعة
 * ========================================================
 */

import { events } from '../core/EventBus';

export class Toast {
  private static timer: any = null;

  public static show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    let toastEl = document.getElementById('toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }

    const icons: Record<string, string> = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-triangle-exclamation',
    };

    const iconClass = icons[type] || 'fa-info-circle';
    toastEl.className = `toast toast-${type} show`;
    toastEl.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    toastEl.style.display = 'flex';

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      if (toastEl) {
        toastEl.classList.remove('show');
        setTimeout(() => {
          if (toastEl && !toastEl.classList.contains('show')) {
            toastEl.style.display = 'none';
          }
        }, 300);
      }
    }, duration);
  }

  public static init(): void {
    events.on('toast:show', (data: { message: string; type?: any; duration?: number }) => {
      this.show(data.message, data.type, data.duration);
    });

    (window as any).showToast = this.show.bind(this);
  }
}
