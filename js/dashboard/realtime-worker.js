/**
 * realtime-worker.js — SharedWorker للاتصال اللحظي المستمر للوحة التاجر
 * 
 * المزايا الفائقة:
 *  1. يعمل في خلفية المتصفح ولا ينقطع الاتصال عند عمل Refresh (إعادة تحميل) للصفحة.
 *  2. مشاركة اتصال WebSocket واحد بين جميع التبويبات المفتوحة لنفس التاجر.
 *  3. الاحتفاظ بآخر لقطة بيانات (Snapshot) في الذاكرة لتسليمها فوراً (0ms) لأي صفحة يُعاد تحميلها.
 *  4. إدارة إعادة الاتصال التلقائي بذكاء والحفاظ على صحة القناة مع Cloudflare Worker.
 *  5. منع init مكرر لنفس التاجر — حماية من إرسال snapshot زائد.
 *  6. إبلاغ الـ frontend بعمر بيانات الـ snapshot (snapshotAge) للتحقق من الحداثة.
 */

/* eslint-disable no-restricted-globals */
const ports = new Set();
let ws = null;
let connectionConfig = null;
let currentStatus = 'idle';
let lastStatusDetail = '';
let lastSnapshot = null;
let lastSnapshotTimestamp = 0;
let reconnectTimer = null;
let reconnectAttempt = 0;
let pingInterval = null;
let isExplicitlyClosed = false;
// منع إرسال init مكرر: آخر وقت تمت معالجة init لنفس التاجر
let lastInitTimestamp = 0;
const INIT_DEBOUNCE_MS = 3000; // 3 ثواني

function broadcast(msg) {
    const data = typeof msg === 'string' ? msg : JSON.stringify(msg);
    for (const port of Array.from(ports)) {
        try {
            port.postMessage(data);
        } catch (e) {
            ports.delete(port);
        }
    }
}

function updateStatus(status, detail = '') {
    currentStatus = status;
    lastStatusDetail = detail;
    broadcast({ type: 'status', status, detail });
}

function startPing() {
    stopPing();
    pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({ type: 'ping' }));
            } catch (_) {}
        }
    }, 25000);
}

function stopPing() {
    if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
    }
}

function scheduleReconnect() {
    if (reconnectTimer || isExplicitlyClosed || ports.size === 0) return;
    reconnectAttempt++;
    // Exponential backoff: 1s → 1.8s → 3.2s → 5.8s → 10.5s → 19s → 30s (max)
    const delay = Math.min(30000, 1000 * Math.pow(1.8, Math.min(reconnectAttempt - 1, 6)));
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket();
    }, delay);
}

function connectWebSocket() {
    if (!connectionConfig || !connectionConfig.socketUrl) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    isExplicitlyClosed = false;
    updateStatus('connecting', 'جاري إنشاء اتصال آمن بالخادم...');

    try {
        ws = new WebSocket(connectionConfig.socketUrl);
    } catch (err) {
        updateStatus('disconnected', 'تعذر تهيئة اتصال WebSocket');
        scheduleReconnect();
        return;
    }

    ws.addEventListener('open', () => {
        reconnectAttempt = 0;
        startPing();
        // إرسال نبضة فورية
        try { ws.send(JSON.stringify({ type: 'ping' })); } catch (_) {}
        
        // إذا كان لدينا لقطة بيانات مسبقة، نظل على اتصال ونسلمها فوراً
        if (lastSnapshot) {
            updateStatus('connected', 'متصل لحظياً');
        } else {
            updateStatus('connecting', 'تم فتح القناة، بانتظار البيانات...');
        }
    });

    ws.addEventListener('message', (event) => {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            return;
        }

        if (msg.type === 'pong') return;

        if (msg.event === 'initial_load') {
            lastSnapshot = msg;
            lastSnapshotTimestamp = Date.now();
            updateStatus('connected', 'متصل لحظياً');
            broadcast({ type: 'snapshot', data: msg, snapshotAge: 0 });
        } else if (msg.event === 'session_resume') {
            // الـ DO يقول: البيانات حديثة، استخدم الكاش المحلي
            updateStatus('connected', 'متصل لحظياً (استئناف جلسة)');
            // أرسل للـ frontend ليستخدم الـ sessionStorage مباشرة
            broadcast({ type: 'session_resume', data: msg });
        } else if (msg.event === 'error') {
            updateStatus('disconnected', msg.message || 'خطأ في الاتصال اللحظي');
            broadcast({ type: 'error', message: msg.message });
        } else {
            // تحديث اللقطة السريعة المحلية لتكون أحدث ما يكون دائماً
            if (lastSnapshot) {
                if (msg.event === 'product_updated' && msg.product) {
                    const list = Array.isArray(lastSnapshot.products) ? lastSnapshot.products : [];
                    const idx = list.findIndex(p => String(p.id) === String(msg.product.id));
                    if (idx !== -1) list[idx] = msg.product;
                    else list.unshift(msg.product);
                    lastSnapshot.products = list;
                } else if (msg.event === 'product_removed' && msg.product_id) {
                    if (Array.isArray(lastSnapshot.products)) {
                        lastSnapshot.products = lastSnapshot.products.filter(p => String(p.id) !== String(msg.product_id));
                    }
                } else if (msg.event === 'order_updated' && msg.order) {
                    const list = Array.isArray(lastSnapshot.orders) ? lastSnapshot.orders : [];
                    const idx = list.findIndex(o => String(o.id) === String(msg.order.id));
                    if (idx !== -1) list[idx] = { ...list[idx], ...msg.order };
                    else list.unshift(msg.order);
                    lastSnapshot.orders = list;
                } else if (msg.event === 'settings_updated' && msg.settings) {
                    lastSnapshot.settings = msg.settings;
                }
                lastSnapshotTimestamp = Date.now();
            }
            // تمرير الحدث لجميع التبويبات فوراً
            broadcast({ type: 'event', event: msg.event, data: msg });
        }
    });

    ws.addEventListener('error', () => {
        updateStatus('disconnected', 'حدث خطأ في الاتصال اللحظي');
    });

    ws.addEventListener('close', (event) => {
        stopPing();
        const reason = event.reason || (event.code === 1000 ? 'تم إغلاق الاتصال' : `رمز ${event.code}`);
        updateStatus('disconnected', reason);
        ws = null;
        scheduleReconnect();
    });
}

