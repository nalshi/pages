// =========================================================================
// ملف intro.js - شاشة التحميل الافتتاحية (محدث: يقرأ من info.json مباشرة)
// =========================================================================

const CDN_URL = 'https://nalsh.dpdns.org'; // رابط جلب البيانات

// 1. دالة استخراج يوزر/آيدي المتجر من الرابط
function resolveEarlyStoreId() {
    const rawPath = (window.location.pathname || '').replace(/\\/g, '/');
    const pathParts = rawPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    const ignoredPaths = ['', 'index.html', 'merchant-dashboard', 'login', 'api.php'];
    const urlParams = new URLSearchParams(window.location.search);
    const isFileUrl = window.location.protocol === 'file:';
    let storeId = urlParams.get('store') || 'nalsh';

    if (!isFileUrl && pathParts.length > 0) {
        const firstSegment = pathParts[0].toLowerCase();
        const isWindowsDrive = /^[a-z]:$/.test(pathParts[0]);
        if (!ignoredPaths.includes(firstSegment) && !isWindowsDrive) {
            storeId = pathParts[0];
        }
    }

    return storeId;
}

// 1.1 دالة قراءة الكاش المحلي (للتسريع إذا زار العميل المتجر مسبقاً)
function getEarlyCachedStoreInfo(storeId) {
    try {
        const cachedInfo = localStorage.getItem(`customer_info_${storeId.toLowerCase()}`);
        if (cachedInfo) return JSON.parse(cachedInfo);
    } catch (e) {}
    return null;
}

