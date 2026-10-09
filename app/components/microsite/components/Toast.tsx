"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircleIcon, CloseIcon, InfoCircleIcon, WarningCircleIcon } from "./icons";

/**
 * Transient confirmations for things that changed on the server.
 *
 * <p>The split with {@link Feedback} is deliberate and worth keeping. A banner is
 * page state - "this list could not load" belongs next to the empty list and should
 * stay there until it is no longer true. A toast is an event - "product deleted"
 * describes something that already finished, and pinning it to the page means the
 * next person to look at the screen reads a stale sentence about an action they did
 * not take.
 *
 * <p>So: every POST, PUT and DELETE reports through here. Loading a page does not.
 */

export type ToastTone = "success" | "error" | "info";

type Toast = {
    id: number;
    tone: ToastTone;
    message: string;
    /** Drives the enter and exit transitions; see the mount comment below. */
    leaving: boolean;
};

type ToastApi = {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
};

/**
 * Errors stay up roughly twice as long. A confirmation is glanceable and its content
 * is already known - the person just clicked the button. A failure is unexpected and
 * has to be read, and re-reading it is not possible once it is gone.
 */
const DURATION_MS: Record<ToastTone, number> = {
    success: 4000,
    info: 5000,
    error: 8000
};

/** Matches the CSS transition below, so the node is removed only once it is invisible. */
const EXIT_MS = 200;

/** Older toasts drop off the top rather than filling the screen during a bulk edit. */
const MAX_VISIBLE = 3;

const ToastContext = createContext<ToastApi | null>(null);

/**
 * The hook every page uses.
 *
 * <p>It throws rather than returning a no-op when the provider is missing. A silent
 * fallback would mean a page that looks fine in review and simply never confirms
 * anything at runtime - the loudest possible failure is the cheapest one here.
 */
export function useToast(): ToastApi {
    const api = useContext(ToastContext);
    if (!api) {
        throw new Error("useToast must be used inside <ToastProvider>. It is mounted in MicrositeLayout.");
    }
    return api;
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(1);

    // Every pending timer, so unmounting cannot leave one running that would then
    // call setState on a component that is gone.
    const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    useEffect(() => {
        const pending = timers.current;
        return () => {
            pending.forEach((timer) => clearTimeout(timer));
            pending.clear();
        };
    }, []);

    const remove = useCallback((id: number) => {
        // Marked as leaving first so the exit transition can run, then dropped.
        setToasts((current) => current.map((toast) =>
            toast.id === id ? { ...toast, leaving: true } : toast));

        const timer = setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
            timers.current.delete(id);
        }, EXIT_MS);

        timers.current.set(id, timer);
    }, []);

    const push = useCallback((tone: ToastTone, message: string) => {
        const id = nextId.current++;

        setToasts((current) => {
            const next = [...current, { id, tone, message, leaving: false }];
            return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
        });

        const timer = setTimeout(() => remove(id), DURATION_MS[tone]);
        timers.current.set(id, timer);
    }, [remove]);

    // Memoised so that consuming a toast function does not re-render every page on
    // each state change here.
    const api = useMemo<ToastApi>(() => ({
        success: (message: string) => push("success", message),
        error: (message: string) => push("error", message),
        info: (message: string) => push("info", message)
    }), [push]);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={remove} />
        </ToastContext.Provider>
    );
};

const toneStyles: Record<ToastTone, { panel: string; icon: string; Icon: typeof CheckCircleIcon }> = {
    success: {
        panel: "border-emerald-200 bg-white",
        icon: "text-emerald-600",
        Icon: CheckCircleIcon
    },
    error: {
        panel: "border-red-200 bg-white",
        icon: "text-red-600",
        Icon: WarningCircleIcon
    },
    info: {
        panel: "border-sky-200 bg-white",
        icon: "text-sky-600",
        Icon: InfoCircleIcon
    }
};

const ToastViewport = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => {
    // document does not exist during the server render, so the portal waits for the
    // first client effect before it has a target.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    return createPortal(
        <div
            // Fixed and pointer-events-none so the stack never blocks a click on the
            // page behind it; the toasts themselves take pointer events back.
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        >
            {toasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>,
        document.body
    );
};

const ToastCard = ({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) => {
    const { panel, icon, Icon } = toneStyles[toast.tone];

    // Mounted on the next frame rather than immediately, so the browser paints the
    // off-screen state once and then transitions to the visible one. Setting both in
    // the same frame would skip the animation entirely.
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const visible = shown && !toast.leaving;

    return (
        <div
            // An error interrupts; a confirmation waits for a pause. Matching what
            // Feedback does, for the same reason.
            role={toast.tone === "error" ? "alert" : "status"}
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
            className={[
                "pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-lg border px-4 py-3",
                "shadow-lg shadow-slate-900/5",
                "transition-all duration-200 ease-out motion-reduce:transition-none",
                visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-[0.98]",
                panel
            ].join(" ")}
        >
            <span className={`mt-0.5 shrink-0 ${icon}`}>
                <Icon />
            </span>

            <p className="flex-1 text-[14px] leading-[20px] text-slate-800">{toast.message}</p>

            <button
                type="button"
                aria-label="Dismiss"
                onClick={() => onDismiss(toast.id)}
                className="-mr-1 mt-0.5 shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-100
                           hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
                <CloseIcon className="h-3.5 w-3.5" />
            </button>
        </div>
    );
};
