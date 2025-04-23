"use client";
import { useEffect, useState } from "react";
import { UserDate } from "@/hooks/useUserById/type";

export function useUserFromLocalStorage(): UserDate | null {
  const [user, setUser] = useState<UserDate | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("sb-lwzyvmumnplvtbptahti-auth-token");
      if (token) {
        const parsed = JSON.parse(token);
        setUser(parsed?.user ?? null);
      }
    } catch (err) {
      console.error("خطا در دریافت اطلاعات کاربر از localStorage:", err);
    }
  }, []);

  return user;
}
