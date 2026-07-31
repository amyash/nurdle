import { openLetter } from "@/data/open-letter";
import { Callout } from "@/components/ui/callout";

export function OpenLetterPanel() {
  return (
    <div className="space-y-6">
      <Callout tone="mark" aria-label="Open letter support">
        <p className="text-eyebrow text-mute">Community support</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-mark">
          {openLetter.whatsappMemberCount.toLocaleString("en-GB")}
        </p>
        <p className="mt-2 text-body font-bold">{openLetter.signedByLabel}</p>
      </Callout>

      <article aria-labelledby="open-letter-addressee">
        <h2 id="open-letter-addressee" className="text-section">
          {openLetter.addressee}
        </h2>
        <p className="mt-3 text-body font-bold">{openLetter.title}</p>

        <div className="mt-4 space-y-3 text-body">
          {openLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h3 className="mt-5 text-card-title">{openLetter.concernsHeading}</h3>
        <ol className="mt-3 space-y-3">
          {openLetter.concerns.map((concern, index) => {
            const title = "title" in concern ? concern.title : null;
            return (
              <li key={title ?? concern.text} className="text-body">
                {title ? (
                  <>
                    <span className="font-bold">
                      {index + 1}. {title}:
                    </span>{" "}
                    {concern.text}
                  </>
                ) : (
                  <>
                    <span className="font-bold">{index + 1}.</span>{" "}
                    {concern.text}
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-5 text-body">{openLetter.impact}</p>

        <p className="mt-5 text-body">{openLetter.demand}</p>

        <p className="mt-6 text-body">{openLetter.closing}</p>
        <p className="mt-3 text-body font-bold">{openLetter.signedByLabel}</p>
      </article>
    </div>
  );
}
