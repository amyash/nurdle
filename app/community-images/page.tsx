import type { Metadata } from "next";
import { CommunityImageGallery } from "@/components/community-image-gallery";
import { PageShell } from "@/components/page-shell";
import {
  communityImages,
  communityImagesIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Community images",
};

export default function CommunityImagesPage() {
  return (
    <PageShell title="Community images">
      <p className="text-base font-bold text-[var(--ink)]">
        {communityImagesIntro.heading}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-snug text-[var(--ink)]">
        {communityImagesIntro.paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph.parts.map((part, partIndex) =>
              part.type === "link" ? (
                <a
                  key={partIndex}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--mark)] underline underline-offset-2"
                >
                  {part.label}
                </a>
              ) : (
                <span key={partIndex}>{part.value}</span>
              ),
            )}
          </p>
        ))}
      </div>

      <div className="my-5 border-t border-[var(--line)]" aria-hidden="true" />

      <p className="mb-4 text-sm leading-snug text-[var(--mute)]">
        {communityImagesIntro.galleryCaption}
      </p>
      <CommunityImageGallery images={communityImages} />
    </PageShell>
  );
}
