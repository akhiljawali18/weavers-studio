import type { ApiErrorBody, PageQuery } from "./types";

/**
 * Relative by default, so the browser talks to Next.js and the rewrite in
 * next.config.js forwards to the backend. Everything then stays on one origin
 * and CORS never applies.
 *
 * Setting NEXT_PUBLIC_API_BASE_URL makes the browser call an absolute API origin
 * directly and bypass the proxy, which then needs CORS configured on the backend.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

/**
 * Every failure - HTTP error or dead network - arrives as one of these, so a caller
 * never has to tell the two apart.
 */
export class ApiError extends Error {
    /** HTTP status. `0` means the request never reached the server. */
    readonly status: number;

    /** The backend's `error` string, e.g. VALIDATION_ERROR, DUPLICATE_RESOURCE. */
    readonly code: string;

    /** Field name to message. Populated on a 400; empty otherwise. */
    readonly fieldErrors: Record<string, string>;

    constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.fieldErrors = fieldErrors || {};

        // tsconfig targets es5, where subclassing a built-in resets the prototype
        // chain. Without this line `error instanceof ApiError` is always false.
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    /** Whether to put messages on inputs, or show one banner instead. */
    get hasFieldErrors(): boolean {
        return Object.keys(this.fieldErrors).length > 0;
    }

    /**
     * No valid session: the cookie is missing, expired, or was signed with a key the
     * server no longer accepts. The caller's move is to send the person to the login
     * page - retrying the same call will fail the same way.
     */
    get isUnauthenticated(): boolean {
        return this.status === 401;
    }

    /**
     * Logged in, but not allowed to do this. Distinct from the above on purpose:
     * logging in again would change nothing, so redirecting to the login page would
     * only produce a loop.
     */
    get isForbidden(): boolean {
        return this.status === 403;
    }
}

type RequestOptions = {
    method?: string;
    /** A plain object. It is serialised here, so callers never call JSON.stringify. */
    body?: unknown;
    signal?: AbortSignal;
};

/**
 * The one place a request is made. It sets the headers, parses the response and
 * converts any failure into an ApiError.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, signal } = options;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            signal,
            // The admin session is an HttpOnly cookie, so it has to be sent with
            // every call. Same-origin requests would carry it under the default
            // policy anyway; this also covers the case where
            // NEXT_PUBLIC_API_BASE_URL points the browser straight at the backend,
            // which then needs allow-credentials configured in its CORS policy.
            credentials: "include",
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch (error: any) {
        // An abort is a caller decision, not a failure. It passes through untouched
        // so the caller can recognise it by name and stay silent.
        if (error?.name === "AbortError") {
            throw error;
        }
        throw new ApiError(0, "NETWORK_ERROR",
            "Could not reach the server. Check that the backend is running.");
    }

    // 204 is the documented response to a successful delete: no body to parse.
    if (response.status === 204) {
        return undefined as T;
    }

    const payload = await readJson(response);

    if (!response.ok) {
        throw new ApiError(
            response.status,
            payload?.error || "UNEXPECTED_ERROR",
            payload?.message || fallbackMessage(response.status),
            payload?.errors
        );
    }

    return payload as T;
}

/** Builds "?page=0&size=20&sort=createdAt,desc", or "" when nothing is set. */
export function pageQuery(query: PageQuery = {}): string {
    const params = new URLSearchParams();

    if (query.page !== undefined) {
        params.set("page", String(query.page));
    }
    if (query.size !== undefined) {
        params.set("size", String(query.size));
    }
    if (query.sort) {
        params.set("sort", query.sort);
    }

    const serialised = params.toString();
    return serialised ? `?${serialised}` : "";
}

/**
 * A failed request does not always carry the error contract - the proxy can return
 * HTML when the backend is down. An unparseable body becomes null rather than an
 * exception, and the status alone then decides the message.
 */
async function readJson(response: Response): Promise<ApiErrorBody | any> {
    const text = await response.text();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function fallbackMessage(status: number): string {
    if (status === 401) {
        return "Your session has expired. Sign in again.";
    }
    if (status === 403) {
        return "You do not have permission to do that.";
    }
    if (status === 404) {
        return "The record no longer exists.";
    }
    if (status === 409) {
        return "That value is already in use.";
    }
    if (status === 503) {
        return "The service is temporarily unavailable. Try again shortly.";
    }
    if (status >= 500) {
        return "The server could not complete the request.";
    }
    return "The request was rejected.";
}
