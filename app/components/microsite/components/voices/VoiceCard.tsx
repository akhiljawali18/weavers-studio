"use client";

import { useId, useState } from "react";
import ImageSlot from "../home/ImageSlot";
import RichText from "../home/RichText";
import type { Voice } from "../../data/voices";

/**
 * One artist, scholar or curator: portrait, name, and a biography cut to three
 * lines that "read more" opens in place.
 */
const VoiceCard = ({ nameItalic, nameRegular, bio, image, imagePosition, imageAlt }: Voice) => {
  const [expanded, setExpanded] = useState(false);
  const bioId = useId();

  return (
    <article>
      <ImageSlot
        src={image}
        alt={imageAlt}
        sizes="(min-width: 992px) 30vw, (min-width: 576px) 50vw, 100vw"
        className="aspect-[1267/1089] w-full"
        objectPosition={imagePosition}
      />
      <h2 className="mt-6 font-Bodoni text-[22px] font-normal leading-[28px] text-s2s-maroon">
        <span className="italic">{nameItalic}</span>
        {nameRegular}
      </h2>
      <p id={bioId} className={`mt-2 text-[14px] leading-[25px] text-s2s-ink ${expanded ? "" : "line-clamp-3"}`}>
        <RichText content={bio} />
      </p>
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={bioId}
        className="mt-[10px] inline-flex items-center gap-[6px] rounded-sm text-[13px] leading-[16px] text-s2s-gold transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-gold"
      >
        {expanded ? "read less" : "read more"}
        <span aria-hidden className="text-[16px] leading-none">
          {expanded ? "−" : "+"}
        </span>
      </button>
    </article>
  );
};

export default VoiceCard;
