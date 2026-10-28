import type { RichText } from "../types";
import { S2S_ASSETS } from "./home";

/** The event types, in the order the filter shows them (after "all"). */
export const eventTypes = ["workshop", "performance", "talk", "tour"] as const;

export type EventType = (typeof eventTypes)[number];

/** How a type reads under a card's title ("Workshop • Sabine Bolk"). */
export const eventTypeLabel: Record<EventType, string> = {
  workshop: "Workshop",
  performance: "Performance",
  talk: "Talk",
  tour: "Tour",
};

/** Only workshops have an "About the expert" section; the other types show the event details alone. */
export const typesWithExpert: readonly EventType[] = ["workshop"];

/**
 * One paragraph of an event's text: plain text in quotes, or, when part of it
 * should be bold, a list of pieces, e.g. ["A workshop with ", { text: "Sabine Bolk", tone: "strong" }, "."].
 */
export type Paragraph = string | RichText;

export type ProgrammeItem = {
  /** The event's address: /microsite/programme/<slug>. Lowercase words joined by hyphens, unique per event. */
  slug: string;
  /** The title splits into a Bodoni italic part and an upright part, e.g. "Batik " + "the Dutch Way". */
  titleItalic: string;
  titleRegular: string;
  /** One of the filter types above, written exactly as there: "workshop", "performance", "talk" or "tour". */
  type: EventType;
  /** Shown as "Workshop • <host>" and "With <host>"; leave it "" when there is none and both are left out. */
  host: string;
  /** The photograph on the event's own page. */
  image?: string;
  imageAlt: string;
  /** The listing card's photograph, which the design shows as a different picture. */
  cardImage?: string;
  cardImageAlt: string;
  /** The info table under the title shows Venue, Date and Timings... */
  venue?: string;
  date?: string;
  timings?: string;
  /** ...unless an event lists its own rows here instead, e.g. a tour's Dates, Duration, Stay and Departure. */
  facts?: { label: string; value: string }[];
  /** Ticket price in rupees, as a plain number (2000, not "₹ 2,000.00")... */
  price?: number;
  /** ...or several prices, each with its note, e.g. twin sharing and single occupancy.
      `ticketType` names the option in the cart and the booking list: lowercase words
      joined by hyphens, unique within the event. */
  prices?: { amount: number; note: string; ticketType: string }[];
  /** How many tickets the event has in all. Kept for booking; not shown on the page yet. */
  tickets?: number;
  /** "Event details": one entry per paragraph. */
  details: Paragraph[];
  /** The "All registered participants will receive:" list under the details. Leave it out if the event has none. */
  includes?: {
    /** A line just above the heading, e.g. a note about student prices. */
    before?: Paragraph;
    heading: string;
    items: string[];
    /** Lines just below the list, e.g. a note about meals, or a link to the schedule. */
    after?: Paragraph[];
  };
  /** "About the expert": one entry per paragraph. Workshops only; performances and talks never show it. */
  aboutHost?: Paragraph[];
};

/** The ticket type of an event booked at its single `price`. */
export const STANDARD_TICKET_TYPE = "standard";

export const programmeHero = {
  image: `${S2S_ASSETS}/programme-hero.jpg`,
  imageAlt: "A speaker addressing a full house on tiered seating",
};

/** The short introduction under the photograph; the page leaves it out while empty. */
export const programmeIntro = "";

// The photographs are not final, so every event uses the design's stand-ins for
// now. When an event's own photos arrive, replace this line in that event with
// its own image / imageAlt / cardImage / cardImageAlt.
const standInPhotos = {
  image: `${S2S_ASSETS}/programme-event.jpg`,
  imageAlt: "A batik painting of a woman reading",
  cardImage: `${S2S_ASSETS}/programme-card.jpg`,
  cardImageAlt: "Sabine Bolk holding up a batik cloth",
};

