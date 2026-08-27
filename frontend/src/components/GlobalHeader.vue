<template>
  <header id="globalHeader" class="site-header" aria-label="站点导航">
    <button class="brand" data-view-target="home" type="button" aria-label="返回华煜话剧社首页">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>话剧社</span>
    </button>

    <nav class="top-nav" aria-label="主导航">
      <button class="nav-link" data-view-target="home" data-label="首页" type="button" aria-label="首页">首页</button>
      <button class="nav-link" data-view-target="forum" data-label="论坛" type="button" aria-label="论坛">论坛</button>
      <button class="nav-link" data-view-target="activities" data-label="活动资讯" type="button" aria-label="活动资讯">活动资讯</button>
      <button class="nav-link" data-view-target="writing" data-label="投稿作品" type="button" aria-label="投稿作品">投稿作品</button>
      <button class="nav-link" data-view-target="mailbox" data-label="联系我们" type="button" aria-label="联系我们">联系我们</button>
    </nav>

    <div class="header-actions">
      <button class="search-button" id="globalSearchButton" type="button" aria-label="搜索" title="搜索" aria-controls="globalSearchPanel" aria-expanded="false">
        <span class="search-icon" aria-hidden="true"></span>
      </button>
      <div class="account-area">
        <button class="account-avatar-button" id="accountAvatarButton" type="button" aria-label="打开个人主页">华</button>
        <button class="account-name" id="accountName" type="button">未登录</button>
        <button class="outline-button" id="authOpenButton" type="button">登录 / 注册</button>
        <button class="ghost-button hidden" id="logoutButton" type="button">退出</button>
      </div>
    </div>

    <div class="global-search-panel hidden" id="globalSearchPanel" role="search" aria-label="站内搜索">
      <form class="global-search-form" id="globalSearchForm">
        <label class="global-search-field">
          <span class="sr-only">搜索论坛、活动、投稿作品或来信</span>
          <input id="globalSearchInput" type="search" autocomplete="off" placeholder="搜索论坛、活动、投稿作品或来信" />
        </label>
        <button class="global-search-submit" type="submit">搜索</button>
        <button class="global-search-close" id="globalSearchCloseButton" type="button" aria-label="关闭搜索">×</button>
      </form>
      <div class="global-search-results" id="globalSearchResults" aria-live="polite"></div>
    </div>
  </header>
</template>
