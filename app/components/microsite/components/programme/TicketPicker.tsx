"use client";

import { useEffect, useId, useState } from "react";
import { addToCart, checkout, MAX_TICKETS } from "../../cart/cartStore";
import type { CartItem } from "../../cart/cartStore";
import { STANDARD_TICKET_TYPE } from "../../data/programme";

const rupees = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type PriceOption = { amount: number; note: string; ticketType: string };

type TicketPickerProps = {
  /** The event's slug, saved with the tickets as their `eventId`. */
  eventId: string;
  eventName: string;
  /** When an event can be booked more than one way, each option is a radio the
      visitor must choose from before the buttons let them through. */
  prices?: PriceOption[];
};

/** How long "add to cart" reads "added to cart" after a click. */
const ADDED_MS = 2000;

// The minus and plus are hairline strokes in the design, drawn here in the
// button's text colour so they turn maroon on hover with it.
const stepButton =
  "relative flex h-[24px] items-center justify-center rounded-sm text-s2s-ink "
  + "transition-colors hover:text-s2s-maroon disabled:cursor-default disabled:hover:text-s2s-ink "
  + "focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon";

const actionButton =
  "h-[35px] max-w-full rounded-[4px] text-[15px] font-medium lowercase transition-colors duration-200 "
  + "focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2 disabled:cursor-not-allowed";

/**
 * The booking-option radios (for events with more than one price), the ticket
 * count, and the two buttons: "buy tickets" saves just this event as the booking
 * list and goes to payment; "add to cart" keeps it in the cart to buy with others.
 * Both stay disabled until an option is chosen.
 */
const TicketPicker = ({ eventId, eventName, prices }: TicketPickerProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const name = useId();

  const needsChoice = Boolean(prices && prices.length > 0);
  const canBuy = !needsChoice || selected !== null;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), ADDED_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  const chosenItem = (): CartItem | null => {
    if (!canBuy) return null;
    const ticketType = needsChoice ? prices![selected!].ticketType : STANDARD_TICKET_TYPE;
    return { eventId, ticketType, quantity, eventName };
  };

  const onAddToCart = () => {
    const item = chosenItem();
    if (!item) return;
    addToCart(item);
    setAdded(true);
  };

  const onBuy = () => {
    const item = chosenItem();
    if (item) checkout([item]);
  };

  return (
    <div>
      {needsChoice && (
        <fieldset className="space-y-[12px]">
          <legend className="sr-only">Choose a booking option</legend>
          {prices!.map((option, index) => (
            <label
              key={option.ticketType}
              className="flex cursor-pointer items-start gap-3 text-[14px] leading-[24px] text-s2s-ink"
            >
              <input
                type="radio"
                name={name}
                checked={selected === index}
                onChange={() => setSelected(index)}
                // `accent-color` tints the native control the site's primary maroon.
                className="mt-[3px] h-[16px] w-[16px] shrink-0 accent-s2s-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2"
              />
              <span>
                <span className="font-bold tracking-[1.68px] text-s2s-maroon">
                  ₹ {rupees.format(option.amount)}
                </span>{" "}
                {option.note}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className={`flex flex-wrap items-center gap-y-4 ${needsChoice ? "mt-[24px]" : ""}`}>
        <div role="group" aria-label="Number of tickets" className="flex items-center gap-[14px]">
          <button
            type="button"
            onClick={() => setQuantity((count) => Math.max(1, count - 1))}
            disabled={quantity <= 1}
            aria-label="One ticket fewer"
            className={`${stepButton} w-[15px]`}
          >
            <span aria-hidden className="h-px w-[15px] bg-current" />
          </button>
          <output
            aria-live="polite"
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-s2s-maroon text-[14px] leading-none text-s2s-maroon"
          >
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((count) => Math.min(MAX_TICKETS, count + 1))}
            disabled={quantity >= MAX_TICKETS}
            aria-label="One ticket more"
            className={`${stepButton} w-[14px]`}
          >
            <span aria-hidden className="absolute h-px w-[14px] bg-current" />
            <span aria-hidden className="absolute h-[14px] w-px bg-current" />
          </button>
        </div>
        <div className="ml-[36px] flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBuy}
            disabled={!canBuy}
            aria-disabled={!canBuy}
            title={canBuy ? undefined : "Choose a booking option first"}
            className={`${actionButton} w-[250px] bg-s2s-maroon text-white hover:bg-[#4d0f14] disabled:bg-s2s-maroon/50 disabled:hover:bg-s2s-maroon/50`}
          >
            buy tickets
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!canBuy}
            aria-disabled={!canBuy}
            title={canBuy ? undefined : "Choose a booking option first"}
            className={`${actionButton} w-[160px] border border-s2s-maroon bg-white text-s2s-maroon hover:bg-s2s-maroon hover:text-white disabled:border-s2s-maroon/50 disabled:text-s2s-maroon/50 disabled:hover:bg-white disabled:hover:text-s2s-maroon/50`}
          >
            <span aria-live="polite">{added ? "added to cart" : "add to cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPicker;
