import { error, json, serializeActivity } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const row = await env.DB.prepare(
    "UPDATE club_activities SET status = 'approved', approved_at = datetime('now') WHERE id = ? RETURNING *",
  )
    .bind(params.activity_id)
    .first();

  if (!row) return error("活动不存在", 404);
  return json({ result: serializeActivity(row) });
}
