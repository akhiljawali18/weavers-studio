import type { ReactNode } from "react";
import { MicrositeAdminShell } from "../../../components/microsite";

/**
 * Wraps every admin screen except the login page, which sits outside this route
 * group precisely so that it is not guarded by the shell that would redirect it.
 *
 * The parentheses make "(protected)" a route group: it organises files without
 * adding a URL segment, so the pages under it stay at /microsite/admin/manage and
 * /microsite/admin/users.
 */
type LayoutProps = {
    children: ReactNode;
};

export default function ProtectedAdminLayout({ children }: LayoutProps) {
    return <MicrositeAdminShell>{children}</MicrositeAdminShell>;
}
