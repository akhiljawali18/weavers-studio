import Image from "next/image";

type ImageSlotProps = {
  src?: string;
  alt: string;
  /** Size and position of the slot; the caller decides, e.g. `absolute inset-0` or `aspect-[4/3] w-full`. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill shown while there is no `src`: light for photos on white, dark behind white text. */
  tone?: "light" | "dark" | "none";
  /** Classes for the picture itself; photos crop to fill, logos pass `object-contain`. */
  imageClassName?: string;
};

const toneClass = {
  light: "bg-[#e6e1de]",
  dark: "bg-[#4a4341]",
  none: "",
};

/**
 * A picture the design calls for. Until its file has been exported from Figma the
 * slot keeps its size and shows a flat tone, so the layout can be judged now and
 * the image dropped in later by giving it a `src`.
 *
 * The slot never sets its own `position`: callers place it absolutely as often as
 * not, and a `relative` here would quietly override them.
 */
const ImageSlot = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority,
  tone = "light",
  imageClassName = "object-cover",
}: ImageSlotProps) => {
  if (src) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="relative h-full w-full">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imageClassName} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${toneClass[tone]} ${className}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    />
  );
};

export default ImageSlot;
