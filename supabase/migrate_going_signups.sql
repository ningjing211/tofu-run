-- going_signups 欄位補齊（新專案或已改名後執行）
-- topping1～3 儲存值：redbean、mungbean、peanut、tapioca、taro

alter table going_signups add column if not exists email text;
alter table going_signups add column if not exists line_id text;
alter table going_signups add column if not exists runner_id text;
alter table going_signups add column if not exists runner_name text;
alter table going_signups add column if not exists custom_name text;
alter table going_signups alter column nickname drop not null;
alter table going_signups add column if not exists topping1 text;
alter table going_signups add column if not exists topping2 text;
alter table going_signups add column if not exists topping3 text;
alter table going_signups add column if not exists goal text;
alter table going_signups add column if not exists preferred_toppings text[] default '{}';
alter table going_signups add column if not exists douhua_goal text;
