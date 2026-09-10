// =========================================================================
// ملف auth.js - إدارة نظام تسجيل الدخول والمصادقة (النسخة النهائية المصححة)
// =========================================================================

console.log("🔒 جاري تهيئة وحدة المصادقة وتسجيل الدخول...");

// رابط الـ API الخاص بك
// الكود الصحيح
const AUTH_API_URL = 'https://api-hluk.onrender.com/api.php';
window.isOtpPending = false;
window.currentAuthPhone = null;
window.isProcessingV = false;
window.tempStateToken = null;
window.otpCooldownInterval = null;
window.smartTapState = 'idle'; // ⭐ تعريف الحالة بشكل عام لمنع أخطاء التوقف

// دالة الاتصال المباشر بالخادم
window.authApiRequest = async function(action, payload = {}) {
    payload.action = action;
    try {
        const response = await fetch(AUTH_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'omit',
            body: JSON.stringify(payload)
        });
        
        return await response.json();
    } catch (error) {
        console.error("Auth API Error:", error);
        throw new Error("فشل الاتصال بالخادم، يرجى التأكد من اتصالك بالإنترنت.");
    }
};

const AuthUI = {
    template: `
        <div id="auth-page-overlay">
            <div class="auth-card transition-element">
                <button id="auth-close-btn" onclick="toggleAuthPage(false)"><i class="fas fa-times"></i></button>
                
                <!-- واجهة إدخال رقم الهاتف -->
                <div id="auth-phone-view">
                    <i class="fas fa-user-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: 15px;"></i>
                    <h3>تسجيل الدخول</h3>
                    <p>أدخل رقم هاتفك للوصول لحسابك</p>

                    <div class="phone-input-group" id="phone-entry-area">
                        <div class="phone-input-container">
                            <div class="country-code">+967</div>
                            <input type="tel" id="auth-phone-input" class="phone-input-field" placeholder="7XXXXXXXX" maxlength="9" autocomplete="tel">
                        </div>
                        <button type="button" id="pre-submit-btn" class="btn-action primary" style="margin-top: 20px;" onclick="showVerificationGame()">
                            متابعة <i class="fas fa-arrow-left" style="margin-right: 8px;"></i>
                        </button>
                    </div>

                    <!-- حاوية اللعبة (التحقق الذكي) -->
                    <div class="smart-tap-wrapper" id="smart-tap-container" style="display: none;">
                        <button type="button" class="smart-tap-btn" id="smart-tap-btn">
                            <svg class="progress-ring" width="100" height="100">
                                <circle class="progress-ring__circle" stroke="var(--accent)" stroke-width="6" fill="transparent" r="45" cx="50" cy="50" style="stroke-dasharray: 282.7; stroke-dashoffset: 282.7;"/>
                            </svg>
                            <div class="icon-container">
                                <i class="fas fa-fingerprint"></i>
                            </div>
                        </button>
                        <p class="instruction-text" id="smart-tap-text" style="transition: color 0.3s; padding: 0 10px;">انقر للتحقق وبدء الإرسال</p>
                    </div>

                    <input type="hidden" id="proof_token" name="proof_token">
                </div>

                <!-- واجهة إدخال كود التحقق (OTP) -->
                <div id="auth-otp-view" style="display: none;">
                    <i class="fas fa-lock" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 15px;"></i>
                    <h3>تأكيد الرقم</h3>
                    <p style="margin-bottom: 5px;">أدخل كود التحقق المرسل إلى:</p>
                    <p id="otp-sent-to-phone" style="font-weight:900; direction:ltr; font-size: 1.2rem; color: var(--text-main); margin-bottom: 15px;"></p>
                    
                    <div style="margin-bottom: 20px;">
                        <a href="#" onclick="confirmChangeNumber(event)" style="color: var(--danger); font-size: 0.85rem; text-decoration: none; font-weight: 800; background: rgba(244,63,94,0.05); padding: 5px 12px; border-radius: 50px;">
                            تعديل الرقم <i class="fas fa-pen"></i>
                        </a>
                    </div>

                    <button type="button" onclick="smartPasteFromClipboard()" style="background: transparent; border: none; color: var(--primary); font-weight: 800; margin-bottom: 20px; cursor: pointer; font-size: 0.95rem; text-decoration: underline;">
                        <i class="fas fa-paste"></i> لصق الكود
                    </button>
                    
                    <form id="otp-form" onsubmit="handleOtpVerification(event)">
                        <div class="modern-otp-container" id="otp-inputs-wrapper">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric" autocomplete="one-time-code">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-box" maxlength="1" inputmode="numeric">
                        </div>
                        <input type="hidden" id="otp-input" value="">
                        
                        <div id="otp-loading-indicator" style="display: none; align-items: center; justify-content: center; gap: 10px; color: var(--primary); font-weight: bold; margin-top: 15px;">
                            <i class="fas fa-spinner fa-spin"></i> جاري التحقق والدخول...
                        </div>
                    </form>
                    <p id="resend-otp-container" style="margin-top: 25px; font-size: 1rem; font-weight: 700;">
                        <a href="#" id="resend-otp-link" style="text-decoration: none; color: var(--text-muted);">إعادة إرسال الرمز</a>
                    </p>
                </div>           

                <!-- واجهة إدخال الاسم للعميل الجديد -->
                <div id="auth-name-view" style="display: none;">
                    <i class="fas fa-hand-sparkles" style="font-size: 3.5rem; color: var(--primary); margin-bottom: 15px; animation: wave 2s infinite;"></i>
                    <h3 style="font-size: 2rem;">أهلاً بك معنا! 🎉</h3>
                    <p>يبدو أنها زيارتك الأولى لنا. لتجربة أفضل، يرجى كتابة اسمك الكريم.</p>
                    <form id="name-setup-form" onsubmit="handleNameSubmit(event)">
                        <div class="form-group" style="margin-top: 25px;">
                            <input type="text" id="new-user-name" placeholder="مثال: محمد عبدالله" required style="text-align: center; font-weight: 900; font-size: 1.3rem;">
                        </div>
                        <button type="submit" class="btn-action primary" style="margin-top: 15px;"><span class="btn-text">حفظ الدخول</span><i class="fas fa-check" style="margin-right: 8px;"></i></button>
                    </form>
                </div>

                <!-- واجهة الأخطاء -->
                <div id="auth-error-view" style="display: none;">
                    <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--danger); margin-bottom: 15px;"></i>
                    <h3>نعتذر منك</h3>
                    <p id="auth-error-msg" style="margin-bottom: 25px; line-height: 1.6;"></p>
                    <a href="https://wa.me/967770094456" class="btn-action" style="background: #25D366; color: white; text-decoration: none;"><i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i> تواصل معنا للتفعيل</a>
                    <button type="button" class="btn-action" style="background: transparent; border: 2px solid var(--border); color: var(--text-main); margin-top: 15px;" onclick="switchAuthView('phone')">رجوع</button>
                </div>
            </div>
        </div>
    `,
    init: function() {
        if (!document.getElementById('auth-page-overlay')) {
            document.body.insertAdjacentHTML('beforeend', this.template);
            console.log("✅ تم حقن واجهة المصادقة بنجاح!");
            setTimeout(() => {
                if (typeof window.setupOtpInputs === 'function') window.setupOtpInputs();
            }, 100);
        }
    }
};

