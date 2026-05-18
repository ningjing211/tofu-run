import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "即將開始的活動 Lobby",
  description: "查看想參加豆花慢跑的報名名單，活動日確定後再集合開跑。",
  path: "/lobby",
});

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
