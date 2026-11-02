export interface PrivacySection {
  heading: string;
  body: readonly string[];
}
export const privacyUpdated = "2026-04-03";
export const privacySections: readonly PrivacySection[] = [
  {
    heading: "Information Collected",
    body: [
      "This website collects limited technical information when you visit, such as browser type, operating system, referring pages, and basic usage events. If you contact Mick Schroeder directly by email or through another linked platform, any information you provide in that message may also be received.",
      "This site does not require account creation, and it is not intended to collect sensitive personal information through on-site forms.",
    ],
  },
  {
    heading: "How Information Is Used",
    body: [
      "Information is used to operate the site, understand aggregate traffic patterns, improve performance, and respond to messages or business inquiries.",
      "Data collected through analytics is used for measurement and site improvement, not for selling personal information.",
    ],
  },
  {
    heading: "Analytics and Third-Party Services",
    body: [
      "This site may use analytics or hosting providers that collect standard internet log information and device identifiers to help measure traffic and diagnose performance issues.",
      "Links on this site may direct you to third-party services such as GitHub, LinkedIn, or X. Those services have their own privacy practices, and this Privacy Policy does not govern their websites or apps.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This site may use cookies or similar technologies that are necessary for basic functionality, preferences, and analytics. You can usually control cookies through your browser settings.",
    ],
  },
  {
    heading: "Data Sharing",
    body: [
      "Personal information is not sold. Information may be shared with service providers only to the extent reasonably necessary to host the site, provide analytics, maintain security, or respond to lawful requests.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "Information is retained only for as long as reasonably necessary for site operations, analytics, legal compliance, or responding to communications.",
    ],
  },
  {
    heading: "Your Choices",
    body: [
      "You may choose not to contact Mick Schroeder through email links, and you can limit cookies or analytics collection through your browser settings, privacy tools, or device preferences.",
    ],
  },
  {
    heading: "Children's Privacy",
    body: [
      "This website is not directed to children under 13, and it is not knowingly used to collect personal information from children.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated effective date.",
    ],
  },
];
