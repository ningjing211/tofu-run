import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "LIVE",
  description: "活動當日 LIVE 房間，查看今日進場參加者與在線狀態。",
  path: "/live",
});

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
