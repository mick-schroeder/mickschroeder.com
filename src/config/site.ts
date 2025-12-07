export const siteConfig = {
  title: "Mick Schroeder",
  description: "Irish-American indie software developer and pharmacist.",
  siteUrl: "https://www.mickschroeder.com",
  author: "Mick Schroeder",
  image: "/images/og-card.png",
  social: {
    twitter: "@mick_schroeder",
    github: "mick-schroeder",
    linkedin: "schroedermick",
    email: "mick@mickschroeder.com",
  },
  person: {
    fullName: "Mick Schroeder, Pharm.D.",
    givenName: "Michael",
    familyName: "Schroeder",
    alternateName: "Mick",
    jobTitle: "Informatics Pharmacist",
    alumniOf: [
      { name: "Trinity College Dublin", url: "https://www.tcd.ie/" },
      { name: "Philadelphia College of Pharmacy", url: "https://www.sju.edu/departments/philadelphia-college-pharmacy" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
