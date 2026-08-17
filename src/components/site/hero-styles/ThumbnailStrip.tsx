import { YT_EMBED_SRC } from "./clips";

/**
 * Big single frame. (No thumbnail rail — there's only one clip to show.)
 */
export function ThumbnailStrip() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1f396b]">
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
