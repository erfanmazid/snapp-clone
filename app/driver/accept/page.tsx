"use client";

import { useRideRequests } from "@/hooks/useRideRequests/useRideRequests";
import Link from "next/link";

export default function DriverRequestList() {
  const { requests, loading } = useRideRequests();

  if (loading) return <p className="p-4">در حال بارگذاری...</p>;
  if (requests.length === 0)
    return (
      <p className="p-4 text-gray-500">هیچ درخواستی برای قبول وجود ندارد.</p>
    );

  return (
    <div className="p-4 flex flex-col gap-3 bg-lightBlue min-h-screen">
      <Link href="/driver/profile">
        <div className="absolute top-5 left-5 w-12 h-12 flex items-center justify-center bg-white shadow-md rounded-full p-3 z-[1100] hover:bg-gray-100 transition-all">
          <i className="fa-solid fa-user text-primary text-xl"></i>
        </div>
      </Link>

      <h1 className="text-2xl font-bold mb-4 text-primary"> درخواست‌های سفر</h1>
      {requests.map((req) => (
        <Link href={`/driver/accept/${req.id}`} key={req.id}>
          <div className="p-4 bg-white shadow rounded-xl hover:bg-gray-50 cursor-pointer transition">
            <p>
              👤 مسافر: <strong>{req?.passenger_name}</strong>
            </p>
            <p>
              📍 {req.origin} → {req?.destination}
            </p>
            <p>
              ⏱ {req.duration} دقیقه | 💰{" "}
              {req?.suggested_price?.toLocaleString("fa")} تومان
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
