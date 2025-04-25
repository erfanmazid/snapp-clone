"use client";

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

    try {
      // مرحله 1: ایجاد درخواست سفر
      const { data: insertData, error: insertError } = await supabase
        .from("ride_requests")
        .insert([
          {
            user_id: data.user_id,
            from_lat: data.from_lat,
            from_lng: data.from_lng,
            to_lat: data.to_lat,
            to_lng: data.to_lng,
            suggested_price: data.suggested_price,
            status: data.status || "waiting",
            passenger_name: data.passenger_name,
            duration: data.duration,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      return insertData;
    } catch (err) {
      console.error("❌ Error creating ride request:", err);
      setError(err instanceof Error ? err.message : "خطا در ایجاد درخواست سفر");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRideRequest,
    loading,
    error,
    success,
  };
}
