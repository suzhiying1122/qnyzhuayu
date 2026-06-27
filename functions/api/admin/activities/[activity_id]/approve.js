import { error, json, readJson, requireAdmin, serializeActivity } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");
  if (!requireAdmin(payload, env)) return error("管理员密钥不正确", 403);

  const row = await env.DB.prepare(
    "UPDATE club_activities SET status = 'approved', approved_at = datetime('now') WHERE id = ? RETURNING *",
  )
    .bind(params.activity_id)
    .first();

  if (!row) return error("活动不存在", 404);
  return json({ result: serializeActivity(row) });
}
