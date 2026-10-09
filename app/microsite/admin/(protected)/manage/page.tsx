import type { Metadata } from "next";
import { MicrositeManagePage } from "../../../../components/microsite";

export const metadata: Metadata = {
    title: "Manage products"
};

export default function ManageRoutePage() {
    return <MicrositeManagePage />;
}
