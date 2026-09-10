import About from "@/components/ui/About/About";
import { buildCanonical } from "@/src/lib/seo/canonical";
import React from "react";

export const metadata = {
  alternates: {
    canonical: buildCanonical("/about"),
  },
};

function AboutUs() {
  return (
    // <!-- START CONTENT -->
    <About />
  );
}

export default AboutUs;
