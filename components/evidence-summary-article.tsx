import { Callout } from "@/components/ui/callout";
import { Stat } from "@/components/ui/stat";

const linkClass = "font-bold text-mark underline underline-offset-2";

const stats = [
  { label: "Parsed messages", value: "9,751" },
  { label: "Media files", value: "1,689" },
  { label: "Unique media", value: "1,429" },
  { label: "Duplicate copies", value: "260" },
] as const;

const sources = [
  "General",
  "Admin",
  "Call to Action",
  "Cullercoats",
  "Fish Quay",
  "King Eddies",
  "Longsands",
  "Dedicated photo-evidence group",
  "Tynemouth Haven",
  "Whitley Bay",
] as const;

const sections = [
  { href: "#spill", label: "Spill" },
  { href: "#chronology", label: "Chronology" },
  { href: "#impact", label: "Impact" },
  { href: "#communications", label: "Communications" },
  { href: "#photo-set", label: "Photo set" },
  { href: "#gaps", label: "Gaps" },
] as const;

const chronology = [
  {
    date: "19 July",
    text: "Date of the collision and release according to the official Port account. This predates the supplied WhatsApp community exports.",
  },
  {
    date: "23 July",
    text: "The General group was created. Messages already discuss Environment Agency and council positions, disposal advice, volunteer mobilisation, letters to authorities, and contacting Ørsted. The first media in the supplied General folder was posted at 17:49.",
  },
  {
    date: "23–24 July",
    text: "The evidence group later received photographs expressly captioned as material collected at Tynemouth Haven on 23 July and Whitley Bay on 24 July. The Whitley Bay group also contains media from 24 July.",
  },
  {
    date: "25 July",
    text: "Photographs document Longsands, Fish Quay-to-pier, and other locations. One evidence-group caption describes Longsands from 19:00–22:00 before collection.",
  },
  {
    date: "26–31 July",
    text: "Intensive daily evidence appears across Fish Quay, Longsands, Whitley Bay, Cullercoats, King Edward’s Bay, Tynemouth Haven and further north. Messages describe fresh tidal lines, pellets mixed with seaweed, pellets adhering to river walls and rocks, material floating in the river, repeated re-deposition after tides and ship wakes, and large quantities collected by volunteers.",
  },
  {
    date: "30–31 July",
    text: "Admin messages focus on action at the river source, Port of Tyne access, trained marine volunteers, press activity and an open letter. A 31 July update reports a phone call with the Mayor’s office and says that office supported the request for trained volunteers and would seek a Port meeting.",
  },
] as const;

const locations = [
  "Fish Quay, the river wall, the piers and the River Tyne",
  "Tynemouth Haven",
  "Longsands",
  "King Edward’s Bay (“King Eddies”)",
  "Cullercoats",
  "Whitley Bay, including Panama/Spanish City and adjoining sections",
  "Seaton Sluice",
  "Blyth beach",
] as const;

const communications = [
  {
    date: "23 July, General",
    text: "A participant says the Environment Agency was not sanctioning volunteers and that an emergency question had been put to the council.",
  },
  {
    date: "23 July, General",
    text: "Discussion confirms that open letters to North Tyneside Council and the Environment Agency already existed and proposes a version to Ørsted. This message does not prove delivery; the original letters/emails should be added.",
  },
  {
    date: "24 July, General",
    text: "Detailed discussion of the Environment Agency response and proposed council/press questions.",
  },
  {
    date: "27 July, Whitley Bay",
    text: "Messages say Councillor Helen Bell was asked to raise the issue at a council meeting.",
  },
  {
    date: "28 July, King Eddies",
    text: "A volunteer records reporting more than 1,000 pellets on rocks through North Tyneside Council’s reporting page.",
  },
  {
    date: "28 July, Whitley Bay",
    text: "A volunteer records emailing North Tyneside Council about parking enforcement affecting volunteers.",
  },
  {
    date: "29 July, Fish Quay",
    text: "Messages say volunteers had spoken with contractor Briggs and had been asked to help; this should be corroborated with the people involved or contractor records.",
  },
  {
    date: "30–31 July, Admin",
    text: "Discussion of Port of Tyne, council, contractors, MPs and the Mayor; drafting of an open letter to Port Chief Executive Matt Beeton; and attempts to obtain direct introductions/contact.",
  },
  {
    date: "31 July, Admin",
    text: "An organiser reports that the Mayor’s office endorsed the request for trained water professionals, was asked to sign the open letter, and would contact the Port to support a meeting. Obtain the actual call note, emails and final letter to corroborate this account.",
  },
] as const;

