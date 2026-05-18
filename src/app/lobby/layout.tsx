import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "今日 Lobby",
  description: "查看今日參加豆花慢跑的玩家、豆花分配狀態與活動進度。",
  path: "/lobby",
});

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
