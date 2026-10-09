"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "../api/client";
import { currentAdmin, logout as logoutRequest } from "../api/auth";
import type { Admin } from "../api/types";
import { secondaryButton } from "../components/buttons";
import { SpinnerIcon } from "../components/icons";

/**
 * Wraps every admin screen: confirms there is a session, then draws the chrome.
 *
 * <p>Worth being clear about what this is and is not. It is not what protects the
 * data - the backend refuses every one of these calls without a valid session
 * cookie, and would keep refusing them if this file were deleted. What this does is
 * spare someone a screenful of failed requests when their six hours have run out,
 * and give them somewhere to click to sign out.
 *
 * <p>It asks the server rather than reading a cookie because it cannot read the
 * cookie: the token is HttpOnly and invisible to script by design. Presence would
 * not prove much anyway - a cookie can be present and expired.
 */

const NAV_ITEMS = [
    { href: "/microsite/admin/manage", label: "Products" },
    { href: "/microsite/admin/users", label: "Users" },
    { href: "/microsite/admin/admins", label: "Admins" }
];

const LOGIN_PATH = "/microsite/admin/login";

type AdminShellProps = {
    children: ReactNode;
};

const AdminShell = ({ children }: AdminShellProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [checking, setChecking] = useState(true);
    const [failed, setFailed] = useState<string | null>(null);
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        currentAdmin(controller.signal)
            .then((account) => {
                setAdmin(account);
                setChecking(false);
            })
            .catch((error: any) => {
                if (error?.name === "AbortError") {
                    return;
                }

                if (error instanceof ApiError && error.isUnauthenticated) {
                    // Where they were headed, so the login page can send them back
                    // there instead of dropping everyone on the same screen.
                    const target = `${LOGIN_PATH}?next=${encodeURIComponent(pathname || "")}`;
                    router.replace(target);
                    return;
                }

                // A dead backend is not an expired session. Redirecting to the login
                // page here would just fail the same way and look like a broken
                // password, so it says what actually happened instead.
                setFailed(error instanceof ApiError
                    ? error.message
                    : "Could not confirm your session.");
                setChecking(false);
            });

        return () => controller.abort();
    }, [pathname, router]);

    const onSignOut = useCallback(async () => {
        setSigningOut(true);
        try {
            await logoutRequest();
        } catch {
            // Ignored on purpose. Logout clears a cookie; if the call did not reach
            // the server there is nothing to retry and nothing to tell the user.
            // Sending them to the login page is right either way.
        }
        // replace, not push: the back button should not return to an admin screen
        // that will now bounce them straight back here.
        router.replace(LOGIN_PATH);
    }, [router]);

    if (checking) {
        return (
            <section className="mx-auto flex w-full max-w-[1120px] items-center gap-2 px-5 py-16 text-[14px] text-slate-600">
                <SpinnerIcon />
                Checking your session...
            </section>
        );
    }

    if (failed) {
        return (
            <section className="mx-auto w-full max-w-[560px] px-5 py-16">
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
                    {failed}
                </div>
                <Link
                    href={LOGIN_PATH}
                    className={`${secondaryButton} mt-4`}
                >
                    Go to sign in
                </Link>
            </section>
        );
    }

    return (
        <div>
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
                    <span className="text-[13px] font-medium uppercase tracking-wide text-slate-500">Admin</span>

                    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={
                                        active
                                            ? "text-[14px] text-sky-800 underline decoration-2 underline-offset-[6px]"
                                            : "text-[14px] text-slate-600 transition-colors hover:text-slate-900"
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-3">
                        {admin && <span className="text-[13px] text-slate-600">{admin.email}</span>}
                        <button
                            type="button"
                            onClick={onSignOut}
                            disabled={signingOut}
                            className={`${secondaryButton} px-3 py-1.5 text-[13px]`}
                        >
                            {signingOut && <SpinnerIcon />}
                            {signingOut ? "Signing out" : "Sign out"}
                        </button>
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
};

export default AdminShell;
