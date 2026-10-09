import type { RichText } from "../types";
import { S2S_ASSETS } from "./home";

export type Voice = {
  id: string;
  /** The name splits into a Bodoni italic part and an upright part, e.g. "Benny " + "Adrianto". */
  nameItalic: string;
  nameRegular: string;
  /** Lead with the person's name in `strong`, as the design does. */
  bio: RichText;
  image?: string;
  imageAlt: string;
};

// Placeholder content until the real names, biographies and portraits arrive:
// nine identical cards, enough to fill the design's three rows.
const placeholder: Omit<Voice, "id"> = {
  nameItalic: "Lorem ipsum ",
  nameRegular: "Dolor",
  bio: [
    { text: "Lorem ipsum", tone: "strong" },
    " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  ],
  image: `${S2S_ASSETS}/voice-1.jpg`,
  imageAlt: "Portrait",
};

export const voices: Voice[] = Array.from({ length: 9 }, (_, index) => ({
  id: `voice-${index + 1}`,
  ...placeholder,
}));
