// =========================================================================
// ملف orders.js - إدارة قسم طلباتي والملف الشخصي
// يحتوي على:
// 1. نظام (Adaptive REST Polling) لدعم ملايين المستخدمين مجاناً وبدون لاج.
// 2. نظام (Infinite Scroll & Virtualization) لعدم تجميد الأجهزة الضعيفة.
// 3. نظام (Skeleton Loaders & DOM Batching) لتجربة استخدام فائقة النعومة.
// 4. نظام تأكيد تسجيل الخروج الآمن (يتطلب اتصالاً بالإنترنت)
// =========================================================================

console.log("📦 جاري تهيئة وحدة الطلبات الذكية...");

// المتغيرات العامة للتبع اللحظي الذكي
window.activeTrackingTimers = {}; 
window.knownOrdersState = {};
window.statusAnimationQueue = [];
window.isAnimatingStatus = false;

// ==========================================
// الكائن الرئيسي (OrdersApp)
// ==========================================
window.OrdersApp = {
    currentTab: 'active',
    currentPage: 1,       // لتقسيم الطلبات (Pagination)
    ordersPerPage: 10,    // عدد الطلبات في كل دفعة
    isLoadingMore: false, // لمنع تكرار جلب البيانات أثناء التمرير
    
    // 1. فتح صفحة الحساب والطلبات
    openProfilePage: function() {
        document.querySelectorAll('.page-overlay.open').forEach(p => {
            if (p.id !== 'profile-page') p.classList.remove('open');
        });

        if (typeof togglePage === 'function') togglePage('profile-page', true);

        if (typeof isIsolatedStore !== 'undefined' && isIsolatedStore) {
            if(typeof updateIsolatedNavActiveState === 'function') updateIsolatedNavActiveState('orders');
        } else {
            document.querySelectorAll('#mobile-bar .nav-item').forEach(i => i.classList.remove('active'));
            const ordersBtn = document.getElementById('orders-nav-item');
            if (ordersBtn) ordersBtn.classList.add('active');
        }

        this.renderPage();
        
        console.log("🔄 تم الدخول لقسم الطلبات: جاري الفحص الفوري...");
        window.fetchOrdersSilently(false);

        // 🔔 تفعيل إشعارات الدفع (لحظة دخول العميل لقسم طلباته هي أفضل لحظة
        // لطلب الإذن، لأنه بالضبط يهتم بمتابعة حالة طلباته الآن)
        window.PushNotifications.init();
    },

    // 2. رسم الصفحة الأساسية
    renderPage: function() {
        const container = document.getElementById('profile-page-content');
        if (!container) return;

        if (typeof user === 'undefined' || !user || !user.loggedIn) { 
            container.innerHTML = `
                <div class="placeholder fade-in-item" style="text-align:center; padding-top:40px;">
                    <i class="fas fa-user-lock" style="font-size: 4rem; color: var(--border);"></i>
                    <h3 style="font-weight:900; margin:15px 0;">سجل دخولك</h3>
                    <p style="color:var(--text-muted);">لتتمكن من تتبع طلباتك وإدارة حسابك.</p>
                    <button class="btn-action primary" style="width:fit-content; margin:20px auto; padding:15px 40px; border-radius: 30px;" onclick="toggleAuthPage(true); togglePage('profile-page', false);">تسجيل الدخول / إنشاء حساب</button>
                </div>`; 
            window.stopOrderPolling();
            return; 
        }
        
        const safeName = escapeHTML(user.full_name || 'عميل مميز'); 
        const initial = safeName.charAt(0).toUpperCase();
        
        const isIsolated = (typeof isIsolatedStore !== 'undefined' && isIsolatedStore);
        const ordersTitle = isIsolated ? `طلباتي من المتجر الحالي` : `سجل جميع طلباتي`;

        container.innerHTML = `
            <div class="profile-page-user-header fade-in-item">
                <div class="user-initial-large">${initial}</div>
                <div class="user-info">
                    <h2 style="margin: 0; font-size: 1.5rem;">${safeName}</h2>
                    <p dir="ltr" style="margin: 5px 0 0 0; opacity: 0.9;">${escapeHTML(user.phone)}</p>
                </div>
            </div>
            
            <h3 style="margin-bottom:15px; font-weight:900;">${ordersTitle}</h3>
            
            <div id="user-orders-tabs">
                <button class="sub-nav-item ${this.currentTab === 'active' ? 'active' : ''}" onclick="OrdersApp.switchTab('active')">قيد التنفيذ</button>
                <button class="sub-nav-item ${this.currentTab === 'completed' ? 'active' : ''}" onclick="OrdersApp.switchTab('completed')">مكتملة</button>
                <button class="sub-nav-item ${this.currentTab === 'cancelled' ? 'active' : ''}" onclick="OrdersApp.switchTab('cancelled')">ملغية</button>
            </div>
            
            <div id="user-orders-container"></div>
            
            <div class="profile-actions-section fade-in-item" style="margin-top: 30px;">
                <button class="btn-action" style="background:var(--bg-card); border: 2px solid var(--danger); color:var(--danger); border-radius: 30px;" onclick="OrdersApp.safeLogout()">
                    <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                </button>
            </div>`;
        
        this.loadAndDrawOrders();
    },

    // 3. التبديل بين التبويبات بذكاء
    switchTab: function(status) {
        this.currentTab = status; 
        this.currentPage = 1; // تصفير التمرير
        const container = document.getElementById('user-orders-container');
        if (container) container.innerHTML = ''; 
        this.renderPage(); 
    },

    // 4. تحميل ورسم الطلبات (بواسطة Skeleton)
    loadAndDrawOrders: function() {
        const container = document.getElementById('user-orders-container');
        if(!container) return;

        // عرض Skeleton Loader إذا كانت الصفحة الأولى ولا يوجد كاش محلي
        if (this.currentPage === 1 && (!window.currentUserOrders || window.currentUserOrders.length === 0)) {
            container.innerHTML = this.generateSkeletonHTML();
        }

        // إطلاق جلب البيانات (هذه الدالة ستتكفل بالرسم من الكاش ثم من السيرفر)
        window.fetchOrdersSilently(true);
        window.startOrderPolling();
    },

    // 5. التحقق من الاتصال وتأكيد تسجيل الخروج
    safeLogout: function() {
        // التحقق من وجود اتصال بالإنترنت
        if (!navigator.onLine) {
            if (typeof showToast === 'function') {
                showToast('لا يمكن تسجيل الخروج أثناء عدم الاتصال بالإنترنت. يرجى التحقق من الشبكة والمحاولة مجدداً.', 'error');
            } else {
                alert('لا يمكن تسجيل الخروج أثناء عدم الاتصال بالإنترنت. يرجى التحقق من الشبكة والمحاولة مجدداً.');
            }
            return;
        }

        const confirmMessage = 'هل أنت متأكد من رغبتك في تسجيل الخروج؟';
        
        // استخدام مودال التأكيد المخصص إذا كان متاحاً في النظام
        if (typeof showConfirmationModal === 'function') {
            showConfirmationModal(confirmMessage, () => {
                this.executeLogout();
            }, 'تأكيد تسجيل الخروج');
        } else {
            if (confirm(confirmMessage)) {
                this.executeLogout();
            }
        }
    },

    // تنفيذ تسجيل الخروج الفعلي
    executeLogout: function() {
        if (typeof handleLogout === 'function') {
            handleLogout();
        } else {
            console.warn("handleLogout غير معرفة بشكل عام، جاري تهيئة التطهير المحلي كبديل...");
            if (typeof user !== 'undefined') user.loggedIn = false;
            localStorage.removeItem('nalsh_local_orders');
            window.stopOrderPolling();
            this.renderPage();
        }
    },

    // 6. فلترة الطلبات
    getFilteredOrders: function() {
        let displayOrders = [];
        const isIsolated = (typeof isIsolatedStore !== 'undefined' && isIsolatedStore);
        const currentMerchId = (typeof currentMerchantId !== 'undefined' ? currentMerchantId : null);

        (window.currentUserOrders || []).forEach(group => {
            if (!group || !Array.isArray(group.sub_orders)) return;

            let relevantSubOrders = group.sub_orders;

            if (isIsolated && currentMerchId) {
                relevantSubOrders = relevantSubOrders.filter(so => String(so.merchant_id) === String(currentMerchId));
            }

            relevantSubOrders = relevantSubOrders.filter(so => {
                const status = String(so.status || '').trim();
                if (this.currentTab === 'active') {
                    return ['pending_merchant_approval', 'pending_verification', 'pending_delivery_acceptance', 'confirmed', 'accepted_by_delivery', 'out_for_delivery', 'cancellation_requested_by_agent', 'confirmed_by_store'].includes(status);
                }
                if (this.currentTab === 'completed') return status === 'completed';
                if (this.currentTab === 'cancelled') return status === 'cancelled';
                return false;
            });

            if (relevantSubOrders.length > 0) {
                displayOrders.push({ ...group, sub_orders: relevantSubOrders });
            }
        });

        return displayOrders;
    },

    // 7. رسم الطلبات على دفعات
    drawOrdersChunk: function() {
        const container = document.getElementById('user-orders-container');
        if(!container) return;

        // مسح الـ Skeletons
        container.querySelectorAll('.skeleton-card').forEach(s => s.remove());

        const filteredGroups = this.getFilteredOrders();
        
        // التحقق من حالة الفراغ
        if (filteredGroups.length === 0 && this.currentPage === 1) {
            this.showEmptyState(container);
            return;
        }

        // حساب الدفعة الحالية
        const startIndex = (this.currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const currentBatch = filteredGroups.slice(startIndex, endIndex);

        if (currentBatch.length === 0) return;

        // تجميع العناصر في DOM وهمي لرفع الأداء (DocumentFragment)
        const fragment = document.createDocumentFragment();
        
        currentBatch.forEach(group => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.createOrderGroupCard(group);
            if (tempDiv.firstElementChild) {
                fragment.appendChild(tempDiv.firstElementChild);
            }
        });

        // حقن الدفعة في الصفحة دفعة واحدة
        container.appendChild(fragment);

        // إنشاء أكواد الـ QR للدفعة الجديدة فقط
        currentBatch.forEach(group => {
            group.sub_orders.forEach(order => {
                if (order && order.delivery_code && ['confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'].includes(order.status)) {
                    const qrCanvas = document.getElementById(`qr-code-${order.id}`);
                    if (qrCanvas && typeof QRious !== 'undefined') {
                        new QRious({ element: qrCanvas, value: order.delivery_code.toString(), size: 100, level: 'H', background: 'white', foreground: 'black' });
                    }
                }
            });
        });

        // تفعيل المستشعر اللانهائي
        this.setupInfiniteScroll(filteredGroups.length);
    },

    // 8. التمرير اللانهائي (Infinite Scroll)
    setupInfiniteScroll: function(totalFilteredOrders) {
        if ((this.currentPage * this.ordersPerPage) >= totalFilteredOrders) return;

        const container = document.getElementById('user-orders-container');
        const lastCard = container.lastElementChild;
        if (!lastCard) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.isLoadingMore) {
                this.isLoadingMore = true;
                this.currentPage++;
                
                const loader = document.createElement('div');
                loader.id = 'infinite-loader';
                loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحميل المزيد...';
                loader.style.cssText = 'text-align:center; padding:15px; color:var(--primary); font-weight:bold; width:100%;';
                container.appendChild(loader);

                setTimeout(() => {
                    const l = document.getElementById('infinite-loader');
                    if (l) l.remove();
                    this.drawOrdersChunk();
                    this.isLoadingMore = false;
                }, 300); // تأخير بسيط للنعومة

                observer.disconnect();
            }
        }, { rootMargin: "150px" });

        observer.observe(lastCard);
    },

    // تحديث الواجهة مع الحفاظ على التمرير (بشكل آمن لمنع التكرار)
    refreshCurrentView: function() {
        const container = document.getElementById('user-orders-container');
        if(!container) return;
        
        container.innerHTML = ''; // مسح كل شيء
        const savedPage = this.currentPage;
        
        // إعادة رسم كل الدفعات التي تم تحميلها مسبقاً بالتسلسل
        for(let i = 1; i <= savedPage; i++) {
            this.currentPage = i;
            this.drawOrdersChunk();
        }
        
        // استعادة رقم الصفحة الأصلي
        this.currentPage = savedPage;
    },

    // أدوات مساعدة للواجهة
    generateSkeletonHTML: function() {
        return `
            <div class="skeleton-card">
                <div class="skeleton-line" style="width: 40%; height: 24px;"></div>
                <div class="skeleton-line" style="width: 20%; margin-bottom: 20px;"></div>
                <div style="display:flex; gap:15px; margin-top:20px;">
                    <div class="skeleton-line" style="width: 60px; height: 60px; border-radius: 12px;"></div>
                    <div style="flex:1;">
                        <div class="skeleton-line" style="width: 80%;"></div>
                        <div class="skeleton-line" style="width: 50%;"></div>
                    </div>
                </div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton-line" style="width: 50%; height: 24px;"></div>
                <div class="skeleton-line" style="width: 30%;"></div>
            </div>
        `;
    },

    showEmptyState: function(container) {
        const statusName = this.currentTab === 'active' ? 'قيد التنفيذ' : (this.currentTab === 'completed' ? 'مكتملة' : 'ملغية');
        container.innerHTML = `
            <div class="placeholder fade-in-item" style="text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:var(--radius-xl); box-shadow:var(--shadow-soft);">
                <div style="width:80px; height:80px; background:var(--primary-soft); color:var(--primary); border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:2.5rem; margin:0 auto 20px;">
                    <i class="fas fa-box-open"></i>
                </div>
                <h3 style="margin-bottom:10px; font-weight:900;">لا توجد طلبات ${statusName}</h3>
                <p style="color:var(--text-muted); font-size:0.95rem;">تصفح المتاجر وابدأ بالتسوق الآن!</p>
                <button class="btn-action primary" style="margin-top:20px; border-radius:30px; padding:12px 30px;" onclick="togglePage('home-page')">تصفح المتاجر</button>
            </div>`;
    },

    // 9. بناء كرت الطلب (HTML)
    createOrderGroupCard: function(group) {
        if (!group || !group.sub_orders) return '';
        const groupTotalAmount = group.sub_orders.reduce((sum, so) => sum + parseFloat(so.total_amount || 0), 0);
        
        const groupIdStr = String(group.group_id || group.id || 'UNKNOWN');
        const groupIdShort = groupIdStr.replace('GRP-', '').replace('LEGACY-', '').replace('TCK-', '').substring(0, 8);
        
        let groupDate = '';
        try { groupDate = new Date(group.created_at || Date.now()).toLocaleString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch(e) { groupDate = 'تاريخ غير متاح'; }
        
        const statusesMap = { 'pending_merchant_approval': 1, 'pending_verification': 1, 'confirmed_by_store': 2, 'pending_delivery_acceptance': 2, 'confirmed': 2, 'accepted_by_delivery': 3, 'out_for_delivery': 4, 'completed': 5, 'cancelled': 0, 'cancellation_requested_by_agent': -1 };
        const timelineSteps =[ { label: 'المراجعة', icon: 'fa-file-invoice' }, { label: 'التجهيز', icon: 'fa-box-open' }, { label: 'الاستلام', icon: 'fa-people-carry-box' }, { label: 'التوصيل', icon: 'fa-motorcycle' }, { label: 'مكتمل', icon: 'fa-check-circle' } ];

        const merchantsCardsHTML = group.sub_orders.map(order => {
            if (!order) return '';
            const currentStatusLevel = statusesMap[order.status] || 0; const isCancelled = order.status === 'cancelled';
            let statusText = ''; let badgeBg = ''; let badgeColor = '';
            
            if (isCancelled) { statusText = 'ملغي'; badgeBg = 'rgba(239, 68, 68, 0.1)'; badgeColor = 'var(--danger)'; }
            else if (order.status === 'completed') { statusText = 'مكتمل'; badgeBg = 'rgba(16, 185, 129, 0.1)'; badgeColor = 'var(--success)'; }
            else if (order.status === 'out_for_delivery') { statusText = 'خرج للتوصيل'; badgeBg = 'rgba(59, 130, 246, 0.1)'; badgeColor = 'var(--primary)'; }
            else if (order.status === 'accepted_by_delivery') { statusText = 'مع المندوب'; badgeBg = 'rgba(245, 158, 11, 0.1)'; badgeColor = 'var(--warning)'; }
            else { statusText = 'قيد التجهيز'; badgeBg = 'rgba(100, 116, 139, 0.1)'; badgeColor = 'var(--text-muted)'; }

            const safeItems = Array.isArray(order.items) ? order.items :[];
            const itemsHTML = safeItems.map(item => `
                <div class="order-item-modern">
                    <div class="item-img">
                        <img src="${item.image || ''}" loading="lazy" onerror="this.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                    </div>
                    <div class="item-details">
                        <h5>${escapeHTML(item.product_name)}</h5>
                        ${item.size_info ? `<span class="item-variant">${escapeHTML(item.size_info)}</span>` : ''}
                    </div>
                    <div class="item-price-qty">
                        <div class="qty">x${item.quantity || 1}</div>
                        <div class="price">${(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toLocaleString()} <small style="font-size:0.7rem;">${order.currency || 'YER'}</small></div>
                    </div>
                </div>
            `).join('');

            let trackingUI = '';
            if (order.status === 'cancellation_requested_by_agent') {
                trackingUI = `<div style="background: rgba(244, 63, 94, 0.05); border: 1px dashed var(--danger); border-radius: 16px; padding: 15px; margin-top: 15px;"><h5 style="color: var(--danger); margin-bottom: 5px; font-weight: 900;"><i class="fas fa-exclamation-triangle"></i> طلب إلغاء من المندوب</h5><p style="font-size:0.9rem; margin-bottom: 15px;">السبب: <strong>"${escapeHTML(order.cancel_reason || 'غير محدد')}"</strong></p><div style="display: flex; gap: 10px;"><button onclick="respondToAgentCancellation('${order.id}', 'approve')" class="btn-action" style="flex: 1; padding: 10px; font-size: 0.9rem; background: var(--danger); color: white; border: none; border-radius:12px;">موافقة</button><button onclick="respondToAgentCancellation('${order.id}', 'reject')" class="btn-action" style="flex: 1; padding: 10px; font-size: 0.9rem; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); border-radius:12px;">رفض</button></div></div>`;
            } else if (!isCancelled) {
                const progressWidth = ((currentStatusLevel - 1) / 4) * 100;
                trackingUI = `<div class="order-timeline"><div class="timeline-progress" style="width: ${progressWidth > 0 ? progressWidth : 0}%;"></div>${timelineSteps.map((step, index) => { const isActive = (index + 1) <= currentStatusLevel; return `<div class="timeline-step ${isActive ? 'active' : ''}"><div class="timeline-icon"><i class="fas ${step.icon}"></i></div><div class="timeline-label">${step.label}</div></div>`; }).join('')}</div>`;
            }

            let agentInfoHTML = '';
            if (order.delivery_agent_name && order.delivery_agent_phone && currentStatusLevel >= 3 && !isCancelled) {
                agentInfoHTML = `<div style="background: var(--bg-body); border-radius: 16px; padding: 15px; margin-top: 15px; display: flex; align-items: center; justify-content: space-between;"><div><div style="font-size:0.8rem; color:var(--text-muted); font-weight:800; margin-bottom:3px;"><i class="fas fa-motorcycle"></i> كابتن التوصيل</div><div style="font-weight:900; font-size:1.05rem;">${escapeHTML(order.delivery_agent_name)}</div>${order.is_private_agent ? `<span style="font-size:0.75rem; background:rgba(245,158,11,0.1); color:var(--warning); padding:2px 6px; border-radius:4px; font-weight:bold;">مندوب خاص للمتجر</span>` : ''}</div><a href="tel:${escapeHTML(order.delivery_agent_phone)}" style="width: 45px; height: 45px; background: rgba(16,185,129,0.1); color: var(--success); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; text-decoration: none;"><i class="fas fa-phone-alt"></i></a></div>`;
            }

            let deliveryCodeHTML = '';
            if (order.delivery_code && ['confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'].includes(order.status)) {
                deliveryCodeHTML = `<div style="background:var(--primary-gradient); color:white; padding:15px; border-radius:16px; margin-top:15px; display:flex; align-items:center; justify-content:space-between;"><div><div style="font-size:0.85rem; opacity:0.9; margin-bottom:5px; font-weight:700;">كود الاستلام السري</div><strong style="font-size:1.8rem; letter-spacing:4px; font-family:monospace;">${order.delivery_code}</strong></div><canvas id="qr-code-${order.id}" style="border: 3px solid white; border-radius: 8px; width: 60px; height: 60px;"></canvas></div>`;
            }

            const productsValue = parseFloat(order.total_amount || 0) - parseFloat(order.delivery_fee || 0);

            let orderCurrency = escapeHTML(order.currency || 'YER');
            let totalDisplayHTML = '';
            
            if (orderCurrency === 'YER') {
                totalDisplayHTML = `<span>${parseFloat(order.total_amount || 0).toLocaleString()} YER</span>`;
            } else {
                totalDisplayHTML = `<div style="text-align: left; line-height: 1.4;">
                    <span>${productsValue.toLocaleString()} ${orderCurrency}</span><br>
                    <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">+ ${parseFloat(order.delivery_fee || 0).toLocaleString()} YER (توصيل)</span>
                </div>`;
            }

            return `
<div class="modern-order-card">
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:12px;">
        <div>
            <div style="font-weight:900; color:var(--text-main);"><i class="fas fa-store" style="color:var(--text-muted);"></i> ${escapeHTML(order.merchant_name || 'متجر')}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">رقم الطلب: #${order.id.substring(0,8)}</div>
        </div>
        <span class="order-status-badge ${isCancelled ? 'status-danger' : (order.status === 'completed' ? 'status-success' : 'status-pending')}">${statusText}</span>
    </div>
    
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
        ${itemsHTML}
    </div>
    
    <div style="background:var(--bg-body); border-radius:var(--radius-sm); padding:10px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:800; color:var(--text-muted); font-size:0.9rem;">الإجمالي النهائي</span>
        ${totalDisplayHTML}
    </div>
    
    ${trackingUI}${agentInfoHTML}${deliveryCodeHTML}
</div>`;
        }).join('');

        return `<div class="order-group-wrapper fade-in-item">
            <div class="order-group-header">
                <div>
                    <h3 style="font-size:1.1rem; margin-bottom:5px;">طلبية #${groupIdShort}</h3>
                    <span class="date"><i class="far fa-clock"></i> ${groupDate}</span>
                </div>
                <div class="total">${groupTotalAmount.toLocaleString()} <small style="font-size:0.9rem;">${escapeHTML(group.sub_orders[0]?.currency || 'YER')}</small></div>
            </div>
            ${merchantsCardsHTML}
        </div>`;
    }
};

