# qnyzhuayu.cn 与 Cloudflare 接入说明

## 重要结论

本项目是 Django + Vue + SQLite/API 网站，包含后台、数据库、论坛、活动、信箱等动态功能。

Cloudflare Pages 主要托管静态网站，不能直接运行 Django 后端和 SQLite 数据库。因此不能把完整功能网站只部署到 Cloudflare Pages。

推荐结构：

```text
GitHub 代码仓库
        |
        v
Render 托管 Django + PostgreSQL
        |
        v
Cloudflare DNS/CDN
        |
        v
qnyzhuayu.cn
```

## Cloudflare 需要配置的内容

1. 在 Cloudflare 添加站点：`qnyzhuayu.cn`
2. 按 Cloudflare 提示，把域名注册商处的 DNS 服务器改成 Cloudflare 提供的两个 nameserver
3. 后端平台部署成功后，拿到后端访问地址或服务器 IP
4. 在 Cloudflare DNS 添加记录：

当前 DNS 查询结果显示：`qnyzhuayu.cn` 还没有 A/CNAME 记录，`www.qnyzhuayu.cn` 也还没有解析。因此域名目前还没有指向网站。

当前域名正在使用阿里云/万网 DNS：

```text
dns23.hichina.com
dns24.hichina.com
```

如果要接入 Cloudflare，需要在 Cloudflare 添加 `qnyzhuayu.cn` 后，把阿里云域名控制台里的 DNS 服务器从上面两个 hichina 地址，替换成 Cloudflare 分配给你的两个 nameserver。Cloudflare 每个账号/站点分配的 nameserver 不一样，必须以 Cloudflare 页面显示的为准。

如果暂时不切换到 Cloudflare，也可以直接在阿里云 DNS 里添加 A/CNAME 记录，让域名先指向后端服务器。

## 没有云服务器时的推荐部署方式

使用 Render 托管后端：

1. 先把项目推送到 GitHub。
2. 登录 Render，选择 New Blueprint。
3. 选择 GitHub 中的本项目仓库。
4. Render 会读取项目根目录的 `render.yaml`。
5. 它会创建：
   - Django Web Service：`qnyzhuayu`
   - PostgreSQL 数据库：`qnyzhuayu-db`
6. 部署成功后，在 Render 的 Custom Domains 中添加：
   - `qnyzhuayu.cn`
   - `www.qnyzhuayu.cn`
7. Render 会给出需要配置的 DNS 目标。
8. 再回到 Cloudflare DNS 添加对应 A/CNAME 记录。

项目已经准备好 Render 文件：

```text
render.yaml
build.sh
Procfile
```

注意：`render.yaml` 当前使用 `starter` 计划。最终费用和可用计划以 Render 页面显示为准。

如果后端平台给的是域名：

```text
Type: CNAME
Name: @
Target: 后端平台域名
Proxy: Proxied
```

如果后端平台给的是服务器 IP：

```text
Type: A
Name: @
IPv4 address: 服务器 IP
Proxy: Proxied
```

建议同时添加：

```text
Type: CNAME
Name: www
Target: qnyzhuayu.cn
Proxy: Proxied
```

如果只是先在本机测试域名，可以用项目里的脚本：

```powershell
右键 设置本地域名-qnyzhuayu.ps1
选择“以管理员身份运行”
```

然后在本机访问：

```text
http://qnyzhuayu.cn:8000/
```

这个本机映射只对当前电脑有效，不会让别人访问到网站。

## Django 环境变量

绑定正式域名后，服务器环境变量应设置为：

```text
DJANGO_SECRET_KEY=新的随机密钥
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=qnyzhuayu.cn,www.qnyzhuayu.cn
DJANGO_CSRF_TRUSTED_ORIGINS=https://qnyzhuayu.cn,https://www.qnyzhuayu.cn
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True
DJANGO_SECURE_HSTS_PRELOAD=False
```

确认 HTTPS 长期稳定后，再考虑把 `DJANGO_SECURE_HSTS_PRELOAD` 改为 `True`。

## 后端平台构建命令

```bash
pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
python manage.py migrate
python manage.py collectstatic --noinput
```

## 后端平台启动命令

```bash
gunicorn huayu_site.wsgi:application
```

也可以使用项目根目录的 `Procfile`：

```text
web: gunicorn huayu_site.wsgi:application
```
