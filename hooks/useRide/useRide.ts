import { Ride } from "@/app/trip/[tripId]/type";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export const useRide = (rideId: string) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) return;

    const fetchRide = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("id", rideId)
        .single();

      if (error) {
        console.error("خطا در گرفتن اطلاعات سفر:", error.message);
        return;
      }

      setRide(data);
      setLoading(false);
    };

    fetchRide();

    const subscription = supabase
      .channel("realtime:ride")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideId}`,
        },
        (payload: { new: Ride }) => {
          const updated = payload.new as Ride;
          setRide(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [rideId]);

  return { ride, loading };
};
