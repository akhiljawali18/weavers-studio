import type { CartItem } from "./cartStore";

/**
 * The main site's cart endpoint. "add to cart" and "buy tickets" both send their
 * tickets here, and the main site's cart keeps them; it looks prices up itself
 * from the event and ticket type, so none are sent.
 * TODO: set the real endpoint (and adjust the method / body below to match it).
 */
export const MAIN_CART_ENDPOINT = "";

/**
 * Where "buy tickets" takes the visitor once the tickets are sent: the main
 * site's cart, where payment and login are handled.
 * TODO: set the real URL.
 */
export const MAIN_CART_PAGE_URL = "#";

/**
 * Sends tickets to the main site's cart: one item from "buy tickets" or "add to
 * cart" on an event page. Resolves when the main site has them; rejects if the
 * request fails, so the button can say so.
 */
export const sendToMainCart = async (items: CartItem[]) => {
  if (!MAIN_CART_ENDPOINT) {
    // No endpoint yet: show what would be sent, so the flow can be checked meanwhile.
    console.info("[main cart] endpoint not set; would send:", items);
    return;
  }

  const response = await fetch(MAIN_CART_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    throw new Error(`Main cart request failed: ${response.status}`);
  }
};
