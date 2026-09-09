import { hashPassword, passwordValue, validPassword, verifyPassword } from "../../_lib/password.js";
import { loginResponse, rateLimit } from "../../_lib/session.js";
import { error, getUserById, readJson } from "../../_lib/api.js";

export async function onRequestPost({ request, env, data }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const userId = data.user.id;
  const currentPassword = passwordValue(payload, "currentPassword");
  const newPassword = passwordValue(payload, "newPassword");
  if (!validPassword(newPassword)) return error("新密码长度应为 12 至 128 位");

  if (currentPassword.length > 128) return error("当前密码不正确", 401, "INVALID_PASSWORD");
  await rateLimit(env, `password:user:${userId}`, 10);
  const row = await getUserById(env, userId);
  if (!row) return error("账号不存在", 404);
  if (!(await verifyPassword(currentPassword, row.password_hash))) return error("当前密码不正确", 401, "INVALID_PASSWORD");

  const hash = await hashPassword(newPassword);
  const result = await env.DB.batch([
    env.DB.prepare("UPDATE site_users SET password_hash = ? WHERE id = ? AND password_hash = ?").bind(hash, userId, row.password_hash),
    env.DB.prepare("DELETE FROM auth_sessions WHERE user_id = ?").bind(userId),
  ]);
  if (!result[0].meta.changes) return error("账号凭据已变更，请重新登录", 401);
  const updated = { ...row, password_hash: hash };
  return loginResponse(request, env, updated);
}
