import { NextResponse } from "next/server";
import { getGoingJoinList } from "@/lib/db";
import {
  isSupabaseConfigured,
  isSupabaseServiceConfigured,
} from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured() || !isSupabaseServiceConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定完整" },
      { status: 503 }
    );
  }

  try {
    const signups = await getGoingJoinList();

    return NextResponse.json(
      {
        count: signups.length,
        signups,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "讀取名單失敗" },
      { status: 500 }
    );
  }
}
