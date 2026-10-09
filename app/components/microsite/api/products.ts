import { ApiError, pageQuery, request } from "./client";
import type {
    ConfirmImageItem,
    FileDescriptor,
    PageQuery,
    PageResponse,
    Product,
    ProductImage,
    ProductPayload,
    UploadTarget,
    UploadUrlResponse
} from "./types";

/* --------------------------------------------------------------- products -- */

// Reads take an optional AbortSignal so a page can cancel on unmount.
export function listProducts(query: PageQuery, signal?: AbortSignal) {
    return request<PageResponse<Product>>(`/products${pageQuery(query)}`, { signal });
}

export function getProduct(id: string, signal?: AbortSignal) {
    return request<Product>(`/products/${id}`, { signal });
}

// Writes pass a plain object as `body`; it is serialised for you.
export function createProduct(payload: ProductPayload) {
    return request<Product>("/products", { method: "POST", body: payload });
}

export function updateProduct(id: string, payload: ProductPayload) {
    return request<Product>(`/products/${id}`, { method: "PUT", body: payload });
}

export function deleteProduct(id: string) {
    return request<void>(`/products/${id}`, { method: "DELETE" });
}

/* ----------------------------------------------------------------- images -- */

/** Step 1: ask for one temporary signed link per file. Nothing is stored yet. */
export function requestUploadUrls(productId: string, files: FileDescriptor[]) {
    return request<UploadUrlResponse>(`/products/${productId}/images/upload-urls`, {
        method: "POST",
        body: { files }
    });
}

/**
 * Step 2: upload the bytes browser to storage, bypassing our API entirely.
 *
 * This does not go through `request()`: the URL is absolute, the body is not JSON,
 * and the response comes from S3 rather than from the backend. It must send the
 * exact content type the backend signed, because that header is part of the
 * signature.
 */
export async function uploadToStorage(target: UploadTarget, file: File): Promise<void> {
    let response: Response;
    try {
        response = await fetch(target.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": target.contentType },
            body: file
        });
    } catch {
        throw new ApiError(0, "UPLOAD_FAILED", `"${target.fileName}" could not be uploaded.`);
    }

    if (!response.ok) {
        throw new ApiError(response.status, "UPLOAD_FAILED",
            `"${target.fileName}" was rejected by storage.`);
    }
}

/** Step 3: report the keys that actually landed, so only those are recorded. */
export function confirmImages(productId: string, images: ConfirmImageItem[]) {
    return request<ProductImage[]>(`/products/${productId}/images`, {
        method: "POST",
        body: { images }
    });
}
