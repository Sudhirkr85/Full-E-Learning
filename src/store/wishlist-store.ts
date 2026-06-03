import { create } from "zustand";

interface WishlistStore {
  wishlistedIds: string[];
  count: number;
  isLoading: boolean;
  initWishlist: (ids: string[]) => void;
  addToWishlist: (courseId: string) => void;
  removeFromWishlist: (courseId: string) => void;
  toggleWishlist: (courseId: string) => void;
  isWishlisted: (courseId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
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

  addToWishlist: (courseId: string) => {
    const { wishlistedIds } = get();
    if (!wishlistedIds.includes(courseId)) {
      const nextIds = [...wishlistedIds, courseId];
      set({
        wishlistedIds: nextIds,
        count: nextIds.length
      });
    }
  },

  removeFromWishlist: (courseId: string) => {
    const { wishlistedIds } = get();
    if (wishlistedIds.includes(courseId)) {
      const nextIds = wishlistedIds.filter(id => id !== courseId);
      set({
        wishlistedIds: nextIds,
        count: nextIds.length
      });
    }
  },

  toggleWishlist: (courseId: string) => {
    const { wishlistedIds } = get();
    const isSaved = wishlistedIds.includes(courseId);
    if (isSaved) {
      get().removeFromWishlist(courseId);
    } else {
      get().addToWishlist(courseId);
    }
  },

  isWishlisted: (courseId: string) => {
    return get().wishlistedIds.includes(courseId);
  }
}));
