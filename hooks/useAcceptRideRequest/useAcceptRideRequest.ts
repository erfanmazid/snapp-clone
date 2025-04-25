"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserId } from "../useUserId/useUserId";
import { RideRequest } from "../useRideRequest/type";

export const useAcceptRideRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rideId, setRideId] = useState<string | null>(null);
  const userId = useUserId();

  const acceptRide = async (request: RideRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // مرحله 1: ایجاد سفر در rides
      const { data: ride, error: insertError } = await supabase
        .from("rides")
        .insert({
          passenger_id: request.user_id,
          passenger_name: request.passenger_name,
          from_lat: request.from_lat,
          from_lng: request.from_lng,
          to_lat: request.to_lat,
          to_lng: request.to_lng,
          distance_km: null,
          price: request.suggested_price,
          driver_id: userId,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const newRideId = ride?.id ?? null;
      setRideId(newRideId);

      // مرحله 2: آپدیت وضعیت به matched و ذخیره ride_id در ride_requests
      const { error: updateError } = await supabase
        .from("ride_requests")
        .update({
          status: "matched",
          ride_id: newRideId,
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // مرحله 3: آپدیت وضعیت راننده
      const { error: driverUpdateError } = await supabase.rpc(
        "update_user_ride_status",
        {
          user_id: userId,
          in_ride: true,
          ride_id: newRideId,
        }
      );

      if (driverUpdateError) throw driverUpdateError;

      // مرحله 4: آپدیت وضعیت مسافر
      const { error: passengerUpdateError } = await supabase.rpc(
        "update_user_ride_status",
        {
          user_id: request.user_id,
          in_ride: true,
          ride_id: newRideId,
        }
      );

      if (passengerUpdateError) {
        console.error("❌ Error updating passenger:", passengerUpdateError);
        throw passengerUpdateError;
      }

      // مرحله 5: تأخیر برای هماهنگی با سمت مسافر
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setSuccess(true);
      return newRideId;
    } catch (err) {
      console.error("❌ Error accepting ride request:", err);
      setError("مشکلی در قبول درخواست رخ داد");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { acceptRide, loading, error, success, rideId };
};
