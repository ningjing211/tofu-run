import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "豆花護照",
  description:
    "豆花護照：登入 Runner ID 查看帳戶、豆花目標與要收集的 Token；現場加入後可查看活動紀錄。",
  path: "/passport",
});

export default function PassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
