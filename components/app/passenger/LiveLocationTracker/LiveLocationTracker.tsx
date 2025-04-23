import { useEffect, useState } from "react";
import { useMap, Marker } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";

const userIcon = new L.Icon({
  iconUrl: "/user-location.png", // آیکن دلخواهت رو بذار اینجا
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LiveLocationTracker = () => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    map.locate({ setView: true, watch: true });

    function onLocationFound(e: L.LocationEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }

    function onLocationError(e: L.ErrorEvent) {
      console.error("Location error:", e.message);
      toast.error("موقعیت شما یافت نشد.");
    }

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    return () => {
      map.stopLocate();
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
    };
  }, [map]);

  return position ? <Marker position={position} icon={userIcon} /> : null;
};

export default LiveLocationTracker;
