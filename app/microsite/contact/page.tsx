import type { Metadata } from "next";
import { MicrositeContactPage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactRoutePage() {
  return <MicrositeContactPage />;
}
