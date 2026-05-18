export type User = {
  id: string;
  runner_id: string;
  runner_name: string;
  slot_no: number | null;
  claimed_at: string | null;
  first_lat: number | null;
  first_lng: number | null;
  created_at: string;
};

export type Session = {
  id: string;
  date: string;
  started_at: string;
};

export type UserSession = {
  id: string;
  user_id: string;
  session_id: string;
  tofu_type: string | null;
  completed_at: string | null;
  joined_at: string;
};

export type Token = {
  id: string;
  user_id: string;
  token_type: string;
  lat: number | null;
  lng: number | null;
  scanned_at: string;
};

export type LobbyPlayer = {
  user_id: string;
  runner_id: string;
  runner_name: string;
  tofu_type: string | null;
  joined_at: string;
};

export type PassportRun = {
  session_date: string;
  tofu_type: string | null;
  completed_at: string | null;
  joined_at: string;
  tokens: Token[];
};

export type StoredPlayer = {
  userId: string;
  runnerId: string;
  runnerName: string;
};
