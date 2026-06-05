import { create } from "zustand";

interface ProductWishlistStore {
  wishlistedIds: string[];
  count: number;
  isLoading: boolean;
  initWishlist: (ids: string[]) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useProductWishlistStore = create<ProductWishlistStore>((set, get) => ({
  wishlistedIds: [],
  count: 0,
  isLoading: false,

  initWishlist: (ids: string[]) => {
    set({
      wishlistedIds: ids,
      count: ids.length,
      isLoading: false
    });
  },

  addToWishlist: (productId: string) => {
    const { wishlistedIds } = get();
    if (!wishlistedIds.includes(productId)) {
      const nextIds = [...wishlistedIds, productId];
      set({
        wishlistedIds: nextIds,
        count: nextIds.length
      });
    }
  },

  removeFromWishlist: (productId: string) => {
    const { wishlistedIds } = get();
    if (wishlistedIds.includes(productId)) {
      const nextIds = wishlistedIds.filter(id => id !== productId);
      set({
        wishlistedIds: nextIds,
        count: nextIds.length
      });
    }
  },

  toggleWishlist: (productId: string) => {
    const { wishlistedIds } = get();
    const isSaved = wishlistedIds.includes(productId);
    if (isSaved) {
      get().removeFromWishlist(productId);
    } else {
      get().addToWishlist(productId);
    }
  },

  isWishlisted: (productId: string) => {
    return get().wishlistedIds.includes(productId);
  }
}));
