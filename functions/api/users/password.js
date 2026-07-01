import { error, getUserById, json, readJson, serializeUser, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const userId = textValue(payload, "userId", "id");
  const currentPassword = textValue(payload, "currentPassword");
  const newPassword = textValue(payload, "newPassword");
  if (newPassword.length < 4) return error("新密码至少需要 4 位");

  const row = await getUserById(env, userId);
  if (!row) return error("账号不存在", 404);
  if (row.password !== currentPassword) return error("当前密码不正确", 401);

  await env.DB.prepare("UPDATE site_users SET password = ? WHERE id = ?").bind(newPassword, userId).run();
  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(userId).first();
  return json({ user: serializeUser(updated, { includePassword: true }) });
}
