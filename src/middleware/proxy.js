const config = require('../config');

/**
 * Universal Upstream API Request Forwarder
 */
async function forwardApiRequest(targetUrl, payload, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (config.gatewaySecret) {
    defaultHeaders['X-Gateway-Secret'] = config.gatewaySecret;
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: finalHeaders,
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return { status: response.status, data };
    } else {
      const text = await response.text();
      return { status: response.status, data: { status: 'success', raw: text } };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('انتهت مهلة الاتصال بالخادم الرئيسي (Request Timeout)');
    }
    throw error;
  }
}

module.exports = {
  forwardApiRequest
};
