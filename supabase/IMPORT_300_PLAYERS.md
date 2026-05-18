# 匯入 300 名玩家名額

資料來源：`tofu_run_players_300_with_index.csv`（001–300，含 Runner ID 與 Runner Name）

## 步驟

### 1. 擴充資料表（只需一次）

在 Supabase **SQL Editor** 執行：

```
supabase/player_pool.sql
```

會新增：

- `users.slot_no` — 名額編號 1–300
- `users.claimed_at` — 現場掃碼領取時間（`null` = 尚未使用）
- `claim_next_pool_user()` — 現場加入時自動領取下一個空名額

### 2. 匯入 300 筆玩家

執行：

```
supabase/seed_players_300.sql
```

（若 CSV 有更新，在本機執行 `node scripts/generate-players-seed.mjs` 重新產生此檔）

### 3. 驗證

```sql
select count(*) as total from users where slot_no is not null;
-- 應為 300

select count(*) as unclaimed from users where slot_no is not null and claimed_at is null;
-- 應為 300（匯入後、活動前）

select slot_no, runner_id, runner_name from users where slot_no is not null order by slot_no limit 5;
```

## 現場流程

1. 玩家掃 `/join` QR
2. API 呼叫 `claim_next_pool_user`，依 `slot_no` 順序領取一筆
3. 寫入 `claimed_at` 與 GPS，並加入今日 `session`
4. 名額滿 300 人後回傳「今日 300 名額已滿」

## 注意

- **不要**在已有活動資料時重跑 seed（會 `on conflict` 更新名稱，但不會重置 `claimed_at`）
- 若要重置名額池測試：

```sql
update users set claimed_at = null, first_lat = null, first_lng = null
where slot_no is not null;
```

- 舊的「隨機生成 ID」加入流程已改為**只從名額池領取**
