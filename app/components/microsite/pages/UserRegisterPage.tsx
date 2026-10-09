"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "../api/client";
import { registerUser } from "../api/users";
import Field, { describedBy, inputClass } from "../components/Field";
import Feedback from "../components/Feedback";
import { useToast } from "../components/Toast";
import { primaryButton, secondaryButton } from "../components/buttons";
import { SpinnerIcon } from "../components/icons";
import { USER_LIMITS, validateUser } from "../validation/rules";
import type { UserFormValues } from "../validation/rules";

const emptyValues: UserFormValues = {
    fullName: "",
    email: "",
    phoneNumber: ""
};

/** Long enough to read the confirmation, short enough not to feel stuck. */
const REDIRECT_DELAY_MS = 1200;

const UserRegisterPage = () => {
    const router = useRouter();
    const toast = useToast();

    const [values, setValues] = useState<UserFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [banner, setBanner] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    // Cleared on unmount, so a navigation during the pause cannot fire a second one.
    const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        return () => {
            if (redirectTimer.current) {
                clearTimeout(redirectTimer.current);
            }
        };
    }, []);

    const setValue = (key: keyof UserFormValues, value: string) => {
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

        const found = validateUser(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setBanner(null);
            return;
        }

        setSaving(true);
        setBanner(null);
        setErrors({});

        try {
            await registerUser({
                fullName: values.fullName.trim(),
                email: values.email.trim(),
                phoneNumber: values.phoneNumber.trim()
            });
        } catch (error: any) {
            if (error instanceof ApiError && error.hasFieldErrors) {
                // A 400 names the fields it rejected, so those messages belong under
                // the inputs where they can be acted on - not in a toast that floats
                // away from the thing it is describing.
                setErrors(error.fieldErrors);
                toast.error("Check the highlighted fields and try again.");
            } else {
                // A 409 (email taken) carries no field, so it becomes a banner on the
                // form and a toast, since the form may be scrolled out of view.
                const message = error instanceof ApiError ? error.message : "The user could not be registered.";
                setBanner(message);
                toast.error(message);
            }
            setSaving(false);
            return;
        }

        // The form stays disabled through the pause, so the confirmation cannot be
        // submitted a second time on its way out.
        setSaving(false);
        setDone(true);
        toast.success("Registered successfully.");
        // Back to the microsite, not to the user list: that list is an admin screen
        // now, and whoever just registered is not an admin. Registering creates a
        // record, not an account - there is nothing here for them to sign in to.
        redirectTimer.current = setTimeout(() => router.push("/microsite"), REDIRECT_DELAY_MS);
    };

    const locked = saving || done;

    return (
        <section className="mx-auto w-full max-w-[560px] px-5 py-9">
            <h1 className="text-[30px] leading-[38px] text-slate-900">Register a user</h1>
            <p className="mt-1 text-[14px] text-slate-600">
                No password is collected. This creates a registration record, not a
                login - there is no user sign in.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
                {done && <Feedback tone="success">Registered. Taking you back...</Feedback>}
                {banner && <Feedback tone="error">{banner}</Feedback>}

                <Field label="Full name" htmlFor="user-full-name" required error={errors.fullName}>
                    <input
                        id="user-full-name"
                        type="text"
                        autoComplete="name"
                        value={values.fullName}
                        maxLength={USER_LIMITS.fullNameMax}
                        disabled={locked}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={describedBy("user-full-name", errors.fullName)}
                        onChange={(event) => setValue("fullName", event.target.value)}
                        className={inputClass(Boolean(errors.fullName))}
                        placeholder="John Doe"
                    />
                </Field>

                <Field label="Email" htmlFor="user-email" required error={errors.email}>
                    <input
                        id="user-email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        maxLength={USER_LIMITS.emailMax}
                        disabled={locked}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("user-email", errors.email)}
                        onChange={(event) => setValue("email", event.target.value)}
                        className={inputClass(Boolean(errors.email))}
                        placeholder="john@example.com"
                    />
                </Field>

                <Field
                    label="Phone number"
                    htmlFor="user-phone"
                    required
                    error={errors.phoneNumber}
                    hint="10 digits, starting with 6, 7, 8 or 9."
                >
                    <input
                        id="user-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={values.phoneNumber}
                        maxLength={10}
                        disabled={locked}
                        aria-invalid={Boolean(errors.phoneNumber)}
                        aria-describedby={describedBy("user-phone", errors.phoneNumber, "hint")}
                        onChange={(event) => setValue("phoneNumber", event.target.value)}
                        className={inputClass(Boolean(errors.phoneNumber))}
                        placeholder="9876543210"
                    />
                </Field>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={locked}
                        className={primaryButton}
                    >
                        {saving && <SpinnerIcon />}
                        {saving ? "Registering" : "Register"}
                    </button>

                    <Link
                        href="/microsite"
                        className={secondaryButton}
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
};

export default UserRegisterPage;
