import { youtubeEmbedUrl } from "@/lib/youtube";

export function YoutubeEmbed({
  url,
  title,
}: {
  url: string | null;
  title: string;
}) {
  const embed = youtubeEmbedUrl(url);
  if (!embed) {
    return (
      <p className="text-sm italic text-[var(--mute)]">Video link not available</p>
    );
  }

  return (
    <div className="relative mt-2 aspect-video overflow-hidden rounded-lg bg-black">
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
