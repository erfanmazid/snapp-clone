"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface RideRequest {
  id: string;
  passenger_name: string;
  origin: string;
  destination: string;
  duration: number;
  suggested_price: number;
  status: string;
  created_at: string;
}

export const useRideRequests = () => {
  const [requests, setRequests] = useState<RideRequest[]>([]);
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

    // Set up real-time subscription
    const subscription = supabase
      .channel("ride_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ride_requests",
          filter: "status=eq.waiting",
        },
        (payload) => {
          const newRequest = payload.new as RideRequest;
          setRequests((prev) => [newRequest, ...prev]);
          toast.success("درخواست جدید دریافت شد!", {
            position: "top-center",
            duration: 3000,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { requests, loading };
};
