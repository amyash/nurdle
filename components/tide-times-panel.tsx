import { TideTimesWidget } from "@/components/tide-times-widget";
import { northShieldsTideTimes } from "@/data/content";

export function TideTimesPanel() {
  const tide = northShieldsTideTimes;

  return (
    <section
      className="mb-6 rounded-lg border-2 border-[var(--ink)] bg-white p-4"
      aria-labelledby="tide-times-heading"
    >
      <h2
        id="tide-times-heading"
        className="text-lg font-bold leading-snug text-[var(--ink)]"
      >
        {tide.title}
      </h2>
      <TideTimesWidget scriptSrc={tide.widgetSrc} cssHref={tide.widgetCss} />
      <p className="mt-3 text-xs text-[var(--mute)]">
        Live widget powered by{" "}
        <a
          href={tide.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[var(--tide)] underline underline-offset-2"
        >
          tidetimes.co.uk
        </a>
        .
      </p>
    </section>
  );
}
