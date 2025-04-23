import { useEffect, useState } from "react";

const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name || "آدرس پیدا نشد";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "خطا در دریافت آدرس";
  }
};

export const useReverseGeocode = (lat: number, lng: number) => {
  const [address, setAddress] = useState<string>("در حال بارگذاری...");

  useEffect(() => {
    if (lat && lng) {
      const getAddress = async () => {
        const fetchedAddress = await fetchAddress(lat, lng);
        setAddress(fetchedAddress);
      };

      getAddress();
    }
  }, [lat, lng]);

  return address;
};
