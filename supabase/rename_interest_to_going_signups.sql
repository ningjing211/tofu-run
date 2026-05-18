-- 將 interest_signups 改名為 going_signups（保留既有資料）
-- 在 Supabase SQL Editor 執行一次即可

alter table if exists interest_signups rename to going_signups;

alter index if exists idx_interest_signups_created rename to idx_going_signups_created;

-- 政策名稱可選更新（舊政策仍會作用於改名後的表）
drop policy if exists "anon_insert_interest" on going_signups;
create policy "anon_insert_going" on going_signups
  for insert to anon with check (true);
