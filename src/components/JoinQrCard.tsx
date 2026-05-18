/** 示範用假 QR（視覺預覽），實際活動請換成真實編碼的 QR */
export function JoinQrCard({ label = "掃碼加入活動" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-2xl border-2 border-brown-sugar/15 bg-cream p-4 shadow-inner">
        <div className="absolute -left-1 -top-1 h-4 w-4 rounded-sm border-l-2 border-t-2 border-sunset/60" />
        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-sm border-r-2 border-t-2 border-sunset/60" />
        <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-sm border-b-2 border-l-2 border-sunset/60" />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-sm border-b-2 border-r-2 border-sunset/60" />

        <svg
          viewBox="0 0 29 29"
          className="h-44 w-44"
          role="img"
          aria-label="示範用 QR Code"
        >
          <rect width="29" height="29" fill="#FFF8F0" rx="1" />
          <FakeQrPattern />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-cream/95 px-2 py-1 text-2xl shadow-sm">
            🥣
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-sm font-medium text-brown-sugar">
        {label}
      </p>
      <p className="mt-0.5 text-center text-[10px] text-brown-sugar/45">
        示範 QR · 活動當日換成真碼
      </p>
    </div>
  );
}

function Finder({ x, y }: { x: number; y: number }) {
  const s = 29 / 23;
  return (
    <g transform={`translate(${x * s}, ${y * s})`}>
      <rect width={7 * s} height={7 * s} fill="#5C3D2E" />
      <rect x={s} y={s} width={5 * s} height={5 * s} fill="#FFF8F0" />
      <rect x={2 * s} y={2 * s} width={3 * s} height={3 * s} fill="#5C3D2E" />
    </g>
  );
}

function FakeQrPattern() {
  const modules: number[][] = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0],
    [1,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,1,1,1],
    [0,0,1,0,1,0,0,1,1,0,1,1,0,1,1,0,1,0,0,1,0,0,0],
    [1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1],
    [0,1,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
    [1,1,1,0,0,1,0,1,0,1,1,1,1,0,1,0,0,1,1,1,0,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,1,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,1,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1],
  ];

  const size = 23;
  const cell = 29 / size;

  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= 15 && y < 8) || (x < 8 && y >= 15);

  return (
    <>
      <Finder x={0} y={0} />
      <Finder x={15} y={0} />
      <Finder x={0} y={15} />
      {modules.map((row, y) =>
        row.map((on, x) => {
          if (inFinder(x, y) || !on) return null; // on: 1 = dark module
          return (
            <rect
              key={`${x}-${y}`}
              x={x * cell + 0.12}
              y={y * cell + 0.12}
              width={cell - 0.08}
              height={cell - 0.08}
              fill="#5C3D2E"
              rx={0.12}
            />
          );
        })
      )}
    </>
  );
}
