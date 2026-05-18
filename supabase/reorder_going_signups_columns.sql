-- 調整 going_signups 欄位順序（runner_name 在 runner_id 與 custom_name 之間）
-- PostgreSQL 無法單獨移動欄位，故重建表並保留資料。
-- 在 Supabase SQL Editor 執行一次即可。

begin;

create table going_signups_ordered (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  runner_id text,
  runner_name text,
  custom_name text,
  nickname text,
  line_id text,
  intent text not null check (intent in ('join', 'interested')),
  topping1 text,
  topping2 text,
  topping3 text,
  goal text,
  preferred_toppings text[] default '{}',
  douhua_goal text,
  created_at timestamptz not null default now()
);

insert into going_signups_ordered (
  id,
  email,
  runner_id,
  runner_name,
  custom_name,
  nickname,
  line_id,
  intent,
  topping1,
  topping2,
  topping3,
  goal,
  preferred_toppings,
  douhua_goal,
  created_at
)
select
  id,
  email,
  runner_id,
  runner_name,
  custom_name,
  nickname,
  line_id,
  intent,
  topping1,
  topping2,
  topping3,
  goal,
  coalesce(preferred_toppings, '{}'::text[]),
  douhua_goal,
  created_at
from going_signups;

drop policy if exists "anon_insert_going" on going_signups;
drop policy if exists "anon_insert_interest" on going_signups;

drop table going_signups;

alter table going_signups_ordered rename to going_signups;

create index if not exists idx_going_signups_created on going_signups (created_at desc);

alter table going_signups enable row level security;

create policy "anon_insert_going" on going_signups
  for insert to anon
  with check (true);

commit;
