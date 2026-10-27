"use client";

import { useSyncExternalStore } from "react";
import { getCart, getServerCart, subscribeToCart } from "../cart/cartStore";

/** The cart, kept up to date across every component and tab that shows it. */
export const useCart = () => useSyncExternalStore(subscribeToCart, getCart, getServerCart);

/** How many tickets the cart holds in all, for the header's count. */
export const useCartCount = () =>
  useCart().reduce((total, item) => total + item.quantity, 0);
