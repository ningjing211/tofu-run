import { NextResponse } from "next/server";
import {
  claimNextPoolUser,
  getOrCreateTodaySession,
  joinSession,
} from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { userId, lat, lng } = body as {
      userId?: string;
      lat?: number | null;
      lng?: number | null;
    };

    const session = await getOrCreateTodaySession();

    if (userId) {
      const userSession = await joinSession(userId, session.id);
      return NextResponse.json({
        userId,
        sessionId: session.id,
        userSessionId: userSession.id,
        rejoined: true,
      });
    }

    const user = await claimNextPoolUser(lat ?? null, lng ?? null);

    if (!user) {
      return NextResponse.json(
        { error: "今日 300 名額已滿，請聯絡主辦人" },
        { status: 409 }
      );
    }

    const userSession = await joinSession(user.id, session.id);

    return NextResponse.json({
      userId: user.id,
      runnerId: user.runner_id,
      runnerName: user.runner_name,
      slotNo: user.slot_no,
      sessionId: session.id,
      userSessionId: userSession.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "加入失敗" },
      { status: 500 }
    );
  }
}
