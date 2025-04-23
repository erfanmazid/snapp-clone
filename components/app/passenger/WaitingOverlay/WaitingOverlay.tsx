"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

export default function WaitingOverlay({ requestId }: { requestId: string }) {
  const [accepted, setAccepted] = useState(false);

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
        (payload) => {
          const { id, status } = payload.new;
          console.log("🟢 Real-time update received:", { id, status });

          if (id === requestId && status === "matched") {
            setAccepted(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

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
