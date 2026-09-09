import { ensureUserTables, json, serializeUser, serializePublicUser } from "../_lib/api.js";

export async function onRequestGet({ env, data }) {
  await ensureUserTables(env);
  const rows = await env.DB.prepare("SELECT * FROM site_users ORDER BY account_no ASC").all();
  return json({ users: rows.results.map((row) => row.id === data.user.id ? serializeUser(row) : serializePublicUser(row)) });
}
