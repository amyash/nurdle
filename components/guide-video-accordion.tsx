"use client";

import { useState } from "react";
import { YoutubeEmbed } from "@/components/youtube-embed";

export function GuideVideoAccordion({
  videos,
}: {
  videos: { title: string; url: string }[];
}) {
  const [openUrl, setOpenUrl] = useState<string | null>(
    () => videos[0]?.url ?? null,
  );

  return (
    <div className="mt-3 space-y-1">
      {videos.map((video) => {
        const isOpen = openUrl === video.url;
        return (
          <div key={video.url} className="border-b border-line last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 py-2 text-left text-sm font-bold leading-snug text-ink"
              onClick={() => {
                setOpenUrl((current) =>
                  current === video.url ? null : video.url,
                );
              }}
            >
              <span className="min-w-0 flex-1">{video.title}</span>
              <span
                className={`inline-flex shrink-0 items-center justify-center text-lg font-bold leading-none transition ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen ? (
              <div className="pb-3 pt-1">
                <YoutubeEmbed
                  url={video.url}
                  title={video.title}
                  aspect="short"
                  className="mx-auto mt-0 w-full max-w-[16rem]"
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
