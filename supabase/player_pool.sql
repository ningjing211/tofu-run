-- 300 名額玩家池：欄位與領取函式
-- 在 seed_players_300.sql 之前執行

alter table users add column if not exists slot_no int unique;
alter table users add column if not exists claimed_at timestamptz;

create index if not exists idx_users_pool_unclaimed
  on users (slot_no)
  where claimed_at is null and slot_no is not null;

-- 現場掃碼時原子領取下一個未使用名額（依 slot_no 順序）
create or replace function claim_next_pool_user(
  p_lat double precision default null,
  p_lng double precision default null
)
returns setof users
language plpgsql
as $$
declare
  picked uuid;
begin
  select id into picked
  from users
  where slot_no is not null
    and claimed_at is null
  order by slot_no
  limit 1
  for update skip locked;

  if picked is null then
    return;
  end if;

  return query
  update users
  set
    claimed_at = now(),
    first_lat = p_lat,
    first_lng = p_lng
  where id = picked
  returning *;
end;
$$;

grant execute on function claim_next_pool_user(double precision, double precision) to anon;
grant execute on function claim_next_pool_user(double precision, double precision) to authenticated;
