export type MicrositeNavItem = {
  label: string;
  href: string;
};

/**
 * Copy with inline emphasis, kept as data so the content files stay free of markup.
 * `strong` is the medium weight, `bold` the bold weight (the names in the Voices
 * biographies), `accent` the maroon Bodoni italic the design uses for names and
 * quotations, and `maroon` a plain colour change. A piece with an `href` is also a
 * link, opening in a new tab (e.g. "here" pointing at an itinerary PDF).
 */
export type RichTextTone = "strong" | "bold" | "accent" | "maroon";

export type RichText = Array<string | { text: string; tone: RichTextTone; href?: string }>;
