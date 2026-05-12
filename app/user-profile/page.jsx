import UserProfile from "@/components/ui/UserProfile/UserProfile";
import Image from "next/image";
import React from "react";

function UserProfilePage() {
  return <UserProfile />;
}

export default UserProfilePage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};