import { error, json, readJson, serializeEssay, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const eventId = textValue(payload, "eventId", "event_id") || "writing-event-main";
  const title = textValue(payload, "title");
  const body = textValue(payload, "body");
  const author = textValue(payload, "author") || "匿名社员";
  const attachments = JSON.stringify(payload.attachments || []);

  if (!title || !body) return error("文章标题和正文不能为空");

  const row = await env.DB.prepare(
    "INSERT INTO writing_essays (event_id, title, body, author, attachments) VALUES (?, ?, ?, ?, ?) RETURNING *",
  )
    .bind(eventId, title, body, author, attachments)
    .first();

  return json({ result: serializeEssay(row) }, 201);
}