// 1.2 جلب البيانات من السيرفر (info.json) للزوار الجدد
async function fetchStoreInfoNetwork(storeId) {
    try {
        // إعداد مهلة (Timeout) قصيرة حتى لا يعلق الانترو إذا كان النت ضعيفاً
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const response = await fetch(`${CDN_URL}/stores/${storeId.toLowerCase()}/info.json`, {
            cache: 'no-store',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (e) {
        console.warn("⚠️ تعذر جلب info.json مبكراً أثناء الانترو:", e);
    }
    return null;
}

// =========================================================================
// 2. دالة حقن وبناء الـ HTML الخاص بالانترو
// =========================================================================
async function injectNalshIntro() {
    if (document.getElementById('smart-splash-screen')) return;

    const storeId = resolveEarlyStoreId();
    let storeName = storeId.toUpperCase();
    let welcomeMessage = null;
    let isDataFromCache = false;

    // محاولة جلب البيانات من الكاش أولاً (للسرعة القصوى)
    const cachedInfo = getEarlyCachedStoreInfo(storeId);
    if (cachedInfo) {
        storeName = cachedInfo.store_name || cachedInfo.name || storeName;
        welcomeMessage = cachedInfo.welcome_message || null;
        isDataFromCache = true;
    }

    const isArabic = /[\u0600-\u06FF]/.test(storeName); 

    const introHTML = `
        <div id="smart-splash-screen" style="display: flex; opacity: 1; flex-direction: column; align-items: center; justify-content: center; position: fixed; inset: 0; background: var(--bg-body, #ffffff); z-index: 99999; transition: opacity 0.8s ease;">
            <div class="intro-bg-glow" style="position: absolute; width: 200px; height: 200px; background: var(--primary, #4f46e5); filter: blur(80px); opacity: 0.3; border-radius: 50%; animation: pulseGlow 2s infinite alternate;"></div>
            
            <!-- اسم المتجر -->
            <div class="store-brand-intro" id="nalsh-intro-text" style="
                position: relative; z-index: 2;
                font-family: ${isArabic ? "'Tajawal', sans-serif" : "system-ui, sans-serif"};
                font-weight: 900; font-size: ${isArabic ? '2.8rem' : '2.5rem'};
                color: var(--text-main, #111); text-align: center;
                letter-spacing: ${isArabic ? '0' : '3px'};
                opacity: 0; transform: scale(0.8) translateY(20px);
                animation: introReveal 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
                text-shadow: 0px 10px 20px rgba(0,0,0,0.1);
            ">
                ${storeName}
            </div>

            <!-- حاوية الرسالة الترحيبية -->
            <div class="store-welcome-intro" id="nalsh-welcome-text" style="
                position: relative; z-index: 2; margin-top: 12px; padding: 0 30px;
                font-family: ${isArabic ? "'Tajawal', sans-serif" : "system-ui, sans-serif"};
                font-size: 0.95rem; font-weight: 500; line-height: 1.6;
                color: var(--text-muted, #64748b); text-align: center; max-width: 300px;
                opacity: 0; animation: introReveal 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.45s;
            ">
                ${welcomeMessage ? welcomeMessage : ''}
            </div>
            
            <div class="intro-loader-line" style="width: 100px; height: 4px; background: rgba(0,0,0,0.05); border-radius: 4px; margin-top: 30px; position: relative; overflow: hidden; z-index: 2;">
                <div style="position: absolute; top: 0; left: 0; height: 100%; width: 40%; background: var(--primary, #4f46e5); border-radius: 4px; animation: loaderSwipe 1.5s infinite ease-in-out;"></div>
            </div>
            
            <div class="intro-status-text" id="boot-status" style="margin-top: 15px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted, #64748b); z-index: 2; transition: color 0.3s;">
                جاري الاتصال بالمتجر...
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', introHTML);

    // إذا لم تكن البيانات من الكاش (زائر جديد)، نقوم بجلبها من info.json فوراً وتحديث الشاشة
    if (!isDataFromCache) {
        const networkInfo = await fetchStoreInfoNetwork(storeId);
        if (networkInfo) {
            let realName = networkInfo.store_name || networkInfo.name || networkInfo.full_name || storeName;
            
            let settings = networkInfo.settings || {};
            if (typeof settings === 'string') {
                try { settings = JSON.parse(settings); } catch(e){}
            }
            let realWelcome = settings.welcome_message || settings.bio || networkInfo.bio || "";

            // تحديث الشاشة فوراً بالبيانات الحقيقية
            const nameEl = document.getElementById('nalsh-intro-text');
            const welcomeEl = document.getElementById('nalsh-welcome-text');
            const isRealArabic = /[\u0600-\u06FF]/.test(realName);
            
            if (nameEl) {
                nameEl.innerText = realName;
                nameEl.style.fontFamily = isRealArabic ? "'Tajawal', sans-serif" : "system-ui, sans-serif";
                nameEl.style.fontSize = isRealArabic ? '2.8rem' : '2.5rem';
                nameEl.style.letterSpacing = isRealArabic ? '0' : '3px';
            }
            if (welcomeEl && realWelcome) {
                welcomeEl.innerText = realWelcome;
            }

            // حفظها في الكاش للمرة القادمة
            try {
                localStorage.setItem(`customer_info_${storeId.toLowerCase()}`, JSON.stringify({
                    store_name: realName,
                    welcome_message: realWelcome,
                    settings: settings
                }));
            } catch(e) {}
        }
    }
}

// =========================================================================
// 3. دالة تشغيل الانترو (Animation Logic)
// =========================================================================
async function playNalshIntroAnimation() {
    await injectNalshIntro(); // ننتظر حتى يبني الواجهة ويجلب البيانات

    const splash = document.getElementById('smart-splash-screen');
    const robot = document.querySelector('.cyber-robot');
    const statusText = document.getElementById('boot-status');

    if (!splash) return;

    splash.style.display = 'flex';
    splash.style.opacity = '1';
    document.body.classList.add('intro-locked');

    if (robot) {
        robot.classList.add('intro-mode');
        robot.style.display = 'block';
    }
    
    // نصوص التحميل المتغيرة
    const isArabic = /[\u0600-\u06FF]/.test(document.getElementById('nalsh-intro-text').innerText);
    const stages = isArabic 
        ? ["استدعاء البيانات...", "تجهيز الواجهة...", "اكتمل بنجاح!"]
        : ["Loading Data...", "Preparing UI...", "Ready!"];
        
    let stageIndex = 0;
    
    const textInterval = setInterval(() => {
        if (stageIndex < 2 && statusText) {
            statusText.innerText = stages[stageIndex];
            stageIndex++;
        }
    }, 600);

    // وقت الانتظار لإعطاء فرصة لرؤية الانترو
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearInterval(textInterval);

    if (statusText) {
        statusText.innerText = stages[2];
        statusText.style.color = 'var(--primary, #4f46e5)';
    }

    if (robot) {
        robot.classList.remove('intro-mode');
        robot.classList.add('status-completed'); 
    }

    await new Promise(r => setTimeout(r, 600));

    // إخفاء الانترو بسلاسة
    document.body.classList.add('store-ready');
    if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            document.body.classList.remove('intro-locked');
            if (robot) robot.classList.remove('status-completed');
        }, 800); 
    }
}

// تنفيذ الحقن فور تحميل الملف
injectNalshIntro();