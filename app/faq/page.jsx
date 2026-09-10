import Faq from "@/components/ui/Faq/Faq";
import { buildCanonical } from "@/src/lib/seo/canonical";
import React from "react";

export const metadata = {
  alternates: {
    canonical: buildCanonical("/faq"),
  },
};

function FaqPage() {
  return (
    // <!-- START CONTENT -->
    <Faq />
  );
}

export default FaqPage;
