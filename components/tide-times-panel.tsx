import { TideTimesWidget } from "@/components/tide-times-widget";
import { northShieldsTideTimes } from "@/data/content";

export function TideTimesPanel() {
  const tide = northShieldsTideTimes;

  return (
    <div>
      <TideTimesWidget scriptSrc={tide.widgetSrc} cssHref={tide.widgetCss} />
      <p className="mt-2 text-xs text-[var(--mute)]">
        Live tide times from{" "}
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
    </div>
  );
}