// ==========================================
// 🔔 نظام إشعارات الدفع (Push Notifications - Firebase Cloud Messaging)
// يطلب إذن الإشعارات من العميل بعد تسجيل دخوله ودخوله لقسم الطلبات،
// يجهّز Firebase Messaging، يرسل توكن الجهاز للسيرفر (save_fcm_token)
// حتى يخزّنه بجدول العميل الصحيح، ثم يستقبل الإشعارات فور وصولها
// أثناء فتح الموقع (Foreground) ويعرضها كـ Toast + يحدّث الطلبات فوراً.
// ملاحظة: الإشعارات بالخلفية (الموقع مغلق) تحتاج ملف
// firebase-messaging-sw.js بجذر الموقع (Service Worker منفصل).
// ==========================================
window.PushNotifications = {
    initialized: false,
    messagingInstance: null,

    // نقطة الدخول: آمنة للاستدعاء أكثر من مرة (تتجاهل نفسها بعد أول تفعيل ناجح)
    init: async function() {
        if (this.initialized) return;
        if (typeof user === 'undefined' || !user || !user.loggedIn) return;
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.warn('🔕 المتصفح لا يدعم إشعارات الدفع.');
            return;
        }
        // لو العميل رفض الإذن مسبقاً، لا داعي لإزعاجه بإعادة المحاولة كل مرة
        if (Notification.permission === 'denied') {
            console.log('🔕 العميل رفض إذن الإشعارات مسبقاً.');
            return;
        }

        this.initialized = true;

        try {
            await this.loadFirebaseSDK();

            const cfgResult = await window.apiRequest('get_firebase_config', {}, 'POST', true);
            const fbConfig = cfgResult?.data?.config;
            if (!cfgResult || cfgResult.status !== 'success' || !fbConfig?.apiKey) {
                console.warn('🔕 إعدادات الإشعارات غير متاحة حالياً.');
                return;
            }

            if (!firebase.apps.length) firebase.initializeApp(fbConfig);
            this.messagingInstance = firebase.messaging();

            // تسجيل Service Worker المسؤول عن استقبال الإشعارات بالخلفية
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('🔕 العميل لم يمنح إذن الإشعارات.');
                return;
            }

            const token = await this.messagingInstance.getToken({
                vapidKey: fbConfig.vapidKey,
                serviceWorkerRegistration: registration,
            });
            if (token) await this.sendTokenToServer(token);

            // استقبال الإشعارات أثناء فتح الموقع نفسه (Foreground)
            this.messagingInstance.onMessage((payload) => this.handleForegroundMessage(payload));

            // لو تجدد توكن الجهاز لاحقاً (نادر لكن ممكن)، أرسله من جديد للسيرفر
            if (typeof this.messagingInstance.onTokenRefresh === 'function') {
                this.messagingInstance.onTokenRefresh(async () => {
                    try {
                        const refreshed = await this.messagingInstance.getToken({ vapidKey: fbConfig.vapidKey, serviceWorkerRegistration: registration });
                        if (refreshed) await this.sendTokenToServer(refreshed);
                    } catch (e) {
                        console.error('فشل تجديد توكن الإشعارات:', e);
                    }
                });
            }

            console.log('🔔 تم تفعيل إشعارات الدفع بنجاح.');
        } catch (err) {
            console.error('🔕 فشل تفعيل إشعارات الدفع:', err);
        }
    },

    // تحميل مكتبات Firebase (app + messaging) مرة واحدة فقط إن لم تكن محمّلة أصلاً بالصفحة
    loadFirebaseSDK: function() {
        if (typeof firebase !== 'undefined' && firebase.messaging) return Promise.resolve();

        const loadScript = (src) => new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                if (existing.dataset.loaded) { resolve(); return; }
                existing.addEventListener('load', resolve);
                existing.addEventListener('error', reject);
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.onload = () => { s.dataset.loaded = '1'; resolve(); };
            s.onerror = reject;
            document.head.appendChild(s);
        });

        return loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
            .then(() => loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js'));
    },

    // إرسال توكن الجهاز للسيرفر (action: save_fcm_token) ليُخزَّن بجدول
    // العميل الصحيح. نتفادى إرسال نفس التوكن مرتين بلا داعٍ.
    sendTokenToServer: async function(token) {
        try {
            if (localStorage.getItem('nalsh_fcm_token_sent') === token) return;

            const result = await window.apiRequest('save_fcm_token', { fcm_token: token }, 'POST', true);
            if (result && result.status === 'success') {
                localStorage.setItem('nalsh_fcm_token_sent', token);
                console.log('✅ تم تسجيل جهازك لاستقبال إشعارات الطلبات.');
            }
        } catch (err) {
            console.error('فشل إرسال توكن الإشعارات للسيرفر:', err);
        }
    },

    // إشعار يصل والموقع مفتوح أمام العميل: نعرضه كـ Toast فوري، ولو كان
    // متعلقاً بتحديث/اتمام طلب نحدّث قائمة الطلبات فوراً (بدل انتظار الـ
    // polling العادي) ونشغّل حركة الروبوت لنفس تجربة التحديث اللحظي.
    handleForegroundMessage: function(payload) {
        const title = payload?.notification?.title || 'إشعار جديد 🔔';
        const body = payload?.notification?.body || '';
        const message = body ? `${title}: ${body}` : title;

        if (typeof showToast === 'function') {
            showToast(message, 'info');
        } else {
            console.log('🔔', message);
        }

        const action = payload?.data?.action;
        if (action === 'order_status_update' || action === 'order_completed') {
            window.fetchOrdersSilently(false);
            // "order_completed" لا يحمل حقل status صراحة بالـ payload، فنستنتجه
            const animStatus = payload?.data?.status || (action === 'order_completed' ? 'completed' : null);
            if (animStatus) {
                window.statusAnimationQueue.push(animStatus);
                window.processStatusAnimationQueue();
            }
        }
    },
};

