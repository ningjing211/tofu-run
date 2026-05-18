-- 統一配料 id：redbean、mungbean、peanut（取代 red_bean、green_bean、peanuts）

update going_signups set topping1 = 'redbean' where topping1 = 'red_bean';
update going_signups set topping2 = 'redbean' where topping2 = 'red_bean';
update going_signups set topping3 = 'redbean' where topping3 = 'red_bean';

update going_signups set topping1 = 'mungbean' where topping1 in ('green_bean', 'mung_bean');
update going_signups set topping2 = 'mungbean' where topping2 in ('green_bean', 'mung_bean');
update going_signups set topping3 = 'mungbean' where topping3 in ('green_bean', 'mung_bean');

update going_signups set topping1 = 'peanut' where topping1 = 'peanuts';
update going_signups set topping2 = 'peanut' where topping2 = 'peanuts';
update going_signups set topping3 = 'peanut' where topping3 = 'peanuts';

-- preferred_toppings 陣列（若曾寫入舊 id）
update going_signups
set preferred_toppings = array(
  select case v
    when 'red_bean' then 'redbean'
    when 'green_bean' then 'mungbean'
    when 'mung_bean' then 'mungbean'
    when 'peanuts' then 'peanut'
    else v
  end
  from unnest(preferred_toppings) as v
)
where preferred_toppings && array['red_bean', 'green_bean', 'mung_bean', 'peanuts']::text[];
