import EventsCarousel from "./EventsCarousel";
import { programmeEvents } from "../../data/home";

const EventsSection = () => (
  <section
    id="programme"
    aria-label="Programme"
    className="relative mx-auto mt-20 w-full max-w-[1440px] scroll-mt-[64px] lg:mt-[126px]"
  >
    <EventsCarousel events={programmeEvents} />
  </section>
);

export default EventsSection;
