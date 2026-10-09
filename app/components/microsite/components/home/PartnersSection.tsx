import ImageSlot from "./ImageSlot";
import SectionHeading from "./SectionHeading";
import { kicker } from "./typography";
import { partners } from "../../data/home";
import type { PartnerLogo } from "../../data/home";

/**
 * Each logo keeps the box it has in the design; the sizes live with the data.
 * Most of the logo files are JPEGs on white, and multiplying them onto the grey
 * band drops that white box without touching the files.
 */
const LogoBox = ({ logo }: { logo: PartnerLogo }) => (
  <div style={{ width: logo.width, height: logo.height }} className="max-w-full shrink-0">
    <ImageSlot
      src={logo.src}
      alt={logo.name}
      sizes={`${logo.width * 2}px`}
      className="h-full w-full"
      imageClassName="object-contain mix-blend-multiply"
    />
  </div>
);

/** Group labels sit in the medium weight, a step heavier than the section kicker. */
const label = `font-medium ${kicker}`;

/** A thin rule standing between two groups of logos. */
const divider =
  "lg:before:absolute lg:before:left-0 lg:before:top-[6px] lg:before:h-[150px] lg:before:w-px lg:before:bg-s2s-line";

const PartnersSection = () => (
  <section aria-labelledby="partners-heading" className="mt-20 w-full lg:mt-[91px]">
    <SectionHeading id="partners-heading" kicker="Sarong to Sari">
      <span className="italic">Partners</span>
    </SectionHeading>

    <div className="mt-[42px] bg-s2s-mist">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-0 lg:pb-[93px] lg:pt-[83px]">
        <div className="grid gap-12 lg:grid-cols-[26.6%_23.4%_50%] lg:gap-0">
          <div className="flex flex-col items-center lg:pl-[16.19%]">
            <p className={label}>Presented by</p>
            <div className="mt-[13px] flex h-[114px] items-center">
              <LogoBox logo={partners.presentedBy} />
            </div>
          </div>
          <div className={`relative flex flex-col items-center ${divider}`}>
            <p className={label}>Presenting partner</p>
            <div className="mt-[13px] flex h-[114px] items-center">
              <LogoBox logo={partners.presentingPartner} />
            </div>
          </div>
          <div className={`relative ${divider}`}>
            <p className={`text-center lg:pr-[5.14%] ${label}`}>Supported by</p>
            <div className="mt-[13px] flex flex-wrap items-center justify-center gap-8 lg:h-[114px] lg:flex-nowrap lg:justify-between lg:gap-4 lg:pl-[10.97%] lg:pr-[21.39%]">
              {partners.supportedBy.map((logo) => (
                <LogoBox key={logo.name} logo={logo} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-[99px] lg:grid-cols-2 lg:gap-0">
          <div>
            <p className={`text-center lg:pl-[6.25%] ${label}`}>In collaboration with</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-8 lg:h-[110px] lg:flex-nowrap lg:justify-between lg:gap-4 lg:pl-[15.42%] lg:pr-[9.17%]">
              {partners.collaboration.map((logo) => (
                <LogoBox key={logo.name} logo={logo} />
              ))}
            </div>
          </div>
          <div className={`relative ${divider}`}>
            <p className={`text-center lg:pr-[2.08%] ${label}`}>Venue partners</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-8 lg:h-[110px] lg:flex-nowrap lg:justify-between lg:gap-4 lg:pl-[9.31%] lg:pr-[14.72%]">
              {partners.venues.map((logo) => (
                <LogoBox key={logo.name} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PartnersSection;
