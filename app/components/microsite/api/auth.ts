import { request } from "./client";
import type { Admin, LoginPayload } from "./types";

/**
 * Session calls.
 *
 * None of these returns a token, and none of them takes one. The token lives in an
 * HttpOnly cookie the backend sets and the browser attaches on its own, which means
 * no code in this folder - or any script that ends up on the page - can read it.
 */

/** On success the browser is given the session cookie. The body is the account. */
export function login(payload: LoginPayload) {
    return request<Admin>("/admin/auth/login", { method: "POST", body: payload });
}

/** Clears the cookie. Succeeds even when there is no session to clear. */
export function logout() {
    return request<void>("/admin/auth/logout", { method: "POST" });
}

/**
 * The account behind the current cookie, or a 401.
 *
 * This is how a page confirms it is genuinely logged in. The cookie cannot be read
 * by script, and its mere existence proves nothing anyway - it may have expired, or
 * been signed with a key the server no longer uses. Asking is the only real answer.
 */
export function currentAdmin(signal?: AbortSignal) {
    return request<Admin>("/admin/auth/me", { signal });
}
