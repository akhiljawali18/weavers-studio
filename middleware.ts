import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//This code we will use handle requrest for login and login users
//Middleware allows you to run code before a request is completed. Change the code as per requirement
//Author : Ranjeet gupta

/** Set by the catalog backend on admin sign in. HttpOnly, so only the server sees it. */
const ADMIN_COOKIE = "admin_token";
const ADMIN_LOGIN_PATH = "/microsite/admin/login";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    const nextResponse = NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });

    // --- catalog admin area ------------------------------------------------
    // Sends someone with no session to the sign in page instead of letting them
    // load an admin screen that would only fill with failed requests.
    //
    // This checks that a cookie is present and nothing more. It cannot check that
    // the cookie is valid: middleware runs on the edge runtime, which has no
    // crypto library able to verify the signature, and the signing key does not
    // belong on the frontend anyway. So this is a redirect for convenience, not a
    // gate - the backend rejects every admin API call whose cookie does not
    // verify, and it is the only thing standing between anyone and the data.
    if (pathname.startsWith("/microsite/admin") && !pathname.startsWith(ADMIN_LOGIN_PATH)) {
        if (!request.cookies.get(ADMIN_COOKIE)?.value) {
            const target = new URL(ADMIN_LOGIN_PATH, request.nextUrl);
            target.searchParams.set("next", pathname);
            return NextResponse.redirect(target);
        }
        return nextResponse;
    }

    const isPublicPath = pathname === "/login" || pathname === "/register" || pathname === "/reset-password";
    const { searchParams } = new URL(request.url);
    const searchTab = searchParams.get("tab");
    const isPrivatePath = pathname === "/thankyou" || pathname === "/myorders" || pathname === "/checkout" || /**pathname == "/saved-items/group/3" || pathname == "/saved-items/group/128" || pathname == "/saved-items/group" || pathname === "/saved-items" || pathname === "/saved-items/all-collections" || */ pathname === "/measurement" || (pathname === "/userprofile" && (searchTab === "editprofile" || searchTab === "notifications" || searchTab === "myorders" || searchTab?.includes("order-details")));
    const token = request.cookies.get("token")?.value || "";
    if (isPublicPath && token && request.cookies.get("role")?.value == process.env.NEXT_PUBLIC_WEBSITE_USER) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (isPrivatePath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (!pathname.includes("customize-product") && pathname.includes("customise") && (!token || (token && request.cookies.get("role")?.value != process.env.NEXT_PUBLIC_WEBSITE_USER))) {
        return NextResponse.redirect(new URL("/customise", request.nextUrl));
    }

    return nextResponse;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/", "/userprofile", "/login", "/register", "/reset-password", "/measurement", "/saved-items", "/saved-items/all-collections", "/saved-items/group", "/saved-items/group/3", "/saved-items/group/128", "/myorders", "/thankyou", "/customise/(.*)",
        // The admin area. Listed as the prefix and everything under it, so a screen
        // added later is covered without touching this line.
        "/microsite/admin", "/microsite/admin/(.*)"
    ]
};
