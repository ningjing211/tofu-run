import { NextResponse } from "next/server";
import { getPoolUserByRunnerId } from "@/lib/db";
import { normalizeRunnerId, RUNNER_ID_PATTERN } from "@/lib/runner";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const trimmedRunnerId = normalizeRunnerId(
      searchParams.get("runnerId") ?? ""
    );

    if (!trimmedRunnerId) {
      return NextResponse.json(
        { error: "請提供 Runner ID" },
        { status: 400 }
      );
    }

    if (!RUNNER_ID_PATTERN.test(trimmedRunnerId)) {
      return NextResponse.json(
        { error: "Runner ID 格式不正確（例：DOG-214）" },
        { status: 400 }
      );
    }

    const poolUser = await getPoolUserByRunnerId(trimmedRunnerId);

    if (!poolUser) {
      return NextResponse.json(
        { error: "找不到此 Runner ID，請確認名額編號" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      runnerId: poolUser.runner_id,
      runnerName: poolUser.runner_name,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
  }
}
