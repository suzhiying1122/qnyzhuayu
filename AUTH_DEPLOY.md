# 安全认证部署与迁移

本次认证实现于 Cloudflare Pages Functions + D1。Vue 开发代理默认指向本地 Pages (`127.0.0.1:8788`)，不再默认调用生产 API。旧 Django 认证接口不属于这套部署。

## 密码和会话

- 密码只在服务端以 `scrypt$16384$8$5$<16-byte salt>$<32-byte hash>` 保存，使用固定版本 `@noble/hashes`。参数采用 [OWASP 的 scrypt 配置](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)，约 16 MiB 工作内存。新密码为 12–128 位，保留空格和 Unicode，不作 trim；迁移后的旧密码仍可登录。
- `__Host-huayu_session` Cookie 设置 `HttpOnly; Secure; SameSite=Lax; Path=/`，固定 7 天有效，不设置 Domain。令牌有 256 位随机熵，D1 只存 SHA-256 摘要。登录替换当前会话；改密撤销账号全部会话并签发新会话；退出在服务端撤销令牌。
- 注册、登录返回 `{ user }` 并设置 Cookie；`GET /api/auth/me` 返回 `{ user }` 或 `{ user: null }`；`POST /api/auth/logout` 撤销会话并清除 Cookie。所有用户序列化均无密码或哈希字段。
- 写操作校验同源 Origin。用户资料、好友、聊天、点赞及内容作者使用会话身份；管理接口核验数据库 admin 角色。客户端缓存不构成身份凭据。访客仍可访问公开内容与匿名信箱。
- 登录按账号限制每 15 分钟 10 次，认证请求按 IP 限制每 15 分钟 30 次，改密和注册验证也有限流。错误返回 JSON，不反射 D1 SQL 或邮件供应商内部错误。

**运行要求：** scrypt 有意耗费 CPU。正式部署须使用具备足够 CPU 预算的 Workers Paid 配额；建议 Pages Functions `limits.cpu_ms = 10000`，并在预发布环境查看实际 CPU 指标。免费配额不适合这组强哈希参数，不能为迁就免费限制而降低哈希强度。参见 [Pages limits 配置](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) 和 [Workers 运行限制](https://developers.cloudflare.com/workers/platform/limits/)。本地 workerd 测试不代表生产 CPU 限额已验证。

## 已有数据库迁移

1. 安排维护窗口，停止旧版 API 访问及写入，防止旧代码继续返回密码。准备受限访问的 D1 备份；旧备份含明文密码，应按敏感凭据管理。
2. 使用统一升级入口。脚本先检查 `PRAGMA table_info(site_users)`：空库使用完整 schema；旧库只在缺少 `email` 时执行邮箱迁移中的 ALTER，已有 email 时只补建索引和验证码表；随后读取旧 `password` 列做强哈希并完成认证迁移。明文不会写入生成的 SQL 或打印到终端。

   ```powershell
   npm ci
   npm run auth:migrate -- --remote
   ```

   默认数据库为 `qnyzhuayu-db`，使用已登录的 Wrangler。可附加 `--config=路径`、`--database=实际数据库名`。若有重复昵称，工具会在修改密码前停止，应先处理后重试；若旧 email 数据违反唯一约束，也会停止，不会静默覆盖账号。执行中断可在维护窗口重跑，已转换的哈希不会重复哈希；认证迁移已完成时会补齐缺失的认证表和索引。

   **不要单独执行 `migrations/2026-09-09-secure-auth.sql`：直接执行会停用尚未转换的旧密码。**
3. ID、编号、角色和个人资料全部保留。历史公开固定密码会被停用；管理员 `0000` 不会由公共接口自动创建。通过标准输入设置自己的管理员新密码，不把它放入命令行参数或历史：

   ```powershell
   $authAdminSecret = Read-Host '管理员新密码（12–128 位）' -AsSecureString
   $authAdminPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($authAdminSecret)
   try {
     [Runtime.InteropServices.Marshal]::PtrToStringBSTR($authAdminPointer) | node tools/migrate-auth.mjs --remote --admin
   } finally {
     [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($authAdminPointer)
     $authAdminSecret.Dispose()
   }
   ```

   此命令保留已有管理员 ID 和资料；全新库则创建编号 `0000` 的管理员。不要在 PowerShell transcript 或调试录制中初始化凭据。
4. 部署本次前后端，检查生产和预览环境的 `DB`、`RESEND_API_KEY`、`RESEND_FROM`，设置上述 CPU 预算后恢复流量。首次访问会清除旧浏览器缓存中的密码和登录信息，用户需重新登录。
5. 验证注册邮件、登录、刷新恢复、改密、退出和管理员审核。本地测试不发送真实邮件，也不修改远程数据库。

迁移后不能直接回退到旧明文认证版本。需要回滚时，应在维护窗口同时恢复匹配的代码与数据库，并保持访问限制。

## 全新库与本地验证

全新生产库可以执行当前 `schema.sql`，也可以直接使用统一升级工具初始化空库，再初始化管理员；不要重复执行旧库 ALTER 迁移。已有库不能用 `schema.sql` 代替升级：`CREATE TABLE IF NOT EXISTS` 不会补齐已有表的列。新增 `auth_sessions` 和 `auth_rate_limits` 表，包含用户和过期时间索引。

```powershell
npm ci
npm run d1:local
# 本地管理员初始化使用上面的安全输入方法，将参数替换为：
# --local --admin --config=wrangler.local.jsonc --database=qnyzhuayu-local
npm --prefix frontend run build
npm run pages:dev
```

打开 `http://localhost:8788`。Cookie 始终启用 Secure；浏览器的 localhost 开发例外适用于本地调试，自定义本地域名必须配置 HTTPS。`wrangler.local.jsonc` 仅供本地，不能用于生产部署。本地真实邮件联调的 Secret 放入已忽略的 `.dev.vars`；预览环境应绑定独立 D1。

```powershell
npm run auth:test
node tools/test-auth-migration.mjs
npm --prefix frontend run build
```

认证测试先编译真实 Pages 路由，再使用 workerd 与临时 D1 验证身份、权限、密码和会话。迁移测试在隔离本地 D1 中运行真实 CLI，覆盖无 email 旧库、只有 email 列的部分升级旧库、完整邮箱旧库、当前 schema 新库和空库，比较最终表/索引/列定义，并检查账号资料保留、默认密码停用、管理员初始化和重复执行。

定期执行过期数据清理；登录时也会清理过期会话：

```sql
DELETE FROM auth_sessions WHERE expires_at <= unixepoch() * 1000;
DELETE FROM auth_rate_limits WHERE expires_at <= unixepoch() * 1000;
DELETE FROM email_verification_codes WHERE expires_at <= unixepoch() * 1000;
DELETE FROM email_verification_ip_limits WHERE window_started_at < (unixepoch() - 86400) * 1000;
```
