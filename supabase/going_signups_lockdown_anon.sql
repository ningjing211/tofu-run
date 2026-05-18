-- 關閉 going_signups 的 anon 讀寫（僅允許伺服器 service role 經 API 存取）
-- 執行前請在 .env.local / Vercel 設定 SUPABASE_SERVICE_ROLE_KEY（勿加 NEXT_PUBLIC_）

drop policy if exists "anon_select_going" on going_signups;
drop policy if exists "anon_insert_going" on going_signups;
drop policy if exists "anon_insert_interest" on going_signups;

-- RLS 仍啟用；無 anon 政策時，瀏覽器用 anon key 無法 select/insert going_signups
