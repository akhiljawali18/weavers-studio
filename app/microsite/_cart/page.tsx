// Not routed while the cart lives on the main site: Next.js skips folders whose
// name starts with "_". Rename the folder back to `cart` to restore /microsite/cart.
import type { Metadata } from "next";
import { MicrositeCartPage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartRoutePage() {
  return <MicrositeCartPage />;
}
