export const FARM_ASSET = {
  code: "FARM",
  issuer: "GBJELP7DVYFQLY77ZM34SDMQOHDRBN7E7L44WHDAMPPMLCSKG6P3ESRT",
};

export const XLM_ASSET = "XLM";
export const STELLAR_EXPERT_URL = "https://api.stellar.expert";

export function buildAssetUrl(asset) {
  return `${STELLAR_EXPERT_URL}/explorer/public/asset/${encodeURIComponent(asset)}`;
}
