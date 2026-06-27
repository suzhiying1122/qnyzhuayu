# qnyzhuayu.cn Cloudflare 部署说明

## 当前方案

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

注意：Cloudflare 不能运行 Django 后台 `/admin/`。上线后公共功能会使用 Pages Functions + D1；管理操作使用网站内置管理员界面和内容修改密钥。

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

先执行 `schema.sql`，再执行 `seed-d1.sql`。

## 环境变量

在 Cloudflare Pages 项目的 Settings -> Environment variables 中添加：

```text
ADMIN_KEY=huayu2026
```

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
wrangler.toml
package.json
frontend/dist/
```

## 本地构建

```powershell
npm run build
```

或直接构建前端：

```powershell
cd frontend
npm install
npm run build
```

