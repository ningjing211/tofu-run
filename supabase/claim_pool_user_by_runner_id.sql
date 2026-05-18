-- 已「想參加」者現場加入：依 runner_id 領取對應名額（非隨機下一個）
-- 在 player_pool.sql 之後執行

create or replace function claim_pool_user_by_runner_id(
  p_runner_id text,
  p_lat double precision default null,
  p_lng double precision default null
)
returns setof users
language plpgsql
as $$
begin
  return query
  update users
  set
    claimed_at = coalesce(claimed_at, now()),
    first_lat = coalesce(first_lat, p_lat),
    first_lng = coalesce(first_lng, p_lng)
  where runner_id = p_runner_id
    and slot_no is not null
  returning *;
end;
$$;

grant execute on function claim_pool_user_by_runner_id(text, double precision, double precision) to anon;
grant execute on function claim_pool_user_by_runner_id(text, double precision, double precision) to authenticated;
