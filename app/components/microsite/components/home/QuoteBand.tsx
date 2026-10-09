import Image from "next/image";
import ImageSlot from "./ImageSlot";
import { S2S_ASSETS, tagoreQuote } from "../../data/home";

/** Full-width maroon band carrying Tagore's line from 1927. */
const QuoteBand = () => (
  <section aria-label="From Rabindranath Tagore" className="relative mt-20 w-full bg-s2s-maroon lg:mt-[108px]">
    <ImageSlot src={tagoreQuote.background} alt="" tone="none" className="absolute inset-0" />
    <figure className="relative mx-auto flex min-h-[420px] max-w-[510px] flex-col items-center justify-center px-5 py-16 text-center text-white md:min-h-[513px]">
      <blockquote className="font-Bodoni text-[20px] italic leading-[32px] md:text-[24px] md:leading-[36px]">
        {tagoreQuote.text}
      </blockquote>
      <figcaption className="mt-[35px] text-[14px] uppercase leading-[17px] tracking-[1.68px] md:text-[16px] md:leading-[19px] md:tracking-[1.92px]">
        {tagoreQuote.attribution}
      </figcaption>
    </figure>

    {/* The hero's batik cluster again, turned on its side and spilling over the band's lower edge. */}
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden h-full max-w-[1440px] lg:block">
      <div className="absolute left-[77.43%] top-[425px] h-[124px] w-[260px]">
        <Image
          src={`${S2S_ASSETS}/deco-batik-cluster.svg`}
          alt=""
          width={124}
          height={260}
          unoptimized
          className="absolute left-[68px] top-[-68px] h-[260px] w-[124px] max-w-none rotate-90"
        />
      </div>
    </div>
  </section>
);

export default QuoteBand;
