export interface MediaCoverageItem {
  id: string;
  outlet: string;
  date: string;
  headline: string;
  href: string;
  summary: string;
}

/** Newest first. Headlines and dates taken from the original articles. */
export const mediaCoverage: MediaCoverageItem[] = [
  {
    id: "telegraph-2026-08-28",
    outlet: "The Telegraph",
    date: "2026-08-28",
    headline: "The madcap inventors battling Britain’s nurdle invasion",
    href: "https://www.telegraph.co.uk/news/2026/08/28/the-madcap-inventors-battling-britains-nurdle-invasion/",
    summary:
      "Volunteers and local inventors using homemade sieves, nets and prototype machines to recover pellets after the Port of Tyne spill.",
  },
  {
    id: "bbc-2026-08-06",
    outlet: "BBC News",
    date: "2026-08-06",
    headline: "Plastic nurdle spill an ‘environmental disaster’",
    href: "https://www.bbc.co.uk/news/articles/c36dzpykk0wo",
    summary:
      "Tyne Rivers Trust says fish have already been found with nurdles in their system, and warns the pellets could stay in the river for years.",
  },
  {
    id: "bbc-2026-08-03",
    outlet: "BBC News",
    date: "2026-08-03",
    headline: "Nurdles clean-up volunteers meet Port of Tyne boss",
    href: "https://www.bbc.co.uk/news/articles/c4gdklpvrmjo",
    summary:
      "Campaigners hand an open letter to chief executive Matt Beeton and discuss next steps after pellets washed up along the north-east coast.",
  },
  {
    id: "guardian-2026-08-02",
    outlet: "The Guardian",
    date: "2026-08-02",
    headline:
      "‘There’s no nurdle fairy’: thousands mobilise to clean up plastic spillage in north-east England",
    href: "https://www.theguardian.com/uk-news/2026/aug/02/nurdles-clean-up-plastic-spillage-beaches-north-east-england",
    summary:
      "Volunteers gather at beaches with dustpans, sieves and homemade mesh bags after a ship collision spilled pellets into the Tyne.",
  },
  {
    id: "bbc-2026-07-30",
    outlet: "BBC News",
    date: "2026-07-30",
    headline: "Port of Tyne criticised over nurdle spill response",
    href: "https://www.bbc.co.uk/news/articles/cjd4zdzvj77o",
    summary:
      "A boom was not put in the water until three days after the collision. Thousands of volunteers had already begun clearing beaches.",
  },
  {
    id: "bbc-2026-07-28",
    outlet: "BBC News",
    date: "2026-07-28",
    headline: "Damaged containers cleaned of nurdles, port says",
    href: "https://www.bbc.co.uk/news/articles/cjd4z1zk7n8o",
    summary:
      "Specialist teams vacuum remaining pellets from the split containers, while nurdles continue to wash up from South Shields to Sunderland.",
  },
  {
    id: "northern-echo-2026-07-24",
    outlet: "The Northern Echo",
    date: "2026-07-24",
    headline: "North East mayor demands ship owners fund Tyne nurdle clean-up",
    href: "https://www.thenorthernecho.co.uk/news/26407747.north-east-mayor-demands-ship-owners-fund-tyne-nurdle-clean-up/",
    summary:
      "Kim McGuinness writes to Cadeler and BG Freight Line, arguing the polluter should pay rather than North East taxpayers.",
  },
  {
    id: "bbc-2026-07-23",
    outlet: "BBC News",
    date: "2026-07-23",
    headline: "Mayor hits out at port’s response to pellets spill",
    href: "https://www.bbc.co.uk/news/articles/cy9wlly879po",
    summary:
      "North Tyneside mayor Karen Clark says the Port of Tyne did not act quickly enough as pellets continue to wash up days after the crash.",
  },
];
