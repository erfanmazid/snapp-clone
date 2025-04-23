"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export const useRideRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("status", "waiting")
        .order("created_at", { ascending: false });

      if (!error) setRequests(data || []);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return { requests, loading };
};
