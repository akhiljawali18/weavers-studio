import type { RichText } from "../types";

/**
 * Content for the Sarong to Sari home page, copied from the Figma file.
 *
 * Every `src`/`image` left undefined is a photo still waiting to be supplied
 * (portraits of Peter Lee, Subham China and Kavita N. Patel, so far). The page
 * draws a neutral block of the right size in its place, so filling one in is a
 * one-line change here and nothing else moves.
 *
 * The video posters are stills taken from the videos themselves.
 */

export const S2S_ASSETS = "/images/sarong-to-sari";

export const heroIntro: RichText = [
  "An ",
  { text: "exhibition", tone: "strong" },
  " tracing how ",
  { text: "batik", tone: "strong" },
  " crossed the Bay of Bengal from the courts of ",
  { text: "Java", tone: "strong" },
  " to the studios of ",
  { text: "Santiniketan", tone: "strong" },
  ", carried by ",
  { text: "Rabindranath Tagore's 1927 voyage.", tone: "accent" },
];

export const heroVideo: { src?: string; poster?: string } = {
  src: `${S2S_ASSETS}/hero-video.mp4`,
  poster: `${S2S_ASSETS}/hero-poster.jpg`,
};

export const exhibitionVenues = [
  {
    dates: "Thursday, 21 January to Wednesday, 31 March 2027",
    venue: "at Kolkata Centre for Creativity, Kolkata, India",
  },
  {
    dates: "Saturday, 24 January to Sunday, 4 April 2027",
    venue: "at Arthshila, Santiniketan, India",
  },
  {
    dates: "Monday, 25 January to Friday, 26 February 2027",
    venue: "at Nandan Museum, Visva-Bharati, Santiniketan, India",
  },
];

export type SnippetVideo = {
  title: string;
  src?: string;
  poster?: string;
};

export const snippetVideos: SnippetVideo[] = [
  {
    title: "Behind the scenes: Kolkata",
    src: `${S2S_ASSETS}/snippet-1.mp4`,
    poster: `${S2S_ASSETS}/snippet-1-poster.jpg`,
  },
  {
    title: "Behind the scenes: Santiniketan",
    src: `${S2S_ASSETS}/snippet-2.mp4`,
    poster: `${S2S_ASSETS}/snippet-2-poster.jpg`,
  },
  {
    title: "First thoughts with Darshan Shah",
    src: `${S2S_ASSETS}/snippet-3.mp4`,
    poster: `${S2S_ASSETS}/snippet-3-poster.jpg`,
  },
  {
    title: "First thoughts with Peter Lee and Oroon Das",
    src: `${S2S_ASSETS}/snippet-4.mp4`,
    poster: `${S2S_ASSETS}/snippet-4-poster.jpg`,
  },
];

export const voyageImage: { src?: string; alt: string } = {
  src: `${S2S_ASSETS}/tagore-portrait.jpg`,
  alt: "Batik portrait of Rabindranath Tagore",
};

export const voyageIntro: RichText = [
  "In ",
  { text: "1927", tone: "strong" },
  " Rabindranath Tagore travelled to the ",
  { text: "Indonesian islands of Java and Bali", tone: "strong" },
  ". On his return to Santiniketan, he ",
  { text: "introduced batik", tone: "strong" },
  ", Javanese court dances, and a cycle of agrarian festivals modelled on Balinese ritual. The ",
  { text: "year 2027 marks the centenary", tone: "strong" },
  " of that visit.",
];

export const voyageParagraphs: RichText[] = [
  [
    "For Tagore, art and culture were how people of different backgrounds could meet and understand one another. ",
    { text: "Visva-Bharati", tone: "strong" },
    ' was founded on the idea of a place "',
    { text: "where the world makes a home in a single nest", tone: "accent" },
    '", and he was especially drawn to building a pan-Asian alliance through living cultural traditions. In his lifetime, ',
    { text: "Santiniketan welcomed artists from Indonesia, Japan, Burma and China.", tone: "strong" },
  ],
  [
    { text: "Sarong to Sari", tone: "strong" },
    " takes the batik technique as its thread. Brought from ",
    { text: "Java to Santiniketan", tone: "strong" },
    " in 1927, batik soon grew into a distinct Bengali tradition and remains the clearest surviving expression of Tagore's vision of ",
    { text: "pan-Asian exchange", tone: "strong" },
    ". The exhibition and its programmes bring batik practitioners from several countries together, and invite a wider audience to consider what Tagore's ideas still offer today.",
  ],
];

