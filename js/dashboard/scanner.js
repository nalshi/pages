/**
 * scanner.js — الماسح الضوئي لكود الاستلام وتأكيد التسليم
 * يُحمَّل عند الحاجة لمسح أو إدخال كود الاستلام (Lazy Loaded)
 */
(function () {
    'use strict';

    let html5QrCode = null;

    // ===== حقن HTML الخاص بنافذة كود التسليم =====
    function injectDeliveryModal() {
        if (!document.getElementById('merchant-delivery-code-modal')) {
            const html = `
            <div class="modal" id="merchant-delivery-code-modal" style="z-index: 10006;">
                <div class="modal-content" style="max-width: 400px; text-align: center;">
                    <div class="modal-title-bar" style="border:none; justify-content:center; margin-bottom: 0;">
                        <div style="width: 60px; height: 60px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 8px;">
                            <i class="fas fa-check-circle" style="font-size:2.2rem; color:var(--success);"></i>
                        </div>
                    </div>
                    <h3 style="font-weight:900; margin-bottom:6px; font-size: 1.3rem;">تأكيد تسليم الطلب</h3>
                    <p style="color: var(--text-muted); margin-bottom: 14px; font-size: 0.88rem;">أدخل كود التسليم المكون من 4 أرقام من العميل لتسليم الطلب.</p>
                    
                    <div id="delivery-order-selector-wrap" style="margin-bottom: 14px; text-align: right; display: none;">
                        <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); margin-bottom: 4px; display: block;">اختر الطلب المراد تسليمه:</label>
                        <select id="merchant-delivery-order-select" class="modern-input" style="padding: 10px; font-size: 0.9rem;" onchange="handleDeliveryOrderSelect(this)"></select>
                    </div>

                    <div id="delivery-order-badge-wrap" style="background: rgba(37, 99, 235, 0.06); padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border-glass); margin-bottom: 14px; text-align: right; display: none;">
                        <div style="font-weight: 900; color: var(--primary); font-size: 0.88rem;" id="delivery-order-target-title">الطلب #...</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);" id="delivery-order-target-subtitle">العميل: ...</div>
                    </div>

                    <input type="hidden" id="merchant-confirm-order-id">
                    <div id="qr-reader" style="margin-bottom: 12px; border-radius: 12px; overflow: hidden;"></div>

                    <div style="margin-bottom: 16px;">
                        <input type="tel" id="merchant-delivery-code-input" class="modern-input" placeholder="••••" style="font-size: 2rem; text-align: center; letter-spacing: 8px; font-weight: 900; padding: 10px;" maxlength="4" autocomplete="off" dir="ltr" inputmode="numeric">
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <button class="btn-main" style="background: var(--info); padding: 10px;" onclick="startScanner()" id="btn-start-scan"><i class="fas fa-qrcode"></i> مسح كود QR بالكاميرا</button>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-main" style="background: var(--success); flex: 2; padding: 10px;" onclick="submitMerchantDeliveryCode()" id="btn-submit-m-code">تأكيد التسليم</button>
                            <button class="btn-main" style="background: var(--bg-body); color: var(--text-main); border: 1px solid var(--border-glass); box-shadow: none; flex: 1; padding: 10px;" onclick="closeDeliveryModal()">إلغاء</button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    injectDeliveryModal();

    window.handleDeliveryOrderSelect = function (select) {
        const confId = document.getElementById('merchant-confirm-order-id');
        if (confId && select) confId.value = select.value;
    };

    // ===== فتح نافذة كود التسليم مع التحقق الصارم =====
    window.openDeliveryCodeModal = function (orderId) {
        injectDeliveryModal();

        const confId = document.getElementById('merchant-confirm-order-id');
        const codeInput = document.getElementById('merchant-delivery-code-input');
        const reader = document.getElementById('qr-reader');
        const startBtn = document.getElementById('btn-start-scan');
        const selectorWrap = document.getElementById('delivery-order-selector-wrap');
        const selector = document.getElementById('merchant-delivery-order-select');
        const badgeWrap = document.getElementById('delivery-order-badge-wrap');
        const badgeTitle = document.getElementById('delivery-order-target-title');
        const badgeSubtitle = document.getElementById('delivery-order-target-subtitle');

        if (codeInput) codeInput.value = '';
        if (reader) reader.style.display = 'none';
        if (startBtn) startBtn.style.display = 'flex';

        const activeOrders = window.AppStore ? window.AppStore.getOrders('active') : [];

        // إذا لم يتم تحديد معرف طلب، أو كان غير صالح
        if (!orderId || orderId === 'undefined' || orderId === 'null' || !String(orderId).trim()) {
            if (!activeOrders || activeOrders.length === 0) {
                window.showT('لا توجد طلبات نشطة حالياً لتأكيد تسليمها.', 'info');
                return;
            }

            if (selectorWrap && selector) {
                selectorWrap.style.display = 'block';
                selector.innerHTML = '<option value="">-- اختر الطلب --</option>' + activeOrders.map(o =>
                    `<option value="${window.escapeHTML(String(o.id))}">#${String(o.id).substring(0, 8)} - ${window.escapeHTML(o.customer_name || 'عميل')} (${(parseFloat(o.total_amount) || 0).toLocaleString()} ${window.escapeHTML(o.currency || 'YER')})</option>`
                ).join('');

                if (badgeWrap) badgeWrap.style.display = 'none';
                if (confId) confId.value = '';
            }
        } else {
            // طلب محدد بالمعرف
            const matchedOrder = activeOrders.find(o => String(o.id) === String(orderId));
            if (confId) confId.value = String(orderId);

            if (selectorWrap) selectorWrap.style.display = 'none';
            if (badgeWrap && badgeTitle && badgeSubtitle) {
                badgeWrap.style.display = 'block';
                badgeTitle.innerText = `الطلب #${String(orderId).substring(0, 8)}`;
                badgeSubtitle.innerText = matchedOrder ? `العميل: ${matchedOrder.customer_name || 'عميل'} • الإجمالي: ${(parseFloat(matchedOrder.total_amount) || 0).toLocaleString()} ${matchedOrder.currency || 'YER'}` : 'طلب نشط';
            }
        }

        window.openM('merchant-delivery-code-modal');
        setTimeout(() => { if (codeInput) codeInput.focus(); }, 200);
    };

    // ===== إغلاق نافذة كود التسليم =====
    window.closeDeliveryModal = function () {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                html5QrCode = null;
            }).catch(() => { });
        }
        window.closeM('merchant-delivery-code-modal');
    };

    // ===== تشغيل الماسح الضوئي (QR Scanner) =====
    window.startScanner = function () {
        const startBtn = document.getElementById('btn-start-scan');
        const reader = document.getElementById('qr-reader');
        if (startBtn) startBtn.style.display = 'none';
        if (reader) reader.style.display = 'block';

        if (typeof Html5Qrcode === 'undefined') {
            window.showT('مكتبة مسح QR غير جاهزة بعد', 'error');
            return;
        }

        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 };

        html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
            const cleanCode = String(decodedText || '').replace(/\D/g, '').slice(0, 4);
            const codeInput = document.getElementById('merchant-delivery-code-input');
            if (codeInput) codeInput.value = cleanCode;
            window.showT('تم مسح الكود بنجاح!', 'success');

            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                html5QrCode = null;
                if (reader) reader.style.display = 'none';
                if (startBtn) startBtn.style.display = 'flex';
                if (cleanCode.length === 4) {
                    window.submitMerchantDeliveryCode();
                }
            });
        }, () => { }).catch(() => {
            window.showT('تعذر تشغيل الكاميرا، يرجى إدخال الكود يدوياً.', 'warning');
            if (startBtn) startBtn.style.display = 'flex';
            if (reader) reader.style.display = 'none';
        });
    };

    // ===== إرسال كود التسليم لتأكيد الطلب مع التحقق الصارم =====
    window.submitMerchantDeliveryCode = async function () {
        const codeInput = document.getElementById('merchant-delivery-code-input');
        const confId = document.getElementById('merchant-confirm-order-id');
        const btn = document.getElementById('btn-submit-m-code');

        const code = codeInput ? codeInput.value.trim() : '';
        const orderId = confId ? confId.value.trim() : '';

        if (!orderId || orderId === 'undefined' || orderId === 'null') {
            window.showT('يرجى اختيار الطلب المراد تسليمه أولاً', 'error');
            return;
        }

        if (!code || !/^\d{4}$/.test(code)) {
            window.showT('أدخل كود تسليم صحيح من 4 أرقام', 'error');
            if (codeInput) codeInput.focus();
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
        }

        try {
            const res = await window.apiReq('confirm_delivery_code', { ticket_id: orderId, code: code });

            if (res && res.status === 'success') {
                window.showT(res.message || 'تم تأكيد تسليم الطلب بنجاح! 🎉', 'success');
                window.closeDeliveryModal();
                if (typeof window.updateOrderCardInPlace === 'function') {
                    window.updateOrderCardInPlace(orderId, 'completed');
                }
                setTimeout(() => {
                    if (typeof window.loadLocalDashboardStats === 'function') window.loadLocalDashboardStats();
                }, 800);
            } else {
                window.showT(res?.message || 'الكود غير صحيح، يرجى التأكد من العميل', 'error');
                if (codeInput) {
                    codeInput.value = '';
                    codeInput.focus();
                }
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'تأكيد التسليم';
            }
        }
    };

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('scanner');

})();
