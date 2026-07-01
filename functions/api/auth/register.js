import { ensureUserTables, error, json, readJson, serializeUser, textValue } from "../../_lib/api.js";

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
  const password = textValue(payload, "password");
  const phone = textValue(payload, "phone");
  if (!username || !password) return error("昵称和密码不能为空");
  if (!/^1\d{10}$/.test(phone)) return error("请输入 11 位手机号");

  const duplicateName = await env.DB.prepare("SELECT id FROM site_users WHERE username = ?").bind(username).first();
  if (duplicateName) return error("这个昵称已经被注册");
  const duplicatePhone = await env.DB.prepare("SELECT id FROM site_users WHERE phone = ?").bind(phone).first();
  if (duplicatePhone) return error("这个手机号已经注册过账号");

  const rows = await env.DB.prepare("SELECT account_no FROM site_users").all();
  const accountNo = nextAccountNo(rows.results);
  const now = new Date().toISOString();
  const id = `user-${crypto.randomUUID()}`;

  await env.DB.prepare(`
    INSERT INTO site_users (
      id, account_no, username, password, role, profile_name, avatar_data, intro,
      club_role, phone, first_used_at, last_used_at, created_at, friends,
      friend_requests, chats
    )
    VALUES (?, ?, ?, ?, 'member', ?, '', '', '社员', ?, ?, ?, ?, '[]', '[]', '{}')
  `).bind(id, accountNo, username, password, username, phone, now, now, now).run();

  const row = await env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(id).first();
  return json({ user: serializeUser(row, { includePassword: true }) }, 201);
}
