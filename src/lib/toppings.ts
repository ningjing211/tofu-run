import { PURE_DOUHUA_GOAL, TOFU_TYPES, TOKEN_TYPES } from "@/lib/constants";
import type { TofuTypeId } from "@/lib/constants";

export type CollectTarget = {
  id: string;
  label: string;
  zone: string;
  tokenLabel: string;
};

export function collectTargetsFromSignup(
  goal: string | null,
  topping1: string | null,
  topping2: string | null,
  topping3: string | null
): CollectTarget[] {
  if (!goal || goal === PURE_DOUHUA_GOAL) return [];

  const ids = [topping1, topping2, topping3].filter(Boolean) as string[];

  return ids.map((id) => {
    const tofu = TOFU_TYPES.find((t) => t.id === id);
    const token = TOKEN_TYPES.find((t) => t.id === id);
    return {
      id,
      label: tofu?.shortName ?? id,
      zone: token?.zone ?? "",
      tokenLabel: token?.label ?? `${id} Token`,
    };
  });
}

export function isValidToppingId(id: string): id is TofuTypeId {
  return TOFU_TYPES.some((t) => t.id === id);
}
