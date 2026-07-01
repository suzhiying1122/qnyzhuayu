import { error, getUserById, json, parseJsonValue, updateUserJsonFields } from "../../_lib/api.js";

export async function onRequestDelete({ env, params }) {
  const userId = params.user_id;
  const target = await getUserById(env, userId);
  if (!target) return error("账号不存在", 404);
  if (target.role === "admin" || target.account_no === "0000") return error("管理员账号不能注销", 403);

  const rows = await env.DB.prepare("SELECT * FROM site_users").all();
  await Promise.all(
    rows.results
      .filter((row) => row.id !== userId)
      .map((row) => {
        const friends = parseJsonValue(row.friends, []).filter((friendId) => friendId !== userId);
        const friendRequests = parseJsonValue(row.friend_requests, []).filter((request) => request.fromUserId !== userId);
        const chats = parseJsonValue(row.chats, {});
        delete chats[userId];
        return updateUserJsonFields(env, row.id, {
          friends,
          friend_requests: friendRequests,
          chats,
        });
      }),
  );

  await env.DB.prepare("DELETE FROM site_users WHERE id = ?").bind(userId).run();
  return json({ detail: "ok", id: userId });
}
