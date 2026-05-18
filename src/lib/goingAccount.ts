/** 已「想參加」報名者的本機登入（護照） */
export const GOING_ACCOUNT_KEY = "tofu-run-going-account";

export type StoredGoingAccount = {
  runnerId: string;
};

export function getStoredGoingAccount(): StoredGoingAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GOING_ACCOUNT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredGoingAccount;
  } catch {
    return null;
  }
}

export function setStoredGoingAccount(account: StoredGoingAccount): void {
  localStorage.setItem(GOING_ACCOUNT_KEY, JSON.stringify(account));
}

export function clearStoredGoingAccount(): void {
  localStorage.removeItem(GOING_ACCOUNT_KEY);
}
