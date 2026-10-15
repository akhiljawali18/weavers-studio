import PageLoader from "../components/microsite/components/PageLoader";

// Next.js shows this between the microsite's header and footer while any microsite
// page (or one nested under it) is still loading.
export default function Loading() {
  return <PageLoader />;
}
