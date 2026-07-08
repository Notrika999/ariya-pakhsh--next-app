import Contact from "@/components/ui/Contact/Contact";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

function ContactsUs() {
  return (
    // <!-- START CONTENT -->
    <Contact />
  );
}

export default ContactsUs;
