export const FARM_ASSET = {
  code: "FARM",
  issuer: "GBF7ZMNV4L2PFQRHJEMQLH7FEYMIP4ZSUKQ42ZOCYL5MI5P234C2NMNB",
};

export const HORIZON_URL = "https://horizon.stellar.org";

export function calculateMidPrice(orderBook) {
  if (!orderBook) return null;

  const bid = Number(orderBook.bids?.[0]?.price);
  const ask = Number(orderBook.asks?.[0]?.price);
  const hasBid = Number.isFinite(bid) && bid > 0;
  const hasAsk = Number.isFinite(ask) && ask > 0;

  if (hasBid && hasAsk) return (bid + ask) / 2;
  if (hasBid) return bid;
  if (hasAsk) return ask;
  return null;
}

export function buildOrderBookUrl() {
  const params = new URLSearchParams({
    base_asset_type: "credit_alphanum4",
    base_asset_code: FARM_ASSET.code,
    base_asset_issuer: FARM_ASSET.issuer,
    counter_asset_type: "native",
    limit: "10",
  });

  return `${HORIZON_URL}/order_book?${params.toString()}`;
}

export async function fetchFarmXlmPrice(fetchImpl = fetch) {
  const response = await fetchImpl(buildOrderBookUrl(), {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Horizon order book request failed: ${response.status}`);
  }

  const orderBook = await response.json();
  const price = calculateMidPrice(orderBook);

  if (price === null) {
    throw new Error("FARM/XLM market has no usable bid or ask price");
  }

  return price;
}
