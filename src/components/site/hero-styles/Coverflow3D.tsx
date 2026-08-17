import { YT_EMBED_SRC } from "./clips";

/**
 * Coverflow single frame: the hero video centered in a 3D-perspective stage.
 * (No side cards or arrows — there's only one clip.)
 */
export function Coverflow3D() {
  return (
    <div
      className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-[#0b1f3a]"
      style={{ perspective: "1400px" }}
    >
      <div className="absolute left-1/2 top-1/2 aspect-video w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl">
        <iframe
          title="Seashell Hospital"
          className="h-full w-full border-0"
          src={YT_EMBED_SRC}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
