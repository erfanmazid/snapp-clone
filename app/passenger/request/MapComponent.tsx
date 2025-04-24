"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import LiveLocationTracker from "@/components/app/passenger/LiveLocationTracker/LiveLocationTracker";

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

interface MapComponentProps {
  from: LatLngExpression | null;
  to: LatLngExpression | null;
  onMapClick: (lat: number, lng: number) => void;
}

const MapComponent = ({ from, to, onMapClick }: MapComponentProps) => {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onClick={onMapClick} />
      <LiveLocationTracker />
      {from && <Marker position={from} icon={fromIcon} />}
      {to && <Marker position={to} icon={toIcon} />}
    </MapContainer>
  );
};

export default MapComponent;
