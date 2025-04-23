"use client";

import { useParams } from "next/navigation";
import { useRideRequest } from "@/hooks/useRideRequest/useRideRequest";
import { useReverseGeocode } from "@/hooks/useReverseGeocode/useReverseGeocode";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAcceptRideRequest } from "@/hooks/useAcceptRideRequest/useAcceptRideRequest";
import toast from "react-hot-toast";

export default function DriverRequestPage() {
  const [fromAddress, setFromAddress] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const { id } = useParams() as { id: string };
  const { request, loading } = useRideRequest(id);
  const {
    acceptRide,
    loading: reqLoading,
    error,
    success,
  } = useAcceptRideRequest();

  const fromAddressResult = useReverseGeocode(
    request?.from_lat || 0,
    request?.from_lng || 0
  );
  const toAddressResult = useReverseGeocode(
    request?.to_lat || 0,
    request?.to_lng || 0
  );
  useEffect(() => {
    if (fromAddressResult) {
      setFromAddress(fromAddressResult);
    }
    if (toAddressResult) {
      setToAddress(toAddressResult);
    }
  }, [fromAddressResult, toAddressResult]);

  const handleAccept = async () => {
    if (request) {
      await acceptRide(request.id);
    }
  };
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success("درخواست با موفقیت قبول شد.");
    }
  }, [success]);

  if (loading) return <p className="p-4">در حال بارگذاری...</p>;
  if (!request) return <p className="p-4 text-red-500">درخواستی یافت نشد.</p>;

  return (
    <div className="min-h-screen pb-40 p-4 bg-lightBlue">
      <h1 className="text-xl font-bold mb-4 text-primary">
        جزئیات درخواست سفر
      </h1>

      <div className="bg-white rounded-xl p-4 shadow mb-6 space-y-2">
        <p>
          👤 نام مسافر: <strong>{request.passenger_name}</strong>
        </p>
        <p>📍 مبدا: {fromAddress}</p>
        <p>📍 مقصد: {toAddress}</p>
        <p>⏱ مدت زمان: {request.duration} دقیقه</p>
        <p>💰 قیمت: {request.suggested_price?.toLocaleString("fa")} تومان</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-5 border-t rounded-t-2xl shadow-lg z-[1000] animate-slideUp">
        <p className="text-lg mb-2">
          ⏱ مدت سفر: <span className="font-bold">{request.duration} دقیقه</span>
        </p>
        <p className="text-lg mb-4">
          💰 قیمت :{" "}
          <span className="font-bold text-green-600">
            {request.suggested_price?.toLocaleString("fa")} تومان
          </span>
        </p>
        <div className="flex gap-3">
          <Button
            className="!bg-primary"
            loading={reqLoading}
            onClick={handleAccept}
          >
            قبول سفر
          </Button>
        </div>
      </div>
    </div>
  );
}
