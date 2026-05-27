"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const accountKey = "sampriti-account";
const sessionKey = "sampriti-session";
const legacyGoogleEmail = "google.customer@sampriti.local";

const GUEST_KEY = "_guest";

function getActiveAccountEmail() {
  if (typeof window === "undefined") return GUEST_KEY;

  try {
    const session = JSON.parse(window.localStorage.getItem(sessionKey) || "null") as { email?: string } | null;
    const account = JSON.parse(window.localStorage.getItem(accountKey) || "null") as { email?: string } | null;
    const email = session?.email?.toLowerCase();

    if (!email || email === legacyGoogleEmail || email !== account?.email?.toLowerCase()) {
      return GUEST_KEY;
    }

    return email;
  } catch {
    return GUEST_KEY;
  }
}

interface CartState {
  items: CartItem[];
  cartsByAccount: Record<string, CartItem[]>;
  isOpen: boolean;
  primaryItemId: string | null;
  primaryItemIdByAccount: Record<string, string | null>;
  activeAccountEmail: string | null;
  syncAccount: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCount: () => number;
  getTotal: () => number;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function selectItems(state: CartState, email: string | null) {
  return email ? state.cartsByAccount[email] ?? [] : [];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartsByAccount: {},
      isOpen: false,
      primaryItemId: null,
      primaryItemIdByAccount: {},
      activeAccountEmail: null,

      syncAccount: () =>
        set((state) => {
          const email = getActiveAccountEmail();
          return {
            activeAccountEmail: email,
            items: selectItems(state, email),
            primaryItemId: state.primaryItemIdByAccount[email] ?? null,
          };
        }),

      addItem: (item) =>
        set((state) => {
          const email = getActiveAccountEmail();

          const currentItems = selectItems(state, email);
          const existing = currentItems.find((i) => i.id === item.id);
          const nextItems = existing
            ? currentItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity, image: item.image }
                  : i
              )
            : [...currentItems, item];

          return {
            activeAccountEmail: email,
            items: nextItems,
            primaryItemId: item.id,
            cartsByAccount: {
              ...state.cartsByAccount,
              [email]: nextItems,
            },
            primaryItemIdByAccount: {
              ...state.primaryItemIdByAccount,
              [email]: item.id,
            },
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const email = getActiveAccountEmail();

          const nextItems = selectItems(state, email).filter((i) => i.id !== id);
          const currentPrimaryId = state.primaryItemIdByAccount[email] ?? null;
          const nextPrimaryId =
            currentPrimaryId === id
              ? nextItems.length > 0
                ? nextItems[nextItems.length - 1].id
                : null
              : currentPrimaryId;

          return {
            activeAccountEmail: email,
            items: nextItems,
            primaryItemId: nextPrimaryId,
            cartsByAccount: {
              ...state.cartsByAccount,
              [email]: nextItems,
            },
            primaryItemIdByAccount: {
              ...state.primaryItemIdByAccount,
              [email]: nextPrimaryId,
            },
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const email = getActiveAccountEmail();
          if (!email) return { activeAccountEmail: null, items: [], primaryItemId: null };

          const nextItems = selectItems(state, email).map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          return {
            activeAccountEmail: email,
            items: nextItems,
            cartsByAccount: {
              ...state.cartsByAccount,
              [email]: nextItems,
            },
          };
        }),

      getCount: () => {
        const email = getActiveAccountEmail();
        return selectItems(get(), email).reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotal: () => {
        const email = getActiveAccountEmail();
        return selectItems(get(), email).reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      clearCart: () =>
        set((state) => {
          const email = getActiveAccountEmail();

          return {
            activeAccountEmail: email,
            items: [],
            primaryItemId: null,
            cartsByAccount: {
              ...state.cartsByAccount,
              [email]: [],
            },
            primaryItemIdByAccount: {
              ...state.primaryItemIdByAccount,
              [email]: null,
            },
          };
        }),

      openCart: () => {
        get().syncAccount();
        set({ isOpen: true });
      },
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => {
        get().syncAccount();
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: "sampriti-cart",
      partialize: (state) => ({
        cartsByAccount: state.cartsByAccount,
        primaryItemIdByAccount: state.primaryItemIdByAccount,
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncAccount();
      },
    }
  )
);
