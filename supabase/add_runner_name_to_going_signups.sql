-- 報名表新增名額池原名 runner_name（顯示在 nickname 左側對照用）
alter table going_signups add column if not exists runner_name text;

-- 既有資料補填（可選）
update going_signups g
set runner_name = u.runner_name
from users u
where g.runner_id = u.runner_id
  and g.runner_name is null;
