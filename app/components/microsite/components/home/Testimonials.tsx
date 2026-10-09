"use client";

import { useState } from "react";
import Image from "next/image";
import { S2S_ASSETS } from "../../data/home";

type Testimonial = {
  attribution: string;
  quote: string;
};

type TestimonialsProps = {
  items: Testimonial[];
};

/** One quotation at a time; the arrow moves to the next and wraps around. */
const Testimonials = ({ items }: TestimonialsProps) => {
  const [index, setIndex] = useState(0);
  const item = items[index];

  return (
    <div className="flex items-center justify-between gap-8 px-5 lg:ml-[60px] lg:w-[1000px] lg:max-w-[calc(100%-80px)] lg:pl-[99px] lg:pr-[2px]">
      <figure className="max-w-[730px]" aria-live="polite">
        <figcaption className="text-[14px] uppercase leading-[17px] tracking-[1.68px] text-s2s-line">
          {item.attribution}
        </figcaption>
        <blockquote className="mt-2 font-Bodoni text-[18px] italic leading-[32px] text-s2s-ink md:text-[20px] md:leading-[36px]">
          {item.quote}
        </blockquote>
      </figure>
      <button
        type="button"
        onClick={() => setIndex((current) => (current + 1) % items.length)}
        disabled={items.length < 2}
        aria-label="Next testimonial"
        className="relative flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon disabled:cursor-default"
      >
        <span className="relative block h-[24px] w-[24px] -rotate-90 -scale-y-100">
          <Image
            src={`${S2S_ASSETS}/arrow-maroon.svg`}
            alt=""
            width={10.5}
            height={19}
            unoptimized
            className="absolute left-[6.25px] top-[2.25px] h-[19px] w-[10.5px] max-w-none"
          />
        </span>
      </button>
    </div>
  );
};

export default Testimonials;
