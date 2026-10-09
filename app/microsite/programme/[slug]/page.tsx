import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MicrositeProgrammeEventPage } from "../../../components/microsite";
import { findProgrammeItem, programmeItems } from "../../../components/microsite/data/programme";

type ProgrammeEventRouteProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: ProgrammeEventRouteProps): Metadata {
  const item = findProgrammeItem(params.slug);
  return item ? { title: `${item.titleItalic}${item.titleRegular}`.trim() } : {};
}

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
