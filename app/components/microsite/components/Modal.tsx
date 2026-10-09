"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

type ModalProps = {
    title: string;
    /** Ignored while a request is in flight, so a save cannot be abandoned midway. */
    onClose: () => void;
    /** Suppresses Escape, the backdrop and the close button together. */
    busy?: boolean;
    footer?: ReactNode;
    children: ReactNode;
    size?: "md" | "lg";
};

const widths = {
    md: "max-w-[520px]",
    lg: "max-w-[720px]"
};

/**
 * Dialog shell: backdrop, panel, heading and close button. It owns no content of
 * its own, so both the product form and the delete confirmation can sit inside it.
 *
 * It renders into document.body through a portal, so the panel is never clipped or
 * re-positioned by an ancestor's overflow or stacking context.
 */
const Modal = ({ title, onClose, busy, footer, children, size = "md" }: ModalProps) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // document does not exist during the server render, so the portal waits for
    // the first client effect before it has a target.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Painted once in the closed state, then transitioned to open on the next frame.
    // Setting both in the same frame would skip the animation entirely.
    const [shown, setShown] = useState(false);
    useEffect(() => {
        if (!mounted) {
            return;
        }
        const frame = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(frame);
    }, [mounted]);

    // Escape closes, and the page behind stops scrolling while the dialog is up.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !busy) {
                onClose();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [busy, onClose]);

    // Focus moves into the dialog on open, and back to whatever opened it on close,
    // so keyboard focus never ends up stranded behind the backdrop.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;

        const firstControl = panelRef.current?.querySelector<HTMLElement>(
            "input, textarea, select, button:not([data-modal-close])"
        );
        (firstControl || panelRef.current)?.focus();

        return () => opener?.focus?.();
    }, []);

    if (!mounted) {
        return null;
    }

    return createPortal(
        <div
            className={[
                "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8",
                "bg-slate-900/40 backdrop-blur-[2px]",
                "transition-opacity duration-200 ease-out motion-reduce:transition-none",
                shown ? "opacity-100" : "opacity-0"
            ].join(" ")}
        >
            {/* The backdrop is a sibling, not a parent, so a click inside the panel
                never bubbles out to it and closes the dialog by accident. */}
            <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                disabled={busy}
                onClick={onClose}
                className="fixed inset-0 h-full w-full cursor-default disabled:cursor-not-allowed"
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="microsite-modal-title"
                tabIndex={-1}
                className={[
                    "relative z-10 w-full rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 outline-none",
                    "transition-all duration-200 ease-out motion-reduce:transition-none",
                    shown ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-[0.98]",
                    widths[size]
                ].join(" ")}
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <h2 id="microsite-modal-title" className="text-[17px] font-semibold text-slate-900">
                        {title}
                    </h2>
                    <button
                        type="button"
                        data-modal-close
                        aria-label="Close dialog"
                        disabled={busy}
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
                                   disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-5 py-4">{children}</div>

                {footer && (
                    <div className="flex flex-wrap items-center justify-end gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50/60 px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
