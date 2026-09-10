/**
 * ========================================================
 * 🍞 Studio Toast Component
 * ========================================================
 */

export class Toast {
    private static timeoutId: any = null;

    public static show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
        let toastEl = document.getElementById('builder-toast');
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.id = 'builder-toast';
            toastEl.className = 'builder-toast';
            document.body.appendChild(toastEl);
        }

        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        toastEl.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        toastEl.className = `builder-toast show ${type}`;

        if (Toast.timeoutId) clearTimeout(Toast.timeoutId);
        Toast.timeoutId = setTimeout(() => {
            if (toastEl) toastEl.classList.remove('show');
        }, 3200);
    }
}
