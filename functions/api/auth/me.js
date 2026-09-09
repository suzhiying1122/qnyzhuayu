import { json, serializeUser } from '../../_lib/api.js';
import { sessionCookie } from '../../_lib/session.js';

export function onRequestGet({ data }) {
  const response = json({ user: data.user ? serializeUser(data.user) : null });
  if (!data.user) response.headers.set('Set-Cookie', sessionCookie('', 0));
  return response;
}
