"use client";

import { useEffect, useState } from "react";
import { useMap, Marker } from "react-leaflet";
import L from "leaflet";
import { supabase } from "@/lib/supabaseClient";

const driverIcon = new L.Icon({
  iconUrl: "/driver-location.png", // آیکن راننده
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const LiveDriverLocation = ({ driverId }: { driverId: string }) => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const { data, error } = await supabase
          .from("driver_locations") // اسم جدول موقعیت راننده در Supabase
          .select("lat, lng")
          .eq("driver_id", driverId)
          .single();

        if (error) {
          console.error("خطا در دریافت موقعیت راننده:", error.message);
        } else if (data) {
          const { lat, lng } = data;
          setPosition([lat, lng]);
        }
      } catch (error) {
        console.error("خطا در دریافت موقعیت راننده:", error);
      }
    };

    fetchDriverLocation();

    const interval = setInterval(() => {
      fetchDriverLocation();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [driverId, map]);

  return position ? <Marker position={position} icon={driverIcon} /> : null;
};

export default LiveDriverLocation;
