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

  // Instagram does not expose controls to hide likes/comments; clip the
  // embed footer so only the video (and top chrome) remain visible.
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-[var(--line)] bg-black ${className}`}
      style={{ height: "34rem" }}
    >
      <iframe
        src={embedSrc}
        title={title}
        className="absolute inset-x-0 top-0 h-[42rem] w-full max-w-full border-0"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