// ⭐ إصلاح الخطأ: تعريف دالة إعادة الضبط كدالة عامة منذ البداية
window.resetSmartTapChallenge = function() {
    window.smartTapState = 'idle';
    const btn = document.getElementById('smart-tap-btn');
    const text = document.getElementById('smart-tap-text');
    if (!btn || !text) return;
    
    const ring = btn.querySelector('.progress-ring__circle');
    if (ring) {
        ring.style.transition = 'none';
        ring.style.strokeDashoffset = '282.7';
    }

    btn.style.pointerEvents = 'auto';
    btn.classList.remove('running', 'success', 'error');
    text.textContent = 'انقر للتحقق وبدء الإرسال';
    text.style.color = 'var(--text-muted)';
};

window.toggleAuthPage = function(show) { 
    const overlay = document.getElementById('auth-page-overlay');
    if (!overlay) return;
    
    if (show) {
        if (typeof lockBodyScroll === 'function') lockBodyScroll(true); 
        overlay.classList.add('open'); 
        if (window.isOtpPending) {
            window.switchAuthView('otp');
        } else {
            window.switchAuthView('phone');
        }
    } else { 
        overlay.classList.remove('open'); 
        if (typeof lockBodyScroll === 'function') lockBodyScroll(false); 
    }
};    

