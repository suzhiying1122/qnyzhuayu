import { error, getUserById, json, parseJsonValue, readJson, serializeUser, updateUserJsonFields, textValue } from "../../_lib/api.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const fromUserId = textValue(payload, "fromUserId");
  const toUserId = textValue(payload, "toUserId");
  const body = textValue(payload, "body");
  if (!fromUserId || !toUserId || !body) return error("消息内容不能为空");

  const fromUser = await getUserById(env, fromUserId);
  const toUser = await getUserById(env, toUserId);
  if (!fromUser || !toUser) return error("账号不存在", 404);

  const fromFriends = parseJsonValue(fromUser.friends, []);
  if (!fromFriends.includes(toUserId)) return error("只有好友之间可以私聊", 403);

  const message = {
    id: `message-${crypto.randomUUID()}`,
    fromUserId,
    toUserId,
    body,
    createdAt: new Date().toISOString(),
  };

  const fromChats = parseJsonValue(fromUser.chats, {});
  const toChats = parseJsonValue(toUser.chats, {});
  fromChats[toUserId] = Array.isArray(fromChats[toUserId]) ? [...fromChats[toUserId], message] : [message];
  toChats[fromUserId] = Array.isArray(toChats[fromUserId]) ? [...toChats[fromUserId], message] : [message];

  await updateUserJsonFields(env, fromUserId, { chats: fromChats });
  await updateUserJsonFields(env, toUserId, { chats: toChats });

  const updated = await env.DB.prepare("SELECT * FROM site_users WHERE id IN (?, ?)").bind(fromUserId, toUserId).all();
  return json({ message, users: updated.results.map((row) => serializeUser(row)) });
}
