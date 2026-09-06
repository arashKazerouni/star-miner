export const FARM_ASSET = {
  code: "FARM",
  issuer: "GBF7ZMNV4L2PFQRHJEMQLH7FEYMIP4ZSUKQ42ZOCYL5MI5P234C2NMNB",
};

export const XLM_ASSET = "XLM";
export const STELLAR_EXPERT_URL = "https://api.stellar.expert";

export function calculateFarmXlmPrice(farmPrice, xlmPrice) {
  const farm = Number(farmPrice);
  const xlm = Number(xlmPrice);

  if (!Number.isFinite(farm) || farm <= 0) return null;
  if (!Number.isFinite(xlm) || xlm <= 0) return null;

  return farm / xlm;
}

export function buildPriceUrl() {
  const params = new URLSearchParams({
    asset: `${FARM_ASSET.code}-${FARM_ASSET.issuer}`,
  });
  params.append("asset", XLM_ASSET);

  return `${STELLAR_EXPERT_URL}/explorer/public/asset/price?${params.toString()}`;
}

export async function fetchFarmXlmPrice(fetchImpl = fetch) {
  const response = await fetchImpl(buildPriceUrl(), {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Stellar Expert price request failed: ${response.status}`);
  }

  const payload = await response.json();
  const records = payload?._embedded?.records ?? [];
  const prices = new Map(
    records
      .filter((record) => typeof record?.asset === "string")
      .map((record) => [record.asset, record.price]),
  );

  const farmPrice = prices.get(`${FARM_ASSET.code}-${FARM_ASSET.issuer}`);
  const xlmPrice = prices.get(XLM_ASSET);
  const price = calculateFarmXlmPrice(farmPrice, xlmPrice);

  if (price === null) {
    throw new Error("Stellar Expert did not return usable FARM and XLM prices");
  }

  return price;
}
