import Image from "next/image";
import ArchiveBrowser from "../components/community/ArchiveBrowser";
import BackToTop from "../components/home/BackToTop";
import { bodyText, displayTitle, kicker } from "../components/home/typography";
import { S2S_ASSETS } from "../data/home";
import { archiveObjects, communityIntro } from "../data/community";

/**
 * "Community archive": a grey banner introducing the collection, then every object,
 * searchable. Spacing follows the design at 1440px.
 */
const CommunityArchivePage = () => (
  <div className="overflow-x-clip">
    <div className="relative mx-auto mt-10 max-w-[1440px] lg:mt-16">
      <section
        aria-labelledby="community-archive-heading"
        className="bg-s2s-mist px-5 py-12 lg:w-[95.83%] lg:pb-[86px] lg:pl-[11.94%] lg:pr-0 lg:pt-[54px]"
      >
        <div className="text-center lg:inline-block">
          <p className={kicker}>A collection</p>
          <h1 id="community-archive-heading" className={`-mt-[3px] ${displayTitle}`}>
            <span className="italic">built by</span> its community
          </h1>
        </div>
        <p className={`mt-6 lg:mt-[27px] ${bodyText}`}>
          {communityIntro.map((line, index) => (
            <span key={index} className="lg:block">
              {line}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* The gold wave ornament riding the banner's lower edge, with its ruled margin. The export has a white ground, which multiplying drops. */}
      <Image
        src={`${S2S_ASSETS}/deco-community-banner.png`}
        alt=""
        aria-hidden
        width={743}
        height={168}
        unoptimized
        className="pointer-events-none absolute left-[48.4%] top-[130px] hidden h-[168px] w-[743px] max-w-none mix-blend-multiply lg:block"
      />
      <span aria-hidden className="absolute left-[89.79%] top-[53px] hidden h-[288px] w-px bg-s2s-line lg:block" />
    </div>

    <section aria-label="Objects" className="mx-auto mt-14 max-w-[1137px] px-5 lg:mt-[95px]">
      <ArchiveBrowser objects={archiveObjects} />
    </section>

    <div className="mb-[84px] mt-20 flex justify-center lg:mt-[103px]">
      <BackToTop />
    </div>
  </div>
);

export default CommunityArchivePage;
