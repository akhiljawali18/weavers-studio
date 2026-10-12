import BackToTop from "../components/home/BackToTop";
import ImageSlot from "../components/home/ImageSlot";
import SectionHeading from "../components/home/SectionHeading";
import { bodyText } from "../components/home/typography";
import ProgrammeListing from "../components/programme/ProgrammeListing";
import { programmeHero, programmeIntro, programmeItems } from "../data/programme";

/**
 * "Programme": heading, a full-width photograph, a short introduction, then every
 * event, filterable by type. Spacing follows the design at 1440px.
 */
const ProgrammePage = () => (
  <div className="overflow-x-clip pt-10 lg:pt-[56px]">
    <SectionHeading as="h1" kicker="A season of" className="px-5">
      <span className="italic">performances, talks and</span> workshops
    </SectionHeading>

    <ImageSlot
      src={programmeHero.image}
      alt={programmeHero.imageAlt}
      priority
      sizes="(min-width: 1440px) 1440px, 100vw"
      className="mx-auto mt-10 aspect-[1440/605] w-full max-w-[1440px] lg:mt-[50px]"
    />

    {programmeIntro && (
      <p className={`mx-auto mt-10 max-w-[687px] px-5 text-center lg:mt-[50px] ${bodyText}`}>{programmeIntro}</p>
    )}

    {/* 1098px of cards at 1440, three 312px columns. */}
    <section aria-label="Events" className="mx-auto mt-12 max-w-[1138px] px-5 lg:mt-[81px]">
      <ProgrammeListing items={programmeItems} />
    </section>

    <BackToTop />
  </div>
);

export default ProgrammePage;
