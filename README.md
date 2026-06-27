# 华煜话剧社网站

这是华煜话剧社的 Django + Vue 网站项目，包含前台社团网站、Django SimpleUI 后台、论坛、活动档案、社团信箱和联系表单。

## 本地链接

- 前台网站：`http://127.0.0.1:8000/`
- Django 后台：`http://127.0.0.1:8000/admin/`
- 论坛：`http://127.0.0.1:8000/forum/`
- 活动：`http://127.0.0.1:8000/activities/`
- 信箱：`http://127.0.0.1:8000/mailbox/`
- 管理界面：`http://127.0.0.1:8000/admin-panel/`

`127.0.0.1` 是本机地址，只能在当前电脑访问。别人访问和搜索收录需要部署到公网服务器并绑定域名。

正式域名：

- `https://qnyzhuayu.cn/`
- `https://www.qnyzhuayu.cn/`

当前代码已允许这两个域名访问 Django。域名要真正打开网站，还需要在 Cloudflare DNS 中把它们指向后端服务器或后端部署平台。

本机域名测试：

```powershell
右键 设置本地域名-qnyzhuayu.ps1
选择“以管理员身份运行”
```

然后本机可访问：

```text
http://qnyzhuayu.cn:8000/
```

## 管理员账号

- Django 后台用户名：`社团秘书`
- Django 后台密码：`huayu2026`
- 邮箱：`3155943296@qq.com`
- 前台内容修改密钥：`HUAYU-ADMIN-2026`

## 技术栈

- 后端：Django 6
- 后台：django-simpleui
- 前端：Vue 3 + Vite
- 静态文件：WhiteNoise
- 当前数据库：SQLite

## 本地开发

```powershell
cd C:\Users\aaa\Desktop\git\huayu-drama-club
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

前端源码在 `frontend/`：

```powershell
cd frontend
npm install
npm run dev
```

构建前台给 Django 使用：

```powershell
cd C:\Users\aaa\Desktop\git\huayu-drama-club\frontend
npm run build
```

## 数据功能

以下内容已经接入 Django 数据库和 API：

- 论坛帖子提交和管理员审核
- 论坛留言和楼中楼回复
- 活动简报 / 活动预告提交和管理员审核
- 社团信箱投递和社团回复
- 联系表单

API 入口包括：

- `/api/site-state/`
- `/api/forum/posts/`
- `/api/forum/comments/`
- `/api/activities/`
- `/api/letters/`
- `/api/contracts/`

## 部署前准备

部署前配置请看 [DEPLOYMENT_PREP.md](DEPLOYMENT_PREP.md)。
没有云服务器时，推荐使用 Render 托管 Django 和 PostgreSQL，再用 Cloudflare 管理 `qnyzhuayu.cn`。项目已经包含 Render 需要的：

- `render.yaml`
- `build.sh`
- `Procfile`

常用检查命令：

```powershell
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py check --deploy
```

上线后还需要：

- 购买或提供域名
- 准备公网服务器或部署平台
- 配置 HTTPS
- 在百度站长平台 / Google Search Console 提交 `sitemap.xml`
- 如果需要真实短信验证码，接入短信服务商
