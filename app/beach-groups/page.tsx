import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { beachesNeedingHelp } from "@/data/content";

export const metadata: Metadata = {
  title: "Beach cleanup groups",
};

export default function BeachGroupsPage() {
  return (
    <PageShell title="Beach cleanup groups">
      <p className="mb-3 text-sm text-[var(--mute)]">
        Join the beach group when a link is listed. More links will be added as
        they are confirmed.
      </p>
      <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
        {beachesNeedingHelp.map((beach) => (
          <li key={beach.id} className="px-3 py-3">
            <p className="font-bold">{beach.name}</p>
            <p className="text-sm text-[var(--mute)]">{beach.need}</p>
            <p className="mt-0.5 text-sm text-[var(--mute)]">
              Next window:{" "}
              {beach.nextWindow ?? (
                <span className="italic">Not yet confirmed</span>
              )}
            </p>
            {beach.whatsappUrl ? (
              <a
                href={beach.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex rounded-md bg-[#25D366] px-3 py-2 text-sm font-bold text-white"
              >
                Join {beach.name} WhatsApp
              </a>
            ) : (
              <p className="mt-2 text-sm italic text-[var(--mute)]">
                Beach WhatsApp link not yet added — join from main community
              </p>
            )}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
