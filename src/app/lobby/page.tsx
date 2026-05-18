"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTofuLabel } from "@/lib/constants";
import { getStoredPlayer } from "@/lib/player";
import { formatDisplayDate } from "@/lib/session";
import type { LobbyPlayer } from "@/types/database";

export default function LobbyPage() {
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [sessionDate, setSessionDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const me = getStoredPlayer();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lobby");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlayers(data.players);
      setSessionDate(data.sessionDate);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <PageShell>
      <header className="mb-6">
        <p className="text-xs text-brown-sugar/60">今日 Lobby</p>
        <h1 className="text-2xl font-bold text-brown-sugar">
          {sessionDate ? formatDisplayDate(sessionDate) : "載入中…"}
        </h1>
        {me && (
          <p className="mt-1 text-sm text-twilight">
            你：{me.runnerName} · {me.runnerId}
          </p>
        )}
      </header>

      {!me && (
        <Card className="mb-4 border-sunset/40">
          <p className="text-sm text-brown-sugar/80">尚未加入活動</p>
          <Button href="/join" className="mt-3 w-full">
            掃碼加入
          </Button>
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">今日參加者</h2>
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

        {!loading && !error && players.length === 0 && (
          <p className="py-8 text-center text-sm text-brown-sugar/60">
            還沒有人加入，成為第一碗豆花吧 🥣
          </p>
        )}

        {!loading && players.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-brown-sugar/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/80 text-left text-xs text-brown-sugar/60">
                  <th className="px-3 py-2 font-medium">玩家</th>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">豆花</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr
                    key={p.user_id}
                    className={`border-t border-brown-sugar/5 ${
                      me?.userId === p.user_id ? "bg-sunset/10" : ""
                    }`}
                  >
                    <td className="px-3 py-3 font-medium">{p.runner_name}</td>
                    <td className="px-3 py-3 font-mono text-xs text-twilight">
                      {p.runner_id}
                    </td>
                    <td className="px-3 py-3">
                      {p.tofu_type ? (
                        <span className="rounded-full bg-tofu-white px-2 py-0.5 text-xs">
                          {getTofuLabel(p.tofu_type).replace("豆花", "")}
                        </span>
                      ) : (
                        <span className="text-xs text-brown-sugar/40">
                          等待分配
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
