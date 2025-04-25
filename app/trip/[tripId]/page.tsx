// components/TripMap.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useUserId } from "@/hooks/useUserId/useUserId";
import { useRide } from "@/hooks/useRide/useRide";
import { supabase } from "@/lib/supabaseClient";
import { useEndRide } from "@/hooks/useEndRide/useEndRide";

// آیکون‌ها
const driverIcon = new L.Icon({
  iconUrl: "/driver-location.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const passengerIcon = new L.Icon({
  iconUrl: "/user-location.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const fromIcon = new L.Icon({
  iconUrl: "/from.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const toIcon = new L.Icon({
  iconUrl: "/to.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const TripMap = () => {
  const params = useParams();
  const rideId = params.tripId as string;
  const { ride, loading } = useRide(rideId);
  const userId = useUserId();
  const router = useRouter();
  const { endRide, loading: endRideLoading } = useEndRide();

  const isDriver = userId === ride?.driver_id;
  const isPassenger = userId === ride?.passenger_id;

  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(
    null
  );
  const [passengerLocation, setPassengerLocation] = useState<
    [number, number] | null
  >(null);

  // دریافت لوکیشن راننده از Supabase
  useEffect(() => {
    if (!ride) return;
    const channel = supabase
      .channel("driver-location")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "driver_locations",
          filter: `driver_id=eq.${ride.driver_id}`,
        },
        (payload) => {
          const { lat, lng } = payload.new;
          setDriverLocation([lat, lng]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ride]);

  // دریافت موقعیت مسافر
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPassengerLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error("Error getting passenger location:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ارسال موقعیت راننده به Supabase
  useEffect(() => {
    if (!isDriver) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { error } = await supabase.from("driver_locations").upsert({
          driver_id: userId,
          lat: latitude,
          lng: longitude,
        });

        if (error) {
          console.error("خطا در آپدیت لوکیشن راننده:", error.message);
        } else {
          setDriverLocation([latitude, longitude]);
        }
      },
      (error) => {
        console.error("خطا در دریافت موقعیت مکانی راننده:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isDriver, userId]);

  // کنترل وضعیت‌ها
  const handleArrived = async () => {
    const { error } = await supabase
      .from("rides")
      .update({ status: "arrived" })
      .eq("id", rideId);

    if (error) {
      toast.error("خطا در به‌روزرسانی وضعیت سفر");
    } else {
      toast.success("وضعیت سفر به 'رسیده‌ام' به‌روزرسانی شد");
    }
  };

  const handleStart = async () => {
    const { error } = await supabase
      .from("rides")
      .update({ status: "started" })
      .eq("id", rideId);

    if (error) {
      toast.error("خطا در شروع سفر");
    } else {
      toast.success("سفر شروع شد");
    }
  };

  const handleComplete = async () => {
    const success = await endRide(rideId);
    if (success) {
      toast.success("سفر با موفقیت به پایان رسید");
      router.push(isDriver ? "/driver/profile" : "/passenger/profile");
    } else {
      toast.error("خطا در تکمیل سفر");
    }
  };

  const handleCancel = async () => {
    try {
      // Get ride details
      const { data: ride, error: rideError } = await supabase
        .from("rides")
        .select("passenger_id, driver_id")
        .eq("id", rideId)
        .single();

      if (rideError) throw rideError;

      // Update ride status
      const { error: updateRideError } = await supabase
        .from("rides")
        .update({ status: "canceled" })
        .eq("id", rideId);

      if (updateRideError) throw updateRideError;

      // Reset driver's ride status
      const { error: driverUpdateError } = await supabase
        .from("users")
        .update({ in_ride: false, ride_id: null })
        .eq("id", ride.driver_id);

      if (driverUpdateError) throw driverUpdateError;

      // Reset passenger's ride status
      const { error: passengerUpdateError } = await supabase
        .from("users")
        .update({ in_ride: false, ride_id: null })
        .eq("id", ride.passenger_id);

      if (passengerUpdateError) throw passengerUpdateError;

      // Update ride request status
      const { error: requestUpdateError } = await supabase
        .from("ride_requests")
        .update({ status: "canceled" })
        .eq("ride_id", rideId);

      if (requestUpdateError) throw requestUpdateError;

      toast.success("سفر با موفقیت لغو شد");
      router.push(isDriver ? "/driver/profile" : "/passenger/profile");
    } catch (err) {
      console.error("❌ Error canceling ride:", err);
      toast.error("خطا در لغو سفر");
    }
  };

  if (loading || !ride) return <p>در حال بارگذاری...</p>;

  return (
    <div className="relative min-w-screen min-h-screen">
      <MapContainer
        center={[ride.from_lat, ride.from_lng]}
        zoom={13}
        className="w-full h-screen"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {ride.from_lat && ride.from_lng && (
          <Marker position={[ride.from_lat, ride.from_lng]} icon={fromIcon} />
        )}
        {ride.to_lat && ride.to_lng && (
          <Marker position={[ride.to_lat, ride.to_lng]} icon={toIcon} />
        )}
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}
        {passengerLocation && (
          <Marker position={passengerLocation} icon={passengerIcon} />
        )}
        {ride.from_lat && ride.to_lat && ride.from_lng && ride.to_lng && (
          <Polyline
            positions={[
              [ride.from_lat, ride.from_lng],
              [ride.to_lat, ride.to_lng],
            ]}
            color="blue"
          />
        )}
      </MapContainer>

      {/* کنترل‌ها */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t rounded-t-2xl shadow-lg z-[1000]">
        {isDriver && ride.status === "accepted" && (
          <Button
            className="w-full bg-green-600 text-white py-3 text-lg rounded-xl hover:bg-green-700"
            onClick={handleArrived}
          >
            رسیدم
          </Button>
        )}
        {isDriver && ride.status === "arrived" && (
          <Button
            className="w-full bg-yellow-600 text-white py-3 text-lg rounded-xl hover:bg-yellow-700"
            onClick={handleStart}
          >
            شروع سفر
          </Button>
        )}
        {isDriver && ride.status === "started" && (
          <Button
            className="w-full bg-blue-600 text-white py-3 text-lg rounded-xl hover:bg-blue-700"
            onClick={handleComplete}
            loading={endRideLoading}
          >
            اتمام سفر
          </Button>
        )}

        {isPassenger && ride.status === "accepted" && (
          <div className="space-y-3">
            <p className="text-center text-gray-700 text-lg font-medium">
              🚗 راننده در راه است...
            </p>
            <Button
              className="w-full bg-red-600 text-white py-3 text-lg rounded-xl hover:bg-red-700"
              onClick={handleCancel}
            >
              لغو سفر
            </Button>
          </div>
        )}

        {isPassenger && ride.status === "arrived" && (
          <div className="space-y-3">
            <p className="text-center text-gray-700 text-lg font-medium">
              🚗 راننده رسیده است
            </p>
            <Button
              className="w-full bg-red-600 text-white py-3 text-lg rounded-xl hover:bg-red-700"
              onClick={handleCancel}
            >
              لغو سفر
            </Button>
          </div>
        )}

        {isPassenger && ride.status === "started" && (
          <div className="space-y-3">
            <p className="text-center text-gray-700 text-lg font-medium">
              🚗 در حال سفر...
            </p>
          </div>
        )}

        {isPassenger && ride.status === "completed" && (
          <div className="space-y-3">
            <p className="text-center text-gray-700 text-lg font-medium">
              ✅ سفر به پایان رسید
            </p>
            <Button
              className="w-full bg-primary text-white py-3 text-lg rounded-xl hover:bg-teal-700"
              onClick={() => router.push("/passenger/profile")}
            >
              بازگشت به پروفایل
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripMap;
