/**
 * Open letter content — edit here, not in the page component.
 * Displayed total = whatsappMemberCount + additive form signatures
 * (people who did not already join WhatsApp in the stated window).
 */
export const openLetter = {
  headerCtaLabel: "An Open Letter to Matt Beeton",
  addressee:
    "An Open Letter to Matt Beeton, Chief Executive of the Port of Tyne,",
  title:
    "Port of Tyne Inadequate Response While Nurdle Spill Continues Unchecked - Request to Authorise Trained Volunteers to Assist.",
  whatsappMemberCount: 2242,
  signedByLabel:
    "Signed by 2242 members of the voluntary effort to respond to the Port of Tyne Nurdle Catastrophe",
  paragraphs: [
    "Nearly two weeks after over 24 tonnes of raw plastic pellets (‘nurdles’) were spilled into the River Tyne, community organisers and regional marine groups are expressing outrage over the Port of Tyne’s inadequate response.",
    "While official contractors (Briggs Marine and Ambipar) have been deployed (with minimal workers) the response in the River Tyne remains vastly inadequate. There are millions of nurdles still simply floating amongst wildlife, waiting to be collected, with a steady stream heading out of the piers into the North Sea and onto our beaches.",
  ],
  concernsHeading: "Key Concerns:",
  concerns: [
    {
      title: "Inaction at the Source",
      text: "The vast majority of nurdles washing onto local beaches originate from floating plumes trapped in the river and harbour areas. Cleaning beaches without clearing the river is an endless cycle.",
    },
    {
      text: "We ask that the Port of Tyne accept assistance from experienced local waterfolk networks—including trained rescue teams and vessel operators ready to assist.",
    },
    {
      title: "Bureaucratic Excuses",
      text: "Recent closures of the River Tyne, officially cited as necessary for crane and vessel salvage, have yielded minimal visible nurdle recovery, leaving millions of pellets floating unchecked.",
    },
  ],
  impact:
    "These pellets may be small, but their environmental impact is profound and will be felt for generations to come. Once released into the marine environment, nurdles are often mistaken for food and ingested by seabirds, fish and marine mammals, causing harm throughout the ecosystem. Their effects become even more severe over time, as the pellets adsorb toxic pollutants from the surrounding water and are passed up the food chain through bioaccumulation. As concentrations of these contaminants increase at each trophic level, the risks to wildlife and human health intensify. Every hour that passes significantly decreases the chances of the disaster being contained, as once dispersed by wind and tide, they are almost impossible to remove and will spread further along our coastline, embedding themselves deeper into beaches, estuaries and the wider marine environment.",
  demand:
    "Our demand is simple: The contractors you have brought in are not enough. You must allow qualified, trained waterfolk onto the River Tyne and allow a coordinated, high-capacity waterfront recovery force into the River Tyne immediately before these microplastics disperse further up and down the coast and into the marine environment.",
  closing: "Sincerely",
} as const;
