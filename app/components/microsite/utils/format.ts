/**
 * Prices are read as numbers from JSON, but the backend stores them with two
 * decimal places. Rendering them raw would show "1299" where the record says
 * "1299.00", so the trailing zeros are put back for display.
 */
export function formatPrice(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) {
        return "-";
    }

    return numeric.toFixed(2);
}

/** Renders an Instant such as "2026-09-04T12:27:13Z" in the viewer's locale. */
export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return "-";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "-";
    }

    return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
