import type { Metadata } from "next";
import { MicrositeProgrammePage } from "../../components/microsite";

export const metadata: Metadata = {
  title: "Programme",
};

export default function ProgrammeRoutePage() {
  return <MicrositeProgrammePage />;
}
