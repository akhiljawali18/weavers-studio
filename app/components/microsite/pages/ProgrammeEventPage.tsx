import BackToTop from "../components/home/BackToTop";
import Decoration from "../components/home/Decoration";
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
  <h2 className={`border-b border-s2s-line pb-4 pl-[21px] ${smallCaps}`}>{children}</h2>
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
      <div className="relative mx-auto max-w-[1440px] px-5 pt-10 lg:px-0 lg:pt-[66px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-0">
          {/* The hairline and the maroon flower with its curved line are pinned to the
              photograph's own corner, so they stay with it however tall it renders.
              The JPEG has a white ground, which multiplying drops. */}
          <div className="relative aspect-[425/566] w-full sm:max-w-[425px] lg:ml-[13.82%] lg:w-[29.51%] lg:shrink-0">
            <ImageSlot
              src={item.image}
              alt={item.imageAlt}
              priority
              sizes="(min-width: 992px) 425px, 100vw"
              className="absolute inset-0"
            />
            <span aria-hidden className="absolute -bottom-[27px] -left-[24px] top-0 hidden w-px bg-s2s-sand lg:block" />
            <Decoration file="prog-decor-1.jpg" width={175} height={103} className="-bottom-[9px] -left-[160px] mix-blend-multiply" />
          </div>

          <div className="lg:ml-[11.11%] lg:w-[41.39%] lg:pt-[71px]">
            <h1 className={displayTitle}>
              <span className="italic">{item.titleItalic}</span>
              {item.titleRegular}
            </h1>
            <p className={`mt-[6px] ${smallCaps}`}>With {item.host}</p>
            {/* The design sets this chip's label a shade redder than the other maroon. */}
            <span className="mt-[23px] inline-flex h-[34px] items-center rounded-[4px] border border-s2s-maroon px-[14px] text-[14px] lowercase leading-none text-[#7c1126]">
              {item.type}
            </span>

            <dl className="mt-[29px] border-b border-s2s-line">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="grid min-h-[49px] grid-cols-[110px_1fr] items-center gap-x-3 border-t border-s2s-line py-2 sm:grid-cols-[125px_1fr] sm:gap-x-0"
                >
                  <dt className="pl-[3px] text-[14px] font-medium uppercase leading-[17px] tracking-[1.68px] text-s2s-ink">
                    {label}
                  </dt>
                  <dd className="text-[16px] leading-[22px] text-s2s-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-[18px] text-[14px] font-bold leading-[40px] tracking-[1.68px] text-s2s-maroon">
              ₹ {rupees.format(item.price)}
            </p>
            <div className="mt-[16px]">
              <TicketPicker />
            </div>
          </div>
        </div>

        {/* The gold paisley at the page's right edge, level with the photograph's top. */}
        <Decoration file="prog-decor-2.jpg" width={75} height={128} className="right-0 top-[66px] mix-blend-multiply" />
      </div>

      <section aria-label="About this event" className="mx-auto mt-16 max-w-[1440px] px-5 lg:mt-[78px] lg:px-[60px]">
        <div className="bg-s2s-panel px-5 pb-10 pt-8 lg:px-[88px] lg:pb-[50px] lg:pt-[45px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0">
            <div>
              <PanelHeading>Event details</PanelHeading>
              <div className={`mt-[38px] space-y-7 lg:pl-[27px] ${bodyText}`}>
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
              <div className={`mt-[38px] space-y-7 lg:pl-[27px] ${bodyText}`}>
                {item.aboutHost.map((paragraph, index) => (
                  <p key={index}>
                    <RichText content={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className={`mt-12 border-t border-s2s-line pt-[22px] lg:mt-[84px] lg:pl-[27px] ${bodyText}`}>
            For further details, please email us on{" "}
            <a href="mailto:wsrc@weaversstudio.in" className="font-bold hover:text-s2s-maroon">
              wsrc@weaversstudio.in
            </a>{" "}
            or call us on{" "}
            <a href="tel:+919874314888" className="font-bold hover:text-s2s-maroon">
              +91 98743 14888.
            </a>
          </p>
        </div>
      </section>

      <div className="mb-[84px] mt-16 flex justify-center lg:mt-[90px]">
        <BackToTop />
      </div>
    </div>
  );
};

export default ProgrammeEventPage;
