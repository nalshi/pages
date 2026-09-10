/**
 * ========================================================
 * 🤖 AIChatbot.ts - المساعد الذكي لمساعدة الزوار والعملاء
 * ========================================================
 */

import { state } from '../core/StoreState';
import { api } from '../core/ApiClient';
import { ProductCard } from './ProductCard';
import { AIChatMessage } from '../types';

export class AIChatbot {
  private static modalEl: HTMLElement | null = null;
  private static messages: AIChatMessage[] = [];
  private static isInitialized = false;

  private static getAssistantConfig(): Record<string, any> {
    return {
      enabled: true,
      name: 'مساعد نالش',
      persona: 'classic',
      avatar_icon: 'fa-robot',
    avatar_emoji: '',
      button_style: 'pill',
      position: 'bottom-right',
      response_style: 'friendly',
    accent_color: '#5D646D',
      status_text: 'متصل للرد الفوري',
      enable_quick_actions: true,
      smart_contextual_actions: true,
      smart_contextual_replies: true,
      quick_actions: ['أريد أفضل العروض المتاحة', 'كيف أقوم بالطلب والتوصيل؟', 'تتبع طلبي'],
      ...(state.config?.messages?.ai_assistant || {})
    };
  }

  private static getPageContextInfo(): { hasCart: boolean; isProductPage: boolean; isCheckoutPage: boolean; pathLabel: string } {
    const cartCount = Array.isArray(state.cart?.items) ? state.cart.items.length : 0;
    const path = (window.location.pathname || '').toLowerCase();
    const hasCart = cartCount > 0 || /cart|basket|سلة/.test(path);
    const isProductPage = /product|details|منتج/.test(path);
    const isCheckoutPage = /checkout|payment|الدفع|طلب/.test(path);

    if (hasCart) return { hasCart: true, isProductPage: false, isCheckoutPage: false, pathLabel: 'السلة' };
    if (isCheckoutPage) return { hasCart: false, isProductPage: false, isCheckoutPage: true, pathLabel: 'إتمام الطلب' };
    if (isProductPage) return { hasCart: false, isProductPage: true, isCheckoutPage: false, pathLabel: 'صفحة المنتج' };
    return { hasCart: false, isProductPage: false, isCheckoutPage: false, pathLabel: 'المتجر' };
  }

  private static getContextualGreeting(): string {
    const assistant = this.getAssistantConfig();
    const assistantName = assistant.name || 'مساعد نالش';
    const { hasCart, isProductPage, isCheckoutPage, pathLabel } = this.getPageContextInfo();
    const behaviorMode = assistant.behavior_mode || 'support';
    const conversationStyle = assistant.conversation_style || 'balanced';
    const shortGreeting = `أهلاً بك! أنا ${assistantName}. كيف يمكنني مساعدتك؟`;
    const salesGreeting = `أهلاً بك! أنا ${assistantName}، وسأساعدك في اختيار أفضل الخيارات والصفقات المناسبة لك اليوم.`;
    const conciergeGreeting = `أهلاً بك! أنا ${assistantName}. سأرافقك بخطوات ذكية من الاستعراض إلى الطلب والتوصيل.`;
    const advisorGreeting = `أهلاً بك! أنا ${assistantName}، وأستطيع أن أقدّم لك اقتراحات دقيقة بناءً على ما تراه الآن.`;

    if (assistant.smart_contextual_replies === false) {
      return state.config?.messages?.chatbot_greeting || (conversationStyle === 'short' ? shortGreeting : salesGreeting);
    }
    if (hasCart) {
      const base = behaviorMode === 'sales' ? salesGreeting : behaviorMode === 'concierge' ? conciergeGreeting : advisorGreeting;
      return `${base} أرى أنك في ${pathLabel} الآن، وأنا أستطيع مساعدتك بإتمام الطلب بسرعة ومراقبة التوصيل. 🛒`;
    }
    if (isProductPage) {
      const base = behaviorMode === 'advisor' ? advisorGreeting : behaviorMode === 'sales' ? salesGreeting : conciergeGreeting;
      return `${base} أنت الآن في ${pathLabel}، وأستطيع مقارنة الخيارات أو اقتراح أفضل منتج يناسبك.`;
    }
    if (isCheckoutPage) {
      const base = behaviorMode === 'concierge' ? conciergeGreeting : behaviorMode === 'sales' ? salesGreeting : advisorGreeting;
      return `${base} أستطيع مساعدتك في إتمام الطلب، اختيار طريقة الدفع، ومتابعة الشحنة في أسرع وقت.`;
    }
    const baseGreeting = behaviorMode === 'sales' ? salesGreeting : behaviorMode === 'concierge' ? conciergeGreeting : behaviorMode === 'advisor' ? advisorGreeting : shortGreeting;
    return `${baseGreeting} أستطيع مساعدتك اليوم في العروض، المنتجات، أو متابعة الطلبات داخل ${pathLabel}.`;
  }

