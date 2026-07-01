import { error, getUserById, json, readJson, serializeUser, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const userId = textValue(payload, "userId", "id");
  const row = await getUserById(env, userId);
  if (!row) return error("账号不存在", 404);

  const profileName = textValue(payload, "profileName") || row.username;
  const avatarData = payload.avatarData === undefined ? row.avatar_data || "" : String(payload.avatarData || "");
  const clubRole = textValue(payload, "clubRole") || (row.role === "admin" ? "管理员 / 社团秘书" : "社员");
  const intro = textValue(payload, "intro");

  await env.DB.prepare(`
    UPDATE site_users
    SET profile_name = ?, avatar_data = ?, club_role = ?, intro = ?
    WHERE id = ?
  `).bind(profileName, avatarData, clubRole, intro, userId).run();

  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(userId).first();
  return json({ user: serializeUser(updated) });
}
