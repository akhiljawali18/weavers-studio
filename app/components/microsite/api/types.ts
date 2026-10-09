/**
 * Wire types. These mirror the backend DTOs exactly - if one of them changes,
 * this file changes with it and nothing else has to.
 */

/** Pagination envelope returned by every list endpoint. */
export type PageResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

/** Query parameters accepted by every list endpoint. `sort` is "property,direction". */
export type PageQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export type ProductImage = {
    id: string;
    /** Temporary presigned GET URL. Regenerated on every response, so never cache it. */
    url: string;
    displayOrder: number;
};

export type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    /** Legacy single image URL, kept by the backend for backwards compatibility. */
    imageUrl: string | null;
    sku: string;
    quantity: number;
    active: boolean;
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
};

/** Create/update body. There is no id, createdAt or updatedAt: those are server owned. */
export type ProductPayload = {
    name: string;
    description?: string | null;
    price: number;
    category: string;
    imageUrl?: string | null;
    sku: string;
    quantity: number;
    active?: boolean;
};

export type User = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
};

export type UserPayload = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

/* ---------------------------------------------------------------- admins -- */

/**
 * An administrator. Note what is absent: no password, and no token. The backend
 * response has no field for either, and the session token travels in an HttpOnly
 * cookie that no script can read.
 */
export type Admin = {
    id: string;
    fullName: string;
    email: string;
    /** "ADMIN" today. A user record has no role at all - it is a different table. */
    role: string;
    createdAt: string;
    updatedAt: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

/** Creating an admin. There is deliberately no `role`: the server decides that. */
export type AdminPayload = {
    fullName: string;
    email: string;
    password: string;
};

/* ---------------------------------------------------------------- images -- */

/** One file the browser intends to upload. No bytes are sent at this point. */
export type FileDescriptor = {
    fileName: string;
    contentType: string;
};

/** One presigned PUT target, returned by the upload-urls endpoint. */
export type UploadTarget = {
    /** Echoes the requested file name, so results can be paired back to files. */
    fileName: string;
    /** Send this back to the confirm endpoint after a successful upload. */
    objectKey: string;
    /** Temporary presigned S3 PUT URL. */
    uploadUrl: string;
    /** Must be sent as the Content-Type header of the PUT: it is part of the signature. */
    contentType: string;
    expiresAt: string;
};

export type UploadUrlResponse = {
    uploads: UploadTarget[];
    maxFileSizeBytes: number;
};

/** One object that uploaded successfully and should now be recorded. */
export type ConfirmImageItem = {
    objectKey: string;
    originalFileName: string;
    contentType: string;
    displayOrder: number;
};

/* ----------------------------------------------------------------- errors -- */

/** The backend's single error contract. `errors` is present on a 400 only. */
export type ApiErrorBody = {
    timestamp?: string;
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    errors?: Record<string, string>;
};
