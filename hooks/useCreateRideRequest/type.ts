export type RideRequestData = {
  user_id: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  suggested_price: number;
  status?: string; // optional
};
