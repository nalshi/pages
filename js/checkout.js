// =========================================================================
// ملف checkout.js - إدارة الخريطة، تحديد الموقع، الفاتورة، وإتمام الطلب 
// (تم التحديث: مؤشر مثلث، زر تغيير الموقع، وحساب دقيق للمسافة من ملف التاجر)
// =========================================================================

console.log("📍 جاري تهيئة وحدة الدفع والخريطة...");

// متغيرات الخريطة العامة
window.map = null;
window.isMapInitialized = false;
window.checkoutRoutingControl = null;
window.checkoutMerchantCoords = null;
window.routeDebounceTimer = null;
window.searchTimerMap = null;
window.isLocationExplicitlySaved = false;
window.isOrderSubmitting = false;

// ==========================================
// ⭐ دوال مساعدة وحسابية
// ==========================================
// دالة ذكية لجلب إعدادات التاجر (تقرأ من KV Cache الجديد أو النظام القديم)
function getMerchantSettings(mId, mName) {
    // 1. أوثق مصدر: بيانات المتجر المحمّلة فعلياً بالذاكرة بهذه الجلسة (App.storeData)
    if (typeof App !== 'undefined' && App.storeData && App.storeData.settings) {
        return App.storeData.settings;
    }

    // 2. محاولة القراءة من الكاش الجديد (نظام Cloudflare KV الذي يخزن info.json)
    if (typeof App !== 'undefined' && App.currentStoreId) {
        try {
            const targetStore = App.currentStoreId.toLowerCase();
            const cachedInfo = localStorage.getItem(`customer_info_${targetStore}`);
            if (cachedInfo) {
                const storeInfo = JSON.parse(cachedInfo);
                if (storeInfo && storeInfo.settings) {
                    return typeof storeInfo.settings === 'string' ? JSON.parse(storeInfo.settings) : storeInfo.settings;
                }
            }
        } catch (e) { console.warn("KV Cache read error:", e); }
    }

    // 3. محاولة القراءة من النظام القديم كاحتياط
    if (typeof window.allMerchants !== 'undefined' && Array.isArray(window.allMerchants)) {
        let m = window.allMerchants.find(x => x.id == mId || x.username == mId);
        if (m && m.settings) {
            return typeof m.settings === 'string' ? JSON.parse(m.settings) : m.settings;
        }
    }
    
    return {};
}
function getCurrentUser() {
    if (typeof user !== 'undefined' && user) return user;
    if (window.user && window.user) return window.user;
    try {
        const savedSession = localStorage.getItem('nalsh_user_session');
        if (savedSession) return JSON.parse(savedSession);
    } catch (e) {}
    return { loggedIn: false };
}

function updateCurrentUser(updatedData) {
    if (typeof user !== 'undefined') Object.assign(user, updatedData);
    if (window.user) Object.assign(window.user, updatedData);
    const currentUser = getCurrentUser();
    Object.assign(currentUser, updatedData);
    localStorage.setItem('nalsh_user_session', JSON.stringify(currentUser));
}

// دالة حساب تكلفة التوصيل لتتطابق مع السيرفر (api.php)
function calculateDeliveryFee(distanceKm) {
    if (!distanceKm || distanceKm <= 0) return 1500; // السعر الافتراضي لو فشل الحساب
    const baseFee = 300;
    const feePerKm = 100;
    const roundingFactor = 50;
    const totalFee = baseFee + (distanceKm * feePerKm);
    return Math.ceil(totalFee / roundingFactor) * roundingFactor;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // المسافة بالكيلومتر
}

function extractCoords(url) {
    if (!url) return null;
    const match = url.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    return null;
}

