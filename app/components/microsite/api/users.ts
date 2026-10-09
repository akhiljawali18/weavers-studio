import { pageQuery, request } from "./client";
import type { PageQuery, PageResponse, User, UserPayload } from "./types";

export function registerUser(payload: UserPayload) {
    return request<User>("/users", { method: "POST", body: payload });
}

export function listUsers(query: PageQuery, signal?: AbortSignal) {
    return request<PageResponse<User>>(`/users${pageQuery(query)}`, { signal });
}