  private static getContextualQuickActions(customActions: string[] = []): string[] {
    const assistant = this.getAssistantConfig();
    const { hasCart, isProductPage, isCheckoutPage } = this.getPageContextInfo();

    const contextActions: string[] = [];
    if (hasCart) {
      contextActions.push('أرني السلة وأكمل طلبي');
      contextActions.push('هل هناك خصم على منتجات السلة؟');
      contextActions.push('أحتاج توصيل سريع إلى عنواني');
    } else if (isProductPage) {
      contextActions.push('قارن بين هذا المنتج والبدائل');
      contextActions.push('أرني أفضل الخصومات المتاحة');
      contextActions.push('أحتاج وصفاً تفصيلياً لهذا المنتج');
    } else if (isCheckoutPage) {
      contextActions.push('أرني خيارات الدفع المتاحة');
      contextActions.push('كيف أتابع طلبي؟');
      contextActions.push('هل يمكن تعديل الطلب؟');
    } else {
      contextActions.push('أرني أفضل العروض الحالية');
      contextActions.push('أحتاج اقتراح منتج حسب ميزانتي');
      contextActions.push('كيف أطلب واستلم طلبي؟');
    }

    const allActions = assistant.smart_contextual_actions === false
      ? customActions
      : [...(customActions || []), ...contextActions];

    const uniqueActions: string[] = [];
    for (const action of allActions) {
      const clean = (action || '').trim();
      if (!clean) continue;
      if (!uniqueActions.includes(clean)) uniqueActions.push(clean);
    }

    return uniqueActions.slice(0, 4);
  }

  private static getAssistantAccent(): string {
    const assistant = this.getAssistantConfig();
    return assistant.accent_color || {
      classic: '#4F46E5',
      premium: '#8B5CF6',
      futuristic: '#06B6D4',
      luxury: '#B45309',
      fashion: '#EC4899',
      tech: '#22C55E',
      wellness: '#14B8A6',
      beauty: '#F472B6'
    }[assistant.persona as string] || '#4F46E5';
  }

  private static getAssistantVisualMode(): string {
    const assistant = this.getAssistantConfig();
    return assistant.avatar_style || (
      assistant.persona === 'luxury' ? 'halo' :
      assistant.persona === 'futuristic' ? 'orb' :
      assistant.persona === 'fashion' ? 'hover' :
      'pulse'
    );
  }

  private static getPageContextText(): string {
    const path = window.location.pathname || '';
    const cartCount = Array.isArray(state.cart?.items) ? state.cart.items.length : 0;
    if (/cart|basket|سلة/.test(path) || cartCount > 0) return 'في السلة';
    if (/product|product-details|منتج|details/.test(path)) return 'في صفحة المنتج';
    if (/checkout|payment|الدفع|طلب/.test(path)) return 'في عملية الطلب';
    return 'في المتجر';
  }

