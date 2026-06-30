import { error, json } from "../../../_lib/api.js";

export async function onRequestDelete({ env, params }) {
  const essayId = params.essay_id;
  const existing = await env.DB.prepare("SELECT id FROM writing_essays WHERE id = ?").bind(essayId).first();

  if (!existing) return error("征文不存在", 404);

  await env.DB.prepare("DELETE FROM writing_essays WHERE id = ?").bind(essayId).run();
  return json({ detail: "ok", id: String(essayId) });
}