// ==========================================
// 1. حقن واجهات الدفع (UI Templates)
// ==========================================
const CheckoutUI = {
    template: `
        <!-- 1. نافذة طلب صلاحية الموقع (GPS) -->
        <div class="modal-overlay transition-element" id="location-permission-overlay" onclick="hideLocationPermissionModal()"></div>
        <div class="sheet-modal transition-element" id="location-permission-modal" style="z-index: 10005;">
            <div class="sheet-handle" onclick="hideLocationPermissionModal()"><div></div></div>
            <div class="sheet-body" style="text-align: center;">
                <div style="width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px;">
                    <i class="fas fa-map-marker-slash" style="font-size: 2.5rem; color: var(--danger);"></i>
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 10px;">صلاحية الموقع مطلوبة</h3>
                <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.7;">
                    لحساب تكلفة التوصيل بدقة وتسهيل وصول طلبك، نحتاج لتفعيل خدمة الموقع (GPS).
                </p>
                <div style="text-align: right; background: var(--bg-body); padding: 15px; border-radius: 16px; border: 1px solid var(--border); font-size: 0.9rem; line-height: 2;">
                    <strong style="display: block; margin-bottom: 10px; color: var(--primary);"><i class="fab fa-android"></i> لمستخدمي أندرويد:</strong>
                    <ol style="padding-right: 20px; margin-bottom:0;">
                        <li>اذهب إلى <strong>إعدادات المتصفح</strong>.</li>
                        <li>اختر <strong>إعدادات المواقع</strong> ثم <strong>الموقع</strong>.</li>
                        <li>تأكد من السماح لمتجرنا بالوصول.</li>
                    </ol>
                    <hr style="border: none; border-top: 1px dashed var(--border); margin: 15px 0;">
                    <strong style="display: block; margin-bottom: 10px; color: var(--primary);"><i class="fab fa-apple"></i> لمستخدمي آيفون:</strong>
                     <ol style="padding-right: 20px; margin-bottom:0;">
                        <li>اذهب إلى <strong>الإعدادات</strong> > <strong>Safari</strong>.</li>
                        <li>انزل للأسفل واختر <strong>الموقع</strong> وحدد <strong>السماح</strong>.</li>
                    </ol>
                </div>
            </div>
            <div class="sheet-footer">
                <button type="button" class="btn-action primary" onclick="hideLocationPermissionModal()">فهمت، سأقوم بالتفعيل</button>
            </div>
        </div>

        <!-- 2. نافذة تحديد الموقع على الخريطة -->
        <div class="modal-overlay transition-element" id="checkout-modal-overlay" onclick="toggleCheckoutModal(false)"></div>
        <div class="sheet-modal transition-element" id="checkout-modal">
            <div class="sheet-handle" onclick="toggleCheckoutModal(false)"><div></div></div>
            <div class="sheet-body">
                <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 20px;">حدد موقعك بدقة</h3>
                <form id="checkout-form-view">
                    <div class="form-group" id="checkout-name-group" style="display: none;">
                        <label>الاسم الكامل <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="checkout-name" placeholder="أدخل اسمك الكريم" required>
                    </div>
                    
                    <div class="map-section">
                        <label>موقعك على الخريطة <span style="color:var(--danger)">*</span></label>
                        <div style="position:relative">
                            <div id="map-container">
                                <!-- مؤشر الخريطة على شكل مثلث -->
                                <svg class="center-map-pin" width="45" height="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 24L0 0h24z" fill="var(--danger)" stroke="#ffffff" stroke-width="1.5" />
                                </svg>
                            </div>
                            <button id="find-me-btn" type="button" onclick="getGeoLocation(event)" title="تحديد موقعي الحالي"><i class="fas fa-location-crosshairs"></i></button>
                            <button id="lock-location-btn" type="button" onclick="saveAddressAndConfirm()" title="اعتماد هذا الموقع"><i class="fas fa-check"></i></button>
                            <div id="map-instruction">اسحب الشاشة ليقع المثلث على موقعك</div>
                        </div>
                        <input type="url" id="checkout-gps" placeholder="سيظهر رابط الموقع هنا تلقائياً..." required readonly style="font-size: 0.9rem; padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.02); margin-top: 5px; border: 1px solid var(--border); cursor: not-allowed; opacity: 0.7; width: 100%;">
                    </div>

                    <div class="form-group">
                        <label>وصف إضافي للموقع (اختياري)</label>
                        <textarea id="checkout-details" rows="2" placeholder="أقرب معلم بارز، لون الباب، رقم الشقة..." style="width: 100%;"></textarea>
                    </div>
                </form>
            </div>
            <div class="sheet-footer">
                <button type="button" class="btn-action primary" onclick="saveAddressAndConfirm()">حفظ ومتابعة</button>
            </div>
        </div>

        <!-- 3. نافذة المراجعة النهائية (الفاتورة) -->
        <div class="modal-overlay transition-element" id="location-confirm-overlay" onclick="toggleLocationConfirmModal(false)"></div>
        <div class="sheet-modal transition-element" id="location-confirm-modal">
            <div class="sheet-handle" onclick="toggleLocationConfirmModal(false)"><div></div></div>
            <div class="sheet-body" style="position: relative;">
                <button class="modern-close-sheet" onclick="toggleLocationConfirmModal(false)" title="إغلاق"><i class="fas fa-times"></i></button>
                <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 10px; padding-left: 40px;">تفاصيل وتأكيد الطلب</h3>
                
                <!-- زر تغيير الموقع الجديد -->
                <div id="checkout-change-location-wrap" class="checkout-change-location-wrap" style="display: none;">
                    <div style="flex: 1; text-align: right; padding-left: 10px;">
                        <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">موقع التوصيل المحدد:</p>
                        <small id="checkout-current-address-text" style="font-weight: 800; color: var(--text-main); font-size: 0.9rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></small>
                    </div>
                    <button class="btn-change-location" type="button" onclick="openAddressEditor(true)">
                        <i class="fas fa-map-marker-alt"></i> تغيير
                    </button>
                </div>

                <div id="confirm-breakdown-container"></div>
            </div>
            <div class="sheet-footer" style="display: flex; flex-direction: column; gap: 15px;">
                <button type="button" id="submit-order-btn" class="btn-action primary" onclick="handleCheckout(event)">
                    <span class="btn-text">إرسال الطلب واعتماده</span>
                    <div class="spinner" style="display:none;"></div>
                </button>
            </div>
        </div>
    `,
    init: function() {
        if (!document.getElementById('checkout-modal')) {
            document.body.insertAdjacentHTML('beforeend', this.template);
        }
    }
};

