export type MpLookup = {
  id: number;
  nameDisplayAs: string;
  /** Salutation name, without “MP”. Parliament’s nameAddressAs. */
  nameAddressAs: string;
  /** Formal title for the address block, including “MP” when published. */
  nameFullTitle: string;
  constituency: string;
  party: string | null;
  email: string | null;
  contactUrl: string;
};
