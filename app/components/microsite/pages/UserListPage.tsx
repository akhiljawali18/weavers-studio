"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError } from "../api/client";
import { listUsers } from "../api/users";
import type { PageResponse, User } from "../api/types";
import Feedback from "../components/Feedback";
import { primaryButton } from "../components/buttons";
import { InboxIcon } from "../components/icons";
import Pagination from "../components/Pagination";
import { formatDate } from "../utils/format";

/**
 * Only the properties the backend allows. Anything else comes back as a 400 from
 * SortValidator, so the control is a fixed list rather than a free text field.
 */
const SORT_OPTIONS = [
    { value: "createdAt,desc", label: "Newest first" },
    { value: "createdAt,asc", label: "Oldest first" },
    { value: "fullName,asc", label: "Name A-Z" },
    { value: "fullName,desc", label: "Name Z-A" },
    { value: "email,asc", label: "Email A-Z" },
    { value: "email,desc", label: "Email Z-A" }
];

/** Placeholder rows shown on first load. */
const SKELETON_ROWS = [0, 1, 2, 3, 4];
const SKELETON_CELLS = [0, 1, 2, 3];

const UserListPage = () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const [data, setData] = useState<PageResponse<User> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        listUsers({ page, size, sort }, controller.signal)
            .then((response) => {
                setData(response);
                setError(null);
            })
            .catch((error: any) => {
                // An abort is a caller decision, not a failure to report.
                if (error?.name === "AbortError") {
                    return;
                }
                setError(error instanceof ApiError ? error.message : "Could not load users.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [page, size, sort]);

    const rows = data ? data.content : [];

    return (
        <section className="mx-auto w-full max-w-[1120px] px-5 py-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-[30px] leading-[38px] text-slate-900">Registered users</h1>
                    {/* Read only on purpose: the backend has no user update or delete. */}
                    <p className="mt-1 text-[14px] text-slate-600">
                        Read only. Registration is the only write operation this module has.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-[13px] text-slate-600">
                        <span>Sort</span>
                        <select
                            value={sort}
                            disabled={loading}
                            onChange={(event) => {
                                // A different order makes the current page number
                                // meaningless, so the list restarts from the top.
                                setSort(event.target.value);
                                setPage(0);
                            }}
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[13px] text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Link
                        href="/microsite/register"
                        className={primaryButton}
                    >
                        Register a user
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-4">
                    <Feedback tone="error">{error}</Feedback>
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[12px] uppercase tracking-wide text-slate-500">
                                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                                <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                                <th scope="col" className="px-4 py-3 font-medium">Registered</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                            {/* Skeleton rows keep the table's height while the page
                                loads, so nothing below it jumps when data lands. */}
                            {loading && rows.length === 0 && SKELETON_ROWS.map((row) => (
                                <tr key={row} aria-hidden="true">
                                    {SKELETON_CELLS.map((cell) => (
                                        <td key={cell} className="px-4 py-3.5">
                                            <span className="block h-3 animate-pulse rounded bg-slate-100" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {!loading && rows.length === 0 && !error && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-14">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <span className="text-slate-300">
                                                <InboxIcon className="h-9 w-9" />
                                            </span>
                                            <div>
                                                <p className="text-[15px] text-slate-700">No users registered yet</p>
                                                <p className="mt-0.5 text-[13px] text-slate-500">
                                                    Anyone who registers will appear here.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {rows.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-4 py-3 text-slate-900">{user.fullName}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3 tabular-nums">{user.phoneNumber}</td>
                                    <td className="px-4 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={data ? data.page : page}
                    size={data ? data.size : size}
                    totalElements={data ? data.totalElements : 0}
                    totalPages={data ? data.totalPages : 0}
                    first={data ? data.first : true}
                    last={data ? data.last : true}
                    disabled={loading}
                    onPageChange={setPage}
                    onSizeChange={(next) => {
                        setSize(next);
                        setPage(0);
                    }}
                />
            </div>
        </section>
    );
};

export default UserListPage;
