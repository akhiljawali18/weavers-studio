import type { Metadata } from "next";
import { MicrositeAboutUsPage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "About us",
};

export default function AboutUsRoutePage() {
  return <MicrositeAboutUsPage />;
}
