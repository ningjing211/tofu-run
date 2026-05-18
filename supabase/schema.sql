-- 豆花慢跑 MVP schema
-- 在 Supabase SQL Editor 執行此檔案

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  runner_id text unique not null,
  runner_name text not null,
  first_lat double precision,
  first_lng double precision,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  started_at timestamptz not null default now()
);

create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  tofu_type text,
  completed_at timestamptz,
  joined_at timestamptz not null default now(),
  unique (user_id, session_id)
);

create table if not exists tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_type text not null,
  lat double precision,
  lng double precision,
  scanned_at timestamptz not null default now()
);

create index if not exists idx_user_sessions_session on user_sessions(session_id);
create index if not exists idx_tokens_user on tokens(user_id);
create index if not exists idx_tokens_user_type on tokens(user_id, token_type);

-- 首頁「想參加 / 有興趣」預先登記
create table if not exists interest_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nickname text not null,
  line_id text,
  intent text not null check (intent in ('join', 'interested')),
  created_at timestamptz not null default now()
);

-- 若表已建立，可單獨執行：
-- alter table interest_signups add column if not exists line_id text;

create index if not exists idx_interest_signups_created on interest_signups(created_at desc);

alter table users enable row level security;
alter table sessions enable row level security;
alter table user_sessions enable row level security;
alter table tokens enable row level security;
alter table interest_signups enable row level security;

-- MVP：允許 anon 讀寫（活動用，正式環境請收緊）
create policy "anon_all_users" on users for all to anon using (true) with check (true);
create policy "anon_all_sessions" on sessions for all to anon using (true) with check (true);
create policy "anon_all_user_sessions" on user_sessions for all to anon using (true) with check (true);
create policy "anon_all_tokens" on tokens for all to anon using (true) with check (true);
create policy "anon_insert_interest" on interest_signups for insert to anon with check (true);
