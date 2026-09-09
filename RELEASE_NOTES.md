# qnyzhuayu.cn 发布准备

## 提交范围

本次合并当前工作区中实际站点功能、前端源码、素材、安全认证和部署文档。保留已有视觉设计，发布目标是既有 Cloudflare Pages 项目 `qnyzhuayu` 与 D1 绑定 `DB`。

- 社区入口：保留论坛页面的 QQ 频道入口、分类跳转、频道号复制和二维码弹窗，配置集中在 `community-config.js`；历史论坛数据/API 保留。
- 前端体验：保留会员个人主页、活动详情、登录注册弹窗、移动导航、头像显示、移动设备静态背景和交互反馈。新增实际使用的个人主页背景与 QQ 频道二维码。
- 认证与权限：服务端 scrypt 密码哈希、HttpOnly/Secure/SameSite 会话 Cookie、当前用户/退出接口、限流、同源校验和服务端角色授权。客户端不再用 localStorage 密码或用户 ID 恢复身份。
- D1 升级：保留 `schema.sql` 和两份版本迁移；统一工具按列是否存在选择邮箱 ALTER，补建相关表与索引，再升级密码。支持旧库和新库重复执行，保留账号编号、角色和资料。
- 部署一致性：保留首页 sitemap 与缓存头调整；补齐新旧库升级顺序、管理员初始化、From 域名一致性和生产 CPU 预算要求。生产绑定与 Secret 沿用 Cloudflare 项目配置。
- 搜索可见性：补齐官网标题、canonical 与 WebSite/Organization 标记；构建时预渲染同一套 Vue 公开页面，使原始 HTML 包含社团正文。仅渲染公开壳层，不包含 D1 或会话数据，保留原有视觉和客户端交互。
- 发布输入清理：Git 仅跟踪源码、必要素材和 lockfile。移除 6 个 dist 生成文件的 Git 跟踪，保留现有本地 dist；忽略本地截图、浏览器 profile、Cloudflare 状态、构建输出、数据库和 Secret 文件。
- 依赖：提交根目录与前端 lockfile；修补 Wrangler 工具链、PostCSS 和 nanoid 的已报告依赖安全问题。

## 明确不纳入本次提交

- `.tmp-*`、`.wrangler/`、`output/`、`frontend/dist/`、根目录 `post-detail-*.png`：本地调试/构建产物，保留在磁盘，使用 `.gitignore` 排除。
- 根目录的宣传册/网站二维码 PNG：未被此次前端源码引用的本地输出，原文件保留；实际站点二维码源文件位于 `frontend/public/assets/qq-channel/` 并纳入提交。
- `tools/create_brochure.py`：独立的本地宣传册工具，保留但不纳入站点发布。
- `tools/audit-site-ui.cjs`、`tools/verify-site-flows.cjs`、`tools/verify-member-profile.cjs`、`tools/verify-mobile-backgrounds.cjs`：旧本地浏览器检查工具，包含特定浏览器路径或旧缓存登录假设，保留但不作为这次发布的验收依据。

## 发布前验证命令

在仓库根目录执行。`release:check` 读取 Git 暂存区，因此应在整理暂存内容后运行。

```powershell
npm run build
npm run auth:test
npm run d1:test
npm run release:check
npm audit
npm --prefix frontend audit
```

为避免清空已有本地 dist，本次构建验证设置了 `HUAYU_BUILD_OUT_DIR`，输出至 `output/` 下全新的目录；未改变生产默认输出目录 `frontend/dist`。本地验证结果不等于已验证生产 Secret、真实邮件送达、远程数据库状态或生产 CPU 指标。

2026-09-09 本地验证结果：

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过，最终依赖版本构建成功，入口/部署规则/必要素材齐全 |
| `npm run auth:test` | 80 项断言通过，使用编译后的真实 Pages 路由与本地 workerd/D1 |
| 迁移测试 | 5 条路径全部通过，重复执行不重置凭据，最终表/索引/列定义一致 |
| `npm run release:check` | 107 个暂存区文本文件检查通过，75 个公开素材引用完整 |
| 依赖审计 | 根项目和前端依赖均无已报告漏洞 |
| 本地文件保留 | 现有 dist、截图、浏览器 profile 均仍存在；Git 中不再跟踪 dist |

发布检查只对常见密钥格式做静态扫描，不应将其理解为对所有可能密钥形式的完整证明。

## 建议提交信息

```text
feat: prepare Cloudflare release with secure auth and community UI

Preserve QQ channel entry points, member profiles, mobile interactions,
activity views, public assets and homepage deployment metadata.

Move authentication to server-side password hashes and revocable cookie
sessions; enforce session identities and administrator permissions.

Make D1 upgrades detect existing email columns, support fresh and legacy
databases, preserve account data and safely tolerate repeated execution.

Track source and lockfiles instead of generated dist; ignore local debug
artifacts without deleting user files. Document migration, administrator
setup, runtime requirements and local release validation.
```

## 上线边界

本次仅准备本地提交内容，不执行 push、远程 D1 命令或 Pages 部署。实际发布须先按 [AUTH_DEPLOY.md](AUTH_DEPLOY.md) 安排维护窗口、备份数据库、执行统一升级、初始化管理员，再发布代码并验证真实邮件和 Cookie。不能把原始 `2026-09-08` ALTER 在已有 email 的库上重复执行，也不能用旧明文认证版本直接回退到新表结构。
