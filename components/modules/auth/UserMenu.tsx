"use client";

import Link from "next/link";
import { AuthService } from "@/src/services/auth/auth.service";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

export default function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);


  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } finally {
      clearUser();
    }
  };


  if (!user) return null;


  return (
    <div className="absolute top-full mt-2 left-0 w-52 rounded-xl bg-white shadow-lg border p-3">
      <p className="font-semibold mb-3">
        {user.fullName}
      </p>


      <Link
        href="/dashboard"
        className="block p-2 rounded hover:bg-gray-100"
      >
        داشبورد من
      </Link>


      <button
        onClick={handleLogout}
        className="w-full text-right p-2 text-red-500 hover:bg-red-50 rounded"
      >
        خروج از حساب
      </button>
    </div>
  );
}