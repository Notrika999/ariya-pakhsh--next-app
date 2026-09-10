import Contact from "@/components/ui/Contact/Contact";
import { buildCanonical } from "@/src/lib/seo/canonical";
import React from "react";

export const metadata = {
  alternates: {
    canonical: buildCanonical("/contact"),
  },
};

function ContactsUs() {
  return (
    // <!-- START CONTENT -->
    <Contact />
  );
}

export default ContactsUs;