// The seven events, in the order the programme page lists them.
export const programmeItems: ProgrammeItem[] = [
  // ─── Event 1 ───────────────────────────────────────────────────────────────
  {
    slug: "event-1",
    titleItalic: "Sarong to Sari: ",
    titleRegular: "Symposium",
    type: "talk",
    host: "",
    image: `${S2S_ASSETS}/Symposium.jpg`,
    imageAlt: "Sarong to Sari: Symposium",
    cardImage: `${S2S_ASSETS}/Symposium.jpg`,
    cardImageAlt: "Sarong to Sari: Symposium",
    venue:
      " Kolkata Centre for Creativity, 777 Anandapur, E.M. Bypass Kolkata – 700107, India",
    date: " 22 January 2027 & 23 January 2027 (Friday- Saturday)",
    timings: "10:00 AM – 6:00 PM",
    price: 15000,
    details: [
      "Sarong to Sari: Batik as Form, Memory and Asian Consciousness is a two-day international symposium that explores batik as a medium of cultural exchange, artistic practice, and intellectual dialogue between India and Indonesia.",
    ],
    includes: {
      before: [
        {
          text: "*Students reach out to us with a valid ID to avail the special price.",
          tone: "strong",
        },
      ],
      heading: "All registered participants will receive:",
      items: [
        "Symposium kit bag (including brochures and stationery) & Participant Badge",
        "Morning tea/coffee and snacks",
        "Lunch",
        "Evening tea/coffee and snacks",
      ],
      after: [
        "(The meals provided during both days of the symposium will be vegetarian.)",
        [
          {
            text: "Preview Speakers and Symposium Schedule",
            tone: "strong",
            href: `${S2S_ASSETS}/symposium.pdf`,
          },
        ],
      ],
    },
  },

  // ─── Event 2 ───────────────────────────────────────────────────────────────
  {
    slug: "event-2",
    titleItalic: "Batik, ",
    titleRegular: "the Dutch Way",
    type: "workshop",
    host: "Sabine Bolk",
    image: `${S2S_ASSETS}/Sabine_Bolk.jpg`,
    imageAlt: "Portrait of Sabine Bolk",
    cardImage: `${S2S_ASSETS}/Sabine_Bolk.jpg`,
    cardImageAlt: "Portrait of Sabine Bolk",
    venue: "Terrace, Kolkata Centre for Creativity (KCC)",
    date: "Sunday, 7 February 2027",
    timings: "11:00 AM – 5:00 PM",
    price: 2000,
    details: [
      [
        "A ",
        {
          text: "one-day workshop",
          tone: "italic",
        },
        " with Dutch artist and batik researcher ",
        { text: "Sabine Bolk", tone: "strong" },
        ", tracing the European hand in batik's history: colonial trade routes, motifs borrowed and reworked, and the practice of designer Bertha Bake. Participants work batik directly on textile, learning the wax-resist technique while considering how a craft rooted in Java came to absorb ",
        {
          text: "patterns like the Dutch tea cosy",
          tone: "italic",
        },
        ". The day moves between ",
        {
          text: "history and hands-on making",
          tone: "italic",
        },
        ", and each participant leaves with a piece of cloth they've batiked themselves.",
      ],
    ],
    includes: {
      heading: "All registered participants will receive:",
      items: ["Workshop materials", "Lunch and tea/coffee breaks"],
    },
    aboutHost: [
      "Sabine Bolk (b. 1984) is a Dutch artist and batik researcher whose work examines batik history, colonial influence on the craft, and the meaning behind its motifs. She writes, speaks, and leads workshops internationally to promote and preserve batik practice, and documents her research on her blog, The Journey to Batik. She has travelled frequently to Southeast Asia since 2009. In 2019, she launched her research project Retelling the History of the (Indo-)European Influence on Batik in Indonesia, and from 2019 to 2021 was a Research Associate at the Research Center for Material Culture in Leiden, studying Dutch museum and archive collections of batik. In 2023, she curated Masa Depan Batik | Future of Batik at Erasmus Huis, Jakarta, alongside six batik makers. She is currently working on a batik exhibition and research project at the Kunstmuseum, The Hague, drawing on its collection of batik worn in the former Dutch East Indies and batik made in the Netherlands during the Art Nouveau period.",
    ],
  },

  // ─── Event 3 ───────────────────────────────────────────────────────────────
  {
    slug: "event-3",
    titleItalic: "Curated Tour: ",
    titleRegular: "Santiniketan, India",
    type: "tour",
    host: "",
    image: `${S2S_ASSETS}/Santiniketan.jpg`,
    imageAlt: "A batik painting of a woman reading",
    cardImage: `${S2S_ASSETS}/Santiniketan.jpg`,
    cardImageAlt: "Sabine Bolk holding up a batik cloth",
    facts: [
      { label: "Dates", value: "24 – 25 January 2027 (Sunday- Monday)" },
      { label: "Duration", value: "1 night, 2 days" },
      { label: "Stay", value: "The Creek Resorts, Santiniketan" },
      { label: "Departure & return", value: "Howrah Railway Station, Kolkata" },
    ],
    prices: [
      {
        amount: 18000,
        note: "per person, twin sharing (GST included)",
        ticketType: "twin-sharing",
      },
      {
        amount: 25000,
        note: "per person for single occupancy, including private room and a personal car with driver",
        ticketType: "single-occupancy",
      },
    ],
    details: [
      [
        "A ",
        { text: "two-day", tone: "italic" },
        " journey to Santiniketan for the opening of Sarong to Sari, an exhibition tracing the textile conversations between Indonesia and Bengal. The trip includes the inaugural programme at Arthshila, the exhibition opening at Nandan Museum, Visva-Bharati, and time with the artists, scholars and collectors behind it. For the first time in the last century, Nandan Museum will display objects brought from Java by Rabindranath Tagore in 1927.",
      ],
      [
        {
          text: "Santiniketan is where Indonesian batik found a second home.",
          tone: "italic",
        },
        " In the early twentieth century, Rabindranath Tagore's travels to Java and Bali brought the technique back to Kala Bhavana, where it took on a new life as Santiniketan batik. This curated trip follows that thread from Kolkata to Santiniketan over two days.",
      ],
      // "here" opens the itinerary PDF in a new tab (its file name has a space, hence the encoding).
      [
        "View the two-day Itinerary ",
        {
          text: "here",
          tone: "strong",
          href: `${S2S_ASSETS}/${encodeURIComponent("Santiniketan Itinerary.pdf")}`,
        },
      ],
      "The package covers return Vande Bharat train travel from Howrah, one night at The Creek Resorts, Santiniketan, all meals, local transport by car and toto, and all curated visits and experiences.",
    ],
  },

  // ─── Event 4 ───────────────────────────────────────────────────────────────
  {
    slug: "event-4",
    titleItalic: "Creating ",
    titleRegular: "Contemporary Batik",
    type: "workshop",
    host: "Kartik Manna",
    image: `${S2S_ASSETS}/Kartik_Manna.jpg`,
    imageAlt: "Portrait of Kartik Manna",
    cardImage: `${S2S_ASSETS}/Kartik_Manna.jpg`,
    cardImageAlt: "Portrait of Kartik Manna",
    venue: "Terrace, Kolkata Centre for Creativity (KCC)",
    date: "22 – 25 March 2027",
    timings: "11:00 AM – 5:00 PM",
    price: 5000,
    tickets: 25,
    details: [
      [
        "A ",
        {
          text: "four-day",
          tone: "italic",
        },
        " four-day hands-on workshop with batik artist Kartik Manna, exploring the ",
        {
          text: "fundamentals of contemporary batik",
          tone: "italic",
        },
        ". Participants will work through the process from ",
        {
          text: "developing original designs",
          tone: "italic",
        },
        " and making khakha to waxing, layering colours, de-waxing and revealing the final design. The workshop will introduce traditional batik techniques while ",
        {
          text: "encouraging experimentation",
          tone: "italic",
        },
        " with contemporary motifs and photographic references. Participants will also learn basic colour theory and ways of presenting finished batik work.",
      ],
    ],
    includes: {
      heading: "All registered participants will receive:",
      items: ["Workshop materials", "Lunch and tea/coffee"],
    },
    aboutHost: [
      "Kartik Manna is a batik artist and the founder of Shunya, an organisation based in Purba Medinipur, West Bengal. Established in 2004, Shunya works with village artisans on batik and Kantha stitch. The organisation produces sarees, stoles, dupattas, and other textile pieces on handwoven fabric made in-house. Kartik has worked to promote and sustain batik as a craft in rural Bengal, while creating opportunities for artisans through craft-based livelihoods. His work has been presented by designers and organisations at events and shows, and Shunya's products have also reached markets in the US and UK.",
    ],
  },

  // ─── Event 5 ───────────────────────────────────────────────────────────────
  {
    slug: "event-5",
    titleItalic: "Batik ",
    titleRegular: "in Natural Dyes",
    type: "workshop",
    host: "Krishnendu Bag",
    image: `${S2S_ASSETS}/Krishnedu_Bag.jpg`,
    imageAlt: "Portrait of Krishnendu Bag",
    cardImage: `${S2S_ASSETS}/Krishnedu_Bag.jpg`,
    cardImageAlt: "Portrait of Krishnendu Bag",
    venue: "Terrace, Kolkata Centre for Creativity (KCC)",
    date: "15 – 18 February 2027",
    timings: "11:00 AM – 5:00 PM",
    price: 5000,
    tickets: 25,
    details: [
      [
        "A ",
        {
          text: "four-day",
          tone: "italic",
        },
        " batik workshop with artist and educator Krishnendu Bag, designed for those interested in batik but without formal training in it. Working only with natural dyes, this workshop will provide a ",
        {
          text: "hands-on approach",
          tone: "italic",
        },
        ", allowing participants to directly experience the ",
        {
          text: "preparation of natural dye",
          tone: "italic",
        },
        ", the creation of batik designs, and the application and removal of wax. The workshop will also cover the ",
        {
          text: "finer techniques",
          tone: "italic",
        },
        " and considerations involved in batik-making, reflecting its position as a demanding yet rewarding craft shaped by both tradition and individual expression.",
      ],
    ],
    includes: {
      heading: "All registered participants will receive:",
      items: ["Workshop materials", "Lunch and tea/coffee"],
    },
    aboutHost: [
      "Krishnendu Bag is an Indian artist, educator and master artisan with nearly four decades of experience working with India's heritage crafts. An alumnus of Visva-Bharati University, he earned his Bachelor of Fine Arts (B.Fine) in Design in 1984, receiving top institutional scholarships and advanced training at the Weavers Service Centre in Varanasi. In April 2003, he joined the faculty of Kala Bhavana, mentoring generations of contemporary designers for a distinguished nineteen years while keeping the foundational art philosophies of Rabindranath Tagore alive. His academic instruction integrated traditional rural arts into modern curricula, with a focus on textile design, decorative heritage arts, Alpana, and eco-conscious spatial design through the cultivation of Bonsai. Following his retirement from the university in August 2022, he has transitioned into a highly sought-after independent consultant and craft conservationist, continuing to shape the Indian art landscape by collaborating with premier cultural organisations to conduct public masterclasses.",
    ],
  },

  // ─── Event 6 ───────────────────────────────────────────────────────────────
  {
    slug: "event-6",
    titleItalic: "Alpona ",
    titleRegular: "Making Workshop",
    type: "workshop",
    host: "Sudhiranjan Mukherjee",
    image: `${S2S_ASSETS}/Sudhiranjan_Mukherjee.jpg`,
    imageAlt: "Portrait of Sudhiranjan Mukherjee",
    cardImage: `${S2S_ASSETS}/Sudhiranjan_Mukherjee.jpg`,
    cardImageAlt: "Portrait of Sudhiranjan Mukherjee",
    venue: "Terrace, Kolkata Centre for Creativity (KCC)",
    date: "5 & 6 February 2027",
    timings: "11:00 AM – 5:00 PM",
    price: 3500,
    details: [
      [
        "A ",
        {
          text: "two-day",
          tone: "italic",
        },
        " workshop with artist and designer Sudhiranjan Mukherjee, introducing participants to the traditions of ",
        {
          text: "Bengal and Santiniketan Alpona",
          tone: "italic",
        },
        ". The workshop will open with a talk on Brata Alpana of Bengal and the history and concept of Santiniketan Alpana, followed by a demonstration. Participants will learn the principles of layout and composition, developing their own designs on paper before translating them into Alpona.",
      ],
      [
        "The second day will look at the ",
        {
          text: "relationship between Java Batik and Santiniketan Alpona",
          tone: "italic",
        },
        ", including its influence on Santiniketan Batik. Participants will complete their Alpona works and have an opportunity to discuss their work and ask questions.",
      ],
    ],
    includes: {
      heading: "All registered participants will receive:",
      items: ["Workshop materials", "Lunch and tea/coffee"],
    },
    aboutHost: [
      "Sudhiranjan Mukherjee is an artist and designer based in Santiniketan. He completed his Bachelor's and Master's degrees in Painting from Rabindra Bharati University. He was a National Cultural Scholar in Painting at Kala Bhavana, Visva-Bharati, under Professor Dinkar Kowshik. He later trained in Applied Art at the National Council of Science Museums, Kolkata. From 1983 to 2017, he served as Assistant Lecturer in Painting and Design at Uttar Siksha Sadana and Siksha Satra, Visva-Bharati, where he created Alpona for various functions and festivals, and worked on stagecraft, stage decoration, costumes, and ornaments for Tagore dance-dramas. He has conducted numerous workshops on Alpona, Sora painting, and mask making, and has exhibited his work across India from 1981 to 2023. His work has been recognised through international awards from Shankar's International Painting Competitions in Delhi and France. He has led workshops, demonstrations, and lectures on Alpona and stagecraft internationally, including at the Tagore Festival in New Jersey, USA (2017) and the North America Bengali Conference in Las Vegas (2022).",
    ],
  },

  // ─── Event 7 ───────────────────────────────────────────────────────────────
  {
    slug: "event-7",
    titleItalic: "Batik Across Cultures: ",
    titleRegular: "An Introduction to Indonesian Wax Resist",
    type: "workshop",
    host: "Komarudin Kudiya",
    image: `${S2S_ASSETS}/Komarudin_Kudiya.jpg`,
    imageAlt: "Portrait of Komarudin Kudiya",
    cardImage: `${S2S_ASSETS}/Komarudin_Kudiya.jpg`,
    cardImageAlt: "Portrait of Komarudin Kudiya",
    venue: "Terrace, Kolkata Centre for Creativity (KCC)",
    date: "27 & 28 January 2027",
    timings: "11:00 AM – 5:00 PM (Includes lunch and tea breaks)",
    price: 3500,
    // The full description is still to come; until then only this line shows.
    details: [
      [
        "A ",
        {
          text: "two-day",
          tone: "italic",
        },
        " workshop.",
      ],
    ],
    includes: {
      heading: "All registered participants will receive:",
      items: ["Workshop materials", "Lunch and tea/coffee"],
    },
    aboutHost: [
      "Dr H. Komarudin Kudiya, widely known as Komar, is an Indonesian academic, designer, researcher, and entrepreneur, and a prominent advocate for the preservation and development of Indonesian batik. Born in Cirebon in 1968, he holds a Master's and Doctoral degree in Design from the Institut Teknologi Bandung (ITB). Since 1998, he has run Batik Komar, where he has worked to bring together traditional batik craftsmanship with contemporary design and technology. He teaches at Universitas Muhammadiyah Bandung and has also taught at Institut Teknologi Bandung and Telkom University, in areas including hand-drawn and block-printed batik, batik painting, natural dyes, and creative entrepreneurship. He holds several leadership positions in Indonesian batik advocacy, including Chairman of the Expert Council of the Indonesian Batik Foundation (YBI) and General Chairman of the Association of Indonesian Batik Craftsmen and Entrepreneurs (APPBI). He has authored or contributed to 25 books on batik and holds over 200 copyright certificates related to his design work.",
    ],
  },
];

export const findProgrammeItem = (slug: string) =>
  programmeItems.find((item) => item.slug === slug);

/** The event's title as one line: "Batik, the Dutch Way". */
export const programmeTitle = (item: ProgrammeItem) =>
  `${item.titleItalic}${item.titleRegular}`.trim();

/** One ticket type's price and note, looked up for display only (never stored). */
export const findTicketOption = (item: ProgrammeItem, ticketType: string) => {
  if (item.prices) {
    return item.prices.find((option) => option.ticketType === ticketType);
  }
  if (ticketType === STANDARD_TICKET_TYPE && item.price !== undefined) {
    return { amount: item.price, note: "", ticketType };
  }
  return undefined;
};
