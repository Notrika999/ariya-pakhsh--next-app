import Faq from "@/components/ui/Faq/Faq";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/faq"),
  },
};

function FaqPage() {
  return (
    // <!-- START CONTENT -->
    <Faq />
  );
}

export default FaqPage;
