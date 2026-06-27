import { error, json, readJson, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const postId = textValue(payload, "post_id", "postId");
  const parentId = textValue(payload, "parent_id", "parentId");
  const author = textValue(payload, "author") || "匿名社员";
  const body = textValue(payload, "body");

  if (!postId || !body) return error("帖子和留言内容不能为空");

  const post = await env.DB.prepare("SELECT id FROM forum_posts WHERE id = ? AND status = 'approved'").bind(postId).first();
  if (!post) return error("帖子不存在或尚未公开", 404);

  if (parentId) {
    const parent = await env.DB.prepare("SELECT id FROM forum_comments WHERE id = ? AND post_id = ?").bind(parentId, postId).first();
    if (!parent) return error("回复对象不存在", 404);
  }

  const row = await env.DB.prepare(
    "INSERT INTO forum_comments (post_id, parent_id, author, body, attachments) VALUES (?, ?, ?, ?, '[]') RETURNING *",
  )
    .bind(postId, parentId || null, author, body)
    .first();

  return json({
    result: {
      id: String(row.id),
      author: row.author,
      body: row.body,
      createdAt: row.created_at,
      attachments: [],
      replies: [],
    },
  }, 201);
}
