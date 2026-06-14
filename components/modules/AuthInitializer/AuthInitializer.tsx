"use client";

import { useEffect } from "react";
import { getMe } from "@/src/services/auth/auth.service";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";


export default function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getMe();

        setUser(user);
      } catch {
        // لاگین نیست
      }
    };


    loadUser();
  }, []);


  return null;
}