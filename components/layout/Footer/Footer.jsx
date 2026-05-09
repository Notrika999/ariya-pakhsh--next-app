import React from "react";

import Services from "./Services/Services";
import Menus from "./Menus/Menus";
import Copyright from "./Copyright/Copyright";

export default function Footer() {
  return (
    <footer className="custom-gradient">
      {/* <!--Services section--> */}
      <Services />

      {/* <!--Footer Menus Section--> */}
      <Menus />

      {/* <!--Copyright--> */}
      <Copyright />
    </footer>
  );
}