const photoSet = [
  {
    title: "Earliest captioned evidence",
    text: "Tynemouth Haven (collected 23 July) and Whitley Bay (24 July).",
  },
  {
    title: "River/source evidence",
    text: "Fish Quay water, walls, piers and floating pellets.",
  },
  {
    title: "Beach spread",
    text: "At least one wide-context and one close-up image from Longsands, King Edward’s Bay, Cullercoats and Whitley Bay.",
  },
  {
    title: "Northern spread",
    text: "Seaton Sluice and Blyth.",
  },
  {
    title: "Habitat interaction",
    text: "Pellets in seaweed, among rocks and in the intertidal zone.",
  },
  {
    title: "Persistence / re-deposition",
    text: "Matched locations photographed on different dates or after different tides.",
  },
  {
    title: "Scale of response",
    text: "Filled bags/containers or photographs showing quantities collected, while keeping these distinct from photographs showing pollution in situ.",
  },
] as const;

const gaps = [
  "Add the meeting minutes and original email files, including headers and attachments.",
  "Obtain copies of submitted web forms, ticket/reference numbers, call notes and replies.",
  "Ask photographers to confirm location, capture date/time, what the image shows, and whether it was taken before or after cleanup — especially where the WhatsApp message has no caption.",
  "Confirm whether any media was sent using disappearing/view-once messages; these do not appear in ordinary exports.",
  "Do not state that Ørsted, Cadeler, either vessel owner/operator, the Port, or another party was legally responsible based only on these chats. Preserve the distinction between the physical source of the spill, contractual relationships, and legal fault.",
] as const;

