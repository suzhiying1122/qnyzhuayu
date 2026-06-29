import { error, json, serializePost } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const row = await env.DB.prepare(
    "UPDATE forum_posts SET status = 'approved', approved_at = datetime('now') WHERE id = ? RETURNING *",
  )
    .bind(params.post_id)
    .first();

  if (!row) return error("帖子不存在", 404);
  return json({ result: serializePost(row, []) });
}
