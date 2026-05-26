import Image from "next/image";
import React from "react";
import Information from "./Information";
import Link from "next/link";
import ContactForm from "./ContactForm";
import SocialNetworks from "./SocialNetworks";
import Support from "./Support";
import Map from "./Map";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export default function Contact() {
  return (
    <SectionContainer>
      {/* <!--Contact information cards--> */}
      <Information />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!--Contact form--> */}
        <ContactForm />

        {/* <!--Information sidebar--> */}
        <div className="space-y-8">
          {/* <!--Social networks--> */}
          <SocialNetworks />

          {/* <!--Support information--> */}
          <Support />
        </div>
      </div>

      {/* <!-- Map --> */}
      <Map />
    </SectionContainer>
  );
}
