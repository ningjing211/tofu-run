"use client";

import { useCallback, useEffect, useState } from "react";
import { getStoredGoingAccount } from "@/lib/goingAccount";
import { clearPassportCache } from "@/lib/passportCache";
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
    const going = getStoredGoingAccount();
    if (!going?.runnerId) {
      throw new Error("請先於護照登入（須已完成想參加報名）");
    }

    const existing = getStoredPlayer();
    if (existing && existing.runnerId !== going.runnerId) {
      setStoredPlayer({
        userId: existing.userId,
        runnerId: going.runnerId,
        runnerName: existing.runnerName,
      });
    }

    const geo = await getCurrentPosition();

    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: existing?.runnerId === going.runnerId ? existing.userId : undefined,
        runnerId: going.runnerId,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "加入失敗");

    if (data.rejoined && existing?.runnerId === going.runnerId) {
      const refreshed: StoredPlayer = {
        userId: existing.userId,
        runnerId: data.runnerId ?? going.runnerId,
        runnerName: data.runnerName ?? existing.runnerName,
      };
      setStoredPlayer(refreshed);
      setPlayer(refreshed);
      return refreshed;
    }

    const newPlayer: StoredPlayer = {
      userId: data.userId,
      runnerId: data.runnerId,
      runnerName: data.runnerName,
    };
    setStoredPlayer(newPlayer);
    setPlayer(newPlayer);
    clearPassportCache();
    return newPlayer;
  }, []);

  return { player, loading, join, setPlayer };
}
