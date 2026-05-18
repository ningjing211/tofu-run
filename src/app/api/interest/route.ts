import { NextResponse } from "next/server";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const VALID_INTENTS = ["join", "interested"] as const;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定，無法儲存報名" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, nickname, intent, lineId } = body as {
      email?: string;
      nickname?: string;
      intent?: string;
      lineId?: string;
    };

    const trimmedEmail = email?.trim().toLowerCase() ?? "";
    const trimmedNickname = nickname?.trim() ?? "";
    const trimmedLineId = lineId?.trim() || null;

    if (!trimmedEmail || !trimmedNickname) {
      return NextResponse.json(
        { error: "請填寫暱稱與 Email" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    if (!intent || !VALID_INTENTS.includes(intent as (typeof VALID_INTENTS)[number])) {
      return NextResponse.json({ error: "請選擇參加意願" }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("interest_signups").insert({
      email: trimmedEmail,
      nickname: trimmedNickname,
      line_id: trimmedLineId,
      intent,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "送出失敗" }, { status: 500 });
  }
}
