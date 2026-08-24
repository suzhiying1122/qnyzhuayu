import { getSiteState, json } from "../_lib/api.js";

export async function onRequestGet({ request, env }) {
  const viewerId = new URL(request.url).searchParams.get("viewer_id") || "";
  return json(await getSiteState(env, viewerId));
}
