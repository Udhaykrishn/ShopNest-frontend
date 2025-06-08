import { create } from "zustand";
import { persist } from "zustand/middleware";

type CouponProps = {
  _id: string;
  name: string;
  min_price: number;
  offerPrice: number;
  expireOn: string;
};

type CouponStore = {
  coupon: CouponProps | null;
  setCoupon: (coupon: CouponProps) => void;
  clearCoupon: () => void;
};

export const useCouponStore = create<CouponStore>()(
  persist(
    (set) => ({
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
    }),
    {
      name: "coupon-storage",
    }
  )
);
