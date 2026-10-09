import Decoration from "./Decoration";
import ImageSlot from "./ImageSlot";
import RichText from "./RichText";
import SectionHeading from "./SectionHeading";
import { bodyText } from "./typography";
import { voyageImage, voyageIntro, voyageParagraphs } from "../../data/home";

const VoyageSection = () => (
  <section
    id="journey"
    aria-labelledby="voyage-heading"
    className="relative mx-auto mt-20 w-full max-w-[1440px] scroll-mt-[64px] lg:mt-[126px]"
  >
    <div className="flex flex-col lg:flex-row">
      <div className="px-5 pb-10 lg:w-[49.375%] lg:shrink-0 lg:px-0 lg:pb-0 lg:pl-[10.28%] lg:pt-[80px]">
        <div className="lg:max-w-[448px]">
          <SectionHeading id="voyage-heading" kicker="A century since">
            <span className="italic">Tagore’s</span> voyage
          </SectionHeading>
          <p className={`mt-10 ${bodyText}`}>
            <RichText content={voyageIntro} />
          </p>
        </div>
      </div>
      <ImageSlot
        src={voyageImage.src}
        alt={voyageImage.alt}
        sizes="(min-width: 992px) 51vw, 100vw"
        className="aspect-[729/411] w-full lg:w-[50.625%]"
      />
    </div>

    <div className="relative flex flex-col gap-6 px-5 pt-10 lg:min-h-[411px] lg:flex-row lg:gap-[14.29%] lg:pl-[35.28%] lg:pr-[10.28%] lg:pt-[123px]">
      {/* The ruled margin with the wave ornament at its foot. */}
      <Decoration file="deco-voyage-wave.svg" width={745} height={377} className="left-0 top-[35px]" />
      {voyageParagraphs.map((paragraph, index) => (
        <p key={index} className={`lg:flex-1 ${bodyText}`}>
          <RichText content={paragraph} />
        </p>
      ))}
    </div>
  </section>
);

export default VoyageSection;
