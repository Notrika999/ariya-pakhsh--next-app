import About from "@/components/ui/About/About";
import { absoluteUrl } from "@/src/lib/seo/site";
import React from "react";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/about"),
  },
};

function AboutUs() {
  return (
    // <!-- START CONTENT -->
    <About />
  );
}

export default AboutUs;
