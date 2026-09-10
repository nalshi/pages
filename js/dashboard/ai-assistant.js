/**
 * ai-assistant.js — إعدادات المساعد الذكي الخاص بالمتجر
 * يُحمَّل عند فتح نافذة المساعد الذكي (Lazy Loaded)
 */
(function () {
    'use strict';

    // ===== حقن HTML الخاص بنافذة المساعد الذكي =====
    function injectAiAssistantModal() {
        if (!document.getElementById('setting-ai-assistant-modal')) {
            const html = `
            <div class="modal" id="setting-ai-assistant-modal">
                <div class="modal-content" style="max-width: 450px;">
                    <div class="modal-title-bar">
                        <h3><i class="fas fa-robot"></i> المساعد الذكي الخاص بمتجرك</h3>
                        <button class="close-btn" onclick="closeM('setting-ai-assistant-modal')"><i class="fas fa-times"></i></button>
                    </div>

                    <div class="setting-item" style="cursor: default;">
                        <div class="s-label"><i class="fas fa-power-off text-success"></i> تفعيل المساعد لعملائك</div>
                        <div class="s-val">
                            <label class="toggle-switch">
                                <input type="checkbox" id="ai-config-enabled">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top: 16px;">
                        <label>اسم المساعد الذي يراه عملاؤك:</label>
                        <input type="text" id="ai-config-bot-name" class="modern-input" maxlength="40" placeholder="مثال: سلمى، مساعد المتجر...">
                    </div>

                    <div class="input-group" style="margin-top: 12px;">
                        <label>نبرة الصوت (Tone):</label>
                        <select id="ai-config-tone" class="modern-input">
                            <option value="friendly">ودّي ومرح</option>
                            <option value="formal">رسمي</option>
                            <option value="professional">احترافي مباشر</option>
                            <option value="funny">خفيف الظل</option>
                            <option value="concise">مختصر جداً</option>
                        </select>
                    </div>

                    <div class="input-group" style="margin-top: 12px;">
                        <label>قواعد مخصصة (كل سطر = قاعدة يلتزم بها المساعد حرفياً):</label>
                        <textarea id="ai-config-rules" class="modern-input" rows="4" placeholder="مثال:&#10;لا تعرض أرقام هواتف شخصية.&#10;اذكر دائماً أن الشحن مجاني فوق 5000 ريال."></textarea>
                        <small style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; display: block;">حتى 25 قاعدة، بحد أقصى 200 حرف لكل قاعدة.</small>
                    </div>

                    <button class="btn-main" style="margin-top: 18px;" onclick="saveAiAssistantConfig()">
                        <i class="fas fa-save"></i> حفظ إعدادات المساعد
                    </button>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    injectAiAssistantModal();

    let isSavingAiConfigLock = false;

    // ===== جلب إعدادات المساعد الذكي =====
    window.loadAiAssistantConfig = async function () {
        injectAiAssistantModal();
        const res = await window.apiReq('get_ai_assistant_config', {}, 'POST', false, true);
        if (!res || res.status !== 'success') return;
        const cfg = res.data || {};
        const elEnabled = document.getElementById('ai-config-enabled');
        const elBotName = document.getElementById('ai-config-bot-name');
        const elTone = document.getElementById('ai-config-tone');
        const elRules = document.getElementById('ai-config-rules');
        if (elEnabled) elEnabled.checked = !!cfg.ai_enabled;
        if (elBotName) elBotName.value = cfg.bot_name || 'المساعد الذكي';
        if (elTone) elTone.value = cfg.tone || 'friendly';
        if (elRules) elRules.value = Array.isArray(cfg.custom_rules) ? cfg.custom_rules.join('\n') : '';
        const statusEl = document.getElementById('display-ai-assistant-status');
        if (statusEl) statusEl.textContent = cfg.ai_enabled ? 'مفعّل ✅' : 'غير مفعّل';
    };

    // ===== حفظ إعدادات المساعد الذكي =====
    window.saveAiAssistantConfig = async function () {
        if (isSavingAiConfigLock) return;
        isSavingAiConfigLock = true;
        const btn = document.querySelector('#setting-ai-assistant-modal .btn-main');
        if (btn) btn.disabled = true;

        const enabled = document.getElementById('ai-config-enabled').checked;
        const botName = document.getElementById('ai-config-bot-name').value.trim() || 'المساعد الذكي';
        const tone = document.getElementById('ai-config-tone').value;
        const rulesText = document.getElementById('ai-config-rules').value;
        const customRules = rulesText.split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(0, 25);

        const res = await window.apiReq('save_ai_assistant_config', { ai_enabled: enabled, bot_name: botName, tone, custom_rules: customRules });
        isSavingAiConfigLock = false;
        if (btn) btn.disabled = false;

        if (res && res.status === 'success') {
            window.showT('تم حفظ إعدادات المساعد الذكي ✅', 'success');
            window.closeM('setting-ai-assistant-modal');
            const statusEl = document.getElementById('display-ai-assistant-status');
            if (statusEl) statusEl.textContent = enabled ? 'مفعّل ✅' : 'غير مفعّل';
        } else {
            window.showT((res && res.message) || 'فشل حفظ الإعدادات', 'error');
        }
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('ai-assistant');

})();
