<template>
  <section class="view member-page" id="profileScreen" data-view="profile" aria-labelledby="profileTitle">
    <div class="member-art" aria-hidden="true"></div>
    <div class="member-content" data-module-drawers data-drawer-persistent>
      <div class="member-breadcrumb">
        <button type="button" class="member-back" data-view-target="home"><ArrowLeft :size="16" />返回首页</button>
        <span aria-hidden="true">/</span>
        <span>个人空间</span>
      </div>

      <header class="member-heading">
        <h2 id="profileTitle">舞台之外，也是你。</h2>
        <p>每一份热爱，都有自己的署名。</p>
      </header>

      <div class="member-identity">
        <button class="member-avatar-edit" type="button" @click="openSection('profileEditDrawer')" aria-label="编辑头像与个人资料" title="编辑头像">
          <span class="member-avatar" id="profileAvatarPreview" aria-hidden="true">华</span>
          <span class="member-camera" aria-hidden="true"><Camera :size="14" /></span>
        </button>
        <div class="member-identity-copy">
          <h3 id="profileDisplayTitle">未登录</h3>
          <p id="profileRoleText">登录后完善你的社员资料</p>
          <div class="member-account-line">
            <span id="profileAccountNo">编号：未登录</span>
            <button type="button" class="member-icon-button" @click="copyAccount" :aria-label="copied ? '编号已复制' : '复制账号编号'" :title="copied ? '已复制' : '复制编号'"><Check v-if="copied" :size="14" /><Copy v-else :size="14" /></button>
          </div>
        </div>
        <button type="button" class="member-edit-button" @click="openSection('profileEditDrawer')"><Pencil :size="15" /><span>编辑资料</span></button>
      </div>

      <nav class="member-tabs" role="tablist" aria-label="个人主页功能">
        <button id="memberOverviewTab" type="button" role="tab" class="member-tab" data-drawer-target="profileCardDrawer" aria-controls="profileCardDrawer" aria-selected="false" tabindex="-1"><UserRound :size="17" /><span>个人档案</span></button>
        <button id="memberEditTab" type="button" role="tab" class="member-tab" data-drawer-target="profileEditDrawer" aria-controls="profileEditDrawer" aria-selected="false" tabindex="-1"><SlidersHorizontal :size="17" /><span>编辑资料</span></button>
        <button id="memberSecurityTab" type="button" role="tab" class="member-tab" data-drawer-target="profileSecurityDrawer" aria-controls="profileSecurityDrawer" aria-selected="false" tabindex="-1"><ShieldCheck :size="17" /><span>账号安全</span></button>
        <button id="memberFriendsTab" type="button" role="tab" class="member-tab" data-drawer-target="profileFriendsDrawer" aria-controls="profileFriendsDrawer" aria-selected="false" tabindex="-1"><MessagesSquare :size="17" /><span>好友私聊</span></button>
      </nav>

      <div class="member-panels">
        <section class="member-panel" data-drawer-panel id="profileCardDrawer" role="tabpanel" aria-labelledby="memberOverviewTab" aria-hidden="true" tabindex="0">
          <div class="member-section-heading"><h4>关于我</h4><button type="button" class="member-text-button" @click="openSection('profileEditDrawer')" aria-label="编辑个人介绍" title="编辑个人介绍"><Pencil :size="16" /></button></div>
          <p class="member-bio" id="profileIntroText">这里会显示你的个人介绍。</p>
          <div class="member-contributions">
            <h4>我的参与</h4>
            <dl>
              <div><dt>公开帖子</dt><dd id="profilePostMetric">0</dd></div>
              <div><dt>活动提交</dt><dd id="profileActivityMetric">0</dd></div>
            </dl>
          </div>
          <button type="button" class="member-activity-link" data-view-target="activities">
            <span class="member-activity-symbol"><Clapperboard :size="23" /></span>
            <span><strong>下一次相遇，在剧场</strong><small>看看社团最近的活动</small></span>
            <ArrowUpRight :size="21" />
          </button>
        </section>

        <section class="member-panel" data-drawer-panel id="profileEditDrawer" role="tabpanel" aria-labelledby="memberEditTab" aria-hidden="true">
          <form class="member-form" id="profileForm">
            <h4>编辑个人资料</h4>
            <label>展示姓名<input id="profileNameInput" type="text" maxlength="24" placeholder="填写你希望展示的姓名" autocomplete="nickname" required /></label>
            <label>社团职务<input id="profileClubRoleInput" type="text" maxlength="32" placeholder="演员、编剧、灯光，或你的其他角色" /></label>
            <label class="member-full">头像
              <input id="profileAvatarInput" type="file" accept="image/*" />
              <small>建议使用正方形图片，大小不超过 2.5MB。</small>
            </label>
            <label class="member-full">个人介绍<textarea id="profileIntroInput" rows="3" maxlength="260" placeholder="分享你的兴趣、擅长的事，或与话剧相遇的故事"></textarea><small>最多 260 字</small></label>
            <div class="member-form-footer"><button class="member-primary" type="submit"><Check :size="16" />保存修改</button></div>
          </form>
        </section>

        <section class="member-panel" data-drawer-panel id="profileSecurityDrawer" role="tabpanel" aria-labelledby="memberSecurityTab" aria-hidden="true">
          <form class="member-form member-password-form" id="passwordForm">
            <h4>修改密码</h4>
            <label>当前密码<input id="currentPassword" type="password" autocomplete="current-password" required /></label>
            <label>新密码<input id="newPassword" type="password" minlength="12" maxlength="128" autocomplete="new-password" required /></label>
            <label>确认新密码<input id="confirmPassword" type="password" minlength="12" maxlength="128" autocomplete="new-password" required /></label>
            <div class="member-form-footer"><button class="member-primary" type="submit"><ShieldCheck :size="16" />更新密码</button></div>
          </form>
        </section>

        <section class="member-panel" data-drawer-panel id="profileFriendsDrawer" role="tabpanel" aria-labelledby="memberFriendsTab" aria-hidden="true">
          <div class="member-friends">
            <form id="friendSearchForm" class="member-friend-search">
              <label for="friendSearchInput">认识一位新朋友</label>
              <div><input id="friendSearchInput" type="text" maxlength="24" placeholder="搜索账号编号或昵称" required /><button class="member-primary" type="submit"><UserPlus :size="16" /><span>添加好友</span></button></div>
            </form>
            <section class="member-friend-section"><div class="member-section-heading"><h4>收到的申请</h4><span id="friendRequestHint"></span></div><div class="friend-list" id="friendRequestList"></div></section>
            <section class="member-friend-section"><div class="member-section-heading"><h4>我的好友</h4><span id="friendListHint"></span></div><div class="friend-list" id="friendList"></div></section>
            <section id="privateChatPanel" class="member-chat" aria-label="好友私聊">
              <div id="privateChatEmpty" class="member-chat-empty"><MessagesSquare :size="25" /><span>选择一位好友，开始聊天。</span></div>
              <div class="hidden" id="privateChatRoom">
                <div class="chat-header"><div class="mini-avatar" id="chatFriendAvatar" aria-hidden="true">友</div><div><strong id="chatFriendName">好友</strong><span id="chatFriendMeta">编号</span></div></div>
                <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-label="私聊消息"></div>
                <form class="chat-compose" id="chatForm"><input id="chatInput" type="text" maxlength="300" placeholder="输入私聊内容" aria-label="私聊内容" autocomplete="off" /><button class="member-primary" type="submit"><Send :size="16" /><span>发送</span></button></form>
              </div>
            </section>
          </div>
        </section>
      </div>
      <footer class="member-footer"><img src="/assets/huayu-logo.png" alt="" width="24" height="24" /><span>华煜话剧社</span><span class="member-footer-note">在舞台上，遇见更多可能。</span></footer>
    </div>
    <p class="member-art-caption" aria-hidden="true">台上是角色<br />台下是我们。</p>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { ArrowLeft, ArrowUpRight, Camera, Check, Clapperboard, Copy, MessagesSquare, Pencil, Send, ShieldCheck, SlidersHorizontal, UserPlus, UserRound } from "@lucide/vue";

const copied = ref(false);
let copyTimer;
function openSection(id) {
  document.querySelector(`#profileScreen [role="tab"][data-drawer-target="${id}"]`)?.click();
}
async function copyAccount() {
  const value = document.getElementById("profileAccountNo")?.textContent.split("：")[1]?.trim();
  if (!value || value === "未登录") return;
  try {
    await navigator.clipboard.writeText(value);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    const element = document.getElementById("profileAccountNo");
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
onBeforeUnmount(() => clearTimeout(copyTimer));
</script>
