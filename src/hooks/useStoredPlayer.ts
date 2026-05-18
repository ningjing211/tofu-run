"use client";

import { useEffect, useState } from "react";
import { getStoredPlayer } from "@/lib/player";
import type { StoredPlayer } from "@/types/database";

export function useStoredPlayerSnapshot() {
  const [player, setPlayer] = useState<StoredPlayer | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlayer(getStoredPlayer());
    setMounted(true);
  }, []);

  return { player, mounted };
}
