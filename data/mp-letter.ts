/**
 * Letter constituents send to their MP, asking them to sign the open letter
 * for a government-funded Port of Tyne clean-up.
 *
 * Edit the wording here. The “4 months” line will go out of date.
 */

export const MP_LETTER_SUBJECT =
  "Please sign the open letter on the Port of Tyne nurdle spill";

export const MP_LETTER_PARAGRAPHS = [
  "I am writing as your constituent to ask you to add your name to the open letter calling on central government to fund an urgent, long-term clean-up of the Port of Tyne plastic nurdle spill.",
  "It is clear that this is not a pollution incident that will resolve itself in a matter of weeks or months: five years after the X-Press Pearl disaster in Sri Lanka, nurdles are still washing up on beaches, demonstrating the long-term consequences of inadequate recovery and the need for sustained clean-up and monitoring.",
  "Yet here in the North East, just 4 months after the spill, professional, insurer-funded clean-up operations are being scaled back despite substantial evidence that plastic pollution remains. Meanwhile, the small team of agency workers brought in by local councils to continue the clean-up are working under repeated short term extensions. This is no way to manage an environmental disaster of this scale.",
  "The community has robust evidence showing that the coastline is far from “clean”. Over the past three months, trained volunteers have systematically mapped 40 miles of coastline, using the Plastic Pollution Index methodology developed by ITOPF (the International Tanker Owners Pollution Federation), an internationally recognised authority on marine pollution response. Their findings consistently show nurdle densities at 'high' or 'very high' levels, which directly challenges the decision to scale back professional clean-up operations.",
  "I also have serious concerns about the lack of transparency and accountability in the official response and decision-making process. The Scientific, Technical and Advisory Cell (STAC) has suggested that the community is kept informed through its involvement in the Local Resilience Forum's Volunteer Liaison Group (VLG). In reality, despite repeated efforts to engage, the community has been left largely in the dark. There has been no public update from the response groups for months. Their last assessment in September indicated that 71% of the almost 18 tonnes of plastic pellets entering the river had not been recovered through shoreline and on water operations. No subsequent measurements or criteria have been published to explain how beaches have been deemed 'clean' to explain the de-escalation, or to demonstrate that this judgement is supported by evidence.",
  "I believe that the current response is inadequate and cannot be allowed to continue. It is unreasonable to expect volunteers and a handful of council workers, equipped with improvised tools and insufficient resources, to tackle pollution on this scale. The coastline needs a coordinated, cross-boundary response involving specialist teams, mechanised equipment and sustained funding, with clean-up and monitoring guided by robust scientific evidence.",
  "The polluter must ultimately pay, but we cannot wait years for litigation to conclude before meaningful action is taken. Nor should the financial burden fall on already stretched local authorities. This is a major environmental incident requiring urgent central government support.",
] as const;

const CLOSING_REST =
  "to stand with affected coastal communities, MPs and councillors by signing the open letter calling for the publication of evidence from the STAC giving full attention to the community data, establish a mobile cross-boundary recovery response and secure long-term funding while keeping responsible parties accountable.";

const CLOSING_DELAY =
  "Our coastline and wildlife cannot afford further delays.";

export function mpLetterClosing(northEastMp: boolean): string {
  const urge = northEastMp
    ? `As a North East MP, I urge you ${CLOSING_REST}`
    : `I urge you ${CLOSING_REST}`;
  return `${urge}\n\n${CLOSING_DELAY}`;
}

/** Westminster constituencies in the North East region, 2024 boundaries. */
const NORTH_EAST_CONSTITUENCIES = new Set(
  [
    "Bishop Auckland",
    "Blaydon and Consett",
    "Blyth and Ashington",
    "City of Durham",
    "Cramlington and Killingworth",
    "Darlington",
    "Easington",
    "Gateshead Central and Whickham",
    "Hartlepool",
    "Hexham",
    "Houghton and Sunderland South",
    "Jarrow and Gateshead East",
    "Middlesbrough and Thornaby East",
    "Middlesbrough South and East Cleveland",
    "Newcastle upon Tyne Central and West",
    "Newcastle upon Tyne East and Wallsend",
    "Newcastle upon Tyne North",
    "Newton Aycliffe and Spennymoor",
    "North Durham",
    "North Northumberland",
    "Redcar",
    "South Shields",
    "Stockton North",
    "Stockton West",
    "Sunderland Central",
    "Tynemouth",
    "Washington and Gateshead South",
  ].map((name) => name.toLowerCase()),
);

export function isNorthEastConstituency(name: string): boolean {
  return NORTH_EAST_CONSTITUENCIES.has(name.trim().toLowerCase());
}
