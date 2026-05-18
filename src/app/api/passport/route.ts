import { NextResponse } from "next/server";
import { getPassportAccount } from "@/lib/db";
import { normalizeRunnerId, RUNNER_ID_PATTERN } from "@/lib/runner";
import {
  isSupabaseConfigured,
  isSupabaseServiceConfigured,
} from "@/lib/supabase";

export async function GET(request: Request) {
  if (!isSupabaseConfigured() || !isSupabaseServiceConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定完整" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const runnerId = normalizeRunnerId(searchParams.get("runnerId") ?? "");

  if (!runnerId) {
    return NextResponse.json({ error: "請提供 Runner ID" }, { status: 400 });
  }

  if (!RUNNER_ID_PATTERN.test(runnerId)) {
    return NextResponse.json(
      { error: "Runner ID 格式不正確（例：DOG-214）" },
      { status: 400 }
    );
  }

  try {
    const account = await getPassportAccount(runnerId);

    if (!account) {
      return NextResponse.json(
        {
          error:
            "找不到此 Runner ID 的「想參加」報名。請確認已送出成功，或 Table 是否為 going_signups。",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "讀取護照失敗" },
      { status: 500 }
    );
  }
}
