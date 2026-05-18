import Image from "next/image";
import { TOKEN_TYPES } from "@/lib/constants";

const PIN_POSITIONS = [
  "left-[18%] top-[32%]",
  "right-[15%] top-[28%]",
  "left-[28%] bottom-[28%]",
  "right-[22%] bottom-[38%]",
  "right-[30%] bottom-[18%]",
];

const TOKEN_SIZE = 56;

export function ParkMap() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-brown-sugar/15 bg-gradient-to-b from-mung-green/20 via-tofu-white to-sunset/25 p-4 shadow-inner">
      <p className="text-center text-xs font-medium text-brown-sugar/60">
        高雄中央公園 · 豆花地圖
      </p>

      <div className="absolute inset-4 rounded-2xl border border-dashed border-brown-sugar/20" />
      <div className="absolute left-[12%] top-[28%] h-16 w-20 rounded-full border border-blue-300/30 bg-blue-200/40" />
      <div className="absolute right-[10%] top-[20%] h-20 w-24 rounded-2xl border border-mung-green/30 bg-mung-green/25" />
      <div className="absolute bottom-[22%] left-[20%] h-14 w-28 rounded-2xl border border-mung-green/25 bg-mung-green/20" />
      <div className="absolute bottom-[35%] right-[18%] h-3 w-24 rotate-12 rounded-full bg-brown-sugar/15" />
      <div className="absolute bottom-[15%] right-[25%] h-12 w-16 rounded-xl border border-brown-sugar/15 bg-tofu-white/80" />

      {TOKEN_TYPES.map((token, i) => (
        <div
          key={token.id}
          className={`absolute ${PIN_POSITIONS[i]} z-10 flex flex-col items-center`}
        >
          <div className="animate-float">
            <Image
              src={token.image}
              alt={token.label}
              width={TOKEN_SIZE}
              height={TOKEN_SIZE}
              className="h-14 w-14 object-contain drop-shadow-lg"
            />
          </div>
          <span className="mt-0.5 rounded-full bg-cream/90 px-2 py-0.5 text-[10px] font-medium text-brown-sugar shadow-sm">
            {token.zone}
          </span>
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft text-2xl">
        🥣
      </div>
    </div>
  );
}
