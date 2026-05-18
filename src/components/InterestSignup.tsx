"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToppingPicker } from "@/components/ToppingPicker";
import {
  formatDouhuaGoal,
  type TofuTypeId,
} from "@/lib/constants";
import { resolveDisplayName } from "@/lib/displayName";
import { setStoredGoingAccount } from "@/lib/goingAccount";

type Intent = "join" | "interested";

const INTENT_LABEL: Record<Intent, string> = {
  join: "想參加",
  interested: "有興趣",
};

export function InterestSignup() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [runnerId, setRunnerId] = useState("");
  const [runnerName, setRunnerName] = useState<string | null>(null);
  const [runnerLookup, setRunnerLookup] = useState(false);
  const [customName, setCustomName] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [toppings, setToppings] = useState<TofuTypeId[]>([]);
  const [pickNone, setPickNone] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function openForm(selected: Intent) {
    setError(null);

    if (selected === "join") {
      const id = runnerId.trim().toUpperCase();
      if (!id) {
        setError("請先輸入你的 Runner ID");
        return;
      }

      setRunnerLookup(true);
      setRunnerName(null);
      try {
        const res = await fetch(
          `/api/runner?runnerId=${encodeURIComponent(id)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "查詢失敗");
        setRunnerId(data.runnerId);
        setRunnerName(data.runnerName);
        setIntent("join");
        setStatus("idle");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "查詢失敗，請稍後再試"
        );
      } finally {
        setRunnerLookup(false);
      }
      return;
    }

    setIntent(selected);
    setStatus("idle");
    setToppings([]);
    setPickNone(false);
  }

  function closeForm() {
    setIntent(null);
    setRunnerId("");
    setRunnerName(null);
    setCustomName("");
    setEmail("");
    setLineId("");
    setToppings([]);
    setPickNone(false);
    setError(null);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!intent) return;

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/going", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          runnerId:
            intent === "join" ? runnerId.trim().toUpperCase() : undefined,
          customName: customName.trim() || undefined,
          email: email.trim(),
          lineId: lineId.trim() || undefined,
          preferredToppings:
            intent === "join"
              ? pickNone
                ? ["none"]
                : toppings
              : undefined,
          pureOnly: intent === "join" ? pickNone : undefined,
          douhuaGoal:
            intent === "join"
              ? formatDouhuaGoal(toppings, pickNone)
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "送出失敗");
      if (intent === "join" && runnerId.trim()) {
        setStoredGoingAccount({ runnerId: runnerId.trim().toUpperCase() });
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "送出失敗，請稍後再試");
    }
  }

  const displayName = resolveDisplayName(customName, runnerName);

  const successGoal =
    intent === "join" && (pickNone || toppings.length > 0)
      ? formatDouhuaGoal(toppings, pickNone)
      : null;

  if (status === "success") {
    return (
      <Card className="mb-5 border-2 border-mung-green/25 bg-gradient-to-br from-mung-green/10 to-tofu-white text-center">
        <p className="text-3xl">🥣</p>
        <h2 className="mt-2 text-lg font-semibold text-brown-sugar">收到了！</h2>
        {intent === "join" && runnerId && (
          <p className="mt-2 text-sm text-twilight">
            <span className="font-mono">{runnerId.trim().toUpperCase()}</span>
            {displayName && (
              <span className="ml-2 font-medium text-brown-sugar">
                {displayName}
              </span>
            )}
          </p>
        )}
        {successGoal && (
          <p className="mt-3 rounded-xl bg-cream/80 px-4 py-2 text-base font-semibold text-brown-sugar">
            目標：{successGoal}
          </p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-brown-sugar/75">
          謝謝你留下聯絡方式。
          <br />
          活動消息會寄到你的信箱或 Line，到時候中央公園見。
        </p>
        {intent === "join" && (
          <a
            href="/passport"
            className="mt-5 inline-block rounded-2xl bg-brown-sugar px-6 py-3 text-sm font-medium text-cream"
          >
            查看我的護照
          </a>
        )}
        <button
          type="button"
          onClick={closeForm}
          className="mt-3 block w-full text-xs text-brown-sugar/50 underline"
        >
          關閉
        </button>
      </Card>
    );
  }

  return (
    <Card className="mb-5 overflow-hidden border-2 border-brown-sugar/10 bg-gradient-to-br from-cream to-tofu-white">
      <p className="text-center text-xs font-medium tracking-wide text-sunset">
        活動預告
      </p>
      <h2 className="mt-1 text-center text-lg font-semibold text-brown-sugar">
        想一起來嗎？
      </h2>
      <p className="mt-2 text-center text-sm leading-relaxed text-brown-sugar/70">
        呀呼，先留個聯絡方式就好。
        <br />
        我們會在集合前通知你。
      </p>

      {!intent ? (
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-brown-sugar/70">
              Runner ID
            </span>
            <input
              type="text"
              value={runnerId}
              onChange={(e) => {
                setRunnerId(e.target.value.toUpperCase());
                setRunnerName(null);
                setError(null);
              }}
              placeholder="例如：DOG-214"
              className="w-full rounded-xl border border-brown-sugar/15 bg-cream px-4 py-3 font-mono text-sm tracking-wide text-brown-sugar outline-none transition-colors placeholder:font-sans placeholder:text-brown-sugar/35 focus:border-sunset/60 focus:ring-2 focus:ring-sunset/20"
            />
            <p className="mt-1 text-[10px] text-brown-sugar/45">
              填寫你的 Runner ID 並且按下想參加
            </p>
          </label>

          {error && (
            <p className="rounded-lg bg-red-bean/10 px-3 py-2 text-xs text-red-bean">
              {error}
            </p>
          )}

          <div className="flex gap-3">
          <button
            type="button"
            onClick={() => openForm("join")}
            disabled={runnerLookup}
            className="flex-1 rounded-2xl bg-brown-sugar px-4 py-3.5 text-sm font-medium text-cream shadow-md shadow-brown-sugar/15 transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {runnerLookup ? "查詢中…" : "想參加"}
          </button>
          <button
            type="button"
            onClick={() => openForm("interested")}
            className="flex-1 rounded-2xl border-2 border-brown-sugar/20 bg-cream px-4 py-3.5 text-sm font-medium text-brown-sugar transition-colors hover:border-brown-sugar/35 active:scale-[0.98]"
          >
            有興趣
          </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="relative flex min-h-[5.5rem] flex-col rounded-xl bg-sunset/10 px-3 py-2 pb-7 text-xs text-brown-sugar">
            <p className="text-left">
              你選了：
              <span className="font-semibold"> {INTENT_LABEL[intent]}</span>
            </p>
            {intent === "join" && runnerId && (
              <p className="flex flex-1 items-center justify-center gap-2 py-1 text-sm font-bold text-mung-green">
                <span className="font-mono">
                  {runnerId.trim().toUpperCase()}
                </span>
                {displayName && <span>{displayName}</span>}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setIntent(null);
                setRunnerName(null);
              }}
              className="absolute bottom-2 right-3 text-[10px] text-brown-sugar/50 underline"
            >
              改選
            </button>
          </div>

          <label className="block">
            <span className="mb-1.5 flex items-baseline gap-1.5 text-xs font-medium text-brown-sugar/70">
              自訂暱稱
              <span className="font-normal text-brown-sugar/40">(選填)</span>
            </span>
            <input
              type="text"
              maxLength={24}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={
                intent === "join" && runnerName
                  ? `例如：小綠豆、粉圓旅人…未填則顯示「${runnerName}」`
                  : "例如：小綠豆、粉圓旅人"
              }
              className="w-full rounded-xl border border-brown-sugar/15 bg-cream px-4 py-3 text-sm text-brown-sugar outline-none transition-colors placeholder:text-brown-sugar/35 focus:border-sunset/60 focus:ring-2 focus:ring-sunset/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-brown-sugar/70">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-brown-sugar/15 bg-cream px-4 py-3 text-sm text-brown-sugar outline-none transition-colors placeholder:text-brown-sugar/35 focus:border-sunset/60 focus:ring-2 focus:ring-sunset/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-baseline gap-1.5 text-xs font-medium text-brown-sugar/70">
              Line ID
              <span className="font-normal text-brown-sugar/40">(選填)</span>
            </span>
            <input
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder="@your_line_id"
              className="w-full rounded-xl border border-brown-sugar/15 bg-cream px-4 py-3 text-sm text-brown-sugar outline-none transition-colors placeholder:text-brown-sugar/35 focus:border-sunset/60 focus:ring-2 focus:ring-sunset/20"
            />
          </label>

          {intent === "join" && (
            <ToppingPicker
              selected={toppings}
              pickNone={pickNone}
              onChange={setToppings}
              onPickNone={setPickNone}
            />
          )}

          {error && (
            <p className="rounded-lg bg-red-bean/10 px-3 py-2 text-xs text-red-bean">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              className="flex-1"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "送出中…" : "送出"}
            </Button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl px-4 py-3 text-sm text-brown-sugar/60 hover:text-brown-sugar"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
