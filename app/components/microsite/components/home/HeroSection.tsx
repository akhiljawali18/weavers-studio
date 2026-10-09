import Image from "next/image";
import Decoration from "./Decoration";
import HeroVideo from "./HeroVideo";
import RichText from "./RichText";
import UnderlineLink from "./UnderlineLink";
import { bodyText, displayTitle, kicker } from "./typography";
import { S2S_ASSETS, exhibitionVenues, heroIntro, heroVideo } from "../../data/home";

const HeroSection = () => (
  <section id="exhibition" className="relative mx-auto w-full max-w-[1440px] scroll-mt-[64px] px-5 pt-8 lg:px-[72px] lg:pt-[54px]">
    <Image
      src={`${S2S_ASSETS}/wsrc-logo.png`}
      alt="Weavers Studio Resource Centre"
      width={202}
      height={111}
      priority
      className="mb-6 h-auto w-[140px] lg:absolute lg:left-[31px] lg:top-[34px] lg:mb-0 lg:w-[202px]"
    />

    <div className="text-center">
      <p className={kicker}>Weavers Studio Resource Centre presents</p>
      <h1 className={`-mt-[3px] ${displayTitle}`}>
        <span className="italic">Sarong</span> to <span className="italic">Sari</span>
      </h1>
      <p className="mt-[7px] text-[14px] uppercase leading-[17px] tracking-[1.68px] text-s2s-ink">— Exhibition —</p>
      <p className={`mx-auto mt-[25px] max-w-[647px] ${bodyText}`}>
        <RichText content={heroIntro} />
      </p>
    </div>

    <div className="relative mt-10">
      <HeroVideo src={heroVideo.src} poster={heroVideo.poster} />
      <span aria-hidden className="absolute -left-[52px] -right-[36px] bottom-0 hidden h-px bg-s2s-line lg:block" />
    </div>

    <ul className="mt-12 grid gap-6 lg:grid-cols-[441fr_412fr_443fr] lg:gap-0">
      {exhibitionVenues.map((item, index) => (
        <li
          key={item.dates}
          className={`text-center ${bodyText} lg:min-h-[68px] lg:pt-[6px] ${index > 0 ? "lg:border-l lg:border-s2s-line" : ""}`}
        >
          <span className="block font-medium">{item.dates}</span>
          <span className="block">{item.venue}</span>
        </li>
      ))}
    </ul>

    <div className="mt-[60px] flex flex-wrap justify-center gap-x-[140px] gap-y-6">
      <UnderlineLink href="#journey">follow the journey</UnderlineLink>
      <UnderlineLink href="/microsite/programme">programmes &amp; events</UnderlineLink>
    </div>

    <Decoration file="deco-batik-cluster.svg" width={124} height={260} className="left-[89.375%] top-[225px]" />
    <Decoration file="deco-paisley-maroon.svg" width={130} height={161} className="left-[25px] top-[617px]" />
  </section>
);

export default HeroSection;
