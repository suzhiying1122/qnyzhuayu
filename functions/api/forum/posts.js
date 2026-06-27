import { error, json, readJson, serializePost, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const title = textValue(payload, "title");
  const body = textValue(payload, "body");
  const author = textValue(payload, "author") || "匿名社员";
  const tag = textValue(payload, "tag") || "讨论";
  const attachments = JSON.stringify(payload.attachments || []);

  if (!title || !body) return error("标题和内容不能为空");

  const result = await env.DB.prepare(
    "INSERT INTO forum_posts (title, body, author, tag, attachments, status) VALUES (?, ?, ?, ?, ?, 'pending') RETURNING *",
  )
    .bind(title, body, author, tag, attachments)
    .first();

  return json({ result: serializePost(result, []) }, 201);
}