  private static getSmartFallbackReply(text: string): { reply: string; products: any[] } {
    const normalized = (text || '').toLowerCase();
    const catalog = Array.isArray(state.products) ? state.products.slice() : [];
    const pickProducts = catalog
      .slice()
      .sort((a: any, b: any) => Number(b?.discount || 0) - Number(a?.discount || 0))
      .slice(0, 3);

    const assistant = this.getAssistantConfig();
    const storeName = state.config?.store_identity?.store_name || 'متجرنا';
    const assistantName = assistant.name || 'مساعد نالش';
    const behaviorMode = assistant.behavior_mode || 'support';
    const conversationStyle = assistant.conversation_style || 'balanced';
    const shortReply = (msg: string) => conversationStyle === 'short' ? msg : msg;

    const { hasCart, isProductPage, isCheckoutPage } = this.getPageContextInfo();
    const salesBoost = behaviorMode === 'sales' ? 'سأقترح لك الأفضل حسب الميزانية والطلب.' : behaviorMode === 'concierge' ? 'سأرافقك بخطوات سهلة ومباشرة.' : 'سأعطيك اقتراحات دقيقة ومفيدة.';

    if (hasCart && /عرض|عروض|خصم|تخفيض|sale|offer/.test(normalized)) {
      return {
        reply: `${assistantName} أرى أن لديك عناصر في السلة، ${salesBoost} ويمكنني أن أساعدك بإضافة خصم أو توجيهك لأفضل المنتجات المماثلة قبل إتمام الطلب.`,
        products: pickProducts
      };
    }

    if (isProductPage && /قدمه|اقتراح|اختر|منتج|recommend|product/.test(normalized)) {
      return {
        reply: `${assistantName} أستطيع مقارنة هذا المنتج مع البدائل المتاحة في المتجر لتحديد الأفضل حسب السعر والجودة ${salesBoost}`,
        products: pickProducts
      };
    }

    if (isCheckoutPage && /دفع|payment|بطاقة|كاش|باي/.test(normalized)) {
      return {
        reply: `أستطيع مساعدتك في اختيار طريقة الدفع الأنسب لك، ${salesBoost} مع توضيح خيارات الدفع عند الاستلام أو الإلكتروني قبل تأكيد الطلب.`,
        products: []
      };
    }

    if (/عرض|عروض|خصم|تخفيض|sale|offer/.test(normalized)) {
      return {
        reply: `${assistantName} يوصيك بتصفح أحدث العروض الحالية في ${storeName}. أستطيع أن أظهر لك أفضل المنتجات ذات الخصم العالي فوراً.`,
        products: pickProducts
      };
    }

    if (/توصيل|شحن|استلام|delivery|shipping/.test(normalized)) {
      return {
        reply: 'نوفر توصيل سريع إلى معظم المناطق، مع خيارات الدفع عند الاستلام والدفع الإلكتروني الموثوق.',
        products: pickProducts
      };
    }

    if (/دفع|payment|بطاقة|كاش|باي/.test(normalized)) {
      return {
        reply: 'يمكنك الدفع بسهولة عبر البطاقات البنكية، الدفع عند الاستلام، أو وسائل الدفع الإلكترونية المتاحة في المتجر.',
        products: pickProducts
      };
    }

    if (/تتبع|طلب|order|tracking/.test(normalized)) {
      return {
        reply: 'يمكنك متابعة طلبك من قسم الطلبات داخل المتجر، أو طلب المساعدة من المساعد للاستفسار عن حالته والتوصيل.',
        products: []
      };
    }

    if (/قدمه|اقتراح|اختر|منتج|recommend|product/.test(normalized)) {
      return {
        reply: `${assistantName} يمكنه اقتراح أفضل الخيارات حسب ميزانيتك وأسلوبك، وأنا أستطيع أن أبدأ بمقارنة المنتجات المتاحة في المتجر الآن.`,
        products: pickProducts
      };
    }

    if (/استرجاع|ارجاع|إرجاع|refund|return/.test(normalized)) {
      return {
        reply: 'توجد سياسة استرجاع واستبدال مناسبة وفق الشروط المعتمدة في المتجر، ويمكنني توضيح الخطوات بدقة عند رغبتك.',
        products: []
      };
    }

    const contextualPrefix = hasCart ? 'أرى أن لديك عناصر في السلة، ' : isProductPage ? 'أنت الآن على صفحة منتج، ' : isCheckoutPage ? 'أنت في مرحلة إتمام الطلب، ' : '';
    return {
      reply: `${contextualPrefix}${assistantName} هنا لمساعدتك في التسوق، مقارنة المنتجات، متابعة الطلبات، أو معرفة أفضل العروض الحالية في ${storeName}. كيف يمكنني خدمتك؟`,
      products: pickProducts
    };
  }

