// Run with the old deployment stopped. Passwords only exist in process memory.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { hashPassword, isPasswordHash, validPassword } from '../functions/_lib/password.js';

const args = process.argv.slice(2);
const remote = args.includes('--remote');
const local = args.includes('--local');
if (remote === local) throw new Error('必须显式选择 --local 或 --remote');
const database = args.find((arg) => arg.startsWith('--database='))?.split('=')[1] || 'qnyzhuayu-db';
const extra = args.filter((arg) => arg.startsWith('--config=') || arg.startsWith('--persist-to='));
const wrangler = resolve('node_modules/wrangler/bin/wrangler.js');
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const directory = mkdtempSync(join(tmpdir(), 'huayu-auth-'));
function execute(sql) {
  const file = join(directory, 'migration.sql');
  writeFileSync(file, sql, { mode: 0o600 });
  const result = spawnSync(process.execPath, [wrangler, 'd1', 'execute', database,
    remote ? '--remote' : '--local', '--file', file, '--json', ...extra], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  // Do not print SQL or Wrangler diagnostics: legacy SELECT output contains secrets.
  if (result.status !== 0) throw new Error('D1 操作失败；请检查绑定、权限、迁移前置条件与重复昵称。未输出数据库内容。');
  // Wrangler may print progress bars to stdout before the JSON payload.
  // Keep diagnostics out of logs because legacy SELECT results contain secrets.
  const start = result.stdout.indexOf('[');
  const end = result.stdout.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('D1 操作返回格式异常；未输出数据库内容。');
  return JSON.parse(result.stdout.slice(start, end + 1));
}
function executeCommand(sql) {
  const result = spawnSync(process.execPath, [wrangler, 'd1', 'execute', database,
    remote ? '--remote' : '--local', '--command', sql, '--json', ...extra], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error('D1 操作失败；请检查绑定、权限、迁移前置条件与重复昵称。未输出数据库内容。');
  const start = result.stdout.indexOf('[');
  const end = result.stdout.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('D1 操作返回格式异常；未输出数据库内容。');
  return JSON.parse(result.stdout.slice(start, end + 1));
}
try {
  let columns = executeCommand('PRAGMA table_info(site_users);')[0].results;
  const authMigration = readFileSync(new URL('../migrations/2026-09-09-secure-auth.sql', import.meta.url), 'utf8');
  if (!columns.length) {
    execute(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
    columns = executeCommand('PRAGMA table_info(site_users);')[0].results;
    console.log('已初始化空数据库的完整表结构。');
  }
  if (!columns.some((column) => ['password', 'password_hash'].includes(column.name))) {
    throw new Error('site_users 表结构不受支持，尚未执行升级');
  }
  // SQLite ADD COLUMN is not idempotent. Older deployments may already have
  // added email at runtime without having completed the SQL migration.
  const emailMigration = readFileSync(new URL('../migrations/2026-09-08-email-verification.sql', import.meta.url), 'utf8');
  const emailTables = emailMigration.slice(emailMigration.indexOf('CREATE UNIQUE INDEX'));
  execute(columns.some((column) => column.name === 'email') ? emailTables : emailMigration);
  const legacy = columns.some((column) => column.name === 'password');
  if (!legacy) execute(authMigration.slice(authMigration.indexOf('CREATE TABLE')));
  if (args.includes('--admin')) {
    if (legacy) throw new Error('请先完成旧账号迁移');
    // Read via stdin, never command arguments, environment variables or shell history.
    if (process.stdin.isTTY) throw new Error('请通过安全的标准输入提供管理员新密码');
    let password = '';
    for await (const chunk of process.stdin) password += chunk;
    password = password.replace(/\r?\n$/, '');
    if (!validPassword(password)) throw new Error('管理员密码必须为 12 至 128 位');
    const hash = await hashPassword(password);
    const now = new Date().toISOString();
    execute(`INSERT INTO site_users (id, account_no, username, password_hash, role, profile_name,
      club_role, first_used_at, last_used_at, created_at)
      VALUES (${quote('user-' + crypto.randomUUID())}, '0000', '社团秘书', ${quote(hash)}, 'admin',
      '社团秘书', '管理员 / 社团秘书', ${quote(now)}, ${quote(now)}, ${quote(now)})
      ON CONFLICT(account_no) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin';
      DELETE FROM auth_sessions WHERE user_id IN (SELECT id FROM site_users WHERE account_no = '0000');`);
    console.log('管理员 0000 已配置，原会话已撤销。');
  } else if (legacy) {
    const rows = executeCommand('SELECT id, password FROM site_users;')[0].results;
    // Check first so duplicate legacy names never result in a half-completed migration.
    const duplicates = executeCommand('SELECT COUNT(*) AS n FROM (SELECT username FROM site_users GROUP BY username HAVING COUNT(*) > 1);')[0].results[0].n;
    if (duplicates) throw new Error('存在重复昵称，请先在维护窗口处理后重试；尚未修改密码');
    for (const row of rows) {
      // The historically published default password is disabled, never preserved.
      const hash = isPasswordHash(row.password) || row.password === '!' ? row.password :
        (!row.password || row.password === 'huayu2026' ? '!' : await hashPassword(row.password));
      execute(`UPDATE site_users SET password = ${quote(hash)} WHERE id = ${quote(row.id)};`);
    }
    execute(authMigration);
    console.log(`已迁移 ${rows.length} 个账号；编号、角色和资料保持不变。公开默认密码已停用。`);
  } else {
    console.log('已使用 password_hash，无需重复迁移。');
  }
} finally {
  // Only remove the exact temporary directory created above.
  rmSync(directory, { recursive: true, force: true });
}
