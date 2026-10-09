import Image from "next/image";
import { S2S_ASSETS } from "../../data/home";

type DecorationProps = {
  /** File name inside the Sarong to Sari asset folder. */
  file: string;
  width: number;
  height: number;
  /** Placement, e.g. `left-[25px] top-[617px]`. */
  className: string;
};

/**
 * A purely ornamental motif from the design, pinned in place on wide screens.
 * Hidden below `lg`, where the sections stack and there is no margin to sit in.
 */
const Decoration = ({ file, width, height, className }: DecorationProps) => (
  <Image
    src={`${S2S_ASSETS}/${file}`}
    alt=""
    aria-hidden
    width={width}
    height={height}
    unoptimized
    style={{ width, height }}
    className={`pointer-events-none absolute hidden max-w-none lg:block ${className}`}
  />
);

export default Decoration;
