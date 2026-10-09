"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

/** The backend caps size at 100 regardless of what is asked for. */
export const PAGE_SIZES = [10, 20, 50, 100];

type PaginationProps = {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    /** Straight from the response envelope, not computed locally. */
    first: boolean;
    last: boolean;
    disabled?: boolean;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
};

const buttonClass =
    "inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 "
    + "text-[13px] text-slate-700 hover:bg-slate-50 "
    + "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

/**
 * Shared by both tables.
 *
 * Whether a button is disabled comes from `first` and `last` in the response rather
 * than from comparing page numbers here, so the controls reflect what the server
 * actually returned.
 */
const Pagination = ({
    page,
    size,
    totalElements,
    totalPages,
    first,
    last,
    disabled,
    onPageChange,
    onSizeChange
}: PaginationProps) => {
    // `page` is zero-based on the wire; it is shown one-based.
    const humanPage = totalPages === 0 ? 0 : page + 1;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <p className="text-[13px] text-slate-600" aria-live="polite">
                {totalElements === 0
                    ? "No records"
                    : `Page ${humanPage} of ${totalPages} · ${totalElements} record${totalElements === 1 ? "" : "s"}`}
            </p>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-[13px] text-slate-600">
                    <span>Per page</span>
                    <select
                        value={size}
                        disabled={disabled}
                        onChange={(event) => onSizeChange(Number(event.target.value))}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[13px] text-slate-900
                                   focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200
                                   disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {PAGE_SIZES.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className={buttonClass}
                        disabled={disabled || first || totalPages === 0}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeftIcon />
                        Previous
                    </button>
                    <button
                        type="button"
                        className={buttonClass}
                        disabled={disabled || last || totalPages === 0}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
