import type { Metadata } from "next";
import { MicrositeUserRegisterPage } from "../../components/microsite";

export const metadata: Metadata = {
    title: "Register a user"
};

export default function UserRegisterRoutePage() {
    return <MicrositeUserRegisterPage />;
}
