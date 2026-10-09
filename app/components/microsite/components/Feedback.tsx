import type { ReactNode } from "react";

export type FeedbackTone = "error" | "success" | "info";

type FeedbackProps = {
    tone: FeedbackTone;
    children: ReactNode;
};

const toneClasses: Record<FeedbackTone, string> = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-sky-200 bg-sky-50 text-sky-800"
};

/**
 * One banner for anything that is not a field-level message: a 404, a 409, a
 * storage outage, or a dead backend.
 *
 * An error is announced assertively because it usually explains why the thing the
 * user just asked for did not happen. Success and info are polite, so they wait
 * for a pause rather than interrupting.
 */
const Feedback = ({ tone, children }: FeedbackProps) => {
    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            aria-live={tone === "error" ? "assertive" : "polite"}
            className={`rounded-md border px-4 py-3 text-[14px] leading-[20px] ${toneClasses[tone]}`}
        >
            {children}
        </div>
    );
};

export default Feedback;
