import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS } from '../data/products';
import { Product, CartItem, ChatMessage, UserRole } from '../types';

interface AppState {
  role: UserRole;
  cart: CartItem[];
  inventory: Product[];
  messages: ChatMessage[];

  setRole: (role: UserRole) => void;
  clearRole: () => void;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleStock: (productId: string) => void;
  updateStockCount: (productId: string, count: number) => void;

  addMessage: (message: Partial<ChatMessage> & { text: string; sender: 'customer' | 'supplier' }) => void;
  clearMessages: () => void;

  resetDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: null,
      cart: [],
      inventory: PRODUCTS.map(p => ({ ...p })),
      messages: [],

      setRole: (role: UserRole) => set({ role }),
      clearRole: () => set({ role: null }),

      addToCart: (product: Product, quantity: number = 1) => {
        const qtyToAdd = Math.max(1, quantity);
        const cart = get().cart;
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + qtyToAdd }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { product, quantity: qtyToAdd }] });
        }
      },

      removeFromCart: (productId: string) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) });
      },

      updateCartQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter(item => item.product.id !== productId) });
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => set({ cart: [] }),

      toggleStock: (productId: string) => {
        set({
          inventory: get().inventory.map(p =>
            p.id === productId
              ? { ...p, inStock: !p.inStock, stockCount: !p.inStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0 }
              : p
          )
        });
      },

      updateStockCount: (productId: string, count: number) => {
        const validCount = Math.max(0, count);
        set({
          inventory: get().inventory.map(p =>
            p.id === productId
              ? { ...p, stockCount: validCount, inStock: validCount > 0 }
              : p
          )
        });
      },

      addMessage: (message) => {
        set({
          messages: [
            ...get().messages,
            {
              ...message,
              id: message.id || Date.now().toString() + Math.random().toString(36).substr(2, 4),
              timestamp: message.timestamp || new Date().toISOString()
            } as ChatMessage
          ]
        });
      },

      clearMessages: () => set({ messages: [] }),

      resetDemoData: () => {
        set({
          cart: [],
          inventory: PRODUCTS.map(p => ({ ...p })),
          messages: [
            {
              id: 'init-1',
              sender: 'supplier',
              text: 'Hello! Welcome to DualCommerce support. How can I help you with your order or products today?',
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
            }
          ]
        });
      }
    }),
    {
      name: 'dual-commerce-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        role: state.role,
        cart: state.cart,
        inventory: state.inventory,
        messages: state.messages
      })
    }
  )
);
