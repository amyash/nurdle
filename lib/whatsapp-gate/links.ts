/**
 * Encoded WhatsApp invite tokens — decode only in the browser after the gate passes.
 * Do not render these as hrefs in server HTML.
 */

export type WhatsappLinkKey =
  | "whitley-bay"
  | "cullercoats-bay"
  | "longsands"
  | "king-edwards-bay"
  | "tynemouth-haven"
  | "newbiggin"
  | "cambois"
  | "fish-quay"
  | "seaton-sluice"
  | "blyth"
  | "marina"
  | "rest-of-uk"
  | "site-contact"
  | "__community__";

const ENCODED_LINKS: Record<WhatsappLinkKey, string> = {
  "whitley-bay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9INlQ4MmNDYTNoTkIxbmVTMkd0SFd2",
  "cullercoats-bay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9IMXZSb3Vtb0dnMDk3SFRLN3NoWUxo",
  longsands: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9HbkdrWElZNDdCREpxR3dKZXZiVURi",
  "king-edwards-bay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9CblZLbVlpN1EzNUNZTm1HRFBIamJx",
  "tynemouth-haven":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9GUWxSQURQV0lnSEU2QktiTGFUTU1U",
  newbiggin: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9ETnY4czZWTzhMS0JDM2ZrR2wxOUFX",
  cambois: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9KeWx5U05pYW9oVTlKMFdHOFphY0ZM",
  "fish-quay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9MY3JWRXhTZlo2NUV5bWltVVVXTnJy",
  "seaton-sluice":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9GMlU5VENEbjFFTEFEbGhlSVFPQ2Fn",
  blyth: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9Hblc4ZGhTd05JTUY1R2RPTHpCZWFC",
  marina: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9KY250Q3VPelpoZUNBODRwV082dGRa",
  "rest-of-uk":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9ITWthNktxYlBxMEkzWFZNQVI3Rm40",
  "site-contact": "aHR0cHM6Ly93YS5tZS80NDc3NDU3MjAzMTk=",
  __community__:
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9FalFQY0JveVNtcTZwcjh1YUF0OXpP",
};

const BEACH_LINK_KEYS: Partial<Record<string, WhatsappLinkKey>> = {
  "st-marys-lighthouse": "whitley-bay",
  "whitley-bay-north": "whitley-bay",
  "whitley-bay-central": "whitley-bay",
  "whitley-bay-south": "whitley-bay",
  "browns-bay": "whitley-bay",
  "cullercoats-bay": "cullercoats-bay",
  "longsands-north": "longsands",
  "longsands-south": "longsands",
  "king-edwards-bay": "king-edwards-bay",
  "tynemouth-haven": "tynemouth-haven",
  newbiggin: "newbiggin",
  cambois: "cambois",
  "fish-quay": "fish-quay",
  "seaton-sluice": "seaton-sluice",
  blyth: "blyth",
  marina: "marina",
  "cresswell-to-alnmouth": "__community__",
  "rest-of-uk": "rest-of-uk",
};

export function whatsappLinkKeyForBeach(beachId: string): WhatsappLinkKey {
  return BEACH_LINK_KEYS[beachId] ?? "__community__";
}

export function decodeWhatsappLink(key: WhatsappLinkKey): string {
  const encoded = ENCODED_LINKS[key];
  return atob(encoded);
}

export function whatsappGateLabelForKey(key: WhatsappLinkKey): string {
  switch (key) {
    case "__community__":
      return "community WhatsApp";
    case "site-contact":
      return "site maintainer WhatsApp";
    case "marina":
      return "marina WhatsApp";
    case "rest-of-uk":
      return "Rest of UK WhatsApp";
    default:
      return "beach WhatsApp";
  }
}
