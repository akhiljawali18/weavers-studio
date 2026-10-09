/**
 * Mirrors the backend's constraints so a mistake is flagged immediately.
 *
 * This exists for speed of feedback only. The backend re-checks everything and is
 * the only thing that actually enforces it - anything relaxed here is still
 * rejected there, and the resulting 400 lands on the same inputs.
 */

/* ---------------------------------------------------------------- products -- */

export const PRODUCT_LIMITS = {
    nameMax: 150,
    descriptionMax: 2000,
    categoryMax: 80,
    imageUrlMax: 2048,
    skuMax: 64,
    quantityMax: 1_000_000
};

/** ProductRequest.sku: ^[A-Za-z0-9._-]+$ */
const SKU_PATTERN = /^[A-Za-z0-9._-]+$/;

/** At most 10 integer and 2 fraction digits, non-negative. */
const PRICE_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

/** The form works in strings, because that is what an input gives back. */
export type ProductFormValues = {
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    sku: string;
    quantity: string;
    active: boolean;
};

export function validateProduct(values: ProductFormValues): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = values.name.trim();
    if (!name) {
        errors.name = "name is required";
    } else if (name.length > PRODUCT_LIMITS.nameMax) {
        errors.name = `name must not exceed ${PRODUCT_LIMITS.nameMax} characters`;
    }

    if (values.description.length > PRODUCT_LIMITS.descriptionMax) {
        errors.description = `description must not exceed ${PRODUCT_LIMITS.descriptionMax} characters`;
    }

    const price = values.price.trim();
    if (!price) {
        errors.price = "price is required";
    } else if (!PRICE_PATTERN.test(price)) {
        errors.price = "price must be zero or greater, with at most 2 decimal places";
    }

    const category = values.category.trim();
    if (!category) {
        errors.category = "category is required";
    } else if (category.length > PRODUCT_LIMITS.categoryMax) {
        errors.category = `category must not exceed ${PRODUCT_LIMITS.categoryMax} characters`;
    }

    if (values.imageUrl.trim().length > PRODUCT_LIMITS.imageUrlMax) {
        errors.imageUrl = `imageUrl must not exceed ${PRODUCT_LIMITS.imageUrlMax} characters`;
    }

    const sku = values.sku.trim();
    if (!sku) {
        errors.sku = "sku is required";
    } else if (sku.length > PRODUCT_LIMITS.skuMax) {
        errors.sku = `sku must not exceed ${PRODUCT_LIMITS.skuMax} characters`;
    } else if (!SKU_PATTERN.test(sku)) {
        errors.sku = "sku may only contain letters, digits, dot, underscore and hyphen";
    }

    const quantity = values.quantity.trim();
    if (!quantity) {
        errors.quantity = "quantity is required";
    } else if (!/^\d+$/.test(quantity)) {
        errors.quantity = "quantity must be a whole number, zero or greater";
    } else if (Number(quantity) > PRODUCT_LIMITS.quantityMax) {
        errors.quantity = `quantity must not exceed ${PRODUCT_LIMITS.quantityMax}`;
    }

    return errors;
}

/* ------------------------------------------------------------------- users -- */

export const USER_LIMITS = {
    fullNameMax: 120,
    emailMax: 254
};

/** UserRequest.phoneNumber: ^[6-9][0-9]{9}$ */
const PHONE_PATTERN = /^[6-9][0-9]{9}$/;

/**
 * Deliberately loose. The backend uses Bean Validation's @Email, and a browser-side
 * regex that is stricter than it would reject addresses the server accepts.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserFormValues = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

export function validateUser(values: UserFormValues): Record<string, string> {
    const errors: Record<string, string> = {};

    const fullName = values.fullName.trim();
    if (!fullName) {
        errors.fullName = "fullName is required";
    } else if (fullName.length > USER_LIMITS.fullNameMax) {
        errors.fullName = `fullName must not exceed ${USER_LIMITS.fullNameMax} characters`;
    }

    const email = values.email.trim();
    if (!email) {
        errors.email = "email is required";
    } else if (email.length > USER_LIMITS.emailMax) {
        errors.email = `email must not exceed ${USER_LIMITS.emailMax} characters`;
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = "email must be a well-formed address";
    }

    const phoneNumber = values.phoneNumber.trim();
    if (!phoneNumber) {
        errors.phoneNumber = "phoneNumber is required";
    } else if (!PHONE_PATTERN.test(phoneNumber)) {
        errors.phoneNumber = "phoneNumber must be a 10 digit number starting with 6, 7, 8 or 9";
    }

    return errors;
}

/* ------------------------------------------------------------------ admins -- */

