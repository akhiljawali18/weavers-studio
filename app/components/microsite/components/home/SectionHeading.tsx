import type { ReactNode } from "react";
import { displayTitle, kicker as kickerClass } from "./typography";

type SectionHeadingProps = {
  kicker: string;
  children: ReactNode;
  id?: string;
  className?: string;
  /** `h1` when the heading names the whole page rather than one section of it. */
  as?: "h1" | "h2";
};

/** Spaced capitals over a Bodoni title, centred: the heading every section opens with. */
const SectionHeading = ({ kicker, children, id, className = "", as: Heading = "h2" }: SectionHeadingProps) => (
  <div className={`text-center ${className}`}>
    <p className={kickerClass}>{kicker}</p>
    <Heading id={id} className={`-mt-[3px] ${displayTitle}`}>
      {children}
    </Heading>
  </div>
);

export default SectionHeading;
