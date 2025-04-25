"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useEndRide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const endRide = async (rideId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get ride details to find passenger_id and driver_id
      const { data: ride, error: rideError } = await supabase
        .from("rides")
        .select("passenger_id, driver_id")
        .eq("id", rideId)
        .single();

      if (rideError) throw rideError;

      // Update ride status
      const { error: updateRideError } = await supabase
        .from("rides")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", rideId);

      if (updateRideError) throw updateRideError;

      // Reset driver's ride status
      const { error: driverUpdateError } = await supabase.rpc(
        "update_user_ride_status",
        {
          user_id: ride.driver_id,
          in_ride: false,
          ride_id: null,
        }
      );

      if (driverUpdateError) throw driverUpdateError;

      // Reset passenger's ride status
      const { error: passengerUpdateError } = await supabase.rpc(
        "update_user_ride_status",
        {
          user_id: ride.passenger_id,
          in_ride: false,
          ride_id: null,
        }
      );

      if (passengerUpdateError) throw passengerUpdateError;

      // Update ride request status to matched (since completed is not allowed)
      const { error: requestUpdateError } = await supabase
        .from("ride_requests")
        .update({ status: "matched" })
        .eq("ride_id", rideId);

      if (requestUpdateError) throw requestUpdateError;

      setSuccess(true);
      return true;
    } catch (err) {
      console.error("❌ Error ending ride:", err);
      setError("مشکلی در پایان سفر رخ داد");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { endRide, loading, error, success };
};
