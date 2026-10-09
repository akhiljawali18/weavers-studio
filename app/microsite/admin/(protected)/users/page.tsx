import type { Metadata } from "next";
import { MicrositeUserListPage } from "../../../../components/microsite";

export const metadata: Metadata = {
    title: "Registered users"
};

export default function UsersRoutePage() {
    return <MicrositeUserListPage />;
}
