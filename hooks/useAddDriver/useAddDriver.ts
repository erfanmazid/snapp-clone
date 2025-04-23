"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAddDriver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDriver = async ({
    userId,
    carModel,
    carColor,
    plateNumber,
  }: {
    userId: string;
    carModel: string;
    carColor: string;
    plateNumber: string;
  }) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("drivers").insert({
      user_id: userId,
      car_model: carModel,
      car_color: carColor,
      plate_number: plateNumber,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  return {
    addDriver,
    loading,
    error,
  };
}
