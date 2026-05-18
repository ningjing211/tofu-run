export const siteConfig = {
  name: "豆花慢跑",
  nameEn: "Tofu Run",
  tagline: "一起完成屬於你的一碗豆花。",
  taglineEn: "When the Tofu Pudding is Running ...",
  location: "高雄中央公園",
  city: "高雄",
  country: "TW",
  locale: "zh_TW",
  url:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  creator: "豆花慢跑",
  keywords: [
    "豆花慢跑",
    "Tofu Run",
    "高雄中央公園",
    "慢跑",
    "城市遊戲",
    "QR code 活動",
    "豆花",
    "團體慢跑",
    "city walk",
    "高雄活動",
  ],
  description:
    "豆花慢跑（Tofu Run）是高雄中央公園的城市團體加油慢跑遊戲。掃描 QR 加入、選擇豆花配料、到公園各區掃描 Token，收集你的豆花護照——跑、跑、跑，享用你們拾取的豆花。",
  shortDescription:
    "高雄中央公園的城市慢跑遊戲。掃 QR 加入、選豆花、收集 Token 與豆花護照。",
} as const;

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url;
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
