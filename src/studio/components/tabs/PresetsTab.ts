/**
 * ========================================================
 * 🎨 PresetsTab Component
 * ========================================================
 */

import { THEME_PRESETS } from '../../../config/storefrontConfigSchema';

export class PresetsTab {
    public static render(): string {
        return `
        <div class="sb-tab-pane">
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-palette" style="color:var(--sb-accent);"></i>
                    <h3>قوالب وثيمات جاهزة متكاملة</h3>
                </div>

                <div class="sb-presets-grid">
                    ${THEME_PRESETS.map((p: any) => `
                        <div class="sb-preset-card" onclick="window.StudioUI.handlePresetApply('${p.id}')">
                            <div class="sb-preset-swatches">
                                <div class="sb-swatch" style="background:${p.light_theme?.colors?.primary || '#4F46E5'}"></div>
                                <div class="sb-swatch" style="background:${p.light_theme?.colors?.accent || '#06B6D4'}"></div>
                                <div class="sb-swatch" style="background:${p.light_theme?.colors?.bg_body || '#F8FAFC'}; border:1px solid #CBD5E1;"></div>
                                <div class="sb-swatch" style="background:${p.dark_theme?.colors?.primary || '#6366F1'}"></div>
                                <div class="sb-swatch" style="background:${p.dark_theme?.colors?.bg_body || '#0B1120'}"></div>
                            </div>
                            <strong style="color:var(--sb-text); font-size:0.94rem; display:block; margin-top:6px;">${p.name}</strong>
                            <p style="color:var(--sb-muted); font-size:0.8rem; line-height:1.4; margin-top:2px;">${p.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    }
}
