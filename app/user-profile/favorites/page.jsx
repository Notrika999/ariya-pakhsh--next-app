import UserFavorites from "@/components/ui/UserProfile/UserFavorites/UserFavorites";
import React from "react";

function UserFavoritesPage() {
  return <UserFavorites />;
}

export default UserFavoritesPage;

// NOINDEX 
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};