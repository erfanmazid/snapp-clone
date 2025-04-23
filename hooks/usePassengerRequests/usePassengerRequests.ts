import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PassengerRequest } from "./type";

export function usePassengerRequests(userId: string | null) {
  const [requests, setRequests] = useState<PassengerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("passenger_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setRequests([]);
      } else {
        setRequests(data as PassengerRequest[]);
        setError(null);
      }

      setLoading(false);
    };

    fetchRequests();
  }, [userId]);

  return { requests, loading, error };
}
