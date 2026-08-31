// app/user-profile/(dashboard)/page.jsx
import UserProfile from "@/components/ui/UserProfile/UserProfile";

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
