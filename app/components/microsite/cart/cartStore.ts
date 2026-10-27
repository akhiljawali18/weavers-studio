/**
 * The guest's ticket cart, kept in localStorage so it survives reloads without an
 * account. Prices are never stored: the payment page looks them up itself from the
 * event and ticket type, so editing localStorage cannot change what is charged.
 */

export type CartItem = {
  /** The event's slug, e.g. "event-2". */
  eventId: string;
  /** "standard" for single-price events, otherwise the chosen option, e.g. "twin-sharing". */
  ticketType: string;
  quantity: number;
  eventName: string;
};

/** The most tickets of one event and ticket type, in the picker and in the cart. */
export const MAX_TICKETS = 10;

/** Where the cart lives between visits. */
const CART_KEY = "s2s-cart";
/** The list handed to the payment page: one item for "buy tickets", the cart for "buy all tickets". */
const CHECKOUT_KEY = "s2s-checkout";

/**
 * The payment page the buy buttons go to once the list is saved.
 * TODO: replace with the real payment URL.
 */
export const PAYMENT_URL = "#";

// Fired on every write, so each component showing the cart (the header's count,
// the cart page) updates in this tab; the `storage` event covers other tabs.
const CHANGE_EVENT = "s2s-cart-change";
/** Fired only by "add to cart", so the header's icon can pulse to show the tickets went in. */
export const CART_ADDED_EVENT = "s2s-cart-added";

const sameLine = (a: CartItem, b: Pick<CartItem, "eventId" | "ticketType">) =>
  a.eventId === b.eventId && a.ticketType === b.ticketType;

const clamp = (quantity: number) => Math.min(MAX_TICKETS, Math.max(1, Math.floor(quantity)));

/** Keeps only well-formed rows, since localStorage can hold anything. */
const parse = (raw: string | null): CartItem[] => {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is CartItem =>
        typeof item?.eventId === "string"
        && typeof item?.ticketType === "string"
        && typeof item?.eventName === "string"
        && Number.isFinite(item?.quantity)
        && item.quantity >= 1,
    );
  } catch {
    return [];
  }
};

const readRaw = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, items: CartItem[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage is blocked (private mode, full quota); the cart simply does not persist.
  }
};

const saveCart = (items: CartItem[]) => {
  write(CART_KEY, items);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// useSyncExternalStore needs the same array back while nothing has changed, so the
// parsed cart is cached against the raw string it came from.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];
const EMPTY: CartItem[] = [];

export const getCart = (): CartItem[] => {
  const raw = readRaw(CART_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parse(raw);
  }
  return cachedItems;
};

/** The server has no localStorage, so it always renders an empty cart. */
export const getServerCart = (): CartItem[] => EMPTY;

export const subscribeToCart = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_KEY || event.key === null) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

/** Adds tickets; the same event and ticket type adds to its existing quantity. */
export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const existing = cart.find((line) => sameLine(line, item));
  saveCart(
    existing
      ? cart.map((line) => (line === existing ? { ...line, quantity: clamp(line.quantity + item.quantity) } : line))
      : [...cart, { ...item, quantity: clamp(item.quantity) }],
  );
  window.dispatchEvent(new Event(CART_ADDED_EVENT));
};

export const setCartQuantity = (line: Pick<CartItem, "eventId" | "ticketType">, quantity: number) => {
  saveCart(getCart().map((item) => (sameLine(item, line) ? { ...item, quantity: clamp(quantity) } : item)));
};

export const removeFromCart = (line: Pick<CartItem, "eventId" | "ticketType">) => {
  saveCart(getCart().filter((item) => !sameLine(item, line)));
};

export const clearCart = () => {
  saveCart([]);
};

/** Saves the list for the payment page and goes there. The cart itself is left as it is. */
export const checkout = (items: CartItem[]) => {
  if (items.length === 0) return;
  write(CHECKOUT_KEY, items);
  window.location.assign(PAYMENT_URL);
};

/** What the payment page reads: the list saved by the last "buy" click. */
export const getCheckoutItems = (): CartItem[] => parse(readRaw(CHECKOUT_KEY));
