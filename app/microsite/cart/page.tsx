import type { Metadata } from "next";
import { MicrositeCartPage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartRoutePage() {
  return <MicrositeCartPage />;
}
