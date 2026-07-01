import { ensureUserTables, error, json, readJson, serializeUser, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  await ensureUserTables(env);
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const accountNo = textValue(payload, "accountNo", "account_no", "username");
  const password = textValue(payload, "password");
  if (!accountNo || !password) return error("请输入编号和密码");

  const row = await env.DB.prepare("SELECT * FROM site_users WHERE account_no = ?").bind(accountNo).first();
  if (!row || row.password !== password) return error("编号或密码不正确", 401);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE site_users SET last_used_at = ? WHERE id = ?").bind(now, row.id).run();
  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(row.id).first();
  return json({ user: serializeUser(updated, { includePassword: true }) });
}
