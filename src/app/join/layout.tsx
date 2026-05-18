import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "加入活動",
  description:
    "掃描 QR 加入豆花慢跑，自動取得玩家 ID 與暱稱，進入今日 Lobby。",
  path: "/join",
});

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
