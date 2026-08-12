import type { Metadata } from "next";
import { PressReleaseArticle } from "@/components/press-release-article";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "Volunteers log 3000 hours cleaning up nurdles as community campaign escalates with open letter to Port of Tyne.",
};

export default function PressReleasePage() {
  return (
    <PageShell narrow className="max-w-[44rem]">
      <PressReleaseArticle />
    </PageShell>
  );
}
