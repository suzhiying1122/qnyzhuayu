<template>
  <header id="globalHeader" class="site-header" aria-label="站点导航">
    <button class="mobile-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="primaryNavigation" :aria-label="menuOpen ? '关闭导航' : '打开导航'" @click="toggleMenu"><X v-if="menuOpen" :size="21" /><Menu v-else :size="21" /></button>
    <button class="brand" data-view-target="home" type="button" aria-label="返回华煜话剧社首页">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>华煜话剧社</span>
    </button>

    <button v-if="menuOpen" class="mobile-menu-backdrop" tabindex="-1" aria-label="关闭导航" @click="closeMenu(true)"></button>
    <nav id="primaryNavigation" class="top-nav" :class="{ 'is-menu-open': menuOpen }" :inert="mobile && !menuOpen" aria-label="主导航" @click="onNavigate">
      <button class="nav-link" data-view-target="home" data-label="首页" type="button" aria-label="首页">首页</button>
      <button class="nav-link" data-view-target="forum" data-label="论坛" type="button" aria-label="论坛">论坛</button>
      <button class="nav-link" data-view-target="activities" data-label="活动资讯" type="button" aria-label="活动资讯">活动资讯</button>
      <button class="nav-link" data-view-target="writing" data-label="投稿作品" type="button" aria-label="投稿作品">投稿作品</button>
      <button class="nav-link" data-view-target="mailbox" data-label="联系我们" type="button" aria-label="联系我们">联系我们</button>
      <button class="nav-link hidden" id="adminNavButton" data-view-target="admin" data-label="管理后台" type="button">管理后台</button>
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
          <span class="sr-only">搜索活动、投稿作品或公开来信</span>
          <input id="globalSearchInput" type="search" autocomplete="off" placeholder="搜索活动、作品或公开来信" />
        </label>
        <button class="global-search-submit" type="submit">搜索</button>
        <button class="global-search-close" id="globalSearchCloseButton" type="button" aria-label="关闭搜索">×</button>
      </form>
      <div class="global-search-results" id="globalSearchResults" aria-live="polite"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Menu, X } from '@lucide/vue';
const menuOpen = ref(false);
const mobile = ref(false);
let media;
function closeMenu(restoreFocus = false) {
  menuOpen.value = false;
  document.body.classList.remove('mobile-navigation-open');
  if (restoreFocus) document.querySelector('.mobile-menu-toggle')?.focus();
}
function toggleMenu() {
  if (menuOpen.value) return closeMenu(true);
  menuOpen.value = true;
  document.body.classList.add('mobile-navigation-open');
}
function onNavigate(event) {
  if (event.target.closest('[data-view-target]')) closeMenu();
}
function syncViewport() { mobile.value = media.matches; if (!mobile.value) closeMenu(); }
function onKeydown(event) {
  if (!menuOpen.value) return;
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
  if (event.key !== 'Tab') return;
  const targets = [...document.querySelectorAll('.mobile-menu-toggle, #primaryNavigation button')].filter(el => el.checkVisibility());
  const first = targets[0], last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}
onMounted(() => {
  media = window.matchMedia('(max-width: 900px)');
  syncViewport();
  media.addEventListener('change', syncViewport);
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  media?.removeEventListener('change', syncViewport);
  document.removeEventListener('keydown', onKeydown);
  document.body.classList.remove('mobile-navigation-open');
});
</script>
