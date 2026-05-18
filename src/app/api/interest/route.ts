import { NextResponse } from "next/server";
import {
  MAX_TOPPING_PICKS,
  PURE_DOUHUA_GOAL,
  TOFU_TYPES,
  formatDouhuaGoal,
} from "@/lib/constants";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const VALID_INTENTS = ["join", "interested"] as const;
const VALID_TOPPING_IDS = TOFU_TYPES.map((t) => t.id);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase 尚未設定，無法儲存報名" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, nickname, intent, lineId, preferredToppings, douhuaGoal, pureOnly } =
      body as {
        email?: string;
        nickname?: string;
        intent?: string;
        lineId?: string;
        preferredToppings?: string[];
        douhuaGoal?: string;
        pureOnly?: boolean;
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

    let toppings: string[] = [];
    let isPureOnly = false;
    if (intent === "join") {
      const raw = Array.isArray(preferredToppings) ? preferredToppings : [];
      isPureOnly = Boolean(pureOnly) || raw.includes("none");
      toppings = raw.filter((id) => id !== "none");

      if (isPureOnly && toppings.length > 0) {
        return NextResponse.json({ error: "「都不選」不可與配料同時選擇" }, { status: 400 });
      }

      if (toppings.length > MAX_TOPPING_PICKS) {
        return NextResponse.json(
          { error: `最多選擇 ${MAX_TOPPING_PICKS} 種配料` },
          { status: 400 }
        );
      }
      const invalid = toppings.some(
        (id) => !VALID_TOPPING_IDS.includes(id as (typeof VALID_TOPPING_IDS)[number])
      );
      if (invalid) {
        return NextResponse.json({ error: "配料選項無效" }, { status: 400 });
      }
      const unique = new Set(toppings);
      if (unique.size !== toppings.length) {
        return NextResponse.json({ error: "請勿重複選擇配料" }, { status: 400 });
      }
    }

    const goal =
      intent === "join"
        ? isPureOnly
          ? PURE_DOUHUA_GOAL
          : douhuaGoal?.trim() || formatDouhuaGoal(toppings)
        : null;

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("interest_signups").insert({
      email: trimmedEmail,
      nickname: trimmedNickname,
      line_id: trimmedLineId,
      intent,
      preferred_toppings:
        intent === "join" ? (isPureOnly ? ["none"] : toppings) : [],
      douhua_goal: goal,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, douhuaGoal: goal });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "送出失敗" }, { status: 500 });
  }
}
