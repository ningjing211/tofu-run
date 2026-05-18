import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Checkpoint 掃描",
  description:
    "掃描高雄中央公園 Checkpoint QR，記錄 Token 與 GPS 位置。",
  path: "/scan",
  noIndex: true,
});

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