export const tagoreQuote = {
  text: "“I found myself at home in the heart of a rich atmosphere of beauty wafting from the land of my ancestors, and the two great cultures were linked in my own life.”",
  attribution: "— Rabindranath Tagore, 1927",
  background: `${S2S_ASSETS}/quote-bg.jpg` as string | undefined,
};

export const galleriesIntro =
  "The exhibition unfolds across four galleries from the Javanese world of batik, through Tagore's vision and its reinvention at Kala Bhavana, to the lived tradition of Santiniketan and its unfinished life today.";

export type Gallery = {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  imageAlt: string;
};

export const galleries: Gallery[] = [
  {
    title: "I — The Voyage and a Quest Dubbed Sacred",
    description:
      "In 1927, Tagore sailed to Java and Bali on a pilgrimage to Asia's ancient roots, as a nation-in-waiting searched for its cultural self.",
    image: `${S2S_ASSETS}/gallery-1.jpg`,
    imageAlt: "Map of Rabindranath Tagore's 1927 journey to Java and Bali",
  },
  {
    title: "II — The Encounter and the Reckoning",
    description:
      "In Java, Tagore finds a culture wholly its own yet resonant with India, where Batik layers technique, symbolism and identity in cloth.",
    image: `${S2S_ASSETS}/gallery-2.jpg`,
    imageAlt: "A Javanese court pavilion lit by chandeliers",
  },
  {
    title: "III — Transplanting the Source Material",
    subtitle: "Transformation & Collectivity",
    description:
      "At Santiniketan, wax-resist technique mingled with Alpona, Ajanta and rural Bengal, and a new vocabulary travelled from Kala Bhavana and Karu Sangha into homes and celebrations.",
    image: `${S2S_ASSETS}/gallery-3.jpg`,
    imageAlt: "A young student painting a batik design with a fine brush",
  },
  {
    title: "IV — The Pilgrim's Truth",
    subtitle: "Cultural Reconciliation and Humanism",
    description:
      "Nearly a century on, Batik is a shared inheritance, proof that traditions live through encounter, and a prompt to imagine a more connected future.",
    image: `${S2S_ASSETS}/gallery-4.jpg`,
    imageAlt: "Rabindranath Tagore seated at the centre of a large gathering",
  },
];

export type ProgrammeEvent = {
  titleItalic: string;
  titleRegular: string;
  lines: RichText[];
  href: string;
};

// The design pages through three events; only the first is written out in Figma.
export const programmeEvents: ProgrammeEvent[] = [
  {
    titleItalic: "Exhibition Opening",
    titleRegular: "and Book Launch",
    lines: [
      ["Inauguration of Sarong to Sari exhibition and book,"],
      ["followed by a cultural presentation."],
      ["Kolkata Centre for Creativity (KCC), Kolkata"],
      [],
      ["Opening & Book Launch on ", { text: "Thursday, 21 January, 2027", tone: "strong" }],
      ["Exhibition continues till ", { text: "31 March 2027", tone: "strong" }, " in Kolkata"],
    ],
    href: "/microsite/programme",
  },
];

export const programmeImage: { src?: string; alt: string } = {
  src: `${S2S_ASSETS}/event-photo.jpg`,
  alt: "Guests seated at the exhibition opening",
};

export type TeamMember = {
  nameItalic: string;
  nameRegular: string;
  role: string;
  bio: RichText;
  image?: string;
};

