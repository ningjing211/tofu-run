-- 替既有報名紀錄補上 runner_name（依 runner_id 對 users 名額池）
update going_signups g
set runner_name = u.runner_name
from users u
where g.runner_id = u.runner_id
  and g.runner_name is null;
