/**
 * whatsapp.js — إعدادات ربط المساعد بواتساب (Meta Cloud API)
 * يُحمَّل عند فتح نافذة واتساب (Lazy Loaded)
 */
(function () {
    'use strict';

    // ===== حقن HTML الخاص بنافذة واتساب =====
    function injectWhatsappModal() {
        if (!document.getElementById('setting-whatsapp-modal')) {
            const html = `
            <div class="modal" id="setting-whatsapp-modal">
                <div class="modal-content" style="max-width: 450px;">
                    <div class="modal-title-bar">
                        <h3><i class="fab fa-whatsapp" style="color:#25D366;"></i> ربط المساعد بواتساب</h3>
                        <button class="close-btn" onclick="closeM('setting-whatsapp-modal')"><i class="fas fa-times"></i></button>
                    </div>

                    <p style="color: var(--text-muted); font-size: 0.82rem; line-height: 1.5;">
                        يحتاج هذا الربط حساب <b>WhatsApp Business API (Meta Cloud API)</b> خاص بمتجرك.
                    </p>

                    <div class="setting-item" style="cursor: default; margin-top: 8px;">
                        <div class="s-label"><i class="fas fa-power-off text-success"></i> تفعيل الربط بواتساب</div>
                        <div class="s-val">
                            <label class="toggle-switch">
                                <input type="checkbox" id="wa-config-enabled">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top: 12px;">
                        <label>Phone Number ID:</label>
                        <input type="text" id="wa-config-phone-id" class="modern-input" placeholder="مثال: 109876543211234" dir="ltr">
                    </div>

                    <div class="input-group" style="margin-top: 12px;">
                        <label>Access Token:</label>
                        <input type="password" id="wa-config-access-token" class="modern-input" placeholder="اتركه فارغاً للإبقاء على القيمة المحفوظة سابقاً" dir="ltr">
                        <small id="wa-config-token-hint" style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; display: block;"></small>
                    </div>

                    <div class="input-group" style="margin-top: 12px;">
                        <label>رقم الواتساب (اختياري):</label>
                        <input type="text" id="wa-config-display-phone" class="modern-input" placeholder="مثال: +967 7xx xxx xxx" dir="ltr">
                    </div>

                    <hr style="border-color: var(--border-glass); margin: 16px 0;">

                    <div class="input-group">
                        <label>Callback URL:</label>
                        <div style="display:flex; gap:6px;">
                            <input type="text" id="wa-config-webhook-url" class="modern-input" readonly dir="ltr" style="flex:1;">
                            <button class="btn-outline" style="width:auto; padding: 0 12px;" onclick="copyWaField('wa-config-webhook-url')"><i class="far fa-copy"></i></button>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top: 8px;">
                        <label>Verify Token:</label>
                        <div style="display:flex; gap:6px;">
                            <input type="text" id="wa-config-verify-token" class="modern-input" readonly dir="ltr" style="flex:1;">
                            <button class="btn-outline" style="width:auto; padding: 0 12px;" onclick="copyWaField('wa-config-verify-token')"><i class="far fa-copy"></i></button>
                        </div>
                    </div>

                    <button class="btn-main" style="margin-top: 18px;" onclick="saveWhatsappConfig()">
                        <i class="fas fa-save"></i> حفظ إعدادات واتساب
                    </button>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    injectWhatsappModal();

    let isSavingWaConfigLock = false;

    // ===== جلب إعدادات واتساب =====
    window.loadWhatsappConfig = async function () {
        injectWhatsappModal();
        const res = await window.apiReq('get_whatsapp_config', {}, 'POST', false, true);
        if (!res || res.status !== 'success') return;
        const cfg = res.data || {};

        const elEnabled = document.getElementById('wa-config-enabled');
        const elPhoneId = document.getElementById('wa-config-phone-id');
        const elToken = document.getElementById('wa-config-access-token');
        const elTokenHint = document.getElementById('wa-config-token-hint');
        const elDisplayPhone = document.getElementById('wa-config-display-phone');
        const elWebhookUrl = document.getElementById('wa-config-webhook-url');
        const elVerifyToken = document.getElementById('wa-config-verify-token');

        if (elEnabled) elEnabled.checked = !!cfg.enabled;
        if (elPhoneId) elPhoneId.value = cfg.phone_number_id || '';
        if (elToken) elToken.value = '';
        if (elTokenHint) elTokenHint.textContent = cfg.has_access_token ? `محفوظ: ${cfg.access_token_masked}` : 'لم يتم حفظ Access Token بعد.';
        if (elDisplayPhone) elDisplayPhone.value = cfg.display_phone_number || '';
        if (elWebhookUrl) elWebhookUrl.value = cfg.webhook_url || '';
        if (elVerifyToken) elVerifyToken.value = cfg.verify_token || '';

        const statusEl = document.getElementById('display-whatsapp-status');
        if (statusEl) statusEl.textContent = cfg.enabled ? 'مربوط ✅' : 'غير مربوط';
    };

    // ===== حفظ إعدادات واتساب =====
    window.saveWhatsappConfig = async function () {
        if (isSavingWaConfigLock) return;
        isSavingWaConfigLock = true;
        const btn = document.querySelector('#setting-whatsapp-modal .btn-main');
        if (btn) btn.disabled = true;

        const enabled = document.getElementById('wa-config-enabled').checked;
        const phoneNumberId = document.getElementById('wa-config-phone-id').value.trim();
        const accessToken = document.getElementById('wa-config-access-token').value.trim();
        const displayPhoneNumber = document.getElementById('wa-config-display-phone').value.trim();

        if (enabled && !phoneNumberId) {
            isSavingWaConfigLock = false;
            if (btn) btn.disabled = false;
            window.showT('أدخل Phone Number ID أولاً', 'error');
            return;
        }

        const res = await window.apiReq('save_whatsapp_config', {
            enabled,
            phone_number_id: phoneNumberId,
            access_token: accessToken,
            display_phone_number: displayPhoneNumber
        });

        isSavingWaConfigLock = false;
        if (btn) btn.disabled = false;

        if (res && res.status === 'success') {
            window.showT(res.message || 'تم الحفظ ✅', 'success');
            await window.loadWhatsappConfig();
            window.closeM('setting-whatsapp-modal');
        } else {
            window.showT((res && res.message) || 'فشل حفظ الإعدادات', 'error');
        }
    };

    window.copyWaField = function (elementId) {
        const el = document.getElementById(elementId);
        if (!el || !el.value) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(el.value).then(() => window.showT('تم النسخ ✅', 'success')).catch(() => window.fallbackCopy(el.value));
        } else {
            window.fallbackCopy(el.value);
        }
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('whatsapp');

})();
