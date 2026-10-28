import Link from "next/link";
import ImageSlot from "../home/ImageSlot";
import { eventTypeLabel } from "../../data/programme";
import type { ProgrammeItem } from "../../data/programme";

/**
 * One event: a photograph (landscape on phones, portrait once the cards sit in
 * columns), its Bodoni title, and "Type • Host" beneath. The whole card opens the
 * event's own page.
 */
const ProgrammeCard = ({
  slug,
  titleItalic,
  titleRegular,
  type,
  host,
  cardImage,
  cardImageAlt,
}: ProgrammeItem) => (
  <Link
    href={`/microsite/programme/${slug}`}
    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon focus-visible:ring-offset-4"
  >
    <ImageSlot
      src={cardImage}
      alt={cardImageAlt}
      sizes="(min-width: 992px) 312px, (min-width: 576px) 50vw, 100vw"
      className="aspect-[358/278] lg:w-full sm:aspect-[3/4]"
      imageClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
    <h3 className="mt-[22px] font-Bodoni text-[24px] font-normal leading-[36px] text-s2s-ink transition-colors duration-300 group-hover:text-s2s-maroon">
      <span className="italic">{titleItalic}</span>
      {titleRegular}
    </h3>
    <p className="mt-[2px] text-[15px] leading-[25px] text-s2s-ink">
      {eventTypeLabel[type]}
      {host && ` • ${host}`}
    </p>
  </Link>
);

export default ProgrammeCard;