// ==========================================
// 🚀 نظام التتبع الذكي المضاد للضغط (Adaptive REST Tracking)
// ==========================================

window.fetchOrdersSilently = async function(isInitialLoad = false) {
    if (!user || !user.loggedIn) return;

    const cachedOrders = localStorage.getItem('nalsh_local_orders');
    if (cachedOrders) {
        window.currentUserOrders = JSON.parse(cachedOrders);
        if (isInitialLoad && document.getElementById('profile-page').classList.contains('open')) {
            window.OrdersApp.refreshCurrentView();
        }
    }

    if (!navigator.onLine) return;

    try {
        const result = await window.apiRequest('get_user_orders', {}, 'POST', true); 
        
        if (result.status === 'success') { 
            const currentString = JSON.stringify(window.currentUserOrders);
            const newString = JSON.stringify(result.data);

            if (currentString !== newString) {
                window.currentUserOrders = result.data; 
                localStorage.setItem('nalsh_local_orders', newString); 

                if (document.getElementById('profile-page').classList.contains('open')) {
                    window.OrdersApp.refreshCurrentView();
                }
                window.updateKnownOrdersState(result.data, isInitialLoad);
            }
        }
    } catch (e) {
        console.error("Fetch orders error:", e);
    }
};    

window.startOrderPolling = function() { 
    console.log("⚡ بدء نظام التتبع التكيفي (Adaptive Tracking)");
    window.syncFirebaseOrderTracking();
};

