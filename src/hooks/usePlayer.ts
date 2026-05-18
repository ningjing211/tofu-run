"use client";

import { useCallback, useEffect, useState } from "react";
import { getStoredPlayer, setStoredPlayer } from "@/lib/player";
import { getCurrentPosition } from "@/lib/geolocation";
import type { StoredPlayer } from "@/types/database";

export function usePlayer() {
  const [player, setPlayer] = useState<StoredPlayer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlayer(getStoredPlayer());
    setLoading(false);
  }, []);

  const join = useCallback(async (): Promise<StoredPlayer> => {
    const existing = getStoredPlayer();
    const geo = await getCurrentPosition();

    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: existing?.userId,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "加入失敗");

    if (data.rejoined && existing) {
      setPlayer(existing);
      return existing;
    }

    const newPlayer: StoredPlayer = {
      userId: data.userId,
      runnerId: data.runnerId,
      runnerName: data.runnerName,
    };
    setStoredPlayer(newPlayer);
    setPlayer(newPlayer);
    return newPlayer;
  }, []);

  return { player, loading, join, setPlayer };
}
