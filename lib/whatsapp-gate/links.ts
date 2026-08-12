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
  | "south-shields"
  | "photos-only"
  | "mesh-bags"
  | "site-contact"
  | "__community__";

const ENCODED_LINKS: Record<WhatsappLinkKey, string> = {
  "whitley-bay": "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9IOE55VFI0QVRoSklUMDE0V2M1b29F",
  "cullercoats-bay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9MSklFNXhxc3FXbUdBSWwycEx0NHQy",
  longsands: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9LdHJhSFhxOFEzUjZKckFOeGt6aThO",
  "king-edwards-bay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9LMmxrdERzNU5BajdVRzFTWW9EWXdo",
  "tynemouth-haven":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9JVXA0WUF4czdZbzd2WkFxZU82WjFJ",
  newbiggin: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9GM0JwWjRkdzNnbUdscVRNN3JQZnR4",
  cambois: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9DOWJXRnlhZHlIMTVrZ0lSMVFUQkxR",
  "fish-quay":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9FM1VGcm5KRlJFNzE5bFQ3Qnp0V29v",
  "south-shields":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9LZmQwQkFCeDBkVEg5UTlVZ1VrczRy",
  "photos-only":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9CdTNQVlF6RHZiRjAzazZmME5UdmdL",
  "mesh-bags":
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9DZWdjaWI1WnRXb0FvcEdZR1NUanVr",
  "site-contact": "aHR0cHM6Ly93YS5tZS80NDc3NDU3MjAzMTk=",
  __community__:
    "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9LWFRaNnpPNjlzaTB2TnFOMG5yYzFm",
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
  "south-shields": "south-shields",
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
    case "photos-only":
      return "PHOTOS ONLY WhatsApp";
    case "mesh-bags":
      return "mesh bag WhatsApp";
    case "site-contact":
      return "site maintainer WhatsApp";
    default:
      return "beach WhatsApp";
  }
}
