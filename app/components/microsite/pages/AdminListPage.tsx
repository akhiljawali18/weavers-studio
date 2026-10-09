"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "../api/client";
import { listAdmins } from "../api/admins";
import { currentAdmin } from "../api/auth";
import type { Admin, PageResponse } from "../api/types";
import AdminFormModal from "../components/AdminFormModal";
import Feedback from "../components/Feedback";
import Pagination from "../components/Pagination";
import { useToast } from "../components/Toast";
import { primaryButton } from "../components/buttons";
import { InboxIcon, PlusIcon } from "../components/icons";
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
const SKELETON_ROWS = [0, 1, 2, 3];
const SKELETON_CELLS = [0, 1, 2, 3];

const LOGIN_PATH = "/microsite/admin/login?next=/microsite/admin/admins";

/**
 * Who can sign in.
 *
 * <p>Add-only, and that is a property of the backend rather than a gap here: there
 * is no update or delete endpoint for an administrator. Building buttons for
 * operations the API does not have would only produce a screen that lies.
 */
const AdminListPage = () => {
    const router = useRouter();
    const toast = useToast();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [sort, setSort] = useState(SORT_OPTIONS[0].value);

    const [data, setData] = useState<PageResponse<Admin> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    // Marks the row for the account currently signed in, so it is obvious which of
    // these is you before you go looking for the one to tell a colleague about.
    const [selfId, setSelfId] = useState<string | null>(null);

    // Bumped after a create. It is a dependency of the fetch effect, so refetching
    // is one setState rather than a duplicate request function.
    const [reloadToken, setReloadToken] = useState(0);
    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        listAdmins({ page, size, sort }, controller.signal)
            .then((response) => {
                setData(response);
                setError(null);
            })
            .catch((error: any) => {
                // An abort is a caller decision, not a failure to report.
                if (error?.name === "AbortError") {
                    return;
                }
                setError(error instanceof ApiError ? error.message : "Could not load administrators.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [page, size, sort, reloadToken]);

    useEffect(() => {
        const controller = new AbortController();

        currentAdmin(controller.signal)
            .then((account) => setSelfId(account.id))
            .catch(() => {
                // Only drives a label. The shell around this page already handles a
                // missing session, so there is nothing to report here.
            });

        return () => controller.abort();
    }, []);

    const rows = data ? data.content : [];

    return (
        <section className="mx-auto w-full max-w-[1120px] px-5 py-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-[30px] leading-[38px] text-slate-900">Administrators</h1>
                    <p className="mt-1 text-[14px] text-slate-600">
                        Accounts that can sign in. Add only - the backend has no admin update or delete.
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
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[13px] text-slate-900 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="button" onClick={() => setAdding(true)} className={primaryButton}>
                        <PlusIcon />
                        Add admin
                    </button>
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
                                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                                <th scope="col" className="px-4 py-3 font-medium">Added</th>
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

                            {/*
                                Reachable only in theory: reading this page needs an
                                admin session, so at least one admin exists. It is here
                                because the alternative to an empty state is a blank
                                rectangle with no explanation.
                            */}
                            {!loading && rows.length === 0 && !error && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-14">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <span className="text-slate-300">
                                                <InboxIcon className="h-9 w-9" />
                                            </span>
                                            <div>
                                                <p className="text-[15px] text-slate-700">No administrators found</p>
                                                <p className="mt-0.5 text-[13px] text-slate-500">
                                                    Add one with the button above.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {rows.map((admin) => (
                                <tr key={admin.id} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-4 py-3 text-slate-900">
                                        {admin.fullName}
                                        {admin.id === selfId && (
                                            <span className="ml-2 rounded-full bg-sky-50 px-2 py-0.5 text-[12px] text-sky-700">
                                                You
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{admin.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] text-slate-600">
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{formatDate(admin.createdAt)}</td>
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

            {adding && (
                <AdminFormModal
                    onClose={() => setAdding(false)}
                    onCreated={(message) => {
                        setAdding(false);
                        toast.success(message);
                        reload();
                    }}
                    onSessionExpired={() => router.replace(LOGIN_PATH)}
                />
            )}
        </section>
    );
};

export default AdminListPage;
