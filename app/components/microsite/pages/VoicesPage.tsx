import Decoration from "../components/home/Decoration";
import { displayTitle, kicker } from "../components/home/typography";
import VoiceCard from "../components/voices/VoiceCard";
import { voices } from "../data/voices";

/** "Voices": the artists, scholars and curators of Sarong to Sari, three to a row. */
const VoicesPage = () => (
  <section
    aria-labelledby="voices-heading"
    className="relative mx-auto w-full max-w-[1440px] px-5 pb-24 pt-8 lg:px-[60px] lg:pb-[120px] lg:pt-6"
  >
    {/* The gold paisley from the team section, turned to face into the page. */}
    <Decoration file="deco-paisley-gold.svg" width={187} height={99} className="right-0 top-0 -scale-x-100" />

    <p className={kicker}>Artists, scholars and curators</p>
    <h1 id="voices-heading" className={`-mt-[3px] ${displayTitle}`}>
      <span className="italic">from India and</span> Indonesia
    </h1>

    <ul className="mt-12 grid gap-x-[26px] gap-y-14 sm:grid-cols-2 lg:mt-[70px] lg:grid-cols-3 lg:gap-y-[60px]">
      {voices.map((voice) => (
        <li key={voice.id}>
          <VoiceCard {...voice} />
        </li>
      ))}
    </ul>
  </section>
);

export default VoicesPage;
