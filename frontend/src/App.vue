<template>

    <div class="intro-overlay" id="cinemaIntro" aria-label="进入华煜话剧社网站">
      <div class="intro-bg-picture intro-bg-before" aria-hidden="true">
        <img src="/assets/intro-stage-before.png" alt="" />
      </div>
      <div class="intro-bg-picture intro-bg-after" aria-hidden="true">
        <img src="/assets/intro-stage-after.png" alt="" />
      </div>
      <div class="intro-threshold-light" aria-hidden="true"></div>
      <div class="intro-atmosphere" aria-hidden="true"></div>
      <button class="intro-enter-button" id="cinemaEnterButton" type="button" aria-label="进入网站">
        <span>进入网站</span>
        <small>ENTER SITE</small>
      </button>
    </div>

    <div class="scene-video-stage" aria-hidden="true">
      <picture class="scene-cover scene-cover-home">
        <source media="(max-width: 820px)" srcset="/assets/ambient-home-mobile.webp" />
        <img src="/assets/ambient-home-hd.webp" alt="" />
      </picture>
      <div class="scene-poster-stage" aria-hidden="true"></div>
      <video class="scene-video scene-video-forum" data-scene="forum" data-src-mobile="/assets/ambient-forum-mobile.mp4" data-src-hd="/assets/ambient-forum-hd.mp4" data-poster-mobile="/assets/ambient-forum-poster-mobile.webp" data-poster-hd="/assets/ambient-forum-poster-hd.webp" poster="/assets/ambient-forum-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-discussion" data-scene="discussion" data-src-mobile="/assets/ambient-discussion-mobile.mp4" data-src-hd="/assets/ambient-discussion-hd.mp4" data-poster-mobile="/assets/ambient-discussion-poster-mobile.webp" data-poster-hd="/assets/ambient-discussion-poster-hd.webp" poster="/assets/ambient-discussion-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-activities" data-scene="activities" data-src-mobile="/assets/ambient-activities-mobile.mp4" data-src-hd="/assets/ambient-activities-hd.mp4" data-poster-mobile="/assets/ambient-activities-poster-mobile.webp" data-poster-hd="/assets/ambient-activities-poster-hd.webp" poster="/assets/ambient-activities-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-mailbox" data-scene="mailbox" data-src-mobile="/assets/ambient-mailbox-mobile.mp4" data-src-hd="/assets/ambient-mailbox-hd.mp4" data-poster-mobile="/assets/ambient-mailbox-poster-mobile.webp" data-poster-hd="/assets/ambient-mailbox-poster-hd.webp" poster="/assets/ambient-mailbox-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-writing" data-scene="writing" data-src-mobile="/assets/ambient-writing-mobile.mp4" data-src-hd="/assets/ambient-writing-hd.mp4" data-poster-mobile="/assets/ambient-writing-poster-mobile.webp" data-poster-hd="/assets/ambient-writing-poster-hd.webp" poster="/assets/ambient-writing-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-profile" data-scene="profile" data-src-mobile="/assets/ambient-profile-mobile.mp4" data-src-hd="/assets/ambient-profile-hd.mp4" data-poster-mobile="/assets/ambient-profile-poster-mobile.webp" data-poster-hd="/assets/ambient-profile-poster-hd.webp" poster="/assets/ambient-profile-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-friends" data-scene="friends" data-src-mobile="/assets/ambient-friends-mobile.mp4" data-src-hd="/assets/ambient-friends-hd.mp4" data-poster-mobile="/assets/ambient-friends-poster-mobile.webp" data-poster-hd="/assets/ambient-friends-poster-hd.webp" poster="/assets/ambient-friends-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <video class="scene-video scene-video-admin" data-scene="admin" data-src-mobile="/assets/ambient-admin-mobile.mp4" data-src-hd="/assets/ambient-admin-hd.mp4" data-poster-mobile="/assets/ambient-admin-poster-mobile.webp" data-poster-hd="/assets/ambient-admin-poster-hd.webp" poster="/assets/ambient-admin-poster-hd.webp" muted playsinline loop preload="metadata"></video>
      <div class="cinema-vignette"></div>
      <div class="cinema-grain"></div>
    </div>

    <!-- One persistent shell header. Views below never render their own navigation. -->
    <GlobalHeader />

    <main id="top" data-view-shell="single-page" aria-label="华煜话剧社内容区域">
      <section class="view home-view is-active" id="homeView" data-view="home" aria-labelledby="heroTitle">
        <img class="hero-image" src="/assets/bg-main-stage.png" alt="红色幕布与暖色追光下的华煜话剧社舞台" />
        <div class="hero-shade"></div>
        <div class="home-gif-stage" aria-hidden="true">
          <span class="home-gif-stage-mark"></span>
          <div class="home-gif-clock" aria-hidden="true">
            <time id="homeClockTime">--:--</time>
            <span id="homeClockDate">北京时间</span>
          </div>
          <img id="homeAmbientGif" src="/assets/ambient-gif-home.gif" alt="" />
        </div>
        <div class="cinema-grain" aria-hidden="true"></div>
        <div class="cinema-scanline" aria-hidden="true"></div>
        <div class="stage-ribbon ribbon-one"></div>
        <div class="stage-ribbon ribbon-two"></div>
        <div class="home-editorial-art" aria-hidden="true">
          <img class="home-art-figure" src="/assets/home-stage-portrait.png" alt="" />
        </div>
        <time class="home-index" id="homeIndexDate" aria-label="当前日期">
          <span id="homeIndexMonth">--</span>
          <i></i>
          <span id="homeIndexDay">--</span>
          <i></i>
          <span id="homeIndexYear">----</span>
        </time>
        <div class="hero-content">
          <div class="hero-logo-card" aria-label="华煜话剧社社团标志">
            <img src="/assets/huayu-logo.png" alt="华煜话剧社 logo" />
          </div>
          <h1 id="heroTitle"><span>戏如人生</span><span>人生如戏</span></h1>
          <p class="home-club-label">话剧社</p>
          <p class="hero-copy">在舞台上，我们演出另一个人生。</p>
          <div class="hero-actions">
            <button class="primary-button" data-view-target="activities" type="button">了解更多</button>
          </div>
          <div class="home-ghost-word" aria-hidden="true">THEATRE</div>
        </div>
        <div class="home-socials" aria-label="社交入口">
          <button class="home-social home-social-qq" type="button" aria-label="QQ" title="QQ">
            <img src="/assets/social-qq.svg" alt="" aria-hidden="true" width="20" height="20" />
          </button>
          <button class="home-social home-social-wechat" type="button" aria-label="微信" title="微信">
            <img src="/assets/social-wechat.svg" alt="" aria-hidden="true" width="20" height="20" />
          </button>
          <button class="home-social home-social-douyin" type="button" aria-label="抖音" title="抖音">
            <img src="/assets/social-douyin.svg" alt="" aria-hidden="true" width="20" height="20" />
          </button>
        </div>
        <aside class="scene-profile-card" aria-label="华煜话剧社简介">
          <span class="scene-card-kicker">PROFILE</span>
          <strong>华煜话剧社</strong>
          <p>在排练与表达之间，让每一个想法找到自己的舞台。</p>
          <span class="scene-card-line" aria-hidden="true"></span>
          <dl>
            <div><dt>LOCATION</dt><dd>黔南民族医学高等专科学校</dd></div>
            <div><dt>FOCUS</dt><dd>Drama · Community · Story</dd></div>
          </dl>
        </aside>
        <div class="quick-stats" aria-label="社团站点概览">
          <div>
            <strong id="postCount">0</strong>
            <span>公开帖子</span>
          </div>
          <div>
            <strong id="activityCount">0</strong>
            <span>公开活动</span>
          </div>
          <div>
            <strong id="publicLetterCount">0</strong>
            <span>公开信件</span>
          </div>
        </div>

        <div class="module-gates" aria-label="功能入口">
          <button class="module-gate gate-forum" data-view-target="forum" data-ambient-gif="/assets/ambient-gif-forum.gif" type="button">
            <span class="gate-label">Forum</span>
            <strong>论坛</strong>
            <small>社员交流，话题不限</small>
          </button>
          <button class="module-gate gate-activities" data-view-target="activities" data-ambient-gif="/assets/ambient-gif-activities.gif" type="button">
            <span class="gate-label">Events</span>
            <strong>活动</strong>
            <small>简报、预告和社团档案</small>
          </button>
          <button class="module-gate gate-mailbox" data-view-target="mailbox" data-ambient-gif="/assets/ambient-gif-mailbox.gif" type="button">
            <span class="gate-label">Mailbox</span>
            <strong>信箱</strong>
            <small>给社团的一封来信</small>
          </button>
          <button class="module-gate gate-writing" data-view-target="writing" data-ambient-gif="/assets/ambient-gif-writing.gif" type="button">
            <span class="gate-label">Writing</span>
            <strong>征文</strong>
            <small>征文活动与文章投稿</small>
          </button>
          <button class="module-gate gate-admin hidden" id="adminHomeGate" data-view-target="admin" data-ambient-gif="/assets/ambient-gif-admin.gif" type="button">
            <span class="gate-label">Admin</span>
            <strong>管理后台</strong>
            <small>审核发布与账号管理</small>
          </button>
        </div>
      </section>

      <section class="view module-screen forum-screen" id="forumScreen" data-view="forum" aria-labelledby="forumTitle">
        <div class="forum-editorial-page">
          <section class="forum-editorial-hero" aria-label="论坛引导">
            <div class="forum-hero-copy">
              <button class="back-button forum-back" data-view-target="home" type="button">返回首页</button>
              <span class="forum-hero-kicker">THEATRE CLUB / 02</span>
              <h2 id="forumTitle"><span>幕</span><span>间</span></h2>
              <p class="forum-hero-english">INTERMISSION</p>
              <span class="forum-title-rule" aria-hidden="true"></span>
              <p class="forum-hero-description">戏落幕了，故事还没有。<br />分享排练、讨论剧本、寻找搭档。</p>
              <button
                class="primary-button forum-write-button"
                id="forumChannelCta"
                data-qq-channel-open
                type="button"
              >
                进入频道 · 写下场记 <span aria-hidden="true">↗</span>
              </button>
            </div>

            <div class="forum-hero-art" aria-hidden="true">
              <img src="/assets/forum-hero-character.png" alt="" />
            </div>

            <aside class="forum-hero-aside" aria-label="论坛提示">
              <p>人生如戏，<br />我们都是故事里的<br />演员与观众。</p>
              <span class="forum-aside-line" aria-hidden="true"></span>
              <div class="forum-aside-index"><span>01</span><i></i><span>03</span></div>
            </aside>
          </section>

          <div class="forum-content-shell">
            <section class="forum-category-grid" aria-label="论坛分类">
              <a class="forum-category-card forum-category-reading" :href="QQ_CHANNEL_SECTION_MAP.literary.url" target="_blank" rel="noopener noreferrer">
                <span class="forum-category-icon" aria-hidden="true">✦</span>
                <div>
                  <h3>文艺圆谈</h3>
                  <p>聚集观演心得，聊聊那些让你记住的舞台与故事。</p>
                  <span class="forum-category-entry">进入频道查看 <b aria-hidden="true">→</b></span>
                </div>
              </a>
              <a class="forum-category-card forum-category-club" :href="QQ_CHANNEL_SECTION_MAP.affairs.url" target="_blank" rel="noopener noreferrer">
                <span class="forum-category-icon" aria-hidden="true">⌂</span>
                <div>
                  <h3>社团事务</h3>
                  <p>回顾活动、发布通知，把社团里的重要时刻留档。</p>
                  <span class="forum-category-entry">进入频道查看 <b aria-hidden="true">→</b></span>
                </div>
              </a>
              <a class="forum-category-card forum-category-cast" :href="QQ_CHANNEL_SECTION_MAP.partners.url" target="_blank" rel="noopener noreferrer">
                <span class="forum-category-icon" aria-hidden="true">◌</span>
                <div>
                  <h3>寻找搭档</h3>
                  <p>找演员、编剧、摄影与舞台伙伴，让灵感找到同路人。</p>
                  <span class="forum-category-entry">进入频道查看 <b aria-hidden="true">→</b></span>
                </div>
              </a>
              <a class="forum-category-card forum-category-chat" :href="QQ_CHANNEL_SECTION_MAP.chat.url" target="_blank" rel="noopener noreferrer">
                <span class="forum-category-icon" aria-hidden="true">•••</span>
                <div>
                  <h3>幕间闲聊</h3>
                  <p>社员日常、排练碎片，以及每一次轻松的幕间碰面。</p>
                  <span class="forum-category-entry">进入频道查看 <b aria-hidden="true">→</b></span>
                </div>
              </a>
            </section>

            <div class="forum-lower-grid">
              <section class="forum-discussion-column" id="forumPosts">
                <div class="forum-section-heading">
                  <div>
                    <span class="forum-section-kicker">PUBLIC FEED</span>
                    <h3>大家都在聊</h3>
                    <p>把排练场里的话题，留在幕间继续。</p>
                  </div>
                  <a class="forum-outline-action" :href="QQ_CHANNEL.url" target="_blank" rel="noopener noreferrer">前往华煜剧坊频道 <span aria-hidden="true">→</span></a>
                </div>

                <section class="forum-channel-participation" aria-label="QQ频道参与说明">
                  <div class="forum-channel-lede">
                    <p>故事仍在继续，讨论发生在华煜剧坊腾讯频道。</p>
                    <p>加入频道，与社员分享观演心得、排练日常，寻找下一位舞台搭档。</p>
                  </div>
                </section>
              </section>

              <aside class="forum-side-column" aria-label="论坛侧栏">
                <section class="forum-live-card">
                  <span class="forum-side-kicker">QQ CHANNEL</span>
                  <h3>{{ QQ_CHANNEL.name }}</h3>
                  <div class="forum-channel-number">频道号：{{ QQ_CHANNEL.number }}</div>
                  <button class="forum-channel-side-link" data-qq-channel-open type="button">查看加入方式 <span aria-hidden="true">→</span></button>
                </section>

                <section class="forum-side-card forum-notice-card">
                  <div class="forum-side-heading"><h3>参与说明</h3></div>
                  <ul>
                    <li><span>网站仅提供频道与板块入口</span></li>
                    <li><span>发帖、评论与回复均在 QQ 完成</span></li>
                    <li><span>网页不保存频道帖子或成员信息</span></li>
                  </ul>
                </section>

                <section class="forum-side-card forum-tags-card">
                  <div class="forum-side-heading"><h3>参与方式</h3></div>
                  <div class="forum-tag-cloud">
                    <span>进入频道</span><span>选择版块</span><span>发布主题</span><span>参与回复</span>
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <Teleport to="body">
            <section class="qq-channel-modal" id="qqChannelModal" aria-hidden="true" inert>
              <div class="qq-channel-modal-backdrop" data-qq-channel-close></div>
              <article class="qq-channel-dialog" role="dialog" aria-modal="true" aria-labelledby="qqChannelDialogTitle">
                <button class="qq-channel-dialog-close" data-qq-channel-close type="button" aria-label="关闭华煜剧坊加入窗口">×</button>
                <header class="qq-channel-dialog-header">
                  <span>QQ CHANNEL / INTERMISSION</span>
                  <h3 id="qqChannelDialogTitle">{{ QQ_CHANNEL.name }}</h3>
                  <p>频道号：{{ QQ_CHANNEL.number }}</p>
                </header>
                <div class="qq-channel-dialog-body">
                  <figure class="qq-channel-qr">
                    <img :src="QQ_CHANNEL.qrImage" alt="华煜剧坊腾讯频道二维码" />
                    <figcaption>使用手机 QQ 扫码加入</figcaption>
                  </figure>
                  <div class="qq-channel-dialog-content">
                    <p>故事在幕间继续。进入频道后，可选择对应板块发布主题、评论或回复。</p>
                    <div class="qq-channel-dialog-actions">
                      <a class="qq-channel-open-button" :href="QQ_CHANNEL.url" target="_blank" rel="noopener noreferrer">打开 QQ 频道 <span aria-hidden="true">↗</span></a>
                      <button class="qq-channel-copy-button" id="copyQqChannelNumber" :data-copy-value="QQ_CHANNEL.number" type="button">复制频道号</button>
                    </div>
                    <nav class="qq-channel-dialog-sections" aria-label="华煜剧坊板块入口">
                      <a v-for="section in QQ_CHANNEL_SECTIONS" :key="section.key" :href="section.url" target="_blank" rel="noopener noreferrer">
                        <span>{{ section.name }}</span><i aria-hidden="true">↗</i>
                      </a>
                    </nav>
                  </div>
                </div>
              </article>
            </section>
          </Teleport>
        </div>
      </section>

      <section class="view module-screen forum-detail-screen" id="postDetailScreen" data-view="postDetail" aria-labelledby="postDetailTitle">
        <div class="detail-page-shell" id="postDetailContent"></div>
      </section>

      <section class="view module-screen activities-screen" id="activitiesScreen" data-view="activities" aria-labelledby="activitiesTitle">
        <div class="events-programme">
          <header class="events-programme-header">
            <div class="events-programme-heading">
              <h2 id="activitiesTitle">活动资讯</h2>
              <p class="events-wordmark">WHAT’S ON</p>
              <p class="events-programme-lede">探索最新活动，参与精彩剧夜，记录每一次相聚与热爱。</p>
              <p class="events-programme-intro">演出、排练、分享与招募，这里记录话剧社正在发生的一切。</p>
            </div>
            <div class="events-programme-signature" aria-hidden="true">
              <span>THEATRE</span>
              <strong>PROGRAMME</strong>
              <i></i>
              <span>OPEN STAGE</span>
            </div>
            <div class="events-programme-data-hooks" aria-hidden="true">
              <span id="briefingMetric">0</span>
              <span id="previewMetric">0</span>
            </div>
          </header>

          <div class="events-workspace">
            <aside class="events-category-rail" aria-label="活动分类">
              <div class="events-rail-label">EXPLORE EVENTS</div>
              <nav class="events-category-nav" aria-label="活动分类导航">
                <button class="events-category-link is-active" data-activity-filter="all" type="button">
                  <span>全部活动</span><small>ALL</small>
                </button>
                <button class="events-category-link" data-activity-filter="briefing" type="button">
                  <span>活动简报</span><small>BRIEFING</small>
                </button>
                <button class="events-category-link" data-activity-filter="preview" type="button">
                  <span>活动预告</span><small>PREVIEW</small>
                </button>
                <a class="events-category-link" href="#activityList">
                  <span>演出 &amp; 公演</span><small>PERFORMANCE</small>
                </a>
                <a class="events-category-link" href="#activityList">
                  <span>招募信息</span><small>OPEN CALL</small>
                </a>
                <a class="events-category-link" href="#activityArchiveList">
                  <span>社团快讯</span><small>NOTES</small>
                </a>
              </nav>
              <div class="events-subscribe-panel">
                <span class="events-rail-label">KEEP IN TOUCH</span>
                <h3>订阅活动日历</h3>
                <p>在下一次灯光亮起之前，收到一封来自剧场的信。</p>
                <button class="events-subscribe-link" data-view-target="mailbox" type="button">留下联系方式 <span aria-hidden="true">↗</span></button>
              </div>
            </aside>

            <section class="events-recent-column" aria-labelledby="eventsTimelineTitle">
              <header class="events-column-header">
                <div>
                  <span class="events-rail-label">THE PROGRAMME</span>
                  <h3 id="eventsTimelineTitle">近期活动</h3>
                </div>
                <div class="events-filter-row" aria-label="活动筛选">
                  <span>VIEW</span>
                  <button class="events-filter-button is-active" data-activity-filter="all" type="button">全部</button>
                  <button class="events-filter-button" data-activity-filter="briefing" type="button">简报</button>
                  <button class="events-filter-button" data-activity-filter="preview" type="button">预告</button>
                </div>
              </header>
              <div class="events-timeline-list" id="activityList" aria-live="polite"></div>
              <p class="events-feed-end">已显示当前分类的全部活动</p>
            </section>

            <aside class="events-side-rail" aria-label="活动侧栏">
              <article class="events-featured-event events-side-panel" id="activityFeatured" aria-live="polite">
                <div class="events-loading-state">正在读取活动记录…</div>
              </article>

              <section class="events-calendar-panel events-side-panel" aria-labelledby="eventsCalendarTitle">
                <header class="events-side-panel-header">
                  <div>
                    <span class="events-rail-label">MARK YOUR CALENDAR</span>
                    <h3 id="eventsCalendarTitle">活动日历</h3>
                  </div>
                  <span class="events-calendar-month">2026 / 07</span>
                </header>
                <div class="events-calendar-weekdays" aria-hidden="true">
                  <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
                </div>
                <div class="events-calendar-grid" aria-label="2026年7月活动日历">
                  <span class="is-muted">28</span><span class="is-muted">29</span><span class="is-muted">30</span>
                  <span>01</span><span>02</span><span>03</span><span>04</span>
                  <span>05</span><span class="is-event">06</span><span>07</span><span>08</span><span>09</span><span>10</span><span>11</span>
                  <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                  <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                  <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span class="is-muted">01</span>
                </div>
              </section>

              <section class="events-channel-panel events-side-panel" aria-labelledby="eventsChannelTitle">
                <div class="events-channel-copy">
                  <span class="events-rail-label">OPEN CHANNEL</span>
                  <h3 id="eventsChannelTitle">加入QQ频道</h3>
                  <p>活动通知、排练日常和下一次相遇，都在华煜剧坊。</p>
                  <a class="events-channel-link" :href="QQ_CHANNEL.url" target="_blank" rel="noopener noreferrer">打开QQ频道 <span aria-hidden="true">↗</span></a>
                </div>
                <img class="events-channel-qr" :src="QQ_CHANNEL.qrImage" alt="华煜剧坊腾讯频道二维码" loading="lazy" />
              </section>
            </aside>
          </div>

          <section class="events-archive-section events-secondary-section" aria-labelledby="eventsArchiveTitle">
            <header class="events-section-header events-archive-header">
              <div>
                <h3 id="eventsArchiveTitle">已经发生</h3>
                <p class="events-section-wordmark">ARCHIVE</p>
                <p>把舞台亮起过的片刻，留在下一次开场之前。</p>
              </div>
              <details class="events-submit-panel">
                <summary>
                  <span>提交活动审核</span>
                  <span aria-hidden="true">SUBMIT EVENT&nbsp;＋</span>
                </summary>
                <div class="events-submit-body">
                  <form class="compose-panel activity-compose" id="activityForm">
                    <h4>把一场活动写进节目单</h4>
                    <label>
                      类型
                      <select id="activityType" required>
                        <option value="briefing">活动简报</option>
                        <option value="preview">活动预告</option>
                      </select>
                    </label>
                    <label>
                      标题
                      <input id="activityTitle" type="text" maxlength="52" placeholder="例如：《雷雨》片段展演复盘" required />
                    </label>
                    <label>
                      日期
                      <input id="activityDate" type="date" required />
                    </label>
                    <label>
                      摘要
                      <textarea id="activitySummary" rows="5" maxlength="520" placeholder="简要记录活动内容、亮点或报名信息" required></textarea>
                    </label>
                    <label>
                      附件
                      <input id="activityFile" type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" />
                      <small class="field-note">简报、预告海报、排练照片、视频和文档都可以一起提交。</small>
                    </label>
                    <button class="primary-button" type="submit">提交审核</button>
                  </form>
                </div>
              </details>
            </header>
            <div class="events-archive-grid" id="activityArchiveList" aria-live="polite"></div>
          </section>

          <section class="events-cta" aria-labelledby="eventsCtaTitle">
            <div>
              <h3 id="eventsCtaTitle">每一次活动，都是我们与观众相遇的方式。</h3>
              <p>故事还在继续，下一次开场见。</p>
            </div>
            <div class="events-cta-actions">
              <button class="events-cta-button events-cta-button-secondary" data-view-target="home" type="button">了解话剧社 <span aria-hidden="true">↗</span></button>
              <button class="events-cta-button events-cta-button-primary" data-view-target="mailbox" type="button">加入我们 <span aria-hidden="true">↗</span></button>
            </div>
          </section>
        </div>
      </section>

      <section class="view module-screen activity-detail-screen" id="activityDetailScreen" data-view="activityDetail" aria-labelledby="activityDetailTitle">
        <div class="detail-page-shell" id="activityDetailContent"></div>
      </section>

      <section class="view module-screen mailbox-screen" id="mailboxScreen" data-view="mailbox" aria-labelledby="mailboxTitle">
        <div class="contact-page">
          <header class="contact-header">
            <div class="contact-heading">
              <h2 id="mailboxTitle">联系我们</h2>
              <p class="contact-wordmark">GET IN TOUCH</p>
              <p class="contact-lede">故事不会只发生在舞台上。</p>
            </div>
            <div class="contact-page-index" aria-label="页面编号 05 / 05">
              <span>THEATRE CLUB</span>
              <strong>05 / 05</strong>
              <span>OPEN CHANNEL</span>
            </div>
          </header>

          <div class="contact-intro-rule">
            <p>如果你有故事、想上台，或者只是想和我们聊聊，欢迎留下你的声音。</p>
            <span aria-hidden="true">A LETTER CAN BEGIN THE NEXT SCENE</span>
          </div>

          <div class="contact-layout">
            <section class="contact-information" aria-labelledby="contactInfoTitle">
              <div class="contact-section-heading">
                <span>THEATRE OFFICE</span>
                <h3 id="contactInfoTitle">写给话剧社</h3>
                <p>一封信可以从舞台之外抵达这里。公开来信会留下回声，私密来信只交给社团内部阅读。</p>
              </div>

              <dl class="contact-ledger">
                <div>
                  <dt>EMAIL</dt>
                  <dd>邮箱待补充</dd>
                  <small>资料占位</small>
                </div>
                <div>
                  <dt>OFFICIAL ACCOUNT</dt>
                  <dd>官方账号待补充</dd>
                  <small>资料占位</small>
                </div>
                <div>
                  <dt>VENUE</dt>
                  <dd>活动地点待补充</dd>
                  <small>资料占位</small>
                </div>
                <div>
                  <dt>CONTACT</dt>
                  <dd>负责人待补充</dd>
                  <small>资料占位</small>
                </div>
              </dl>

              <div class="contact-qr-placeholder">
                <div class="contact-qr-box" aria-label="二维码占位">
                  <span>QR</span>
                  <small>待补充</small>
                </div>
                <div>
                  <span>SCENE / 05</span>
                  <strong>二维码</strong>
                  <p>官方账号资料确认后，将在这里放置二维码。</p>
                </div>
              </div>

              <div class="contact-counts" aria-label="信箱统计">
                <span><strong id="visibleLetterMetric">0</strong><small>公开来信</small></span>
                <span><strong id="privateLetterMetric">0</strong><small>私密来信</small></span>
              </div>
            </section>

            <section class="contact-letter-paper" aria-labelledby="contactFormTitle">
              <div class="contact-letter-topline">
                <span>LETTER TO HUAYU</span>
                <span>05—05</span>
              </div>
              <div class="contact-form-heading">
                <h3 id="contactFormTitle">联系话剧社</h3>
                <p>留下你的问题或建议，也可以选择仅向社团管理员公开。</p>
              </div>
              <form class="contact-form" id="letterForm">
                <div class="contact-form-grid">
                  <label>
                    你的名字
                    <input id="letterContactName" type="text" maxlength="40" autocomplete="name" placeholder="登录后显示社员昵称" required />
                  </label>
                  <label>
                    联系方式
                    <input id="letterContact" type="text" maxlength="80" autocomplete="email" placeholder="可选，如邮箱或微信号" />
                  </label>
                </div>
                <label>
                  联系主题
                  <input id="letterSubject" type="text" maxlength="48" placeholder="例如：想了解幕后岗位" required />
                </label>
                <label>
                  想对我们说的话
                  <textarea id="letterBody" rows="7" maxlength="760" placeholder="写给华煜话剧社的话" required></textarea>
                </label>
                <fieldset class="contact-choice-group">
                  <legend>这封信希望如何被阅读？</legend>
                  <label>
                    <input type="radio" name="letterVisibility" value="public" />
                    公开，贴在回声墙上
                  </label>
                  <label>
                    <input type="radio" name="letterVisibility" value="private" checked />
                    不公开，只交给社团
                  </label>
                </fieldset>
                <label class="contact-attachment-field">
                  附件（可选）
                  <input id="letterAttachments" type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" />
                  <small class="field-note">可附上图片、视频、文档或排练材料；公开信请确认附件适合公开展示。</small>
                </label>
                <div class="contact-form-footer">
                  <small>未登录时可以先浏览信箱；发送消息前请先登录或注册。</small>
                  <button class="contact-submit-button" type="submit">发送消息 <span aria-hidden="true">↗</span></button>
                </div>
              </form>
            </section>
          </div>

          <section class="contact-voices" aria-labelledby="contactVoicesTitle">
            <div class="contact-voices-heading">
              <div>
                <span>PUBLIC VOICES</span>
                <h3 id="contactVoicesTitle">来自观众的声音</h3>
                <p>一些已经抵达的来信，以及社团留给它们的回声。</p>
              </div>
              <span id="mailboxAdminHint"></span>
            </div>
            <div class="letter-list contact-letter-list" id="letterList"></div>
          </section>

          <section class="contact-closing" aria-label="加入话剧社">
            <div>
              <span>A NOTE FOR THE NEXT SCENE</span>
              <h3>期待在下一次灯光亮起时，<br />与你在剧场相遇。</h3>
            </div>
            <button class="contact-closing-button" data-contact-focus="letterSubject" type="button">加入我们 <span aria-hidden="true">↗</span></button>
          </section>
        </div>
      </section>

      <section class="view module-screen letter-detail-screen" id="letterDetailScreen" data-view="letterDetail" aria-labelledby="letterDetailTitle">
        <div class="detail-page-shell" id="letterDetailContent"></div>
      </section>

      <section class="view module-screen writing-screen" id="writingScreen" data-view="writing" aria-labelledby="writingTitle">
        <div class="writing-gallery">
          <header class="writing-gallery-header">
            <div class="writing-gallery-heading">
              <h2 id="writingTitle">投稿作品</h2>
              <p class="writing-wordmark">SUBMIT YOUR STORY</p>
              <p class="writing-lede">让一个故事，找到愿意听见它的人。</p>
            </div>
            <div class="writing-header-actions">
              <button class="writing-header-submit" data-writing-open-submit type="button">
                我要投稿 <span aria-hidden="true">↗</span>
              </button>
              <div class="writing-page-index" aria-label="页面编号 04 / 05">
                <span>THEATRE CLUB / WORKS 04</span>
                <strong>04 / 05</strong>
                <span>WORKS GALLERY</span>
              </div>
            </div>
          </header>

          <div class="writing-intro-rule">
            <p>让还没有登上舞台的故事，先被看见。</p>
            <span aria-hidden="true">A STORY BEFORE THE STAGE</span>
          </div>

          <article class="writing-featured-work" id="writingFeatured" aria-live="polite"></article>

          <section class="writing-recent-section" aria-labelledby="writingRecentTitle">
            <header class="writing-section-header">
              <div>
                <span>RECENT WORKS</span>
                <h3 id="writingRecentTitle">最新投稿</h3>
                <p id="writingShelfTitle">正在展开当前征文主题</p>
              </div>
              <div class="writing-recent-meta">
                <strong id="essayMetric">0</strong>
                <span id="writingShelfHint">篇文章</span>
              </div>
            </header>
            <div class="writing-shelf" id="writingShelf" aria-live="polite"></div>
          </section>

          <section class="writing-open-calls" aria-labelledby="writingCallsTitle">
            <header class="writing-section-header writing-calls-header">
              <div>
                <span>OPEN CALLS</span>
                <h3 id="writingCallsTitle">当前征文主题</h3>
                <p>选择一个主题，查看它正在收集的文字。</p>
              </div>
              <div class="writing-calls-count"><strong id="writingEventMetric">0</strong><span>个主题</span></div>
            </header>
            <div class="writing-event-intro" id="writingEventIntro"></div>
            <div class="writing-event-list" id="writingEventList"></div>
          </section>

          <section class="writing-submit-band" aria-labelledby="writingSubmitTitle">
            <div>
              <span>OPEN THE PAGE</span>
              <h3 id="writingSubmitTitle">你也有一个想被听见的故事吗？</h3>
              <p>从一段独白、一页剧本，或一次观后感开始。</p>
            </div>
            <details class="writing-submit-details">
              <summary>我要投稿 <span>SUBMIT A WORK <b aria-hidden="true">↗</b></span></summary>
              <div class="writing-submit-form-wrap">
                <form class="writing-submit-form" id="essayForm">
                  <h4>把故事放上书架</h4>
                  <label>
                    文章标题
                    <input id="essayTitle" type="text" maxlength="52" placeholder="例如：一束灯光落下之前" required />
                  </label>
                  <label>
                    正文
                    <textarea id="essayBody" rows="7" maxlength="1800" placeholder="输入文章正文，可按段落填写" required></textarea>
                  </label>
                  <label>
                    附件（可选）
                    <input id="essayAttachments" type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt" />
                    <small class="field-note">可附图片、视频或文档，单个文件不超过 2.5MB。</small>
                  </label>
                  <button class="writing-form-submit" type="submit">提交作品 <span aria-hidden="true">↗</span></button>
                </form>
              </div>
            </details>
          </section>

          <details class="writing-admin-panel">
            <summary><span>社团内部：添加征文活动</span><small>MANAGE OPEN CALLS +</small></summary>
            <form class="writing-admin-form" id="writingEventForm">
              <label>
                活动名称
                <input id="writingEventTitle" type="text" maxlength="36" placeholder="例如：招新主题征文" required />
              </label>
              <label>
                征文说明
                <textarea id="writingEventPrompt" rows="4" maxlength="260" placeholder="填写主题、字数要求、投稿范围、截止时间说明" required></textarea>
              </label>
              <label>
                截止时间
                <input id="writingEventDeadline" type="date" />
              </label>
              <button class="writing-form-submit" type="submit">添加活动 <span aria-hidden="true">↗</span></button>
            </form>
          </details>
        </div>
      </section>

      <section class="view module-screen writing-detail-screen" id="essayDetailScreen" data-view="essayDetail" aria-labelledby="essayDetailTitle">
        <div class="detail-page-shell" id="essayDetailContent"></div>
      </section>

      <MemberProfile />

      <section class="view module-screen admin-screen" id="adminScreen" data-view="admin" aria-labelledby="adminTitle">
        <div class="module-hero admin-hero">
          <button class="back-button" data-view-target="home" type="button">返回首页</button>
          <div>
            <p class="section-kicker">Admin</p>
            <h2 id="adminTitle">管理员后台</h2>
            <p>使用社团秘书账号登录后，可以发布活动档案并管理注册账号。论坛内容统一在 QQ 频道中管理。</p>
          </div>
          <div class="module-stats">
            <span><strong id="pendingActivityMetric">0</strong> 待审活动</span>
          </div>
        </div>

        <div class="admin-layout module-canvas module-drawer-workspace" data-module-drawers>
          <div class="module-drawer-rail module-drawer-rail-two" aria-label="管理员功能">
            <button class="module-drawer-trigger" data-drawer-target="adminActivityDrawer" aria-controls="adminActivityDrawer" aria-expanded="false" type="button">
              <span class="module-drawer-index">01</span>
              <span class="module-drawer-copy">
                <small>EVENT REVIEW</small>
                <strong>活动审核</strong>
                <em>审批活动简报与预告</em>
              </span>
              <span class="module-drawer-arrow" aria-hidden="true"></span>
            </button>
            <button class="module-drawer-trigger" data-drawer-target="adminAccountDrawer" aria-controls="adminAccountDrawer" aria-expanded="false" type="button">
              <span class="module-drawer-index">02</span>
              <span class="module-drawer-copy">
                <small>ACCOUNT CONTROL</small>
                <strong>账号管理</strong>
                <em>查看并注销平台注册账号</em>
              </span>
              <span class="module-drawer-arrow" aria-hidden="true"></span>
            </button>
          </div>

          <div class="module-drawer-stack" id="adminReviewArea">
            <section class="module-drawer-panel" id="adminActivityDrawer" aria-hidden="true">
              <div class="module-drawer-reveal">
                <section class="review-board review-board-wide">
                  <div class="list-title">
                    <h3>活动档案待审</h3>
                    <span id="pendingActivityHint"></span>
                  </div>
                  <div class="review-list review-list-two" id="pendingActivityList"></div>
                </section>
              </div>
            </section>

            <section class="module-drawer-panel" id="adminAccountDrawer" aria-hidden="true">
              <div class="module-drawer-reveal">
                <section class="review-board review-board-wide account-management-board">
                  <div class="list-title">
                    <h3>账号管理</h3>
                    <span id="accountAdminHint"></span>
                  </div>
                  <div class="account-list" id="accountAdminList"></div>
                </section>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>

    <div class="modal hidden" id="authModal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="authTitle" aria-describedby="authDescription" inert>
      <div class="modal-panel auth-dialog">
        <aside class="auth-dialog-visual" aria-hidden="true">
          <div class="auth-dialog-brand">
            <img src="/assets/huayu-logo.png" alt="" />
            <span>华煜话剧社</span>
          </div>
          <div class="auth-dialog-visual-copy">
            <strong>回到社团空间</strong>
            <p>排练记录、活动资讯与社团来信，都在这里。</p>
          </div>
          <span class="auth-dialog-signature">HUAYU DRAMA CLUB</span>
        </aside>

        <section class="auth-dialog-content">
          <button class="modal-close" id="authCloseButton" type="button" aria-label="关闭登录窗口">×</button>
          <header class="auth-dialog-header">
            <h2 id="authTitle">登录账号</h2>
            <p id="authDescription">使用账号编号和密码进入社团空间。</p>
          </header>
          <div class="auth-tabs" role="tablist" aria-label="账号操作">
            <button class="auth-tab is-active" data-auth-mode="login" type="button" role="tab" aria-selected="true">登录</button>
            <button class="auth-tab" data-auth-mode="register" type="button" role="tab" aria-selected="false" tabindex="-1">注册</button>
          </div>
          <form id="authForm">
            <label class="auth-field">
              <span id="authUsernameLabel">账号编号</span>
              <input id="authUsername" type="text" minlength="2" maxlength="18" autocomplete="username" placeholder="例如 0000" required />
            </label>
            <label class="auth-field">
              <span>密码</span>
              <span class="auth-password-control">
                <input id="authPassword" type="password" minlength="1" maxlength="128" autocomplete="current-password" placeholder="请输入密码" required />
                <button class="auth-password-toggle" id="authPasswordToggle" type="button" aria-label="显示密码" aria-pressed="false">显示</button>
              </span>
            </label>
            <div class="register-only hidden" id="registerFields">
              <label class="auth-field">
                <span>邮箱</span>
                <input id="authEmail" type="email" maxlength="254" autocomplete="email" placeholder="用于接收注册验证码" />
              </label>
              <div class="verification-row">
                <label class="auth-field">
                  <span>验证码</span>
                  <input id="authCode" type="text" inputmode="numeric" maxlength="6" placeholder="输入 6 位验证码" />
                </label>
                <button class="secondary-button" id="sendCodeButton" type="button">发送验证码</button>
              </div>
              <p class="verification-note" id="verificationNote">验证码将发送到你的邮箱，10 分钟内有效。</p>
            </div>
            <p class="form-message" id="authMessage" aria-live="polite"></p>
            <button class="primary-button full-width" id="authSubmitButton" type="submit">登录</button>
            <p class="auth-account-note" id="authAccountNote">账号编号由系统分配，昵称不能用于登录。</p>
          </form>
        </section>
      </div>
    </div>

    <div class="scene-progress" aria-hidden="true">
      <span>HUAYU DRAMA CLUB</span>
      <i></i>
    </div>

    <div class="toast hidden" id="toast" role="status" aria-live="polite"></div>
</template>

<script setup>
import GlobalHeader from "./components/GlobalHeader.vue";
import MemberProfile from "./components/MemberProfile.vue";
import { QQ_CHANNEL, QQ_CHANNEL_SECTIONS, QQ_CHANNEL_SECTION_MAP } from "./community-config.js";
</script>


