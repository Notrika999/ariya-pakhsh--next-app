import React from "react";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import HeroSection from "./HeroSection";
import OurStory from "./OurStory";
import MissionVision from "./MissionVision";
import Statistics from "./Statistics";
import OurValues from "./OurValues";
import OurTeam from "./OurTeam";
import CTASection from "./CTASection";

export default function About() {
  return (
    <SectionContainer>
      {/* <!-- Hero Section --> */}
      <HeroSection />

      {/* <!-- Our Story --> */}
      <OurStory />

      {/* <!-- Mission & Vision --> */}
      <MissionVision />

      {/* <!-- Statistics --> */}
      <Statistics />

      {/* <!-- Our Values --> */}
      <OurValues />

      {/* <!-- Our Team --> */}
      {/* <OurTeam /> */}

      {/* <!-- CTA Section --> */}
      <CTASection />
    </SectionContainer>
  );
}
