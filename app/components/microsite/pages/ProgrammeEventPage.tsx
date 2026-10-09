import BackToTop from "../components/home/BackToTop";
import ImageSlot from "../components/home/ImageSlot";
import RichText from "../components/home/RichText";
import { bodyText, displayTitle } from "../components/home/typography";
import TicketPicker from "../components/programme/TicketPicker";
import type { ProgrammeItem } from "../data/programme";

const rupees = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Black spaced capitals: "With Sabine Bolk", "Event details", "About the expert". */
const smallCaps = "text-[14px] font-medium uppercase leading-[17px] tracking-[1.68px] text-black";

/** A panel column heading with the rule beneath it, as in the design. */
const PanelHeading = ({ children }: { children: string }) => (
  <h2 className={`border-b border-s2s-rule pb-4 pl-[22px] ${smallCaps}`}>{children}</h2>
);

type ProgrammeEventPageProps = {
  item: ProgrammeItem;
};

/**
 * One event from the programme: photograph and booking details side by side, then
 * a grey panel with the full description and the host's biography.
 * Spacing follows the design at 1440px.
 */
const ProgrammeEventPage = ({ item }: ProgrammeEventPageProps) => {
  const facts = [
    ["Venue", item.venue],
    ["Date", item.date],
    ["Timings", item.timings],
  ];

  return (
    <div className="overflow-x-clip">
      <div className="relative mx-auto max-w-[1440px] px-5 pt-10 lg:px-0 lg:pt-[74px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-0">
          <ImageSlot
            src={item.image}
            alt={item.imageAlt}
            priority
            sizes="(min-width: 992px) 424px, 100vw"
            className="aspect-[3/4] w-full sm:max-w-[424px] lg:ml-[13.89%] lg:w-[29.44%] lg:shrink-0"
          />

          <div className="lg:ml-[11.11%] lg:w-[41.32%] lg:pt-[69px]">
            <h1 className={`${displayTitle} lg:text-[44px]`}>
              <span className="italic">{item.titleItalic}</span>
              {item.titleRegular}
            </h1>
            <p className={`mt-[6px] ${smallCaps}`}>With {item.host}</p>
            <span className="mt-[25px] inline-flex h-[34px] items-center rounded-[3px] border border-s2s-maroon px-[14px] text-[14px] lowercase leading-none text-s2s-maroon">
              {item.type}
            </span>

            <dl className="mt-[29px] border-b border-s2s-rule">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="grid min-h-[49px] grid-cols-[110px_1fr] items-center gap-x-3 border-t border-s2s-rule py-2 sm:grid-cols-[125px_1fr] sm:gap-x-0"
                >
                  <dt className="pl-[3px] text-[14px] font-medium uppercase leading-[17px] tracking-[1.68px] text-s2s-ink">
                    {label}
                  </dt>
                  <dd className="text-[16px] leading-[22px] text-s2s-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-[27px] text-[14px] font-bold leading-[17px] tracking-[1.2px] text-s2s-maroon">
              ₹ {rupees.format(item.price)}
            </p>
            <div className="mt-[30px]">
              <TicketPicker />
            </div>
          </div>
        </div>

        {/* Hairlines framing the photograph, as drawn in the design. */}
        <span aria-hidden className="absolute left-[12.19%] top-[74px] hidden h-[590px] w-px bg-[#ddd6cc] lg:block" />
        <span aria-hidden className="absolute left-[2.64%] top-[645px] hidden h-px w-[11.25%] bg-[#ddd6cc] lg:block" />
      </div>

      <section aria-label="About this event" className="mx-auto mt-16 max-w-[1440px] px-5 lg:mt-[79px] lg:px-[61px]">
        <div className="bg-s2s-panel px-5 pb-10 pt-8 lg:px-[88px] lg:pb-[50px] lg:pt-[45px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0">
            <div>
              <PanelHeading>Event details</PanelHeading>
              <div className={`mt-[38px] space-y-7 lg:pl-[28px] ${bodyText}`}>
                {item.details.map((paragraph, index) => (
                  <p key={index}>
                    <RichText content={paragraph} />
                  </p>
                ))}
                {item.includes && (
                  <div>
                    <p>{item.includes.heading}</p>
                    <ul>
                      {item.includes.items.map((entry) => (
                        <li key={entry} className="relative pl-6 before:absolute before:left-[9px] before:content-['•']">
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <PanelHeading>About the expert</PanelHeading>
              <div className={`mt-[38px] space-y-7 lg:pl-[28px] ${bodyText}`}>
                {item.aboutHost.map((paragraph, index) => (
                  <p key={index}>
                    <RichText content={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className={`mt-12 border-t border-s2s-rule pt-[22px] lg:mt-[84px] lg:pl-[28px] ${bodyText}`}>
            For further details, please email us on{" "}
            <a href="mailto:wsrc@weaversstudio.in" className="font-medium hover:text-s2s-maroon">
              wsrc@weaversstudio.in
            </a>{" "}
            or call us on{" "}
            <a href="tel:+919874314888" className="font-medium hover:text-s2s-maroon">
              +91 98743 14888.
            </a>
          </p>
        </div>
      </section>

      <div className="mb-[84px] mt-16 flex justify-center lg:mt-[78px]">
        <BackToTop />
      </div>
    </div>
  );
};

export default ProgrammeEventPage;
