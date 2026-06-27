# 华煜话剧社网站部署前准备

## 当前本地链接

- 前台网站：`http://127.0.0.1:8000/`
- Django 后台：`http://127.0.0.1:8000/admin/`

这两个链接只在本机有效。部署到公网服务器并绑定域名后，别人才能访问和搜索到。

## 已完成的上线前准备

- Django 支持通过环境变量切换生产配置。
- `DEBUG` 可通过 `DJANGO_DEBUG=False` 关闭。
- `ALLOWED_HOSTS` 可通过 `DJANGO_ALLOWED_HOSTS` 配置域名。
- `CSRF_TRUSTED_ORIGINS` 可通过 `DJANGO_CSRF_TRUSTED_ORIGINS` 配置 HTTPS 域名。
- 已配置 WhiteNoise 静态文件服务。
- 已配置 `STATIC_ROOT = staticfiles`，支持 `collectstatic`。
- 已配置 `MEDIA_ROOT = media`，为后续真实文件上传做准备。
- 已提供 `.env.example` 环境变量模板。
- 已提供 `robots.txt` 和 `sitemap.xml`，便于搜索引擎收录。
- Vue 前端已构建到 `frontend/dist/`，Django 会优先服务这个构建产物。

## 部署前必须填写的信息

拿到域名和服务器后，需要设置这些环境变量：

```text
DJANGO_SECRET_KEY=一串新的随机密钥
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=你的域名,www.你的域名
DJANGO_CSRF_TRUSTED_ORIGINS=https://你的域名,https://www.你的域名
```

如果服务器已经配置 HTTPS，再启用：

```text
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True
```

## 没有云服务器时

推荐使用 Render：

1. 将项目推送到 GitHub。
2. 在 Render 中选择 New Blueprint。
3. 连接 GitHub 仓库。
4. Render 会读取 `render.yaml`，创建 Django Web Service 和 PostgreSQL。
5. 部署成功后，在 Render Custom Domains 添加 `qnyzhuayu.cn` 和 `www.qnyzhuayu.cn`。
6. 根据 Render 提示，把 DNS 记录添加到 Cloudflare。

项目已包含：

- `render.yaml`
- `build.sh`
- `Procfile`

`render.yaml` 当前使用 `starter` 计划，最终费用以 Render 控制台显示为准。

## 部署前构建命令

```powershell
cd C:\Users\aaa\Desktop\git\huayu-drama-club
.\.venv\Scripts\Activate.ps1

cd frontend
npm install
npm run build

cd ..
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py check --deploy
```

## 还需要你提供

- 域名：例如 `huayudrama.cn`
- 服务器或部署平台账号：阿里云、腾讯云、学校服务器、Render、Railway 等
- 是否要真实短信验证码：需要选择短信服务商并完成实名/模板审核
- 是否要换正式数据库：多人使用建议 PostgreSQL 或 MySQL，SQLite 更适合本地和小规模测试