// ==========================================
// فحص السلة المباشر
// ==========================================
window.handleCheckoutClick = async function() {
    console.log("🔍 بدء عملية الفحص...");
    const activeUser = getCurrentUser();

    if (!activeUser || !activeUser.loggedIn) {
        window.isCheckoutAttempt = true;
        if(typeof toggleAuthPage === 'function') toggleAuthPage(true);
        if(typeof showToast === 'function') showToast("يرجى تسجيل الدخول أولاً", "info");
        return;
    }

    if (!window.cart || window.cart.length === 0) {
        if(typeof showToast === 'function') showToast("السلة فارغة", "error");
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري فحص الأسعار والمخزون...';

    try {
        const verifyResponse = await window.apiRequest('verify_cart_live', { items: window.cart });

        if (!verifyResponse || verifyResponse.status !== 'success') {
            if(typeof showToast === 'function') showToast(verifyResponse?.message || "حدث خطأ أثناء فحص السلة، حاول مجدداً.", "error");
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalText;
            return;
        }

        if (verifyResponse.can_proceed === false) {
            console.log("⚠️ تم اكتشاف تغييرات في السلة:", verifyResponse.changes);
            let msg = verifyResponse.changes ? verifyResponse.changes.join(" | ") : "حدث تغيير في كمية أو أسعار المنتجات في المتجر.";
            if(typeof showToast === 'function') showToast(msg, "error");
            
            window.cart = verifyResponse.new_cart || [];
            if(typeof saveLocalData === 'function') saveLocalData();
            if(typeof updateCartUI === 'function') updateCartUI();
            
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalText;
            return; 
        }

        console.log("✅ الفحص ناجح، يتم الآن التأكد من بياناتك...");
        
        // ⭐ الإصلاح الجوهري: إغلاق السلة العصرية إجبارياً هنا ليكشف النوافذ التي تحته
        if (typeof window.closeModernCart === 'function') window.closeModernCart();

        const hasLocation = activeUser.address && typeof activeUser.address === 'string' && activeUser.address.includes('http');
        const userName = activeUser.full_name || activeUser.name || '';
        const hasRealName = userName && !userName.startsWith('عميل');

        if (!hasLocation || !hasRealName) {
            if(typeof showToast === 'function') showToast("يرجى تحديد موقعك واسمك بدقة 📍", "info");
            window.openAddressEditor(false); // false يعني يجب ادخال الاسم اذا كان ناقصاً
        } else {
            window.toggleLocationConfirmModal(true); 
        }

    } catch (error) {
        console.error("❌ خطأ أثناء الفحص:", error);
        if(typeof showToast === 'function') showToast(error.message || 'حدث خطأ في الاتصال بالسيرفر.', 'error');
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalText;
    }
};

// ==========================================
// التحكم بنوافذ الدفع والموقع
// ==========================================
window.showLocationPermissionModal = function() {
    const modal = document.getElementById('location-permission-modal');
    const overlay = document.getElementById('location-permission-overlay');
    if (modal && overlay) { overlay.classList.add('open'); modal.classList.add('open'); if(typeof lockBodyScroll === 'function') lockBodyScroll(true); }
};

window.hideLocationPermissionModal = function() {
    const modal = document.getElementById('location-permission-modal');
    const overlay = document.getElementById('location-permission-overlay');
    if (modal && overlay) { overlay.classList.remove('open'); modal.classList.remove('open'); if(typeof lockBodyScroll === 'function') lockBodyScroll(false); }
};

// تم التعديل لدعم تخطي الاسم عند التعديل
window.openAddressEditor = function(locationOnly = false) { 
    // ⭐ إضافة إغلاق إجباري للسلة
    if (typeof window.closeModernCart === 'function') window.closeModernCart();
    
    window.toggleLocationConfirmModal(false); 
    setTimeout(() => window.toggleCheckoutModal(true, locationOnly), 300); 
};
window.toggleCheckoutModal = function(show, locationOnly = false) {
    const modal = document.getElementById('checkout-modal');
    const overlay = document.getElementById('checkout-modal-overlay');
    if (!modal) return;
    
    if(typeof lockBodyScroll === 'function') lockBodyScroll(show);

    if (show) {
        window.isLocationExplicitlySaved = false;
        const activeUser = getCurrentUser();

        const nameGroup = document.getElementById('checkout-name-group');
        const nameInput = document.getElementById('checkout-name');
        const gpsInput = document.getElementById('checkout-gps');
        const detailsInput = document.getElementById('checkout-details');
        
        // إذا كان يملك اسم صحيح أو طلبنا فقط تعديل الموقع (بدون اسم)
        if ((activeUser.full_name && !activeUser.full_name.startsWith('عميل')) || locationOnly) { 
            nameGroup.style.display = 'none'; 
            nameInput.value = activeUser.full_name || ''; 
        } else { 
            nameGroup.style.display = 'block'; 
            nameInput.value = ''; 
        }

        if(activeUser.address) { 
            const parts = activeUser.address.split(' | '); 
            gpsInput.value = parts[0]?.replace('رابط الموقع: ', '') || ''; 
            detailsInput.value = parts[1]?.replace('التفاصيل: ', '') || ''; 
        } else { 
            gpsInput.value = ''; detailsInput.value = ''; 
        }

        overlay.classList.add('open'); modal.classList.add('open');
        
        setTimeout(() => {
            if (!window.L) {
                window.lazyLoadMap().then(() => {
                    window.initMap();
                    if (window.map) window.map.invalidateSize();
                }).catch(err => {
                    console.error('فشل تحميل خريطة التوصيل:', err);
                    if(typeof showToast === 'function') showToast('تعذر تحميل الخريطة، جرّب مجدداً', 'error');
                });
                return;
            }

            window.initMap();
            if(window.map) window.map.invalidateSize();
        }, 350);
    } else { 
        overlay.classList.remove('open'); modal.classList.remove('open'); 
        
        const gps = document.getElementById('checkout-gps').value.trim();
        if (!window.isLocationExplicitlySaved && gps && gps.includes('http')) {
            const details = document.getElementById('checkout-details').value.trim();
            const newAddress = `رابط الموقع: ${gps}` + (details ? ` | التفاصيل: ${details}` : '');
            
            updateCurrentUser({ address: newAddress });

            if(typeof updateCartUI === 'function') updateCartUI();
            if(typeof showToast === 'function') showToast('تم اعتماد آخر موقع تم تحديده 📍', 'info');
            setTimeout(() => { window.toggleLocationConfirmModal(true); }, 400);
        }
    }
};

window.saveAddressAndConfirm = function() {
    const nameInput = document.getElementById('checkout-name');
    let newName = getCurrentUser().full_name;

    // التحقق من الاسم فقط إذا كان الحقل ظاهراً
    if (document.getElementById('checkout-name-group').style.display !== 'none') {
        if (!nameInput.value.trim() || nameInput.value.trim().startsWith('عميل')) {
            if(typeof showToast === 'function') showToast('الرجاء إدخال اسمك الحقيقي لتسهيل التوصيل', 'error'); 
            nameInput.style.borderColor = 'var(--danger)'; 
            setTimeout(() => nameInput.style.borderColor = '', 2000); 
            return;
        }
        newName = nameInput.value.trim();
    }

    const gps = document.getElementById('checkout-gps').value.trim();
    const details = document.getElementById('checkout-details').value.trim();

    if (!gps || !gps.includes('http')) { 
        if(typeof showToast === 'function') showToast('الرجاء تحديد الموقع على الخريطة أولاً', 'error'); 
        return; 
    }

    const newAddress = `رابط الموقع: ${gps}` + (details ? ` | التفاصيل: ${details}` : '');
    
    updateCurrentUser({ full_name: newName, address: newAddress });

    window.isLocationExplicitlySaved = true; 
    
    if(typeof updateCartUI === 'function') updateCartUI(); 
    window.toggleCheckoutModal(false); 
    setTimeout(() => { window.toggleLocationConfirmModal(true); }, 300); 
};

// ==========================================
// خوارزميات الخريطة (Leaflet & Routing)
// ==========================================
window.initMap = function() {
    if (!window.L) {
        console.warn('Leaflet غير محمّل بعد، يتم تحميله الآن...');
        return window.lazyLoadMap().then(() => window.initMap());
    }

    if (window.isMapInitialized) return;

    const lightTile = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const yemenBounds = L.latLngBounds(L.latLng(12.1115, 41.8146), L.latLng(19.0000, 54.5342));

    window.map = L.map('map-container', { 
        zoomControl: false, 
        attributionControl: false,
        maxBounds: yemenBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 6
    }).setView([15.3694, 44.1910], 13);
    
    L.tileLayer(lightTile, { maxZoom: 19, bounds: yemenBounds, crossOrigin: true }).addTo(window.map);
    L.control.zoom({ position: 'bottomleft' }).addTo(window.map);

    window.setupCustomMapSearch();

    const container = document.getElementById('map-container');
    window.map.on('movestart', () => { container.classList.add('map-is-moving'); });
    window.map.on('moveend', () => {
        container.classList.remove('map-is-moving');
        const center = window.map.getCenter();
        window.updateLocationFromMap(center.lat, center.lng);
        localStorage.setItem('nalsh_last_lat', center.lat);
        localStorage.setItem('nalsh_last_lng', center.lng);
    });

    window.isMapInitialized = true;
    
    const gpsInput = document.getElementById('checkout-gps');
    if (gpsInput.value) {
        const coords = extractCoords(gpsInput.value);
        if (coords) { window.map.setView([coords.lat, coords.lng], 17); }
    } else {
        const cachedLat = localStorage.getItem('nalsh_last_lat');
        const cachedLng = localStorage.getItem('nalsh_last_lng');
        if(cachedLat && cachedLng) {
            window.map.setView([parseFloat(cachedLat), parseFloat(cachedLng)], 15);
            window.updateLocationFromMap(cachedLat, cachedLng);
        } else {
            window.getGeoLocation();
        }
    }
};

window.setupCustomMapSearch = function() {
    const mapCont = document.getElementById('map-container');
    if(document.getElementById('custom-map-search-wrapper')) return;

    const searchUI = `
        <div id="custom-map-search-wrapper" class="custom-map-search">
            <i class="fas fa-search"></i>
            <input type="text" id="map-search-input" placeholder="ابحث عن منطقة، شارع، مَعلم...">
        </div>
        <div id="map-search-results" class="search-results-dropdown"></div>
    `;
    mapCont.insertAdjacentHTML('beforeend', searchUI);

    const inputEl = document.getElementById('map-search-input');
    const resultsCont = document.getElementById('map-search-results');

    inputEl.addEventListener('input', (e) => {
        clearTimeout(window.searchTimerMap);
        const q = e.target.value.trim();
        
        if(q.length < 3) { resultsCont.style.display = 'none'; return; }

        window.searchTimerMap = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=ye&limit=5&accept-language=ar`);
                const data = await res.json();
                
                if(data.length > 0) {
                    resultsCont.innerHTML = data.map(item => `
                        <div class="search-result-item" onclick="selectMapSearchResult(${item.lat}, ${item.lon}, '${item.display_name.split(',')[0].replace(/'/g,"\\'")}')">
                            <i class="fas fa-map-marker-alt" style="margin-left: 8px; color: var(--primary);"></i> 
                            ${item.display_name}
                        </div>
                    `).join('');
                    resultsCont.style.display = 'block';
                } else {
                    resultsCont.innerHTML = '<div style="padding: 15px; text-align:center; color: var(--text-muted);">لا توجد نتائج. حاول بشكل مختلف.</div>';
                    resultsCont.style.display = 'block';
                }
            } catch(err) { console.error(err); }
        }, 600);
    });

    document.addEventListener('click', (e) => {
        if(!inputEl.contains(e.target) && !resultsCont.contains(e.target)) resultsCont.style.display = 'none';
    });
};

window.selectMapSearchResult = function(lat, lng, name) {
    if(window.map) window.map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
    document.getElementById('map-search-results').style.display = 'none';
    document.getElementById('map-search-input').value = name;
    window.updateLocationFromMap(lat, lng);
};

window.getMerchantCoordsFromCart = function() {
    if (typeof window.cart === 'undefined' || window.cart.length === 0) return null;
    
    // سحب بيانات التاجر عبر الدالة الذكية الجديدة
    const item = window.cart[0];
    const mSettings = getMerchantSettings(item.merchant_id, item.merchant_name);
    
    if (mSettings && mSettings.location) {
        return extractCoords(mSettings.location);
    }
    return null;
};

window.drawCheckoutRoute = function(lat, lng) {
    clearTimeout(window.routeDebounceTimer);
    window.routeDebounceTimer = setTimeout(() => {
        if (!window.checkoutMerchantCoords) window.checkoutMerchantCoords = window.getMerchantCoordsFromCart();

        if (!window.checkoutMerchantCoords) {
            console.warn('⚠️ [Checkout Map] لم يتم العثور على موقع التاجر (location) بإعدادات المتجر، لن يظهر مسار/مؤشر المتجر على الخريطة.');
            return;
        }
        if (typeof L === 'undefined' || typeof L.Routing === 'undefined') {
            console.warn('⚠️ [Checkout Map] مكتبة Leaflet Routing Machine غير محمّلة بالصفحة (L.Routing غير موجودة)، تأكد من إضافة سكربت leaflet-routing-machine.');
            return;
        }

        if (window.checkoutMerchantCoords && window.map) {
            try {
                if (window.checkoutRoutingControl) {
                    window.checkoutRoutingControl.setWaypoints([
                        L.latLng(window.checkoutMerchantCoords.lat, window.checkoutMerchantCoords.lng),
                        L.latLng(lat, lng)
                    ]);
                } else {
                    window.checkoutRoutingControl = L.Routing.control({
                        waypoints:[ L.latLng(window.checkoutMerchantCoords.lat, window.checkoutMerchantCoords.lng), L.latLng(lat, lng) ],
                        routeWhileDragging: false, addWaypoints: false, show: false, fitSelectedRoutes: false,
                        lineOptions: { styles:[{ color: '#10b981', opacity: 0.8, weight: 5, dashArray: '10, 10' }] },
                        createMarker: function(i, wp) {
                            if (i === 0) {
                                return L.marker(wp.latLng, {
                                    icon: L.divIcon({html:'<div style="background:var(--primary); color:white; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 0 10px rgba(0,0,0,0.5); border: 2px solid white;"><i class="fas fa-store"></i></div>', className:''})
                                });
                            }
                            return null; 
                        }
                    }).addTo(window.map);
                }
            } catch (err) {
                console.error('❌ [Checkout Map] فشل رسم المسار/مؤشر التاجر:', err);
            }
        }
    }, 800);
};

window.updateLocationFromMap = function(lat, lng) { 
    document.getElementById('checkout-gps').value = `https://www.google.com/maps?q=${lat},${lng}`; 
    window.drawCheckoutRoute(lat, lng); 
};

window.getGeoLocation = async function(event) {
    if(event) event.stopPropagation();
    if (!navigator.geolocation || !window.map) { 
        if(typeof showToast === 'function') showToast("خدمة الموقع غير مدعومة في متصفحك", "error"); 
        return; 
    } 

    const btn = document.getElementById('find-me-btn'); 
    
    if (navigator.permissions) {
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'denied') { window.showLocationPermissionModal(); return; }
            if (permission.state === 'prompt') { if(typeof showToast === 'function') showToast("يرجى السماح بتحديد موقعك 📍", "info"); }
        } catch(e) {}
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition( 
        p => { 
            window.map.setView([p.coords.latitude, p.coords.longitude], 17); 
            btn.innerHTML = '<i class="fas fa-location-crosshairs"></i>'; 
            if(typeof showToast === 'function') showToast("تم تحديد موقعك بدقة ✅", "success");
        }, 
        e => { 
            btn.innerHTML = '<i class="fas fa-location-crosshairs"></i>'; 
            if (e.code === 1) window.showLocationPermissionModal();
            else if(typeof showToast === 'function') showToast("فشل تحديد الموقع. تأكد من تفعيل الـ GPS.", "error"); 
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    ); 
};

// ==========================================
// 5. إنشاء وعرض الفاتورة (Invoice Breakdown)
// ==========================================
window.toggleLocationConfirmModal = function(show) {
    if (!show && window.isOrderSubmitting) return; 

    // ⭐ إضافة إغلاق إجباري للسلة العصرية عند استدعاء الفاتورة
    if (show && typeof window.closeModernCart === 'function') window.closeModernCart();

    const modal = document.getElementById('location-confirm-modal');
    const overlay = document.getElementById('location-confirm-overlay');
    if(typeof lockBodyScroll === 'function') lockBodyScroll(show);

    const activeUser = getCurrentUser(); 
    // ... (باقي كود الدالة يبقى كما هو تماماً بدون تغيير)
    if (show && activeUser && activeUser.loggedIn) { 
        let customerCoords = null;
        const changeLocationWrap = document.getElementById('checkout-change-location-wrap');
        const locationText = document.getElementById('checkout-current-address-text');

        if (!activeUser.address || activeUser.address.trim() === '' || !activeUser.address.includes('http')) {
            changeLocationWrap.style.display = 'none';
            document.getElementById('submit-order-btn').disabled = true;
            document.getElementById('confirm-breakdown-container').innerHTML = `
                <div style="background: rgba(239,68,68,0.1); padding: 20px; border-radius: var(--radius-xl); text-align: center; border: 1px dashed var(--danger);">
                    <i class="fas fa-map-marker-alt fa-bounce" style="color: var(--danger); font-size: 2.5rem; margin-bottom: 15px;"></i>
                    <p style="color: var(--danger); font-weight: 900; font-size:1.1rem; margin: 0; margin-bottom:15px;">يجب تحديد موقعك على الخريطة لحساب التوصيل</p>
                    <button class="btn-action" style="background: var(--bg-card); color: var(--text-main); border: 2px solid var(--danger); padding: 10px; font-size: 1rem;" onclick="openAddressEditor()"><i class="fas fa-map-marked-alt"></i> أضف موقعك الآن</button>
                </div>`;
        } else {
            // إظهار زر التغيير الجديد
            const parts = activeUser.address.split(' | التفاصيل:');
            const mapLink = parts[0].replace('رابط الموقع: ', '').trim();
            const desc = parts[1] ? parts[1].trim() : 'بدون وصف إضافي';
            customerCoords = extractCoords(mapLink); 
            
            locationText.innerText = desc;
            changeLocationWrap.style.display = 'flex';
            document.getElementById('submit-order-btn').disabled = false;

            const groupedCart = {};
            window.cart.forEach(item => {
                const mId = item.merchant_id;
                const mName = item.merchant_name;
                
                // استخدام الدالة الذكية لجلب إعدادات التاجر وتحديد موقعه بدقة
                let mSettingsObj = getMerchantSettings(mId, mName);
                
                if(!groupedCart[mName]) groupedCart[mName] = { items:[], merchantSettings: mSettingsObj, mId: mId };
                groupedCart[mName].items.push(item);
            });
            let breakdownHTML = '';
            let totalDeliveryYER = 0;
            // ⭐ إصلاح: نتتبع مجموع كل عملة على حدة بدل افتراض عملة واحدة لكل السلة
            const grandProductTotalsByCurrency = {};

            const escapeHTMLFunc = (typeof escapeHTML === 'function') ? escapeHTML : (str => str);

            for (const [merchantName, data] of Object.entries(groupedCart)) {
                let merchantSubtotalsByCurrency = {};
                let merchantItemCount = 0;
                let merchantSubtotalForThreshold = 0; // لأغراض حساب عتبة الشحن المجاني فقط

                let itemsStaticHTML = data.items.map(item => { 
                    const itemCurrency = item.currency || 'YER';
                    const itemTotal = item.price * item.qty;
                    merchantSubtotalsByCurrency[itemCurrency] = (merchantSubtotalsByCurrency[itemCurrency] || 0) + itemTotal;
                    merchantSubtotalForThreshold += itemTotal;
                    merchantItemCount += item.qty; 
                    return `
                    <div class="checkout-item-row">
                        <img src="${item.image}">
                        <div>
                            <h4>${item.name}</h4>
                            <small style="color:var(--text-muted); font-weight:bold;">الكمية: ${item.qty}</small>
                        </div>
                        <b>${itemTotal.toLocaleString()} ${itemCurrency}</b>
                    </div>`;
                }).join('');

                Object.entries(merchantSubtotalsByCurrency).forEach(([curr, amt]) => {
                    grandProductTotalsByCurrency[curr] = (grandProductTotalsByCurrency[curr] || 0) + amt;
                });

                let isFree = false;
                let shippingText = '';
                let thresh = parseFloat(data.merchantSettings.free_shipping_threshold) || 0;

                if (data.merchantSettings && (data.merchantSettings.free_shipping_enabled === true || data.merchantSettings.free_shipping_enabled === 'true')) {
                    let fType = data.merchantSettings.free_shipping_type || 'always';
                    if (fType === 'always' || (fType === 'order_value' && merchantSubtotalForThreshold >= thresh) || (fType === 'item_count' && merchantItemCount >= thresh)) {
                        shippingText = '<span class="shipping-badge shipping-free"><i class="fas fa-gift"></i> توصيل مجاني</span>'; 
                        isFree = true;
                    } else {
                        let remaining = fType === 'order_value' ? thresh - merchantSubtotalForThreshold : thresh - merchantItemCount;
                        shippingText = `<span class="shipping-badge shipping-paid">مجاني باقي ${remaining}</span>`;
                    }
                }

                let deliveryFeeForThisMerchant = 0;
                let distanceText = "";

                if (!isFree) {
                    // ⭐ التعديل الهام: الاعتماد على location التاجر من الـ settings للحساب الدقيق
                    if (data.merchantSettings && data.merchantSettings.location && customerCoords) {
                        const mCoords = extractCoords(data.merchantSettings.location);
                        if (mCoords) {
                            const distanceKm = calculateDistance(customerCoords.lat, customerCoords.lng, mCoords.lat, mCoords.lng);
                            deliveryFeeForThisMerchant = calculateDeliveryFee(distanceKm);
                            distanceText = `(المسافة: ${distanceKm.toFixed(1)} كم)`;
                        } else {
                            deliveryFeeForThisMerchant = 1500; 
                        }
                    } else {
                        deliveryFeeForThisMerchant = 1500; 
                    }
                    
                    totalDeliveryYER += deliveryFeeForThisMerchant;
                    shippingText = `<span class="shipping-badge" style="background: rgba(59, 130, 246, 0.1); color: var(--info); border: 1px solid rgba(59, 130, 246, 0.2);"><i class="fas fa-motorcycle"></i> حسب المسافة</span>`;
                }

                let mDeliveryDisplay = isFree 
                    ? '<span style="color:var(--success); font-weight:900;"><i class="fas fa-gift"></i> مجاني</span>' 
                    : `<span style="color:var(--info); font-weight:bold;">${deliveryFeeForThisMerchant.toLocaleString()} YER <small>${distanceText}</small></span>`;

                const merchantSubtotalHTML = Object.entries(merchantSubtotalsByCurrency)
                    .map(([curr, amt]) => `${amt.toLocaleString()} ${curr}`)
                    .join(' + ');
                
                breakdownHTML += `
                <div class="merchant-cart-group expanded" style="margin-bottom: 15px;">
                    <div class="merchant-cart-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="merchant-cart-header-title"><i class="fas fa-store"></i> ${escapeHTMLFunc(merchantName)}</div>
                        <div style="display:flex; align-items:center; gap:10px;">${shippingText}<i class="fas fa-chevron-down expand-icon"></i></div>
                    </div>
                    <div class="merchant-cart-body" style="padding:0;">
                        ${itemsStaticHTML}
                    </div>
                    <div class="merchant-cart-footer">
                        <div class="merchant-summary-row"><span>سعر المنتجات:</span> <span>${merchantSubtotalHTML}</span></div>
                        <div class="merchant-summary-row"><span>رسوم التوصيل:</span> <span>${mDeliveryDisplay}</span></div>
                    </div>
                </div>`;
            }

            // ⭐ عرض إجمالي كل عملة على حدة بدل خلطها ببعض
            const productsTotalsHTML = Object.entries(grandProductTotalsByCurrency)
                .map(([curr, amt]) => `<strong style="display:block;">${amt.toLocaleString()} <small style="font-size:1rem;">${curr}</small></strong>`)
                .join('');

            const finalTotalDisplay = `
                <div style="text-align: left; line-height: 1.4;">
                    ${productsTotalsHTML}
                    <strong style="display:block; color:var(--info);">+ ${totalDeliveryYER.toLocaleString()} <small style="font-size:1rem;">YER</small> <span style="font-size:0.8rem; font-weight:normal;">(توصيل)</span></strong>
                </div>`;

            breakdownHTML += `
            <div class="checkout-grand-total-box" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold;">مبلغ الطلب النهائي</span>
                ${finalTotalDisplay}
            </div>`;
            
            document.getElementById('confirm-breakdown-container').innerHTML = breakdownHTML;
        }
        overlay.classList.add('open'); modal.classList.add('open'); 
    } else { 
        overlay.classList.remove('open'); modal.classList.remove('open'); 
    }
};

// ==========================================
// الاعتماد النهائي وإرسال الطلب للسيرفر
// ==========================================
window.handleCheckout = async function(event) {
    if(event) event.preventDefault();
    
    if (window.isOrderSubmitting) return;
    
    const submitBtn = document.getElementById('submit-order-btn');
    const closeBtn = document.querySelector('#location-confirm-modal .modern-close-sheet');

    window.isOrderSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.spinner').style.display = 'block';
    submitBtn.querySelector('.btn-text').style.display = 'none';
    if (closeBtn) {
        closeBtn.style.opacity = '0.5';
        closeBtn.style.cursor = 'not-allowed';
    }

    try {
        const activeUser = getCurrentUser();

        const address = typeof activeUser.address === 'string' ? activeUser.address : '';
        const gpsMatch = address.match(/https?:\/\/[^\s|]+/);
        const gps = gpsMatch ? gpsMatch[0] : '';
        const generateUUIDFunc = (typeof generateUUID === 'function') ? generateUUID : () => Math.random().toString(36).substring(2);
        const idempotencyKey = 'order-' + generateUUIDFunc();
        
        console.log("🚀 جاري إرسال الطلب النهائي للسيرفر...");
        
        const result = await window.apiRequest('create_order', {
            customer: { name: activeUser.full_name, address, gps },
            idempotency_key: idempotencyKey,
            local_cart: window.cart
        });

        if (result.status === 'success') {
            console.log("✅ تمت العملية بنجاح!");
            if(typeof showToast === 'function') showToast(result.message || 'تم إرسال طلبك بنجاح! 🎉');
            window.cart = [];
            if(typeof saveLocalData === 'function') saveLocalData();
            if(typeof updateCartUI === 'function') updateCartUI();
            if(typeof fetchOrdersSilently === 'function') fetchOrdersSilently();
            
            window.isOrderSubmitting = false;
            window.toggleLocationConfirmModal(false);
            if(typeof togglePage === 'function') {
                togglePage('cart-page', false);
                setTimeout(() => togglePage('profile-page', true), 500);
            }
        } else {
            console.warn("⚠️ تم رفض الطلب من السيرفر:", result.message);
            if(typeof showToast === 'function') showToast(result.message || 'حدث خطأ أثناء معالجة الطلب.', 'error');
            
            if (result.message && (result.message.includes('كمية') || result.message.includes('مخزون') || result.message.includes('انتهت') || result.message.includes('نفد'))) {
                if(typeof verifyCartLiveState === 'function') verifyCartLiveState(); 
            }
        }
    } catch (error) {
        console.error("❌ خطأ حرج أثناء إتمام الطلب:", error);
        if(typeof showToast === 'function') showToast(error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        window.isOrderSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.spinner').style.display = 'none';
        submitBtn.querySelector('.btn-text').style.display = 'block';
        if (closeBtn) {
            closeBtn.style.opacity = '1';
            closeBtn.style.cursor = 'pointer';
        }
    }
};

// تشغيل وتهيئة الواجهة فوراً
CheckoutUI.init();