export const team: TeamMember[] = [
  {
    nameItalic: "Darshan ",
    nameRegular: "Shah",
    role: "Curator",
    image: `${S2S_ASSETS}/team-1.jpg`,
    bio: [{ text: "Founder Trustee", tone: "strong" }, ", Weavers Studio Resource Centre, Kolkata, India"],
  },
  {
    nameItalic: "Dr. Maria Wronska",
    nameRegular: "-Friend",
    role: "Curator",
    image: `${S2S_ASSETS}/team-2.jpg`,
    bio: [{ text: "Adjunct Senior Research Fellow", tone: "strong" }, ", James Cook University in Cairns"],
  },
  {
    nameItalic: "Sushobhan ",
    nameRegular: "Adhikary",
    role: "Co-curator",
    image: `${S2S_ASSETS}/team-3.jpg`,
    bio: [{ text: "Artist, Art historian", tone: "strong" }, ", former curator of Kala Bhavana Museum"],
  },
  // The four below are not in the Figma file; they come from the prototype recording.
  {
    nameItalic: "Peter ",
    nameRegular: "Lee",
    role: "Mentor",
    bio: [{ text: "Independent Curator", tone: "strong" }, ", founding curator of the NUS Baba House"],
  },
  {
    nameItalic: "Oroon ",
    nameRegular: "Das",
    role: "Exhibition designer",
    image: `${S2S_ASSETS}/voice-5.jpg`,
    bio: [{ text: "Multidisciplinary artist, performer, scenographer, and designer", tone: "strong" }],
  },
  {
    nameItalic: "Subham ",
    nameRegular: "China",
    role: "Co-curator",
    bio: [{ text: "PhD at the Department of International Relations", tone: "strong" }, ", Jadavpur University, Kolkata"],
  },
  {
    nameItalic: "Kavita ",
    nameRegular: "N. Patel",
    role: "Assistant project director",
    bio: [{ text: "Assistant Project Director", tone: "strong" }, ", Weavers Studio Resource Centre"],
  },
];

export type PartnerLogo = {
  name: string;
  width: number;
  height: number;
  src?: string;
};

export const partners = {
  presentedBy: { name: "Weavers Studio Resource Centre", src: `${S2S_ASSETS}/partner-wsrc.jpg`, width: 207, height: 114 },
  presentingPartner: { name: "Garden Vareli", src: `${S2S_ASSETS}/partner-garden-vareli.jpg`, width: 161, height: 85 },
  supportedBy: [
    { name: "Emami Foundation", src: `${S2S_ASSETS}/partner-emami.jpg`, width: 256, height: 24 },
    { name: "MPJ Jewellers", src: `${S2S_ASSETS}/partner-mpj.jpg`, width: 99, height: 100 },
  ],
  collaboration: [
    { name: "Indonesia India: Mitra Selamanya, Partners Forever", src: `${S2S_ASSETS}/partner-indonesia.jpg`, width: 256, height: 52 },
    { name: "Kingdom of the Netherlands", src: `${S2S_ASSETS}/partner-netherlands.jpg`, width: 187, height: 110 },
  ],
  venues: [
    { name: "Kolkata Centre for Creativity", src: `${S2S_ASSETS}/partner-kcc.jpg`, width: 256, height: 80 },
    { name: "Arthshila Santiniketan", src: `${S2S_ASSETS}/partner-arthshila.png`, width: 159, height: 80 },
  ],
} satisfies Record<string, PartnerLogo | PartnerLogo[]>;

// Placeholder heading carried over from the design.
export const communityArchiveTitle = "Title goes here";

export const testimonials = [
  {
    attribution: "Ina Puri | Author",
    quote:
      '"It all began with a casual visit to the store\'s original address where I remember being quite delighted to find many beautiful weaves...thereafter Weavers Studio became a frequent haunt, each time there is something new to admire and acquire!"',
  },
];

export type ArchiveItem = {
  imageAlt: string;
  caption: RichText;
  image?: string;
};

// The design repeats one placeholder caption under every photo; it is kept as-is
// until the real captions are written.
const placeholderCaption: RichText = [
  "Artist ",
  { text: "Paresh Maity", tone: "accent" },
  " wears our bespoke ",
  { text: "Patchwork Kurta", tone: "maroon" },
  ", its jewel-toned patches making a statement.",
];

export const communityArchive: ArchiveItem[] = [
  { image: `${S2S_ASSETS}/community-1.jpg`, imageAlt: "Paresh Maity", caption: placeholderCaption },
  { image: `${S2S_ASSETS}/community-2.jpg`, imageAlt: "Shabana Azmi", caption: placeholderCaption },
  { image: `${S2S_ASSETS}/community-3.jpg`, imageAlt: "Sharmila Tagore", caption: placeholderCaption },
  { image: `${S2S_ASSETS}/community-4.jpg`, imageAlt: "Community archive photograph", caption: placeholderCaption },
  { image: `${S2S_ASSETS}/community-5.jpg`, imageAlt: "Community archive photograph", caption: placeholderCaption },
  { image: `${S2S_ASSETS}/community-6.jpg`, imageAlt: "Community archive photograph", caption: placeholderCaption },
];
