import { error, json } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const tableMap = {
    post: "forum_posts",
    activity: "club_activities",
  };
  const table = tableMap[params.item_type];
  if (!table) return error("内容类型不正确");

  const row = await env.DB.prepare(`UPDATE ${table} SET status = 'rejected' WHERE id = ? RETURNING id`)
    .bind(params.item_id)
    .first();

  if (!row) return error("内容不存在", 404);
  return json({ detail: "ok" });
}
