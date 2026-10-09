import type { Metadata } from "next";
import { MicrositeVoicesPage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "Voices",
};

export default function VoicesRoutePage() {
  return <MicrositeVoicesPage />;
}
