import { error, json, readJson, requireAdmin, serializePost } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");
  if (!requireAdmin(payload, env)) return error("管理员密钥不正确", 403);

  const row = await env.DB.prepare(
    "UPDATE forum_posts SET status = 'approved', approved_at = datetime('now') WHERE id = ? RETURNING *",
  )
    .bind(params.post_id)
    .first();

  if (!row) return error("帖子不存在", 404);
  return json({ result: serializePost(row, []) });
}
