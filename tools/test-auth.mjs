import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { hashPassword, verifyPassword } from '../functions/_lib/password.js';
import { digest } from '../functions/_lib/session.js';

const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: 'output/auth-functions-build/index.js',
  compatibilityDate: '2026-06-01', d1Databases: { DB: 'auth-test' },
  bindings: { RESEND_API_KEY: 'test-email-key' },
  serviceBindings: { ASSETS: () => new Response('not found', { status: 404 }) },
}));
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
async function call(path, { body, cookie, origin = 'https://club.test', method, ip = '192.0.2.10' } = {}) {
  const response = await mf.dispatchFetch(`https://club.test/api/${path}`, {
    method: method || (body === undefined ? 'GET' : 'POST'),
    headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip,
      ...(cookie ? { Cookie: cookie } : {}) },
    ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  check(!/"password(?:_hash)?"\s*:/.test(text), `${path}: credential field leaked`);
  return { status: response.status, data: JSON.parse(text), cookie: response.headers.get('Set-Cookie')?.split(';')[0], headers: response.headers };
}
try {
  const db = await mf.getD1Database('DB');
  const schema = readFileSync('schema.sql', 'utf8');
  for (const statement of schema.split(';').filter((s) => s.trim())) await db.prepare(statement).run();
  const password = ' a secure password 测试 ';
  const hash = await hashPassword(password);
  check(hash !== await hashPassword(password), 'unique salt');
  check(await verifyPassword(password, hash), 'KDF accepts exact input');
  check(!await verifyPassword(password.trim(), hash), 'password must not be trimmed');
  await db.prepare(`INSERT INTO site_users (id, account_no, username, password_hash, role, profile_name,
    first_used_at,last_used_at,created_at) VALUES ('admin','0000','社团秘书',?,'admin','社团秘书','now','now','now')`).bind(hash).run();
  check((await call('auth/me')).data.user === null, 'anonymous identity');
  check((await call('users')).status === 401, 'directory requires session');
  check((await call('admin/posts/1', { method: 'DELETE' })).status === 401, 'anonymous admin denied');
  check((await call('auth/login', { body: '{' })).status === 400, 'invalid JSON');
  check((await call('auth/login', { body: { accountNo: '0000', password: 'a'.repeat(9000) } })).status === 400, 'oversized auth body');
  check((await call('auth/login', { body: { accountNo: '0000', password }, origin: 'https://evil.test' })).status === 403, 'login CSRF');
  check((await call('auth/login', { body: { accountNo: '0000', password: 'wrong' } })).status === 401, 'wrong password');
  let login = await call('auth/login', { body: { accountNo: '0000', password } });
  check(login.status === 200 && login.data.user.role === 'admin' && login.data.user.accountNo === '0000', 'admin preserved');
  const adminCookie = login.cookie;
  check(/HttpOnly/.test(login.headers.get('Set-Cookie')) && /Secure/.test(login.headers.get('Set-Cookie')) && /SameSite=Lax/.test(login.headers.get('Set-Cookie')), 'secure cookie flags');
  check((await call('auth/me', { cookie: adminCookie })).data.user.id === 'admin', 'restore session');
  check((await call('auth/me', { cookie: '__Host-huayu_session=' + 'a'.repeat(64) })).data.user === null, 'forged cookie');
  const stored = await db.prepare('SELECT * FROM auth_sessions').first();
  check(stored.token_hash !== adminCookie.split('=')[1], 'only token hash persisted');
  const oldAdmin = await call('auth/login', { cookie: adminCookie, body: { accountNo: '0000', password } });
  check(oldAdmin.cookie !== adminCookie, 'login rotates token');
  check((await call('auth/me', { cookie: adminCookie })).data.user === null, 'replaced token invalid');
  const email = 'member@example.test', code = '123456';
  await db.prepare(`INSERT INTO email_verification_codes (email,code_hash,expires_at,resend_after,window_started_at,created_at)
    VALUES (?,?,?,0,?,'now')`).bind(email, await digest(`test-email-key:${email}:${code}`), Date.now()+600000, Date.now()).run();
  check((await call('auth/register', { body: { username: 'member', email, code, password: 'short' } })).status === 400, 'weak password denied');
  check((await call('auth/register', { body: { username: 'member', email, code: '000000', password } })).status === 400, 'bad email code denied');
  const registration = await call('auth/register', { body: { username: 'member', email, code, password, role: 'admin', accountNo: '0000' } });
  check(registration.status === 201 && registration.data.user.accountNo === '0001' && registration.data.user.role === 'member', 'verified signup, assigned number and member role');
  let memberCookie = registration.cookie;
  check((await db.prepare('SELECT code_hash FROM email_verification_codes WHERE email = ?').bind(email).first()) === null, 'code consumed');
  check((await call('auth/register', { body: { username: 'repeat', email, code, password } })).status === 400, 'registration cannot reuse email/code');
  const member = await db.prepare("SELECT * FROM site_users WHERE account_no = '0001'").first();
  check(member.password_hash.startsWith('scrypt$') && await verifyPassword(password, member.password_hash), 'D1 stores strong hash');
  check((await call('admin/posts/1', { method: 'DELETE', cookie: memberCookie })).status === 403, 'member admin denied');
  const profile = await call('users/profile', { cookie: memberCookie, body: { userId: 'admin', profileName: '自己的资料', role: 'admin' } });
  check(profile.status === 200 && profile.data.user.id === member.id && profile.data.user.role === 'member', 'profile ignores forged identity');
  const directory = await call('users', { cookie: memberCookie });
  check(!('chats' in directory.data.users.find((u) => u.id === 'admin')), 'other users private data hidden');
  await db.prepare("INSERT INTO mail_letters (subject,body,visibility,author) VALUES ('private','private-content','private','member')").run();
  check((await call('site-state', { cookie: memberCookie })).data.letters.length === 0, 'private mail hidden from members');
  check((await call('site-state', { cookie: oldAdmin.cookie })).data.letters.length === 1, 'admin can review private mail');
  check((await call('users/friend-response', { cookie: memberCookie, body: { userId: member.id, fromUserId: 'admin', accepted: true } })).status === 409, 'cannot manufacture friend acceptance');
  check((await call('users/password', { cookie: memberCookie, body: { currentPassword: 'wrong', newPassword: 'another secure password' } })).status === 401, 'wrong current password');
  const otherSession = await call('auth/login', { body: { accountNo: '0001', password } });
  const changed = await call('users/password', { cookie: memberCookie, body: { userId: 'admin', currentPassword: password, newPassword: 'another secure password' } });
  check(changed.status === 200, 'change password');
  check((await call('auth/me', { cookie: otherSession.cookie })).data.user === null, 'all prior sessions revoked');
  memberCookie = changed.cookie;
  check((await call('auth/login', { body: { accountNo: '0001', password } })).status === 401, 'old password invalid');
  const logout = await call('auth/logout', { cookie: memberCookie, body: {} });
  check(logout.status === 200 && /Max-Age=0/.test(logout.headers.get('Set-Cookie')), 'logout clears cookie');
  check((await call('auth/me', { cookie: memberCookie })).data.user === null, 'logout revokes server token');
  await db.prepare('UPDATE auth_sessions SET expires_at = 0').run();
  check((await call('auth/me', { cookie: oldAdmin.cookie })).data.user === null, 'expired session denied');
  for (let n=0; n<11; n++) login = await call('auth/login', { body: { accountNo: 'missing', password: 'wrong' }, ip: '192.0.2.99' });
  check(login.status === 429, 'account rate limit');
  // Exercise a real D1 failure and prove that SQL/schema diagnostics stay server-side.
  await db.prepare('DROP TABLE auth_sessions').run();
  const unavailable = await call('auth/me', { cookie: oldAdmin.cookie });
  check(unavailable.status === 503 && !/SQL|auth_sessions|D1_ERROR/.test(unavailable.data.error), 'database error is sanitized');
  console.log(`PASS: ${checks} assertions against compiled Pages Functions and real local D1/workerd.`);
} finally { await mf.dispose(); }
