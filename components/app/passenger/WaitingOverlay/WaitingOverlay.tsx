import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
          filter: `id=eq.${requestId}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          if (newStatus === "accepted") {
            setAccepted(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  if (accepted) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1200] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg animate-pulse">در انتظار پذیرش راننده...</p>
    </div>
  );
}