export const ADMIN_LIMITS = {
    fullNameMax: 120,
    emailMax: 254,
    /** AdminCreateRequest.password: @Size(min = 8, max = 72) */
    passwordMin: 8,
    /**
     * BCrypt ignores anything past 72 bytes, so a longer password would not be
     * fully checked. The backend rejects rather than truncates, and so does this.
     */
    passwordMax: 72
};

export type LoginFormValues = {
    email: string;
    password: string;
};

/**
 * Login checks presence and nothing else.
 *
 * Deliberately weaker than {@link validateNewAdmin}. Applying the password policy
 * here would reject an old password that no longer meets it, and flagging a
 * malformed address before sending would tell someone probing addresses that the
 * form treats theirs differently. Both are the server's call, and its answer is the
 * same either way: email or password is incorrect.
 */
export function validateLogin(values: LoginFormValues): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!values.email.trim()) {
        errors.email = "email is required";
    }
    if (!values.password) {
        errors.password = "password is required";
    }

    return errors;
}

export type AdminFormValues = {
    fullName: string;
    email: string;
    password: string;
    /** Confirmation only. It is never sent: the backend has no field for it. */
    confirmPassword: string;
};

export function validateNewAdmin(values: AdminFormValues): Record<string, string> {
    const errors: Record<string, string> = {};

    const fullName = values.fullName.trim();
    if (!fullName) {
        errors.fullName = "fullName is required";
    } else if (fullName.length > ADMIN_LIMITS.fullNameMax) {
        errors.fullName = `fullName must not exceed ${ADMIN_LIMITS.fullNameMax} characters`;
    }

    const email = values.email.trim();
    if (!email) {
        errors.email = "email is required";
    } else if (email.length > ADMIN_LIMITS.emailMax) {
        errors.email = `email must not exceed ${ADMIN_LIMITS.emailMax} characters`;
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = "email must be a well-formed address";
    }

    // Not trimmed. A leading or trailing space is part of a password, and silently
    // removing it here would create one that never matches what was typed.
    if (!values.password) {
        errors.password = "password is required";
    } else if (values.password.length < ADMIN_LIMITS.passwordMin) {
        errors.password = `password must be at least ${ADMIN_LIMITS.passwordMin} characters`;
    } else if (values.password.length > ADMIN_LIMITS.passwordMax) {
        errors.password = `password must not exceed ${ADMIN_LIMITS.passwordMax} characters`;
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "confirm the password";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "passwords do not match";
    }

    return errors;
}

/* ------------------------------------------------------------------ images -- */

export const IMAGE_RULES = {
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
    maxFileSizeBytes: 5 * 1024 * 1024,
    maxPerProduct: 10
};

/** For the file input's `accept` attribute. */
export const IMAGE_ACCEPT = IMAGE_RULES.allowedContentTypes.join(",");

/**
 * Checks the whole batch before any of it is sent, so one bad file cannot leave a
 * half-finished upload behind.
 *
 * @param files       what the user picked
 * @param alreadyHeld how many images the product already has
 * @returns the first problem found, or null when the batch is fine
 */
export function validateImageFiles(files: File[], alreadyHeld = 0): string | null {
    if (files.length === 0) {
        return null;
    }

    if (alreadyHeld + files.length > IMAGE_RULES.maxPerProduct) {
        return `A product may have at most ${IMAGE_RULES.maxPerProduct} images. `
            + `It already has ${alreadyHeld} and ${files.length} more were selected.`;
    }

    for (const file of files) {
        if (IMAGE_RULES.allowedContentTypes.indexOf(file.type) === -1) {
            return `"${file.name}" is not a JPEG, PNG or WebP image.`;
        }
        if (file.size > IMAGE_RULES.maxFileSizeBytes) {
            return `"${file.name}" is larger than 5 MB.`;
        }
    }

    return null;
}
