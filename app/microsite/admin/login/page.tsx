import type { Metadata } from "next";
import { Suspense } from "react";
import { MicrositeAdminLoginPage } from "../../../components/microsite";

export const metadata: Metadata = {
    title: "Admin sign in",
    // Nothing here should ever appear in a search result.
    robots: { index: false, follow: false }
};

export default function AdminLoginRoutePage() {
    // useSearchParams reads the "next" destination, which forces this subtree to be
    // client rendered. Without a Suspense boundary the whole route opts out of
    // static generation and the build warns about it.
    return (
        <Suspense fallback={null}>
            <MicrositeAdminLoginPage />
        </Suspense>
    );
}
