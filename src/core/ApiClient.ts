/**
 * ========================================================
 * 🌐 ApiClient.ts - عميل الاتصال الشبكي السريع والآمن
 * ========================================================
 */

import { state } from './StoreState';
import { events } from './EventBus';

export const MAIN_API_URL = 'https://api.nalsh.dpdns.org/api.php';

function resolveWorkerApiUrl(): string {
  if (typeof window !== 'undefined') {
    const configured = (window as any).WORKER_API_URL || (window as any).CF_WORKER_URL || (window as any).CLOUDFLARE_WORKER_URL;
    if (configured) {
      if (typeof configured === 'string') {
        const trimmed = configured.trim();
        if (trimmed === '/api/worker' || trimmed === '/api/worker/') {
          return '/api/worker/';
        }
        if (trimmed.includes('://')) {
          const withoutSlash = trimmed.replace(/\/$/, '');
          return withoutSlash.endsWith('/api/worker') ? `${withoutSlash}/` : `${withoutSlash}/api/worker/`;
        }
        return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
      }
    }
    const directRoot = (window as any).CF_WORKER_URL;
    if (typeof directRoot === 'string') {
      return `${directRoot.replace(/\/$/, '')}/api/worker/`;
    }
  }

  const fallbackWorkers = [
    '/api/worker/',
    'https://api.nalsh.dpdns.org/api.php'
  ];

  return fallbackWorkers[0];
}

export const WORKER_API_URL = resolveWorkerApiUrl();

const WORKER_ACTIONS = new Set([
  'check_customer_session',
  'verify_cart_live',
  'create_order',
  'get_user_orders',
  'add_to_cart',
  'get_cart',
  'save_product',
  'list_products',
  'delete_product',
  'toggle_availability',
  'get_merchant_orders',
  'get_orders',
  'update_order_status',
  'cancel_order',
  'confirm_delivery_code',
  'get_stats',
  'get_merchant_settings',
  'save_merchant_settings',
  'save_fcm_token',
  'get_firebase_config',
  'get_categories_tree',
  'get_public_products',
  'get_ai_assistant_config',
  'save_ai_assistant_config',
  'get_whatsapp_config',
  'save_whatsapp_config',
  'ai_chat',
]);

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  silent?: boolean;
  timeoutMs?: number;
  retries?: number;
}

export class ApiClient {
  public static async request<T = any>(
    action: string,
    data: Record<string, any> = {},
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'POST',
      silent = false,
      timeoutMs = 12000,
      retries = 1,
    } = options;

    const payload: Record<string, any> = { action, ...data };
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = localStorage.getItem('customer_token');
    const useWorker = WORKER_ACTIONS.has(action);

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
      if (!useWorker) {
        payload['auth_token'] = token;
      }
    }

    const targetUrl = useWorker ? WORKER_API_URL : MAIN_API_URL;

    let lastError: any = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(targetUrl, {
          method,
          headers,
          credentials: useWorker ? 'omit' : 'include',
          body: method === 'GET' ? undefined : JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (response.status === 401) {
          state.logout();
          events.emit('auth:unauthorized');
          if (!silent) {
            events.emit('toast:show', {
              message: 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً',
              type: 'error',
            });
          }
          throw new Error('Unauthorized');
        }

        const result = await response.json();
        return result as T;
      } catch (err: any) {
        lastError = err;
        if (attempt < retries && err.name !== 'AbortError') {
          // Exponential backoff
          await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
        }
      }
    }

    console.error(`[ApiClient] Request failed for action "${action}":`, lastError);
    throw lastError;
  }
}

export const api = ApiClient.request;
