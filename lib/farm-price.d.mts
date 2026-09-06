export const FARM_ASSET: {
  code: "FARM";
  issuer: string;
};

export const XLM_ASSET: "XLM";
export const STELLAR_EXPERT_URL: string;

export function calculateFarmXlmPrice(
  farmPrice: unknown,
  xlmPrice: unknown,
): number | null;

export function buildAssetUrl(asset: string): string;

export function fetchFarmXlmPrice(fetchImpl?: typeof fetch): Promise<{
  farmUsd: number;
  xlmUsd: number;
  farmXlm: number;
}>;
