import { NextResponse } from "next/server";
import { fetchFarmXlmPrice } from "@/lib/farm-price.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { farmUsd, xlmUsd, farmXlm } = await fetchFarmXlmPrice();

    return NextResponse.json(
      {
        asset: "FARM",
        counter: "XLM",
        price: farmXlm,
        farmUsd,
        xlmUsd,
        inversePrice: 1 / farmXlm,
        source: "Stellar Expert",
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    console.error("FARM/XLM price unavailable", error);

    return NextResponse.json(
      {
        asset: "FARM",
        counter: "XLM",
        price: null,
        farmUsd: null,
        xlmUsd: null,
        inversePrice: null,
        source: "Stellar Expert",
        updatedAt: new Date().toISOString(),
        error: "Live FARM/XLM price is temporarily unavailable.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
