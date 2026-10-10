import { Fragment } from "react";
import type { RichText as RichTextContent, RichTextTone } from "../../types";

const toneClass: Record<RichTextTone, string> = {
  strong: "font-medium",
  bold: "font-bold",
  accent: "font-Bodoni italic text-s2s-maroon",
  maroon: "text-s2s-maroon",
};

type RichTextProps = {
  content: RichTextContent;
};

const RichText = ({ content }: RichTextProps) => (
  <>
    {content.map((part, index) =>
      typeof part === "string" ? (
        <Fragment key={index}>{part}</Fragment>
      ) : (
        <span key={index} className={toneClass[part.tone]}>
          {part.text}
        </span>
      )
    )}
  </>
);

export default RichText;
