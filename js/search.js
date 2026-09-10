// =========================================================================
// ملف search.js - محرك البحث الأصلي مع ميزات العزل والتحميل الذكي
// =========================================================================

console.log("🔍 جاري تهيئة وحدة البحث الأصلي المخصص...");

// التأكد من وجود دوال الحماية عالمياً بدون تصادم المعرفات (No Redeclarations)
if (typeof window.escapeHTML === 'undefined') {
    window.escapeHTML = function(str) {
        if (!str) return '';
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
}
if (typeof window.escapeAttr === 'undefined') {
    window.escapeAttr = function(str) {
        if (!str) return '';
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/`/g, '&#96;');
    };
}

// ==========================================
// 1. نظام العزل الذكي للمتجر الحالي
// ==========================================
window.getIsolatedSearchKey = function() {
    let storeId = 'nalsh_mall'; 
    if (typeof App !== 'undefined' && App.currentStoreId) {
        storeId = App.currentStoreId.toLowerCase();
    } else {
        const pathParts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
        const ignored = ['', 'index.html', 'merchant-dashboard', 'login', 'api.php'];
        if (pathParts.length > 0 && !ignored.includes(pathParts[0].toLowerCase())) {
            storeId = pathParts[0].toLowerCase();
        }
    }
    return `recent_searches_isolated_${storeId}`;
};

window.getRecentQueries = function() {
    try {
        const data = localStorage.getItem(window.getIsolatedSearchKey());
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

window.saveSearchQuery = function(query) {
    if (!query || query.length < 2) return;
    let queries = window.getRecentQueries();
    queries = queries.filter(q => q.toLowerCase() !== query.toLowerCase()); 
    queries.unshift(query); 
    queries = queries.slice(0, 10); 
    localStorage.setItem(window.getIsolatedSearchKey(), JSON.stringify(queries));
};

window.clearAllRecent = function() {
    localStorage.removeItem(window.getIsolatedSearchKey());
    window.renderSearchPage();
    if (typeof showToast === 'function') showToast("تم مسح السجل", "info");
};

window.normalizeArabic = function(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\w\sا-ي0-9]/g, "").trim();
};

// ==========================================
// 2. واجهة البحث المفضلة لديك (تصميمك الأصلي بالكامل)
// ==========================================
const SearchUI = {
    template: `
        <div class="page-overlay transition-element" id="search-page">
            <div class="page-header" style="gap: 15px;">
                <button class="icon-btn" style="border:none; box-shadow:none; background:transparent;" onclick="togglePage('search-page', false)">
                    <i class="fas fa-arrow-right"></i>
                </button>
                <div style="position: relative; width: 100%;">
                    <input type="text" id="search-input" placeholder="ابحث عن منتج..." style="width:100%; padding:14px 50px 14px 20px; border-radius:50px; border:2px solid var(--border); background: var(--bg-card); font-size:1.1rem; font-weight:700;" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
                    <button id="voice-search-btn" onclick="startVoiceSearch()" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary); font-size: 1.4rem; cursor: pointer; transition: 0.3s;">
                        <i class="fas fa-microphone"></i>
                    </button>
                </div>
            </div>
            <div class="page-body" id="search-page-body">
                <!-- هيكل تحميل ذكي يظهر بشكل وميض مؤقت لتجربة تصفح ممتازة -->
                <div id="search-shimmer-loading" style="display:none; padding:15px 0;">
                    <div class="skeleton-card" style="height: 120px; margin-bottom: 15px; border-radius: var(--radius-xl); width: 100%;"></div>
                    <div class="skeleton-card" style="height: 120px; margin-bottom: 15px; border-radius: var(--radius-xl); width: 100%;"></div>
                </div>
                
                <!-- حاوية النتائج وسجل البحث الفعلي -->
                <div id="search-results-content"></div>
            </div>
        </div>
    `,

    init: function() {
        if (!document.getElementById('search-page')) {
            document.body.insertAdjacentHTML('beforeend', this.template);
            
            const searchInputBox = document.getElementById('search-input');
            if (searchInputBox) {
                searchInputBox.addEventListener('input', window.handleSearchInput);
            }
            console.log("✅ تم حقن واجهة بحث المتجر المستقل بنجاح!");
        }
    }
};

// ==========================================
// 3. تحديث النص الإرشادي ديناميكياً للتاجر الحالي
// ==========================================
window.updateSearchPlaceholder = function() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    if (typeof App !== 'undefined' && App.storeData && App.storeData.name) {
        searchInput.placeholder = `ابحث داخل ${App.storeData.name}...`;
    } else if (typeof isIsolatedStore !== 'undefined' && isIsolatedStore) {
        searchInput.placeholder = `ابحث في هذا المتجر...`;
    } else {
        searchInput.placeholder = 'ابحث عن منتج أو قسم...';
    }
};

// ==========================================
// 4. آلية الفتح والعرض مع تأثير Shimmer
// ==========================================
window.renderSearchPage = function() {
    const shimmer = document.getElementById('search-shimmer-loading');
    const results = document.getElementById('search-results-content');
    const input = document.getElementById('search-input');
    
    if (input) {
        input.value = '';
        window.updateSearchPlaceholder();
    }

    if (shimmer && results) {
        shimmer.style.display = 'block';
        results.style.display = 'none';
        
        // محاكاة تحميل بيانات المتجر لحظياً (ربع ثانية لتجربة مستخدم فاخرة)
        setTimeout(() => {
            shimmer.style.display = 'none';
            results.style.display = 'block';
            window.renderSearchDefaultState(); 
            if (input) input.focus(); // تفعيل الحقل تلقائياً للكتابة
        }, 300);
    } else {
        window.renderSearchDefaultState();
    }
};

// رسم سجل البحث والكبسولات في الحالة الافتراضية
window.renderSearchDefaultState = function() {
    const container = document.getElementById('search-results-content');
    if (!container) return;
    
    const recentQueries = window.getRecentQueries();
    
    // سحب الفئات والأقسام ديناميكياً من بيانات المتجر الحالي فقط
    let suggestedCats = [];
    if (typeof App !== 'undefined' && App.storeData && App.storeData.categories) {
        suggestedCats = App.storeData.categories.map(c => c.name).slice(0, 8);
    } else if (typeof allDisplayCategories !== 'undefined') {
        suggestedCats = allDisplayCategories.slice(0, 8);
    }

    let html = '';

    if (recentQueries.length > 0) {
        html += `
        <div class="recent-searches-wrapper">
            <div class="section-header-inline">
                <h4><i class="fas fa-history" style="color:var(--text-muted)"></i> بحثت عنه سابقاً</h4>
                <button class="btn-text-only" onclick="window.clearAllRecent()">مسح الكل</button>
            </div>
            <div class="chips-container">
                ${recentQueries.map(q => `
                    <div class="search-chip" onclick="window.executeQuickSearch('${window.escapeAttr(q)}')">
                        <i class="fas fa-search"></i> ${window.escapeHTML(q)}
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    if (suggestedCats.length > 0) {
        html += `
        <div class="recent-searches-wrapper">
            <div class="section-header-inline">
                <h4><i class="fas fa-th-large" style="color:var(--text-muted)"></i> تصفح حسب القسم</h4>
            </div>
            <div class="chips-container">
                ${suggestedCats.map(cat => `
                    <div class="search-chip category-chip" onclick="window.executeQuickSearch('${window.escapeAttr(cat)}')">
                        <i class="fas fa-tag"></i> ${window.escapeHTML(cat)}
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    if (html === '') {
        html = `
        <div style="text-align:center; padding:50px 20px; opacity:0.5;">
            <i class="fas fa-search" style="font-size:3rem; margin-bottom:15px;"></i>
            <p>ابحث عن أي منتج في هذا المتجر</p>
        </div>`;
    }

    container.innerHTML = html;
};

// ==========================================
// 5. محرك الفلترة والتصفية والبحث الفعلي
// ==========================================
window.searchDebounceTimer = null; 
window.saveHistoryTimer = null;

window.handleSearchInput = function(e) { 
    clearTimeout(window.searchDebounceTimer); 
    const term = e.target.value.trim();
    const container = document.getElementById('search-results-content');
    
    if (term.length >= 2 || (!isNaN(term) && term.length > 0)) {
        container.innerHTML = `
            <div class="product-list-container" style="pointer-events: none; padding-top: 15px;">
                <div class="skeleton-card" style="height: 120px; margin-bottom: 10px; border-radius: var(--radius-xl); width:100%;"></div>
                <div class="skeleton-card" style="height: 120px; margin-bottom: 10px; border-radius: var(--radius-xl); width:100%;"></div>
            </div>`;
    }

    window.searchDebounceTimer = setTimeout(() => {
        if(term.length === 0) { window.renderSearchDefaultState(); return; }
        if(term.length < 2 && isNaN(term)) { container.innerHTML = ''; return; }
        window.renderSearchResults(term);
    }, 500);
};

window.renderSearchResults = function(term) {
    const container = document.getElementById('search-results-content');
    if (!container) return;
    
    if (!term || term.trim().length === 0) {
        window.renderSearchDefaultState();
        return;
    }

    const termNormalized = window.normalizeArabic(term);

    if (term.trim().length > 2) {
        clearTimeout(window.saveSearchTimer);
        window.saveHistoryTimer = setTimeout(() => window.saveSearchQuery(term.trim()), 1500);
    }

    let html = '';

    // البحث معزول 100% داخل منتجات التاجر الحالي فقط
    let pool = window.allProducts || []; 
    let matchedProducts = [];

    for (let i = 0; i < pool.length; i++) {
        let p = pool[i];
        let nName = window.normalizeArabic(p.name);
        let nType = window.normalizeArabic(p.type || p.department || '');
        
        if (nName.includes(termNormalized) || nType.includes(termNormalized)) {
            matchedProducts.push(p);
        }
        
        if (matchedProducts.length >= 20) break; // تسريع سرعة الرندر للهواتف الضعيفة
    }

    if (matchedProducts.length > 0) {
        html += `<span class="search-section-label">نتائج البحث (${matchedProducts.length})</span>`;
        html += `<div class="smart-results-grid">`;
        html += matchedProducts.map(p => typeof createCompactProductCard === 'function' ? createCompactProductCard(p, true) : '').join('');
        html += `</div>`;
    }

    if (html === '') {
        html = `
        <div style="text-align:center; padding:50px 20px; color:var(--text-muted);">
            <i class="fas fa-search-minus" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
            <p>لا توجد نتائج مطابقة لـ "${window.escapeHTML(term)}"</p>
        </div>`;
    }

    container.innerHTML = html;
    if (typeof updateFavoriteIcons === 'function') updateFavoriteIcons();
};

window.executeQuickSearch = function(term) {
    const input = document.getElementById('search-input');
    if (input) {
        input.value = term;
        window.renderSearchResults(term);
    }
};

// ==========================================
// 6. البحث الصوتي الخاص بتصميمك الأصلي
// ==========================================
window.startVoiceSearch = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { 
        if(typeof showToast === 'function') showToast('عذراً، متصفحك لا يدعم ميزة البحث الصوتي.', 'error'); 
        return; 
    }
    
    const recognition = new SpeechRecognition(); 
    recognition.lang = 'ar-SA'; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;
    
    const voiceBtn = document.getElementById('voice-search-btn'); 
    const originalIcon = voiceBtn.innerHTML;

    recognition.onstart = function() { 
        voiceBtn.innerHTML = '<i class="fas fa-microphone-alt" style="color: var(--danger); animation: pulse-border 1s infinite alternate;"></i>'; 
        if(typeof showToast === 'function') showToast('تحدث الآن... أنا أستمع 🎧', 'info'); 
    };
    
    recognition.onresult = function(event) { 
        const speechResult = event.results[0][0].transcript; 
        const input = document.getElementById('search-input');
        if(input) input.value = speechResult; 
        window.renderSearchResults(speechResult); 
        if(typeof robotSpeak === 'function') robotSpeak(`بحثت لك عن: "${speechResult}" 🕵️‍♂️`, 'happy', 4000); 
    };
    
    recognition.onerror = function() { 
        voiceBtn.innerHTML = originalIcon; 
        if(typeof showToast === 'function') showToast('لم أتمكن من سماعك بوضوح، حاول مجدداً.', 'error'); 
    };
    
    recognition.onend = function() { 
        voiceBtn.innerHTML = originalIcon; 
    }; 
    
    recognition.start();
};

// تفعيل الواجهة الأصلية فوراً
SearchUI.init();