window.stopOrderPolling = function() {
    Object.keys(window.activeTrackingTimers).forEach(orderId => {
        clearInterval(window.activeTrackingTimers[orderId]);
        delete window.activeTrackingTimers[orderId];
    });
};

window.pollOrders = async function() {};

window.syncFirebaseOrderTracking = function() {
    if (!user || !user.loggedIn || !window.currentUserOrders || window.currentUserOrders.length === 0) return;
    
    const FIREBASE_URL = 'https://shiban-a2757-default-rtdb.europe-west1.firebasedatabase.app';
    const activeStatuses = ['pending_merchant_approval', 'pending_verification', 'pending_delivery_acceptance', 'confirmed', 'accepted_by_delivery', 'out_for_delivery', 'confirmed_by_store'];

    window.currentUserOrders.forEach(group => {
        group.sub_orders.forEach(order => {
            if (activeStatuses.includes(order.status)) {
                const orderId = order.id;
                let mUser = order.merchant_username;
                
                if (!mUser && typeof allMerchants !== 'undefined') {
                    const mObj = allMerchants.find(m => m.id == order.merchant_id);
                    mUser = mObj ? mObj.username : null;
                }

                if (mUser && !window.activeTrackingTimers[orderId]) {
                    const trackingUrl = `${FIREBASE_URL}/stores/${mUser}/tracking/${orderId}.json?nocache=${Date.now()}`;
                    
                    const checkStatus = async () => {
                        if (document.hidden || !navigator.onLine) return;

                        try {
                            const res = await fetch(trackingUrl, { method: 'GET', headers: { 'Cache-Control': 'no-cache' } });
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.status && data.status !== order.status) {
                                    console.log(`✅ تحديث لحظي لطلب ${orderId}: ${data.status}`);
                                    order.status = data.status;
                                    localStorage.setItem('nalsh_local_orders', JSON.stringify(window.currentUserOrders));
                                    
                                    if (document.getElementById('profile-page').classList.contains('open')) {
                                        window.OrdersApp.refreshCurrentView();
                                    }
                                    
                                    window.statusAnimationQueue.push(order.status);
                                    window.processStatusAnimationQueue();
                                    adjustPollingSpeed();
                                }
                            }
                        } catch (err) {}
                    };

                    const adjustPollingSpeed = () => {
                        if (window.activeTrackingTimers[orderId]) clearInterval(window.activeTrackingTimers[orderId]);
                        
                        let intervalSpeed = 30000; 
                        if (order.status === 'out_for_delivery' || order.status === 'accepted_by_delivery') intervalSpeed = 10000; 
                        else if (order.status === 'pending_merchant_approval' || order.status === 'confirmed_by_store') intervalSpeed = 60000;

                        window.activeTrackingTimers[orderId] = setInterval(checkStatus, intervalSpeed);
                    };

                    checkStatus();
                    adjustPollingSpeed();
                }
            } else {
                if (window.activeTrackingTimers[order.id]) {
                    clearInterval(window.activeTrackingTimers[order.id]);
                    delete window.activeTrackingTimers[order.id];
                }
            }
        });
    });
};

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.OrdersApp) {
        const profilePage = document.getElementById('profile-page');
        if (profilePage && profilePage.classList.contains('open')) {
            console.log("👀 العميل عاد للشاشة! جاري فحص الطلبات فوراً...");
            window.fetchOrdersSilently(false);
            
            Object.keys(window.activeTrackingTimers).forEach(orderId => {
                clearInterval(window.activeTrackingTimers[orderId]);
                delete window.activeTrackingTimers[orderId];
            });
            window.syncFirebaseOrderTracking();
        }
    }
});

