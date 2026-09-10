/**
 * realtime-worker.js — SharedWorker للاتصال اللحظي المستمر للوحة التاجر
 * 
 * المزايا الفائقة:
 *  1. يعمل في خلفية المتصفح ولا ينقطع الاتصال عند عمل Refresh (إعادة تحميل) للصفحة.
 *  2. مشاركة اتصال WebSocket واحد بين جميع التبويبات المفتوحة لنفس التاجر.
 *  3. الاحتفاظ بآخر لقطة بيانات (Snapshot) في الذاكرة لتسليمها فوراً (0ms) لأي صفحة يُعاد تحميلها.
 *  4. إدارة إعادة الاتصال التلقائي بذكاء والحفاظ على صحة القناة مع Cloudflare Worker.
 */

/* eslint-disable no-restricted-globals */
const ports = new Set();
let ws = null;
let connectionConfig = null;
let currentStatus = 'idle';
let lastStatusDetail = '';
let lastSnapshot = null;
let reconnectTimer = null;
let reconnectAttempt = 0;
let pingInterval = null;
let isExplicitlyClosed = false;

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
    }, 20000);
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
    const delay = Math.min(15000, 1000 * Math.pow(1.6, Math.min(reconnectAttempt - 1, 5)));
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
            updateStatus('connected', 'متصل لحظياً');
            broadcast({ type: 'snapshot', data: msg });
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
                    if (ws) {
                        try { ws.close(1000, 'تبديل التاجر'); } catch (_) {}
                        ws = null;
                    }
                    connectWebSocket();
                }

                // إرسال الحالة الحالية للتبويب فوراً (0ms latency!)
                port.postMessage(JSON.stringify({
                    type: 'status',
                    status: currentStatus,
                    detail: lastStatusDetail
                }));

                // إذا كان لدينا لقطة بيانات مسبقة، أرسلها لهذا التبويب فوراً
                if (lastSnapshot) {
                    port.postMessage(JSON.stringify({
                        type: 'snapshot',
                        data: lastSnapshot
                    }));
                }

                // إن لم يكن السوكيت مفتوحاً أو قيد الاتصال، ابدأه فوراً
                if (!ws || (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.CONNECTING)) {
                    connectWebSocket();
                }
                break;
            }

            case 'reconnect': {
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

            case 'close_port': {
                ports.delete(port);
                break;
            }

            default:
                break;
        }
    };

    port.start();
};
