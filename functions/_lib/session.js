import { serializeUser } from './api.js';

export const COOKIE_NAME = '__Host-huayu_session';
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
export async function digest(value) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))),
    (b) => b.toString(16).padStart(2, '0')).join('');
}
export function sessionToken(request) {
  const token = request.headers.get('Cookie')?.split(';').map((v) => v.trim())
    .find((v) => v.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  return /^[a-f0-9]{64}$/.test(token || '') ? token : null;
}
export function sessionCookie(token, age = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
}
export async function getSessionUser(request, env) {
  const token = sessionToken(request);
  if (!token) return null;
  return env.DB.prepare(`SELECT u.* FROM auth_sessions s JOIN site_users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > ?`).bind(await digest(token), Date.now()).first();
}
export async function revokeSession(request, env) {
  const token = sessionToken(request);
  if (token) await env.DB.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').bind(await digest(token)).run();
}
export async function loginResponse(request, env, row, status = 200) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  await revokeSession(request, env);
  const result = await env.DB.batch([
    env.DB.prepare('DELETE FROM auth_sessions WHERE expires_at <= ?').bind(now),
    // A concurrent password change or account deletion must not mint a stale session.
    env.DB.prepare(`INSERT INTO auth_sessions (token_hash, user_id, expires_at)
      SELECT ?, id, ? FROM site_users WHERE id = ? AND password_hash = ?`)
      .bind(await digest(token), now + SESSION_SECONDS * 1000, row.id, row.password_hash),
  ]);
  if (!result[1].meta.changes) return Response.json({ error: '账号凭据已变更，请重新登录' }, {
    status: 401, headers: { 'Cache-Control': 'no-store', 'Set-Cookie': sessionCookie('', 0) },
  });
  return Response.json({ user: serializeUser(row) }, { status, headers: {
    'Cache-Control': 'no-store', 'Set-Cookie': sessionCookie(token),
  } });
}
export async function rateLimit(env, key, limit, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const keyHash = await digest(key);
  const row = await env.DB.prepare(`INSERT INTO auth_rate_limits (key_hash, expires_at, attempts)
    VALUES (?, ?, 1) ON CONFLICT(key_hash) DO UPDATE SET
    attempts = CASE WHEN expires_at <= ? THEN 1 ELSE attempts + 1 END,
    expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END
    RETURNING attempts`).bind(keyHash, now + windowMs, now, now).first();
  if (row.attempts > limit) throw Object.assign(new Error('尝试过于频繁，请稍后再试'), { status: 429 });
}
