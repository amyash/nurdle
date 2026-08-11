import type { Metadata } from "next";
import { PressReleaseArticle } from "@/components/press-release-article";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "Volunteers log 3000 hours cleaning up nurdles as community campaign escalates with open letter to Port of Tyne.",
};

export default function PressReleasePage() {
  return (
    <div className="mx-auto max-w-[44rem] px-4 pb-10 pt-2">
      <PressReleaseArticle />
    </div>
  );
}
