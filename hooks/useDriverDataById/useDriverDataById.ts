"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DriverData } from "./type";

// تایپ اطلاعات راننده

// هوک گرفتن اطلاعات راننده با آیدی یوزر
export function useDriverDataById(userId: string | null) {
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDriver = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // چون فقط یک رکورد برای هر راننده هست

      if (error) {
        setError(error.message);
        setDriver(null);
      } else {
        setDriver(data as DriverData);
      }

      setLoading(false);
    };

    fetchDriver();
  }, [userId]);

  return { driver, loading, error };
}
