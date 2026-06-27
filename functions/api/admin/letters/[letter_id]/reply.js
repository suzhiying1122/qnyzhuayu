import { error, json, readJson, requireAdmin, serializeLetter, textValue } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");
  if (!requireAdmin(payload, env)) return error("管理员密钥不正确", 403);

  const reply = textValue(payload, "reply");
  if (!reply) return error("回复不能为空");

  const row = await env.DB.prepare(
    "UPDATE mail_letters SET reply = ?, replied_at = datetime('now') WHERE id = ? RETURNING *",
  )
    .bind(reply, params.letter_id)
    .first();

  if (!row) return error("信件不存在", 404);
  return json({ result: serializeLetter(row) });
}
