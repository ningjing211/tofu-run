import { createSupabaseClient } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/session";
import type {
  LobbyPlayer,
  PassportRun,
  Session,
  Token,
  User,
  UserSession,
} from "@/types/database";

export async function getOrCreateTodaySession(): Promise<Session> {
  const supabase = createSupabaseClient();
  const today = getTodayDateString();

  const { data: existing } = await supabase
    .from("sessions")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (existing) return existing as Session;

  const { data, error } = await supabase
    .from("sessions")
    .insert({ date: today })
    .select()
    .single();

  if (error) throw error;
  return data as Session;
}

/** 從 300 名額池領取下一個未使用的跑者（現場掃碼） */
export async function claimNextPoolUser(
  lat: number | null,
  lng: number | null
): Promise<User | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.rpc("claim_next_pool_user", {
    p_lat: lat,
    p_lng: lng,
  });

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return (row as User) ?? null;
}

export async function getPoolStats(): Promise<{
  total: number;
  claimed: number;
  remaining: number;
}> {
  const supabase = createSupabaseClient();

  const { count: total, error: e1 } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .not("slot_no", "is", null);

  const { count: claimed, error: e2 } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .not("slot_no", "is", null)
    .not("claimed_at", "is", null);

  if (e1 || e2) throw e1 ?? e2;

  const t = total ?? 0;
  const c = claimed ?? 0;
  return { total: t, claimed: c, remaining: t - c };
}

export async function createUser(
  runnerId: string,
  runnerName: string,
  lat: number | null,
  lng: number | null
): Promise<User> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .insert({
      runner_id: runnerId,
      runner_name: runnerName,
      first_lat: lat,
      first_lng: lng,
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function joinSession(
  userId: string,
  sessionId: string
): Promise<UserSession> {
  const supabase = createSupabaseClient();

  const { data: existing } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) return existing as UserSession;

  const { data, error } = await supabase
    .from("user_sessions")
    .insert({ user_id: userId, session_id: sessionId })
    .select()
    .single();

  if (error) throw error;
  return data as UserSession;
}

export async function getLobbyPlayers(sessionId: string): Promise<LobbyPlayer[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("user_sessions")
    .select(
      `
      user_id,
      tofu_type,
      joined_at,
      users!inner (
        runner_id,
        runner_name
      )
    `
    )
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const user = row.users as unknown as {
      runner_id: string;
      runner_name: string;
    };
    return {
      user_id: row.user_id as string,
      runner_id: user.runner_id,
      runner_name: user.runner_name,
      tofu_type: row.tofu_type as string | null,
      joined_at: row.joined_at as string,
    };
  });
}

export async function getTakenTofuTypes(sessionId: string): Promise<string[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select("tofu_type")
    .eq("session_id", sessionId)
    .not("tofu_type", "is", null);

  if (error) throw error;
  return (data ?? [])
    .map((r) => r.tofu_type as string)
    .filter(Boolean);
}

export async function assignTofu(
  userSessionId: string,
  tofuType: string
): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("user_sessions")
    .update({ tofu_type: tofuType })
    .eq("id", userSessionId);

  if (error) throw error;
}

export async function completeSession(userSessionId: string): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("user_sessions")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", userSessionId);

  if (error) throw error;
}

export async function recordToken(
  userId: string,
  tokenType: string,
  lat: number | null,
  lng: number | null
): Promise<Token> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("tokens")
    .insert({
      user_id: userId,
      token_type: tokenType,
      lat,
      lng,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Token;
}

export async function getUserSessionForToday(
  userId: string,
  sessionId: string
): Promise<UserSession | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) throw error;
  return data as UserSession | null;
}

export async function getPassportData(userId: string): Promise<{
  user: User;
  runs: PassportRun[];
}> {
  const supabase = createSupabaseClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  const { data: sessions, error: sessionsError } = await supabase
    .from("user_sessions")
    .select(
      `
      tofu_type,
      completed_at,
      joined_at,
      sessions!inner (date)
    `
    )
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (sessionsError) throw sessionsError;

  const { data: tokens, error: tokensError } = await supabase
    .from("tokens")
    .select("*")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: true });

  if (tokensError) throw tokensError;

  const allTokens = (tokens ?? []) as Token[];

  const runs: PassportRun[] = (sessions ?? []).map((s) => {
    const session = s.sessions as unknown as { date: string };
    const joinedAt = s.joined_at as string;
    const completedAt = s.completed_at as string | null;

    const runTokens = allTokens.filter((t) => {
      const scanned = new Date(t.scanned_at).getTime();
      const start = new Date(joinedAt).getTime();
      const end = completedAt
        ? new Date(completedAt).getTime()
        : scanned + 86400000;
      return scanned >= start && scanned <= end;
    });

    return {
      session_date: session.date,
      tofu_type: s.tofu_type as string | null,
      completed_at: completedAt,
      joined_at: joinedAt,
      tokens: runTokens,
    };
  });

  return { user: user as User, runs };
}

export async function findUserSessionRow(
  sessionId: string,
  userId: string
): Promise<UserSession & { runner_name: string; runner_id: string } | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select(
      `
      *,
      users!inner (runner_id, runner_name)
    `
    )
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const user = data.users as unknown as {
    runner_id: string;
    runner_name: string;
  };

  return {
    ...(data as UserSession),
    runner_id: user.runner_id,
    runner_name: user.runner_name,
  };
}

export async function getAdminLobbyRows(sessionId: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select(
      `
      id,
      user_id,
      tofu_type,
      completed_at,
      joined_at,
      users!inner (runner_id, runner_name)
    `
    )
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const user = row.users as unknown as {
      runner_id: string;
      runner_name: string;
    };
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      runner_id: user.runner_id,
      runner_name: user.runner_name,
      tofu_type: row.tofu_type as string | null,
      completed_at: row.completed_at as string | null,
      joined_at: row.joined_at as string,
    };
  });
}
