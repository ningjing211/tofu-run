"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStoredGoingAccount } from "@/hooks/useStoredGoingAccount";
import type { GoingJoinListEntry } from "@/types/database";

export default function LobbyPage() {
  const [signups, setSignups] = useState<GoingJoinListEntry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account: me } = useStoredGoingAccount();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lobby", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSignups(data.signups ?? []);
      setCount(data.count ?? 0);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <PageShell>
      <header className="mb-6">
        <p className="text-xs text-brown-sugar/60">Lobby即將開始的活動</p>
        <h1 className="text-2xl font-bold text-brown-sugar">想參加名單…</h1>
        <p className="mt-2 text-sm leading-relaxed text-brown-sugar/65">
          尚未加入今日活動。請先點選想參加、完成登入護照，再期待到現場加入。
        </p>
        {me && (
          <p className="mt-2 text-sm text-twilight">
            你已登入：{me.runnerId}
          </p>
        )}
      </header>

      {!me && (
        <Card className="mb-4 border-sunset/30 bg-sunset/5">
          <p className="text-sm leading-relaxed text-brown-sugar/80">
            請先點選想參加、完成登入護照，再期待到現場加入。
          </p>
          <div className="mt-3 flex gap-2">
            <Button href="/" variant="secondary" className="flex-1">
              回首頁報名
            </Button>
            <Button href="/passport" className="flex-1">
              護照登入
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-brown-sugar">想參加的人</h2>
            <p className="text-xs text-brown-sugar/50">
              共 {loading ? "…" : count} 人
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="text-xs text-brown-sugar/60 underline"
          >
            重新整理
          </button>
        </div>

        {loading && (
          <p className="animate-pulse-soft py-8 text-center text-sm text-brown-sugar/60">
            載入中…
          </p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-red-bean">{error}</p>
        )}

        {!loading && !error && signups.length === 0 && (
          <p className="py-8 text-center text-sm text-brown-sugar/60">
            還沒有人報名，成為第一碗豆花吧 🥣
          </p>
        )}

        {!loading && signups.length > 0 && (
          <ul className="divide-y divide-brown-sugar/8">
            {signups.map((s) => {
              const isMe = me?.runnerId === s.runner_id;
              const displayName =
                s.nickname?.trim() || s.runner_name?.trim() || "—";

              return (
                <li
                  key={s.id}
                  className={`flex items-center justify-between gap-3 py-3 ${
                    isMe ? "bg-sunset/10 -mx-1 rounded-xl px-1" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-twilight">
                      {s.runner_id}
                    </p>
                    <p className="truncate text-sm text-brown-sugar">
                      {displayName}
                    </p>
                    {s.goal && (
                      <p className="mt-0.5 truncate text-xs text-mung-green">
                        {s.goal}
                      </p>
                    )}
                  </div>
                  {isMe && (
                    <span className="shrink-0 rounded-full bg-sunset/20 px-2 py-0.5 text-[10px] font-medium text-brown-sugar">
                      你
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="mt-5 space-y-3">
        <Button href="/passport" variant="secondary" className="w-full">
          我的豆花護照
        </Button>
        <Link
          href="/"
          className="block text-center text-xs text-brown-sugar/50 underline"
        >
          返回首頁
        </Link>
      </div>
    </PageShell>
  );
}
