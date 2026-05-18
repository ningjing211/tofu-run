import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "豆花護照",
  description:
    "你的豆花慢跑紀錄：完成的豆花、Checkpoint Token 與活動歷史。",
  path: "/passport",
});

export default function PassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
