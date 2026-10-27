"use client";

import { useEffect, useId } from "react";
import Image from "next/image";
import { S2S_ASSETS } from "../data/home";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const button =
  "h-[35px] w-[130px] rounded-[4px] text-[15px] font-medium lowercase transition-colors duration-200 "
  + "focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-2";

/**
 * A small "are you sure?" dialog in the microsite's style: the maroon flourish
 * from the event page over a Bodoni question, with cancel and confirm buttons.
 * Escape or a click on the dimmed page cancels, and the page behind stays still.
 */
const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[400px] rounded-[4px] bg-white px-6 pb-8 pt-6 text-center shadow-PDPOverlay animate-in zoom-in-95 duration-200"
      >
        {/* The JPEG has a white ground, which multiplying drops. */}
        <Image
          src={`${S2S_ASSETS}/prog-decor-1.jpg`}
          alt=""
          aria-hidden
          width={118}
          height={69}
          unoptimized
          className="mx-auto mix-blend-multiply"
        />
        <h2 id={titleId} className="mt-4 font-Bodoni text-[26px] leading-[34px] text-s2s-maroon">
          {title}
        </h2>
        <p id={messageId} className="mt-2 text-[15px] leading-[24px] text-s2s-ink">
          {message}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          {/* Cancel takes focus first, so Enter never empties anything by accident. */}
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className={`${button} border border-s2s-maroon bg-white text-s2s-maroon hover:bg-s2s-mist`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${button} bg-s2s-maroon text-white hover:bg-[#4d0f14]`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
