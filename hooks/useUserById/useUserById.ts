"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserDate } from "./type";

export function useUserById(userId: string | null) {
  const [user, setUser] = useState<UserDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setError(error.message);
        setUser(null);
      } else {
        setUser(data);
        setError(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
