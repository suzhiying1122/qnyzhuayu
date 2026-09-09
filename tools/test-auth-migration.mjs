import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { verifyPassword } from '../functions/_lib/password.js';

const root = mkdtempSync(join(tmpdir(), 'huayu-migration-test-'));
const fullSchema = readFileSync('schema.sql', 'utf8').replaceAll('\r\n', '\n');
const legacy = fullSchema.split('CREATE TABLE IF NOT EXISTS auth_sessions')[0]
  .replace('password_hash TEXT', 'password TEXT');
const beforeEmail = legacy.split('CREATE TABLE IF NOT EXISTS email_verification_codes')[0]
  .replace("  email TEXT DEFAULT '',\n", '')
  .replace(/^CREATE UNIQUE INDEX IF NOT EXISTS idx_site_users_email.*$/m, '');
const modes = ['pre-email', 'partial-email', 'verified-email', 'fresh-schema', 'empty'];
const fingerprints = [];
function run(script, args, input) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', input });
  assert.equal(result.status, 0, 'isolated local migration command failed: ' + result.stderr);
  return result.stdout;
}
try {
  for (const mode of modes) {
    console.log(`Testing isolated D1 path: ${mode}`);
    const extra = ['--local', '--config=wrangler.local.jsonc', `--persist-to=${join(root, mode)}`];
    function sql(text) {
      const file = join(root, 'fixture.sql'); writeFileSync(file, text);
      return JSON.parse(run('node_modules/wrangler/bin/wrangler.js', ['d1', 'execute', 'qnyzhuayu-local', ...extra, '--json', '--file', file]));
    }
    const old = !['fresh-schema', 'empty'].includes(mode);
    if (mode !== 'empty') {
      let schema = mode === 'fresh-schema' ? fullSchema : mode === 'verified-email' ? legacy : beforeEmail;
      if (mode === 'partial-email') schema += "ALTER TABLE site_users ADD COLUMN email TEXT DEFAULT '';";
      sql(schema);
    }
    if (old) sql(`INSERT INTO site_users (id,account_no,username,password,role,profile_name,first_used_at,last_used_at,created_at)
      VALUES ('old','0042','旧社员','old-short','member','原有昵称','first','last','created'),
      ('admin','0000','社团秘书','huayu2026','admin','社团秘书','first','last','created');`);
    const args = [...extra, '--database=qnyzhuayu-local'];
    run('tools/migrate-auth.mjs', args);
    if (old) {
      const rows = sql('SELECT * FROM site_users ORDER BY account_no;')[0].results;
      assert.equal(rows[0].password_hash, '!');
      assert.equal(rows[0].role, 'admin');
      assert.equal(rows[1].account_no, '0042');
      assert.equal(rows[1].profile_name, '原有昵称');
      assert.equal(rows[1].first_used_at, 'first');
      assert.ok(await verifyPassword('old-short', rows[1].password_hash));
      assert.ok(!('password' in rows[1]));
      assert.equal(rows[1].email, '');
    }
    // Re-running must not repeat ALTER COLUMN or re-hash a stored hash.
    const before = sql('SELECT id,password_hash FROM site_users ORDER BY id;')[0].results;
    run('tools/migrate-auth.mjs', args);
    assert.deepEqual(sql('SELECT id,password_hash FROM site_users ORDER BY id;')[0].results, before);
    const objects = sql("SELECT type,name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name;")[0].results;
    const columns = sql('PRAGMA table_info(site_users);')[0].results
      .map(({cid, ...column}) => column).sort((a,b) => a.name.localeCompare(b.name));
    fingerprints.push({ objects, columns });
    if (mode === 'verified-email' || mode === 'empty') {
      run('tools/migrate-auth.mjs', [...args, '--admin'], 'admin newly secured password\n');
      const row = sql("SELECT * FROM site_users WHERE account_no = '0000';")[0].results[0];
      assert.equal(row.role, 'admin');
      if (old) assert.equal(row.id, 'admin');
      assert.ok(await verifyPassword('admin newly secured password', row.password_hash));
    }
    console.log(`PASS: ${mode}: upgrade, stable accounts, repeat execution and schema fingerprint.`);
  }
  for (const fingerprint of fingerprints) assert.deepEqual(fingerprint, fingerprints[0]);
  console.log('PASS: all 5 fresh/legacy/partial upgrade paths converge to the same tables, indexes and user columns.');
} finally {
  // Only the fresh temporary test directory is removed; no repository/local D1 data.
  rmSync(resolve(root), { recursive: true, force: true });
}