window.switchAuthView = function(view) { 
    document.getElementById('auth-phone-view').style.display = 'none'; 
    document.getElementById('auth-otp-view').style.display = 'none'; 
    document.getElementById('auth-error-view').style.display = 'none'; 
    document.getElementById('auth-name-view').style.display = 'none';
    
    if (view === 'phone') { 
        document.getElementById('auth-phone-view').style.display = 'block'; 
        document.getElementById('auth-close-btn').style.display = 'flex'; 
        document.getElementById('phone-entry-area').style.display = 'block';
        document.getElementById('smart-tap-container').style.display = 'none';
        setTimeout(() => {
            const phoneInp = document.getElementById('auth-phone-input');
            if(phoneInp) phoneInp.focus();
        }, 100);
        window.resetSmartTapChallenge();
    } 
    else if (view === 'otp') {
        window.showOtpView(); 
    } 
    else if (view === 'error') { 
        document.getElementById('auth-error-view').style.display = 'block'; 
        document.getElementById('auth-close-btn').style.display = 'flex'; 
    } 
    else if (view === 'name') { 
        document.getElementById('auth-name-view').style.display = 'block'; 
        document.getElementById('auth-close-btn').style.display = 'none'; 
        setTimeout(() => {
            const nameInp = document.getElementById('new-user-name');
            if(nameInp) nameInp.focus();
        }, 100); 
    }
};

window.showOtpView = function() {
    window.isOtpPending = true; 
    document.getElementById('auth-phone-view').style.display = 'none'; 
    document.getElementById('auth-otp-view').style.display = 'block'; 
    document.getElementById('auth-close-btn').style.display = 'none'; 
    
    document.getElementById('otp-sent-to-phone').textContent = window.currentAuthPhone ? `+967 ${window.currentAuthPhone}` : 'الرقم المدخل';
    document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.className = 'otp-box'; b.disabled = false; }); 
    document.getElementById('otp-input').value = ''; 
    document.getElementById('otp-loading-indicator').style.display = 'none';
    
    setTimeout(() => {
        const firstBox = document.querySelector('.otp-box');
        if(firstBox) firstBox.focus();
    }, 300);
};

window.setupResendLink = function() { 
    const link = document.getElementById('resend-otp-link');
    if(link) {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            document.getElementById('auth-otp-view').style.display = 'none';
            document.getElementById('auth-phone-view').style.display = 'block';
            window.showVerificationGame(); 
        });
    }
};

window.startOtpCooldown = function(seconds) {
    const resendLink = document.getElementById('resend-otp-link');
    const resendContainer = document.getElementById('resend-otp-container');
    if(!resendLink || !resendContainer) return;
    
    resendLink.style.pointerEvents = 'none'; 
    resendLink.style.opacity = '0.5';
    let timeLeft = seconds;
    
    const updateTimer = () => {
        if (timeLeft <= 0) { 
            clearInterval(window.otpCooldownInterval); 
            resendContainer.innerHTML = '<a href="#" id="resend-otp-link" style="text-decoration: none; color: var(--accent);">إعادة إرسال الرمز</a>'; 
            window.setupResendLink(); 
        } else { 
            resendContainer.innerHTML = `يمكنك إعادة الإرسال بعد (${timeLeft} ثانية)`; 
            timeLeft--; 
        }
    };
    
    clearInterval(window.otpCooldownInterval); 
    updateTimer(); 
    window.otpCooldownInterval = setInterval(updateTimer, 1000);
};

