"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserId } from "@/hooks/useUserId/useUserId";
const supabase = createClientComponentClient();

export default function WaitingOverlay({ requestId }: { requestId: string }) {
  const [accepted, setAccepted] = useState(false);
  const userId = useUserId();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("ride-request-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_requests",
        },
        async (payload) => {
          const { id, status } = payload.new;

          if (id === requestId && status === "matched") {
            setAccepted(true);
            try {
              // جستجو برای پیدا کردن سفر مرتبط با این requestId از جدول rides
              const { data, error } = await supabase
                .from("ride_requests")
                .select("ride_id")
                .eq("id", requestId)
                .single();
              if (data?.ride_id) {
                router.push(`/trip/${data.ride_id}`);
              }

              if (error) {
                toast.error("خطا در پیدا کردن سفر");
              }
            } catch (error) {
              console.error("Error fetching ride:", error);
              toast.error("خطا در پیدا کردن سفر");
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, router, userId]);

  if (accepted) {
    toast.success("راننده پذیرفته شد");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1200] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg animate-pulse">در انتظار پذیرش راننده...</p>
    </div>
  );
}
