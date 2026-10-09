import Image from "next/image";
import Decoration from "./home/Decoration";
import { S2S_ASSETS } from "../data/home";

// Each icon becomes a link once its `href` is known.
const socialLinks: { name: string; icon: string; width: number; height: number; href?: string }[] = [
  { name: "Instagram", icon: "icon-instagram.svg", width: 24, height: 26 },
  { name: "Facebook", icon: "icon-facebook.svg", width: 24, height: 24 },
  { name: "LinkedIn", icon: "icon-linkedin.svg", width: 24, height: 24 },
];

const MicrositeFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#eeeeee] bg-s2s-paper">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 text-[14px] leading-[25px] lg:grid lg:min-h-[150px] lg:grid-cols-[247px_313px_335px_1fr] lg:items-center lg:gap-0 lg:px-[60px] lg:py-0">
        <Image src={`${S2S_ASSETS}/footer-logo.svg`} alt="Sarong to Sari" width={200} height={76} unoptimized />

        <div>
          <p className="text-s2s-soft">Presented by</p>
          <p className="text-s2s-ink">Weavers Studio Resource Centre, Kolkata</p>
          <p className="text-[11px] uppercase tracking-[1px] text-s2s-soft">©{year} Weavers Studio</p>
        </div>

        <address className="not-italic">
          <p className="text-s2s-soft">Contact Us</p>
          <a href="mailto:wsrc@weaversstudio.in" className="block text-s2s-ink hover:text-s2s-maroon">
            wsrc@weaversstudio.in
          </a>
          <a href="tel:+919874314888" className="block tracking-[0.7px] text-s2s-ink hover:text-s2s-maroon">
            +91 98743 14888
          </a>
        </address>

        <ul aria-label="Social media" className="flex items-center gap-[22px]">
          {socialLinks.map((social) => {
            const icon = (
              <Image
                src={`${S2S_ASSETS}/${social.icon}`}
                alt={social.name}
                width={social.width}
                height={social.height}
                unoptimized
              />
            );

            return (
              <li key={social.name}>
                {social.href ? (
                  <a href={social.href} target="_blank" rel="noreferrer" className="block transition-opacity hover:opacity-70">
                    {icon}
                  </a>
                ) : (
                  icon
                )}
              </li>
            );
          })}
        </ul>

        {/* The JPEG has a white ground; multiplying it onto the footer's grey removes the box. */}
        <Decoration file="footer-batik.jpg" width={286} height={123} className="bottom-0 right-0 mix-blend-multiply" />
      </div>
    </footer>
  );
};

export default MicrositeFooter;
