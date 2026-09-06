import { NextResponse } from "next/server";
import { fetchFarmXlmPrice } from "@/lib/farm-price.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const price = await fetchFarmXlmPrice();

    return NextResponse.json(
      {
        asset: "FARM",
        counter: "XLM",
        price,
        source: "Stellar Horizon order book",
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
        source: "Stellar Horizon order book",
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
