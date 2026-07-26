/** Extract a YouTube video id from common watch / short / share URLs. */
export function youtubeIdFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/")[2] || null;
    }
    if (u.pathname === "/watch") {
      return u.searchParams.get("v");
    }
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(url: string | null): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
