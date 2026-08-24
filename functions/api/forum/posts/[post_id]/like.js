import { ensureForumReactionTable, error, json, readJson, textValue } from "../../../../_lib/api.js";

export async function onRequestPost({ request, env, params }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const actorId = textValue(payload, "actor_id", "actorId", "user_id", "userId");
  const postId = textValue(params, "post_id");
  if (!actorId) return error("请先登录后再点赞", 401);
  if (!postId) return error("帖子编号不能为空");

  await ensureForumReactionTable(env);
  const post = await env.DB.prepare("SELECT id FROM forum_posts WHERE id = ? AND status = 'approved'").bind(postId).first();
  if (!post) return error("帖子不存在或尚未公开", 404);

  const existing = await env.DB.prepare(
    "SELECT post_id FROM forum_post_likes WHERE post_id = ? AND actor_id = ?",
  ).bind(postId, actorId).first();

  let liked = false;
  if (existing) {
    await env.DB.prepare("DELETE FROM forum_post_likes WHERE post_id = ? AND actor_id = ?").bind(postId, actorId).run();
  } else {
    await env.DB.prepare("INSERT INTO forum_post_likes (post_id, actor_id) VALUES (?, ?)").bind(postId, actorId).run();
    liked = true;
  }

  const count = await env.DB.prepare(
    "SELECT COUNT(*) AS like_count FROM forum_post_likes WHERE post_id = ?",
  ).bind(postId).first();

  return json({
    result: {
      liked,
      likeCount: Number(count?.like_count) || 0,
    },
  });
}
