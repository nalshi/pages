const config = require('../config');
const { forwardApiRequest } = require('../middleware/proxy');

/**
 * Controller for Orders and Live Tracking
 */
const orderController = {
  // إنشاء طلب جديد
  async createOrder(req, res, next) {
    try {
      const token = req.headers['authorization'] || req.body.auth_token;
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'create_order',
        ...req.body
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // جلب طلبات العميل
  async getUserOrders(req, res, next) {
    try {
      const token = req.headers['authorization'] || req.query.token;
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'get_user_orders',
        ...req.query
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // إلغاء طلب
  async cancelOrder(req, res, next) {
    try {
      const token = req.headers['authorization'];
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'cancel_order',
        ...req.body
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // تأكيد كود التسليم
  async confirmDeliveryCode(req, res, next) {
    try {
      const token = req.headers['authorization'];
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'confirm_delivery_code',
        ...req.body
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
