export const RUNNER_ID_PREFIXES = ["TOFU", "BEAN", "MUNG"] as const;

export const RUNNER_NAMES = [
  "紅豆獵人",
  "小綠豆",
  "粉圓旅人",
  "黑糖漫遊者",
  "芋圓騎士",
  "花生行者",
  "豆花旅伴",
  "夕陽慢跑者",
  "中央公園豆友",
  "糖水探險家",
  "糯米團子",
  "仙草漫遊",
] as const;

export const TOFU_TYPES = [
  { id: "redbean", label: "紅豆豆花", emoji: "🫘", color: "#B85C5C" },
  { id: "mungbean", label: "綠豆豆花", emoji: "🌿", color: "#7BA05B" },
  { id: "peanut", label: "花生豆花", emoji: "🥜", color: "#C4A574" },
  { id: "tapioca", label: "粉圓豆花", emoji: "⚪", color: "#9B8B7A" },
  { id: "taro", label: "芋圓豆花", emoji: "💜", color: "#9B7EBD" },
] as const;

export type TofuTypeId = (typeof TOFU_TYPES)[number]["id"];

export const TOKEN_TYPES = [
  {
    id: "redbean",
    label: "紅豆 Token",
    zone: "水池區",
    emoji: "🫘",
  },
  {
    id: "mungbean",
    label: "綠豆 Token",
    zone: "樹林區",
    emoji: "🌿",
  },
  {
    id: "peanut",
    label: "花生 Token",
    zone: "草地區",
    emoji: "🥜",
  },
  {
    id: "tapioca",
    label: "粉圓 Token",
    zone: "步道區",
    emoji: "⚪",
  },
  {
    id: "taro",
    label: "芋圓 Token",
    zone: "廣場區",
    emoji: "💜",
  },
] as const;

export type TokenTypeId = (typeof TOKEN_TYPES)[number]["id"];

export const STORAGE_KEY = "tofu-run-player";

export const GATHERING_SLOTS = [
  { time: "傍晚 5–6 點", mood: "璀璨夕陽" },
  { time: "晚間 7–9 點", mood: "夏夜晚風" },
] as const;

export function getTofuLabel(id: string | null | undefined): string {
  return TOFU_TYPES.find((t) => t.id === id)?.label ?? "尚未分配";
}

export function getTokenLabel(id: string): string {
  return TOKEN_TYPES.find((t) => t.id === id)?.label ?? id;
}
