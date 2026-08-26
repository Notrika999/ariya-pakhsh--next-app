import React from "react";

import ChangePasswordTop from "./ChangePasswordTop";
import SecurityTips from "./SecurityTips";
import ChangePasswordForm from "./ChangePasswordForm";
import SecuritySettings from "./SecuritySettings";

export default function ChangePassword() {
  return (
    <div className="lg:col-span-3 space-y-4">
      {/* <!--Dashboard header--> */}
      <ChangePasswordTop />

      {/* <!--Security Tips--> */}
      <SecurityTips />

      {/* <!--Change Password Form--> */}
      <ChangePasswordForm />

      {/* <!--Security Settings--> */}
      {/* <SecuritySettings /> */}
    </div>
  );
}
