import { openLetter } from "@/data/open-letter";

export function OpenLetterPanel() {
  return (
    <div className="space-y-6">
      <aside
        className="rounded-lg border-2 border-[var(--mark)] bg-white px-4 py-4"
        aria-label="Open letter support"
      >
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]">
          Community support
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-[var(--mark)]">
          {openLetter.whatsappMemberCount.toLocaleString("en-GB")}
        </p>
        <p className="mt-2 text-base font-bold leading-snug text-[var(--ink)]">
          Signed by {openLetter.whatsappMemberCount.toLocaleString("en-GB")}{" "}
          members of a voluntary effort to respond to the Port of Tyne Nurdle
          Spill
        </p>
      </aside>

      <article aria-labelledby="open-letter-addressee">
        <h2
          id="open-letter-addressee"
          className="text-xl font-bold leading-snug text-[var(--ink)]"
        >
          {openLetter.addressee}
        </h2>
        <p className="mt-3 text-base font-bold leading-snug text-[var(--ink)]">
          {openLetter.title}
        </p>

        <div className="mt-4 space-y-3 text-base leading-snug text-[var(--ink)]">
          {openLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h3 className="mt-5 text-base font-bold text-[var(--ink)]">
          {openLetter.concernsHeading}
        </h3>
        <ol className="mt-3 space-y-3">
          {openLetter.concerns.map((concern, index) => {
            const title = "title" in concern ? concern.title : null;
            return (
              <li
                key={title ?? concern.text}
                className="text-base leading-snug text-[var(--ink)]"
              >
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

        <p className="mt-5 text-base leading-snug text-[var(--ink)]">
          {openLetter.impact}
        </p>

        <p className="mt-5 text-base leading-snug text-[var(--ink)]">
          {openLetter.demand}
        </p>

        <p className="mt-6 text-base leading-snug text-[var(--ink)]">
          {openLetter.closing}
        </p>
        <p className="mt-3 text-base font-bold leading-snug text-[var(--ink)]">
          {openLetter.signedByLabel}
        </p>
      </article>
    </div>
  );
}
