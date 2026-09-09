# 华煜话剧社搜索收录

目标：用户在 Google 搜索“华煜话剧社”时，能够发现官方网站 https://qnyzhuayu.cn/。收录和排名由搜索引擎决定，不能承诺立即出现或固定名次。

## 本次检查

2026-09-09 从本地工具请求线上首页与 `/sitemap.xml` 返回 403；`/robots.txt` 返回 200，但内容为 Cloudflare 管理版本，包含允许 search 的规则，未看到仓库声明的 Sitemap 行。这个结果仅说明本次请求受到限制，不能据此判定 Googlebot 也被拦截，亦不能证明网站未被收录。

仓库首页原有标题和 description；本次补齐 canonical、明确的官网标题/描述、`og:site_name` 和 WebSite/Organization JSON-LD。名称、网址和频道链接均使用实际站点信息。移除与可见正文学校名称不一致的旧 keywords 字段，没有修改可见页面设计。

首页现在在构建时使用 Vue 官方 server-renderer 将同一套 App.vue 组件生成静态 HTML，直接包含社团名称、介绍与公开频道链接。浏览器随后由原有 Vue 入口接管交互；构建不访问 D1、不请求会话、不写入账号数据，也不按 User-Agent 区分页面。页面样式保持不变。JavaScript 禁用时会移除开场遮罩，并提示互动功能需要 JavaScript。

Google 可以执行 JavaScript，但仍应使用 Search Console 检查最终渲染的 HTML/截图，确认不会被开场动画、验证码挑战或加载错误挡住。站点当前的活动/作品详情仍使用单页交互，没有独立公开 URL，因此本次只优化官网首页收录；不能把按钮视图直接作为独立网页塞进 sitemap。后续若要搜索到每篇活动/作品，需要单独实现稳定 URL 和真实内容渲染。

本地验证：运行 `npm run build`，再执行 `node tools/test-seo.mjs <实际构建输出目录>`。后者检查静态正文、站点名称、canonical、sitemap 和公开 HTML 不含会话信息。`HUAYU_BUILD_OUT_DIR` 可继续用于构建到全新目录，保留原有本地产物。

## 按顺序完成的线上步骤

1. 先按 AUTH_DEPLOY.md 完成既有发布的迁移和上线流程，使新增搜索标记真正出现在生产首页。本次只修改本地代码，没有远程发布。
2. 打开 [Google Search Console](https://search.google.com/search-console/about)，添加域名资源 `qnyzhuayu.cn`。按控制台提供的专属 TXT 记录在 Cloudflare DNS 完成所有权验证。验证记录必须来自实际控制台，不能使用示例值。
3. 在“网址检查”输入 `https://qnyzhuayu.cn/`，选择“测试实际网址”。若抓取返回 403/挑战页面，在 Cloudflare Security Events 中确认命中的规则，为经过验证的搜索爬虫正确配置访问。不要整体关闭网站防护，也不要仅凭自报 User-Agent 放行所有请求。
4. 确认首页和 `https://qnyzhuayu.cn/sitemap.xml` 均可抓取，首页没有 noindex，规范网址为 `https://qnyzhuayu.cn/`，www 版本重定向到该网址。Cloudflare 管理的 robots.txt 应保留需要的搜索抓取规则与 Sitemap 声明；禁止 AI 训练的规则与 Google 搜索抓取不是同一设置。
5. 在“Sitemaps”提交 `https://qnyzhuayu.cn/sitemap.xml`。在首页网址检查中点击“请求编入索引”。不要重复提交来追求更快收录。
6. 在社团已有 QQ 频道、公众号介绍或学校社团介绍中，用“华煜话剧社官网”链接到实际网站，帮助用户和搜索引擎发现它。只在自己有权维护的页面上更新链接。
7. 用 Search Console 的网页索引和效果报告查看收录状态及“华煜话剧社”的搜索展现。`site:qnyzhuayu.cn` 可作辅助检查，但不能替代控制台的索引结果。

本轮没有操作 Search Console、DNS、防火墙设置或索引提交。需要站点所有者登录后才能检查实际 Google 抓取结果。

参考：[Google 站点名称](https://developers.google.com/search/docs/appearance/site-names)、[JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)、[网址检查](https://support.google.com/webmasters/answer/9012289)、[收录常见问题](https://developers.google.com/search/help/crawling-index-faq)。
