/**
 * ========================================================
 * ✨ AIPaletteTab Component (20 Ready Themes & AI Generator) v5.0
 * يتيح للمستخدم الاختيار بين 20 ثيم متناسق للداكن والفاتح
 * أو التخصيص الحر للألوان وتطبيق الثيم للوضعين أو لأي وضع منفرد
 * ========================================================
 */

import { studioState } from '../../state';
import { THEME_PRESETS } from '../../../config/storefrontConfigSchema';

export class AIPaletteTab {
    public static render(): string {
        const seedPrimary = studioState.config.light_theme?.colors?.primary || '#4F46E5';
        const seedLightBg = studioState.config.light_theme?.colors?.bg_body || '#F8FAFC';
        const seedDarkBg = studioState.config.dark_theme?.colors?.bg_body || '#0B1120';
        const seedAccent = studioState.config.light_theme?.colors?.accent || '#14B8A6';
        const currentThemeId = studioState.config.theme_name || '';

        const typo = studioState.config.typography || {};
        const ps = studioState.config.products_settings || {};
        const port = ps.portrait || {};
        const land = ps.landscape || {};

        // استخراج جميع الفئات المتاحة للفلترة
        const categories = ['الكل', ...Array.from(new Set(THEME_PRESETS.map((p: any) => p.category || 'عام')))];

        return `
        <div class="sb-tab-pane">
            <!-- بطاقة التوجيه والاختيار للتاجر -->
            <div class="sb-card-group highlight" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12)); border-color: rgba(168, 85, 247, 0.35);">
                <div class="sb-group-header" style="margin-bottom:8px;">
                    <i class="fas fa-palette" style="color:#A78BFA; font-size:1.2rem;"></i>
                    <h3 style="font-size:1.05rem;">كيف تريد تخصيص مظهر وألوان متجرك؟</h3>
                </div>
                <p style="font-size:0.84rem; color:var(--sb-muted); line-height:1.5; margin-bottom:12px;">
                    يمكنك اختيار <strong>ثيم متناسق جاهز من بين 20 ثيم مصمم باحترافية</strong> للوضعين الفاتح والداكن، أو استخدام <strong>المولد الذكي والتخصيص الحر</strong> لكل لون:
                </p>

                <!-- أزرار التنقل السريع بين طرق التخصيص -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                    <button type="button" class="sb-btn sb-btn-primary" style="justify-content:center; padding:10px 8px; font-size:0.82rem; font-weight:800;" onclick="document.getElementById('section-ready-themes')?.scrollIntoView({behavior:'smooth'})">
                        <i class="fas fa-swatchbook"></i>
                        <span>تصفح 20 ثيم جاهز 🎨</span>
                    </button>
                    <button type="button" class="sb-btn sb-btn-outline" style="justify-content:center; padding:10px 8px; font-size:0.82rem; font-weight:800;" onclick="document.getElementById('section-ai-generator')?.scrollIntoView({behavior:'smooth'})">
                        <i class="fas fa-wand-magic-sparkles" style="color:#A78BFA;"></i>
                        <span>المولد الذكي والتخصيص الحر ⚡</span>
                    </button>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 🌟 قسم الـ 20 ثيم متناسق جاهز للداكن والفاتح -->
            <!-- ============================================== -->
            <div class="sb-card-group" id="section-ready-themes">
                <div class="sb-group-header">
                    <i class="fas fa-sparkles" style="color:#F59E0B;"></i>
                    <div>
                        <h3 style="font-size:1rem;">باقة الـ 20 ثيم الجاهزة والمتناسقة (${THEME_PRESETS.length} ثيم)</h3>
                        <span style="font-size:0.75rem; color:var(--sb-muted); display:block; margin-top:2px;">
                            اختر الثيم وطبّقه على الوضعين معاً أو على الوضع الفاتح أو الداكن فقط:
                        </span>
                    </div>
                </div>

                <!-- شريط فلترة الفئات للثيمات الـ 20 -->
                <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:12px;" id="theme-category-pills">
                    ${categories.map((cat, idx) => `
                        <button class="sb-badge-pill ${idx === 0 ? 'active' : ''}" 
                                onclick="window.StudioUI.filterPresetCards('${cat}', this)"
                                style="cursor:pointer; padding:5px 12px; font-size:0.78rem; white-space:nowrap; transition:all 0.2s;">
                            ${cat === 'الكل' ? '🌟 الكل (20)' : cat}
                        </button>
                    `).join('')}
                </div>

                <!-- شبكة كروت الـ 20 ثيم -->
                <div class="sb-themes-grid" style="display:grid; grid-template-columns: 1fr; gap:14px;">
                    ${THEME_PRESETS.map((p: any, idx: number) => {
                        const isActive = currentThemeId === p.id;
                        const lColors = p.light_theme?.colors || {};
                        const dColors = p.dark_theme?.colors || {};
                        
                        return `
                        <div class="sb-preset-theme-card" data-category="${p.category || 'عام'}" 
                             style="content-visibility:auto; contain-intrinsic-size:0 160px; border:1px solid ${isActive ? 'var(--sb-primary)' : 'var(--sb-border)'}; background:var(--sb-card); border-radius:14px; padding:12px 14px; position:relative; box-shadow:${isActive ? '0 0 0 2px var(--sb-primary)' : 'none'}; transition:all 0.2s;">
                            
                            <!-- رأس الكرت -->
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <strong style="font-size:0.95rem; color:var(--sb-text); font-weight:800;">${p.name}</strong>
                                        <span style="font-size:0.7rem; background:rgba(99, 102, 241, 0.12); color:#818CF8; padding:2px 8px; border-radius:6px; font-weight:600;">
                                            ${p.category || 'عام'}
                                        </span>
                                    </div>
                                    <p style="font-size:0.78rem; color:var(--sb-muted); line-height:1.4; margin-top:4px;">${p.description}</p>
                                </div>
                                <span style="font-size:0.74rem; color:var(--sb-muted); font-family:monospace; background:var(--sb-surface); padding:2px 6px; border-radius:4px;">#${idx + 1}</span>
                            </div>

                            <!-- معاينة باليت الألوان للفاتح والداكن -->
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin:10px 0; background:var(--sb-surface); padding:8px 10px; border-radius:10px;">
                                <!-- الفاتح -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <span style="font-size:0.72rem; color:var(--sb-muted); font-weight:700;">☀️ الفاتح:</span>
                                        <span style="font-size:0.68rem; font-family:monospace; color:${lColors.primary || '#4F46E5'};">${lColors.primary || '#4F46E5'}</span>
                                    </div>
                                    <div style="display:flex; gap:4px;">
                                        <div title="الأساسي" style="width:20px; height:20px; border-radius:4px; background:${lColors.primary || '#4F46E5'};"></div>
                                        <div title="التمييز" style="width:20px; height:20px; border-radius:4px; background:${lColors.accent || '#14B8A6'};"></div>
                                        <div title="الخلفية" style="width:20px; height:20px; border-radius:4px; background:${lColors.bg_body || '#F8FAFC'}; border:1px solid #CBD5E1;"></div>
                                        <div title="الكروت" style="width:20px; height:20px; border-radius:4px; background:${lColors.bg_card || '#FFFFFF'}; border:1px solid #CBD5E1;"></div>
                                        <div title="النص" style="width:20px; height:20px; border-radius:4px; background:${lColors.text_main || '#0F172A'};"></div>
                                    </div>
                                </div>

                                <!-- الداكن -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <span style="font-size:0.72rem; color:var(--sb-muted); font-weight:700;">🌙 الداكن:</span>
                                        <span style="font-size:0.68rem; font-family:monospace; color:${dColors.primary || '#6366F1'};">${dColors.primary || '#6366F1'}</span>
                                    </div>
                                    <div style="display:flex; gap:4px;">
                                        <div title="الأساسي" style="width:20px; height:20px; border-radius:4px; background:${dColors.primary || '#6366F1'};"></div>
                                        <div title="التمييز" style="width:20px; height:20px; border-radius:4px; background:${dColors.accent || '#2DD4BF'};"></div>
                                        <div title="الخلفية" style="width:20px; height:20px; border-radius:4px; background:${dColors.bg_body || '#0B1120'}; border:1px solid #334155;"></div>
                                        <div title="الكروت" style="width:20px; height:20px; border-radius:4px; background:${dColors.bg_card || '#151E2E'}; border:1px solid #334155;"></div>
                                        <div title="النص" style="width:20px; height:20px; border-radius:4px; background:${dColors.text_main || '#F8FAFC'};"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- أزرار التطبيق الذكية الثلاثة (للوضعين / للفاتح / للداكن) -->
                            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:6px; margin-top:8px;">
                                <button class="sb-btn sb-btn-primary" style="font-size:0.78rem; padding:8px 4px; justify-content:center; font-weight:800;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'both')">
                                    <i class="fas fa-wand-magic-sparkles"></i>
                                    <span>تطبيق للوضعين ✨</span>
                                </button>
                                <button class="sb-btn sb-btn-outline" style="font-size:0.74rem; padding:8px 2px; justify-content:center; font-weight:700;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'light')">
                                    <i class="fas fa-sun" style="color:#F59E0B;"></i>
                                    <span>للفاتح ☀️</span>
                                </button>
                                <button class="sb-btn sb-btn-outline" style="font-size:0.74rem; padding:8px 2px; justify-content:center; font-weight:700;"
                                        onclick="window.StudioUI.handlePresetApply('${p.id}', 'dark')">
                                    <i class="fas fa-moon" style="color:#818CF8;"></i>
                                    <span>للداكن 🌙</span>
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- ============================================== -->
            <!-- ⚡ قسم المولد الذكي بالألوان الموجهة والتخصيص الحر -->
            <!-- ============================================== -->
            <div class="sb-card-group highlight" id="section-ai-generator">
                <div class="sb-group-header">
                    <i class="fas fa-wand-magic-sparkles" style="color:#A78BFA;"></i>
                    <h3>المولد الذكي الشامل للهوية والمظهر (AI Smart Studio)</h3>
                </div>

                <div class="sb-ai-generator-box">
                    <p style="font-size:0.84rem; color:var(--sb-muted); line-height:1.5;">
                        حدد ألوان هويتك وخلفياتك المفضلة وسيقوم المساعد الذكي بتنسيق واشتقاق الوضعين الفاتح والداكن وتحديد الخطوط والأنماط المتناغمة معها فوراً!
                    </p>

                    <!-- شبكة اختيار الألوان الموجهة للتوليد -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:12px;">
                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">🎨 لون الهوية الأساسي (Primary)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-primary" value="${seedPrimary}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-primary-hex').value = this.value" />
                                <input type="text" id="ai-seed-primary-hex" class="sb-input" value="${seedPrimary}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-primary').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">⚡ لون التمييز التكميلي (Accent)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-accent" value="${seedAccent}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-accent-hex').value = this.value" />
                                <input type="text" id="ai-seed-accent-hex" class="sb-input" value="${seedAccent}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-accent').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">☀️ خلفية الفاتح المفضلة (Light BG)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-lightbg" value="${seedLightBg}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-lightbg-hex').value = this.value" />
                                <input type="text" id="ai-seed-lightbg-hex" class="sb-input" value="${seedLightBg}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-lightbg').value = this.value" />
                            </div>
                        </div>

                        <div class="sb-field-card" style="padding:8px 10px;">
                            <label class="sb-field-label" style="font-size:0.75rem;">🌙 خلفية الداكن المفضلة (Dark BG)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="color" id="ai-seed-darkbg" value="${seedDarkBg}" class="sb-color-input" style="width:36px; height:32px;"
                                       onchange="document.getElementById('ai-seed-darkbg-hex').value = this.value" />
                                <input type="text" id="ai-seed-darkbg-hex" class="sb-input" value="${seedDarkBg}" style="font-size:0.8rem; padding:4px 8px;"
                                       onchange="document.getElementById('ai-seed-darkbg').value = this.value" />
                            </div>
                        </div>
                    </div>

                    <!-- أزرار التوليد والتخصيص الذكي -->
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px;">
                        <!-- الزر الشامل -->
                        <button class="sb-btn sb-btn-primary" style="width:100%; justify-content:center; padding:12px; font-weight:900;" 
                                onclick="window.StudioUI.generateSmartHarmony('intelligent')">
                            <i class="fas fa-wand-magic-sparkles"></i>
                            <span>توليد ذكي شامل (الوضعين + الخطوط + الأشكال + العرض) 🚀</span>
                        </button>

                        <!-- أزرار التوليد لكل وضع لحاله -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                            <button class="sb-btn sb-btn-outline" style="justify-content:center; padding:9px; font-weight:700;"
                                    onclick="window.StudioUI.generateSmartForMode('light')">
                                <i class="fas fa-sun" style="color:#F59E0B;"></i>
                                <span>توليد الفاتح لحاله ☀️</span>
                            </button>

                            <button class="sb-btn sb-btn-outline" style="justify-content:center; padding:9px; font-weight:700;"
                                    onclick="window.StudioUI.generateSmartForMode('dark')">
                                <i class="fas fa-moon" style="color:#818CF8;"></i>
                                <span>توليد الداكن لحاله 🌙</span>
                            </button>
                        </div>

                        <!-- أزرار التخصيص التفصيلي لكل وضع -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                            <button class="sb-btn sb-btn-secondary" style="font-size:0.78rem; justify-content:center; padding:7px;"
                                    onclick="window.StudioUI.setActiveTab('light_colors')">
                                <i class="fas fa-sliders-h"></i>
                                <span>تخصيص ألوان الفاتح تفصيلياً ☀️</span>
                            </button>

                            <button class="sb-btn sb-btn-secondary" style="font-size:0.78rem; justify-content:center; padding:7px;"
                                    onclick="window.StudioUI.setActiveTab('dark_colors')">
                                <i class="fas fa-sliders-h"></i>
                                <span>تخصيص ألوان الداكن تفصيلياً 🌙</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ملخص الهوية المطبقة حالياً -->
            <div class="sb-card-group">
                <div class="sb-group-header">
                    <i class="fas fa-id-card" style="color:var(--sb-accent);"></i>
                    <h3>ملخص الهوية المطبقة حالياً</h3>
                </div>

                <div class="sb-field-card">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
                        <div>
                            <span style="font-size:0.78rem; color:var(--sb-muted); display:block; margin-bottom:6px;">☀️ ألوان الفاتح:</span>
                            <div style="display:flex; gap:6px;">
                                <div title="الأساسي" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.primary || '#4F46E5'};"></div>
                                <div title="التمييز" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.accent || '#14B8A6'};"></div>
                                <div title="الخلفية" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.light_theme?.colors?.bg_body || '#F8FAFC'}; border:1px solid #CBD5E1;"></div>
                            </div>
                        </div>
                        <div>
                            <span style="font-size:0.78rem; color:var(--sb-muted); display:block; margin-bottom:6px;">🌙 ألوان الداكن:</span>
                            <div style="display:flex; gap:6px;">
                                <div title="الأساسي" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.primary || '#6366F1'};"></div>
                                <div title="التمييز" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.accent || '#2DD4BF'};"></div>
                                <div title="الخلفية" style="width:24px; height:24px; border-radius:6px; background:${studioState.config.dark_theme?.colors?.bg_body || '#0B1120'}; border:1px solid #334155;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="border-top:1px dashed var(--sb-border); padding-top:10px; display:flex; flex-direction:column; gap:6px; font-size:0.84rem;">
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">✍️ الخط المختار:</span>
                            <strong style="color:var(--sb-primary);">${typo.font_family || 'Tajawal'}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">📱 عرض الجوال:</span>
                            <strong style="color:#A5B4FC;">${(port.scroll_direction || 'horizontal') === 'horizontal' ? '↔️ سلايدر باللمس' : '↕️ شبكة عمودية'} (${port.grid_columns || 2} أعمدة)</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--sb-muted);">💻 عرض الكمبيوتر:</span>
                            <strong style="color:#38BDF8;">${(land.scroll_direction || 'horizontal') === 'horizontal' ? '↔️ سلايدر بالماوس' : '↕️ شبكة كبرى'} (${land.grid_columns || 4} أعمدة)</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
