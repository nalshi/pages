const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const orderController = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');
const aiController = require('../controllers/ai.controller');
const { forwardApiRequest } = require('../middleware/proxy');
const config = require('../config');

// === Store & Products Routes ===
router.get('/store/:storeId?', storeController.getStoreInfo);
router.get('/store/:storeId/theme', storeController.getStoreTheme);
router.post('/store/:storeId/theme', storeController.saveStoreTheme);
router.get('/store/:storeId/products', storeController.getProducts);
router.get('/store/:storeId/categories', storeController.getCategoriesTree);

// === Authentication Routes ===
router.get('/auth/session', authController.checkSession);
router.post('/auth/otp/request', authController.requestOtp);
router.post('/auth/otp/verify', authController.verifyOtp);
router.post('/auth/name', authController.saveName);

// === Orders Routes ===
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getUserOrders);
router.post('/orders/cancel', orderController.cancelOrder);
router.post('/orders/confirm-delivery', orderController.confirmDeliveryCode);

// === AI Chatbot Routes ===
router.post('/ai/chat', aiController.chat);
router.get('/ai/config/:storeId?', aiController.getConfig);

// === Unified Action Dispatcher (Universal Worker / Gateway Proxy) ===
router.all('/worker/:action?', async (req, res, next) => {
  try {
    const action = req.params.action || req.body?.action || req.query?.action;
    const token = req.headers['authorization'];
    const headers = {};
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const payload = {
      action: action,
      ...(req.method === 'POST' ? req.body : req.query)
    };

    const upstream = await forwardApiRequest(config.mainApiUrl, payload, headers);
    return res.status(upstream.status).json(upstream.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
