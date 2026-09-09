import { passwordValue, verifyPassword } from "../../_lib/password.js";
import { loginResponse, rateLimit } from "../../_lib/session.js";
import { ensureUserTables, error, readJson, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  await ensureUserTables(env);
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const accountNo = textValue(payload, "accountNo", "account_no", "username");
  const password = passwordValue(payload);
  if (!accountNo || !password) return error("请输入编号和密码");

  if (password.length > 128 || accountNo.length > 32) return error("编号或密码不正确", 401);
  await rateLimit(env, `login:account:${accountNo}`, 10);
  const row = await env.DB.prepare("SELECT * FROM site_users WHERE account_no = ?").bind(accountNo).first();
  if (!(await verifyPassword(password, row?.password_hash))) return error("编号或密码不正确", 401);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE site_users SET last_used_at = ? WHERE id = ?").bind(now, row.id).run();
  const updated = { ...row, last_used_at: now };
  return loginResponse(request, env, updated);
}
