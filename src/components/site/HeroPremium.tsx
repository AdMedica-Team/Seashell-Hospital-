"use client";

import { useEffect, useRef, useState } from "react";
import { HeroActionBar } from "@/components/site/HeroActionBar";

// YouTube video used as the hero background.
const YT_ID = "F6OfQzOhiz4";
const YT_ORIGIN = "https://www.youtube-nocookie.com";
const YT_SRC =
  `${YT_ORIGIN}/embed/${YT_ID}` +
  `?autoplay=0&mute=1&loop=1&playlist=${YT_ID}&start=0` +
  `&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&enablejsapi=1&cc_load_policy=0&cc_lang_pref=none`;
// Real first-frame poster so the paused state shows the video, not a flat color.
const YT_THUMBNAIL = `https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`;

function sendCommand(
  iframe: HTMLIFrameElement | null,
  func: "playVideo" | "pauseVideo" | "mute" | "unMute" | "listening",
) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: func === "listening" ? "listening" : "command", func, args: [] }),
    YT_ORIGIN,
  );
}

/**
 * Full-bleed video hero — a looping YouTube video fills the whole viewport
 * (scaled to cover), no YouTube branding/controls. Starts paused over the
 * video's own poster frame; hovering the play button starts it with sound.
 * The overlay only clears once YouTube confirms real playback (via the
 * IFrame API's postMessage state events), so its own loading logo never
 * flashes through.
 */
export function HeroPremium() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingPlay = useRef(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN) return;
      let data: { event?: string; info?: { playerState?: number } | number };
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      const state =
        typeof data.info === "number" ? data.info : data.info?.playerState;
      if (data.event === "infoDelivery" && state === 1 && pendingPlay.current) {
        pendingPlay.current = false;
        setPlaying(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const requestPlay = () => {
    pendingPlay.current = true;
    sendCommand(iframeRef.current, "playVideo");
  };

  const togglePlay = () => {
    if (playing) {
      sendCommand(iframeRef.current, "pauseVideo");
      setPlaying(false);
      return;
    }
    requestPlay();
  };

  const toggleSound = () => {
    sendCommand(iframeRef.current, muted ? "unMute" : "mute");
    setMuted((m) => !m);
  };

  const playWithSoundOnHover = () => {
    if (playing) return;
    sendCommand(iframeRef.current, "unMute");
    setMuted(false);
    requestPlay();
  };

  return (
    <section id="site-hero" className="relative w-full">
      <div className="relative aspect-video w-full overflow-hidden bg-[#0a0f1a] sm:aspect-auto sm:h-[88vh]">
        {/* YouTube background. On phones the iframe fills a 16:9 box so the whole
            frame stays visible; from `sm` up it scales to cover the taller hero
            (see .hero-video in globals.css). */}
        <iframe
          ref={iframeRef}
          title="Seashell Hospital"
          className="hero-video pointer-events-none"
          src={YT_SRC}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={() => sendCommand(iframeRef.current, "listening")}
        />

        {!playing ? (
          <button
            type="button"
            onClick={togglePlay}
            onMouseEnter={playWithSoundOnHover}
            aria-label="Play video"
            className="group absolute inset-0 z-20 grid place-items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${YT_THUMBNAIL})` }}
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white/25 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ms-1 h-9 w-9" fill="white" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Pause video"
            className="absolute inset-0 z-10"
          />
        )}

        <div className="absolute bottom-6 end-6 z-10 flex gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M4 9v6h4l5 5V4L8 9H4z" />
                <path d="M2 2l20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M4 9v6h4l5 5V4L8 9H4z" />
                <path d="M16.5 8.5a1 1 0 0 1 1.4 0 6 6 0 0 1 0 8.5 1 1 0 1 1-1.4-1.4 4 4 0 0 0 0-5.7 1 1 0 0 1 0-1.4z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={togglePlay}
            onMouseEnter={playWithSoundOnHover}
            aria-label={playing ? "Pause video" : "Play video"}
            className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            )}
          </button>
        </div>

        <HeroActionBar />
      </div>
    </section>
  );
}
