import { ensureUserTables, json, serializeUser } from "../_lib/api.js";

export async function onRequestGet({ env }) {
  await ensureUserTables(env);
  const rows = await env.DB.prepare("SELECT * FROM site_users ORDER BY account_no ASC").all();
  return json({ users: rows.results.map((row) => serializeUser(row)) });
}
