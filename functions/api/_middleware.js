import { error } from '../_lib/api.js';
import { getSessionUser, rateLimit } from '../_lib/session.js';

export async function onRequest(context) {
  const { request, env, data } = context;
  const path = new URL(request.url).pathname.replace(/\/+$/, '');
  const write = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  try {
    if (write) {
      if (request.headers.get('Origin') !== new URL(request.url).origin ||
          request.headers.get('Sec-Fetch-Site') === 'cross-site') return error('请求来源无效，请刷新页面后重试', 403);
      if (request.method !== 'DELETE' && !request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
        return error('请求必须使用 JSON 格式', 415);
      }
    }
    data.user = await getSessionUser(request, env);
    const adminOnly = path.startsWith('/api/admin/') ||
      (path.startsWith('/api/users/') && request.method === 'DELETE') ||
      path === '/api/contracts' || (path === '/api/writing/events' && write);
    const memberOnly = path === '/api/users' || path.startsWith('/api/users/') ||
      (write && !path.startsWith('/api/auth/') && path !== '/api/letters');
    if ((adminOnly || memberOnly) && !data.user) return error('登录已失效，请重新登录', 401);
    if (adminOnly && data.user.role !== 'admin') return error('需要管理员权限', 403);
    if (write && ['/api/auth/login', '/api/auth/register', '/api/auth/email-code', '/api/users/password'].includes(path)) {
      await rateLimit(env, `${path}:ip:${request.headers.get('CF-Connecting-IP') || 'local'}`, 30);
    }
    const response = await context.next();
    const secured = new Response(response.body, response);
    secured.headers.set('Cache-Control', 'no-store');
    secured.headers.set('X-Content-Type-Options', 'nosniff');
    return secured;
  } catch (err) {
    // Never reflect D1 SQL, hashes, credentials or provider diagnostics.
    const status = err.status === 429 ? 429 : 503;
    const response = error(status === 429 ? '尝试过于频繁，请 15 分钟后重试' : '认证或数据服务暂时不可用，请稍后重试', status);
    if (status === 429) response.headers.set('Retry-After', '900');
    return response;
  }
}
