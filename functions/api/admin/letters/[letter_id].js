import { error, json } from "../../../_lib/api.js";

export async function onRequestDelete({ env, params }) {
  const letterId = params.letter_id;
  const existing = await env.DB.prepare("SELECT id FROM mail_letters WHERE id = ?").bind(letterId).first();

  if (!existing) {
    return error("Letter not found", 404);
  }

  await env.DB.prepare("DELETE FROM mail_letters WHERE id = ?").bind(letterId).run();
  return json({ detail: "ok", id: String(letterId) });
}
