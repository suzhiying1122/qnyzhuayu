import { getSiteState, json } from "../_lib/api.js";

export async function onRequestGet({ env }) {
  return json(await getSiteState(env));
}
