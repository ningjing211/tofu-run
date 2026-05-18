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

export type GoingSignup = {
  id: string;
  email: string;
  runner_id: string | null;
  runner_name: string | null;
  custom_name: string | null;
  nickname: string | null;
  line_id: string | null;
  intent: string;
  topping1: string | null;
  topping2: string | null;
  topping3: string | null;
  goal: string | null;
  created_at: string;
};

export type PassportAccount = {
  signup: GoingSignup;
  collectTargets: {
    id: string;
    label: string;
    zone: string;
    tokenLabel: string;
  }[];
  user: User | null;
  runs: PassportRun[];
};
