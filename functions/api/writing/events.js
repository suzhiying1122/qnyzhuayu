import { error, json, readJson, serializeWritingEvent, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const title = textValue(payload, "title");
  const prompt = textValue(payload, "prompt");
  const deadline = textValue(payload, "deadline");
  const author = textValue(payload, "author") || "匿名社员";

  if (!title || !prompt) return error("征文活动名称和说明不能为空");

  const row = await env.DB.prepare(
    "INSERT INTO writing_events (title, prompt, deadline, author, fixed) VALUES (?, ?, ?, ?, 0) RETURNING *",
  )
    .bind(title, prompt, deadline, author)
    .first();

  return json({ result: serializeWritingEvent(row) }, 201);
}
