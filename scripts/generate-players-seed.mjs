/**
 * 從 CSV 產生 Supabase seed SQL
 * 執行：node scripts/generate-players-seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, "../tofu_run_players_300_with_index.csv");
const outPath = path.join(__dirname, "../supabase/seed_players_300.sql");

function escapeSql(s) {
  return s.replace(/'/g, "''");
}

const raw = fs.readFileSync(csvPath, "utf-8");
const lines = raw.trim().split("\n").slice(1);

const values = lines.map((line) => {
  const [no, runnerId, runnerName] = line.split(",");
  const slot = parseInt(no, 10);
  if (!slot || !runnerId || !runnerName) {
    throw new Error(`Invalid line: ${line}`);
  }
  return `  (${slot}, '${escapeSql(runnerId.trim())}', '${escapeSql(runnerName.trim())}')`;
});

const sql = `-- 豆花慢跑：300 名預先建立玩家名額
-- 產生自 tofu_run_players_300_with_index.csv
-- 在 Supabase SQL Editor 執行（建議先執行 player_pool.sql）

-- 若需重新匯入，先清除名額池（勿在已有活動資料時執行）
-- delete from users where slot_no is not null;

insert into users (slot_no, runner_id, runner_name, claimed_at)
values
${values.join(",\n")}
on conflict (runner_id) do update set
  slot_no = excluded.slot_no,
  runner_name = excluded.runner_name;

-- 驗證
-- select count(*) as pool_total from users where slot_no is not null;
-- select count(*) as unclaimed from users where slot_no is not null and claimed_at is null;
`;

fs.writeFileSync(outPath, sql);
console.log(`Wrote ${lines.length} players to ${outPath}`);
