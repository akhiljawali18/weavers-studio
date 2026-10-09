"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../api/client";
import { createAdmin } from "../api/admins";
import Field, { describedBy, inputClass } from "./Field";
import Feedback from "./Feedback";
import Modal from "./Modal";
import { primaryButton, secondaryButton } from "./buttons";
import { SpinnerIcon } from "./icons";
import { ADMIN_LIMITS, validateNewAdmin } from "../validation/rules";
import type { AdminFormValues } from "../validation/rules";

type AdminFormModalProps = {
    onClose: () => void;
    /** Called after a successful create, with the message the page should report. */
    onCreated: (message: string) => void;
    /** Raised when the session expired mid-form, so the page can send them to sign in. */
    onSessionExpired: () => void;
};

const emptyValues: AdminFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
};

/**
 * Creating an administrator, in a dialog over the list.
 *
 * <p>Same shape as {@link ProductFormModal} deliberately: the list stays behind the
 * dialog, so a new row appears in context rather than after a navigation to a
 * separate screen and back.
 *
 * <p>There is no role input, and there must never be one. The backend assigns the
 * role and ignores anything the payload claims about it - a field here would be
 * decoration at best and a lie at worst.
 */
const AdminFormModal = ({ onClose, onCreated, onSessionExpired }: AdminFormModalProps) => {
    const [values, setValues] = useState<AdminFormValues>(emptyValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [banner, setBanner] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const setValue = (key: keyof AdminFormValues, value: string) => {
        setValues((current) => ({ ...current, [key]: value }));

        // Clearing as the user types means a stale message never sits under a field
        // that has since been corrected.
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

        const found = validateNewAdmin(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setBanner(null);
            return;
        }

        setSaving(true);
        setBanner(null);
        setErrors({});

        try {
            const admin = await createAdmin({
                fullName: values.fullName.trim(),
                email: values.email.trim(),
                password: values.password
            });

            onCreated(`${admin.email} can now sign in.`);
        } catch (error: any) {
            if (error instanceof ApiError && error.isUnauthenticated) {
                // The session ran out while this form was open. Showing a validation
                // error over a form that cannot succeed would only waste their time.
                onSessionExpired();
                return;
            }
            if (error instanceof ApiError && error.hasFieldErrors) {
                setErrors(error.fieldErrors);
            } else {
                // A 409 means the address already belongs to an admin. It carries no
                // field, so it becomes a banner at the top of the dialog.
                setBanner(error instanceof ApiError ? error.message : "The admin could not be created.");
            }
            setSaving(false);
        }
    };

    return (
        <Modal
            title="Add administrator"
            onClose={onClose}
            busy={saving}
            footer={
                <>
                    <button type="button" disabled={saving} onClick={onClose} className={secondaryButton}>
                        Cancel
                    </button>
                    <button type="submit" form="microsite-admin-form" disabled={saving} className={primaryButton}>
                        {saving && <SpinnerIcon />}
                        {saving ? "Creating" : "Create admin"}
                    </button>
                </>
            }
        >
            <form id="microsite-admin-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                {banner && <Feedback tone="error">{banner}</Feedback>}

                <p className="text-[13px] leading-[19px] text-slate-600">
                    The new account can sign in immediately and has the same access you do.
                </p>

                <Field label="Full name" htmlFor="new-admin-name" required error={errors.fullName}>
                    <input
                        id="new-admin-name"
                        type="text"
                        autoComplete="off"
                        value={values.fullName}
                        maxLength={ADMIN_LIMITS.fullNameMax}
                        disabled={saving}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={describedBy("new-admin-name", errors.fullName)}
                        onChange={(event) => setValue("fullName", event.target.value)}
                        className={inputClass(Boolean(errors.fullName))}
                        placeholder="Jane Doe"
                    />
                </Field>

                <Field label="Email" htmlFor="new-admin-email" required error={errors.email}>
                    <input
                        id="new-admin-email"
                        type="email"
                        autoComplete="off"
                        value={values.email}
                        maxLength={ADMIN_LIMITS.emailMax}
                        disabled={saving}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("new-admin-email", errors.email)}
                        onChange={(event) => setValue("email", event.target.value)}
                        className={inputClass(Boolean(errors.email))}
                        placeholder="jane@example.com"
                    />
                </Field>

                <Field
                    label="Password"
                    htmlFor="new-admin-password"
                    required
                    error={errors.password}
                    hint={`At least ${ADMIN_LIMITS.passwordMin} characters.`}
                >
                    <input
                        id="new-admin-password"
                        type="password"
                        // new-password, so a browser offers to generate one rather than
                        // filling in the signed-in admin's own credentials.
                        autoComplete="new-password"
                        value={values.password}
                        maxLength={ADMIN_LIMITS.passwordMax}
                        disabled={saving}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={describedBy("new-admin-password", errors.password, "hint")}
                        onChange={(event) => setValue("password", event.target.value)}
                        className={inputClass(Boolean(errors.password))}
                    />
                </Field>

                <Field label="Confirm password" htmlFor="new-admin-confirm" required error={errors.confirmPassword}>
                    <input
                        id="new-admin-confirm"
                        type="password"
                        autoComplete="new-password"
                        value={values.confirmPassword}
                        maxLength={ADMIN_LIMITS.passwordMax}
                        disabled={saving}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={describedBy("new-admin-confirm", errors.confirmPassword)}
                        onChange={(event) => setValue("confirmPassword", event.target.value)}
                        className={inputClass(Boolean(errors.confirmPassword))}
                    />
                </Field>
            </form>
        </Modal>
    );
};

export default AdminFormModal;
