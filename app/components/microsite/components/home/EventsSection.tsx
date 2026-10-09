import EventsCarousel from "./EventsCarousel";
import ImageSlot from "./ImageSlot";
import { programmeEvents, programmeImage } from "../../data/home";

const EventsSection = () => (
  <section
    id="programme"
    aria-label="Programme"
    className="relative mx-auto mt-20 flex w-full max-w-[1440px] scroll-mt-[64px] flex-col lg:mt-[126px] lg:min-h-[576px] lg:flex-row lg:items-start"
  >
    <ImageSlot
      src={programmeImage.src}
      alt={programmeImage.alt}
      sizes="100vw"
      className="aspect-[596/570] w-full lg:hidden"
    />
    {/* The photograph with its hairlines and flowers, as one 776 × 576 export. */}
    <ImageSlot
      src={programmeImage.artwork}
      alt={programmeImage.alt}
      sizes="54vw"
      className="hidden aspect-[776/576] lg:block lg:w-[53.89%] lg:shrink-0"
    />
    <div className="relative px-5 pt-10 lg:ml-[4.86%] lg:mt-[38px] lg:w-[36.32%] lg:px-0 lg:pt-0">
      <EventsCarousel events={programmeEvents} />
    </div>
  </section>
);

export default EventsSection;
