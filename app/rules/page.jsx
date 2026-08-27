import LegalDocument from "@/components/ui/Legal/LegalDocument";
import { loadLegalMarkdown } from "@/src/lib/legal/load-legal-markdown";
import { absoluteUrl } from "@/src/lib/seo/site";

export const metadata = {
  title: "قوانین و مقررات",
  alternates: {
    canonical: absoluteUrl("/rules"),
  },
};

export default async function RulesPage() {
  const doc = await loadLegalMarkdown("terms.md");
  return <LegalDocument doc={doc} />;
}
