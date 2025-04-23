export interface RideRequest {
  id: string;
  user_id: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  suggested_price: number;
  status: "waiting" | "accepted" | "rejected";
  created_at: string;
  passenger_name: string;
  duration: number;
}
