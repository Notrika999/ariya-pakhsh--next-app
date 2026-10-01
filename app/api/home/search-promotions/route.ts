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
<<<<<<< HEAD
    // console.error("[home/search-promotions] failed =>", error);
=======
    console.error("[home/search-promotions] failed =>", error);
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    return NextResponse.json([], { status: 200 });
  }
}
