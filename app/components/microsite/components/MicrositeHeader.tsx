"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { micrositeNavigation } from "../data/navigation";
import { S2S_ASSETS } from "../data/home";
import { useMicrositeNav } from "../hooks/useMicrositeNav";

type NavLinkProps = {
  href: string;
  label: string;
  onNavigate?: () => void;
};

/** The current page is set in Bodoni italic over a drawn underline; the rest in plain lowercase. */
const NavLink = ({ href, label, onNavigate }: NavLinkProps) => {
  const isActive = useMicrositeNav(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className="group relative inline-block whitespace-nowrap lowercase text-s2s-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
    >
      {isActive ? (
        <>
          <span className="font-Bodoni text-[16px] italic leading-[24.8px]">{label}</span>
          <Image
            src={`${S2S_ASSETS}/nav-underline.svg`}
            alt=""
            width={79.73}
            height={3.5}
            unoptimized
            className="absolute left-0 top-[24px] h-[3.5px] w-[79.73px] max-w-none"
          />
        </>
      ) : (
        <span className="text-[15px] leading-[24.8px] transition-colors group-hover:text-s2s-maroon">{label}</span>
      )}
    </Link>
  );
};

const MicrositeHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0px_5px_34px_0px_rgba(127,102,91,0.1)]">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center px-5 lg:px-[60px]">
        <Link href="/microsite" className="shrink-0" aria-label="Sarong to Sari home">
          <Image src={`${S2S_ASSETS}/s2s-logo.svg`} alt="" width={94.996} height={42.012} unoptimized priority />
        </Link>

        <nav
          aria-label="Microsite navigation"
          className="hidden lg:ml-[123px] lg:mr-[15px] lg:flex lg:flex-1 lg:items-center lg:justify-between xl:grid xl:grid-cols-[22.9fr_23.7fr_24.4fr_17.2fr_11.8fr]"
        >
          {micrositeNavigation.map((item, index) => (
            <div key={item.href} className={index === micrositeNavigation.length - 1 ? "xl:justify-self-end" : ""}>
              <NavLink href={item.href} label={item.label} />
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="microsite-menu"
          className="ml-auto text-[15px] lowercase leading-[24.8px] text-s2s-brown lg:hidden"
        >
          {menuOpen ? "close" : "menu"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="microsite-menu"
          aria-label="Microsite navigation"
          className="border-t border-[#eeeeee] bg-white px-5 pb-6 pt-4 lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {micrositeNavigation.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} onNavigate={() => setMenuOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MicrositeHeader;
