import { youtubeEmbedUrl } from "@/lib/youtube";

export function YoutubeEmbed({
  url,
  title,
  aspect = "video",
  className = "",
}: {
  url: string | null;
  title: string;
  /** `video` = 16:9, `short` = slim 9:16 portrait */
  aspect?: "video" | "short";
  className?: string;
}) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) {
    return (
      <p className="text-sm italic text-[var(--mute)]">Video link not available</p>
    );
  }

  const aspectClass = aspect === "short" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-black ${aspectClass} ${className}`}
    >
      <iframe
        src={embed}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