  public static refresh(): void {
    this.isInitialized = false;
    this.init();
  }

  public static init(): void {
    const assistant = this.getAssistantConfig();
    if (this.isInitialized && document.getElementById('ai-chatbot-floating-btn')) {
      this.isInitialized = true;
      this.render();
      return;
    }
    this.isInitialized = true;

    if (assistant.enabled === false) {
      const existingBtn = document.getElementById('ai-chatbot-floating-btn');
      if (existingBtn) existingBtn.remove();
      if (this.modalEl) this.modalEl.remove();
      this.modalEl = null;
      return;
    }

    const assistantName = assistant.name || 'مساعد نالش';
    const position = assistant.position === 'bottom-left' ? 'left' : 'right';
    const buttonStyle = assistant.button_style || 'pill';
    const visualMode = this.getAssistantVisualMode();

    let floatBtn = document.getElementById('ai-chatbot-floating-btn');
    if (!floatBtn) {
      floatBtn = document.createElement('button');
      floatBtn.id = 'ai-chatbot-floating-btn';
      floatBtn.className = `ai-chatbot-fab ${buttonStyle} ${position} ${visualMode}`;
      floatBtn.setAttribute('aria-label', assistantName);
      floatBtn.style.background = `linear-gradient(135deg, ${this.getAssistantAccent()}, ${assistant.accent_color || '#4F46E5'})`;
      floatBtn.style.boxShadow = `0 12px 28px ${assistant.accent_color || '#4F46E5'}55`;
      floatBtn.innerHTML = `
        <div class="ai-fab-icon">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
        <span class="ai-fab-text">${assistantName}</span>
      `;
      floatBtn.onclick = () => this.toggle();
      document.body.appendChild(floatBtn);
    } else {
      floatBtn.className = `ai-chatbot-fab ${buttonStyle} ${position} ${visualMode}`;
      floatBtn.setAttribute('aria-label', assistantName);
      floatBtn.style.background = `linear-gradient(135deg, ${this.getAssistantAccent()}, ${assistant.accent_color || '#4F46E5'})`;
      floatBtn.style.boxShadow = `0 12px 28px ${assistant.accent_color || '#4F46E5'}55`;
      floatBtn.innerHTML = `
        <div class="ai-fab-icon">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
        <span class="ai-fab-text">${assistantName}</span>
      `;
      floatBtn.onclick = () => this.toggle();
    }

    const greeting = this.getContextualGreeting();
    this.messages = [
      {
        id: 'msg_0',
        sender: 'assistant',
        text: greeting,
        timestamp: Date.now(),
      },
    ];
  }

