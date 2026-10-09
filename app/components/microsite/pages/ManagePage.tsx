"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { deleteProduct, listProducts } from "../api/products";
import type { PageResponse, Product } from "../api/types";
import ConfirmDialog from "../components/ConfirmDialog";
import Feedback from "../components/Feedback";
import Pagination from "../components/Pagination";
import ProductFormModal from "../components/ProductFormModal";
import { useToast } from "../components/Toast";
import { iconButton, iconButtonDanger, primaryButton } from "../components/buttons";
import { InboxIcon, PencilIcon, PlusIcon, TrashIcon } from "../components/icons";
import { formatPrice } from "../utils/format";

/** Which dialog is up, if any. `productId` absent in edit mode is impossible by construction. */
type DialogState =
    | { kind: "create" }
    | { kind: "edit"; productId: string }
    | null;

/** Placeholder rows shown on first load. Count is arbitrary; it just has to fill. */
const SKELETON_ROWS = [0, 1, 2, 3, 4];
const SKELETON_CELLS = [0, 1, 2, 3, 4, 5, 6];

const ManagePage = () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);

    const [data, setData] = useState<PageResponse<Product> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialog, setDialog] = useState<DialogState>(null);
    const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const toast = useToast();

    // Bumped after a save or a delete. It is a dependency of the fetch effect, so
    // refetching is one setState rather than a duplicate request function.
    const [reloadToken, setReloadToken] = useState(0);
    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        listProducts({ page, size }, controller.signal)
            .then((response) => {
                setData(response);
                setError(null);
            })
            .catch((error: any) => {
                // An abort is a caller decision, not a failure to report.
                if (error?.name === "AbortError") {
                    return;
                }
                setError(error instanceof ApiError ? error.message : "Could not load products.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [page, size, reloadToken]);

    const onSaved = (text: string, tone: "success" | "error") => {
        setDialog(null);
        // The dialog reports both outcomes: a product can save while its images fail,
        // and that has to read as a partial success rather than a clean one.
        if (tone === "success") {
            toast.success(text);
        } else {
            toast.error(text);
        }
        reload();
    };

    const onConfirmDelete = async () => {
        if (!pendingDelete) {
            return;
        }

        setDeleting(true);
        try {
            await deleteProduct(pendingDelete.id);

            // Deleting the last row on a page would otherwise leave an empty table.
            // Stepping back changes `page`, which already triggers the refetch, so
            // no extra request is made here.
            const wasLastRow = data !== null && data.content.length === 1 && page > 0;
            toast.success(`"${pendingDelete.name}" was deleted.`);

            if (wasLastRow) {
                setPage(page - 1);
            } else {
                reload();
            }
        } catch (error: any) {
            toast.error(error instanceof ApiError ? error.message : "The product could not be deleted.");
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    const rows = data ? data.content : [];
    const busy = loading || deleting;

    return (
        <section className="mx-auto w-full max-w-[1120px] px-5 py-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-[30px] leading-[38px] text-slate-900">Manage products</h1>
                    <p className="mt-1 text-[14px] text-slate-600">
                        Create, edit and remove catalogue entries.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setDialog({ kind: "create" })}
                    className={primaryButton}
                >
                    <PlusIcon />
                    New product
                </button>
            </div>

            {error && (
                <div className="mb-4">
                    <Feedback tone="error">{error}</Feedback>
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[12px] uppercase tracking-wide text-slate-500">
                                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                                <th scope="col" className="px-4 py-3 font-medium">SKU</th>
                                <th scope="col" className="px-4 py-3 font-medium">Category</th>
                                <th scope="col" className="px-4 py-3 text-right font-medium">Price</th>
                                <th scope="col" className="px-4 py-3 text-right font-medium">Qty</th>
                                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                                <th scope="col" className="px-4 py-3 text-right font-medium">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                            {/* Skeleton rows rather than a "Loading..." line: the table
                                keeps its height, so the page does not jump when the
                                data lands and the pagination bar stops moving. */}
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
                                    <td colSpan={7} className="px-4 py-14">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <span className="text-slate-300">
                                                <InboxIcon className="h-9 w-9" />
                                            </span>
                                            <div>
                                                <p className="text-[15px] text-slate-700">No products yet</p>
                                                <p className="mt-0.5 text-[13px] text-slate-500">
                                                    Everything you add will be listed here.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {rows.map((product) => (
                                <tr key={product.id} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-4 py-3">
                                        <span className="text-slate-900">{product.name}</span>
                                        {product.images && product.images.length > 0 && (
                                            <span className="ml-2 text-[12px] text-slate-500">
                                                {product.images.length} image
                                                {product.images.length === 1 ? "" : "s"}
                                            </span>
                                        )}
                                    </td>
                                    {/* No font-mono: tailwind.config.ts replaces the
                                        default fontFamily, so that utility does not exist. */}
                                    <td className="px-4 py-3 text-[13px] tracking-wide">{product.sku}</td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 text-right tabular-nums">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums">{product.quantity}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                product.active
                                                    ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[12px] text-emerald-700"
                                                    : "rounded-full bg-slate-100 px-2 py-0.5 text-[12px] text-slate-600"
                                            }
                                        >
                                            {product.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                disabled={busy}
                                                className={iconButton}
                                                onClick={() => setDialog({ kind: "edit", productId: product.id })}
                                            >
                                                <PencilIcon />
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busy}
                                                className={iconButtonDanger}
                                                onClick={() => setPendingDelete(product)}
                                            >
                                                <TrashIcon />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
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
                    disabled={busy}
                    onPageChange={setPage}
                    onSizeChange={(next) => {
                        // A different page size makes the current page number
                        // meaningless, so the list restarts from the beginning.
                        setSize(next);
                        setPage(0);
                    }}
                />
            </div>

            {dialog && (
                <ProductFormModal
                    productId={dialog.kind === "edit" ? dialog.productId : undefined}
                    onClose={() => setDialog(null)}
                    onSaved={onSaved}
                />
            )}

            {pendingDelete && (
                <ConfirmDialog
                    title="Delete product"
                    confirmLabel={deleting ? "Deleting" : "Delete"}
                    busy={deleting}
                    onConfirm={onConfirmDelete}
                    onCancel={() => setPendingDelete(null)}
                >
                    <p>
                        <span className="font-medium text-slate-900">{pendingDelete.name}</span> will be
                        removed permanently. This cannot be undone.
                    </p>
                </ConfirmDialog>
            )}
        </section>
    );
};

export default ManagePage;
