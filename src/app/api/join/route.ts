import { NextResponse } from "next/server";
import {
  createUser,
  getOrCreateTodaySession,
  joinSession,
} from "@/lib/db";
import { generateRunnerId, generateRunnerName } from "@/lib/player";
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

    let runnerId = generateRunnerId();
    let runnerName = generateRunnerName();
    let user = null;
    let attempts = 0;

    while (attempts < 5) {
      try {
        user = await createUser(
          runnerId,
          runnerName,
          lat ?? null,
          lng ?? null
        );
        break;
      } catch {
        runnerId = generateRunnerId();
        runnerName = generateRunnerName();
        attempts++;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "無法建立玩家" },
        { status: 500 }
      );
    }

    const userSession = await joinSession(user.id, session.id);

    return NextResponse.json({
      userId: user.id,
      runnerId: user.runner_id,
      runnerName: user.runner_name,
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
