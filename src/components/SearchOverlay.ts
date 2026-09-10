/**
 * ========================================================
 * 🔍 SearchOverlay.ts - واجهة ومحرك البحث الفوري الذكي
 * ========================================================
 */

import { state } from '../core/StoreState';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export class SearchOverlay {
  private static overlayEl: HTMLElement | null = null;
  private static recentSearchesKey = 'nalsh_recent_searches';

  public static init(): void {
    let el = document.getElementById('search-overlay-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'search-overlay-modal';
      el.className = 'page-overlay transition-element';
      document.body.appendChild(el);
    }
    this.overlayEl = el;
  }

  public static normalizeArabic(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[^\w\sا-ي0-9]/g, '')
      .trim();
  }

  public static getRecentQueries(): string[] {
    try {
      const data = localStorage.getItem(this.recentSearchesKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveRecentQuery(q: string): void {
    if (!q || q.length < 2) return;
    let queries = this.getRecentQueries();
    queries = queries.filter((item) => item.toLowerCase() !== q.toLowerCase());
    queries.unshift(q);
    queries = queries.slice(0, 8);
    localStorage.setItem(this.recentSearchesKey, JSON.stringify(queries));
  }

  public static open(): void {
    this.init();
    if (!this.overlayEl) return;

    const recent = this.getRecentQueries();

    this.overlayEl.innerHTML = `
      <div class="page-header" style="display:flex; align-items:center; gap:12px; padding:12px 16px;">
        <button class="nav-icon-btn" onclick="window.NalshStorefront?.toggleSearch(false)" aria-label="رجوع">
          <i class="fas fa-arrow-right"></i>
        </button>
        <div style="position:relative; flex:1;">
          <input type="text" id="storefront-search-input" class="search-input" placeholder="ابحث عن منتج أو قسم..." style="width:100%; padding:12px 42px 12px 16px; border-radius:50px; border:2px solid var(--border); background:var(--bg-card); color:var(--text-main); font-size:1rem; font-weight:700;" autocomplete="off">
          <button id="search-voice-btn" onclick="window.NalshStorefront?.startVoiceSearch()" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--primary); font-size:1.2rem; cursor:pointer;" aria-label="بحث صوتي">
            <i class="fas fa-microphone"></i>
          </button>
        </div>
      </div>

      <div class="page-body" style="padding:16px;" id="search-body-content">
        ${
          recent.length > 0
            ? `
          <div class="recent-searches-box" style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-weight:800; font-size:0.9rem; color:var(--text-muted);">عمليات البحث الأخيرة:</span>
              <button style="background:none; border:none; color:var(--danger); font-size:0.8rem; font-weight:700; cursor:pointer;" onclick="window.NalshStorefront?.clearRecentSearches()">مسح السجل</button>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${recent
                .map(
                  (q) => `
                <button class="cat-chip mini" onclick="window.NalshStorefront?.setSearchQuery('${ProductCard.escapeHTML(q)}')">
                  <i class="fas fa-history" style="font-size:0.75rem;"></i>
                  <span>${ProductCard.escapeHTML(q)}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <div id="search-results-grid" class="product-grid ultra-product-grid">
          ${state.products.slice(0, 8).map((p) => ProductCard.render(p)).join('')}
        </div>
      </div>
    `;

    this.overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    const input = document.getElementById('storefront-search-input') as HTMLInputElement;
    if (input) {
      input.focus();
      input.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.performSearch(val);
      });
    }
  }

  public static performSearch(query: string): void {
    const norm = this.normalizeArabic(query);
    const container = document.getElementById('search-results-grid');
    if (!container) return;

    if (!norm) {
      container.innerHTML = state.products.slice(0, 8).map((p) => ProductCard.render(p)).join('');
      return;
    }

    const matched = state.products.filter((p) => {
      const pName = this.normalizeArabic(p.name);
      const pCat = this.normalizeArabic(p.category || '');
      const pDesc = this.normalizeArabic(p.description || '');
      return pName.includes(norm) || pCat.includes(norm) || pDesc.includes(norm);
    });

    if (matched.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px 10px; color:var(--text-muted);">
          <i class="fas fa-search" style="font-size:3rem; opacity:0.3; margin-bottom:15px;"></i>
          <h4 style="font-weight:800;">لم نجد نتائج مطابقة لـ "${ProductCard.escapeHTML(query)}"</h4>
          <p style="font-size:0.9rem;">جرّب البحث بكلمات أخرى أو تصفح الأقسام الرئيسية.</p>
        </div>
      `;
    } else {
      container.innerHTML = matched.map((p) => ProductCard.render(p)).join('');
      this.saveRecentQuery(query);
    }
  }

  public static startVoice(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('البحث الصوتي غير مدعوم في هذا المتصفح.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;

    const micBtn = document.getElementById('search-voice-btn');
    if (micBtn) micBtn.style.color = 'var(--danger)';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('storefront-search-input') as HTMLInputElement;
      if (input) {
        input.value = transcript;
        this.performSearch(transcript);
      }
    };

    recognition.onend = () => {
      if (micBtn) micBtn.style.color = 'var(--primary)';
    };

    recognition.start();
  }

  public static close(): void {
    if (this.overlayEl) {
      this.overlayEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}
