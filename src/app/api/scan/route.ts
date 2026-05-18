import { NextResponse } from "next/server";
import {
  getOrCreateTodaySession,
  getUserSessionForToday,
  recordToken,
} from "@/lib/db";
import { TOKEN_TYPES } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase";

const VALID_TOKENS = TOKEN_TYPES.map((t) => t.id);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { userId, tokenType, lat, lng } = body as {
      userId?: string;
      tokenType?: string;
      lat?: number | null;
      lng?: number | null;
    };

    if (!userId || !tokenType) {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 });
    }

    if (!VALID_TOKENS.includes(tokenType as (typeof VALID_TOKENS)[number])) {
      return NextResponse.json({ error: "無效的 Token" }, { status: 400 });
    }

    const session = await getOrCreateTodaySession();
    const userSession = await getUserSessionForToday(userId, session.id);

    if (!userSession) {
      return NextResponse.json(
        { error: "請先加入今日活動" },
        { status: 403 }
      );
    }

    if (!userSession.tofu_type) {
      return NextResponse.json(
        { error: "請等待管理者分配豆花" },
        { status: 403 }
      );
    }

    const token = await recordToken(
      userId,
      tokenType,
      lat ?? null,
      lng ?? null
    );

    return NextResponse.json({
      ok: true,
      token,
      scannedAt: token.scanned_at,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "掃描失敗" }, { status: 500 });
  }
}
