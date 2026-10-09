/**
 * Shared button styling.
 *
 * These were duplicated as literals across five files, which is how the focus ring
 * ended up on some controls and not others. Naming them means a change to how a
 * primary button looks is one edit, and every button gets the same keyboard
 * affordance whether or not whoever added it remembered.
 *
 * `focus-visible` rather than `focus`: a ring that appears on a mouse click is
 * noise, but one that never appears for a keyboard user is a barrier.
 */

const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-[14px] font-medium "
    + "transition-colors duration-150 "
    + "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 "
    + "disabled:cursor-not-allowed";

/** The one action a screen is about: save, sign in, create. */
export const primaryButton =
    `${base} bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 active:bg-sky-900 `
    + "focus-visible:ring-sky-500 disabled:opacity-60";

/** Cancel, back, and anything that leaves the current state alone. */
export const secondaryButton =
    `${base} border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 `
    + "active:bg-slate-100 focus-visible:ring-slate-400 disabled:opacity-50";

/** Irreversible. Red is the only colour that carries that on its own. */
export const dangerButton =
    `${base} bg-red-600 px-4 py-2 text-white hover:bg-red-700 active:bg-red-800 `
    + "focus-visible:ring-red-500 disabled:opacity-60";

/** Row-level actions in a table: smaller, quieter, still reachable by keyboard. */
export const iconButton =
    `${base} border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-700 `
    + "hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400 disabled:opacity-40";

/** The destructive variant of the above. */
export const iconButtonDanger =
    `${base} border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-red-700 `
    + "hover:border-red-200 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-400 disabled:opacity-40";
