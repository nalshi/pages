/**
 * ========================================================
 * 📱 Studio Live Preview Component
 * ========================================================
 */

import { studioState } from '../state';

export class Preview {
    public static render(): string {
        const { currentDevice } = studioState;
        const deviceClass = `preview-frame-${currentDevice}`;

        return `
        <section class="sb-preview-pane">
            <div class="sb-preview-device-switcher ${currentDevice === 'desktop' ? 'is-desktop' : ''}" id="preview-device-switcher" aria-label="اختيار حجم المعاينة">
                <button class="sb-device-btn ${currentDevice === 'mobile' ? 'active' : ''}" data-device="mobile" onclick="window.StudioUI.setDevice('mobile')" title="جوال">
                    <i class="fas fa-mobile-alt"></i>
                    <span>جوال</span>
                </button>
                <button class="sb-device-btn ${currentDevice === 'tablet' ? 'active' : ''}" data-device="tablet" onclick="window.StudioUI.setDevice('tablet')" title="تابلت">
                    <i class="fas fa-tablet-alt"></i>
                    <span>تابلت</span>
                </button>
                <button class="sb-device-btn ${currentDevice === 'desktop' ? 'active' : ''}" data-device="desktop" onclick="window.StudioUI.setDevice('desktop')" title="كمبيوتر">
                    <i class="fas fa-desktop"></i>
                    <span>كمبيوتر</span>
                </button>
            </div>
            <div class="sb-preview-wrapper ${deviceClass}" id="preview-wrapper">
                <div class="sb-device-header ${currentDevice === 'desktop' ? 'hidden' : ''}" id="preview-device-header">
                    <div class="sb-device-speaker"></div>
                    <div class="sb-device-camera"></div>
                </div>
                <iframe id="store-preview-frame" class="sb-preview-iframe" src="index.html?store=${encodeURIComponent(studioState.merchantUsername || 'store')}&preview=studio" title="المعاينة المباشرة للمتجر"></iframe>
            </div>
        </section>
        `;
    }
}
