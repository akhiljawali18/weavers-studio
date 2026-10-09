import type { Metadata } from "next";
import { MicrositeAdminListPage } from "../../../../components/microsite";

export const metadata: Metadata = {
    title: "Administrators",
    robots: { index: false, follow: false }
};

export default function AdminsRoutePage() {
    return <MicrositeAdminListPage />;
}
