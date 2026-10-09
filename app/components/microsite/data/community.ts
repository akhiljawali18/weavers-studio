import type { RichText } from "../types";
import { S2S_ASSETS } from "./home";
import objectsJson from "./community-objects.json";

export type ArchiveFact = { label: string; value: string };

/**
 * One object as written in community-objects.json. Every object has the same
 * shape, so adding one is adding an entry to that file: the listing loops over
 * them and each gets its own page at /microsite/community-archive/<slug>.
 *
 * - `titleItalic` / `titleRegular`: the title split into its Bodoni italic and
 *   upright parts, e.g. "Batik" + " Sari".
 * - `images`: file names inside public/images/sarong-to-sari, in slider order;
 *   `null` holds the place of a photograph still to come.
 * - `attribution`: the spaced capitals under the title, one entry per line.
 * - `summary` / `description`: text with emphasis, in the RichText format
 *   (plain strings, or { "text": "…", "tone": "strong" | "accent" | "maroon" }).
 */
type ArchiveObjectRecord = {
  slug: string;
  titleItalic: string;
  titleRegular: string;
  technique: string;
  collection: string;
  date: string;
  images: (string | null)[];
  imageAlt: string;
  attribution: string[];
  facts: ArchiveFact[];
  summary: RichText;
  description: RichText[];
};

export type ArchiveObject = Omit<ArchiveObjectRecord, "images"> & {
  /** Full image paths; `undefined` is a photograph still to come. */
  images: (string | undefined)[];
};

export const archiveObjects: ArchiveObject[] = (objectsJson as ArchiveObjectRecord[]).map((record) => ({
  ...record,
  images: record.images.map((file) => (file ? `${S2S_ASSETS}/${file}` : undefined)),
}));

export const findArchiveObject = (slug: string) => archiveObjects.find((object) => object.slug === slug);

/** The fields the "all fields" menu can narrow a search to. */
export const searchFields = [
  { value: "all", label: "all fields" },
  { value: "title", label: "title" },
  { value: "technique", label: "technique" },
  { value: "collection", label: "collection" },
  { value: "date", label: "date" },
] as const;

export type SearchField = (typeof searchFields)[number]["value"];

export const communityIntro = [
  "Objects contributed by visitors, families and collectors.",
  "Explore the holdings and add your voice to each record.",
];

/** Techniques and collections, offered as suggestions in the search box ("pick a category"). */
export const archiveCategories = Array.from(
  new Set(archiveObjects.flatMap((object) => [object.technique, object.collection]))
);
