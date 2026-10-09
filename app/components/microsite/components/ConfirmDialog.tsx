"use client";

import type { ReactNode } from "react";
import Modal from "./Modal";
import { dangerButton, secondaryButton } from "./buttons";
import { SpinnerIcon } from "./icons";

type ConfirmDialogProps = {
    title: string;
    confirmLabel: string;
    /** True while the action runs, which locks both buttons and the dialog. */
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    children: ReactNode;
};

/**
 * A yes/no gate in front of something irreversible. The delete is a hard delete
 * server side, so this is the only chance to stop it.
 */
const ConfirmDialog = ({
    title,
    confirmLabel,
    busy,
    onConfirm,
    onCancel,
    children
}: ConfirmDialogProps) => {
    return (
        <Modal
            title={title}
            onClose={onCancel}
            busy={busy}
            footer={
                <>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className={secondaryButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onConfirm}
                        className={dangerButton}
                    >
                        {busy && <SpinnerIcon />}
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <div className="text-[14px] leading-[21px] text-slate-700">{children}</div>
        </Modal>
    );
};

export default ConfirmDialog;
