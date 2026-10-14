import { Fragment } from "react";
import BackToTop from "../components/home/BackToTop";
import Decoration from "../components/home/Decoration";
import ImageSlot from "../components/home/ImageSlot";
import RichText from "../components/home/RichText";
import { bodyText, displayTitle } from "../components/home/typography";
import TicketPicker from "../components/programme/TicketPicker";
import EmailLink, { linkEmails } from "../components/EmailLink";
import { typesWithExpert } from "../data/programme";
import type { Paragraph, ProgrammeItem } from "../data/programme";
import type { RichText as RichTextContent } from "../types";

const rupees = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A paragraph written as plain text becomes a single unstyled piece. */
const asRichText = (paragraph: Paragraph): RichTextContent => (typeof paragraph === "string" ? [paragraph] : paragraph);

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
  const showExpert = typesWithExpert.includes(item.type) && Boolean(item.aboutHost?.length);
  // The event's own rows if it lists them (a tour's Dates, Duration, Stay...),
  // otherwise Venue, Date and Timings, skipping any left empty.
  const facts =
    item.facts ??
    [
      { label: "Venue", value: item.venue },
      { label: "Date", value: item.date },
      { label: "Timings", value: item.timings },
    ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value?.trim()));

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
            {item.host && <p className={`mt-[6px] ${smallCaps}`}>With {item.host}</p>}
            {/* The design sets this chip's label a shade redder than the other maroon. */}
            <span className="mt-[23px] inline-flex h-[34px] items-center rounded-[4px] border border-s2s-maroon px-[14px] text-[14px] lowercase leading-none text-[#7c1126]">
              {item.type}
            </span>

            {/* One grid for all rows, so the label column is as wide as the longest
                label (never under the design's 125px) and every value lines up. */}
            <dl className="mt-[29px] grid grid-cols-[minmax(110px,max-content)_1fr] border-b border-s2s-line sm:grid-cols-[minmax(125px,max-content)_1fr]">
              {facts.map(({ label, value }) => (
                <Fragment key={label}>
                  <dt className="flex min-h-[49px] max-w-[150px] items-center border-t border-s2s-line py-2 pl-[3px] pr-6 text-[14px] font-medium uppercase leading-[17px] tracking-[1.68px] text-s2s-ink sm:max-w-none">
                    {label}
                  </dt>
                  <dd className="flex items-center border-t border-s2s-line py-2 text-[16px] leading-[22px] text-s2s-ink">
                    {value}
                  </dd>
                </Fragment>
              ))}
            </dl>

            {item.prices ? (
              <ul className="mt-[26px] space-y-[6px]">
                {item.prices.map((option) => (
                  <li key={option.note} className="text-[14px] leading-[24px] text-s2s-ink">
                    <span className="font-bold tracking-[1.68px] text-s2s-maroon">₹ {rupees.format(option.amount)}</span>{" "}
                    {option.note}
                  </li>
                ))}
              </ul>
            ) : (
              item.price !== undefined && (
                <p className="mt-[18px] text-[14px] font-bold leading-[40px] tracking-[1.68px] text-s2s-maroon">
                  ₹ {rupees.format(item.price)}
                </p>
              )
            )}
            <div className={item.prices ? "mt-[24px]" : "mt-[16px]"}>
              <TicketPicker />
            </div>
          </div>
        </div>

        {/* The gold paisley at the page's right edge, level with the photograph's top. */}
        <Decoration file="prog-decor-2.jpg" width={75} height={128} className="right-0 top-[66px] mix-blend-multiply" />
      </div>

      <section aria-label="About this event" className="mx-auto mt-16 max-w-[1440px] px-5 lg:mt-[78px] lg:px-[60px]">
        <div className="bg-s2s-panel px-5 pb-10 pt-8 lg:px-[88px] lg:pb-[50px] lg:pt-[45px]">
          {/* Workshops show "About the expert" beside the details; performances and
              talks have none, and their details take the panel's full width. */}
          <div className={`grid gap-12 lg:gap-x-6 lg:gap-y-0 ${showExpert ? "lg:grid-cols-2" : ""}`}>
            <div>
              <PanelHeading>Event details</PanelHeading>
              <div className={`mt-[38px] space-y-7 lg:pl-[27px] ${bodyText}`}>
                {item.details.map((paragraph, index) => (
                  <p key={index}>
                    <RichText content={asRichText(paragraph)} />
                  </p>
                ))}
                {item.includes && (
                  <div>
                    <p>{linkEmails(item.includes.heading)}</p>
                    <ul>
                      {item.includes.items.map((entry) => (
                        <li key={entry} className="relative pl-6 before:absolute before:left-[9px] before:content-['•']">
                          {linkEmails(entry)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {showExpert && (
              <div>
                <PanelHeading>About the expert</PanelHeading>
                <div className={`mt-[38px] space-y-7 lg:pl-[27px] ${bodyText}`}>
                  {item.aboutHost?.map((paragraph, index) => (
                    <p key={index}>
                      <RichText content={asRichText(paragraph)} />
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className={`mt-12 border-t border-s2s-line pt-[22px] lg:mt-[84px] lg:pl-[27px] ${bodyText}`}>
            For further details, please email us on{" "}
            <EmailLink address="wsrc@weaversstudio.in" className="font-bold hover:text-s2s-maroon" />{" "}
            or call us on{" "}
            <a href="tel:+919874314888" className="font-bold hover:text-s2s-maroon">
              +91 98743 14888.
            </a>
          </p>
        </div>
      </section>

      <BackToTop />
    </div>
  );
};

export default ProgrammeEventPage;
