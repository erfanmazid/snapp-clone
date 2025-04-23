import { useState } from "react";

export const useRouteDuration = (from: number[], to: number[]) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateRoute = async () => {
    if (from && to) {
      setLoading(true);
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const durationInSeconds = data.routes[0].duration;
          setDuration(durationInSeconds / 60); // minutes
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    duration,
    loading,
    calculateRoute,
  };
};
