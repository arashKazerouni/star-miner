export type OrderBook = {
  bids?: Array<{ price?: string }>;
  asks?: Array<{ price?: string }>;
};

export const FARM_ASSET: {
  code: "FARM";
  issuer: string;
};

export const HORIZON_URL: string;
export function calculateMidPrice(orderBook: OrderBook | null | undefined): number | null;
export function buildOrderBookUrl(): string;
export function fetchFarmXlmPrice(fetchImpl?: typeof fetch): Promise<number>;