self.onconnect = function (e) {
    const port = e.ports[0];
    ports.add(port);

    port.onmessage = function (event) {
        let msg = event.data;
        if (typeof msg === 'string') {
            try { msg = JSON.parse(msg); } catch (_) { return; }
        }
        if (!msg || typeof msg !== 'object') return;

        switch (msg.action) {
            case 'init': {
                const now = Date.now();
                const configChanged = !connectionConfig || 
                    connectionConfig.merchantId !== msg.merchantId || 
                    connectionConfig.token !== msg.token ||
                    connectionConfig.socketUrl !== msg.socketUrl;

                if (configChanged) {
                    connectionConfig = {
                        socketUrl: msg.socketUrl,
                        merchantId: msg.merchantId,
                        token: msg.token
                    };
                    // إذا تغيّر التاجر، نصفر اللقطة ونعيد الاتصال
                    lastSnapshot = null;
                    lastSnapshotTimestamp = 0;
                    lastInitTimestamp = 0;
                    if (ws) {
                        try { ws.close(1000, 'تبديل التاجر'); } catch (_) {}
                        ws = null;
                    }
                    connectWebSocket();
                } else if ((now - lastInitTimestamp) < INIT_DEBOUNCE_MS) {
                    // نفس التاجر + init خلال أقل من 3 ثوانٍ → نتجاهل الطلب المكرر
                    // فقط نرسل الحالة الحالية للـ port الجديد
                    port.postMessage(JSON.stringify({
                        type: 'status',
                        status: currentStatus,
                        detail: lastStatusDetail
                    }));
                    if (lastSnapshot) {
                        port.postMessage(JSON.stringify({
                            type: 'snapshot',
                            data: lastSnapshot,
                            snapshotAge: now - lastSnapshotTimestamp
                        }));
                    }
                    break;
                }

                lastInitTimestamp = now;

                // إرسال الحالة الحالية للتبويب فوراً (0ms latency!)
                port.postMessage(JSON.stringify({
                    type: 'status',
                    status: currentStatus,
                    detail: lastStatusDetail
                }));

                // إذا كان لدينا لقطة بيانات مسبقة، أرسلها لهذا التبويب فوراً مع عمرها
                if (lastSnapshot) {
                    port.postMessage(JSON.stringify({
                        type: 'snapshot',
                        data: lastSnapshot,
                        snapshotAge: now - lastSnapshotTimestamp
                    }));
                }

                // إن لم يكن السوكيت مفتوحاً أو قيد الاتصال، ابدأه فوراً
                if (!ws || (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.CONNECTING)) {
                    connectWebSocket();
                }
                break;
            }

            case 'reconnect': {
                reconnectAttempt = 0;
                if (ws) {
                    try { ws.close(); } catch (_) {}
                    ws = null;
                }
                connectWebSocket();
                break;
            }

            case 'ping': {
                port.postMessage(JSON.stringify({ type: 'pong' }));
                break;
            }

            case 'get_status': {
                // استعلام عن الحالة الحالية للاتصال
                port.postMessage(JSON.stringify({
                    type: 'status',
                    status: currentStatus,
                    detail: lastStatusDetail,
                    hasSnapshot: Boolean(lastSnapshot),
                    snapshotAge: lastSnapshotTimestamp ? Date.now() - lastSnapshotTimestamp : null
                }));
                break;
            }

            case 'close_port': {
                ports.delete(port);
                // إذا لم يبقَ أي port متصل، أوقف محاولات الإعادة وأغلق الـ WS
                if (ports.size === 0) {
                    isExplicitlyClosed = true;
                    stopPing();
                    if (reconnectTimer) {
                        clearTimeout(reconnectTimer);
                        reconnectTimer = null;
                    }
                    if (ws) {
                        try { ws.close(1000, 'لا يوجد تبويبات نشطة'); } catch (_) {}
                        ws = null;
                    }
                }
                break;
            }

            default:
                break;
        }
    };

    port.start();
};
