import { error, json, readJson, serializeLetter, textValue } from "../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const subject = textValue(payload, "subject");
  const body = textValue(payload, "body");
  const visibility = textValue(payload, "visibility") || "public";
  const author = textValue(payload, "author") || "匿名同学";
  const attachments = JSON.stringify(payload.attachments || []);

  if (!["public", "private"].includes(visibility)) return error("公开方式不正确");
  if (!subject || !body) return error("主题和内容不能为空");

  const row = await env.DB.prepare(
    "INSERT INTO mail_letters (subject, body, visibility, author, attachments) VALUES (?, ?, ?, ?, ?) RETURNING *",
  )
    .bind(subject, body, visibility, author, attachments)
    .first();

  return json({ result: serializeLetter(row) }, 201);
}
