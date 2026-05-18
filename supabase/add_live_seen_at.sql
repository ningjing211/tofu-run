-- LIVE 房間：記錄最後出現在 /live 的時間（用於綠色在線標示）
alter table user_sessions
  add column if not exists live_seen_at timestamptz;

create index if not exists idx_user_sessions_live_seen
  on user_sessions (session_id, live_seen_at desc nulls last);
