const TZ = "Asia/Taipei";

export type SignupDateTimeParts = {
  date: string;
  time: string;
};

/** Lobby 報名時間：日期 + am/pm（皆來自 going_signups.created_at） */
export function formatSignupDateTime(iso: string): SignupDateTimeParts | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const date = d.toLocaleString("en-US", {
    timeZone: TZ,
    month: "numeric",
    day: "numeric",
  });

  const time = d
    .toLocaleString("en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return { date, time };
}
