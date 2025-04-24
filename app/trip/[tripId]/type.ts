export interface Ride {
  id: string;
  passenger_id: string;
  driver_id: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  distance_km?: null;
  price: number;
  status: string;
  started_at?: null;
  completed_at?: null;
  created_at: string;
  user_id?: null;
  pickup_location?: null;
  dropoff_location?: null;
  requested_at: string;
  accepted_at: string;
  passenger_name: string;
}
