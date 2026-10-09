import type { MicrositeNavItem } from "../types";

// The Sarong to Sari header. "programme" and "voices" have their own pages; the
// other links after "exhibition" are sections of the home page, so they are fragments.
export const micrositeNavigation: MicrositeNavItem[] = [
  { label: "exhibition", href: "/microsite" },
  { label: "the journey", href: "/microsite#journey" },
  { label: "programme", href: "/microsite/programme" },
  { label: "voices", href: "/microsite/voices" },
  { label: "community archive", href: "/microsite#community-archive" },
];
