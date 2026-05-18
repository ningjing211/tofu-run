"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TokenIcon } from "@/components/TokenIcon";
import { TOKEN_TYPES, getTokenLabel } from "@/lib/constants";
import { getCurrentPosition } from "@/lib/geolocation";
import { useStoredPlayerSnapshot } from "@/hooks/useStoredPlayer";

const VALID = TOKEN_TYPES.map((t) => t.id);

export default function ScanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const tokenType = token.toLowerCase();
  const tokenInfo = TOKEN_TYPES.find((t) => t.id === tokenType);
  const { player } = useStoredPlayerSnapshot();

  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [scannedAt, setScannedAt] = useState<string | null>(null);

  useEffect(() => {
    if (player && tokenInfo && status === "idle") {
      handleScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, tokenInfo]);

  async function handleScan() {
    if (!player || !tokenInfo) return;
    setStatus("scanning");
    setError(null);

    const geo = await getCurrentPosition();

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: player.userId,
          tokenType,
          lat: geo?.lat ?? null,
          lng: geo?.lng ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScannedAt(data.scannedAt);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "掃描失敗");
    }
  }

  if (!VALID.includes(tokenType as (typeof VALID)[number])) {
    return (
      <PageShell showNav={false}>
        <Card className="mt-16 text-center">
          <p className="text-red-bean">無效的 Checkpoint Token</p>
          <Button href="/" className="mt-4 w-full">
            返回首頁
          </Button>
        </Card>
      </PageShell>
    );
  }

  if (!player) {
    return (
      <PageShell showNav={false}>
        <Card className="mt-16 text-center">
          {tokenInfo && (
            <TokenIcon
              src={tokenInfo.image}
              alt={tokenInfo.label}
              size={80}
              className="mx-auto mb-4"
            />
          )}
          <h1 className="text-xl font-bold">{tokenInfo?.zone}</h1>
          <p className="mt-4 text-sm text-brown-sugar/70">
            請先加入活動才能掃描 Token
          </p>
          <Button href="/join" className="mt-6 w-full">
            加入活動
          </Button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell showNav={false}>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
        {tokenInfo && (
          <div className="mb-4 animate-float">
            <TokenIcon
              src={tokenInfo.image}
              alt={tokenInfo.label}
              size={96}
              className="mx-auto"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-brown-sugar">
          {tokenInfo?.zone}
        </h1>
        <p className="text-sm text-brown-sugar/60">{getTokenLabel(tokenType)}</p>

        {status === "scanning" && (
          <Card className="mt-8 w-full">
            <p className="animate-pulse-soft">正在記錄掃描…</p>
            <p className="mt-2 text-xs text-brown-sugar/50">取得 GPS 座標</p>
          </Card>
        )}

        {status === "success" && (
          <Card className="mt-8 w-full border-2 border-mung-green/30">
            <p className="text-2xl">✨</p>
            <p className="mt-2 font-semibold text-mung-green">Token 已記錄！</p>
            <p className="mt-1 font-mono text-xs text-brown-sugar/60">
              {player.runnerName} · {player.runnerId}
            </p>
            {scannedAt && (
              <p className="mt-2 text-xs text-brown-sugar/50">
                {new Date(scannedAt).toLocaleString("zh-TW", {
                  timeZone: "Asia/Taipei",
                })}
              </p>
            )}
            <Button href="/passport" className="mt-6 w-full">
              查看護照
            </Button>
          </Card>
        )}

        {status === "error" && (
          <Card className="mt-8 w-full">
            <p className="text-red-bean">{error}</p>
            <Button className="mt-4 w-full" onClick={handleScan}>
              重試
            </Button>
          </Card>
        )}

        {status === "idle" && (
          <Button className="mt-8 w-full" onClick={handleScan}>
            掃描此 Token
          </Button>
        )}

        <Link
          href="/lobby"
          className="mt-6 text-xs text-brown-sugar/50 underline"
        >
          返回 Lobby
        </Link>
      </div>
    </PageShell>
  );
}
