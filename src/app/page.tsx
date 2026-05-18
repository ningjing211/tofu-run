import Link from "next/link";
import { InterestSignup } from "@/components/InterestSignup";
import { JoinQrCard } from "@/components/JoinQrCard";
import { PageShell } from "@/components/PageShell";
import { ParkMap } from "@/components/ParkMap";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GATHERING_SLOTS, TOKEN_TYPES } from "@/lib/constants";

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const joinUrl = `${appUrl}/join`;

  return (
    <PageShell>
      <header className="mb-8 text-center">
        <p className="mb-2 text-4xl">🥣</p>
        <h1 className="text-3xl font-bold tracking-tight text-brown-sugar">
          豆花慢跑
        </h1>
        <p className="mt-2 text-sm text-brown-sugar/70">
          一起完成屬於你的一碗豆花。
        </p>
        <p className="mt-1 text-xs text-twilight/80">Tofu Run · 高雄中央公園</p>
        <p className="mt-1 text-xs italic text-brown-sugar/50">
          When the Tofu Pudding is Running ...
        </p>
      </header>

      <InterestSignup />

      <Card className="mb-5">
        <h2 className="mb-2 font-semibold text-brown-sugar">這是什麼？</h2>
        <p className="text-sm leading-relaxed text-brown-sugar/80">
          城市裡的團體加油慢跑遊戲。<br/>掃描 QR 加入、選擇一碗豆花配料、到公園各區掃描獲取美味
          Token，收集你的豆花護照 — 跑.. 跑.. 跑... 享用你們拾取的豆花。
        </p>
      </Card>

      <Card className="mb-5 bg-gradient-to-br from-sunset/10 to-tofu-white">
        <h2 className="mb-2 font-semibold text-brown-sugar">平日集合的瞬間</h2>
        <ul className="space-y-2">
          {GATHERING_SLOTS.map((slot) => (
            <li key={slot.time} className="text-base font-medium text-red-bean">
              {slot.time}
              <span className="font-normal text-brown-sugar/70">
                （{slot.mood}）
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-brown-sugar/60">
          掃描活動 QR 即可自動取得玩家身份
        </p>
        <div className="mt-5 flex justify-center border-t border-brown-sugar/10 pt-5">
          <JoinQrCard />
        </div>
      </Card>

      <section className="mb-5">
        <h2 className="mb-3 text-center text-sm font-semibold text-brown-sugar">
          中央公園 · Checkpoint 地圖
        </h2>
        <ParkMap />
      </section>

      <Card className="mb-5">
        <h2 className="mb-3 font-semibold text-brown-sugar">Checkpoint 一覽</h2>
        <ul className="space-y-2">
          {TOKEN_TYPES.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-cream/60 px-3 py-2 text-sm"
            >
              <span>
                {t.emoji} {t.zone}
              </span>
              <span className="text-brown-sugar/60">{t.label}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3 pb-4">
        <Button href="/join" className="w-full">
          掃碼加入活動 →
        </Button>
        <Button href="/lobby" variant="secondary" className="w-full">
          進入今日 Lobby
        </Button>
        <p className="text-center text-[11px] text-brown-sugar/50">
          QR 連結：{" "}
          <Link href="/join" className="underline">
            {joinUrl}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
