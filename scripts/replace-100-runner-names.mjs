/**
 * 從新 CSV 隨機挑 100 個 runner_name，替換舊 CSV 中隨機 100 筆（保留 slot_no、runner_id）
 * 執行：node scripts/replace-100-runner-names.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const OLD_CSV = path.join(root, "tofu_run_players_300_with_index.csv");
const NEW_CSV = path.join(
  root,
  "new-tofu_run_players_300_music_version.csv"
);
const MANIFEST = path.join(root, "supabase/replace_100_names_manifest.json");
const PATCH_SQL = path.join(root, "supabase/update_100_runner_names.sql");

function parseCsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n").slice(1);
  return lines.map((line) => {
    const [no, runnerId, runnerName] = line.split(",");
    return {
      no: no.trim(),
      runnerId: runnerId.trim(),
      runnerName: runnerName.trim(),
    };
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeSql(s) {
  return s.replace(/'/g, "''");
}

function toCsvRow({ no, runnerId, runnerName }) {
  return `${no},${runnerId},${runnerName}`;
}

const oldPlayers = parseCsv(OLD_CSV);
const newPlayers = parseCsv(NEW_CSV);

if (oldPlayers.length !== 300 || newPlayers.length !== 300) {
  throw new Error(
    `Expected 300 rows each, got old=${oldPlayers.length} new=${newPlayers.length}`
  );
}

const replaceSlotIndices = shuffle(
  oldPlayers.map((_, i) => i)
).slice(0, 100);
const newNameIndices = shuffle(newPlayers.map((_, i) => i)).slice(0, 100);

const changes = replaceSlotIndices.map((oldIdx, i) => {
  const oldRow = oldPlayers[oldIdx];
  const newName = newPlayers[newNameIndices[i]].runnerName;
  return {
    slot_no: parseInt(oldRow.no, 10),
    runner_id: oldRow.runnerId,
    old_runner_name: oldRow.runnerName,
    new_runner_name: newName,
    new_source_no: newPlayers[newNameIndices[i]].no,
  };
});

for (const c of changes) {
  const row = oldPlayers.find((p) => parseInt(p.no, 10) === c.slot_no);
  row.runnerName = c.new_runner_name;
}

const header = "No,Runner ID,Runner Name\n";
const csvBody = oldPlayers.map(toCsvRow).join("\n") + "\n";
fs.writeFileSync(OLD_CSV, header + csvBody);

const manifest = {
  generated_at: new Date().toISOString(),
  description:
    "100 random slots from tofu_run_players_300_with_index.csv received runner_name from new-tofu_run_players_300_music_version.csv (runner_id unchanged)",
  changes,
};
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

const updateLines = changes.map(
  (c) =>
    `update users set runner_name = '${escapeSql(c.new_runner_name)}' where runner_id = '${escapeSql(c.runner_id)}';`
);

const patchSql = `-- 豆花慢跑：隨機替換 100 筆 runner_name（保留 runner_id / slot_no）
-- 產生時間：${manifest.generated_at}
-- 明細：supabase/replace_100_names_manifest.json
-- 在 Supabase SQL Editor 執行

${updateLines.join("\n")}

-- 驗證（應為 100）
-- select count(*) from users u
-- join (values
-- ${changes.map((c) => `  ('${escapeSql(c.runner_id)}','${escapeSql(c.new_runner_name)}')`).join(",\n")}
-- ) as t(runner_id, runner_name) on u.runner_id = t.runner_id and u.runner_name = t.runner_name;
`;

fs.writeFileSync(PATCH_SQL, patchSql);

execSync("node scripts/generate-players-seed.mjs", { cwd: root, stdio: "inherit" });

console.log(`Updated ${OLD_CSV} (100 names replaced)`);
console.log(`Wrote manifest: ${MANIFEST}`);
console.log(`Wrote patch SQL: ${PATCH_SQL}`);
console.log(`Regenerated supabase/seed_players_300.sql`);
console.log("\nSample replacements:");
for (const c of changes.slice(0, 5)) {
  console.log(
    `  #${c.slot_no} ${c.runner_id}: ${c.old_runner_name} → ${c.new_runner_name}`
  );
}
