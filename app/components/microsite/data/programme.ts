import type { RichText } from "../types";
import { S2S_ASSETS } from "./home";

/** Filter labels exactly as the design writes them, in its order. */
export const eventTypes = [
  "workshop",
  "talks",
  "theatre",
  "music performance",
  "symposium",
  "dance performance",
  "film screening",
] as const;

export type EventType = (typeof eventTypes)[number];

/** How a type reads under a card's title ("Workshop • Sabine Bolk"). */
export const eventTypeLabel: Record<EventType, string> = {
  workshop: "Workshop",
  talks: "Talk",
  theatre: "Theatre",
  "music performance": "Music performance",
  symposium: "Symposium",
  "dance performance": "Dance performance",
  "film screening": "Film screening",
};

export type ProgrammeItem = {
  /** The event's address: /microsite/programme/<slug>. */
  slug: string;
  /** The title splits into a Bodoni italic part and an upright part, e.g. "Batik " + "the Dutch Way". */
  titleItalic: string;
  titleRegular: string;
  type: EventType;
  host: string;
  image?: string;
  imageAlt: string;
  venue: string;
  date: string;
  timings: string;
  /** Ticket price in rupees. */
  price: number;
  details: RichText[];
  /** The "All registered participants will receive:" list under the details. */
  includes?: { heading: string; items: string[] };
  aboutHost: RichText[];
};

// Stand-in pictures and copy until the real ones arrive; the photographs are
// borrowed from the home page.
export const programmeHero = {
  image: `${S2S_ASSETS}/hero-poster.jpg`,
  imageAlt: "An audience gathered for a talk",
};

/** The short introduction under the photograph; the page leaves it out while empty. */
export const programmeIntro = "";

// The one event written out in the design, repeated to fill the grid.
const placeholder: Omit<ProgrammeItem, "slug"> = {
  titleItalic: "Batik ",
  titleRegular: "the Dutch Way",
  type: "workshop",
  host: "Sabine Bolk",
  image: `${S2S_ASSETS}/community-1.jpg`,
  imageAlt: "Sabine Bolk holding up a batik cloth",
  venue: "Terrace, Kolkata Centre for Creativity (KCC)",
  date: "Sunday, 7 February 2027",
  timings: "11:00 AM – 5:00 PM",
  price: 2000,
  details: [
    [
      "A one-day workshop with Dutch artist and batik researcher ",
      { text: "Sabine Bolk", tone: "strong" },
      ", tracing the European hand in batik's history: colonial trade routes, motifs borrowed and reworked, and the practice of designer Bertha Bake. Participants work batik directly on textile, learning the wax-resist technique while considering how a craft rooted in Java came to absorb patterns like the Dutch tea cosy. The day moves between history and hands-on making, and each participant leaves with a piece of cloth they've batiked themselves.",
    ],
  ],
  includes: {
    heading: "All registered participants will receive:",
    items: ["Workshop materials", "Lunch and tea/coffee breaks"],
  },
  aboutHost: [
    [
      "Sabine Bolk (b. 1984) is a Dutch artist and batik researcher whose work examines batik history, colonial influence on the craft, and the meaning behind its motifs. She writes, speaks, and leads workshops internationally to promote and preserve batik practice, and documents her research on her blog, The Journey to Batik. She has travelled frequently to Southeast Asia since 2009. In 2019, she launched her research project Retelling the History of the (Indo-)European Influence on Batik in Indonesia, and from 2019 to 2021 was a Research Associate at the Research Center for Material Culture in Leiden, studying Dutch museum and archive collections of batik. In 2023, she curated Masa Depan Batik | Future of Batik at Erasmus Huis, Jakarta, alongside six batik makers. She is currently working on a batik exhibition and research project at the Kunstmuseum, The Hague, drawing on its collection of batik worn in the former Dutch East Indies and batik made in the Netherlands during the Art Nouveau period.",
    ],
  ],
};

export const programmeItems: ProgrammeItem[] = Array.from({ length: 6 }, (_, index) => ({
  slug: `batik-the-dutch-way-${index + 1}`,
  ...placeholder,
}));

export const findProgrammeItem = (slug: string) => programmeItems.find((item) => item.slug === slug);
