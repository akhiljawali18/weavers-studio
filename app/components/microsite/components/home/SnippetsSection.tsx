import Carousel from "./Carousel";
import Decoration from "./Decoration";
import VideoCard from "./VideoCard";
import { displayTitle, kicker } from "./typography";
import { snippetVideos } from "../../data/home";

const SnippetsSection = () => (
  <section
    id="voices"
    aria-labelledby="snippets-heading"
    className="relative mx-auto mt-20 flex w-full max-w-[1440px] scroll-mt-[64px] flex-col lg:mt-[108px] lg:flex-row"
  >
    <div className="mb-8 text-center lg:order-last lg:mb-0 lg:flex-1 lg:pr-[30px] lg:pt-[202px]">
      <h2 id="snippets-heading" className={`italic ${displayTitle}`}>
        Snippets
      </h2>
      <p className={`mt-[9px] ${kicker}`}>From Sarong to Sari</p>
    </div>

    <div className="min-w-0 lg:w-[64.65%] lg:shrink-0">
      <Carousel
        label="Snippets from Sarong to Sari"
        itemLabel="video"
        trackClassName="gap-5 scroll-pl-5 px-5 lg:scroll-pl-[30px] lg:pl-[30px] lg:pr-0"
        navClassName="mt-[30px]"
      >
        {snippetVideos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </Carousel>
    </div>

    {/* The rule and gold flourish trailing off the right edge. */}
    <Decoration file="deco-snippets-flourish.svg" width={331} height={46} className="right-0 top-[489px]" />
  </section>
);

export default SnippetsSection;
