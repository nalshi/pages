const config = require('../config');
const { forwardApiRequest } = require('../middleware/proxy');

// In-Memory Store Cache (5 minutes TTL)
const storeCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Controller for Store Data, Customization & Products
 */
const storeController = {
  // جلب بيانات المتجر بالكامل (Info + Categories + Products)
  async getStoreInfo(req, res, next) {
    try {
      const storeId = (req.params.storeId || config.defaultStoreId).toLowerCase();

      // فحص الكاش السريع في الذاكرة
      const cached = storeCache.get(storeId);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return res.json({ status: 'success', data: cached.data, source: 'cache' });
      }

      // 1. جلب info.json و categories.json و products_page_1.json بالتوازي
      try {
        const [infoRes, catRes, page1Res] = await Promise.all([
          fetch(`${config.cdnUrl}/stores/${storeId}/info.json`, { cache: 'no-store' }),
          fetch(`${config.cdnUrl}/stores/${storeId}/categories.json`, { cache: 'no-store' }),
          fetch(`${config.cdnUrl}/stores/${storeId}/products_page_1.json`, { cache: 'no-store' })
        ]);

        if (infoRes.ok && catRes.ok) {
          const infoJson = await infoRes.json();
          const catJson = await catRes.json();
          const info = infoJson.data || infoJson;
          const categories = catJson.data || [];

          let productsMap = {};
          let totalPages = 1;

          if (page1Res.ok) {
            const page1Json = await page1Res.json();
            totalPages = page1Json.total_pages || 1;
            Object.assign(productsMap, page1Json.data || {});
          }

          // جلب بقية صفحات المنتجات بالتوازي لضمان توفر كافة المنتجات
          if (totalPages > 1) {
            const pagePromises = [];
            const maxPagesToFetch = Math.min(totalPages, 15);
            for (let p = 2; p <= maxPagesToFetch; p++) {
              pagePromises.push(
                fetch(`${config.cdnUrl}/stores/${storeId}/products_page_${p}.json`, { cache: 'no-store' })
                  .then(r => r.ok ? r.json() : null)
                  .catch(() => null)
              );
            }
            const otherPages = await Promise.all(pagePromises);
            otherPages.forEach(pg => {
              if (pg && pg.data) {
                Object.assign(productsMap, pg.data);
              }
            });
          }

          // تجميع المنتجات داخل كل فئة
          const populatedCategories = categories.map(cat => {
            const fullProducts = (cat.products || []).map(p => {
              const full = productsMap[p.id] || p;
              return {
                ...full,
                id: full.id || p.id,
                name: full.name || p.n || p.name || 'منتج',
                price: parseFloat(full.price || p.p || 0),
                original_price: parseFloat(full.original_price || full.price || p.p || 0),
                discount: parseFloat(full.discount || 0),
                image: full.image || full.img || full.thumbnail || '',
                description: full.description || full.desc || '',
                stock: full.stock !== undefined ? full.stock : 10,
                options: full.options || [],
                category_id: cat.id,
                category_name: cat.name
              };
            });

            return {
              ...cat,
              products: fullProducts
            };
          }).filter(c => (c.products && c.products.length > 0) || (c.children && c.children.length > 0));

          const allProductsList = Object.values(productsMap).map(p => ({
            ...p,
            name: p.name || p.n || 'منتج',
            price: parseFloat(p.price || p.p || 0),
            image: p.image || p.img || p.thumbnail || ''
          }));

          const compiledStoreData = {
            ...info,
            id: info.id || info.merchant_id || storeId,
            store_name: info.store_name || info.name || 'متجر نالش',
            bio: info.bio || info.welcome_message || 'أهلاً بكم في متجرنا الإلكتروني',
            categories: populatedCategories,
            all_products: allProductsList.length > 0 ? allProductsList : undefined
          };

          // حفظ في الكاش
          storeCache.set(storeId, {
            data: compiledStoreData,
            timestamp: Date.now()
          });

          return res.json({ status: 'success', data: compiledStoreData, source: 'cdn_compiled' });
        }
      } catch (cdnErr) {
        console.warn(`CDN data fetch error for store ${storeId}:`, cdnErr.message);
      }

      // 2. المحاولة الاحتياطية عبر API المركزي
      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'get_merchant_settings',
        merchant_id: storeId
      });

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // جلب إعدادات التخصيص البصري للمتجر (Theme Tokens & Blocks)
  async getStoreTheme(req, res, next) {
    try {
      const storeId = (req.params.storeId || config.defaultStoreId).toLowerCase();
      
      try {
        const cdnRes = await fetch(`${config.cdnUrl}/stores/${storeId}/info.json`);
        if (cdnRes.ok) {
          const storeInfo = await cdnRes.json();
          const info = storeInfo.data || storeInfo;
          return res.json({
            status: 'success',
            theme: info.storefront_config || info.theme || null,
            tokens: info.storefront_config?.design_tokens || null,
            blocks: info.storefront_config?.layout_blocks || null
          });
        }
      } catch (e) {}

      return res.json({
        status: 'success',
        theme: null,
        message: 'Default store theme applied'
      });
    } catch (error) {
      next(error);
    }
  },

  // حفظ تخصيصات التاجر للمتجر (Theme & Layout)
  async saveStoreTheme(req, res, next) {
    try {
      const storeId = (req.params.storeId || config.defaultStoreId).toLowerCase();
      const { storefront_config, token } = req.body;

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // حذف الكاش لتحديث البيانات فوراً
      storeCache.delete(storeId);

      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'save_merchant_settings',
        merchant_id: storeId,
        storefront_config
      }, headers);

      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // جلب شجرة الفئات
  async getCategoriesTree(req, res, next) {
    try {
      const storeId = req.params.storeId || req.query.store || config.defaultStoreId;
      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'get_categories_tree',
        merchant_id: storeId
      });
      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  },

  // جلب قائمة المنتجات
  async getProducts(req, res, next) {
    try {
      const storeId = req.params.storeId || req.query.store || config.defaultStoreId;
      const upstream = await forwardApiRequest(config.mainApiUrl, {
        action: 'get_public_products',
        merchant_id: storeId
      });
      return res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = storeController;
