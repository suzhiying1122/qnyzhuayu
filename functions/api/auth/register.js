import { hashPassword, passwordValue, validPassword } from "../../_lib/password.js";
import { loginResponse, rateLimit } from "../../_lib/session.js";
import { ensureUserTables, error, readJson, textValue } from "../../_lib/api.js";
import { isValidEmail, normalizeEmail, verifyEmailCode } from "../../_lib/email-verification.js";

function nextAccountNo(rows) {
  const used = new Set(rows.map((row) => String(row.account_no)));
  let next = 1;
  while (used.has(String(next).padStart(4, "0"))) next += 1;
  return String(next).padStart(4, "0");
}

export async function onRequestPost({ request, env }) {
  await ensureUserTables(env);
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const username = textValue(payload, "username");
  const password = passwordValue(payload);
  const email = normalizeEmail(textValue(payload, "email"));
  const code = textValue(payload, "code");
  if (!username || !password) return error("昵称和密码不能为空");
  if (username.length > 18) return error("昵称不能超过 18 个字符");
  if (!validPassword(password)) return error("密码长度应为 12 至 128 位");
  if (!isValidEmail(email)) return error("请输入有效的邮箱地址");
  if (!/^\d{6}$/.test(code)) return error("请输入邮件中的 6 位验证码");

  const duplicateName = await env.DB.prepare("SELECT id FROM site_users WHERE username = ?").bind(username).first();
  if (duplicateName) return error("这个昵称已经被注册");
  const duplicateEmail = await env.DB.prepare("SELECT id FROM site_users WHERE email = ?").bind(email).first();
  if (duplicateEmail) return error("这个邮箱已经注册过账号");

  await rateLimit(env, `register:email:${email}`, 10);
  const verification = await verifyEmailCode(env, email, code);
  if (!verification.ok) return error(verification.message);

  const passwordHash = await hashPassword(password);
  const rows = await env.DB.prepare("SELECT account_no FROM site_users").all();
  const accountNo = nextAccountNo(rows.results);
  const now = new Date().toISOString();
  const id = `user-${crypto.randomUUID()}`;

  const insertUser = env.DB.prepare(`
    INSERT INTO site_users (
      id, account_no, username, password_hash, role, profile_name, avatar_data, intro,
      club_role, phone, email, first_used_at, last_used_at, created_at, friends,
      friend_requests, chats
    )
    SELECT ?, ?, ?, ?, 'member', ?, '', '', '社员', '', ?, ?, ?, ?, '[]', '[]', '{}'
    WHERE EXISTS (SELECT 1 FROM email_verification_codes WHERE email = ? AND code_hash = ? AND expires_at > ?)
  `).bind(id, accountNo, username, passwordHash, username, email, now, now, now, email, verification.codeHash, Date.now());

  try {
    await env.DB.batch([
      insertUser,
      env.DB.prepare("DELETE FROM email_verification_codes WHERE email = ? AND code_hash = ?").bind(email, verification.codeHash),
    ]);
  } catch (err) {
    if (String(err.message).includes("UNIQUE constraint")) return error("昵称、邮箱或编号已被占用，请重试", 409);
    throw err;
  }

  const row = await env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(id).first();
  if (!row) return error("验证码已使用或过期，请重新发送", 409);
  return loginResponse(request, env, row, 201);
}
