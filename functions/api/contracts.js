import { error, json, readJson, serializeContract, textValue } from "../_lib/api.js";

export async function onRequestGet({ env }) {
  const rows = await env.DB.prepare("SELECT * FROM contract ORDER BY id DESC").all();
  return json({ results: rows.results.map(serializeContract) });
}

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const contactName = textValue(payload, "contact_name", "contactName", "联系人");
  const phone = textValue(payload, "phone", "联系电话");
  const clubPosition = textValue(payload, "club_position", "clubPosition", "社团职务");

  if (!contactName || !phone || !clubPosition) return error("联系人、联系电话和社团职务不能为空");

  const row = await env.DB.prepare(
    "INSERT INTO contract (contact_name, phone, club_position) VALUES (?, ?, ?) RETURNING *",
  )
    .bind(contactName, phone, clubPosition)
    .first();

  return json({ result: serializeContract(row) }, 201);
}
