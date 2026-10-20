import Image from "next/image";
import EmailLink from "./EmailLink";
import { S2S_ASSETS } from "../data/home";

// Weavers Studio's own pages; each opens in a new tab so the microsite stays open.
// An icon without an `href` shows but is not a link yet.
const socialLinks: {
  name: string;
  icon: string;
  width: number;
  height: number;
  href?: string;
}[] = [
  {
    name: "Instagram",
    icon: "icon-instagram.svg",
    width: 24,
    height: 26,
    href: "https://www.instagram.com/weaversstudiokolkata?dlrf=MWl3YzEyYmg2dW44Nw==",
  },
  {
    name: "Facebook",
    icon: "icon-facebook.svg",
    width: 24,
    height: 24,
    href: "https://www.facebook.com/share/1GjLuHSSMb/",
  },
  {
    name: "LinkedIn",
    icon: "icon-linkedin.svg",
    width: 24,
    height: 24,
    href: "https://www.linkedin.com/company/weavers-studio-kolkata?originalSubdomain=in",
  },
  // The link is still to come.
  {
    name: "YouTube",
    icon: "icon-youtube.svg",
    width: 27,
    height: 23,
    href: "https://youtube.com/@weaversstudiokolkata?si=wBJQNQgooBBZd5B5",
  },
];

const MicrositeFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#eeeeee] bg-s2s-paper">
      {/* A five-column grid on desktop: logo, the two text columns, the social icons,
          then the batik decoration as its own track at the right (286px, with a 34px
          gap before it from its left margin). At 1440 the columns sit where the design
          has them; on narrower screens the footer stacks and the batik is hidden. */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:px-5 pl-5 pr-0 py-10 text-[14px] leading-[25px] lg:grid lg:min-h-[150px] lg:grid-cols-[minmax(0,247fr)_minmax(0,313fr)_minmax(175px,335fr)_auto_auto] lg:items-center lg:gap-0 lg:pb-6 lg:pl-[60px] lg:pr-0 lg:pt-0">
        {/* The logo and the two text columns hang 42px from the footer's top edge;
            only the social icons sit on its centre line. */}
        <Image
          src={`${S2S_ASSETS}/footer-logo.svg`}
          alt="Sarong to Sari"
          width={200}
          height={76}
          unoptimized
          className="h-auto max-w-full lg:mt-[42px] lg:self-start lg:pr-5"
        />

        <div className="lg:mt-[42px] lg:self-start lg:pr-5">
          <p className="text-s2s-soft">Presented by</p>
          <p className="text-s2s-ink">
            Weavers Studio Resource Centre, Kolkata
          </p>
          <p className="text-[11px] uppercase tracking-[1px] text-s2s-soft">
            ©{year} Weavers Studio
          </p>
        </div>

        <address className="not-italic lg:mt-[42px] lg:self-start lg:pr-5">
          <p className="text-s2s-soft">Contact Us</p>
          <EmailLink
            address="wsrc@weaversstudio.in"
            className="block text-s2s-ink hover:text-s2s-maroon"
          />
          <a
            href="tel:+919874314888"
            className="block tracking-[0.7px] text-s2s-ink hover:text-s2s-maroon"
          >
            +91 98743 14888
          </a>
        </address>

        <ul aria-label="Social media" className="flex items-center gap-[22px]">
          {socialLinks.map((social) => (
            <li key={social.name}>
              {social.href ? (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Weavers Studio on ${social.name} (opens in a new tab)`}
                  className="block rounded-sm transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
                >
                  <Image
                    src={`${S2S_ASSETS}/${social.icon}`}
                    alt=""
                    width={social.width}
                    height={social.height}
                    unoptimized
                  />
                </a>
              ) : (
                <Image
                  src={`${S2S_ASSETS}/${social.icon}`}
                  alt={social.name}
                  width={social.width}
                  height={social.height}
                  unoptimized
                  className="block"
                />
              )}
            </li>
          ))}
        </ul>

        {/* The batik's own grid cell at the far right, flush to the footer's bottom-right
            corner. The JPEG has a white ground; multiplying it onto the footer's grey
            removes the box. Hidden on mobile, as in the design. */}
        <Image
          src={`${S2S_ASSETS}/footer-batik.jpg`}
          alt=""
          aria-hidden
          width={286}
          height={123}
          unoptimized
          className="w-full mix-blend-multiply lg:col-start-5 lg:-mb-6 lg:ml-[34px] lg:block lg:self-end"
        />
      </div>
    </footer>
  );
};

export default MicrositeFooter;
