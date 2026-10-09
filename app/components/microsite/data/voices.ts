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
  /** Where to anchor the crop, for portraits that are not in the cards' landscape shape. */
  imagePosition?: string;
  imageAlt: string;
};

// The biographies are placeholders until the real text arrives.
const loremBio: RichText = [
  { text: "Lorem ipsum", tone: "strong" },
  " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
];

const voice = (
  id: string,
  nameItalic: string,
  nameRegular: string,
  image?: string,
  imagePosition?: string
): Voice => ({
  id,
  nameItalic,
  nameRegular,
  bio: loremBio,
  image: image && `${S2S_ASSETS}/${image}`,
  imagePosition,
  imageAlt: `${nameItalic}${nameRegular}`.trim(),
});

export const voices: Voice[] = [
  voice("agus-ismoyo-nia-fliam", "Agus Ismoyo and ", "Nia Fliam", "voice-1.jpg"),
  voice("benny-adrianto", "Benny ", "Adrianto", "voice-2.jpg"),
  voice("krishnendu-bag", "Krishnendu ", "Bag", "voice-3.jpg"),
  // Reuses the team-section portrait, which is upright; keep the face in frame.
  voice("sushobhan-adhikary", "Sushobhan ", "Adhikary", "team-3.jpg", "50% 15%"),
  voice("oroon-das", "Oroon ", "Das", "voice-5.jpg"),
  voice("rudolf-smend", "Rudolf ", "Smend", "voice-6.jpg"),
  voice("maria-wronska-friend", "Dr. Maria Wronska", "-Friend", "voice-7.jpg"),
  voice("peter-lee", "Peter ", "Lee", "voice-8.jpg"),
  voice("sudhi-ranjan-mukherjee", "Sudhi Ranjan ", "Mukherjee", "voice-9.jpg"),
];
