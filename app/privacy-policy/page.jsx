import LegalDocument from "@/components/ui/Legal/LegalDocument";
import { loadLegalMarkdown } from "@/src/lib/legal/load-legal-markdown";
import { absoluteUrl } from "@/src/lib/seo/site";

export const metadata = {
  title: "سیاست حفظ حریم خصوصی",
  alternates: {
    canonical: absoluteUrl("/privacy-policy"),
  },
};

export default async function PrivacyPolicy() {
  const doc = await loadLegalMarkdown("privacy-policy.md");
  return <LegalDocument doc={doc} />;
}
