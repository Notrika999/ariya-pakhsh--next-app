import React from "react";
import SidebarResponsive from "../SidebarResponsive";
import UserSidebar from "../UserSidebar";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import UserInformationTop from "./UserInformationTop";
import PersonalInfoForm from "./PersonalInfoForm";
import UserInformationSecuritySettings from "./UserInformationSecuritySettings";
import UserInformationAccountPreferences from "./UserInformationAccountPreferences";

export default function UserInformation() {
  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header-->/ */}
      <UserInformationTop />

      {/* <!--Personal Information Form--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"اطلاعات شخصی"} />

       <PersonalInfoForm />
      </div>

      {/* <!--Security Settings--> */}
      <UserInformationSecuritySettings />

      {/* <!--Account Preferences--> */}
      <UserInformationAccountPreferences />
    </div>
  );
}