// ==========================================
// التحديثات والحركات المرئية (Robots & Modals)
// ==========================================

window.updateKnownOrdersState = function(newGroups, isInitialLoad) {
    let changed = false;
    newGroups.forEach(group => {
        const order = group.sub_orders[0]; 
        const oldStatus = window.knownOrdersState[order.id];
        if (oldStatus && oldStatus !== order.status) { 
            changed = true; 
            if (!isInitialLoad) { 
                window.statusAnimationQueue.push(order.status); 
                window.processStatusAnimationQueue(); 
            } 
        }
        window.knownOrdersState[order.id] = order.status;
    });
    
    window.syncFirebaseOrderTracking();
    return changed;
};

window.processStatusAnimationQueue = function() {
    if (window.isAnimatingStatus || window.statusAnimationQueue.length === 0) return;
    window.isAnimatingStatus = true; 
    const newStatus = window.statusAnimationQueue.shift(); 
    window.triggerStatusAnimation(newStatus);
};

window.triggerStatusAnimation = function(newStatus) {
    const robot = document.querySelector('.cyber-robot');
    if(!robot) { window.isAnimatingStatus = false; window.processStatusAnimationQueue(); return; }
    robot.classList.remove('status-processing', 'status-delivery', 'status-completed', 'eyes-closed', 'eyes-happy', 'look-up', 'discount-magic', 'spin-happy');

    let msg = ''; let duration = 6000;
    if (newStatus === 'confirmed' || newStatus === 'pending_delivery_acceptance' || newStatus === 'accepted_by_delivery' || newStatus === 'confirmed_by_store') { 
        robot.classList.add('status-processing'); msg = 'تم تأكيد الطلب! جاري التجهيز والبحث عن مندوب 📦⚙️'; 
    } 
    else if (newStatus === 'out_for_delivery') { 
        robot.classList.add('status-delivery'); msg = 'الطلب في الطريق إليك! استعد للاستلام 🚀🚚'; 
    } 
    else if (newStatus === 'completed') { 
        robot.classList.add('status-completed'); msg = 'تم التسليم بنجاح! شكراً لثقتك بنا ✅🎉'; 
    } 
    else { 
        window.isAnimatingStatus = false; window.processStatusAnimationQueue(); return; 
    }

    robot.style.visibility = 'visible'; 
    if(typeof robotSpeak === 'function') robotSpeak(msg, 'normal', duration);
    
    setTimeout(() => { 
        robot.classList.remove('status-processing', 'status-delivery', 'status-completed'); 
        window.isAnimatingStatus = false; 
        window.processStatusAnimationQueue(); 
    }, duration + 500);
};

window.respondToAgentCancellation = async function(orderId, action) {
    const message = action === 'approve' ? 'هل أنت متأكد من الموافقة على إلغاء الطلب؟' : 'هل تريد رفض الإلغاء وإلزام المندوب بتوصيل الطلب؟';
    if(typeof showConfirmationModal === 'function') {
        showConfirmationModal(message, async () => {
            const result = await window.apiRequest('respond_to_cancellation', { order_id: orderId, response_action: action });
            if (result.status === 'success') { 
                if(typeof showToast === 'function') showToast(result.message, 'success'); 
                window.fetchOrdersSilently(true); 
            } 
            else {
                if(typeof showToast === 'function') showToast(result.message, 'error');
            }
        }, 'تأكيد الإجراء');
    }
};