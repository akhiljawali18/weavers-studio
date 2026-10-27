import EventsCarousel from "./EventsCarousel";
import { programmeEvents } from "../../data/home";
import { sectionGap } from "./spacing";

const EventsSection = () => (
  <section
    id="programme"
    aria-label="Programme"
    className={`relative mx-auto w-full scroll-mt-[64px] ${sectionGap}`}
  >
    <EventsCarousel events={programmeEvents} />
  </section>
);

export default EventsSection;
