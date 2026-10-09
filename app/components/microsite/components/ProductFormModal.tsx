"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../api/client";
import {
    confirmImages,
    createProduct,
    getProduct,
    requestUploadUrls,
    updateProduct,
    uploadToStorage
} from "../api/products";
import type { ConfirmImageItem, Product, ProductPayload, UploadTarget } from "../api/types";
import {
    IMAGE_ACCEPT,
    IMAGE_RULES,
    PRODUCT_LIMITS,
    validateImageFiles,
    validateProduct
} from "../validation/rules";
import type { ProductFormValues } from "../validation/rules";
import Field, { describedBy, inputClass } from "./Field";
import Feedback from "./Feedback";
import Modal from "./Modal";
import { primaryButton, secondaryButton } from "./buttons";
import { SpinnerIcon } from "./icons";

type ProductFormModalProps = {
    /** Absent means create; present means edit, and the form is filled from the API. */
    productId?: string;
    onClose: () => void;
    /** Called after a successful save, with the message the page should show. */
    onSaved: (message: string, tone: "success" | "error") => void;
};

const emptyValues: ProductFormValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    sku: "",
    quantity: "",
    active: true
};

const toValues = (product: Product): ProductFormValues => ({
    name: product.name || "",
    description: product.description || "",
    price: product.price === null || product.price === undefined ? "" : String(product.price),
    category: product.category || "",
    imageUrl: product.imageUrl || "",
    sku: product.sku || "",
    quantity: product.quantity === null || product.quantity === undefined ? "" : String(product.quantity),
    active: product.active !== false
});

/** Empty optional text is sent as null, not "", so the column stays genuinely unset. */
const toPayload = (values: ProductFormValues): ProductPayload => ({
    name: values.name.trim(),
    description: values.description.trim() || null,
    price: Number(values.price.trim()),
    category: values.category.trim(),
    imageUrl: values.imageUrl.trim() || null,
    sku: values.sku.trim(),
    quantity: Number(values.quantity.trim()),
    active: values.active
});

