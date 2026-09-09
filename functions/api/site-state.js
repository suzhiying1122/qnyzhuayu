import { getSiteState, json } from "../_lib/api.js";

export async function onRequestGet({ request, env, data }) {
  const viewerId = data.user?.id || "";
  const state = await getSiteState(env, viewerId);
  if (data.user?.role !== "admin") {
    state.pendingPosts = [];
    state.pendingActivities = [];
    state.letters = state.letters.filter((letter) => letter.visibility === "public");
  }
  return json(state);
}
