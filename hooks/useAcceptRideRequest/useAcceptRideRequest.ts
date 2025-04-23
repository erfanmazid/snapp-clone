import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export const useAcceptRideRequest = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptRide = async (id: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase
      .from("ride_requests")
      .update({ status: "matched" })
      .eq("id", id);

    if (error) {
      setError("خطا در قبول درخواست: " + error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return { acceptRide, loading, success, error };
};
