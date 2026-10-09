import type { ReactNode } from "react";

type FieldProps = {
    label: string;
    /** Must match the id of the control passed as `children`. */
    htmlFor: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
};

/**
 * Label, control and error message as one unit.
 *
 * The control is passed in rather than rendered here, because the three forms use
 * inputs, a textarea, a select and a file picker - wrapping each of those would
 * mean four near-identical components.
 *
 * The error and hint ids are stable and derived from `htmlFor`, so a control can
 * point `aria-describedby` at them.
 */
const Field = ({ label, htmlFor, error, hint, required, children }: FieldProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={htmlFor} className="text-[13px] font-medium text-slate-700">
                {label}
                {required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
            </label>

            {children}

            {hint && !error && (
                <p id={`${htmlFor}-hint`} className="text-[12px] leading-[16px] text-slate-500">
                    {hint}
                </p>
            )}

            {error && (
                <p id={`${htmlFor}-error`} className="text-[12px] leading-[16px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

/** Shared input styling, so every control on every form looks the same. */
export const inputClass = (hasError?: boolean) =>
    [
        "w-full rounded-md border px-3 py-2 text-[14px] text-slate-900",
        "placeholder:text-slate-400",
        // Colour and shadow only, so the control never changes size on focus and
        // the row it sits in cannot shift by a pixel.
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
        hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
    ].join(" ");

/** Points a control at whichever message is currently rendered above. */
export const describedBy = (htmlFor: string, error?: string, hint?: string) => {
    if (error) {
        return `${htmlFor}-error`;
    }
    if (hint) {
        return `${htmlFor}-hint`;
    }
    return undefined;
};

export default Field;
