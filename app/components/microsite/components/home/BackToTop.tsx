"use client";

import type { MouseEvent } from "react";
import UnderlineLink from "./UnderlineLink";

/**
 * Glides back to the top of the page.
 *
 * globals.css forces `scroll-behavior: auto` on everything, so a plain "#top" link
 * jumps. Asking for a smooth scroll in script is not affected by that rule. Anyone
 * whose system asks for reduced motion still gets the instant jump.
 */
const BackToTop = () => {
  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <UnderlineLink href="#top" variant="compact" onClick={scrollToTop}>
      back to top
    </UnderlineLink>
  );
};

export default BackToTop;
