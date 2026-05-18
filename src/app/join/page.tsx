"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePlayer } from "@/hooks/usePlayer";

export default function JoinPage() {
  const router = useRouter();
  const { player, loading, join } = usePlayer();
  const [status, setStatus] = useState<"idle" | "joining" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    runnerId: string;
    runnerName: string;
  } | null>(null);

  useEffect(() => {
    if (loading) return;
    if (player && status === "idle") {
      handleJoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, player]);

  async function handleJoin() {
    setStatus("joining");
    setError(null);
    try {
      const p = await join();
      setResult({ runnerId: p.runnerId, runnerName: p.runnerName });
      setTimeout(() => router.push("/lobby"), 2500);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "加入失敗");
    }
  }

  return (
    <PageShell showNav={false}>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-5xl animate-float">🥣</p>
        <h1 className="text-2xl font-bold text-brown-sugar">加入豆花慢跑</h1>

        {status === "joining" && (
          <Card className="mt-8 w-full">
            <p className="animate-pulse-soft text-brown-sugar/80">
              正在為你準備玩家身份…
            </p>
            <p className="mt-2 text-xs text-brown-sugar/50">
              取得 GPS 位置（僅記錄首次登入）
            </p>
          </Card>
        )}

        {result && (
          <Card className="mt-8 w-full border-2 border-mung-green/30">
            <p className="text-sm text-brown-sugar/60">歡迎加入！</p>
            <p className="mt-2 text-2xl font-bold text-brown-sugar">
              {result.runnerName}
            </p>
            <p className="mt-1 font-mono text-sm text-twilight">
              RUN ID: {result.runnerId}
            </p>
            <p className="mt-4 text-xs text-brown-sugar/50">
              即將進入 Lobby…
            </p>
          </Card>
        )}

        {status === "error" && (
          <Card className="mt-8 w-full border-red-bean/30">
            <p className="text-red-bean">{error}</p>
            <Button className="mt-4 w-full" onClick={handleJoin}>
              重試
            </Button>
          </Card>
        )}

        {status === "idle" && !player && (
          <Button className="mt-8 w-full" onClick={handleJoin}>
            開始加入
          </Button>
        )}
      </div>
    </PageShell>
  );
}
