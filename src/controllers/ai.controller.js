const config = require('../config');
const { forwardApiRequest } = require('../middleware/proxy');

/**
 * Controller for Merchant AI Shopping Assistant
 */
const aiController = {
  async chat(req, res, next) {
    try {
      const { message, store_id, history, cart, user } = req.body;
      const targetStore = store_id || config.defaultStoreId;

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'ai_chat',
        message,
        merchant_id: targetStore,
        store_id: targetStore,
        history: history || [],
        cart: cart || [],
        user: user || {}
      });

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  async getConfig(req, res, next) {
    try {
      const storeId = req.params.storeId || config.defaultStoreId;
      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'get_ai_assistant_config',
        merchant_id: storeId
      });
      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = aiController;
