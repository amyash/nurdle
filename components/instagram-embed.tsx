export function InstagramEmbed({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const match = url.match(/instagram\.com\/(?:reel|reels|p)\/([^/?#]+)/i);
  if (!match) {
    return (
      <p className="text-sm italic text-[var(--mute)]">
        Instagram link not available
      </p>
    );
  }

  const embedSrc = `https://www.instagram.com/reel/${match[1]}/embed`;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-[var(--line)] bg-white ${className}`}
    >
      <iframe
        src={embedSrc}
        title={title}
        className="h-[52rem] w-full max-w-full border-0"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
