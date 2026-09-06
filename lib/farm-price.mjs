export const FARM_ASSET = {
  code: "FARM",
  issuer: "GBJELP7DVYFQLY77ZM34SDMQOHDRBN7E7L44WHDAMPPMLCSKG6P3ESRT",
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

export function buildAssetUrl(asset) {
  return `${STELLAR_EXPERT_URL}/explorer/public/asset/${encodeURIComponent(asset)}`;
}

export async function fetchFarmXlmPrice(fetchImpl = fetch) {
  const [farmResponse, xlmResponse] = await Promise.all([
    fetchImpl(buildAssetUrl(`${FARM_ASSET.code}-${FARM_ASSET.issuer}`), {
      cache: "no-store",
      headers: { accept: "application/json" },
    }),
    fetchImpl(buildAssetUrl(XLM_ASSET), {
      cache: "no-store",
      headers: { accept: "application/json" },
    }),
  ]);

  if (!farmResponse.ok) {
    throw new Error(`Stellar Expert FARM request failed: ${farmResponse.status}`);
  }

  if (!xlmResponse.ok) {
    throw new Error(`Stellar Expert XLM request failed: ${xlmResponse.status}`);
  }

  const [farm, xlm] = await Promise.all([
    farmResponse.json(),
    xlmResponse.json(),
  ]);

  const farmUsd = Number(farm?.price);
  const xlmUsd = Number(xlm?.price);
  const farmXlm = calculateFarmXlmPrice(farmUsd, xlmUsd);

  if (farmXlm === null) {
    throw new Error("Stellar Expert did not return usable FARM and XLM prices");
  }

  return {
    farmUsd,
    xlmUsd,
    farmXlm,
  };
}
