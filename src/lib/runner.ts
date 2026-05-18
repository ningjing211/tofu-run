export const RUNNER_ID_PATTERN = /^[A-Z]{2,4}-\d{3}$/;

export function normalizeRunnerId(raw: string): string {
  return raw.trim().toUpperCase();
}
