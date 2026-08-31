import { NextResponse } from "next/server";
import { getHomeSearchPromotions } from "@/src/services/home/home-layout.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const promotions = await getHomeSearchPromotions();
    return NextResponse.json(promotions);
  } catch (error) {
    console.error("[home/search-promotions] failed =>", error);
    return NextResponse.json([], { status: 200 });
  }
}
