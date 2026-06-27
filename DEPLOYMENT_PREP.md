# 华煜话剧社 Cloudflare 部署准备

## 本地链接

- 前台网站：`http://127.0.0.1:8000/`
- Django 后台：`http://127.0.0.1:8000/admin/`

本地 Django 版本用于开发和备用。公网部署使用 Cloudflare Pages + Functions + D1。

## Cloudflare 部署架构

```text
Cloudflare Pages: frontend/dist
Cloudflare Functions: functions/
Cloudflare D1: qnyzhuayu-db
Domain: qnyzhuayu.cn
```

## 已准备文件

- `functions/`：Cloudflare Pages Functions API
- `schema.sql`：D1 数据表结构
- `seed-d1.sql`：D1 初始演示数据
- `wrangler.toml`：Cloudflare 项目配置
- `package.json`：Cloudflare 构建和部署脚本
- `frontend/dist/`：构建后的 Vue 静态页面

## Cloudflare Pages 构建配置

```text
Project name: qnyzhuayu
Production branch: main
Build command: npm run build
Build output directory: frontend/dist
Root directory: /
```

## D1 配置

创建数据库：

```text
qnyzhuayu-db
```

Pages Functions 绑定：

```text
Binding name: DB
Database: qnyzhuayu-db
```

然后在 D1 控制台依次执行：

```text
schema.sql
seed-d1.sql
```

## 环境变量

Cloudflare Pages 项目里添加：

```text
ADMIN_KEY=HUAYU-ADMIN-2026
```

## 本地构建检查

```powershell
npm run build
```

或：

```powershell
cd frontend
npm install
npm run build
```
