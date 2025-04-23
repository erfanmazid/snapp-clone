import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RideRequestData } from "./type";

export default function useCreateRideRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createRideRequest = async (data: RideRequestData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: insertError } = await supabase.from("ride_requests").insert([
      {
        user_id: data.user_id,
        passenger_id: data.passenger_id,
        from_lat: data.from_lat,
        from_lng: data.from_lng,
        to_lat: data.to_lat,
        to_lng: data.to_lng,
        suggested_price: data.suggested_price,
        status: data.status || "pending",
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return {
    createRideRequest,
    loading,
    error,
    success,
  };
}
