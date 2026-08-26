// app/user-profile/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserSidebar from "../../components/ui/UserProfile/UserSidebar";
import UserProfileMobileHeader from "../../components/ui/UserProfile/UserProfileMobileHeader";
import UserProfileAuthGuard from "@/components/modules/auth/UserProfileAuthGuard";
import { AUTH_COOKIE_NAME_ALIASES } from "@/src/lib/auth/constants";

function getFirstCookieValue(cookieStore, names) {
  for (const name of names) {
    const value = cookieStore.get(name)?.value;
    if (value) return value;
  }
  return undefined;
}

export default async function PanelLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = getFirstCookieValue(
    cookieStore,
    AUTH_COOKIE_NAME_ALIASES.ACCESS_TOKEN,
  );
  const refreshToken = getFirstCookieValue(
    cookieStore,
    AUTH_COOKIE_NAME_ALIASES.REFRESH_TOKEN,
  );

  if (!accessToken && !refreshToken) {
    redirect("/");
  }

  return (
    <UserProfileAuthGuard>
      <section className="py-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Sidebar Desktop */}
            <div className="lg:col-span-1 lg:block hidden">
              <div className="sticky top-0">
                <UserSidebar />
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-4">
              <UserProfileMobileHeader />
              {children}
            </div>
          </div>
        </div>
      </section>
    </UserProfileAuthGuard>
  );
}
