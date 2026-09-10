/**
 * Merchant template library.
 * Ready themes are loaded directly from JSON files.
 */
(function () {
    'use strict';

    const state = {
        files: new Map(),
        selections: {},
        activePreset: null,
        previewUrl: null
    };

    async function getJson(url) {
        const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`تعذر تحميل ${url}`);
        return response.json();
    }

    async function loadThemes() {
        if (state.files.has('themes')) return state.files.get('themes');

        let file = null;
        try {
            // جلب مكتبة القوالب المجمعة تلقائياً مباشرة (بدون أي حاجة لملف manifest)
            const themesData = await getJson('/templates/themes.json?v=' + Date.now());
            if (themesData && Array.isArray(themesData.items) && themesData.items.length > 0) {
                file = themesData;
            }
        } catch (error) {
            console.warn('[Templates] تعذر تحميل /templates/themes.json، سيتم البحث في القوالب الفردية:', error);
        }

        // احتياطاً في حال تعذر قراءة الفهرس الموحد
        if (!file) {
            const fallbackFiles = [
                '/templates/themes/indigo.json',
                '/templates/themes/luxury.json',
                '/templates/themes/emerald.json',
                '/templates/theme_m.json'
            ];
            const standaloneItems = (await Promise.all(fallbackFiles.map(async f => {
                try {
                    const item = await getJson(f);
                    return item && item.id ? { ...item, sourceFile: f } : null;
                } catch (e) { return null; }
            }))).filter(Boolean);

            file = { version: 2, items: standaloneItems };
        }

        state.files.set('themes', file);
        return file;
    }

    function merchantName() {
        return window.currentMerchantData?.username
            || window.currentMerchantData?.user?.username
            || window.merchantUsername
            || window.jwtPayload?.username
            || document.getElementById('ui-username')?.textContent?.replace(/^@/, '').trim()
            || '';
    }

    function renderOption(category, item) {
        const selected = state.selections[category] === item.id;
        const preview = item.preview || {};
        return `<button class="merchant-template-option ${selected ? 'is-selected' : ''}" data-category="${category}" data-id="${item.id}">
            <span class="merchant-template-swatch" style="--template-primary:${preview.primary || '#4F46E5'};--template-accent:${preview.accent || '#06B6D4'};--template-bg:${preview.background || '#F8FAFC'}"></span>
            <span><strong>${item.name}</strong><small>${item.description || ''}</small></span>
            ${selected ? '<i class="fas fa-check-circle"></i>' : ''}
        </button>`;
    }

    function selectPreset(preset) {
        state.activePreset = preset;
        state.selections = { ...(preset?.selections || {}) };
    }

    function findActivePreset(presets) {
        return presets.find(preset => Object.entries(preset.selections || {}).every(
            ([key, value]) => state.selections[key] === value
        )) || null;
    }

    function renderPresetCard(preset) {
        const theme = state.files.get('themes')?.items?.find(item => item.id === preset.selections?.theme);
        const preview = theme?.preview || {};
        const selected = state.activePreset?.id === preset.id;
        const selections = encodeURIComponent(JSON.stringify(preset.selections || {}));
        return `<article class="merchant-template-card template-shape-${preset.id} ${selected ? 'is-selected' : ''}" data-preset-id="${preset.id}" style="--template-primary:${preview.primary || '#4F46E5'};--template-accent:${preview.accent || '#06B6D4'};--template-bg:${preview.background || '#F8FAFC'}">
            <div class="merchant-template-card-preview" aria-hidden="true">
                <div class="merchant-template-mini-topbar"><span></span><span></span><span></span></div>
                <div class="merchant-template-mini-hero"><b>${preset.name}</b><i class="fas fa-sparkles"></i></div>
                <div class="merchant-template-mini-grid"><span></span><span></span><span></span></div>
                <div class="merchant-template-mini-nav"><i class="fas fa-home"></i><i class="fas fa-search"></i><i class="fas fa-user"></i></div>
            </div>
            <div class="merchant-template-card-body">
                <div class="merchant-template-card-title"><strong>${preset.name}</strong>${selected ? '<i class="fas fa-check-circle" title="محدد للتطبيق"></i>' : ''}</div>
                <p>${preset.description || ''}</p>
                <div class="merchant-template-meta"><span><i class="fas fa-palette"></i> تصميم متكامل</span><span><i class="fas fa-eye"></i> معاينة قبل التطبيق</span></div>
                <div class="merchant-template-card-actions">
                    <button class="template-card-preview" data-preview-selections="${selections}"><i class="fas fa-eye"></i> معاينة كاملة</button>
                </div>
            </div>
        </article>`;
    }

    function themeItemsAsPresets(themeFile) {
        return (themeFile?.items || []).map(item => ({
            id: `theme-${item.id}`,
            name: item.name,
            description: item.description || 'قالب تصميم جاهز قابل للتخصيص.',
            themeItem: item,
            selections: { theme: item.id }
        }));
    }

    async function renderLibrary() {
        const section = document.getElementById('templates');
        if (!section) return;
        section.innerHTML = `<div class="template-page-shell"><div class="section-skeleton"><div class="sk-card"></div><div class="sk-card"></div></div></div>`;
        try {
            const username = merchantName();
            if (username && !Object.keys(state.selections).length) {
                try {
                    const response = await getJson(`/api/worker/stores/${encodeURIComponent(username)}/storefront_selection.json`);
                    state.selections = { ...(response.selections || {}) };
                } catch (error) {
                    // A new merchant has no selection file yet; the library remains usable.
                }
            }
            const themes = state.files.has('themes') ? state.files.get('themes') : await loadThemes();
            const allPresets = themeItemsAsPresets(themes);
            state.activePreset = state.activePreset || findActivePreset(allPresets);
            const presetCards = allPresets.map(renderPresetCard).join('');
            section.innerHTML = `<div class="template-page-shell">
               <div class="template-hero"><div><span class="template-kicker">مكتبة التصميم</span><h2>قوالب جاهزة لمتجرك</h2><p>عاين أي قالب منشور مباشرة، ثم طبّقه وانشره على متجرك.</p></div><div class="template-actions"><button class="btn-main" id="template-preview-btn"><i class="fas fa-eye"></i> معاينة</button><button class="btn-main" id="template-publish-btn"><i class="fas fa-cloud-arrow-up"></i> تطبيق ونشر</button></div></div>
                 <div class="template-presets"><h3>القوالب المنشورة</h3><p class="template-selection-note">تُقرأ القوالب مباشرة من ملفات JSON داخل templates. اضغط على البطاقة أو زر المعاينة لفتح القالب.</p><div class="merchant-template-presets">${presetCards || '<p class="template-empty">لا توجد قوالب منشورة حاليًا.</p>'}</div>
                 <div class="template-customization-helper" style="margin-top:20px; padding:16px 20px; background:var(--bg-card); border-radius:16px; border:1px solid var(--border-glass, rgba(0,0,0,0.06)); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
                     <div>
                         <h4 style="margin:0 0 4px; font-weight:800; font-size:0.95rem; color:var(--text-main);"><i class="fas fa-sliders" style="color:var(--primary); margin-left:6px;"></i> تخصيص متجرك الخاص</h4>
                         <p style="margin:0; font-size:0.82rem; color:var(--text-muted);">عند تطبيق أي قالب، يندمج التصميم تلقائياً مع بيانات متجرك (اسم المتجر، رقم الواتساب، الشحن). يمكنك تخصيصها في أي وقت.</p>
                     </div>
                     <button class="btn-main" onclick="window.switchT('settings')" style="width:auto; padding:8px 16px; font-size:0.85rem; border-radius:10px;"><i class="fas fa-cog"></i> إعدادات المتجر</button>
                 </div>
                 </div>
                 <p class="template-status" id="template-status">لم يتم نشر تغييرات جديدة.</p>
             </div>`;
            section.querySelectorAll('.template-card-preview').forEach(button => button.addEventListener('click', () => {
                const preset = allPresets.find(item => item.id === button.closest('.merchant-template-card')?.dataset.presetId);
                openPresetPreview(preset || { selections: JSON.parse(decodeURIComponent(button.dataset.previewSelections)) });
            }));
            section.querySelectorAll('.merchant-template-card').forEach(card => card.addEventListener('click', event => {
                if (event.target.closest('button')) return;
                const preset = allPresets.find(item => item.id === card.dataset.presetId);
                openPresetPreview(preset);
            }));
            document.getElementById('template-preview-btn').onclick = preview;
            document.getElementById('template-publish-btn').onclick = publish;
        } catch (error) {
            section.innerHTML = `<div class="template-error"><i class="fas fa-triangle-exclamation"></i><h3>تعذر تحميل مكتبة القوالب</h3><p>${error.message}</p></div>`;
        }

        function openPresetPreview(preset) {
            if (!preset) return;
            state.activePreset = preset;
            state.selections = { ...(preset.selections || {}) };
            document.querySelectorAll('.merchant-template-card').forEach(card => {
                card.classList.toggle('is-selected', card.dataset.presetId === preset.id);
            });
            return previewSelections(state.selections, preset.themeItem);
        }
    }

    async function buildFullStorefrontConfig(preset) {
        let baseConfig = {};
        try {
            const res = await fetch('/theme-config.json?v=' + Date.now(), { cache: 'no-store' });
            if (res.ok) baseConfig = await res.json();
        } catch (e) {}

        if (baseConfig.modes?.light?.colors) {
            baseConfig.light_theme = baseConfig.light_theme || {};
            baseConfig.light_theme.colors = { ...baseConfig.modes.light.colors };
        }
        if (baseConfig.modes?.dark?.colors) {
            baseConfig.dark_theme = baseConfig.dark_theme || {};
            baseConfig.dark_theme.colors = { ...baseConfig.modes.dark.colors };
        }

        let themeItem = preset?.themeItem;
        if (!themeItem && preset?.selections?.theme) {
            const themes = state.files.has('themes') ? state.files.get('themes') : await loadThemes();
            themeItem = themes?.items?.find(item => item.id === preset.selections.theme);
        }

        if (themeItem?.config) {
            mergeConfig(baseConfig, JSON.parse(JSON.stringify(themeItem.config)));
        }

        const merchant = window.currentMerchantData || {};
        const settings = (typeof merchant.settings === 'object' && merchant.settings) ? merchant.settings : {};
        const storeName = merchant.store_name || settings.store_name || (document.getElementById('ui-store-name')?.textContent || '').trim();
        const phone = merchant.phone || settings.phone || settings.whatsapp || '';
        const slogan = settings.welcome_message || settings.bio || '';

        baseConfig.store_identity = baseConfig.store_identity || {};
        if (storeName && !storeName.includes('جاري') && storeName !== '...') {
            baseConfig.store_identity.store_name = storeName;
        }
        if (slogan) {
            baseConfig.store_identity.slogan = slogan;
        }
        if (phone) {
            baseConfig.marketing = baseConfig.marketing || {};
            baseConfig.marketing.whatsapp_floating = baseConfig.marketing.whatsapp_floating || {};
            baseConfig.marketing.whatsapp_floating.phone = phone;
            baseConfig.marketing.whatsapp_floating.enabled = true;
        }

        return baseConfig;
    }

    async function composePreviewSelection() {
        return buildFullStorefrontConfig(state.activePreset);
    }

    function mergeConfig(target, source) {
        Object.entries(source || {}).forEach(([key, value]) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
                mergeConfig(target[key], value);
            } else {
                target[key] = value;
            }
        });
        return target;
    }

    async function previewSelections(selections, themeItem) {
        if (!selections || !Object.keys(selections).length) return window.showT?.('لا توجد إعدادات متاحة لمعاينة هذا القالب', 'warning');
        const username = merchantName();
        if (!username) return window.showT?.('تعذر تحديد رابط متجرك للمعاينة', 'error');

        // تجهيز تكوين المعاينة وتخزينه محلياً للمعاينة الفورية بدون أي تأخير
        const previewConfig = await buildFullStorefrontConfig({ selections, themeItem });
        try {
            localStorage.setItem('nalsh_template_local_config', JSON.stringify(previewConfig));
        } catch (e) {}

        const query = encodeURIComponent(JSON.stringify(selections));
        const file = themeItem?.sourceFile ? `&template_file=${encodeURIComponent(themeItem.sourceFile)}` : '';
        const url = `${window.location.origin}/index.html?store=${encodeURIComponent(username)}&template_preview=${query}${file}&local_preview=1`;
        state.previewUrl = url;
        const modal = document.createElement('div');
        modal.className = 'template-preview-modal';
        modal.innerHTML = `<div class="template-preview-dialog"><button class="template-preview-close" aria-label="إغلاق"><i class="fas fa-times"></i></button><iframe src="${url}" title="معاينة متجر التاجر بالثيم المحدد"></iframe></div>`;
        modal.querySelector('button').onclick = () => modal.remove();
        modal.onclick = event => { if (event.target === modal) modal.remove(); };
        document.body.appendChild(modal);
    }

    async function preview() {
        if (!state.activePreset) return window.showT?.('اضغط على أي قالب لفتح معاينته أولًا', 'warning');
        return previewSelections(state.selections, state.activePreset?.themeItem);
    }

    async function publish() {
        const keys = Object.keys(state.selections);
        if (!state.activePreset || !keys.length) return window.showT?.('اضغط على أي قالب لمعاينته وتحديده أولًا', 'warning');
        const button = document.getElementById('template-publish-btn');
        const originalText = button ? button.innerHTML : '';
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر السحابي...';
        }

        const username = merchantName();

        try {
            // 1. بناء التكوين الشامل والمتكامل للقالب المختار مع هوية التاجر
            const fullConfig = await buildFullStorefrontConfig(state.activePreset);

            // 2. نشر التكوين الكامل عبر save_storefront_config (لتحديث D1 و GitHub و CDN و manifest)
            const configResult = await window.apiReq('save_storefront_config', {
                config: fullConfig,
                merchant_username: username
            }, 'POST');

            // 3. حفظ اختيار الثيم أيضاً كمرجع للمكتبة
            await window.apiReq('save_storefront_selection', { selections: state.selections }, 'POST').catch(() => {});

            if (configResult?.status === 'error') {
                throw new Error(configResult.message || 'تعذر نشر مظهر المتجر سحابياً');
            }

            // 4. حفظ محلي لسرعة الاستجابة المباشرة
            if (username) {
                try {
                    localStorage.setItem(`nalsh_storefront_config_${username}`, JSON.stringify(fullConfig));
                } catch (e) {}
            }

            // 5. إشعار أي معاينة مفتوحة أو مكونات متزامنة
            window.postMessage({ type: 'NALSH_CONFIG_UPDATE', config: fullConfig }, '*');

            document.getElementById('template-status').textContent = `تم تطبيق ونشر قالب "${state.activePreset.name}" على متجرك بنجاح 🚀`;
            window.showT?.(`تم نشر وتفعيل قالب "${state.activePreset.name}" بنجاح! 🎨`, 'success');
        } catch (error) {
            console.error('Publish error:', error);
            window.showT?.(error.message || 'حدث خطأ أثناء النشر', 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.innerHTML = originalText;
            }
        }
    }

    window.ensureTemplatesHTML = function () { renderLibrary(); };
})();
