export interface ReviewItem {
  author: string;
  author_url?: string;
  rating: number;
  publish_date: string;
  content: string;
  review_photos?: string[];
  owner_response?: string | null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceItem {
  title: string;
  place_id?: string;
  category?: string | null;
  description?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  price_range?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  menu?: string | null;
  booking_link?: string | null;
  plus_code?: string | null;
  opening_hours?: Record<string, string>;
  coordinates?: Coordinates | null;
  about?: Record<string, string[]>;
  url?: string | null;
  photos?: string[];
  reviews?: ReviewItem[];
}
