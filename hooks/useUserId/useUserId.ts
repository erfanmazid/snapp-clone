"use client";

import { useEffect, useState } from "react";

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // بررسی می‌کنیم که آیا در محیط مرورگر هستیم
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem(
          "sb-lwzyvmumnplvtbptahti-auth-token"
        );
        if (token) {
          const parsed = JSON.parse(token);
          setUserId(parsed?.user?.id ?? null);
        }
      } catch (err) {
        console.error("خطا در دریافت userId:", err);
      }
    }
  }, []);

  return userId;
}
