"use client";

import { Fragment, useState } from "react";
import RichText from "./RichText";
import UnderlineLink from "./UnderlineLink";
import { bodyText, displayTitle } from "./typography";
import { ChevronRightIcon } from "../icons";
import type { ProgrammeEvent } from "../../data/home";

type EventsCarouselProps = {
  events: ProgrammeEvent[];
};

/** One programme at a time, with a "1 / 3 ›" pager that wraps back to the first. */
const EventsCarousel = ({ events }: EventsCarouselProps) => {
  const [index, setIndex] = useState(0);
  const event = events[index];

  return (
    <div aria-roledescription="carousel" aria-label="Programmes and events">
      <div className="flex items-center justify-center gap-[10px] text-[16px] leading-[19px] text-s2s-ink">
        <span aria-live="polite">
          {index + 1} / {events.length}
        </span>
        {events.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % events.length)}
            aria-label="Next event"
            className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
          >
            <ChevronRightIcon className="h-[16px] w-[16px]" />
          </button>
        )}
      </div>

      <h3 className={`mt-7 text-center ${displayTitle}`}>
        <span className="italic">{event.titleItalic}</span>
        <br />
        {event.titleRegular}
      </h3>

      <p className={`mt-9 lg:px-[47px] ${bodyText}`}>
        {event.lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            <RichText content={line} />
          </Fragment>
        ))}
      </p>

      <UnderlineLink href={event.href} className="mt-9 lg:ml-[47px]">
        view events
      </UnderlineLink>
    </div>
  );
};

export default EventsCarousel;
