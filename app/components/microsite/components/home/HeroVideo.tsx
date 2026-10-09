"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageSlot from "./ImageSlot";
import { S2S_ASSETS } from "../../data/home";

type HeroVideoProps = {
  src?: string;
  poster?: string;
};

/**
 * The opening film. It starts muted, as browsers only autoplay silent video, and
 * the speaker in the corner turns the sound on.
 */
const HeroVideo = ({ src, poster }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React does not keep the `muted` attribute in sync after the first render, so
  // the property is set directly.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <div className="relative aspect-[1296/504] w-full overflow-hidden">
      {src ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
        >
          <source src={src} />
        </video>
      ) : (
        <ImageSlot src={poster} alt="Sarong to Sari exhibition film" className="absolute inset-0" priority />
      )}
      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        disabled={!src}
        aria-pressed={!muted}
        aria-label={muted ? "Turn on the film's sound" : "Mute the film"}
        className="absolute bottom-[3.97%] right-[1.85%] flex rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default"
      >
        <Image
          src={`${S2S_ASSETS}/icon-mute.svg`}
          alt=""
          width={20.435}
          height={21.3805}
          unoptimized
          className={`h-[21.38px] w-[20.44px] max-w-none transition-opacity ${muted ? "" : "opacity-60"}`}
        />
      </button>
    </div>
  );
};

export default HeroVideo;
