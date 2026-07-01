// app/user-profile/layout.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SidebarResponsive from "../../components/ui/UserProfile/SidebarResponsive";
import UserSidebar from "../../components/ui/UserProfile/UserSidebar";
import { AUTH_COOKIE_NAMES } from "@/src/lib/auth/constants";

export default async function PanelLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (!accessToken && !refreshToken) {
    redirect("/");
  }

  return (
    <section className="py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Responsive */}
          <div className="lg:hidden block">
            <SidebarResponsive />
          </div>

          {/* Sidebar Desktop */}
          <div className="lg:col-span-1 lg:block hidden">
            <div className="sticky top-0">
              <UserSidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </section>
  );
}