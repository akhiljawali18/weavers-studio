"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ConfirmModal from "../components/ConfirmModal";
import ImageSlot from "../components/home/ImageSlot";
import { bodyText, displayTitle } from "../components/home/typography";
import { TrashIcon } from "../components/icons";
import {
  checkout,
  clearCart,
  MAX_TICKETS,
  removeFromCart,
  setCartQuantity,
} from "../cart/cartStore";
import type { CartItem } from "../cart/cartStore";
import { findProgrammeItem, findTicketOption } from "../data/programme";
import { useCart } from "../hooks/useCart";

const rupees = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const smallCaps =
  "text-[14px] font-medium uppercase leading-[17px] tracking-[1.68px] text-s2s-ink";

// The same hairline minus and plus as the event page's ticket picker.
const stepButton =
  "relative flex h-[24px] items-center justify-center rounded-sm text-s2s-ink " +
  "transition-colors hover:text-s2s-maroon disabled:cursor-default disabled:hover:text-s2s-ink " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon";

// False while the server renders and the page hydrates, so the cart (which only the
// browser knows) does not flash "empty" before it is read.
const noop = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

/** The price of one ticket, looked up from the programme for display; never stored. */
const unitPrice = (item: CartItem) => {
  const event = findProgrammeItem(item.eventId);
  return event ? findTicketOption(event, item.ticketType) : undefined;
};

const CartRow = ({ item }: { item: CartItem }) => {
  const option = unitPrice(item);
  const lineLabel = `${item.eventName}${option?.note ? `, ${option.note}` : ""}`;
  // The listing card's photograph, falling back to the event page's; looked up, not stored.
  const event = findProgrammeItem(item.eventId);
  const eventHref = `/microsite/programme/${item.eventId}`;

  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-4 border-b border-s2s-line py-6 lg:grid-cols-[1fr_140px_auto_140px_32px] lg:items-center">
      <div className="col-span-2 flex items-start gap-4 lg:col-span-1 lg:items-center lg:gap-6">
        {/* The title beside it is the row's link for screen readers, so this one is skipped. */}
        <Link href={eventHref} tabIndex={-1} aria-hidden className="shrink-0">
          <ImageSlot
            src={event?.cardImage ?? event?.image}
            alt=""
            sizes="96px"
            className="aspect-[3/4] w-[72px] lg:w-[96px]"
          />
        </Link>
        <div>
          <Link
            href={eventHref}
            className="font-Bodoni text-[22px] leading-[30px] text-s2s-maroon hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
          >
            {item.eventName}
          </Link>
          {option?.note && (
            <p className="mt-1 text-[14px] leading-[22px] text-s2s-ink">
              {option.note}
            </p>
          )}
        </div>
      </div>

      <p className="hidden text-[14px] tracking-[1.68px] text-s2s-ink lg:block">
        {option ? `₹ ${rupees.format(option.amount)}` : "—"}
      </p>

      <div
        role="group"
        aria-label={`Number of tickets for ${lineLabel}`}
        className="flex items-center gap-[14px]"
      >
        <button
          type="button"
          onClick={() => setCartQuantity(item, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="One ticket fewer"
          className={`${stepButton} w-[15px]`}
        >
          <span aria-hidden className="h-px w-[15px] bg-current" />
        </button>
        <output
          aria-live="polite"
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-s2s-maroon text-[14px] leading-none text-s2s-maroon"
        >
          {item.quantity}
        </output>
        <button
          type="button"
          onClick={() => setCartQuantity(item, item.quantity + 1)}
          disabled={item.quantity >= MAX_TICKETS}
          aria-label="One ticket more"
          className={`${stepButton} w-[14px]`}
        >
          <span aria-hidden className="absolute h-px w-[14px] bg-current" />
          <span aria-hidden className="absolute h-[14px] w-px bg-current" />
        </button>
      </div>

      <p className="self-center text-right text-[14px] font-bold tracking-[1.68px] text-s2s-maroon">
        {option ? `₹ ${rupees.format(option.amount * item.quantity)}` : "—"}
      </p>

      <button
        type="button"
        onClick={() => removeFromCart(item)}
        aria-label={`Remove ${lineLabel} from the cart`}
        className="col-span-2 flex w-fit items-center gap-2 rounded-sm text-[14px] lowercase text-s2s-ink transition-colors hover:text-s2s-maroon focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon lg:col-span-1 lg:justify-self-end"
      >
        <TrashIcon className="h-[18px] w-[18px]" />
        <span className="lg:sr-only">remove</span>
      </button>
    </li>
  );
};

/**
 * The guest's cart: each event and ticket type on its own row, with its count, its
 * removal, and a total over the "buy all tickets" button. Prices shown here come
 * from the programme, not from the cart in localStorage.
 */
const CartPage = () => {
  const cart = useCart();
  const hydrated = useHydrated();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const closeConfirm = useCallback(() => setConfirmingClear(false), []);
  const total = cart.reduce(
    (sum, item) => sum + (unitPrice(item)?.amount ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="relative mx-auto w-full px-5 pb-20 pt-8 lg:px-[60px] lg:pb-[120px] lg:pt-[79px]">
      <h1 className={displayTitle}>
        <span className="italic">Your </span>cart
      </h1>

      {!hydrated ? null : cart.length === 0 ? (
        <div className={`mt-8 ${bodyText}`}>
          <p>Your cart is empty.</p>
          <Link
            href="/microsite/programme"
            className="mt-4 inline-block font-bold hover:text-s2s-maroon focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
          >
            Browse the programme
          </Link>
        </div>
      ) : (
        <>
          <div
            aria-hidden
            className={`mt-10 hidden grid-cols-[1fr_140px_auto_140px_32px] gap-x-6 border-b border-s2s-line pb-4 lg:grid ${smallCaps}`}
          >
            <span>Event</span>
            <span>Price</span>
            <span className="w-[93px]">Tickets</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          <ul className="mt-6 border-t border-s2s-line lg:mt-0 lg:border-t-0">
            {cart.map((item) => (
              <CartRow key={`${item.eventId}:${item.ticketType}`} item={item} />
            ))}
          </ul>

          <div className="mt-8 flex flex-col-reverse lg:items-end items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Asks first, since emptying the cart cannot be undone. */}
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className="flex h-[35px] w-[250px] max-w-full items-center justify-center gap-2 rounded-[4px] border border-s2s-maroon bg-white text-[15px] font-medium lowercase text-s2s-maroon transition-colors duration-200 hover:bg-s2s-maroon hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2 sm:w-[160px]"
            >
              <TrashIcon className="h-[16px] w-[16px]" />
              clear cart
            </button>
            <div className="flex flex-col lg:items-end items-center gap-6">
              <p className={smallCaps}>
                Total{" "}
                <span className="ml-4 font-bold text-s2s-maroon">
                  ₹ {rupees.format(total)}
                </span>
              </p>
              <button
                type="button"
                onClick={() => checkout(cart)}
                className="h-[35px] w-[250px] max-w-full rounded-[4px] bg-s2s-maroon text-[15px] font-medium lowercase text-white transition-colors duration-200 hover:bg-[#4d0f14] focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2"
              >
                buy all tickets
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        open={confirmingClear}
        title="Clear your cart?"
        message="All tickets will be removed from your cart."
        confirmLabel="clear cart"
        onConfirm={() => {
          clearCart();
          setConfirmingClear(false);
        }}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default CartPage;
