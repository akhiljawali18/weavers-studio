import Decoration from "./Decoration";
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
      sizes="(min-width: 992px) 42vw, 100vw"
      className="aspect-[596/570] w-full lg:w-[41.39%] lg:shrink-0"
    />
    <div className="relative px-5 pt-10 lg:ml-[17.36%] lg:mt-[38px] lg:w-[36.32%] lg:px-0 lg:pt-0">
      <EventsCarousel events={programmeEvents} />
    </div>

    {/* The two flowers and their hairlines, crossing from the photograph's edge
        towards the text. A transparent PNG, so the gold flower keeps its colour where
        it lies over the photograph. */}
    <Decoration file="exi-decor.png" width={263} height={341} className="left-[35.63%] top-[235px]" />
  </section>
);

export default EventsSection;
