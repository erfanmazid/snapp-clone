"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import LiveLocationTracker from "@/components/app/passenger/LiveLocationTracker/LiveLocationTracker";
import Button from "@/components/ui/Button";
import Link from "next/link";
import useCreateRideRequest from "@/hooks/useCreateRideRequest/useCreateRideRequest";
import toast from "react-hot-toast";
import WaitingOverlay from "@/components/app/passenger/WaitingOverlay/WaitingOverlay";
// import { useUserId } from "@/hooks/useUserId/useUserId";

const defaultPosition: LatLngExpression = [35.6892, 51.389]; // Tehran

const fromIcon = new L.Icon({
  iconUrl: "/from.png",
  iconSize: [48, 48],
  iconAnchor: [15, 40],
});

const toIcon = new L.Icon({
  iconUrl: "/to.png",
  iconSize: [48, 48],
  iconAnchor: [15, 40],
});

const MapClickHandler = ({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const PassengerRequest = () => {
  const [from, setFrom] = useState<LatLngExpression | null>(null);
  const [to, setTo] = useState<LatLngExpression | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const { createRideRequest, loading: createRideRequestLoading } =
    useCreateRideRequest();

  // const userId = useUserId();
  const userId = "8922523a-c6b2-4372-8487-492317e303f2";

  const handleMapClick = (lat: number, lng: number) => {
    if (!from) {
      setFrom([lat, lng]);
    } else if (!to) {
      setTo([lat, lng]);
    }
  };

  const calculateRoute = async () => {
    if (from && to) {
      setLoading(true);
      const url = `https://router.project-osrm.org/route/v1/driving/${
        (from as number[])[1]
      },${(from as number[])[0]};${(to as number[])[1]},${
        (to as number[])[0]
      }?overview=false`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const durationInSeconds = data.routes[0].duration;
          setDuration(durationInSeconds / 60); // minutes
          setPrice(Math.ceil((durationInSeconds / 60) * 3000));
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRequest = async () => {
    if (from && to && duration && price) {
      const data = {
        user_id: userId ?? "",
        from_lat: (from as [number, number])[0],
        from_lng: (from as [number, number])[1],
        to_lat: (to as [number, number])[0],
        to_lng: (to as [number, number])[1],
        suggested_price: price,
      };
      try {
        const res = await createRideRequest(data);

        if (res?.id) {
          toast.success("درخواست شما با موفقیت ارسال شد");
          setRequestId(res.id);
        } else {
          toast.error("خطا در ارسال درخواست");
        }
      } catch (err) {
        console.error("Error creating ride request:", err);
        toast.error("خطا در ارسال درخواست");
      }
    } else {
      toast.error("لطفا مبدا و مقصد را انتخاب کنید");
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Link href="/passenger/profile">
        <div className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center bg-white shadow-md rounded-full p-3 z-[1100] hover:bg-gray-100 transition-all">
          <i className="fa-solid fa-user text-primary text-xl"></i>
        </div>
      </Link>

      {/* دکمه ریست */}
      <Button
        onClick={() => {
          setFrom(null);
          setTo(null);
          setDuration(null);
          setPrice(null);
        }}
        className="absolute top-5 left-5 bg-white !text-primary py-2 px-4 rounded-full shadow-md hover:bg-gray-100 z-[1100] transition-all max-w-40"
      >
        ↺ انتخاب مجدد
      </Button>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClick={handleMapClick} />
        <LiveLocationTracker />
        {from && <Marker position={from} icon={fromIcon} />}
        {to && <Marker position={to} icon={toIcon} />}
      </MapContainer>

      {/* دکمه محاسبه قیمت */}
      {from && to && !duration && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12  z-[1000]">
          <Button
            onClick={calculateRoute}
            loading={loading}
            className="w-full bg-primary text-white py-3 text-lg rounded-xl shadow-lg hover:bg-teal-700"
          >
            محاسبه زمان و قیمت
          </Button>
        </div>
      )}

      {/* مودال قیمت و زمان */}
      {duration && price && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-5 border-t rounded-t-2xl shadow-lg z-[1000] animate-slideUp">
          <p className="text-lg mb-2">
            ⏱ مدت سفر:{" "}
            <span className="font-bold">
              {duration.toLocaleString("fa").slice(0, 2)} دقیقه
            </span>
          </p>
          <p className="text-lg mb-4">
            💰 قیمت پیشنهادی:{" "}
            <span className="font-bold text-green-600">
              {price.toLocaleString("fa")} تومان
            </span>
          </p>
          <Button
            className="w-full bg-primary text-white py-3 text-lg rounded-xl hover:bg-teal-700"
            onClick={handleRequest}
            loading={createRideRequestLoading}
          >
            ارسال درخواست
          </Button>
        </div>
      )}
      {requestId && <WaitingOverlay requestId={requestId} />}
    </div>
  );
};

export default PassengerRequest;
