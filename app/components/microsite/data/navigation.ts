import type { MicrositeNavItem } from "../types";

// The Sarong to Sari header. "the journey" is a section of the home page, so it is a
// fragment; the other links have pages of their own.
export const micrositeNavigation: MicrositeNavItem[] = [
  { label: "exhibition", href: "/microsite" },
  { label: "the journey", href: "/microsite#journey" },
  { label: "programme", href: "/microsite/programme" },
  { label: "voices", href: "/microsite/voices" },
  { label: "community archive", href: "/microsite/community-archive" },
];
