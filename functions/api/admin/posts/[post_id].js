import { error, json } from "../../../_lib/api.js";

export async function onRequestDelete({ env, params }) {
  const postId = params.post_id;
  const existing = await env.DB.prepare("SELECT id FROM forum_posts WHERE id = ?").bind(postId).first();

  if (!existing) return error("帖子不存在", 404);

  await env.DB.prepare("DELETE FROM forum_comments WHERE post_id = ?").bind(postId).run();
  await env.DB.prepare("DELETE FROM forum_posts WHERE id = ?").bind(postId).run();

  return json({ detail: "ok", id: String(postId) });
}
