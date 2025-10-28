// --- Interfaces (colócalas donde corresponda) ---
export interface ApiPrice {
  currency: string;
  binding: boolean;
  net: number;
  gross: number;
}

export interface ApiRoom {
  occupancyRefId: number;
  code: string;
  description: string;
  refundable: boolean;
  roomPrice: {
    price: ApiPrice;
    breakdown?: any;
  };
}

export interface ApiCancelPenalty {
  deadline: string;
  penaltyType: string;
  currency: string;
  value: number;
}

export interface ApiCancelPolicy {
  refundable: boolean;
  cancelPenalties?: ApiCancelPenalty[] | null;
}

export interface ApiOccupancy {
  id: number;
  paxes: { age: number }[];
}

export interface ApiOption {
  id: string;
  hotelCode: string;
  hotelName: string;
  boardCode?: string;
  paymentType?: string;
  status?: string;
  price: ApiPrice;
  surcharges?: any;
  rateRules?: string[] | null;
  cancelPolicy?: ApiCancelPolicy | null;
  occupancies?: ApiOccupancy[];
  rooms?: ApiRoom[];
  // ... otros campos si los necesitas
}

export interface ApiPagination {
  total: number;
  per_page: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_url: string | null;
  prev_url: string | null;
}

export interface ApiMeta {
  requested_hotels?: number;
  returned_hotels?: number;
  country?: string;
  city?: string;
  pagination: ApiPagination;
  // ... otros fields
}

export interface Media {
   url: string,
   type: string;
}

export interface Hotel {
  hotelCode: string,
  medias: Media[];
}

export interface ApiResponse {
  context?: string;
  options: ApiOption[];
  meta: ApiMeta;
  hotels?: Hotel[];
  profiles?: any[];
  errors?: any[];
  warnings?: any[];
}
