import { error, getUserById, json, parseJsonValue, readJson, serializeUser, updateUserJsonFields, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const fromUserId = textValue(payload, "fromUserId");
  const targetId = textValue(payload, "targetId");
  if (!fromUserId || !targetId || fromUserId === targetId) return error("好友申请参数不正确");

  const fromUser = await getUserById(env, fromUserId);
  const target = await getUserById(env, targetId);
  if (!fromUser || !target) return error("账号不存在", 404);

  const targetFriends = parseJsonValue(target.friends, []);
  if (targetFriends.includes(fromUserId)) return error("你们已经是好友");

  const requests = parseJsonValue(target.friend_requests, []);
  if (!requests.some((item) => item.fromUserId === fromUserId)) {
    requests.unshift({ fromUserId, createdAt: new Date().toISOString() });
    await updateUserJsonFields(env, targetId, { friend_requests: requests });
  }

  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id IN (?, ?)").bind(fromUserId, targetId).all();
  return json({ users: updated.results.map((row) => serializeUser(row)) });
}
