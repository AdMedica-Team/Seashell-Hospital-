import { YT_EMBED_SRC } from "./clips";

/**
 * Single full-height slide. (No scroll-snap sections — there's only one clip.)
 */
export function ScrollSnapSlides() {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl bg-[#1f396b]">
      <iframe
        title="Seashell Hospital"
        className="absolute inset-0 h-full w-full border-0"
        src={YT_EMBED_SRC}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
