"use client";

import { useState } from "react";

const MAX_TICKETS = 10;

const stepButton =
  "flex h-[24px] w-[17px] items-center justify-center rounded-sm text-[28px] font-normal leading-none text-s2s-ink "
  + "transition-colors hover:text-s2s-maroon disabled:cursor-default disabled:hover:text-s2s-ink "
  + "focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon";

/**
 * Ticket count and the "buy tickets" button. Booking is not wired up yet, so the
 * button only carries its looks and hover state for now.
 */
const TicketPicker = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-y-4">
      <div role="group" aria-label="Number of tickets" className="flex items-center gap-[14px]">
        <button
          type="button"
          onClick={() => setQuantity((count) => Math.max(1, count - 1))}
          disabled={quantity <= 1}
          aria-label="One ticket fewer"
          className={stepButton}
        >
          −
        </button>
        <output
          aria-live="polite"
          className="flex h-[31px] w-[31px] items-center justify-center rounded-full border border-s2s-maroon text-[14px] leading-none text-s2s-maroon"
        >
          {quantity}
        </output>
        <button
          type="button"
          onClick={() => setQuantity((count) => Math.min(MAX_TICKETS, count + 1))}
          disabled={quantity >= MAX_TICKETS}
          aria-label="One ticket more"
          className={stepButton}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="ml-8 h-[35px] w-[249px] max-w-full rounded-[3px] bg-s2s-maroon text-[14px] lowercase text-white transition-colors duration-200 hover:bg-[#4d0f14] focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2"
      >
        buy tickets
      </button>
    </div>
  );
};

export default TicketPicker;
