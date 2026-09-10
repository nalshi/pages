const config = require('../config');
const { forwardApiRequest } = require('../middleware/proxy');

/**
 * Controller for Customer Authentication & OTP
 */
const authController = {
  // فحص حالة الجلسة
  async checkSession(req, res, next) {
    try {
      const token = req.headers['authorization'];
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'check_customer_session'
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // طلب رمز OTP
  async requestOtp(req, res, next) {
    try {
      const upstream = await forwardApiRequest(config.authApiUrl, {
        action: 'request_otp',
        ...req.body
      });

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // التحقق من رمز OTP
  async verifyOtp(req, res, next) {
    try {
      const upstream = await forwardApiRequest(config.authApiUrl, {
        action: 'verify_otp',
        ...req.body
      });

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // حفظ اسم العميل الجديد
  async saveName(req, res, next) {
    try {
      const upstream = await forwardApiRequest(config.authApiUrl, {
        action: 'save_name',
        ...req.body
      });

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
