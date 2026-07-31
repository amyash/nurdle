import type { Metadata } from "next";
import { CommunityImageGallery } from "@/components/community-image-gallery";
import { PageShell } from "@/components/page-shell";
import {
  communityImages,
  communityImagesIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Photos",
};

export default function PhotosPage() {
  return (
    <PageShell title="Photos">
      <div className="max-w-prose">
        <p className="text-body font-bold">{communityImagesIntro.heading}</p>
        <div className="mt-2 space-y-2 text-meta text-ink">
          {communityImagesIntro.paragraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph.parts.map((part, partIndex) =>
                part.type === "link" ? (
                  <a
                    key={partIndex}
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-mark underline underline-offset-2"
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
      </div>

      <div className="my-5 border-t border-line" aria-hidden="true" />

      <p className="mb-4 text-meta">{communityImagesIntro.galleryCaption}</p>
      <CommunityImageGallery images={communityImages} />
    </PageShell>
  );
}
