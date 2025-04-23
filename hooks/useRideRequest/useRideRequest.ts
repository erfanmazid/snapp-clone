import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { RideRequest } from "./type";

export const useRideRequest = (id: string) => {
  const [request, setRequest] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      const { data, error } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("id", id)
        .single<RideRequest>();

      if (!error && data) setRequest(data);
      setLoading(false);
    };

    fetchRequest();
  }, [id]);

  return {
    request,
    loading,
  };
};
