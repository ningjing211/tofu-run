import { NextResponse } from "next/server";
import { getLobbyPlayers, getOrCreateTodaySession } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定" },
      { status: 503 }
    );
  }

  try {
    const session = await getOrCreateTodaySession();
    const players = await getLobbyPlayers(session.id);

    return NextResponse.json({
      sessionDate: session.date,
      sessionId: session.id,
      players,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "讀取 Lobby 失敗" },
      { status: 500 }
    );
  }
}
