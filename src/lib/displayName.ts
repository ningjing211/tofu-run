/** 有自訂暱稱用自訂暱稱，否則用名額池 runner_name */
export function resolveDisplayName(
  customName: string | null | undefined,
  runnerName: string | null | undefined
): string | null {
  const custom = customName?.trim();
  if (custom) return custom;
  const runner = runnerName?.trim();
  return runner || null;
}
