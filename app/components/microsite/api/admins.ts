import { pageQuery, request } from "./client";
import type { Admin, AdminPayload, PageQuery, PageResponse } from "./types";

/**
 * Creating an administrator. Reachable only with an admin session: the backend
 * rejects this with a 401 otherwise, whatever the page around it looks like.
 *
 * There is no role field, here or in the payload type. The backend sets the role
 * itself and ignores anything the body claims about it, so an admin is the only
 * thing this can produce.
 */
export function createAdmin(payload: AdminPayload) {
    return request<Admin>("/admin", { method: "POST", body: payload });
}

/**
 * The administrator list. Admin-only, like everything else on this path.
 *
 * The response carries no password material of any kind - {@code AdminResponse} on
 * the backend has no field for it - so this is safe to render straight into a table.
 */
export function listAdmins(query: PageQuery, signal?: AbortSignal) {
    return request<PageResponse<Admin>>(`/admin${pageQuery(query)}`, { signal });
}
