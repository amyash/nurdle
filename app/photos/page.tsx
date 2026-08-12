import type { Metadata } from "next";
import { CommunityImageGallery } from "@/components/community-image-gallery";
import { PageShell } from "@/components/page-shell";
import { RichTextParts } from "@/components/whatsapp/content-link";
import {
  communityImages,
  communityImagesIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Photos",
  description:
    "Documentary photographs from volunteers documenting the Port of Tyne nurdle spill.",
};

export default function PhotosPage() {
  return (
    <PageShell
      title="Photos"
      lead={
        <>
          <p className="font-bold text-ink">{communityImagesIntro.heading}</p>
          {communityImagesIntro.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-3">
              <RichTextParts parts={paragraph.parts} />
            </p>
          ))}
        </>
      }
    >
      <p className="mb-6 text-meta">{communityImagesIntro.galleryCaption}</p>
      <CommunityImageGallery images={communityImages} />
    </PageShell>
  );
}
