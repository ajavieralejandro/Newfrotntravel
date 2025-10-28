export interface PaqueteOption {
  id: number;
  hotelName: string;
  price: number;
  currency: string;
  rating: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface PaqueteDataNew {
  meta: Meta;
  options: PaqueteOption[];
}