window.handlePhoneSubmitWithLock = async function() {
    const phoneInput = document.getElementById('auth-phone-input');
    const proofToken = document.getElementById('proof_token').value;
    const smartTapText = document.getElementById('smart-tap-text');
    
    let phone = phoneInput.value.trim().replace(/[^0-9]/g, '');
    if (phone.startsWith('967')) phone = phone.substring(3);
    if (phone.startsWith('0')) phone = phone.substring(1);
    
    if (phone.length !== 9) {
        if(typeof showToast === 'function') showToast('الرقم يجب أن يتكون من 9 أرقام', 'error');
        window.switchAuthView('phone');
        return;
    }
    
    window.currentAuthPhone = phone; 

    try {
        const result = await window.authApiRequest('auth_request_otp', { 
            phone: phone, 
            proof_token: proofToken
        });

        if (result.status === 'success') {
            window.tempStateToken = result.state_token;
            window.showOtpView(); 
            window.startOtpCooldown(result.cooldown || 120);
        } else {
            if (result.message && (result.message.includes('محظور') || result.message.includes('تواصل'))) { 
                document.getElementById('auth-error-msg').textContent = result.message; 
                window.switchAuthView('error'); 
            } else {
                if(typeof showToast === 'function') showToast(result.message, 'error');
                
                if (smartTapText) {
                    smartTapText.textContent = result.message || 'حدث خطأ في السيرفر';
                    smartTapText.style.color = 'var(--danger)';
                }

                setTimeout(() => {
                    document.getElementById('smart-tap-container').style.display = 'none';
                    document.getElementById('phone-entry-area').style.display = 'block';
                    window.resetSmartTapChallenge();
                }, 3500);
            }
        }
    } catch (e) {
        if(typeof showToast === 'function') showToast(e.message || 'فشل الاتصال', 'error');
        if (smartTapText) {
            smartTapText.textContent = e.message || 'فشل الاتصال';
            smartTapText.style.color = 'var(--danger)';
        }
        setTimeout(() => {
            document.getElementById('smart-tap-container').style.display = 'none';
            document.getElementById('phone-entry-area').style.display = 'block';
            window.resetSmartTapChallenge();
        }, 3500);
    }
};

window.setupOtpInputs = function() {
    let boxes = document.querySelectorAll('.otp-box');
    const hiddenInput = document.getElementById('otp-input');
    if(boxes.length === 0 || !hiddenInput) return;
    
    window.isProcessingV = false;
    hiddenInput.value = "";

    boxes.forEach(box => {
        const newBox = box.cloneNode(true);
        box.parentNode.replaceChild(newBox, box);
    });
    boxes = document.querySelectorAll('.otp-box');

    boxes.forEach((box, index) => {
        box.addEventListener('input', function(e) {
            let val = this.value.replace(/[^0-9]/g, '');
            if (val.length > 1) {
                window.autoFillAndLogin(val);
                return;
            }
            this.value = val;
            
            if (this.value) {
                this.classList.add('filled');
                if (index < boxes.length - 1) boxes[index + 1].focus();
            } else {
                this.classList.remove('filled');
            }
            window.checkAndSubmitAuto(); 
        });

        box.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                boxes[index - 1].focus();
                boxes[index - 1].value = '';
                boxes[index - 1].classList.remove('filled');
            }
        });

        box.addEventListener('paste', function(e) {
            e.preventDefault();
            const data = (e.clipboardData || window.clipboardData).getData('text');
            window.autoFillAndLogin(data);
        });
    });
};

window.autoFillAndLogin = function(text) {
    if (!text) return;
    const match = text.match(/\d{6}/);
    if (match) {
        const code = match[0];
        const boxes = document.querySelectorAll('.otp-box');
        code.split('').forEach((char, i) => {
            if (boxes[i]) {
                boxes[i].value = char;
                boxes[i].classList.add('filled');
            }
        });
        document.getElementById('otp-input').value = code;
        window.handleOtpVerification(); 
    } else {
        if(typeof showToast === 'function') showToast('لم نجد كوداً في النص المنسوخ', 'error');
    }
};

window.smartPasteFromClipboard = async function() {
    try {
        const text = await navigator.clipboard.readText();
        if (!text) throw new Error("empty");
        window.autoFillAndLogin(text);
    } catch (err) {
        if(typeof showToast === 'function') showToast("الرجاء كتابة الكود يدوياً أو إعطاء الصلاحية", "info");
    }
};

window.checkAndSubmitAuto = function() {
    const boxes = document.querySelectorAll('.otp-box');
    let currentCode = "";
    boxes.forEach(b => currentCode += b.value);
    
    document.getElementById('otp-input').value = currentCode;

    if (currentCode.length === 6 && !window.isProcessingV) {
        window.handleOtpVerification();
    }
};

