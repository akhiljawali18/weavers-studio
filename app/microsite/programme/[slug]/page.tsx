import { notFound } from "next/navigation";
import { MicrositeProgrammeEventPage } from "../../../components/microsite";
import { findProgrammeItem, programmeItems } from "../../../components/microsite/data/programme";

type ProgrammeEventRouteProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return programmeItems.map((item) => ({ slug: item.slug }));
}

export default function ProgrammeEventRoutePage({ params }: ProgrammeEventRouteProps) {
  const item = findProgrammeItem(params.slug);
  if (!item) {
    notFound();
  }
  return <MicrositeProgrammeEventPage item={item} />;
}
