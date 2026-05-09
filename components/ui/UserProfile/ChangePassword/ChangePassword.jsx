import React from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import ChangePasswordTop from "./ChangePasswordTop";
import SecurityTips from "./SecurityTips";
import ChangePasswordForm from "./ChangePasswordForm";
import SecuritySettings from "./SecuritySettings";

export default function ChangePassword() {
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <ChangePasswordTop />

      {/* <!--Security Tips--> */}
      <SecurityTips />

      {/* <!--Change Password Form--> */}
      <ChangePasswordForm />

      {/* <!--Security Settings--> */}
      <SecuritySettings />
    </div>
  );
}
