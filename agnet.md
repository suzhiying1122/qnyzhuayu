# agnet.md

## 项目说明

这是“华煜话剧社”社团网站项目，当前前台使用 Vue 3 + Vite，后台使用 Django 6 + SimpleUI。网站目标是提供社团论坛、活动档案馆、信箱、个人主页和管理员审核等功能，并围绕红色、舞台光影、戏剧和中式纹理元素进行视觉设计。

## 当前技术栈

- 后端：Django 6.0.6
- 后台美化：django-simpleui
- 前端：Vue 3 + Vite
- 静态文件：WhiteNoise
- 前台入口：Django 通过 `club.views.home` 优先服务 `frontend/dist/index.html`
- 前端源码：`frontend/src/`
- 前端构建产物：`frontend/dist/`
- 旧版前端交互逻辑：`frontend/src/legacy-app.js`
- 数据库：`db.sqlite3`

## 重要目录

- `manage.py`：Django 管理入口
- `huayu_site/`：Django 项目配置
- `club/`：Django 应用
- `frontend/`：Vue 前端项目
- `frontend/src/App.vue`：Vue 页面主体
- `frontend/src/styles.css`：前台样式
- `frontend/src/legacy-app.js`：当前前台交互逻辑
- `frontend/public/assets/`：Vue 构建时使用的静态资源
- `assets/`：根目录静态资源备份
- `requirements.txt`：Python 依赖
- `.env.example`：生产环境变量示例
- `DEPLOYMENT_PREP.md`：部署前准备说明
- `.gitignore`：忽略虚拟环境、数据库、node_modules 等本地文件

## 本地运行

先进入项目目录：

```powershell
cd C:\Users\aaa\Desktop\git\huayu-drama-club
```

激活 Python 虚拟环境：

```powershell
.\.venv\Scripts\Activate.ps1
```

检查 Django 项目：

```powershell
python manage.py check
```

启动 Django 服务：

```powershell
python manage.py runserver
```

访问前台：

```text
http://127.0.0.1:8000/
```

访问后台：

```text
http://127.0.0.1:8000/admin/
```

## Vue 前端开发

进入前端目录：

```powershell
cd C:\Users\aaa\Desktop\git\huayu-drama-club\frontend
```

安装依赖：

```powershell
npm install
```

启动 Vue 开发服务：

```powershell
npm run dev
```

构建给 Django 使用的前台页面：

```powershell
npm run build
```

修改 Vue 源码后，如果希望 Django 的 `http://127.0.0.1:8000/` 显示最新效果，需要重新执行 `npm run build`。

## 管理员信息

Django 后台超级管理员：

- 用户名：`社团秘书`
- 邮箱：`3155943296@qq.com`
- 密码：`huayu2026`

前台内容修改密钥：

```text
HUAYU-ADMIN-2026
```

## 当前功能状态

- 前台已有论坛、活动、信箱三个主要模块。
- 用户可以注册、登录、进入个人主页、修改资料和修改密码。
- 论坛帖子、活动内容、信箱内容有对应的提交与展示界面。
- 论坛和活动支持从列表点击标题进入详情页。
- 论坛详情页支持留言和针对留言继续回复。
- 论坛、活动、信箱、留言、联系表单已接入 Django 数据库和 API。
- 管理员可在前台审核帖子、审核活动、回复公开信件，也可在 Django 后台管理真实数据。
- Django 后台已经安装 SimpleUI，并设置为中文界面。
- 已配置 `robots.txt`、`sitemap.xml`、环境变量、静态文件收集目录和基础生产安全项。

## 当前限制

- 前台账号和个人资料仍主要保存在浏览器 localStorage 中。
- 前台账号体系和 Django 后台账号体系目前还不是同一套数据库用户。
- 注册验证码目前是前端演示逻辑，不是真实短信服务。
- 手机号唯一注册目前也是前端本地校验，不是服务端强约束。
- 图片、视频、文档上传目前适合演示，不适合作为正式生产存储方案。

如果要正式上线，需要把账号、帖子、活动、信件、审核、验证码、上传文件等功能迁移到 Django 数据库和后端 API，并接入真实短信服务和服务器端权限校验。

## 开发注意事项

- 修改前台页面时，优先编辑 `frontend/src/`，不要手动修改 `frontend/dist/`。
- 修改 Vue 后记得运行 `npm run build`，否则 Django 前台不会显示最新构建结果。
- `simpleui` 需要保持在 `huayu_site/settings.py` 的 `INSTALLED_APPS` 中，并放在 `django.contrib.admin` 前面。
- 后台中文设置依赖 `LANGUAGE_CODE = "zh-hans"`。
- 不要提交 `.venv/`、`frontend/node_modules/`、`db.sqlite3`、日志文件。
- 如果继续完善正式系统，建议下一步优先建立 Django models 和 API，把 localStorage 演示数据迁移到数据库。

## 常用验证清单

```powershell
python manage.py check
cd frontend
npm run build
```

然后检查：

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/admin/`
