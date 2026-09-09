import { revokeSession, sessionCookie } from '../../_lib/session.js';

export async function onRequestPost({ request, env }) {
  await revokeSession(request, env);
  return Response.json({ message: '已退出当前账号' }, { headers: {
    'Cache-Control': 'no-store', 'Set-Cookie': sessionCookie('', 0),
  } });
}
