import Carousel from "./Carousel";
import Decoration from "./Decoration";
import ImageSlot from "./ImageSlot";
import RichText from "./RichText";
import Testimonials from "./Testimonials";
import { communityArchive, communityArchiveTitle, testimonials } from "../../data/home";

const CommunitySection = () => (
  <section
    id="community-archive"
    aria-labelledby="community-heading"
    className="relative mx-auto mt-20 w-full max-w-[1440px] scroll-mt-[64px] lg:mt-[152px]"
  >
    <div className="relative">
      <h2
        id="community-heading"
        className="px-5 text-[16px] font-medium uppercase leading-[29px] tracking-[1.6px] text-s2s-ink lg:pl-[158px]"
      >
        {communityArchiveTitle}
      </h2>
      <span aria-hidden className="absolute left-0 top-[46px] hidden h-px w-[570px] bg-s2s-line lg:block" />
    </div>

    <Decoration file="deco-paisley-round.svg" width={101} height={137} className="right-0 top-[11px]" />

    <div className="mt-12 lg:mt-[100px]">
      <Testimonials items={testimonials} />
    </div>

    <div className="relative mt-12 lg:ml-[148px] lg:mt-[87px]">
      <span aria-hidden className="absolute left-0 top-[-31px] hidden h-[613px] w-px bg-s2s-line lg:block" />
      <span aria-hidden className="absolute -left-[31px] right-0 top-0 hidden h-px bg-s2s-line lg:block" />
      <Carousel
        label="Community archive"
        itemLabel="photograph"
        trackClassName="gap-5 scroll-pl-5 px-5 lg:pl-5 lg:pr-0"
        navClassName="mt-6"
      >
        {communityArchive.map((item, index) => (
          <figure key={index} className="w-[260px] shrink-0 snap-start md:w-[290px]">
            <ImageSlot src={item.image} alt={item.imageAlt} sizes="290px" className="aspect-[290/448] w-full" />
            <figcaption className="mt-3 text-[14px] leading-[25px] text-s2s-ink">
              <RichText content={item.caption} />
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </div>
  </section>
);

export default CommunitySection;
