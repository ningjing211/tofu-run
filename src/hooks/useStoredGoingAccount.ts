"use client";

import { useEffect, useState } from "react";
import {
  getStoredGoingAccount,
  type StoredGoingAccount,
} from "@/lib/goingAccount";

/** 避免 SSR 與 localStorage 不一致造成 hydration 錯誤 */
export function useStoredGoingAccount() {
  const [account, setAccount] = useState<StoredGoingAccount | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAccount(getStoredGoingAccount());
    setMounted(true);
  }, []);

  return { account, mounted };
}
