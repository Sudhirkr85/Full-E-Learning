import { create } from "zustand";
import { Product } from "@prisma/client";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
  productId: string;
}

interface CartStore {
  cartItems: CartItem[];
  isDrawerOpen: boolean;
  cartCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  initializeCart: () => void;
  validateAndCleanCart: () => Promise<string[]>;
}

const calculateCartCount = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  isDrawerOpen: false,
  cartCount: 0,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  initializeCart: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("el_store_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            productId: item.productId || item.product?.id,
          }));
          set({ cartItems: normalized, cartCount: calculateCartCount(normalized) });
        }
      }
    } catch (e) {
      console.error("Failed to initialize cart from localStorage", e);
    }
  },

  addToCart: (product: Product) => {
    const { cartItems } = get();
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    let newItems = [...cartItems];

    if (existingIndex > -1) {
      newItems[existingIndex].quantity += 1;
    } else {
      newItems.push({
        product,
        quantity: 1,
        productId: product.id,
      });
    }

    set({ cartItems: newItems, cartCount: calculateCartCount(newItems) });
    localStorage.setItem("el_store_cart", JSON.stringify(newItems));
    toast.success("Item added to cart.", { duration: 2000 });
    window.dispatchEvent(new Event("cart-updated"));
  },

  removeFromCart: (productId: string) => {
    const { cartItems } = get();
    const newItems = cartItems.filter((item) => item.productId !== productId);
    set({ cartItems: newItems, cartCount: calculateCartCount(newItems) });
    localStorage.setItem("el_store_cart", JSON.stringify(newItems));
    toast.info("Item removed from cart.", { duration: 2000 });
    window.dispatchEvent(new Event("cart-updated"));
  },

  updateQuantity: (productId: string, delta: number) => {
    const { cartItems } = get();
    const existingIndex = cartItems.findIndex((item) => item.productId === productId);
    if (existingIndex > -1) {
      const newItems = [...cartItems];
      const newQty = newItems[existingIndex].quantity + delta;

      if (newQty <= 0) {
        newItems.splice(existingIndex, 1);
        toast.info("Item removed from cart.", { duration: 2000 });
      } else {
        newItems[existingIndex].quantity = newQty;
      }

      set({ cartItems: newItems, cartCount: calculateCartCount(newItems) });
      localStorage.setItem("el_store_cart", JSON.stringify(newItems));
      window.dispatchEvent(new Event("cart-updated"));
    }
  },

  clearCart: () => {
    set({ cartItems: [], cartCount: 0 });
    localStorage.removeItem("el_store_cart");
    window.dispatchEvent(new Event("cart-updated"));
  },

  validateAndCleanCart: async () => {
    const { cartItems, removeFromCart } = get();
    const removedNames: string[] = [];

    for (const item of cartItems) {
      try {
        const res = await fetch(`/api/store/products/${item.productId}`);
        if (!res.ok) {
          removeFromCart(item.productId);
          removedNames.push(item.product?.title || "An item");
        }
      } catch (e) {
        removeFromCart(item.productId);
        removedNames.push(item.product?.title || "An item");
      }
    }

    return removedNames;
  },
}));
