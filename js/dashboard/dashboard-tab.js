/**
 * dashboard-tab.js — تبويب الرئيسية (تصاميم بصرية فائقة السرعة بدون مكتبات خارجية)
 * يُحمَّل عند الحاجة (Lazy Loaded)
 */
(function () {
    'use strict';

    let lastWeeklyData = null;
    let lastTopData = null;

    const DASH_ORDER_STATUS_MAP = {
        pending_merchant_approval: { t: 'بانتظار موافقتك', s: 'background:rgba(245,158,11,.12);color:var(--warning);' },
        confirmed_by_store: { t: 'قيد التجهيز', s: 'background:rgba(16,185,129,.12);color:var(--success);' },
        out_for_delivery: { t: 'في الطريق', s: 'background:rgba(59,130,246,.12);color:var(--info);' },
        completed: { t: 'مكتمل', s: 'background:rgba(16,185,129,.12);color:var(--success);' },
        cancelled: { t: 'ملغي', s: 'background:rgba(239,68,68,.12);color:var(--danger);' }
    };

    // ===== حقن واجهة تبويب الرئيسية ديناميكياً (تصميم نظيف، أنيق، وفائق السرعة) =====
    window.ensureDashboardHTML = function () {
        const dashboardSec = document.getElementById('dashboard');
        if (!dashboardSec) return;

        if (!document.getElementById('currency-stats-grid')) {
            const html = `
            <!-- شريط كروت العملات الثلاث المميزة والأنيقة -->
            <div id="currency-stats-grid" class="currency-stats-grid" style="margin-bottom: 20px;">
                <div class="sk-card"><div class="sk-shimmer sk-bar" style="width:45%;margin-bottom:12px;"></div><div class="sk-shimmer sk-bar-lg" style="width:110px;"></div></div>
                <div class="sk-card"><div class="sk-shimmer sk-bar" style="width:45%;margin-bottom:12px;"></div><div class="sk-shimmer sk-bar-lg" style="width:110px;"></div></div>
                <div class="sk-card"><div class="sk-shimmer sk-bar" style="width:45%;margin-bottom:12px;"></div><div class="sk-shimmer sk-bar-lg" style="width:110px;"></div></div>
            </div>

            <!-- أزرار الإجراءات السريعة المباشرة -->
            <div class="dash-actions-row" style="margin-bottom: 20px;">
                <div class="dash-action-btn" onclick="switchT('management'); setTimeout(showProductForm, 250);">
                    <div class="dash-action-icon" style="background: rgba(37, 99, 235, 0.1); color: var(--primary);">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="dash-action-info">
                        <span class="dash-action-title">إضافة منتج جديد</span>
                        <span class="dash-action-subtitle">عرض سلعة في المتجر</span>
                    </div>
                </div>

                <div class="dash-action-btn" onclick="switchT('orders');">
                    <div class="dash-action-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">
                        <i class="fas fa-shopping-basket"></i>
                    </div>
                    <div class="dash-action-info">
                        <span class="dash-action-title">متابعة الطلبات</span>
                        <span class="dash-action-subtitle">الواردة والجارية</span>
                    </div>
                </div>

                <div class="dash-action-btn" onclick="switchT('templates');">
                    <div class="dash-action-icon" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.12)); color: #4f46e5;">
                        <i class="fas fa-palette"></i>
                    </div>
                    <div class="dash-action-info">
                        <span class="dash-action-title">قوالب المتجر</span>
                        <span class="dash-action-subtitle">معاينة ونشر التصميم</span>
                    </div>
                </div>

                <div class="dash-action-btn" onclick="if(typeof openDeliveryCodeModal === 'function') openDeliveryCodeModal();">
                    <div class="dash-action-icon" style="background: rgba(245, 158, 11, 0.12); color: var(--warning);">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="dash-action-info">
                        <span class="dash-action-title">تسليم فوري</span>
                        <span class="dash-action-subtitle">تأكيد كود الاستلام</span>
                    </div>
                </div>
            </div>

            <!-- لوحة الرؤى والتحليلات البصرية فائقة السرعة -->
            <div class="dash-insights-grid">
                <!-- بطاقة النشاط الأسبوعي -->
                <div class="dash-visual-card">
                    <div class="dash-card-header">
                        <div class="dash-card-title">
                            <div class="dash-title-icon primary"><i class="fas fa-chart-simple"></i></div>
                            <span>نشاط المبيعات الأسبوعي</span>
                        </div>
                        <span class="dash-card-badge">تحديث فوري</span>
                    </div>

                    <div class="weekly-rhythm-wrap">
                        <div id="weekly-bars-mount" class="weekly-bars-container">
                            <div style="display:flex;gap:12px;height:120px;align-items:flex-end;padding:10px;"><div class="sk-shimmer" style="flex:1;height:40%;"></div><div class="sk-shimmer" style="flex:1;height:70%;"></div><div class="sk-shimmer" style="flex:1;height:55%;"></div><div class="sk-shimmer" style="flex:1;height:90%;"></div><div class="sk-shimmer" style="flex:1;height:65%;"></div><div class="sk-shimmer" style="flex:1;height:80%;"></div><div class="sk-shimmer" style="flex:1;height:50%;"></div></div>
                        </div>
                        <div id="weekly-summary-footer" class="weekly-summary-footer">
                            <span>إجمالي نشاط الأسبوع: <strong>0 عملية</strong></span>
                            <span style="display:flex; align-items:center; gap:6px;"><i class="fas fa-bolt" style="color:var(--warning);"></i> تحديث مباشر</span>
                        </div>
                    </div>
                </div>

                <!-- بطاقة الأكثر طلباً ومبيعاً -->
                <div class="dash-visual-card">
                    <div class="dash-card-header">
                        <div class="dash-card-title">
                            <div class="dash-title-icon warning"><i class="fas fa-crown"></i></div>
                            <span>الأكثر طلباً ومبيعاً</span>
                        </div>
                        <span class="dash-card-badge" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">أعلى أداء</span>
                    </div>

                    <div id="top-sellers-mount">
                        <div style="display:flex;flex-direction:column;gap:10px;padding:10px;"><div class="sk-shimmer sk-bar-lg"></div><div class="sk-shimmer sk-bar-lg"></div></div>
                    </div>
                </div>
            </div>`;
            dashboardSec.innerHTML = html;
        }
    };

    // توحيد رمز العملة
    function normalizeCurrencyCode(c) {
        if (!c) return 'YER';
        const s = String(c).toUpperCase().trim();
        if (s.includes('SAR') || s.includes('سعودي') || s.includes('ر.س')) return 'SAR';
        if (s.includes('USD') || s.includes('دولار') || s.includes('$')) return 'USD';
        return 'YER';
    }

    // ===== حساب الإحصائيات حسب العملة =====
    window.computeStatsByCurrency = function (salesLog) {
        const byCurrency = {
            'YER': { revenue: 0, profit: 0, orders: 0 },
            'SAR': { revenue: 0, profit: 0, orders: 0 },
            'USD': { revenue: 0, profit: 0, orders: 0 }
        };
        const productCounts = {};
        (salesLog || []).forEach(sale => {
            const cur = normalizeCurrencyCode(sale.currency || 'YER');
            if (!byCurrency[cur]) byCurrency[cur] = { revenue: 0, profit: 0, orders: 0 };
            const rev = parseFloat(sale.total_price) || 0;
            const cost = parseFloat(sale.cost_price || 0) * (parseInt(sale.quantity) || 1);
            byCurrency[cur].revenue += rev;
            byCurrency[cur].profit += (cost > 0 && rev >= cost) ? (rev - cost) : (rev * 0.2);
            byCurrency[cur].orders += 1;
            const pName = sale.productName || sale.product_name || 'منتج';
            productCounts[pName] = (productCounts[pName] || 0) + (parseInt(sale.quantity) || 1);
        });

        let topProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]).slice(0, 4);
        let topCounts = topProducts.map(p => productCounts[p]);
        if (topProducts.length === 0) { topProducts = ['-']; topCounts = [1]; }

        return { byCurrency, topProducts, topCounts };
    };

    // ===== حساب الإحصائيات من أرشيف الطلبات المكتملة =====
    window.computeStatsFromArchivedOrders = function (orders) {
        const byCurrency = {
            'YER': { revenue: 0, profit: 0, orders: 0 },
            'SAR': { revenue: 0, profit: 0, orders: 0 },
            'USD': { revenue: 0, profit: 0, orders: 0 }
        };
        const productCounts = {};
        (orders || []).filter(o => o.status === 'completed').forEach(o => {
            const cur = normalizeCurrencyCode(o.currency || 'YER');
            if (!byCurrency[cur]) byCurrency[cur] = { revenue: 0, profit: 0, orders: 0 };
            const rev = parseFloat(o.total_amount) || 0;
            let totalOrderCost = 0;
            (o.items || []).forEach(i => {
                const name = i.product_name || i.productName;
                const qty = parseInt(i.quantity) || 1;
                const cost = parseFloat(i.cost_price) || 0;
                totalOrderCost += (cost * qty);
                if (name) productCounts[name] = (productCounts[name] || 0) + qty;
            });
            byCurrency[cur].revenue += rev;
            byCurrency[cur].profit += (totalOrderCost > 0 && rev >= totalOrderCost) ? (rev - totalOrderCost) : (rev * 0.2);
            byCurrency[cur].orders += 1;
        });

        let topProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]).slice(0, 4);
        let topCounts = topProducts.map(p => productCounts[p]);
        if (topProducts.length === 0) { topProducts = ['-']; topCounts = [1]; }

        return { byCurrency, topProducts, topCounts };
    };

    // ===== حساب توزيع أيام الأسبوع (Pure CSS Visual Analytics) =====
    window.computeWeeklyActivity = function (salesLogOrOrders) {
        const days = [
            { key: 6, name: 'السبت', short: 'سبت', count: 0, revenue: 0 },
            { key: 0, name: 'الأحد', short: 'أحد', count: 0, revenue: 0 },
            { key: 1, name: 'الإثنين', short: 'إثنين', count: 0, revenue: 0 },
            { key: 2, name: 'الثلاثاء', short: 'ثلاثاء', count: 0, revenue: 0 },
            { key: 3, name: 'الأربعاء', short: 'أربعاء', count: 0, revenue: 0 },
            { key: 4, name: 'الخميس', short: 'خميس', count: 0, revenue: 0 },
            { key: 5, name: 'الجمعة', short: 'جمعة', count: 0, revenue: 0 }
        ];

        const todayDayIndex = new Date().getDay();

        (salesLogOrOrders || []).forEach(item => {
            const rawDate = item.created_at || item.order_date || item.date || item.timestamp;
            if (rawDate) {
                const dateObj = new Date(rawDate);
                if (!isNaN(dateObj.getTime())) {
                    const dayOfWeek = dateObj.getDay();
                    const dayItem = days.find(d => d.key === dayOfWeek);
                    if (dayItem) {
                        dayItem.count += (parseInt(item.quantity) || 1);
                        dayItem.revenue += (parseFloat(item.total_price || item.total_amount) || 0);
                    }
                }
            }
        });

        const totalOrders = days.reduce((sum, d) => sum + d.count, 0);
        const maxCount = Math.max(...days.map(d => d.count), 1);

        return { days, maxCount, totalOrders, todayDayIndex };
    };

    // ===== رندر كروت العملات الثلاث الفاخرة (YER / SAR / USD) =====
    window.renderCurrencyStats = function (byCurrency) {
        window.ensureDashboardHTML();
        const grid = document.getElementById('currency-stats-grid');
        if (!grid) return;

        const data = byCurrency || {};
        const currenciesConfig = [
            {
                key: 'YER',
                name: 'الريال اليمني',
                symbol: 'ر.ي',
                icon: '🇾🇪',
                cssClass: 'cur-yer',
                badge: 'العملة الأساسية'
            },
            {
                key: 'SAR',
                name: 'الريال السعودي',
                symbol: 'ر.س',
                icon: '🇸🇦',
                cssClass: 'cur-sar',
                badge: 'سوق الخليج'
            },
            {
                key: 'USD',
                name: 'الدولار الأمريكي',
                symbol: '$',
                icon: '🇺🇸',
                cssClass: 'cur-usd',
                badge: 'عالمي'
            }
        ];

        grid.innerHTML = currenciesConfig.map(cfg => {
            const curData = data[cfg.key] || { revenue: 0, profit: 0, orders: 0 };
            const rev = curData.revenue || 0;
            const profit = curData.profit || (rev * 0.2);
            const ordersCount = curData.orders || 0;
            const avgOrder = ordersCount > 0 ? Math.round(rev / ordersCount) : 0;

            return `
            <div class="cur-stat-card-luxury ${cfg.cssClass}">
                <div class="cur-luxury-header">
                    <div class="cur-luxury-title-wrap">
                        <div class="cur-luxury-icon">${cfg.icon}</div>
                        <div>
                            <div class="cur-luxury-name">${cfg.name}</div>
                            <div class="cur-luxury-code">${cfg.key} (${cfg.symbol})</div>
                        </div>
                    </div>
                    <span class="cur-luxury-badge">${cfg.badge}</span>
                </div>
                <div class="cur-luxury-revenue">
                    <div class="rev-label">إجمالي المبيعات المحققة</div>
                    <div class="rev-amount">
                        ${rev.toLocaleString()}
                        <small>${cfg.symbol}</small>
                    </div>
                </div>
                <div class="cur-luxury-metrics">
                    <div class="cur-metric-box">
                        <span class="cur-metric-label">الأرباح الصافية</span>
                        <span class="cur-metric-val profit-val">${profit.toLocaleString()}</span>
                    </div>
                    <div class="cur-metric-box">
                        <span class="cur-metric-label">الطلبات</span>
                        <span class="cur-metric-val">${ordersCount} طلب</span>
                    </div>
                    <div class="cur-metric-box">
                        <span class="cur-metric-label">متوسط السلة</span>
                        <span class="cur-metric-val">${avgOrder.toLocaleString()}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    };

    // ===== رندر أعمدة النشاط الأسبوعي (Pure CSS / Super Fast) =====
    window.renderWeeklyActivityBar = function (weeklyData) {
        window.ensureDashboardHTML();
        const container = document.getElementById('weekly-bars-mount');
        const summaryFooter = document.getElementById('weekly-summary-footer');
        if (!container) return;

        if (!weeklyData) {
            weeklyData = lastWeeklyData || window.computeWeeklyActivity([]);
        }
        lastWeeklyData = weeklyData;

        const { days, maxCount, totalOrders, todayDayIndex } = weeklyData;

        container.innerHTML = days.map(d => {
            const isToday = d.key === todayDayIndex;
            const pct = maxCount > 0 && d.count > 0 ? Math.max(Math.round((d.count / maxCount) * 100), 12) : 6;
            const todayPill = isToday ? `<span class="weekly-today-pill">اليوم</span>` : '';
            const fillClass = isToday ? 'weekly-day-fill active-today' : 'weekly-day-fill';
            const tooltipText = d.count > 0 ? `${d.count} طلب • ${d.revenue.toLocaleString()} ر.ي` : 'لا توجد مبيعات';

            return `
            <div class="weekly-day-col ${isToday ? 'is-today' : ''}" title="${d.name}: ${d.count} عملية">
                <div class="weekly-val-tooltip">${tooltipText}</div>
                <div class="weekly-day-track">
                    <div class="${fillClass}" style="height: ${pct}%;"></div>
                </div>
                ${todayPill}
                <span class="weekly-day-label">${d.name}</span>
            </div>`;
        }).join('');

        if (summaryFooter) {
            summaryFooter.innerHTML = `
                <span>إجمالي نشاط الأسبوع: <strong>${totalOrders} عملية</strong></span>
                <span style="display:flex; align-items:center; gap:6px;"><i class="fas fa-bolt" style="color:var(--warning);"></i> تحديث مباشر</span>
            `;
        }
    };

    // ===== رندر قائمة المنتجات الأكثر مبيعاً الأنيقة =====
    window.renderTopSellersList = function (topData) {
        window.ensureDashboardHTML();
        const container = document.getElementById('top-sellers-mount');
        if (!container) return;

        lastTopData = topData;
        const labels = topData?.labels || [];
        const counts = topData?.data || [];
        const totalCount = counts.reduce((a, b) => a + b, 0);

        const validItems = labels.map((label, idx) => ({
            name: label,
            count: counts[idx] || 0
        })).filter(i => i.name && i.name !== '-' && i.count > 0);

        if (validItems.length === 0) {
            container.innerHTML = `
            <div class="hscroll-empty" style="padding: 22px 14px;">
                <div class="hscroll-empty-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
                    <i class="fas fa-crown"></i>
                </div>
                <strong style="font-size:0.92rem;">لا توجد مبيعات مسجلة بعد</strong>
                <span style="font-size:0.78rem;">بمجرد استلام أولى طلباتك ستظهر المنتجات الأكثر أداءً هنا تلقائياً</span>
            </div>`;
            return;
        }

        const maxItemCount = Math.max(...validItems.map(i => i.count), 1);
        const rankBadges = ['rank-1', 'rank-2', 'rank-3'];
        const rankLabels = ['1', '2', '3', '4'];

        container.innerHTML = `
        <div class="top-sellers-list">
            ${validItems.map((item, idx) => {
                const rankClass = rankBadges[idx] || 'rank-default';
                const pct = Math.max(Math.round((item.count / maxItemCount) * 100), 10);
                const sharePct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                return `
                <div class="top-seller-item">
                    <div class="seller-item-header">
                        <div class="seller-item-info">
                            <div class="seller-rank-badge ${rankClass}">#${rankLabels[idx] || (idx + 1)}</div>
                            <span class="seller-item-name" title="${window.escapeHTML(item.name)}">${window.escapeHTML(item.name)}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="seller-item-count">${item.count} قطعة</span>
                            <span class="dash-card-badge" style="font-size:0.68rem; padding:2px 7px;">${sharePct}%</span>
                        </div>
                    </div>
                    <div class="seller-progress-track">
                        <div class="seller-progress-fill" style="width: ${pct}%;"></div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    };

    // متوافق مع أي استدعاءات قديمة
    window.rendC = function (d) {
        window.renderTopSellersList(d);
    };

    // ===== جلب الإحصائيات وتحديث الواجهة =====
    window.loadLocalDashboardStats = async function () {
        window.ensureDashboardHTML();
        window.dashboardReadState = window.dashboardReadState || {};
        window.dashboardReadPromises = window.dashboardReadPromises || {};

        const cachedStats = localStorage.getItem('merchant_dashboard_stats_v2');
        if (cachedStats) {
            try {
                const data = JSON.parse(cachedStats);
                window.renderCurrencyStats(data.byCurrency);
                window.renderTopSellersList({ labels: data.topProducts, data: data.topCounts });
                if (data.weekly) window.renderWeeklyActivityBar(data.weekly);
            } catch (e) { }
        }

        if (window.dashboardSocketReady || window.dashboardReadState.stats) return;
        if (window.dashboardReadPromises.stats) return window.dashboardReadPromises.stats;

        window.dashboardReadPromises.stats = (async () => {
        let statsResult = null;
        let weeklyResult = null;

        try {
            const res = await window.apiReq('get_stats', {}, 'POST', false, true);
            if (res.status === 'success' && res.data && Array.isArray(res.data.salesLog) && res.data.salesLog.length > 0) {
                statsResult = window.computeStatsByCurrency(res.data.salesLog);
                weeklyResult = window.computeWeeklyActivity(res.data.salesLog);
            }
        } catch (e) { }

        if (!statsResult && !window.dashboardSnapshotLoaded && !window.dashboardReadState.archivedOrders) {
            try {
                const ordersRes = await window.apiReq('get_orders', { filter: 'archived' }, 'POST', false, true);
                if (ordersRes.status === 'success' && Array.isArray(ordersRes.data)) {
                    const fallback = window.computeStatsFromArchivedOrders(ordersRes.data);
                    if (Object.keys(fallback.byCurrency).length > 0) {
                        statsResult = fallback;
                        weeklyResult = window.computeWeeklyActivity(ordersRes.data);
                    }
                }
            } catch (e) { }
        }

        // استخدم الأرشيف الموجود في اللقطة/الكاش قبل اللجوء لأي طلب شبكة.
        if (!statsResult) {
            const cachedArchived = window.AppStore.getOrders('archived') || [];
            if (cachedArchived.length > 0) {
                const fallback = window.computeStatsFromArchivedOrders(cachedArchived);
                statsResult = fallback;
                weeklyResult = window.computeWeeklyActivity(cachedArchived);
            }
        }

        if (statsResult) {
            statsResult.weekly = weeklyResult;
            localStorage.setItem('merchant_dashboard_stats_v2', JSON.stringify(statsResult));
            localStorage.removeItem('merchant_dashboard_stats');
            window.renderCurrencyStats(statsResult.byCurrency);
            window.renderTopSellersList({ labels: statsResult.topProducts, data: statsResult.topCounts });
            window.renderWeeklyActivityBar(weeklyResult);
        } else if (!cachedStats) {
            window.renderCurrencyStats({});
            window.renderTopSellersList({ labels: [], data: [] });
            window.renderWeeklyActivityBar(window.computeWeeklyActivity([]));
        }
        window.dashboardReadState.stats = true;
        delete window.dashboardReadPromises.stats;
        })();
        return window.dashboardReadPromises.stats;
    };


    // ربط مستمعي AppStore لتحديث الإحصائيات فائق السرعة
    window.AppStore.subscribe('orders_updated', ({ type, orders }) => {
        if (type === 'archived' || type === 'active') {
            const allArchived = window.AppStore.getOrders('archived') || [];
            const { byCurrency } = window.computeStatsFromArchivedOrders(allArchived);
            window.renderCurrencyStats(byCurrency);
            const weekly = window.computeWeeklyActivity(allArchived);
            window.renderWeeklyActivityBar(weekly);
        }
    });

    // تهيئة فورية عند التحميل
    window.ensureDashboardHTML();

    if (window.ModuleLoader) window.ModuleLoader.loaded.add('dashboard-tab');

})();
