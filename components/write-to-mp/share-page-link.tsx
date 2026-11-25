"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const SHARE_URL = "https://nurdle-hub.vercel.app/write-to-your-mp";

export function SharePageLink() {
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setNotice(null);
    } catch {
      setCopied(false);
      setNotice("Select the link above and copy it.");
    }
  }

  return (
    <div className="mb-6 flex flex-col items-start gap-3">
      <p className="max-w-measure break-all text-meta">{SHARE_URL}</p>
      <Button type="button" variant="secondary" onClick={onCopy}>
        {copied ? "Link copied" : "Copy link to share"}
      </Button>
      {notice ? <p className="text-meta">{notice}</p> : null}
    </div>
  );
}
