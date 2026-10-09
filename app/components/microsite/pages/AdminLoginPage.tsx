"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "../api/client";
import { currentAdmin, login } from "../api/auth";
import Field, { describedBy, inputClass } from "../components/Field";
import Feedback from "../components/Feedback";
import { primaryButton } from "../components/buttons";
import { SpinnerIcon } from "../components/icons";
import { ADMIN_LIMITS, validateLogin } from "../validation/rules";
import type { LoginFormValues } from "../validation/rules";

const DEFAULT_DESTINATION = "/microsite/admin/manage";

const emptyValues: LoginFormValues = {
    email: "",
    password: ""
};

/**
 * Where an administrator signs in.
 *
 * <p>On success the backend sets an HttpOnly cookie and this page navigates. There
 * is no token to store, because this page never sees one - which is the reason the
 * session survives a refresh without anything being kept in {@code localStorage}
 * where an injected script could read it.
 */
const AdminLoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Set when the shell bounced someone off a page they were trying to reach, so
    // signing in returns them there rather than to the default screen.
    const requested = searchParams?.get("next");

    const [values, setValues] = useState<LoginFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [banner, setBanner] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Someone already signed in should not be looking at a login form. This is a
    // convenience, not a check: the pages it forwards to do their own.
    useEffect(() => {
        const controller = new AbortController();

        currentAdmin(controller.signal)
            .then(() => router.replace(destination(requested)))
            .catch(() => {
                // No session, which is the expected case on this page. Nothing to do.
            });

        return () => controller.abort();
    }, [requested, router]);

    const setValue = (key: keyof LoginFormValues, value: string) => {
        setValues((current) => ({ ...current, [key]: value }));

        setErrors((current) => {
            if (!current[key]) {
                return current;
            }
            const next = { ...current };
            delete next[key];
            return next;
        });
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const found = validateLogin(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setBanner(null);
            return;
        }

        setSubmitting(true);
        setBanner(null);
        setErrors({});

        try {
            await login({ email: values.email.trim(), password: values.password });
        } catch (error: any) {
            // A 401 is deliberately vague about which half was wrong - the backend
            // will not say, because saying would turn this form into a way to find
            // out which addresses have accounts. The message is passed through as-is.
            // Deliberately not a toast. A sign-in failure has to stay next to the
            // fields that need correcting, and it must not float away while someone
            // is retyping a password.
            setBanner(error instanceof ApiError ? error.message : "Could not sign you in.");
            setSubmitting(false);
            // Clearing the password leaves the email so a retry is one field, not two.
            setValues((current) => ({ ...current, password: "" }));
            return;
        }

        // replace, not push: the back button should not land on the login form of a
        // session that is now active.
        router.replace(destination(requested));
    };

    return (
        <section className="mx-auto w-full max-w-[420px] px-5 py-12">
            <h1 className="text-[30px] leading-[38px] text-slate-900">Admin sign in</h1>
            <p className="mt-1 text-[14px] text-slate-600">
                Administrators only. Registering as a user does not create an account here.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
                {banner && <Feedback tone="error">{banner}</Feedback>}

                <Field label="Email" htmlFor="admin-email" required error={errors.email}>
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        value={values.email}
                        maxLength={ADMIN_LIMITS.emailMax}
                        disabled={submitting}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("admin-email", errors.email)}
                        onChange={(event) => setValue("email", event.target.value)}
                        className={inputClass(Boolean(errors.email))}
                        placeholder="admin@example.com"
                    />
                </Field>

                <Field label="Password" htmlFor="admin-password" required error={errors.password}>
                    <input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        value={values.password}
                        maxLength={ADMIN_LIMITS.passwordMax}
                        disabled={submitting}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={describedBy("admin-password", errors.password)}
                        onChange={(event) => setValue("password", event.target.value)}
                        className={inputClass(Boolean(errors.password))}
                        placeholder="Your password"
                    />
                </Field>

                <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryButton} mt-2 w-full`}
                >
                    {submitting && <SpinnerIcon />}
                    {submitting ? "Signing in" : "Sign in"}
                </button>
            </form>
        </section>
    );
};

/**
 * Only ever returns a path inside the admin area.
 *
 * The value arrives in the query string, where anyone can put anything, so it is
 * checked rather than trusted. Without this, a link carrying
 * `?next=https://example.com` would turn the login form into a redirect that sends
 * people somewhere else, wearing this site's address in the link they clicked.
 */
function destination(requested: string | null | undefined): string {
    if (!requested) {
        return DEFAULT_DESTINATION;
    }
    // Must be a same-site absolute path. "//evil.com" is protocol-relative and would
    // leave the site despite starting with a slash, so it is rejected too.
    if (!requested.startsWith("/microsite/admin/") || requested.startsWith("//")) {
        return DEFAULT_DESTINATION;
    }
    // The login page itself would be a loop.
    if (requested.startsWith("/microsite/admin/login")) {
        return DEFAULT_DESTINATION;
    }
    return requested;
}

export default AdminLoginPage;