const ProductFormModal = ({ productId, onClose, onSaved }: ProductFormModalProps) => {
    const isEdit = Boolean(productId);

    const [values, setValues] = useState<ProductFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [banner, setBanner] = useState<string | null>(null);

    const [files, setFiles] = useState<File[]>([]);
    const [attachedImages, setAttachedImages] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(isEdit);
    const [loadFailed, setLoadFailed] = useState(false);
    const [saving, setSaving] = useState(false);

    // Edit mode fills the form from the API rather than from the table row, so the
    // dialog always edits the current record even if the list is a little stale.
    useEffect(() => {
        if (!productId) {
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        getProduct(productId, controller.signal)
            .then((product) => {
                setValues(toValues(product));
                setAttachedImages(product.images ? product.images.length : 0);
                setLoadFailed(false);
            })
            .catch((error: any) => {
                // An abort is a caller decision, not a failure to report.
                if (error?.name === "AbortError") {
                    return;
                }
                setLoadFailed(true);
                setBanner(error instanceof ApiError ? error.message : "Could not load this product.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [productId]);

    const setValue = (key: keyof ProductFormValues, value: string | boolean) => {
        setValues((current) => ({ ...current, [key]: value }));

        // Clearing as the user types means a stale message never sits under a field
        // that has since been corrected.
        setErrors((current) => {
            if (!current[key]) {
                return current;
            }
            const next = { ...current };
            delete next[key];
            return next;
        });
    };

    const onFilesPicked = (picked: FileList | null) => {
        const list = picked ? Array.from(picked) : [];
        const problem = validateImageFiles(list, attachedImages);

        // The whole batch is checked before anything is sent, so one bad file cannot
        // leave a half-finished upload behind.
        if (problem) {
            setErrors((current) => ({ ...current, images: problem }));
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setErrors((current) => {
            const next = { ...current };
            delete next.images;
            return next;
        });
        setFiles(list);
    };

    /**
     * Steps 1 to 3 of the image flow, run only once the product exists.
     *
     * @returns null when everything landed, or a sentence describing what did not
     */
    const attachImages = async (id: string): Promise<string | null> => {
        if (files.length === 0) {
            return null;
        }

        // Step 1: ask for one signed link per file. Nothing is stored yet.
        let targets: UploadTarget[];
        try {
            const issued = await requestUploadUrls(
                id,
                files.map((file) => ({ fileName: file.name, contentType: file.type }))
            );
            targets = issued.uploads || [];
        } catch (error: any) {
            return error instanceof ApiError ? error.message : "Upload links could not be issued.";
        }

        // Step 2: bytes go browser to storage. Rejections are captured rather than
        // thrown, so one bad file does not cancel the ones that would have succeeded.
        const results = await Promise.allSettled(
            targets.map((target, index) => uploadToStorage(target, files[index]))
        );

        const uploaded: ConfirmImageItem[] = [];
        let failed = 0;

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                uploaded.push({
                    objectKey: targets[index].objectKey,
                    originalFileName: files[index].name,
                    contentType: targets[index].contentType,
                    // Continues after whatever the product already has.
                    displayOrder: attachedImages + uploaded.length
                });
            } else {
                failed += 1;
            }
        });

        if (uploaded.length === 0) {
            return "No image could be uploaded to storage.";
        }

        // Step 3: only the keys that actually landed are confirmed, so no database
        // row can point at something that is not in storage.
        try {
            await confirmImages(id, uploaded);
        } catch (error: any) {
            return error instanceof ApiError ? error.message : "Uploaded images could not be recorded.";
        }

        return failed === 0 ? null : `${failed} of ${files.length} images could not be uploaded.`;
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const found = validateProduct(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setBanner(null);
            return;
        }

        setSaving(true);
        setBanner(null);
        setErrors({});

        let saved: Product;
        try {
            // The product is always saved first: upload links can only be issued for
            // a product that already exists.
            saved = productId
                ? await updateProduct(productId, toPayload(values))
                : await createProduct(toPayload(values));
        } catch (error: any) {
            if (error instanceof ApiError && error.hasFieldErrors) {
                setErrors(error.fieldErrors);   // 400 - messages land on the inputs
            } else {
                setBanner(error instanceof ApiError ? error.message : "The product could not be saved.");
            }
            setSaving(false);
            return;
        }

        const imageProblem = await attachImages(saved.id);
        setSaving(false);

        // The save itself succeeded either way. Saying so plainly matters, because a
        // failed upload must not read as though the whole save was lost.
        if (imageProblem) {
            onSaved(`The product was saved, but its images were not uploaded. ${imageProblem}`, "error");
            return;
        }

        onSaved(productId ? "Product updated." : "Product created.", "success");
    };

    const busy = saving || loading;

    return (
        <Modal
            title={isEdit ? "Edit product" : "New product"}
            onClose={onClose}
            busy={saving}
            size="lg"
            footer={
                <>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={onClose}
                        className={secondaryButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="microsite-product-form"
                        disabled={busy || loadFailed}
                        className={primaryButton}
                    >
                        {saving && <SpinnerIcon />}
                        {saving ? "Saving" : "Save"}
                    </button>
                </>
            }
        >
            {loading ? (
                <p className="py-8 text-center text-[14px] text-slate-500">Loading product...</p>
            ) : (
                <form id="microsite-product-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                    {banner && <Feedback tone="error">{banner}</Feedback>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name" htmlFor="product-name" required error={errors.name}>
                            <input
                                id="product-name"
                                type="text"
                                value={values.name}
                                maxLength={PRODUCT_LIMITS.nameMax}
                                disabled={saving}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={describedBy("product-name", errors.name)}
                                onChange={(event) => setValue("name", event.target.value)}
                                className={inputClass(Boolean(errors.name))}
                                placeholder="Wireless Mouse"
                            />
                        </Field>

                        <Field
                            label="SKU"
                            htmlFor="product-sku"
                            required
                            error={errors.sku}
                            hint="Letters, digits, dot, underscore and hyphen only."
                        >
                            <input
                                id="product-sku"
                                type="text"
                                value={values.sku}
                                maxLength={PRODUCT_LIMITS.skuMax}
                                disabled={saving}
                                aria-invalid={Boolean(errors.sku)}
                                aria-describedby={describedBy("product-sku", errors.sku, "hint")}
                                onChange={(event) => setValue("sku", event.target.value)}
                                className={inputClass(Boolean(errors.sku))}
                                placeholder="SKU-MOUSE-001"
                            />
                        </Field>

                        <Field label="Price" htmlFor="product-price" required error={errors.price}>
                            <input
                                id="product-price"
                                type="text"
                                inputMode="decimal"
                                value={values.price}
                                disabled={saving}
                                aria-invalid={Boolean(errors.price)}
                                aria-describedby={describedBy("product-price", errors.price)}
                                onChange={(event) => setValue("price", event.target.value)}
                                className={inputClass(Boolean(errors.price))}
                                placeholder="1299.00"
                            />
                        </Field>

                        <Field label="Quantity" htmlFor="product-quantity" required error={errors.quantity}>
                            <input
                                id="product-quantity"
                                type="text"
                                inputMode="numeric"
                                value={values.quantity}
                                disabled={saving}
                                aria-invalid={Boolean(errors.quantity)}
                                aria-describedby={describedBy("product-quantity", errors.quantity)}
                                onChange={(event) => setValue("quantity", event.target.value)}
                                className={inputClass(Boolean(errors.quantity))}
                                placeholder="25"
                            />
                        </Field>

                        <Field label="Category" htmlFor="product-category" required error={errors.category}>
                            <input
                                id="product-category"
                                type="text"
                                value={values.category}
                                maxLength={PRODUCT_LIMITS.categoryMax}
                                disabled={saving}
                                aria-invalid={Boolean(errors.category)}
                                aria-describedby={describedBy("product-category", errors.category)}
                                onChange={(event) => setValue("category", event.target.value)}
                                className={inputClass(Boolean(errors.category))}
                                placeholder="ACCESSORIES"
                            />
                        </Field>

                        <Field
                            label="Image URL"
                            htmlFor="product-image-url"
                            error={errors.imageUrl}
                            hint="Optional legacy field, separate from the uploads below."
                        >
                            <input
                                id="product-image-url"
                                type="text"
                                value={values.imageUrl}
                                maxLength={PRODUCT_LIMITS.imageUrlMax}
                                disabled={saving}
                                aria-invalid={Boolean(errors.imageUrl)}
                                aria-describedby={describedBy("product-image-url", errors.imageUrl, "hint")}
                                onChange={(event) => setValue("imageUrl", event.target.value)}
                                className={inputClass(Boolean(errors.imageUrl))}
                                placeholder="https://cdn.example.com/products/mouse.jpg"
                            />
                        </Field>
                    </div>

                    <Field label="Description" htmlFor="product-description" error={errors.description}>
                        <textarea
                            id="product-description"
                            rows={3}
                            value={values.description}
                            maxLength={PRODUCT_LIMITS.descriptionMax}
                            disabled={saving}
                            aria-invalid={Boolean(errors.description)}
                            aria-describedby={describedBy("product-description", errors.description)}
                            onChange={(event) => setValue("description", event.target.value)}
                            className={inputClass(Boolean(errors.description))}
                            placeholder="2.4 GHz wireless optical mouse"
                        />
                    </Field>

                    <label className="flex w-fit items-center gap-2 text-[14px] text-slate-700">
                        <input
                            type="checkbox"
                            checked={values.active}
                            disabled={saving}
                            onChange={(event) => setValue("active", event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-200"
                        />
                        Active
                    </label>

                    <Field
                        label="Attach images"
                        htmlFor="product-images"
                        error={errors.images}
                        hint={
                            `JPEG, PNG or WebP, under 5 MB each, ${IMAGE_RULES.maxPerProduct} per product.`
                            + (attachedImages > 0 ? ` ${attachedImages} already attached.` : "")
                        }
                    >
                        <input
                            id="product-images"
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={IMAGE_ACCEPT}
                            disabled={saving}
                            aria-invalid={Boolean(errors.images)}
                            aria-describedby={describedBy("product-images", errors.images, "hint")}
                            onChange={(event) => onFilesPicked(event.target.files)}
                            className="w-full text-[13px] text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-[13px] file:text-slate-700 hover:file:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </Field>

                    {files.length > 0 && (
                        <ul className="flex flex-col gap-1 text-[13px] text-slate-600">
                            {files.map((file) => (
                                <li key={`${file.name}-${file.size}`}>
                                    {file.name} - {(file.size / 1024).toFixed(0)} KB
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            )}
        </Modal>
    );
};

export default ProductFormModal;