window.handleOtpVerification = async function(e) {
    if (e) e.preventDefault();
    if (window.isProcessingV) return;

    const code = document.getElementById('otp-input').value;
    if (code.length !== 6) return;

    window.isProcessingV = true;
    const loader = document.getElementById('otp-loading-indicator');
    const boxes = document.querySelectorAll('.otp-box');
    
    boxes.forEach(b => b.disabled = true); 
    if(loader) loader.style.display = 'flex';

    try {
        const result = await window.authApiRequest('auth_verify_otp', { 
            otp: code, 
            phone: window.currentAuthPhone,
            state_token: window.tempStateToken 
        });

        if (result.status === 'success') {
            window.isOtpPending = false; 
            boxes.forEach(b => { b.classList.remove('error'); b.classList.add('success'); });
            
            if (result.token) localStorage.setItem('customer_token', result.token);

            if (result.customer) {
                let userSession = result.customer;
                userSession.loggedIn = true;
                // 👈 التعديل الحاسم هنا: تحديث المتغير العام فوراً قبل السيرفر
                window.user = userSession; 
                localStorage.setItem('nalsh_user_session', JSON.stringify(userSession));
            }
            
            if(typeof showToast === 'function') showToast('تم التحقق بنجاح ✅', 'success');

            setTimeout(() => {
                if (result.needs_profile_update) window.switchAuthView('name'); 
                else window.completeAuthSuccess(); 
            }, 1000);

        } else {
            if(typeof showToast === 'function') showToast(result.message || 'الكود غير صحيح ❌', 'error');
            window.resetOtpState();
        }
    } catch (err) {
        if(typeof showToast === 'function') showToast(err.message || 'خطأ في الاتصال بالسيرفر', 'error');
        window.resetOtpState();
    } finally {
        window.isProcessingV = false;
    }
};

window.resetOtpState = function() {
    const boxes = document.querySelectorAll('.otp-box');
    const loader = document.getElementById('otp-loading-indicator');
    
    window.isProcessingV = false;
    if(loader) loader.style.display = 'none';
    
    boxes.forEach(b => {
        b.disabled = false;
        b.value = '';
        b.classList.remove('success', 'filled');
        b.classList.add('error');
    });
    
    document.getElementById('otp-input').value = "";
    setTimeout(() => boxes.forEach(b => b.classList.remove('error')), 1000);
    if(boxes[0]) boxes[0].focus();
};

window.handleNameSubmit = async function(event) {
    if(event) event.preventDefault();
    const nameInput = document.getElementById('new-user-name').value.trim();
    
    if (nameInput.length < 3 || nameInput.startsWith('عميل')) { 
        if(typeof showToast === 'function') showToast('الرجاء إدخال اسمك الحقيقي (ثلاثي أو ثنائي على الأقل)', 'error'); 
        return; 
    }
    
    const submitBtn = event.target.querySelector('button');
    if(submitBtn) submitBtn.disabled = true;

    try {
        const result = await window.authApiRequest('update_customer_name_only', { 
            name: nameInput,
            auth_token: localStorage.getItem('customer_token') 
        });

        if (result.status === 'success') {
            let userSession = JSON.parse(localStorage.getItem('nalsh_user_session') || '{}');
            userSession.full_name = nameInput;
            userSession.loggedIn = true;
            localStorage.setItem('nalsh_user_session', JSON.stringify(userSession));
            
            if(typeof showToast === 'function') showToast('تم حفظ اسمك بنجاح! 🎉');
            window.completeAuthSuccess();
        } else {
            if(typeof showToast === 'function') showToast(result.message || 'فشل حفظ الاسم', 'error');
        }
    } catch (e) {
        if(typeof showToast === 'function') showToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
        if(submitBtn) submitBtn.disabled = false;
    }
};

