import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { siteConfig } from "@/data/site-config";
import { publicPageMetadata } from "@/lib/site-metadata";
import { absoluteSiteUrl } from "@/lib/site-url";
import { homeHtml } from "@/proto/home.html";

export const metadata = publicPageMetadata("/");

const college = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  "@id": `${absoluteSiteUrl("/")}#college`,
  name: siteConfig.name,
  url: absoluteSiteUrl("/"),
  logo: absoluteSiteUrl(siteConfig.logoPath),
  telephone: siteConfig.telephone,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UG",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(college).replace(/</g, "\\u003c") }}
      />
      <div className="rg" dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <PrototypeRuntime />
    </>
  );
}