  public static toggle(): void {
    if (this.getAssistantConfig().enabled === false) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  public static isOpen(): boolean {
    return !!this.modalEl?.classList.contains('open');
  }

  public static open(): void {
    if (this.getAssistantConfig().enabled === false) return;
    if (!this.modalEl) {
      this.modalEl = document.createElement('div');
      this.modalEl.id = 'ai-chatbot-modal';
      this.modalEl.className = 'ai-chat-window';
      document.body.appendChild(this.modalEl);
    }

    this.render();
    this.modalEl.classList.add('open');

    const input = document.getElementById('ai-chat-input') as HTMLInputElement;
    if (input) input.focus();
  }

  public static render(): void {
    if (!this.modalEl) return;

    const assistant = this.getAssistantConfig();
    const assistantName = assistant.name || 'مساعد نالش';
    const quickActions = this.getContextualQuickActions(
      Array.isArray(assistant.quick_actions) && assistant.quick_actions.length
        ? assistant.quick_actions
        : ['أريد أفضل العروض المتاحة', 'كيف أقوم بالطلب والتوصيل؟', 'تتبع طلبي']
    );
    const accentColor = this.getAssistantAccent();
    const statusText = assistant.status_text || 'متصل للرد الفوري';

    if (assistant.position === 'bottom-left') {
      this.modalEl.style.left = '16px';
      this.modalEl.style.right = 'auto';
    } else {
      this.modalEl.style.left = 'auto';
      this.modalEl.style.right = '16px';
    }
    this.modalEl.style.setProperty('--ai-accent', accentColor);

    this.modalEl.innerHTML = `
      <div class="ai-chat-header" style="background: linear-gradient(135deg, ${accentColor}, ${assistant.accent_color || accentColor});">
        <div class="ai-header-info">
          <div class="ai-avatar" style="background: rgba(255,255,255,0.2);">${assistant.avatar_icon ? `<i class="fas ${assistant.avatar_icon}"></i>` : '<i class="fas fa-robot"></i>'}</div>
          <div>
            <h4>${assistantName}</h4>
            <span class="ai-status-dot"></span> <span class="ai-status-txt">${statusText}</span>
          </div>
        </div>
        <button class="ai-close-btn" onclick="window.NalshStorefront?.closeChatbot()" aria-label="إغلاق">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="ai-chat-messages" id="ai-messages-container">
        ${this.messages
          .map(
            (msg) => `
          <div class="ai-msg ${msg.sender}">
            <div class="ai-msg-bubble">
              <p>${ProductCard.escapeHTML(msg.text)}</p>
              ${
                msg.products && msg.products.length > 0
                  ? `
                <div class="ai-msg-products" style="display:flex; gap:8px; overflow-x:auto; margin-top:8px; padding-bottom:4px;">
                  ${msg.products.map((p) => ProductCard.render(p, { compact: true })).join('')}
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      ${assistant.enable_quick_actions !== false ? `
      <div class="ai-suggestions-row">
        ${quickActions.slice(0, 3).map((action) => `
          <button class="ai-sug-chip" onclick="window.NalshStorefront?.sendChatbotPrompt('${ProductCard.escapeHTML(action).replace(/'/g, "\\'")}')">${action.length > 18 ? action.slice(0, 18) + '…' : action}</button>
        `).join('')}
      </div>
      ` : ''}

      <div class="ai-chat-input-bar">
        <input type="text" id="ai-chat-input" placeholder="اكتب استفسارك هنا..." onkeydown="if(event.key==='Enter') window.NalshStorefront?.sendChatbotMessage()">
        <button class="ai-send-btn" onclick="window.NalshStorefront?.sendChatbotMessage()" aria-label="إرسال">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;

    this.scrollToBottom();
  }

  private static scrollToBottom(): void {
    requestAnimationFrame(() => {
      const container = document.getElementById('ai-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }

  public static async sendMessage(textOverride?: string): Promise<void> {
    const input = document.getElementById('ai-chat-input') as HTMLInputElement;
    const text = (textOverride || input?.value || '').trim();
    if (!text) return;

    if (input) input.value = '';

    // Add user message
    this.messages.push({
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    });
    this.render();

    // Query AI backend
    try {
      const response = await api('ai_chat', { message: text, store_id: state.storeId }, { silent: true });
      const reply = response?.reply || response?.message || 'شكراً لتواصلك! كيف يمكنني تقديم المزيد من المساعدة؟';
      const products = response?.products || [];

      this.messages.push({
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: reply,
        products,
        timestamp: Date.now(),
      });
    } catch {
      const fallback = this.getSmartFallbackReply(text);

      this.messages.push({
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: fallback.reply,
        products: fallback.products,
        timestamp: Date.now(),
      });
    }

    this.render();
  }

  public static close(): void {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
    }
  }
}
