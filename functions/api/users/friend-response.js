import { error, getUserById, json, parseJsonValue, readJson, serializeUser, serializePublicUser, updateUserJsonFields, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env, data }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const userId = data.user.id;
  const fromUserId = textValue(payload, "fromUserId");
  const accepted = Boolean(payload.accepted);

  const user = await getUserById(env, userId);
  const fromUser = await getUserById(env, fromUserId);
  if (!user || !fromUser) return error("账号不存在", 404);

  if (!parseJsonValue(user.friend_requests, []).some((item) => item.fromUserId === fromUserId)) return error("好友申请不存在或已处理", 409);

  const requests = parseJsonValue(user.friend_requests, []).filter((item) => item.fromUserId !== fromUserId);
  const userFriends = parseJsonValue(user.friends, []);
  const fromFriends = parseJsonValue(fromUser.friends, []);

  if (accepted) {
    if (!userFriends.includes(fromUserId)) userFriends.push(fromUserId);
    if (!fromFriends.includes(userId)) fromFriends.push(userId);
  }

  await updateUserJsonFields(env, userId, { friend_requests: requests, friends: userFriends });
  if (accepted) await updateUserJsonFields(env, fromUserId, { friends: fromFriends });

  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id IN (?, ?)").bind(userId, fromUserId).all();
  return json({ users: updated.results.map((row) => row.id === data.user.id ? serializeUser(row) : serializePublicUser(row)) });
}
