# qnyzhuayu.cn Cloudflare 部署说明

## 当前方案

认证升级的迁移顺序、管理员初始化、CPU 配额和本地验证见 [AUTH_DEPLOY.md](AUTH_DEPLOY.md)。已有数据库必须先按该文档完成迁移，再部署新认证代码。

本项目已准备为纯 Cloudflare 架构：

```text
GitHub 仓库 suzhiying1122/qnyzhuayu
        |
        v
Cloudflare Pages 静态前端
        |
        v
Cloudflare Pages Functions API
        |
        v
Cloudflare D1 数据库
        |
        v
qnyzhuayu.cn
```

不再需要 Render，也不需要云服务器。

注意：Cloudflare 不能运行 Django 后台 `/admin/`。上线后公共功能会使用 Pages Functions + D1；管理操作使用网站内置管理员界面。

## Nameserver

域名原 DNS：

```text
dns23.hichina.com
dns24.hichina.com
```

Cloudflare 分配的 nameserver：

```text
jacob.ns.cloudflare.com
nola.ns.cloudflare.com
```

阿里云/万网控制台已修改为以上 Cloudflare nameserver。生效通常需要几分钟到 24 小时。

## Cloudflare Pages 创建方式

1. 进入 Cloudflare Dashboard。
2. 打开 `Workers & Pages`。
3. 点击 `Create application`。
4. 选择 `Pages`。
5. 选择 `Connect to Git`。
6. 选择 GitHub 仓库：

```text
suzhiying1122/qnyzhuayu
```

7. 构建配置填写：

```text
Project name: qnyzhuayu
Production branch: main
Build command: npm run build
Build output directory: frontend/dist
Root directory: /
```

8. 部署。

## 创建 D1 数据库

在 Cloudflare Dashboard：

1. 打开 `Workers & Pages` 或 `Storage & Databases`。
2. 找到 `D1 SQL Database`。
3. 创建数据库：

```text
qnyzhuayu-db
```

4. 创建成功后，在项目设置中绑定 D1：

```text
Binding name: DB
Database: qnyzhuayu-db
```

5. 在 D1 控制台执行项目里的 SQL：

```text
schema.sql
seed-d1.sql
```

以上仅适用于全新数据库：先执行 `schema.sql`；`seed-d1.sql` 仅为可选演示内容，正式站点按需决定是否导入。已有数据库不得用 schema 初始化步骤替代迁移，升级路径见下表。

| 当前 D1 状态 | 升级方式 |
| --- | --- |
| 空库或已执行当前 schema 的新库 | 统一升级工具可初始化/检查，再安全初始化管理员 |
| `site_users` 存在但没有 `email` | 统一工具补 email 列、验证码表和索引，再迁移密码与会话表 |
| 已有 `email`，包括之前请求触发过自动加列的旧库 | 跳过重复 ADD COLUMN，补齐验证码表和索引，再迁移认证 |
| 已有 `password_hash` 的安全认证库 | 保留现有密码哈希，检查/补齐认证表和索引，可重复运行 |

工具命令与维护窗口顺序详见 [AUTH_DEPLOY.md](AUTH_DEPLOY.md)。本仓库中的 SQL、迁移工具和说明不等于远程数据库已执行迁移。

## 邮箱验证码

注册验证码由 Pages Functions 通过 Resend 发送。正式环境需要：

1. 在 Resend 中验证实际 From 地址对应的发信域名；如果验证的是 `send.qnyzhuayu.cn`，From 地址也必须使用该域名。下面的示例以已验证 `qnyzhuayu.cn` 为前提，不能混用。
2. 在 Pages 项目 `qnyzhuayu` 的 `Settings > Variables and Secrets` 中添加：

```text
RESEND_API_KEY = Resend API 密钥（Secret）
RESEND_FROM = 华煜话剧社 <verify@qnyzhuayu.cn>
```

3. 在维护窗口使用统一升级入口，自动识别邮箱列是否已存在：

```powershell
npm run auth:migrate -- --remote
```

不要把 `RESEND_API_KEY` 写入源码、Git、`.env` 或普通明文变量。验证码 10 分钟过期，60 秒内不可重复发送；服务端同时限制邮箱、IP 和错误尝试次数。

`migrations/2026-09-08-email-verification.sql` 是仅供无 email 旧库执行一次的原始 SQL，不能在新库或已有 email 的旧库上重复执行。SQLite 不支持用 `CREATE TABLE IF NOT EXISTS` 或再次执行完整 schema 来自动补列；应使用上面的工具。生产和预览的 DB、邮件 Secret 分开配置，不把密钥放入任何 `VITE_*` 构建变量。

## 自定义域名

Cloudflare Pages 项目部署成功后：

1. 进入 Pages 项目 `qnyzhuayu`。
2. 打开 `Custom domains`。
3. 添加：

```text
qnyzhuayu.cn
www.qnyzhuayu.cn
```

Cloudflare 会自动添加需要的 DNS 记录。

## 本项目 Cloudflare 文件

```text
functions/
schema.sql
seed-d1.sql
AUTH_DEPLOY.md
migrations/
tools/migrate-auth.mjs
wrangler.local.jsonc（仅限本地）
package.json
frontend/dist/
```

生产 Pages 项目、D1 绑定和 Secret 仍由现有 Cloudflare 项目配置管理，仓库没有可直接用于生产的 `wrangler.toml`。不要把 `wrangler.local.jsonc` 中的本地数据库占位 ID 用于生产。发布源是 `frontend/src`、`frontend/public`、`functions` 与 lockfile；`frontend/dist` 由 Pages 构建生成，不再提交生成文件。

## 本地构建

```powershell
npm run build
```

本次准备工作不执行远程部署或迁移。需保留已有本地 dist 时，可以把校验构建输出到全新目录（不影响 Pages 默认输出目录）：

```powershell
$env:HUAYU_BUILD_OUT_DIR = '../output/release-build-' + [guid]::NewGuid().ToString('N')
try { npm run build } finally { Remove-Item Env:HUAYU_BUILD_OUT_DIR }
```

构建产物应包含 `index.html`、`_headers`、`_redirects` 和 `frontend/public` 中的发布素材。`functions/` 由 Pages 单独编译；`npm run auth:test` 会验证 Functions 编译和 D1 认证逻辑。`.wrangler`、`.tmp-*`、`output`、本地数据库、`.dev.vars*` 及截图均不属于发布输入。

前端构建通过 `frontend/build-site.mjs` 使用现有 Vue 组件预渲染公开 HTML，再进行 Vite 生产打包；不增加运行时 SSR 服务，也不在构建时读取 D1 或用户会话。可以用 `node tools/test-seo.mjs <构建输出目录>` 验证搜索相关产物。线上抓取检查和 Search Console 操作见 [SEARCH_VISIBILITY.md](SEARCH_VISIBILITY.md)。

或直接构建前端：

```powershell
cd frontend
npm install
npm run build
```