export function EvidenceSummaryArticle() {
  return (
    <article className="text-ink">
      <p className="text-eyebrow text-mark">Organising team briefing</p>

      <h1 className="mt-4 text-page-title">
        Preliminary evidence summary for pre-call use
      </h1>

      <p className="mt-4 text-meta font-bold">
        WhatsApp sources · 23–31 July 2026
      </p>

      <Callout tone="warning" className="mt-6">
        <p className="text-eyebrow">Preliminary — not a legal conclusion</p>
        <p className="mt-2 text-body">
          This page is unlisted and intended for the organising team. Statements
          made by group participants are identified as such and should not be
          treated as independently verified. The review does not establish legal
          fault or contractual liability.
        </p>
      </Callout>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} label={stat.label} value={stat.value} size="sm" />
        ))}
      </dl>
      <p className="mt-4 text-meta">
        1,438 JPG images and 251 MP4 videos. Every attachment filename mentioned
        in the supplied chats is present. 407 messages were automatically flagged
        for authority/company review.
      </p>

      <nav
        aria-label="On this page"
        className="mt-8 border-y border-line py-4"
      >
        <p className="text-eyebrow text-mute mb-3">On this page</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-meta">
          {sections.map((section) => (
            <li key={section.href}>
              <a href={section.href} className={linkClass}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="scope" className="scroll-mt-24 mt-10" aria-labelledby="scope-heading">
        <h2 id="scope-heading" className="text-section">
          Scope and status
        </h2>
        <div className="mt-4 space-y-4 text-body">
          <p>
            This review covers ten supplied WhatsApp sources. The messages run
            from 23 to 31 July 2026.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {sources.map((source) => (
              <li
                key={source}
                className="border-t border-line pt-2 text-meta first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
              >
                {source}
              </li>
            ))}
          </ul>
          <p className="text-meta">
            The original ZIP exports, searchable gallery, media index and
            flagged-communications CSV remain in the evidence pack. They are not
            published on this page.
          </p>
        </div>
      </section>

      <section id="spill" className="scroll-mt-24 mt-12" aria-labelledby="spill-heading">
        <h2 id="spill-heading" className="text-section">
          Spill: date, mechanism, source, and quantity
        </h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-body">
          <li>
            The official account now available from the Port of Tyne says that
            at approximately 13:00 on Sunday 19 July 2026, Wind Orca was leaving
            dock and collided with the berthed container ship BG Orange. A
            quayside gantry crane was damaged/collapsed, containers were
            damaged, and plastic pellets entered the River Tyne.
          </li>
          <li>
            The WhatsApp messages consistently identify the river/Port of Tyne
            as the origin of the pellets reaching beaches. They discuss Wind
            Orca, BG Orange, the damaged containers, and Wind Orca’s reported
            connection to work for Ørsted/Cadeler. Some messages explicitly
            acknowledge that the investigation into responsibility was still
            ongoing.
          </li>
          <li>
            Organisers’ draft open letter of 30–31 July refers to “over 24
            tonnes.” Contemporary public reporting referred to roughly 24–25
            tonnes. A later UK government statement dated 10 August describes
            the release as approximately 17 tonnes. The amount should therefore
            be presented as disputed or updated, with the latest official figure
            checked before use.
          </li>
          <li>
            The Marine Accident Investigation Branch listed a preliminary
            assessment into the contact between Wind Orca and BG Orange. The
            WhatsApp material does not itself establish legal fault or
            contractual liability.
          </li>
        </ul>
      </section>

      <section
        id="chronology"
        className="scroll-mt-24 mt-12"
        aria-labelledby="chronology-heading"
      >
        <h2 id="chronology-heading" className="text-section">
          Chronology evidenced in the chats
        </h2>
        <ol className="mt-6 space-y-0">
          {chronology.map((item) => (
            <li
              key={item.date}
              className="grid gap-1 border-t border-line py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
            >
              <p className="text-eyebrow text-mark pt-1">{item.date}</p>
              <p className="text-body">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="impact" className="scroll-mt-24 mt-12" aria-labelledby="impact-heading">
        <h2 id="impact-heading" className="text-section">
          Environmental and geographic impact
        </h2>
        <div className="mt-4 space-y-4 text-body">
          <p>
            The photographs and videos cover both the River Tyne/Fish Quay
            environment and a broad stretch of coastline. Locations explicitly
            named in captions or close message context include:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {locations.map((location) => (
              <li key={location}>{location}</li>
            ))}
          </ul>
          <p>
            The evidence shows or describes pellets floating on water, stuck to
            quay/river walls, gathered along tide lines, dispersed through sand,
            trapped among rocks, and mixed through seaweed. Messages also record
            concern about disturbance to seaweed, small animals and intertidal
            habitat during cleanup. This is relevant to both the pollution
            impact and the potential ecological effects of repeated removal
            work.
          </p>
          <p className="text-meta">
            Photographs without a same-message caption retain the immediately
            preceding and following messages in the CSV index in the evidence
            pack. Search there by beach name, date, group, sender or wording in
            the caption/context.
          </p>
        </div>
      </section>

      <section
        id="communications"
        className="scroll-mt-24 mt-12"
        aria-labelledby="communications-heading"
      >
        <h2 id="communications-heading" className="text-section">
          Communications with authorities, regulators, and companies
        </h2>
        <p className="mt-4 text-body">
          The exports contain relevant records, but many are reports{" "}
          <em>about</em> calls/emails or plans to contact bodies rather than
          copies of the underlying correspondence. The strongest WhatsApp
          records include:
        </p>
        <ol className="mt-6 space-y-0">
          {communications.map((item, index) => (
            <li
              key={`${item.date}-${index}`}
              className="grid gap-1 border-t border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
            >
              <p className="text-eyebrow text-mark pt-1">{item.date}</p>
              <p className="text-body">{item.text}</p>
            </li>
          ))}
        </ol>
        <Callout tone="muted" className="mt-4">
          <p className="text-body">
            The file{" "}
            <code className="font-bold">authority_company_communications.csv</code>{" "}
            contains 407 automatically flagged messages. It is intentionally
            broad and needs human/legal review; inclusion does not mean a
            message is itself a communication sent to the named body.
          </p>
        </Callout>
      </section>

      <section
        id="photo-set"
        className="scroll-mt-24 mt-12"
        aria-labelledby="photo-set-heading"
      >
        <h2 id="photo-set-heading" className="text-section">
          Recommended photo set for the call
        </h2>
        <p className="mt-4 text-body">
          Rather than sending all 1,429 unique files initially, select a smaller
          chronology demonstrating spread and persistence:
        </p>
        <ol className="mt-6">
          {photoSet.map((item, index) => (
            <li
              key={item.title}
              className="flex gap-4 border-t border-line py-5"
            >
              <span className="text-eyebrow text-mark w-8 shrink-0 pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-bold">{item.title}</span>
                <span className="mt-1 block text-body text-mute">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-meta">
          For each selected file, provide the original image/video, its row from{" "}
          <code className="font-bold">media_evidence_index.csv</code>, and a
          screenshot or extract of the surrounding messages. Keep the untouched
          ZIP exports as the master record.
        </p>
      </section>

      <section id="gaps" className="scroll-mt-24 mt-12" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" className="text-section">
          Important gaps and follow-up
        </h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-body">
          {gaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
