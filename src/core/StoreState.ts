/**
 * ========================================================
 * 📦 StoreState.ts - مدير الحالة التفاعلي المركزي للمتجر
 * ========================================================
 */

import { CartItem, CartState, Product, UserSession, StorefrontConfig, Category } from '../types';
import { events } from './EventBus';

export class StoreState {
  private static instance: StoreState;

  public user: UserSession = { loggedIn: false };
  public products: Product[] = [];
  public categories: Category[] = [];
  public activeCategory: string | number = 'all';
  public favorites: Set<string | number> = new Set();
  public cart: CartState = {
    items: [],
    discount_amount: 0,
    delivery_fee: 0,
  };
  public config: StorefrontConfig | null = null;
  public storeId: string = 'nalsh_mall';

  private constructor() {
    this.initFromStorage();
    this.setupStorageListener();
  }

  public static getInstance(): StoreState {
    if (!StoreState.instance) {
      StoreState.instance = new StoreState();
    }
    return StoreState.instance;
  }

  private initFromStorage(): void {
    try {
      const savedUser = localStorage.getItem('nalsh_user_session');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }

      const savedCart = localStorage.getItem('nalsh_cart_items');
      if (savedCart) {
        this.cart.items = JSON.parse(savedCart);
      }

      const savedFavs = localStorage.getItem('nalsh_favorites');
      if (savedFavs) {
        const favArray: (string | number)[] = JSON.parse(savedFavs);
        this.favorites = new Set(favArray);
      }
    } catch (e) {
      console.warn('[StoreState] Failed to initialize state from storage:', e);
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === 'nalsh_cart_items' && e.newValue) {
        try {
          this.cart.items = JSON.parse(e.newValue);
          events.emit('cart:updated', this.getCart());
        } catch {}
      } else if (e.key === 'nalsh_user_session' && e.newValue) {
        try {
          this.user = JSON.parse(e.newValue);
          events.emit('user:changed', this.user);
        } catch {}
      } else if (e.key === 'nalsh_favorites' && e.newValue) {
        try {
          this.favorites = new Set(JSON.parse(e.newValue));
          events.emit('favorites:updated', Array.from(this.favorites));
        } catch {}
      }
    });
  }

  // === User Session ===
  public setUser(user: UserSession): void {
    this.user = user;
    if (user.loggedIn && user.token) {
      localStorage.setItem('customer_token', user.token);
      localStorage.setItem('nalsh_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('nalsh_user_session');
    }
    events.emit('user:changed', this.user);
  }

  public logout(): void {
    this.setUser({ loggedIn: false });
  }

  // === Products & Catalog ===
  public setProducts(products: Product[]): void {
    this.products = products;
    (window as any).allProducts = products;
    events.emit('products:loaded', products);
  }

  public setCategories(categories: Category[]): void {
    this.categories = categories;
    events.emit('categories:loaded', categories);
  }

  public setActiveCategory(categoryId: string | number): void {
    this.activeCategory = categoryId;
    events.emit('category:selected', categoryId);
  }

  // === Cart Management ===
  public addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
    const qty = item.quantity || 1;
    const existingIndex = this.cart.items.findIndex((i) => {
      if (item.selected_variation && i.selected_variation) {
        return i.product_id === item.product_id && i.selected_variation.id === item.selected_variation.id;
      }
      return i.product_id === item.product_id;
    });

    if (existingIndex > -1) {
      this.cart.items[existingIndex].quantity += qty;
    } else {
      this.cart.items.push({ ...item, quantity: qty });
    }

    this.saveCart();
    events.emit('cart:item-added', item);
  }

  public updateCartItemQuantity(index: number, delta: number): void {
    if (index >= 0 && index < this.cart.items.length) {
      const item = this.cart.items[index];
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.cart.items.splice(index, 1);
      }
      this.saveCart();
    }
  }

  public removeCartItem(index: number): void {
    if (index >= 0 && index < this.cart.items.length) {
      this.cart.items.splice(index, 1);
      this.saveCart();
    }
  }

  public clearCart(): void {
    this.cart.items = [];
    this.cart.discount_amount = 0;
    this.cart.coupon_code = undefined;
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('nalsh_cart_items', JSON.stringify(this.cart.items));
    events.emit('cart:updated', this.getCart());
  }

  public getCart(): CartState & {
    totalItems: number;
    subtotal: number;
    total: number;
  } {
    const subtotal = this.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = this.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const total = Math.max(0, subtotal - this.cart.discount_amount + this.cart.delivery_fee);

    return {
      ...this.cart,
      totalItems,
      subtotal,
      total,
    };
  }

  // === Favorites / Wishlist ===
  public toggleFavorite(productId: string | number): boolean {
    const isFav = this.favorites.has(productId);
    if (isFav) {
      this.favorites.delete(productId);
    } else {
      this.favorites.add(productId);
    }

    const favArray = Array.from(this.favorites);
    localStorage.setItem('nalsh_favorites', JSON.stringify(favArray));
    events.emit('favorites:updated', favArray);
    return !isFav;
  }

  public isFavorite(productId: string | number): boolean {
    return this.favorites.has(productId);
  }

  // === Theme & Configuration ===
  public setConfig(config: StorefrontConfig): void {
    this.config = config;
    events.emit('config:updated', config);
  }
}

export const state = StoreState.getInstance();
