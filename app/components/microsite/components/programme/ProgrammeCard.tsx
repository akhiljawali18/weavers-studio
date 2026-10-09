import Link from "next/link";
import ImageSlot from "../home/ImageSlot";
import { eventTypeLabel } from "../../data/programme";
import type { ProgrammeItem } from "../../data/programme";

/**
 * One event: a portrait photograph, its Bodoni title, and "Type • Host" beneath.
 * The whole card opens the event's own page.
 */
const ProgrammeCard = ({ slug, titleItalic, titleRegular, type, host, image, imageAlt }: ProgrammeItem) => (
  <Link
    href={`/microsite/programme/${slug}`}
    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-4"
  >
    <ImageSlot
      src={image}
      alt={imageAlt}
      sizes="(min-width: 992px) 315px, (min-width: 576px) 50vw, 100vw"
      className="aspect-[3/4] w-full"
      imageClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
    <h3 className="mt-[25px] font-Bodoni text-[24px] font-normal leading-[30px] text-s2s-ink transition-colors duration-300 group-hover:text-s2s-maroon">
      <span className="italic">{titleItalic}</span>
      {titleRegular}
    </h3>
    <p className="mt-[7px] text-[15px] leading-[20px] text-s2s-ink">
      {eventTypeLabel[type]} • {host}
    </p>
  </Link>
);

export default ProgrammeCard;
