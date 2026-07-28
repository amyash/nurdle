import type { Metadata } from "next";
import { PressReleaseArticle } from "@/components/press-release-article";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "A race against the tide: residents defy officials and launch cleanup of a billion nurdles along North East beaches.",
};

export default function PressReleasePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-2">
      <PressReleaseArticle />
    </div>
  );
}
