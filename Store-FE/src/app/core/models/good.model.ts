export interface PriceHistoryRecord {
  price: number;
  date: string;
}

export interface Good {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  imageUrl: string;
  notes?: string;
  count: number;
  externalId?: string;
  priceHistory: PriceHistoryRecord[];
}