window.completeAuthSuccess = async function() {
    window.toggleAuthPage(false); 
    if(typeof updateUIAfterLoginStateChange === 'function') updateUIAfterLoginStateChange();
    
    if(typeof checkSession === 'function') await checkSession(); 
    
    if (window.pendingCartAction && typeof addToCart === 'function') {
        const { product, qty, option } = window.pendingCartAction;
        addToCart(product, qty, option); 
        window.pendingCartAction = null; 
    }

    if (typeof isCheckoutAttempt !== 'undefined' && isCheckoutAttempt && typeof handleCheckoutClick === 'function') { 
        isCheckoutAttempt = false;
        setTimeout(() => { handleCheckoutClick(); }, 500);
    }
};

window.confirmChangeNumber = function(event) {
    if(event) event.preventDefault();
    window.isOtpPending = false; 
    if (window.otpCooldownInterval) clearInterval(window.otpCooldownInterval);
    window.switchAuthView('phone');
    if(typeof robotSpeak === 'function') robotSpeak("تمام، عدّل الرقم وبنتحقق من جديد 🛡️", "normal", 3000);
};

window.showVerificationGame = function() {
    const phoneInput = document.getElementById('auth-phone-input');
    let phone = phoneInput.value.trim();

    if (!phone || phone.length < 9) {
        if(typeof showToast === 'function') showToast('الرجاء إدخال رقم هاتف صحيح', 'error');
        return;
    }

    document.getElementById('phone-entry-area').style.display = 'none';
    document.getElementById('smart-tap-container').style.display = 'flex';
    
    if(typeof robotSpeak === 'function') robotSpeak("أثبت لي أنك إنسان ولست روبوت! 🤖🎮", "normal", 3000);
    window.initSmartTapChallenge(); 
};

window.initSmartTapChallenge = function() {
    const btn = document.getElementById('smart-tap-btn');
    const text = document.getElementById('smart-tap-text');
    if (!btn || !text) return;
    
    const ring = btn.querySelector('.progress-ring__circle');
    const proofTokenInput = document.getElementById('proof_token');

    let startTime = 0; 
    const REQUIRED_DURATION = 2000; 
    const SUCCESS_WINDOW = 400; 

    window.resetSmartTapChallenge(); 

    btn.onclick = () => {
        if (window.smartTapState === 'idle') {
            window.smartTapState = 'running';
            startTime = Date.now();
            
            btn.classList.add('running');
            text.textContent = 'انقر مرة أخرى عند اكتمال الدائرة!';
            ring.style.transition = `stroke-dashoffset ${REQUIRED_DURATION}ms linear`;
            ring.style.strokeDashoffset = '0';

            setTimeout(() => { 
                if (window.smartTapState === 'running') failChallenge('الوقت نفد!'); 
            }, REQUIRED_DURATION + SUCCESS_WINDOW);

        } else if (window.smartTapState === 'running') {
            const tapTime = Date.now();
            const timeDiff = tapTime - startTime;

            if (timeDiff >= (REQUIRED_DURATION - SUCCESS_WINDOW) && timeDiff <= (REQUIRED_DURATION + SUCCESS_WINDOW)) {
                window.smartTapState = 'success'; 
                btn.style.pointerEvents = 'none';
                btn.classList.remove('running');
                btn.classList.add('success');
                text.textContent = 'تم التحقق! جاري الإرسال...';
                text.style.color = 'var(--success)';

                const nonce = Math.random().toString(36).substring(2, 10);
                const payloadStr = `${startTime}|${tapTime}|${nonce}`;
                const encodedPayload = btoa(payloadStr);
                
                let clientHash = 0;
                for (let i = 0; i < payloadStr.length; i++) {
                    const char = payloadStr.charCodeAt(i);
                    clientHash = ((clientHash << 5) - clientHash) + char;
                    clientHash |= 0; 
                }

                proofTokenInput.value = `${encodedPayload}.${clientHash}`; 
                
                setTimeout(() => {
                    window.handlePhoneSubmitWithLock();
                }, 500);

            } else {
                failChallenge(timeDiff < REQUIRED_DURATION ? 'مبكر جداً!' : 'متأخر جداً!');
            }
        }
    };

    function failChallenge(reason) {
        window.smartTapState = 'error';
        btn.classList.add('error');
        btn.style.pointerEvents = 'none';
        text.textContent = reason + ' حاول مجدداً';
        text.style.color = 'var(--danger)';
        setTimeout(window.resetSmartTapChallenge, 1500);
    }
};

AuthUI.init();
