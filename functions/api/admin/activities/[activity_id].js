import { error, json } from "../../../_lib/api.js";

export async function onRequestDelete({ env, params }) {
  const activityId = params.activity_id;
  const existing = await env.DB.prepare("SELECT id FROM club_activities WHERE id = ?").bind(activityId).first();

  if (!existing) {
    return error("Activity not found", 404);
  }

  await env.DB.prepare("DELETE FROM club_activities WHERE id = ?").bind(activityId).run();
  return json({ detail: "ok", id: String(activityId) });
}
