import { error, json, readJson, serializeActivity, textValue } from "../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const type = textValue(payload, "type");
  const title = textValue(payload, "title");
  const date = textValue(payload, "date");
  const summary = textValue(payload, "summary");
  const author = textValue(payload, "author") || "匿名社员";
  const attachments = JSON.stringify(payload.attachments || []);

  if (!["briefing", "preview"].includes(type)) return error("活动类型不正确");
  if (!title || !date || !summary) return error("标题、日期和摘要不能为空");

  const row = await env.DB.prepare(
    "INSERT INTO club_activities (type, title, date, summary, author, attachments, status) VALUES (?, ?, ?, ?, ?, ?, 'pending') RETURNING *",
  )
    .bind(type, title, date, summary, author, attachments)
    .first();

  return json({ result: serializeActivity(row) }, 201);
}
