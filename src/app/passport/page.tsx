"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  TOFU_TYPES,
  getTokenLabel,
  getTofuLabel,
} from "@/lib/constants";
import { getStoredPlayer } from "@/lib/player";
import {
  formatDisplayDate,
  formatDurationMinutes,
} from "@/lib/session";
import type { PassportRun, User } from "@/types/database";

export default function PassportPage() {
  const stored = getStoredPlayer();
  const [user, setUser] = useState<User | null>(null);
  const [runs, setRuns] = useState<PassportRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stored) {
      setLoading(false);
      return;
    }

    fetch(`/api/passport?userId=${stored.userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setUser(data.user);
        setRuns(data.runs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [stored]);

  if (!stored) {
    return (
      <PageShell>
        <Card className="mt-8 text-center">
          <p className="text-4xl mb-4">📔</p>
          <h1 className="text-xl font-bold">豆花護照</h1>
          <p className="mt-2 text-sm text-brown-sugar/70">
            加入活動後才能查看你的護照
          </p>
          <Button href="/join" className="mt-6 w-full">
            加入活動
          </Button>
        </Card>
      </PageShell>
    );
  }

  const tofuEmoji = (id: string | null) =>
    TOFU_TYPES.find((t) => t.id === id)?.emoji ?? "🥣";

  return (
    <PageShell>
      <header className="mb-6 text-center">
        <p className="text-4xl mb-2">📔</p>
        <h1 className="text-2xl font-bold text-brown-sugar">
          {user?.runner_name ?? stored.runnerName}
        </h1>
        <p className="mt-1 font-mono text-sm text-twilight">
          RUN ID: {user?.runner_id ?? stored.runnerId}
        </p>
        <p className="mt-1 text-xs text-brown-sugar/50">豆花護照</p>
      </header>

      {loading && (
        <p className="animate-pulse-soft text-center text-sm text-brown-sugar/60">
          載入歷史紀錄…
        </p>
      )}

      {error && (
        <Card>
          <p className="text-red-bean text-sm">{error}</p>
        </Card>
      )}

      {!loading && runs.length === 0 && (
        <Card className="text-center">
          <p className="text-sm text-brown-sugar/70">
            還沒有完成紀錄，去公園掃描 Token 吧！
          </p>
          <Button href="/lobby" variant="secondary" className="mt-4 w-full">
            前往 Lobby
          </Button>
        </Card>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-brown-sugar/70">已完成</h2>

        {runs.map((run) => {
          const duration =
            run.completed_at &&
            formatDurationMinutes(run.joined_at, run.completed_at);

          return (
            <Card
              key={run.session_date + run.joined_at}
              className="border-l-4 border-sunset/50"
            >
              <p className="text-xs text-brown-sugar/50">
                {formatDisplayDate(run.session_date)}
              </p>

              {run.tofu_type && (
                <p className="mt-2 text-lg font-semibold">
                  獲得：{tofuEmoji(run.tofu_type)}{" "}
                  {getTofuLabel(run.tofu_type)}
                </p>
              )}

              {run.tokens.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-brown-sugar/60 mb-1">
                    Checkpoint：
                  </p>
                  <ul className="space-y-1">
                    {run.tokens.map((t) => (
                      <li key={t.id} className="text-sm flex items-center gap-2">
                        <span>·</span>
                        {getTokenLabel(t.token_type)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {duration != null && (
                <p className="mt-3 text-sm text-mung-green">
                  完成時間：{duration} 分鐘
                </p>
              )}

              {run.completed_at && (
                <p className="mt-1 text-xs text-brown-sugar/40">
                  {new Date(run.completed_at).toLocaleTimeString("zh-TW", {
                    timeZone: "Asia/Taipei",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  完成
                </p>
              )}
            </Card>
          );
        })}
      </section>

      <div className="mt-6 pb-4">
        <Link
          href="/lobby"
          className="block text-center text-xs text-brown-sugar/50 underline"
        >
          返回 Lobby
        </Link>
      </div>
    </PageShell>
  );
}
