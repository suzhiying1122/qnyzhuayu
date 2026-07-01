const STORAGE_KEY = "huayu-drama-club-state-v2";
const LEGACY_STORAGE_KEY = "huayu-drama-club-state-v1";
const MAX_FILE_SIZE = 2.5 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENTS_SIZE = 8 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;
const VERIFICATION_TTL_MS = 5 * 60 * 1000;
const VALID_VIEWS = new Set([
  "home",
  "forum",
  "activities",
  "mailbox",
  "writing",
  "profile",
  "admin",
  "postDetail",
  "activityDetail",
  "letterDetail",
  "essayDetail",
]);
const VIEW_ROUTES = {
  home: "/",
  forum: "/forum/",
  activities: "/activities/",
  mailbox: "/mailbox/",
  writing: "/writing/",
  profile: "/profile/",
  admin: "/admin-panel/",
};

const initialState = {
  users: [
    {
      id: "user-admin",
      accountNo: "0000",
      username: "社团秘书",
      password: "huayu2026",
      role: "admin",
      profileName: "社团秘书",
      avatarData: "",
      intro: "负责华煜话剧社线上内容审核、活动档案发布和社团信箱回复。",
      clubRole: "管理员 / 社团秘书",
      phone: "",
      firstUsedAt: "2026-06-01T10:00:00.000Z",
      lastUsedAt: "2026-06-01T10:00:00.000Z",
      createdAt: "2026-06-01T10:00:00.000Z",
      friends: [],
      friendRequests: [],
      chats: {},
    },
  ],
  currentUserId: null,
  activeChatFriendId: "",
  activeView: "home",
  activePostId: "post-1",
  activeActivityId: "activity-1",
  activeLetterId: "letter-1",
  activeWritingEventId: "writing-event-main",
  activeEssayId: "essay-1",
  activityFilter: "all",
  posts: [
    {
      id: "post-1",
      title: "大家平时想在论坛里交流哪些话题？",
      body: "这里不限定内容方向，学习生活、社团日常、资源互助、兴趣分享、活动建议都可以发。也欢迎把你觉得有意思的话题开成帖子，让更多社员参与进来。",
      author: "社团秘书",
      tag: "交流",
      createdAt: "2026-06-18T12:10:00.000Z",
      approvedAt: "2026-06-18T12:40:00.000Z",
      attachments: [],
      comments: [
        {
          id: "comment-1",
          author: "南楼观众",
          body: "可以开一个资料互助帖，也可以放一些日常闲聊主题。",
          createdAt: "2026-06-18T13:05:00.000Z",
          approvedAt: "2026-06-18T13:30:00.000Z",
          attachments: [],
          replies: [
            {
              id: "reply-1",
              author: "社团秘书",
              body: "这个方向很好，后续可以把资料帖置顶成长期交流帖。",
              createdAt: "2026-06-18T14:05:00.000Z",
              attachments: [],
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: "post-2",
      title: "期末复习资料可以集中放一个帖子",
      body: "如果大家有公共课笔记、复习重点或者好用的学习方法，可以统一发在这个帖子下面，方便社员互相查找。",
      author: "学习互助组",
      tag: "互助",
      createdAt: "2026-06-14T09:25:00.000Z",
      approvedAt: "2026-06-14T10:00:00.000Z",
      attachments: [],
      comments: [],
    },
  ],
  pendingPosts: [
    {
      id: "pending-post-1",
      title: "想开一个社员闲聊帖",
      body: "大家可以在里面分享最近看的书、电影、音乐、课程体验，也可以约饭、约自习或者找搭子。",
      author: "青藤",
      tag: "闲聊",
      createdAt: "2026-06-24T15:10:00.000Z",
      attachments: [],
    },
  ],
  pendingComments: [],
  activities: [
    {
      id: "activity-1",
      type: "briefing",
      title: "《雷雨》片段展演复盘",
      date: "2026-05-26",
      summary: "完成三场片段展演，重点复盘了舞台调度、人物关系推进和灯光转场节奏。下一轮排练将补充走位记录和道具清单。",
      fileName: "",
      fileData: "",
      attachments: [],
      createdAt: "2026-05-27T10:00:00.000Z",
      approvedAt: "2026-05-27T11:00:00.000Z",
      author: "社团秘书",
    },
    {
      id: "activity-2",
      type: "preview",
      title: "夏季读本会：独幕剧夜读",
      date: "2026-07-06",
      summary: "面向全体成员开放，计划共读两部短剧并进行分组围读。欢迎携带自己喜欢的文本片段。",
      fileName: "",
      fileData: "",
      attachments: [],
      createdAt: "2026-06-21T15:30:00.000Z",
      approvedAt: "2026-06-21T16:00:00.000Z",
      author: "社团秘书",
    },
  ],
  pendingActivities: [
    {
      id: "pending-activity-1",
      type: "preview",
      title: "红幕夜读与即兴片段开放场",
      date: "2026-07-18",
      summary: "计划开放给全校同学参与，设置红色飘带布景、追光体验和十分钟即兴片段展示。",
      fileName: "",
      fileData: "",
      attachments: [],
      createdAt: "2026-06-25T10:15:00.000Z",
      author: "活动组",
    },
  ],
  letters: [
    {
      id: "letter-1",
      subject: "希望排练表可以更早公布",
      body: "如果每周排练时间能提前两三天同步，大家安排课程和晚自习会更从容。",
      visibility: "public",
      author: "匿名同学",
      createdAt: "2026-06-12T11:10:00.000Z",
      reply: "收到建议。之后排练表会在每周日晚前发布，如有临时变动会同步补发。",
      repliedAt: "2026-06-13T08:30:00.000Z",
      attachments: [],
    },
    {
      id: "letter-2",
      subject: "想增加幕后岗位介绍",
      body: "不少同学不一定想上台，但对灯光、音效、服化和舞监感兴趣。",
      visibility: "public",
      author: "青藤",
      createdAt: "2026-06-16T19:00:00.000Z",
      reply: "",
      repliedAt: "",
      attachments: [],
    },
  ],
  writingEvents: [
    {
      id: "writing-event-main",
      title: "长期投稿活动",
      prompt: "固定投稿入口：社员可提交文章、剧评、活动记录、剧本片段或社团建议。内容提交后会显示在征文板块，管理员可进行整理和删除。",
      deadline: "2026-09-30",
      fixed: true,
      author: "社团秘书",
      createdAt: "2026-06-18T09:00:00.000Z",
    },
    {
      id: "writing-event-2",
      title: "招新主题征文",
      prompt: "投稿范围包括招新说明、部门介绍、排练记录、活动经验和报名建议。文章可附图片、视频或文档，便于后续展示和整理。",
      deadline: "2026-08-20",
      fixed: false,
      author: "社团秘书",
      createdAt: "2026-06-21T10:00:00.000Z",
    },
  ],
  essays: [
    {
      id: "essay-1",
      eventId: "writing-event-main",
      title: "征文板块使用说明",
      body: "这个板块用于发布征文活动和收集文章。左侧选择活动，右侧查看对应文章。登录后可以新增活动，也可以在当前活动下提交文章和附件。",
      author: "社团秘书",
      createdAt: "2026-06-19T12:30:00.000Z",
      attachments: [],
    },
    {
      id: "essay-2",
      eventId: "writing-event-2",
      title: "招新投稿示例",
      body: "可以介绍社团部门、排练流程、活动安排、成员经验或报名建议。建议按小标题分段，方便新成员快速查找信息。",
      author: "南楼观众",
      createdAt: "2026-06-23T18:40:00.000Z",
      attachments: [],
    },
  ],
};

let state = loadState();
let authMode = "login";
let toastTimer = 0;
let registerVerification = {
  phone: "",
  code: "",
  expiresAt: 0,
};

const elements = {
  accountAvatarButton: document.querySelector("#accountAvatarButton"),
  accountName: document.querySelector("#accountName"),
  authOpenButton: document.querySelector("#authOpenButton"),
  authCloseButton: document.querySelector("#authCloseButton"),
  authModal: document.querySelector("#authModal"),
  authForm: document.querySelector("#authForm"),
  authUsernameLabel: document.querySelector("#authUsernameLabel"),
  authUsername: document.querySelector("#authUsername"),
  authPassword: document.querySelector("#authPassword"),
  authPhone: document.querySelector("#authPhone"),
  authCode: document.querySelector("#authCode"),
  registerFields: document.querySelector("#registerFields"),
  sendCodeButton: document.querySelector("#sendCodeButton"),
  verificationNote: document.querySelector("#verificationNote"),
  authMessage: document.querySelector("#authMessage"),
  authSubmitButton: document.querySelector("#authSubmitButton"),
  logoutButton: document.querySelector("#logoutButton"),
  adminNavButton: document.querySelector("#adminNavButton"),
  adminHomeGate: document.querySelector("#adminHomeGate"),
  threadList: document.querySelector("#threadList"),
  postDetailContent: document.querySelector("#postDetailContent"),
  activityDetailContent: document.querySelector("#activityDetailContent"),
  letterDetailContent: document.querySelector("#letterDetailContent"),
  postForm: document.querySelector("#postForm"),
  postTitle: document.querySelector("#postTitle"),
  postBody: document.querySelector("#postBody"),
  postTag: document.querySelector("#postTag"),
  postAttachments: document.querySelector("#postAttachments"),
  currentUserHint: document.querySelector("#currentUserHint"),
  activityForm: document.querySelector("#activityForm"),
  activityType: document.querySelector("#activityType"),
  activityTitle: document.querySelector("#activityTitle"),
  activityDate: document.querySelector("#activityDate"),
  activitySummary: document.querySelector("#activitySummary"),
  activityFile: document.querySelector("#activityFile"),
  activityList: document.querySelector("#activityList"),
  letterForm: document.querySelector("#letterForm"),
  letterSubject: document.querySelector("#letterSubject"),
  letterBody: document.querySelector("#letterBody"),
  letterAttachments: document.querySelector("#letterAttachments"),
  letterList: document.querySelector("#letterList"),
  mailboxAdminHint: document.querySelector("#mailboxAdminHint"),
  writingEventMetric: document.querySelector("#writingEventMetric"),
  essayMetric: document.querySelector("#essayMetric"),
  writingEventList: document.querySelector("#writingEventList"),
  writingEventIntro: document.querySelector("#writingEventIntro"),
  writingShelfTitle: document.querySelector("#writingShelfTitle"),
  writingShelfHint: document.querySelector("#writingShelfHint"),
  writingShelf: document.querySelector("#writingShelf"),
  writingEventForm: document.querySelector("#writingEventForm"),
  writingEventTitle: document.querySelector("#writingEventTitle"),
  writingEventPrompt: document.querySelector("#writingEventPrompt"),
  writingEventDeadline: document.querySelector("#writingEventDeadline"),
  essayForm: document.querySelector("#essayForm"),
  essayTitle: document.querySelector("#essayTitle"),
  essayBody: document.querySelector("#essayBody"),
  essayAttachments: document.querySelector("#essayAttachments"),
  essayDetailContent: document.querySelector("#essayDetailContent"),
  profileAvatarPreview: document.querySelector("#profileAvatarPreview"),
  profileDisplayTitle: document.querySelector("#profileDisplayTitle"),
  profileRoleText: document.querySelector("#profileRoleText"),
  profileAccountNo: document.querySelector("#profileAccountNo"),
  profileIntroText: document.querySelector("#profileIntroText"),
  profilePostMetric: document.querySelector("#profilePostMetric"),
  profileActivityMetric: document.querySelector("#profileActivityMetric"),
  profileForm: document.querySelector("#profileForm"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileAvatarInput: document.querySelector("#profileAvatarInput"),
  profileClubRoleInput: document.querySelector("#profileClubRoleInput"),
  profileIntroInput: document.querySelector("#profileIntroInput"),
  passwordForm: document.querySelector("#passwordForm"),
  currentPassword: document.querySelector("#currentPassword"),
  newPassword: document.querySelector("#newPassword"),
  confirmPassword: document.querySelector("#confirmPassword"),
  friendSearchForm: document.querySelector("#friendSearchForm"),
  friendSearchInput: document.querySelector("#friendSearchInput"),
  friendRequestHint: document.querySelector("#friendRequestHint"),
  friendRequestList: document.querySelector("#friendRequestList"),
  friendListHint: document.querySelector("#friendListHint"),
  friendList: document.querySelector("#friendList"),
  privateChatEmpty: document.querySelector("#privateChatEmpty"),
  privateChatRoom: document.querySelector("#privateChatRoom"),
  chatFriendAvatar: document.querySelector("#chatFriendAvatar"),
  chatFriendName: document.querySelector("#chatFriendName"),
  chatFriendMeta: document.querySelector("#chatFriendMeta"),
  chatMessages: document.querySelector("#chatMessages"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  postCount: document.querySelector("#postCount"),
  activityCount: document.querySelector("#activityCount"),
  publicLetterCount: document.querySelector("#publicLetterCount"),
  forumPostMetric: document.querySelector("#forumPostMetric"),
  forumCommentMetric: document.querySelector("#forumCommentMetric"),
  briefingMetric: document.querySelector("#briefingMetric"),
  previewMetric: document.querySelector("#previewMetric"),
  visibleLetterMetric: document.querySelector("#visibleLetterMetric"),
  privateLetterMetric: document.querySelector("#privateLetterMetric"),
  pendingPostMetric: document.querySelector("#pendingPostMetric"),
  pendingActivityMetric: document.querySelector("#pendingActivityMetric"),
  pendingPostHint: document.querySelector("#pendingPostHint"),
  pendingActivityHint: document.querySelector("#pendingActivityHint"),
  pendingPostList: document.querySelector("#pendingPostList"),
  pendingActivityList: document.querySelector("#pendingActivityList"),
  accountAdminHint: document.querySelector("#accountAdminHint"),
  accountAdminList: document.querySelector("#accountAdminList"),
  toast: document.querySelector("#toast"),
};

export function initLegacyApp() {
  applyHashView();
  bindEvents();
  syncStateFromApi();
  syncUsersFromApi({ silent: true });
  render();

  window.addEventListener("popstate", () => {
    applyHashView();
    render();
  });

  window.addEventListener("hashchange", () => {
    applyHashView();
    render();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncUsersFromApi({ silent: true });
  });
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.detail || "服务器请求失败");
  }
  return data;
}

async function syncStateFromApi() {
  try {
    const data = await apiRequest("/api/site-state");
    state.posts = Array.isArray(data.posts) ? data.posts : state.posts;
    state.pendingPosts = Array.isArray(data.pendingPosts) ? data.pendingPosts : state.pendingPosts;
    state.activities = Array.isArray(data.activities) ? data.activities : state.activities;
    state.pendingActivities = Array.isArray(data.pendingActivities) ? data.pendingActivities : state.pendingActivities;
    state.letters = Array.isArray(data.letters) ? data.letters : state.letters;
    state.writingEvents = Array.isArray(data.writingEvents) ? mergeFixedWritingEvents(data.writingEvents) : state.writingEvents;
    state.essays = Array.isArray(data.essays) ? data.essays : state.essays;
    ensureActivePost();
    ensureActiveWriting();
    render();
  } catch (error) {
    showToast(`后端数据同步失败：${error.message}`);
  }
}

async function syncUsersFromApi({ silent = false } = {}) {
  const currentBefore = currentUser();
  try {
    const data = await apiRequest("/api/users");
    if (!Array.isArray(data.users)) return;
    const shouldUploadCurrentProfile = mergeRemoteUsers(data.users, currentBefore);
    saveState();
    render();
    if (shouldUploadCurrentProfile) {
      await pushCurrentProfileToApi({ silent: true });
    }
  } catch (error) {
    if (!silent) showToast(`账号同步失败：${error.message}`);
  }
}

function mergeRemoteUsers(remoteUsers, currentBefore = null) {
  const localById = new Map(state.users.map((user) => [user.id, user]));
  const localByAccount = new Map(state.users.map((user) => [String(user.accountNo), user]));
  const remoteIds = new Set(remoteUsers.map((user) => user.id));
  const remoteAccounts = new Set(remoteUsers.map((user) => String(user.accountNo)));
  let shouldUploadCurrentProfile = false;
  const mergedUsers = remoteUsers.map((remote) => {
    const local = localById.get(remote.id) || localByAccount.get(String(remote.accountNo));
    const merged = {
      ...(local || {}),
      ...remote,
      password: remote.password || local?.password || "",
      avatarData: remote.avatarData || local?.avatarData || "",
      intro: remote.intro || local?.intro || "",
      clubRole: remote.clubRole || local?.clubRole || "",
      profileName: remote.profileName || local?.profileName || remote.username,
      friends: Array.isArray(remote.friends) ? remote.friends : local?.friends || [],
      friendRequests: Array.isArray(remote.friendRequests) ? remote.friendRequests : local?.friendRequests || [],
      chats: remote.chats && typeof remote.chats === "object" ? remote.chats : local?.chats || {},
    };
    ensureUserProfile(merged);
    if (
      currentBefore &&
      String(currentBefore.accountNo) === String(merged.accountNo) &&
      currentBefore.avatarData &&
      currentBefore.avatarData !== remote.avatarData
    ) {
      shouldUploadCurrentProfile = true;
    }
    return merged;
  });
  const localOnlyUsers = state.users.filter((user) => {
    if (!user.id || !user.accountNo) return false;
    return !remoteIds.has(user.id) && !remoteAccounts.has(String(user.accountNo));
  });
  state.users = [...mergedUsers, ...localOnlyUsers];
  ensureAdminUser(state);
  normalizeLoadedState(state);
  if (state.currentUserId && !state.users.some((user) => user.id === state.currentUserId)) {
    const matched = currentBefore
      ? state.users.find((user) => String(user.accountNo) === String(currentBefore.accountNo))
      : null;
    state.currentUserId = matched?.id || null;
  }
  return shouldUploadCurrentProfile;
}

function mergeReturnedUsers(users) {
  const incoming = Array.isArray(users) ? users : [users].filter(Boolean);
  if (!incoming.length) return;
  const byId = new Map(state.users.map((user) => [user.id, user]));
  const byAccount = new Map(state.users.map((user) => [String(user.accountNo), user]));
  incoming.forEach((remote) => {
    const existing = byId.get(remote.id) || byAccount.get(String(remote.accountNo));
    const merged = {
      ...(existing || {}),
      ...remote,
      password: remote.password || existing?.password || "",
      friends: Array.isArray(remote.friends) ? remote.friends : existing?.friends || [],
      friendRequests: Array.isArray(remote.friendRequests) ? remote.friendRequests : existing?.friendRequests || [],
      chats: remote.chats && typeof remote.chats === "object" ? remote.chats : existing?.chats || {},
    };
    ensureUserProfile(merged);
    if (existing) {
      Object.assign(existing, merged);
    } else {
      state.users.push(merged);
    }
  });
  normalizeLoadedState(state);
}

async function pushCurrentProfileToApi({ silent = false } = {}) {
  const user = currentUser();
  if (!user) return;
  try {
    const data = await apiRequest("/api/users/profile", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        profileName: user.profileName,
        avatarData: user.avatarData || "",
        clubRole: user.clubRole,
        intro: user.intro,
      }),
    });
    mergeReturnedUsers(data.user);
    saveState();
    render();
  } catch (error) {
    if (!silent) showToast(`个人资料同步失败：${error.message}`);
  }
}

function bindEvents() {
  bindInteractiveMotion();

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-target]");
    if (!button) return;
    event.preventDefault();
    setView(button.dataset.viewTarget);
  });

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      authMode = button.dataset.authMode;
      renderAuthMode();
    });
  });

  document.querySelectorAll("[data-activity-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activityFilter = button.dataset.activityFilter;
      saveState();
      renderActivities();
    });
  });

  elements.authOpenButton.addEventListener("click", openAuthModal);
  elements.accountAvatarButton.addEventListener("click", () => {
    if (currentUser()) {
      setView("profile");
      return;
    }
    openAuthModal();
  });
  elements.accountName.addEventListener("click", () => {
    if (currentUser()) {
      setView("profile");
      return;
    }
    openAuthModal();
  });
  elements.authCloseButton.addEventListener("click", closeAuthModal);
  elements.authModal.addEventListener("click", (event) => {
    if (event.target === elements.authModal) closeAuthModal();
  });

  elements.logoutButton.addEventListener("click", () => {
    state.currentUserId = null;
    saveState();
    showToast("已退出当前账号");
    render();
  });

  elements.authForm.addEventListener("submit", handleAuth);
  elements.sendCodeButton.addEventListener("click", handleSendCode);
  elements.postForm.addEventListener("submit", handlePostSubmit);
  elements.activityForm.addEventListener("submit", handleActivitySubmit);
  elements.letterForm.addEventListener("submit", handleLetterSubmit);
  elements.writingEventForm.addEventListener("submit", handleWritingEventSubmit);
  elements.essayForm.addEventListener("submit", handleEssaySubmit);
  elements.profileForm.addEventListener("submit", handleProfileSubmit);
  elements.passwordForm.addEventListener("submit", handlePasswordSubmit);
  elements.friendSearchForm.addEventListener("submit", handleFriendSearchSubmit);
  elements.chatForm.addEventListener("submit", handleChatSubmit);
}

function bindInteractiveMotion() {
  const interactiveSelector = [
    ".module-gate",
    ".thread-card",
    ".activity-card[data-activity-id]",
    ".letter-card[data-letter-id]",
    ".essay-book-open",
  ].join(",");

  const resetMotion = (target) => {
    target.style.setProperty("--pointer-x", "50%");
    target.style.setProperty("--pointer-y", "50%");
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
  };

  document.addEventListener("pointermove", (event) => {
    const target = event.target.closest(interactiveSelector);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltX = ((50 - y) / 50) * 3.2;
    const tiltY = ((x - 50) / 50) * 3.2;

    target.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x)).toFixed(1)}%`);
    target.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
    target.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    target.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest?.(interactiveSelector);
    if (!target || target.contains(event.relatedTarget)) return;
    resetMotion(target);
  }, true);

  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(interactiveSelector);
    if (target) target.classList.add("is-pressing");
  });

  ["pointerup", "pointercancel"].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      document.querySelectorAll(".is-pressing").forEach((target) => {
        target.classList.remove("is-pressing");
        resetMotion(target);
      });
    });
  });
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY));
    if (!saved || !Array.isArray(saved.posts)) return prepareState(structuredClone(initialState));
    const merged = {
      ...structuredClone(initialState),
      ...saved,
      activeView: saved.activeView || saved.activeTab || "home",
      activePostId: saved.activePostId || "post-1",
      activeActivityId: saved.activeActivityId || "activity-1",
      activeLetterId: saved.activeLetterId || "letter-1",
      activeWritingEventId: saved.activeWritingEventId || "writing-event-main",
      activeEssayId: saved.activeEssayId || "essay-1",
      activeChatFriendId: saved.activeChatFriendId || "",
      pendingPosts: Array.isArray(saved.pendingPosts) ? saved.pendingPosts : [],
      pendingComments: Array.isArray(saved.pendingComments) ? saved.pendingComments : [],
      pendingActivities: Array.isArray(saved.pendingActivities) ? saved.pendingActivities : [],
      writingEvents: Array.isArray(saved.writingEvents)
        ? mergeFixedWritingEvents(saved.writingEvents)
        : structuredClone(initialState.writingEvents),
      essays: Array.isArray(saved.essays) ? saved.essays : structuredClone(initialState.essays),
    };
    return prepareState(merged);
  } catch {
    return prepareState(structuredClone(initialState));
  }
}

function prepareState(targetState) {
  ensureAdminUser(targetState);
  normalizeLoadedState(targetState);
  normalizeSeedForumContent(targetState);
  return targetState;
}

function ensureAdminUser(targetState) {
  const admin = targetState.users.find((user) => user.username === "社团秘书");
  if (admin) {
    if (!admin.password) admin.password = "huayu2026";
    admin.role = "admin";
    admin.accountNo = "0000";
    ensureUserProfile(admin);
    return;
  }
  targetState.users.unshift(structuredClone(initialState.users[0]));
}

function normalizeLoadedState(targetState) {
  assignMissingAccountNumbers(targetState);
  targetState.users.forEach(ensureUserProfile);
  targetState.posts.forEach((post) => {
    post.attachments = normalizeAttachments(post);
    post.comments = Array.isArray(post.comments) ? post.comments : [];
    post.comments = post.comments.map(normalizeCommentThread);
  });
  targetState.pendingPosts.forEach((post) => {
    post.attachments = normalizeAttachments(post);
  });
  targetState.pendingComments.forEach((comment) => {
    comment.attachments = normalizeAttachments(comment);
  });
  migratePendingComments(targetState);
  targetState.activities.forEach((activity) => {
    activity.attachments = normalizeAttachments(activity);
  });
  targetState.pendingActivities.forEach((activity) => {
    activity.attachments = normalizeAttachments(activity);
  });
  targetState.letters.forEach((letter) => {
    letter.attachments = normalizeAttachments(letter);
  });
  targetState.writingEvents = mergeFixedWritingEvents(targetState.writingEvents);
  targetState.writingEvents.forEach((event) => {
    event.title = event.title || "未命名征文活动";
    event.prompt = event.prompt || "暂无征文说明。";
    event.deadline = event.deadline || "";
    event.author = event.author || "社团秘书";
    event.createdAt = event.createdAt || new Date().toISOString();
    event.fixed = Boolean(event.fixed);
  });
  targetState.essays = Array.isArray(targetState.essays) ? targetState.essays : [];
  targetState.essays.forEach((essay) => {
    essay.eventId = essay.eventId || "writing-event-main";
    essay.title = essay.title || "未命名文章";
    essay.body = essay.body || "";
    essay.author = essay.author || "匿名社员";
    essay.createdAt = essay.createdAt || new Date().toISOString();
    essay.attachments = normalizeAttachments(essay);
  });
}

function assignMissingAccountNumbers(targetState) {
  const used = new Set();
  targetState.users.forEach((user) => {
    if (user.username === "社团秘书" || user.role === "admin") {
      user.accountNo = "0000";
    }
    if (user.accountNo) used.add(String(user.accountNo));
  });

  targetState.users.forEach((user) => {
    if (!user.accountNo) {
      user.accountNo = nextAccountNo(used);
    }
    used.add(String(user.accountNo));
  });
}

function nextAccountNo(used = new Set(state?.users?.map((user) => String(user.accountNo)).filter(Boolean) || [])) {
  let next = 1;
  while (used.has(String(next).padStart(4, "0"))) next += 1;
  return String(next).padStart(4, "0");
}

function mergeFixedWritingEvents(events) {
  const incoming = Array.isArray(events) ? events.map((event) => ({ ...event })) : [];
  const fixed = structuredClone(initialState.writingEvents[0]);
  const existingFixedIndex = incoming.findIndex((event) => event.id === fixed.id);
  if (existingFixedIndex >= 0) {
    incoming[existingFixedIndex] = { ...fixed, ...incoming[existingFixedIndex], fixed: true };
    return incoming;
  }
  return [fixed, ...incoming];
}

function normalizeCommentThread(comment) {
  const normalized = {
    ...comment,
    id: comment.id || createId("comment"),
    author: comment.author || "匿名社员",
    body: comment.body || "",
    createdAt: comment.createdAt || new Date().toISOString(),
    attachments: normalizeAttachments(comment),
    replies: Array.isArray(comment.replies) ? comment.replies.map(normalizeCommentThread) : [],
  };
  return normalized;
}

function migratePendingComments(targetState) {
  if (!Array.isArray(targetState.pendingComments) || !targetState.pendingComments.length) return;
  targetState.pendingComments.forEach((comment) => {
    const post = targetState.posts.find((item) => item.id === comment.postId);
    if (!post) return;
    post.comments.push(
      normalizeCommentThread({
        id: comment.id || createId("comment"),
        author: comment.author,
        body: comment.body,
        createdAt: comment.createdAt,
        attachments: comment.attachments || [],
        replies: [],
      }),
    );
  });
  targetState.pendingComments = [];
}

function ensureUserProfile(user) {
  user.accountNo = user.accountNo || "";
  user.profileName = user.profileName || user.username;
  user.avatarData = user.avatarData || "";
  user.intro = user.intro || "";
  user.clubRole = user.clubRole || (user.role === "admin" ? "管理员 / 社团秘书" : "社员");
  user.phone = user.phone || "";
  user.friends = Array.isArray(user.friends) ? user.friends : [];
  user.friendRequests = Array.isArray(user.friendRequests) ? user.friendRequests : [];
  user.chats = user.chats && typeof user.chats === "object" ? user.chats : {};
  user.firstUsedAt = user.firstUsedAt || user.createdAt || new Date().toISOString();
  user.lastUsedAt = user.lastUsedAt || user.firstUsedAt;
  user.createdAt = user.createdAt || user.firstUsedAt;
}

function normalizeSeedForumContent(targetState) {
  const seedPostOne = targetState.posts.find((post) => post.id === "post-1");
  if (seedPostOne) {
    seedPostOne.title = initialState.posts[0].title;
    seedPostOne.body = initialState.posts[0].body;
    seedPostOne.tag = initialState.posts[0].tag;
    seedPostOne.author = initialState.posts[0].author;
    const seedComment = seedPostOne.comments?.find((comment) => comment.id === "comment-1");
    if (seedComment) Object.assign(seedComment, initialState.posts[0].comments[0]);
  }

  const seedPostTwo = targetState.posts.find((post) => post.id === "post-2");
  if (seedPostTwo) {
    seedPostTwo.title = initialState.posts[1].title;
    seedPostTwo.body = initialState.posts[1].body;
    seedPostTwo.tag = initialState.posts[1].tag;
    seedPostTwo.author = initialState.posts[1].author;
  }

  const seedPendingPost = targetState.pendingPosts.find((post) => post.id === "pending-post-1");
  if (seedPendingPost) {
    Object.assign(seedPendingPost, initialState.pendingPosts[0]);
  }

}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  ensureActivePost();
  ensureActiveWriting();
  renderView();
  renderAccount();
  renderStats();
  renderForum();
  renderActivities();
  renderMailbox();
  renderWriting();
  renderProfile();
  renderAdmin();
  renderPostDetail();
  renderActivityDetail();
  renderLetterDetail();
  renderEssayDetail();
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function isAdmin() {
  return currentUser()?.role === "admin";
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function setView(viewName) {
  if (!VALID_VIEWS.has(viewName)) return;
  if (viewName === "profile" && !currentUser()) {
    openAuthModal();
    showToast("请先登录或注册账号");
    return;
  }
  if (viewName === "admin" && !isAdmin()) {
    openAuthModal();
    showToast("请先使用管理员账号登录");
    return;
  }
  state.activeView = viewName;
  saveState();
  renderView();
  if (viewName === "postDetail") renderPostDetail();
  if (viewName === "activityDetail") renderActivityDetail();
  if (viewName === "letterDetail") renderLetterDetail();
  if (viewName === "essayDetail") renderEssayDetail();
  updateHash(viewName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyHashView() {
  const routeView = getViewFromPath(window.location.pathname);
  if (routeView) {
    state.activeView = routeView.view;
    if (routeView.postId) state.activePostId = routeView.postId;
    if (routeView.activityId) state.activeActivityId = routeView.activityId;
    if (routeView.letterId) state.activeLetterId = routeView.letterId;
    if (routeView.essayId) state.activeEssayId = routeView.essayId;
    return;
  }

  const viewName = decodeURIComponent(window.location.hash.replace("#", ""));
  if (viewName.startsWith("post/")) {
    state.activePostId = viewName.slice(5);
    state.activeView = "postDetail";
    return;
  }
  if (viewName.startsWith("activity/")) {
    state.activeActivityId = viewName.slice(9);
    state.activeView = "activityDetail";
    return;
  }
  if (viewName.startsWith("letter/")) {
    state.activeLetterId = viewName.slice(7);
    state.activeView = "letterDetail";
    return;
  }
  if (viewName.startsWith("essay/")) {
    state.activeEssayId = viewName.slice(6);
    state.activeView = "essayDetail";
    return;
  }
  if (VALID_VIEWS.has(viewName)) {
    state.activeView = viewName;
  }
}

function updateHash(viewName) {
  const nextPath = getPathForView(viewName);
  if (window.location.pathname === nextPath && !window.location.hash) return;
  const nextUrl = `${nextPath}${window.location.search}`;
  window.history.pushState(null, "", nextUrl);
}

function getPathForView(viewName) {
  if (viewName === "postDetail") return `/forum/${encodeURIComponent(state.activePostId || "")}/`;
  if (viewName === "activityDetail") return `/activities/${encodeURIComponent(state.activeActivityId || "")}/`;
  if (viewName === "letterDetail") return `/mailbox/${encodeURIComponent(state.activeLetterId || "")}/`;
  if (viewName === "essayDetail") return `/writing/${encodeURIComponent(state.activeEssayId || "")}/`;
  return VIEW_ROUTES[viewName] || "/";
}

function getViewFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return { view: "home" };
  if (parts[0] === "forum") {
    return parts[1] ? { view: "postDetail", postId: parts[1] } : { view: "forum" };
  }
  if (parts[0] === "activities") {
    return parts[1] ? { view: "activityDetail", activityId: parts[1] } : { view: "activities" };
  }
  if (parts[0] === "mailbox") {
    return parts[1] ? { view: "letterDetail", letterId: parts[1] } : { view: "mailbox" };
  }
  if (parts[0] === "writing") {
    return parts[1] ? { view: "essayDetail", essayId: parts[1] } : { view: "writing" };
  }
  if (parts[0] === "profile") return { view: "profile" };
  if (parts[0] === "admin-panel") return { view: "admin" };
  return null;
}

function renderView() {
  if (state.activeView === "admin" && !isAdmin()) {
    state.activeView = "home";
    updateHash("home");
  }
  if (state.activeView === "profile" && !currentUser()) {
    state.activeView = "home";
    updateHash("home");
  }
  if (state.activeView === "postDetail" && !state.posts.some((post) => post.id === state.activePostId)) {
    state.activeView = "forum";
    updateHash("forum");
  }
  if (state.activeView === "activityDetail" && !state.activities.some((activity) => activity.id === state.activeActivityId)) {
    state.activeView = "activities";
    updateHash("activities");
  }
  if (state.activeView === "letterDetail" && !state.letters.some((letter) => letter.id === state.activeLetterId && letter.visibility === "public")) {
    state.activeView = "mailbox";
    updateHash("mailbox");
  }
  if (state.activeView === "essayDetail" && !state.essays.some((essay) => essay.id === state.activeEssayId)) {
    state.activeView = "writing";
    updateHash("writing");
  }

  document.body.dataset.view = state.activeView;
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === state.activeView);
  });

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    const isActive = button.dataset.viewTarget === state.activeView;
    button.classList.toggle("is-active", isActive);
    if (button.classList.contains("nav-link")) {
      button.setAttribute("aria-current", isActive ? "page" : "false");
    }
  });
}

function renderAccount() {
  const user = currentUser();
  const admin = isAdmin();
  if (user) ensureUserProfile(user);
  elements.accountName.textContent = user ? `${getUserDisplayName(user)} · ${user.accountNo}` : "未登录";
  elements.accountName.classList.toggle("is-clickable", Boolean(user));
  elements.accountAvatarButton.textContent = user?.avatarData ? "" : getUserInitial(user);
  elements.accountAvatarButton.style.backgroundImage = user?.avatarData ? `url("${user.avatarData}")` : "";
  elements.accountAvatarButton.classList.toggle("is-logged-in", Boolean(user));
  elements.authOpenButton.classList.toggle("hidden", Boolean(user));
  elements.logoutButton.classList.toggle("hidden", !user);
  elements.adminNavButton.classList.toggle("hidden", !admin);
  elements.adminHomeGate.classList.toggle("hidden", !admin);
  elements.currentUserHint.textContent = user ? `${getUserDisplayName(user)}（编号 ${user.accountNo}）可自由交流，公开前需审核` : "注册账号后可提交话题不限的内容";
}

function renderStats() {
  const publicLetters = state.letters.filter((letter) => letter.visibility === "public");
  const privateLetters = state.letters.filter((letter) => letter.visibility === "private");
  const briefingCount = state.activities.filter((activity) => activity.type === "briefing").length;
  const previewCount = state.activities.filter((activity) => activity.type === "preview").length;
  const commentCount = state.posts.reduce((sum, post) => sum + countCommentThreads(post.comments), 0);
  const user = currentUser();
  const userName = user ? getUserDisplayName(user) : "";
  const userActivityCount = userName ? state.activities.filter((activity) => activity.author === userName).length : 0;

  elements.postCount.textContent = state.posts.length;
  elements.activityCount.textContent = state.activities.length;
  elements.publicLetterCount.textContent = publicLetters.length;
  elements.forumPostMetric.textContent = state.posts.length;
  elements.forumCommentMetric.textContent = commentCount;
  elements.briefingMetric.textContent = briefingCount;
  elements.previewMetric.textContent = previewCount;
  elements.visibleLetterMetric.textContent = publicLetters.length;
  elements.privateLetterMetric.textContent = privateLetters.length;
  elements.writingEventMetric.textContent = state.writingEvents.length;
  elements.essayMetric.textContent = state.essays.length;
  elements.pendingPostMetric.textContent = state.pendingPosts.length;
  elements.pendingActivityMetric.textContent = state.pendingActivities.length;
  elements.profilePostMetric.textContent = userName ? state.posts.filter((post) => post.author === userName).length : 0;
  elements.profileActivityMetric.textContent = userActivityCount;
}

function renderForum() {
  const user = currentUser();
  elements.postTitle.disabled = !user;
  elements.postBody.disabled = !user;
  elements.postTag.disabled = !user;
  elements.postAttachments.disabled = !user;
  elements.postForm.querySelector("button").disabled = !user;

  elements.threadList.innerHTML = state.posts.length
    ? state.posts
        .slice()
        .sort((a, b) => new Date(b.approvedAt || b.createdAt) - new Date(a.approvedAt || a.createdAt))
        .map(renderPostCard)
        .join("")
    : `<div class="empty-state">还没有公开帖子。</div>`;

  elements.threadList.querySelectorAll("[data-open-post]").forEach((button) => {
    button.addEventListener("click", () => {
      openDetailView("post", button.dataset.openPost);
    });
  });

  elements.threadList.querySelectorAll("[data-delete-post]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deletePost(button.dataset.deletePost);
    });
  });

  elements.threadList.querySelectorAll("[data-post-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-post], [data-delete-post], button, a, input, textarea, select")) return;
      openDetailView("post", card.dataset.postId);
    });
  });
}

function renderPostCard(post) {
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const attachmentText = renderAttachmentCount(post);
  return `
    <article class="thread-card ${post.id === state.activePostId ? "is-active" : ""}" data-post-id="${post.id}">
      <div class="tag-row">
        <span class="tag">${escapeHtml(post.tag || "讨论")}</span>
        <span>${countCommentThreads(comments)} 条留言</span>
        ${attachmentText}
      </div>
      <button class="thread-title-button" type="button" data-open-post="${post.id}">
        <h4>${escapeHtml(post.title)}</h4>
      </button>
      <div class="thread-preview">${escapeHtml(getExcerpt(post.body, 96))}</div>
      <div class="meta-row">
        <span>${escapeHtml(post.author)}</span>
        <span>${formatDateTime(post.approvedAt || post.createdAt)}</span>
      </div>
      ${
        isAdmin()
          ? `<div class="post-admin-actions"><button class="reject-button" data-delete-post="${post.id}" type="button">删除帖子</button></div>`
          : ""
      }
    </article>
  `;
}

async function handlePostSubmit(event) {
  event.preventDefault();
  if (!requireLogin()) return;
  const title = elements.postTitle.value.trim();
  const body = elements.postBody.value.trim();
  const tag = elements.postTag.value.trim() || "讨论";
  if (!title || !body) return;
  let attachments = [];
  try {
    attachments = await readFilesAsAttachments(elements.postAttachments.files);
  } catch (error) {
    showToast(error.message);
    return;
  }

  try {
    const data = await apiRequest("/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        author: getUserDisplayName(currentUser()),
        tag,
        attachments,
      }),
    });
    state.pendingPosts.unshift(data.result);
  } catch (error) {
    showToast(error.message);
    return;
  }
  elements.postForm.reset();
  showToast("帖子已提交管理员审核");
  render();
}

async function handleActivitySubmit(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  let attachments = [];
  try {
    attachments = await readFilesAsAttachments(elements.activityFile.files);
  } catch (error) {
    showToast(error.message);
    return;
  }

  try {
    const data = await apiRequest("/api/activities", {
      method: "POST",
      body: JSON.stringify({
        type: elements.activityType.value,
        title: elements.activityTitle.value.trim(),
        date: elements.activityDate.value,
        summary: elements.activitySummary.value.trim(),
        author: getUserDisplayName(currentUser()),
        attachments,
      }),
    });
    state.pendingActivities.unshift(data.result);
  } catch (error) {
    showToast(error.message);
    return;
  }

  elements.activityForm.reset();
  showToast("活动已提交管理员审核");
  render();
}

function renderActivities() {
  document.querySelectorAll("[data-activity-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.activityFilter === state.activityFilter);
  });

  const user = currentUser();
  elements.activityForm.querySelectorAll("input, textarea, select, button").forEach((field) => {
    field.disabled = !user;
  });

  const filtered = state.activities
    .filter((activity) => state.activityFilter === "all" || activity.type === state.activityFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  elements.activityList.innerHTML = filtered.length
    ? filtered.map(renderActivityCard).join("")
    : `<div class="empty-state">当前筛选下暂无公开活动。</div>`;

  elements.activityList.querySelectorAll("[data-open-activity]").forEach((button) => {
    button.addEventListener("click", () => openDetailView("activity", button.dataset.openActivity));
  });

  elements.activityList.querySelectorAll("[data-delete-activity]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteActivity(button.dataset.deleteActivity);
    });
  });

  elements.activityList.querySelectorAll("[data-activity-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-activity], [data-delete-activity], button, input, textarea, select, a")) return;
      openDetailView("activity", card.dataset.activityId);
    });
  });
}

function renderActivityCard(activity) {
  const isPreview = activity.type === "preview";
  const typeText = isPreview ? "活动预告" : "活动简报";
  const attachmentText = renderAttachmentCount(activity) || `<span>暂无附件</span>`;
  return `
    <article class="activity-card" data-activity-id="${activity.id}">
      <div class="tag-row">
        <span class="type-pill ${isPreview ? "preview" : ""}">${typeText}</span>
        <span>${formatDate(activity.date)}</span>
      </div>
      <button class="card-title-button" type="button" data-open-activity="${activity.id}">
        <h3>${escapeHtml(activity.title)}</h3>
      </button>
      <div class="activity-summary">${escapeHtml(activity.summary)}</div>
      <footer>
        <span>${escapeHtml(activity.author || "华煜话剧社")}</span>
        ${attachmentText}
      </footer>
      ${isAdmin() ? `<div class="post-admin-actions"><button class="reject-button" data-delete-activity="${activity.id}" type="button">删除活动</button></div>` : ""}
    </article>
  `;
}

async function handleLetterSubmit(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  const visibility = new FormData(elements.letterForm).get("letterVisibility");
  let attachments = [];
  try {
    attachments = await readFilesAsAttachments(elements.letterAttachments.files);
  } catch (error) {
    showToast(error.message);
    return;
  }

  try {
    const data = await apiRequest("/api/letters", {
      method: "POST",
      body: JSON.stringify({
        subject: elements.letterSubject.value.trim(),
        body: elements.letterBody.value.trim(),
        visibility,
        author: visibility === "public" ? getUserDisplayName(currentUser()) : "匿名来信",
        attachments,
      }),
    });
    state.letters.unshift(data.result);
  } catch (error) {
    showToast(error.message);
    return;
  }
  elements.letterForm.reset();
  elements.letterForm.querySelector("input[value='public']").checked = true;
  showToast(visibility === "public" ? "公开信件已投递" : "不公开信件已投递");
  render();
}

function renderMailbox() {
  const user = currentUser();
  elements.letterForm.querySelectorAll("input, textarea, button").forEach((field) => {
    field.disabled = !user;
  });
  elements.mailboxAdminHint.textContent = isAdmin()
    ? "管理员可回复公开信件"
    : "";

  const publicLetters = state.letters
    .filter((letter) => letter.visibility === "public")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  elements.letterList.innerHTML = publicLetters.length
    ? publicLetters.map(renderLetterCard).join("")
    : `<div class="empty-state">暂无公开信件。</div>`;

  elements.letterList.querySelectorAll("[data-open-letter]").forEach((button) => {
    button.addEventListener("click", () => openDetailView("letter", button.dataset.openLetter));
  });

  elements.letterList.querySelectorAll("[data-delete-letter]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteLetter(button.dataset.deleteLetter);
    });
  });

  elements.letterList.querySelectorAll("[data-letter-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-letter], [data-delete-letter], button, input, textarea, select, a")) return;
      openDetailView("letter", card.dataset.letterId);
    });
  });

  elements.letterList.querySelectorAll("[data-reply-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminAccess()) return;
      const letter = state.letters.find((item) => item.id === form.dataset.replyForm);
      const replyBody = form.querySelector("textarea").value.trim();
      if (!letter || !replyBody) return;
      try {
        const data = await apiRequest(`/api/admin/letters/${letter.id}/reply`, {
          method: "POST",
          body: JSON.stringify({ reply: replyBody }),
        });
        Object.assign(letter, data.result);
        showToast("社团回复已发布");
        render();
      } catch (error) {
        showToast(error.message);
      }
    });
  });
}

function renderLetterCard(letter) {
  const replyHtml = letter.reply
    ? `<div class="club-reply"><strong>社团回复：</strong>${escapeHtml(letter.reply)}</div>`
    : `<div class="empty-state">等待社团回复。</div>`;

  return `
    <article class="letter-card" data-letter-id="${letter.id}">
      <div class="tag-row">
        <span class="reply-pill">公开信件</span>
        <span>${escapeHtml(letter.author)} · ${formatDateTime(letter.createdAt)}</span>
      </div>
      <button class="card-title-button" type="button" data-open-letter="${letter.id}">
        <h3>${escapeHtml(letter.subject)}</h3>
      </button>
      <div class="letter-body">${escapeHtml(letter.body)}</div>
      ${renderAttachmentList(letter, "compact")}
      ${replyHtml}
      <footer>
        <span>${renderAttachmentCount(letter) || "无附件"}</span>
        <span>${letter.reply ? "已回复" : "待回复"}</span>
      </footer>
      ${isAdmin() ? `<div class="post-admin-actions"><button class="reject-button" data-delete-letter="${letter.id}" type="button">删除信件</button></div>` : ""}
    </article>
  `;
}

function renderWriting() {
  ensureActiveWriting();
  const user = currentUser();
  const activeEvent = getActiveWritingEvent();
  const essays = getEssaysForActiveWritingEvent();

  elements.writingEventForm.querySelectorAll("input, textarea, button").forEach((field) => {
    field.disabled = !user;
  });
  elements.essayForm.querySelectorAll("input, textarea, button").forEach((field) => {
    field.disabled = !user || !activeEvent;
  });

  elements.writingEventList.innerHTML = state.writingEvents.length
    ? state.writingEvents.map(renderWritingEventCard).join("")
    : `<div class="empty-state">暂无征文活动。</div>`;

  elements.writingShelfTitle.textContent = activeEvent ? activeEvent.title : "文章列表";
  elements.writingShelfHint.textContent = activeEvent
    ? `${essays.length} 篇文章，点击条目阅读`
    : "先选择一个征文活动";
  elements.writingEventIntro.innerHTML = activeEvent
    ? `
      <div>
        <span class="type-pill ${activeEvent.fixed ? "" : "preview"}">${activeEvent.fixed ? "固定征文" : "征文活动"}</span>
        ${activeEvent.deadline ? `<span>截止 ${formatDate(activeEvent.deadline)}</span>` : `<span>长期开放</span>`}
      </div>
      <p>${escapeHtml(activeEvent.prompt)}</p>
    `
    : `<div class="empty-state">还没有可展示的征文活动。</div>`;

  elements.writingShelf.innerHTML = essays.length
    ? essays.map(renderEssayBook).join("")
    : `<div class="empty-state writing-empty-state">这个活动还没有文章，可以登录后提交。</div>`;

  elements.writingEventList.querySelectorAll("[data-writing-event]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeWritingEventId = button.dataset.writingEvent;
      const nextEssay = getEssaysForActiveWritingEvent()[0];
      state.activeEssayId = nextEssay?.id || "";
      saveState();
      renderWriting();
    });
  });

  elements.writingShelf.querySelectorAll("[data-open-essay]").forEach((button) => {
    button.addEventListener("click", () => openDetailView("essay", button.dataset.openEssay));
  });

  elements.writingShelf.querySelectorAll("[data-delete-essay]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteEssay(button.dataset.deleteEssay);
    });
  });
}

function renderWritingEventCard(event) {
  const count = state.essays.filter((essay) => essay.eventId === event.id).length;
  return `
    <button class="writing-event-card ${event.id === state.activeWritingEventId ? "is-active" : ""}" type="button" data-writing-event="${event.id}">
      <span class="writing-event-mark">${event.fixed ? "定" : "征"}</span>
      <span>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${event.deadline ? `截止 ${formatDate(event.deadline)}` : "长期开放"} · ${count} 篇</small>
        <em>${escapeHtml(getExcerpt(event.prompt, 36))}</em>
      </span>
    </button>
  `;
}

function renderEssayBook(essay, index) {
  const event = state.writingEvents.find((item) => item.id === essay.eventId);
  const tone = index % 5;
  return `
    <article class="essay-book essay-book-tone-${tone}" style="--book-index:${index}" data-essay-id="${essay.id}">
      <button class="essay-book-open" type="button" data-open-essay="${essay.id}" aria-label="阅读 ${escapeAttribute(essay.title)}">
        <span class="book-spine"></span>
        <span class="book-cover">
          <span class="book-label">${escapeHtml(event?.title || "征文")}</span>
          <strong>${escapeHtml(essay.title)}</strong>
          <small>${escapeHtml(essay.author)} · ${formatDateTime(essay.createdAt)}</small>
          <em>${escapeHtml(getExcerpt(essay.body, 52))}</em>
        </span>
      </button>
      ${
        isAdmin()
          ? `<button class="reject-button essay-delete-button" data-delete-essay="${essay.id}" type="button">删除</button>`
          : ""
      }
    </article>
  `;
}

async function handleWritingEventSubmit(event) {
  event.preventDefault();
  if (!requireLogin()) return;

  const title = elements.writingEventTitle.value.trim();
  const prompt = elements.writingEventPrompt.value.trim();
  const deadline = elements.writingEventDeadline.value;
  if (!title || !prompt) return;

  const payload = {
    title,
    prompt,
    deadline,
    author: getUserDisplayName(currentUser()),
  };

  let newEvent = null;
  try {
    const data = await apiRequest("/api/writing/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    newEvent = data.result;
  } catch (error) {
    newEvent = {
      id: createId("writing-event"),
      ...payload,
      fixed: false,
      createdAt: new Date().toISOString(),
    };
    showToast("线上接口暂不可用，已先保存到本机");
  }

  state.writingEvents.push(newEvent);
  state.activeWritingEventId = newEvent.id;
  elements.writingEventForm.reset();
  saveState();
  showToast("征文活动已添加");
  render();
}

async function handleEssaySubmit(event) {
  event.preventDefault();
  if (!requireLogin()) return;
  const activeEvent = getActiveWritingEvent();
  if (!activeEvent) return;

  let attachments = [];
  try {
    attachments = await readFilesAsAttachments(elements.essayAttachments.files);
  } catch (error) {
    showToast(error.message);
    return;
  }

  const payload = {
    eventId: activeEvent.id,
    title: elements.essayTitle.value.trim(),
    body: elements.essayBody.value.trim(),
    author: getUserDisplayName(currentUser()),
    attachments,
  };
  if (!payload.title || !payload.body) return;

  let essay = null;
  try {
    const data = await apiRequest("/api/writing/essays", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    essay = data.result;
  } catch (error) {
    essay = {
      id: createId("essay"),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    showToast("线上接口暂不可用，已先保存到本机");
  }

  state.essays.unshift(essay);
  state.activeEssayId = essay.id;
  elements.essayForm.reset();
  saveState();
  showToast("文章已提交到征文板块");
  render();
}

function getActiveWritingEvent() {
  return state.writingEvents.find((event) => event.id === state.activeWritingEventId) || state.writingEvents[0] || null;
}

function getEssaysForActiveWritingEvent() {
  return state.essays
    .filter((essay) => essay.eventId === state.activeWritingEventId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderProfile() {
  const user = currentUser();
  const admin = isAdmin();
  if (!user) {
    elements.profileDisplayTitle.textContent = "未登录";
    elements.profileRoleText.textContent = "登录后完善你的社员资料";
    elements.profileAccountNo.textContent = "编号：未登录";
    elements.profileIntroText.textContent = "这里会显示你的个人介绍。";
    elements.profileAvatarPreview.textContent = "华";
    elements.profileAvatarPreview.style.backgroundImage = "";
    elements.profileForm.querySelectorAll("input, textarea, button").forEach((field) => {
      field.disabled = true;
    });
    elements.passwordForm.querySelectorAll("input, button").forEach((field) => {
      field.disabled = true;
    });
    elements.friendSearchForm.querySelectorAll("input, button").forEach((field) => {
      field.disabled = true;
    });
    elements.friendRequestHint.textContent = "";
    elements.friendRequestList.innerHTML = `<div class="empty-state">登录后查看好友申请。</div>`;
    elements.friendListHint.textContent = "";
    elements.friendList.innerHTML = `<div class="empty-state">登录后添加好友。</div>`;
    return;
  }

  ensureUserProfile(user);
  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);
  elements.profileDisplayTitle.textContent = displayName;
  elements.profileRoleText.textContent = user.clubRole || (admin ? "管理员 / 社团秘书" : "社员");
  elements.profileAccountNo.textContent = `编号：${user.accountNo}`;
  elements.profileIntroText.textContent = user.intro || "还没有填写个人介绍。";
  elements.profileAvatarPreview.textContent = user.avatarData ? "" : initial;
  elements.profileAvatarPreview.style.backgroundImage = user.avatarData ? `url("${user.avatarData}")` : "";
  elements.profileNameInput.value = user.profileName || user.username;
  elements.profileClubRoleInput.value = user.clubRole || "";
  elements.profileIntroInput.value = user.intro || "";
  elements.profileForm.querySelectorAll("input, textarea, button").forEach((field) => {
    field.disabled = false;
  });
  elements.passwordForm.querySelectorAll("input, button").forEach((field) => {
    field.disabled = false;
  });
  elements.friendSearchForm.querySelectorAll("input, button").forEach((field) => {
    field.disabled = false;
  });
  renderFriends(user);
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const avatarFile = elements.profileAvatarInput.files[0];
  if (avatarFile && !avatarFile.type.startsWith("image/")) {
    showToast("头像需要上传图片文件");
    return;
  }
  if (avatarFile && avatarFile.size > MAX_FILE_SIZE) {
    showToast("头像超过 2.5MB，请先压缩后再上传");
    return;
  }

  let avatarData = user.avatarData || "";
  if (avatarFile) avatarData = await readFileAsDataUrl(avatarFile);

  user.profileName = elements.profileNameInput.value.trim() || user.username;
  user.avatarData = avatarData;
  user.clubRole = elements.profileClubRoleInput.value.trim() || (user.role === "admin" ? "管理员 / 社团秘书" : "社员");
  user.intro = elements.profileIntroInput.value.trim();

  try {
    saveState();
  } catch {
    showToast("浏览器本地空间不足，头像未保存");
    return;
  }

  elements.profileAvatarInput.value = "";
  await pushCurrentProfileToApi({ silent: true });
  showToast("个人资料已保存");
  render();
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const currentPassword = elements.currentPassword.value;
  const newPassword = elements.newPassword.value;
  const confirmPassword = elements.confirmPassword.value;
  if (newPassword !== confirmPassword) {
    showToast("两次输入的新密码不一致");
    return;
  }
  if (newPassword.length < 4) {
    showToast("新密码至少需要 4 位");
    return;
  }

  try {
    const data = await apiRequest("/api/users/password", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        currentPassword,
        newPassword,
      }),
    });
    mergeReturnedUsers(data.user);
  } catch (error) {
    if (user.password && currentPassword !== user.password) {
      showToast(error.message || "当前密码不正确");
      return;
    }
    user.password = newPassword;
  }
  saveState();
  elements.passwordForm.reset();
  showToast("密码已更新");
  renderAccount();
}

function renderFriends(user) {
  const incoming = user.friendRequests
    .map((request) => ({
      ...request,
      fromUser: state.users.find((item) => item.id === request.fromUserId),
    }))
    .filter((request) => request.fromUser);
  const friends = user.friends
    .map((friendId) => state.users.find((item) => item.id === friendId))
    .filter(Boolean);

  elements.friendRequestHint.textContent = `${incoming.length} 条待处理`;
  elements.friendListHint.textContent = `${friends.length} 位好友`;
  elements.friendRequestList.innerHTML = incoming.length
    ? incoming.map(renderFriendRequestRow).join("")
    : `<div class="empty-state">暂无新的好友申请。</div>`;
  elements.friendList.innerHTML = friends.length
    ? friends.map(renderFriendRow).join("")
    : `<div class="empty-state">还没有好友，可以用编号或昵称搜索添加。</div>`;

  elements.friendRequestList.querySelectorAll("[data-accept-friend]").forEach((button) => {
    button.addEventListener("click", () => respondFriendRequest(button.dataset.acceptFriend, true));
  });
  elements.friendRequestList.querySelectorAll("[data-ignore-friend]").forEach((button) => {
    button.addEventListener("click", () => respondFriendRequest(button.dataset.ignoreFriend, false));
  });
  elements.friendList.querySelectorAll("[data-open-chat]").forEach((button) => {
    button.addEventListener("click", () => openPrivateChat(button.dataset.openChat));
  });
  renderPrivateChat(user);
}

function renderFriendRequestRow(request) {
  const fromUser = request.fromUser;
  return `
    <article class="friend-row">
      <div class="mini-avatar" style="${avatarStyle(fromUser)}">${fromUser.avatarData ? "" : escapeHtml(getUserInitial(fromUser))}</div>
      <div>
        <strong>${escapeHtml(getUserDisplayName(fromUser))}</strong>
        <span>编号 ${escapeHtml(fromUser.accountNo)} · ${formatDateTime(request.createdAt)}</span>
      </div>
      <div class="friend-actions">
        <button class="approve-button" data-accept-friend="${fromUser.id}" type="button">同意</button>
        <button class="ghost-light-button" data-ignore-friend="${fromUser.id}" type="button">忽略</button>
      </div>
    </article>
  `;
}

function renderFriendRow(friend) {
  return `
    <article class="friend-row">
      <div class="mini-avatar" style="${avatarStyle(friend)}">${friend.avatarData ? "" : escapeHtml(getUserInitial(friend))}</div>
      <div>
        <strong>${escapeHtml(getUserDisplayName(friend))}</strong>
        <span>编号 ${escapeHtml(friend.accountNo)} · ${escapeHtml(friend.clubRole || "社员")}</span>
      </div>
      <div class="friend-actions">
        <button class="secondary-button" data-open-chat="${friend.id}" type="button">私聊</button>
      </div>
    </article>
  `;
}

async function handleFriendSearchSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const query = elements.friendSearchInput.value.trim();
  if (!query) return;
  const target = state.users.find((item) => item.id !== user.id && (String(item.accountNo) === query || getUserDisplayName(item) === query || item.username === query));
  if (!target) {
    showToast("没有找到这个编号或昵称");
    return;
  }
  ensureUserProfile(target);
  if (user.friends.includes(target.id)) {
    showToast("你们已经是好友");
    return;
  }
  if (target.friendRequests.some((request) => request.fromUserId === user.id)) {
    showToast("好友申请已经发送，等待对方处理");
    return;
  }
  const requestRecord = {
    fromUserId: user.id,
    createdAt: new Date().toISOString(),
  };
  try {
    const data = await apiRequest("/api/users/friend-request", {
      method: "POST",
      body: JSON.stringify({ fromUserId: user.id, targetId: target.id }),
    });
    mergeReturnedUsers(data.users);
  } catch (error) {
    target.friendRequests.unshift(requestRecord);
    showToast(`已本地记录，云端同步失败：${error.message}`);
  }
  elements.friendSearchForm.reset();
  saveState();
  showToast(`已向 ${getUserDisplayName(target)} 发送好友申请`);
  renderProfile();
}

async function respondFriendRequest(fromUserId, accepted) {
  const user = currentUser();
  if (!user) return;
  const fromUser = state.users.find((item) => item.id === fromUserId);
  let handledLocally = false;
  try {
    const data = await apiRequest("/api/users/friend-response", {
      method: "POST",
      body: JSON.stringify({ userId: user.id, fromUserId, accepted }),
    });
    mergeReturnedUsers(data.users);
  } catch (error) {
    handledLocally = true;
    user.friendRequests = user.friendRequests.filter((request) => request.fromUserId !== fromUserId);
    if (accepted && fromUser) {
      ensureUserProfile(fromUser);
      if (!user.friends.includes(fromUser.id)) user.friends.push(fromUser.id);
      if (!fromUser.friends.includes(user.id)) fromUser.friends.push(user.id);
      showToast(`已本地添加，云端同步失败：${error.message}`);
    } else {
      showToast("已忽略好友申请");
    }
  }
  if (!handledLocally && accepted && fromUser) showToast(`已添加 ${getUserDisplayName(fromUser)} 为好友`);
  if (!handledLocally && !accepted) showToast("已忽略好友申请");
  saveState();
  renderProfile();
}

function openPrivateChat(friendId) {
  const user = currentUser();
  if (!user || !user.friends.includes(friendId)) return;
  state.activeChatFriendId = friendId;
  saveState();
  renderProfile();
  elements.chatInput.focus();
}

function renderPrivateChat(user) {
  const friend = state.users.find((item) => item.id === state.activeChatFriendId && user.friends.includes(item.id));
  if (!friend) {
    state.activeChatFriendId = "";
    elements.privateChatEmpty.classList.remove("hidden");
    elements.privateChatRoom.classList.add("hidden");
    elements.chatMessages.innerHTML = "";
    return;
  }

  ensureUserProfile(friend);
  const messages = getChatMessages(user, friend.id);
  elements.privateChatEmpty.classList.add("hidden");
  elements.privateChatRoom.classList.remove("hidden");
  elements.chatFriendAvatar.textContent = friend.avatarData ? "" : getUserInitial(friend);
  elements.chatFriendAvatar.style.backgroundImage = friend.avatarData ? `url("${friend.avatarData}")` : "";
  elements.chatFriendName.textContent = getUserDisplayName(friend);
  elements.chatFriendMeta.textContent = `编号 ${friend.accountNo}`;
  elements.chatMessages.innerHTML = messages.length
    ? messages.map((message) => renderChatMessage(message, user.id)).join("")
    : `<div class="empty-state">还没有消息，发一句开始聊天。</div>`;
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function renderChatMessage(message, currentUserId) {
  const fromMe = message.fromUserId === currentUserId;
  return `
    <article class="chat-bubble ${fromMe ? "from-me" : "from-friend"}">
      <p>${escapeHtml(message.body)}</p>
      <span>${formatDateTime(message.createdAt)}</span>
    </article>
  `;
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  const friend = state.users.find((item) => item.id === state.activeChatFriendId);
  if (!user || !friend || !user.friends.includes(friend.id)) {
    showToast("请先选择一位好友");
    return;
  }

  const body = elements.chatInput.value.trim();
  if (!body) return;
  const message = {
    id: createId("message"),
    fromUserId: user.id,
    toUserId: friend.id,
    body,
    createdAt: new Date().toISOString(),
  };
  try {
    const data = await apiRequest("/api/users/chat", {
      method: "POST",
      body: JSON.stringify({
        fromUserId: user.id,
        toUserId: friend.id,
        body,
      }),
    });
    mergeReturnedUsers(data.users);
  } catch (error) {
    ensureUserProfile(friend);
    user.chats[friend.id] = [...getChatMessages(user, friend.id), message];
    friend.chats[user.id] = [...getChatMessages(friend, user.id), message];
    showToast(`消息已本地保存，云端同步失败：${error.message}`);
  }
  elements.chatForm.reset();
  saveState();
  renderProfile();
}

function getChatMessages(user, friendId) {
  ensureUserProfile(user);
  return Array.isArray(user.chats[friendId]) ? user.chats[friendId] : [];
}

function renderAdmin() {
  const admin = isAdmin();

  elements.pendingPostHint.textContent = `${state.pendingPosts.length} 条待处理`;
  elements.pendingActivityHint.textContent = `${state.pendingActivities.length} 条待处理`;
  elements.accountAdminHint.textContent = admin
    ? `${state.users.length} 个账号 · 仅展示账号与使用时间`
    : "管理员登录后可查看";

  elements.pendingPostList.innerHTML = admin
    ? state.pendingPosts.length
      ? state.pendingPosts.map(renderPendingPost).join("")
      : `<div class="empty-state">暂无待审核帖子。</div>`
    : `<div class="empty-state">管理员登录后可查看待审内容。</div>`;

  elements.pendingActivityList.innerHTML = admin
    ? state.pendingActivities.length
      ? state.pendingActivities.map(renderPendingActivity).join("")
      : `<div class="empty-state">暂无待审核活动。</div>`
    : `<div class="empty-state">管理员登录后可查看待审内容。</div>`;

  elements.accountAdminList.innerHTML = admin
    ? state.users
        .slice()
        .sort((a, b) => new Date(b.lastUsedAt || b.createdAt) - new Date(a.lastUsedAt || a.createdAt))
        .map(renderAccountAdminRow)
        .join("")
    : `<div class="empty-state">管理员登录后可查看账号列表。</div>`;

  elements.pendingPostList.querySelectorAll("[data-approve-post]").forEach((button) => {
    button.addEventListener("click", () => approvePost(button.dataset.approvePost));
  });
  elements.pendingPostList.querySelectorAll("[data-reject-post]").forEach((button) => {
    button.addEventListener("click", () => rejectPending("post", button.dataset.rejectPost));
  });
  elements.pendingActivityList.querySelectorAll("[data-approve-activity]").forEach((button) => {
    button.addEventListener("click", () => approveActivity(button.dataset.approveActivity));
  });
  elements.pendingActivityList.querySelectorAll("[data-reject-activity]").forEach((button) => {
    button.addEventListener("click", () => rejectPending("activity", button.dataset.rejectActivity));
  });
  elements.accountAdminList.querySelectorAll("[data-delete-user]").forEach((button) => {
    button.addEventListener("click", () => deleteUserAccount(button.dataset.deleteUser));
  });
}

function renderPendingPost(item) {
  return `
    <article class="review-card">
      <div class="tag-row">
        <span class="tag">${escapeHtml(item.tag || "讨论")}</span>
        <span>${escapeHtml(item.author)} · ${formatDateTime(item.createdAt)}</span>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.body)}</p>
      ${renderAttachmentList(item, "compact")}
      <div class="review-actions">
        <button class="approve-button" data-approve-post="${item.id}" type="button">通过发布</button>
        <button class="reject-button" data-reject-post="${item.id}" type="button">驳回</button>
      </div>
    </article>
  `;
}

function renderPendingComment(item) {
  return `
    <article class="review-card">
      <div class="tag-row">
        <span class="tag">留言</span>
        <span>${escapeHtml(item.author)} · ${formatDateTime(item.createdAt)}</span>
      </div>
      <h4>${escapeHtml(item.postTitle)}</h4>
      <p>${escapeHtml(item.body)}</p>
      <div class="review-actions">
        <button class="approve-button" data-approve-comment="${item.id}" type="button">通过发布</button>
        <button class="reject-button" data-reject-comment="${item.id}" type="button">驳回</button>
      </div>
    </article>
  `;
}

function renderPendingActivity(item) {
  const isPreview = item.type === "preview";
  const typeText = isPreview ? "活动预告" : "活动简报";
  return `
    <article class="review-card">
      <div class="tag-row">
        <span class="type-pill ${isPreview ? "preview" : ""}">${typeText}</span>
        <span>${escapeHtml(item.author)} · ${formatDate(item.date)}</span>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.summary)}</p>
      ${renderAttachmentList(item, "compact")}
      <div class="review-actions">
        <button class="approve-button" data-approve-activity="${item.id}" type="button">通过发布</button>
        <button class="reject-button" data-reject-activity="${item.id}" type="button">驳回</button>
      </div>
    </article>
  `;
}

function renderAccountAdminRow(user) {
  const isProtected = user.role === "admin" || user.id === state.currentUserId;
  return `
    <article class="account-row">
      <div>
        <strong>${escapeHtml(user.username)}</strong>
        <span>编号 ${escapeHtml(user.accountNo)} · ${user.role === "admin" ? "设备管理员" : "注册账号"}</span>
      </div>
      <dl>
        <div>
          <dt>首次使用</dt>
          <dd>${formatDateTime(user.firstUsedAt || user.createdAt)}</dd>
        </div>
        <div>
          <dt>最近使用</dt>
          <dd>${formatDateTime(user.lastUsedAt || user.createdAt)}</dd>
        </div>
      </dl>
      <button class="reject-button" data-delete-user="${user.id}" type="button" ${!isProtected ? "" : "disabled"}>
        ${isProtected ? "不可注销" : "注销账号"}
      </button>
    </article>
  `;
}

function requireAdminAccess() {
  if (!isAdmin()) {
    openAuthModal();
    showToast("请先使用管理员账号登录");
    return false;
  }
  return true;
}

async function deleteUserAccount(id) {
  if (!requireAdminAccess()) return;
  const target = state.users.find((user) => user.id === id);
  if (!target) return;
  if (target.role === "admin" || target.id === state.currentUserId) {
    showToast("管理员账号不能在这里注销");
    return;
  }
  const ok = window.confirm(`确定注销账号“${target.username}”吗？注销后该账号不能再登录。`);
  if (!ok) return;
  try {
    await apiRequest(`/api/users/${id}`, { method: "DELETE" });
  } catch (error) {
    showToast(`云端注销失败，已先本地注销：${error.message}`);
  }
  state.users = state.users.filter((user) => user.id !== id);
  state.users.forEach((user) => {
    user.friends = (user.friends || []).filter((friendId) => friendId !== id);
    user.friendRequests = (user.friendRequests || []).filter((request) => request.fromUserId !== id);
    if (user.chats) delete user.chats[id];
  });
  if (state.activeChatFriendId === id) state.activeChatFriendId = "";
  saveState();
  showToast("账号已注销");
  render();
}

async function deletePost(id) {
  if (!requireAdminAccess()) return;
  const post = state.posts.find((item) => item.id === id);
  if (!post) return;
  const ok = window.confirm(`确定删除帖子“${post.title}”吗？删除后帖子和下面的留言都会消失。`);
  if (!ok) return;

  try {
    await apiRequest(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    showToast(error.message);
    return;
  }

  state.posts = state.posts.filter((item) => item.id !== id);
  if (state.activePostId === id) {
    state.activePostId = state.posts[0]?.id || "";
    if (state.activeView === "postDetail") {
      state.activeView = "forum";
      updateHash("forum");
    }
  }
  saveState();
  showToast("帖子已删除");
  render();
}

async function deleteActivity(id) {
  if (!requireAdminAccess()) return;
  const activity = state.activities.find((item) => item.id === id);
  if (!activity) return;
  const ok = window.confirm(`确定删除活动“${activity.title}”吗？删除后这条简报或预告会从活动档案馆移除。`);
  if (!ok) return;

  try {
    await apiRequest(`/api/admin/activities/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    showToast(error.message);
    return;
  }

  state.activities = state.activities.filter((item) => item.id !== id);
  if (state.activeActivityId === id) {
    state.activeActivityId = state.activities[0]?.id || "";
    if (state.activeView === "activityDetail") {
      state.activeView = "activities";
      updateHash("activities");
    }
  }
  saveState();
  showToast("活动已删除");
  render();
}

async function deleteLetter(id) {
  if (!requireAdminAccess()) return;
  const letter = state.letters.find((item) => item.id === id);
  if (!letter) return;
  const ok = window.confirm(`确定删除信件“${letter.subject}”吗？删除后公开信件和社团回复都会消失。`);
  if (!ok) return;

  try {
    await apiRequest(`/api/admin/letters/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    showToast(error.message);
    return;
  }

  state.letters = state.letters.filter((item) => item.id !== id);
  if (state.activeLetterId === id) {
    state.activeLetterId = state.letters.find((item) => item.visibility === "public")?.id || "";
    if (state.activeView === "letterDetail") {
      state.activeView = "mailbox";
      updateHash("mailbox");
    }
  }
  saveState();
  showToast("信件已删除");
  render();
}

async function deleteEssay(id) {
  if (!requireAdminAccess()) return;
  const essay = state.essays.find((item) => item.id === id);
  if (!essay) return;
  const ok = window.confirm(`确定删除征文“${essay.title}”吗？删除后这篇文章会从书架移除。`);
  if (!ok) return;

  try {
    await apiRequest(`/api/admin/essays/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (!String(id).startsWith("essay-")) {
      showToast(error.message);
      return;
    }
  }

  state.essays = state.essays.filter((item) => item.id !== id);
  if (state.activeEssayId === id) {
    const nextEssay = getEssaysForActiveWritingEvent()[0] || state.essays[0];
    state.activeEssayId = nextEssay?.id || "";
    if (state.activeView === "essayDetail") {
      state.activeView = state.activeEssayId ? "essayDetail" : "writing";
      updateHash(state.activeView);
    }
  }
  saveState();
  showToast("征文已删除");
  render();
}

async function approvePost(id) {
  if (!requireAdminAccess()) return;
  try {
    const data = await apiRequest(`/api/admin/posts/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    state.pendingPosts = state.pendingPosts.filter((item) => item.id !== id);
    state.posts.unshift(data.result);
    state.activePostId = data.result.id;
    showToast("帖子已通过并公开");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

function approveComment(id) {
  if (!requireAdminAccess()) return;
  const index = state.pendingComments.findIndex((item) => item.id === id);
  if (index < 0) return;
  const pending = state.pendingComments.splice(index, 1)[0];
  const post = state.posts.find((item) => item.id === pending.postId);
  if (!post) {
    saveState();
    showToast("原帖子不存在，留言已移出待审");
    render();
    return;
  }
  post.comments.push({
    id: createId("comment"),
    author: pending.author,
    body: pending.body,
    attachments: pending.attachments || [],
    createdAt: pending.createdAt,
    approvedAt: new Date().toISOString(),
  });
  saveState();
  showToast("留言已通过并公开");
  render();
}

async function approveActivity(id) {
  if (!requireAdminAccess()) return;
  try {
    const data = await apiRequest(`/api/admin/activities/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    state.pendingActivities = state.pendingActivities.filter((item) => item.id !== id);
    state.activities.unshift(data.result);
    showToast("活动已通过并公开");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

async function rejectPending(type, id) {
  if (!requireAdminAccess()) return;
  try {
    await apiRequest(`/api/admin/${type}/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (type === "post") state.pendingPosts = state.pendingPosts.filter((item) => item.id !== id);
    if (type === "activity") state.pendingActivities = state.pendingActivities.filter((item) => item.id !== id);
    showToast("内容已驳回");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

function handleSendCode() {
  if (authMode !== "register") return;
  const phone = normalizePhone(elements.authPhone.value);
  elements.authPhone.value = phone;
  if (!isValidPhone(phone)) {
    elements.authMessage.textContent = "请输入 11 位手机号";
    return;
  }
  if (state.users.some((user) => user.phone === phone)) {
    elements.authMessage.textContent = "这个手机号已经注册过账号";
    return;
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  registerVerification = {
    phone,
    code,
    expiresAt: Date.now() + VERIFICATION_TTL_MS,
  };
  elements.authCode.value = "";
  elements.verificationNote.textContent = `演示验证码：${code}，5 分钟内有效。`;
  elements.authMessage.textContent = "";
  showToast(`验证码已发送：${code}`);
}

async function handleAuth(event) {
  event.preventDefault();
  const accountInput = elements.authUsername.value.trim();
  const password = elements.authPassword.value;
  if (!accountInput || !password) return;

  if (authMode === "register") {
    const username = accountInput;
    const phone = normalizePhone(elements.authPhone.value);
    const code = elements.authCode.value.trim();
    if (state.users.some((user) => user.username === username)) {
      elements.authMessage.textContent = "这个昵称已经被注册";
      return;
    }
    if (!isValidPhone(phone)) {
      elements.authMessage.textContent = "请输入 11 位手机号";
      return;
    }
    if (state.users.some((user) => user.phone === phone)) {
      elements.authMessage.textContent = "这个手机号已经注册过账号";
      return;
    }
    if (!registerVerification.code || registerVerification.phone !== phone || registerVerification.expiresAt < Date.now()) {
      elements.authMessage.textContent = "请先发送有效验证码";
      return;
    }
    if (code !== registerVerification.code) {
      elements.authMessage.textContent = "验证码不正确";
      return;
    }
    let newUser = null;
    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, phone }),
      });
      newUser = data.user;
      mergeReturnedUsers(newUser);
    } catch (error) {
      const now = new Date().toISOString();
      const accountNo = nextAccountNo();
      newUser = {
        id: createId("user"),
        accountNo,
        username,
        password,
        role: "member",
        profileName: username,
        avatarData: "",
        intro: "",
        clubRole: "社员",
        phone,
        firstUsedAt: now,
        lastUsedAt: now,
        createdAt: now,
        friends: [],
        friendRequests: [],
        chats: {},
      };
      state.users.push(newUser);
      showToast(`云端注册失败，已先本地创建：${error.message}`);
    }
    state.currentUserId = newUser.id;
    registerVerification = { phone: "", code: "", expiresAt: 0 };
    saveState();
    closeAuthModal();
    showToast(`注册成功，你的编号是 ${newUser.accountNo}`);
    render();
    return;
  }

  let user = null;
  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ accountNo: accountInput, password }),
    });
    mergeReturnedUsers(data.user);
    user = state.users.find((item) => item.id === data.user.id);
    await syncUsersFromApi({ silent: true });
  } catch {
    user = state.users.find((item) => String(item.accountNo) === accountInput && item.password === password);
  }
  if (!user) {
    elements.authMessage.textContent = "编号或密码不正确";
    return;
  }
  state.currentUserId = user.id;
  user.lastUsedAt = new Date().toISOString();
  saveState();
  closeAuthModal();
  showToast(`欢迎回来，${getUserDisplayName(user)}`);
  render();
}

function openAuthModal() {
  elements.authModal.classList.remove("hidden");
  elements.authMessage.textContent = "";
  renderAuthMode();
  elements.authUsername.focus();
}

function closeAuthModal() {
  elements.authModal.classList.add("hidden");
  elements.authForm.reset();
  elements.authMessage.textContent = "";
  elements.verificationNote.textContent = "验证码会以站内弹窗形式展示，作为短信流程演示。";
}

function renderAuthMode() {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === authMode);
  });
  const isRegister = authMode === "register";
  elements.registerFields.classList.toggle("hidden", !isRegister);
  elements.authUsernameLabel.textContent = isRegister ? "昵称" : "编号";
  elements.authUsername.placeholder = isRegister ? "设置昵称，登录后用于展示" : "请输入账号编号，例如 0000";
  elements.authUsername.autocomplete = isRegister ? "nickname" : "username";
  elements.authPhone.required = isRegister;
  elements.authCode.required = isRegister;
  elements.authPhone.disabled = !isRegister;
  elements.authCode.disabled = !isRegister;
  elements.sendCodeButton.disabled = !isRegister;
  elements.authSubmitButton.textContent = authMode === "login" ? "登录" : "注册";
  elements.authMessage.textContent = "";
  elements.authPassword.autocomplete = authMode === "login" ? "current-password" : "new-password";
}

function requireLogin() {
  if (currentUser()) return true;
  openAuthModal();
  showToast("请先登录或注册账号");
  return false;
}

function ensureActivePost() {
  if (state.posts.some((post) => post.id === state.activePostId)) return;
  state.activePostId = state.posts[0]?.id || "";
}

function ensureActiveWriting() {
  if (!Array.isArray(state.writingEvents)) state.writingEvents = structuredClone(initialState.writingEvents);
  if (!Array.isArray(state.essays)) state.essays = structuredClone(initialState.essays);
  if (!state.writingEvents.some((event) => event.id === state.activeWritingEventId)) {
    state.activeWritingEventId = state.writingEvents[0]?.id || "";
  }
  if (!state.essays.some((essay) => essay.id === state.activeEssayId)) {
    const firstEssay = getEssaysForActiveWritingEvent()[0] || state.essays[0];
    state.activeEssayId = firstEssay?.id || "";
  }
}

function openDetailView(kind, id) {
  const viewMap = {
    post: "postDetail",
    activity: "activityDetail",
    letter: "letterDetail",
    essay: "essayDetail",
  };
  if (kind === "post") state.activePostId = id;
  if (kind === "activity") state.activeActivityId = id;
  if (kind === "letter") state.activeLetterId = id;
  if (kind === "essay") {
    state.activeEssayId = id;
    const essay = state.essays.find((item) => item.id === id);
    if (essay) state.activeWritingEventId = essay.eventId;
  }
  setView(viewMap[kind]);
}

function renderPostDetail() {
  const post = state.posts.find((item) => item.id === state.activePostId);
  if (!post) {
    elements.postDetailContent.innerHTML = renderDetailMissing("forum", "帖子不存在或尚未公开。");
    return;
  }
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const commentsHtml = comments.length
    ? comments.map((comment) => renderCommentThread(comment, post.id, 1)).join("")
    : `<div class="empty-state">还没有留言，来做第一个回复的人。</div>`;
  const user = currentUser();

  elements.postDetailContent.innerHTML = `
    <div class="wechat-detail-layout forum-chat-layout">
      ${renderDetailSidebar("forum")}
      <section class="wechat-reader">
        <header class="reader-topbar">
          <button class="back-button" data-view-target="forum" type="button">返回论坛</button>
          <div>
            <p class="section-kicker">Huayu Forum</p>
            <h2 id="postDetailTitle">${escapeHtml(post.title)}</h2>
            <p>${escapeHtml(post.author)} · ${formatDateTime(post.approvedAt || post.createdAt)} · ${countCommentThreads(comments)} 条留言</p>
          </div>
          ${isAdmin() ? `<button class="reject-button detail-delete-button" data-delete-post="${post.id}" type="button">删除帖子</button>` : ""}
        </header>
        <div class="reader-scroll">
          <article class="message-card host-message">
            <aside class="message-author">
              <div class="floor-avatar">${escapeHtml((post.author || "华").slice(0, 1))}</div>
              <strong>${escapeHtml(post.author || "匿名社员")}</strong>
              <span>楼主</span>
            </aside>
            <div class="message-body">
              <div class="tag-row">
                <span class="tag">${escapeHtml(post.tag || "交流")}</span>
                ${renderAttachmentCount(post)}
              </div>
              <div class="detail-body">${escapeHtml(post.body)}</div>
              ${renderAttachmentList(post, "full")}
            </div>
          </article>
          <section class="reader-comments">
            <div class="list-title">
              <h3>全部留言</h3>
              <span>点击任意留言下方输入框即可回复</span>
            </div>
            <div class="comment-thread-list">${commentsHtml}</div>
          </section>
          ${renderDetailStageFooter()}
        </div>
        <form class="comment-form reader-composer" data-comment-form data-post-id="${post.id}">
          <textarea name="commentBody" rows="2" maxlength="420" placeholder="${user ? "写下你的留言，按发布立即进入讨论" : "登录后可以留言"}" ${user ? "" : "disabled"} required></textarea>
          <button class="primary-button" type="submit" ${user ? "" : "disabled"}>发布</button>
        </form>
      </section>
    </div>
  `;
  bindViewTargetButtons(elements.postDetailContent);
  bindPostDetailForms();
  bindDetailSidebar(elements.postDetailContent);
  elements.postDetailContent.querySelectorAll("[data-delete-post]").forEach((button) => {
    button.addEventListener("click", () => deletePost(button.dataset.deletePost));
  });
}

function renderActivityDetail() {
  const activity = state.activities.find((item) => item.id === state.activeActivityId);
  if (!activity) {
    elements.activityDetailContent.innerHTML = renderDetailMissing("activities", "活动内容不存在或尚未公开。");
    return;
  }
  const isPreview = activity.type === "preview";
  const typeText = isPreview ? "活动预告" : "活动简报";
  elements.activityDetailContent.innerHTML = `
    <div class="wechat-detail-layout activity-chat-layout">
      ${renderDetailSidebar("activities")}
      <section class="wechat-reader">
        <header class="reader-topbar">
          <button class="back-button" data-view-target="activities" type="button">返回活动</button>
          <div>
            <p class="section-kicker">Huayu Events</p>
            <h2 id="activityDetailTitle">${escapeHtml(activity.title)}</h2>
            <p>${typeText} · ${formatDate(activity.date)} · ${escapeHtml(activity.author || "华煜话剧社")}</p>
          </div>
          ${isAdmin() ? `<button class="reject-button detail-delete-button" data-delete-activity="${activity.id}" type="button">删除活动</button>` : ""}
        </header>
        <div class="reader-scroll">
          <article class="message-card host-message">
            <aside class="message-author">
              <div class="floor-avatar">${isPreview ? "预" : "简"}</div>
              <strong>${escapeHtml(activity.author || "华煜话剧社")}</strong>
              <span>${typeText}</span>
            </aside>
            <div class="message-body">
              <div class="tag-row">
                <span class="type-pill ${isPreview ? "preview" : ""}">${typeText}</span>
                ${renderAttachmentCount(activity)}
              </div>
              <div class="detail-body">${escapeHtml(activity.summary)}</div>
              ${renderAttachmentList(activity, "full")}
            </div>
          </article>
          ${renderDetailStageFooter()}
        </div>
      </section>
    </div>
  `;
  bindViewTargetButtons(elements.activityDetailContent);
  bindDetailSidebar(elements.activityDetailContent);
  elements.activityDetailContent.querySelectorAll("[data-delete-activity]").forEach((button) => {
    button.addEventListener("click", () => deleteActivity(button.dataset.deleteActivity));
  });
}

function renderLetterDetail() {
  const letter = state.letters.find((item) => item.id === state.activeLetterId && item.visibility === "public");
  if (!letter) {
    elements.letterDetailContent.innerHTML = renderDetailMissing("mailbox", "信件不存在或未选择公开。");
    return;
  }
  const canReply = isAdmin();
  const replyHtml = letter.reply
    ? `<div class="club-reply"><strong>社团回复：</strong>${escapeHtml(letter.reply)}<span>${letter.repliedAt ? ` · ${formatDateTime(letter.repliedAt)}` : ""}</span></div>`
    : `<div class="empty-state">等待社团回复。</div>`;
  const replyForm = isAdmin()
    ? `
      <form class="reply-form letter-reply-form" id="letterDetailReplyForm">
        <textarea rows="4" maxlength="420" placeholder="${canReply ? "填写社团回复" : "管理员登录后可回复"}" ${canReply ? "" : "disabled"}>${escapeHtml(letter.reply)}</textarea>
        <button class="primary-button" type="submit" ${canReply ? "" : "disabled"}>发布回复</button>
      </form>
    `
    : "";
  elements.letterDetailContent.innerHTML = `
    <div class="wechat-detail-layout mailbox-chat-layout">
      ${renderDetailSidebar("mailbox")}
      <section class="wechat-reader">
        <header class="reader-topbar">
          <button class="back-button" data-view-target="mailbox" type="button">返回信箱</button>
          <div>
            <p class="section-kicker">Huayu Mailbox</p>
            <h2 id="letterDetailTitle">${escapeHtml(letter.subject)}</h2>
            <p>${escapeHtml(letter.author)} · ${formatDateTime(letter.createdAt)}</p>
          </div>
          ${isAdmin() ? `<button class="reject-button detail-delete-button" data-delete-letter="${letter.id}" type="button">删除信件</button>` : ""}
        </header>
        <div class="reader-scroll">
          <article class="message-card host-message">
            <aside class="message-author">
              <div class="floor-avatar">${escapeHtml((letter.author || "信").slice(0, 1))}</div>
              <strong>${escapeHtml(letter.author || "匿名来信")}</strong>
              <span>来信人</span>
            </aside>
            <div class="message-body">
              <div class="tag-row">
                <span class="reply-pill">公开信件</span>
                ${renderAttachmentCount(letter)}
              </div>
              <div class="detail-body">${escapeHtml(letter.body)}</div>
              ${renderAttachmentList(letter, "full")}
            </div>
          </article>
          <article class="message-card club-message">
            <aside class="message-author">
              <div class="floor-avatar">华</div>
              <strong>华煜话剧社</strong>
              <span>社团回复</span>
            </aside>
            <div class="message-body">${replyHtml}</div>
          </article>
          ${renderDetailStageFooter()}
        </div>
        ${replyForm ? `<div class="reader-admin-composer">${replyForm}</div>` : ""}
      </section>
    </div>
  `;
  bindViewTargetButtons(elements.letterDetailContent);
  bindLetterDetailForm();
  bindDetailSidebar(elements.letterDetailContent);
  elements.letterDetailContent.querySelectorAll("[data-delete-letter]").forEach((button) => {
    button.addEventListener("click", () => deleteLetter(button.dataset.deleteLetter));
  });
}

function renderEssayDetail() {
  const essay = state.essays.find((item) => item.id === state.activeEssayId);
  if (!essay) {
    elements.essayDetailContent.innerHTML = renderDetailMissing("writing", "文章不存在或尚未放上书架。");
    bindViewTargetButtons(elements.essayDetailContent);
    return;
  }
  const event = state.writingEvents.find((item) => item.id === essay.eventId);
  elements.essayDetailContent.innerHTML = `
    <div class="wechat-detail-layout writing-chat-layout">
      ${renderDetailSidebar("writing")}
      <section class="wechat-reader essay-reader">
        <header class="reader-topbar essay-reader-topbar">
          <button class="back-button" data-view-target="writing" type="button">返回征文</button>
          <div>
            <p class="section-kicker">Huayu Writing</p>
            <h2 id="essayDetailTitle">${escapeHtml(essay.title)}</h2>
            <p>${escapeHtml(essay.author || "匿名社员")} · ${formatDateTime(essay.createdAt)} · ${escapeHtml(event?.title || "征文活动")}</p>
          </div>
          ${isAdmin() ? `<button class="reject-button detail-delete-button" data-delete-essay="${essay.id}" type="button">删除文章</button>` : ""}
        </header>
        <div class="reader-scroll essay-reader-scroll">
          <article class="message-card host-message essay-paper-card">
            <aside class="message-author">
              <div class="floor-avatar">${escapeHtml((essay.author || "文").slice(0, 1))}</div>
              <strong>${escapeHtml(essay.author || "匿名社员")}</strong>
              <span>作者</span>
            </aside>
            <div class="message-body">
              <div class="tag-row">
                <span class="tag">征文</span>
                ${event?.deadline ? `<span>截止 ${formatDate(event.deadline)}</span>` : `<span>长期开放</span>`}
                ${renderAttachmentCount(essay)}
              </div>
              <div class="detail-body essay-detail-body">${escapeHtml(essay.body)}</div>
              ${renderAttachmentList(essay, "full")}
            </div>
          </article>
          ${event ? `
            <article class="message-card writing-event-note">
              <aside class="message-author">
                <div class="floor-avatar">征</div>
                <strong>${escapeHtml(event.title)}</strong>
                <span>${event.fixed ? "固定活动" : "征文活动"}</span>
              </aside>
              <div class="message-body">
                <div class="detail-body">${escapeHtml(event.prompt)}</div>
              </div>
            </article>
          ` : ""}
          ${renderDetailStageFooter()}
        </div>
      </section>
    </div>
  `;
  bindViewTargetButtons(elements.essayDetailContent);
  bindDetailSidebar(elements.essayDetailContent);
  elements.essayDetailContent.querySelectorAll("[data-delete-essay]").forEach((button) => {
    button.addEventListener("click", () => deleteEssay(button.dataset.deleteEssay));
  });
}

function renderDetailSidebar(kind) {
  const config = {
    forum: {
      title: "社团论坛",
      search: "搜索帖子",
      items: state.posts,
      activeId: state.activePostId,
      dataName: "post",
      viewTarget: "forum",
      empty: "暂无公开帖子",
      titleGetter: (item) => item.title,
      metaGetter: (item) => `${item.author || "匿名社员"} · ${countCommentThreads(item.comments || [])} 条留言`,
      excerptGetter: (item) => getExcerpt(item.body, 34),
    },
    activities: {
      title: "活动档案",
      search: "搜索活动",
      items: state.activities,
      activeId: state.activeActivityId,
      dataName: "activity",
      viewTarget: "activities",
      empty: "暂无活动",
      titleGetter: (item) => item.title,
      metaGetter: (item) => `${item.type === "preview" ? "预告" : "简报"} · ${formatDate(item.date)}`,
      excerptGetter: (item) => getExcerpt(item.summary, 34),
    },
    mailbox: {
      title: "公开信箱",
      search: "搜索来信",
      items: state.letters.filter((item) => item.visibility === "public"),
      activeId: state.activeLetterId,
      dataName: "letter",
      viewTarget: "mailbox",
      empty: "暂无公开信件",
      titleGetter: (item) => item.subject,
      metaGetter: (item) => `${item.author || "匿名来信"} · ${item.reply ? "已回复" : "待回复"}`,
      excerptGetter: (item) => getExcerpt(item.body, 34),
    },
    writing: {
      title: "征文",
      search: "搜索文章",
      items: state.essays,
      activeId: state.activeEssayId,
      dataName: "essay",
      viewTarget: "writing",
      empty: "暂无征文文章",
      titleGetter: (item) => item.title,
      metaGetter: (item) => `${item.author || "匿名社员"} · ${state.writingEvents.find((event) => event.id === item.eventId)?.title || "征文"}`,
      excerptGetter: (item) => getExcerpt(item.body, 34),
    },
  }[kind];

  const itemsHtml = config.items.length
    ? config.items
        .map(
          (item) => `
            <button class="reader-list-item ${item.id === config.activeId ? "is-active" : ""}" type="button" data-sidebar-${config.dataName}="${item.id}">
              <span class="reader-list-avatar">${escapeHtml((config.titleGetter(item) || "华").slice(0, 1))}</span>
              <span>
                <strong>${escapeHtml(config.titleGetter(item))}</strong>
                <small>${escapeHtml(config.metaGetter(item))}</small>
                <em>${escapeHtml(config.excerptGetter(item))}</em>
              </span>
            </button>
          `,
        )
        .join("")
    : `<div class="empty-state">${config.empty}</div>`;

  return `
    <aside class="reader-sidebar">
      <div class="reader-sidebar-head">
        <button class="back-button" data-view-target="${config.viewTarget}" type="button">返回</button>
        <strong>${config.title}</strong>
      </div>
      <div class="reader-search">${config.search}</div>
      <div class="reader-list">${itemsHtml}</div>
    </aside>
  `;
}

function bindDetailSidebar(scope) {
  scope.querySelectorAll("[data-sidebar-post]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePostId = button.dataset.sidebarPost;
      renderPostDetail();
      saveState();
    });
  });
  scope.querySelectorAll("[data-sidebar-activity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeActivityId = button.dataset.sidebarActivity;
      renderActivityDetail();
      saveState();
    });
  });
  scope.querySelectorAll("[data-sidebar-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLetterId = button.dataset.sidebarLetter;
      renderLetterDetail();
      saveState();
    });
  });
  scope.querySelectorAll("[data-sidebar-essay]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeEssayId = button.dataset.sidebarEssay;
      const essay = state.essays.find((item) => item.id === state.activeEssayId);
      if (essay) state.activeWritingEventId = essay.eventId;
      renderEssayDetail();
      saveState();
    });
  });
}

function renderDetailStageFooter() {
  return `
    <div class="detail-stage-footer" aria-label="华煜话剧社阅读页装饰">
      <span></span>
      <strong>华煜话剧社</strong>
      <span></span>
    </div>
  `;
}

function renderDetailMissing(backView, message) {
  return `
    <div class="detail-page-hero">
      <button class="back-button" data-view-target="${backView}" type="button">返回</button>
      <div>
        <p class="section-kicker">Not Found</p>
        <h2>没有找到内容</h2>
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function bindViewTargetButtons(scope) {
  scope.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.viewTarget));
  });
}

function bindPostDetailForms() {
  elements.postDetailContent.querySelectorAll("[data-comment-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireLogin()) return;
      const body = form.querySelector("textarea").value.trim();
      const postId = form.dataset.postId;
      const parentId = form.dataset.parentId || "";
      if (!body) return;
      await addCommentToPost(postId, body, parentId);
    });
  });
}

function bindLetterDetailForm() {
  const form = elements.letterDetailContent.querySelector("#letterDetailReplyForm");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAdminAccess()) return;
    const letter = state.letters.find((item) => item.id === state.activeLetterId);
    const replyBody = form.querySelector("textarea").value.trim();
    if (!letter || !replyBody) return;
    try {
      const data = await apiRequest(`/api/admin/letters/${letter.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyBody }),
      });
      Object.assign(letter, data.result);
      showToast("社团回复已发布");
      render();
    } catch (error) {
      showToast(error.message);
    }
  });
}

async function addCommentToPost(postId, body, parentId = "") {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;
  try {
    const data = await apiRequest("/api/forum/comments", {
      method: "POST",
      body: JSON.stringify({
        post_id: postId,
        parent_id: parentId,
        author: getUserDisplayName(currentUser()),
        body,
      }),
    });
    const comment = data.result;
    if (!parentId) {
      post.comments.push(comment);
    } else {
      const parent = findCommentById(post.comments, parentId);
      if (parent) {
        parent.replies = Array.isArray(parent.replies) ? parent.replies : [];
        parent.replies.push(comment);
      } else {
        post.comments.push(comment);
      }
    }
    showToast(parentId ? "回复已发布" : "留言已发布");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

function renderCommentThread(comment, postId, level = 1) {
  const user = currentUser();
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const nested = replies.length
    ? replies.map((reply) => renderCommentThread(reply, postId, Math.min(level + 1, 5))).join("")
    : "";
  return `
    <article class="comment-card comment-depth-${Math.min(level, 5)}">
      <div class="comment-main">
        <div class="comment-avatar">${escapeHtml((comment.author || "匿").slice(0, 1))}</div>
        <div>
          <div class="meta-row">
            <strong>${escapeHtml(comment.author || "匿名社员")}</strong>
            <span>${formatDateTime(comment.createdAt)}</span>
          </div>
          <p>${escapeHtml(comment.body)}</p>
        </div>
      </div>
      <form class="comment-form inline-reply-form" data-comment-form data-post-id="${postId}" data-parent-id="${comment.id}">
        <textarea name="commentBody" rows="2" maxlength="360" placeholder="${user ? `回复 ${escapeAttribute(comment.author || "这条留言")}` : "登录后可以回复"}" ${user ? "" : "disabled"} required></textarea>
        <button class="secondary-button" type="submit" ${user ? "" : "disabled"}>回复</button>
      </form>
      ${nested ? `<div class="nested-replies">${nested}</div>` : ""}
    </article>
  `;
}

function normalizeAttachments(item) {
  const attachments = Array.isArray(item.attachments) ? item.attachments.filter(Boolean) : [];
  const normalized = attachments.map((attachment) => ({
    id: attachment.id || createId("attachment"),
    name: attachment.name || attachment.fileName || "附件",
    type: attachment.type || inferAttachmentType(attachment.name || attachment.fileName || "", attachment.data || attachment.fileData || ""),
    size: Number(attachment.size) || 0,
    data: attachment.data || attachment.fileData || "",
  }));

  if (item.fileData && item.fileName && !normalized.some((attachment) => attachment.data === item.fileData)) {
    normalized.push({
      id: createId("attachment"),
      name: item.fileName,
      type: inferAttachmentType(item.fileName, item.fileData),
      size: 0,
      data: item.fileData,
    });
  }

  return normalized;
}

function renderAttachmentCount(item) {
  const count = normalizeAttachments(item).length;
  return count ? `<span class="attachment-count">附件 ${count}</span>` : "";
}

function renderAttachmentList(item, mode = "full") {
  const attachments = normalizeAttachments(item);
  if (!attachments.length) return mode === "full" ? `<div class="empty-state">暂无附件。</div>` : "";
  const items = attachments.map((attachment) => renderAttachmentItem(attachment, mode)).join("");
  return `
    <div class="attachment-list ${mode === "compact" ? "attachment-list-compact" : ""}">
      <h4>附件</h4>
      <div class="attachment-grid">${items}</div>
    </div>
  `;
}

function renderAttachmentItem(attachment, mode) {
  const name = escapeHtml(attachment.name || "附件");
  const href = escapeAttribute(attachment.data || "#");
  const type = inferAttachmentType(attachment.name, attachment.data || attachment.type);
  const size = attachment.size ? ` · ${formatFileSize(attachment.size)}` : "";
  if (mode === "compact") {
    return attachment.data
      ? `<a class="attachment-chip" href="${href}" download="${escapeAttribute(attachment.name)}">${name}${size}</a>`
      : `<span class="attachment-chip">${name}${size}</span>`;
  }
  if (type.startsWith("image/") && attachment.data) {
    return `
      <figure class="attachment-preview">
        <img src="${href}" alt="${escapeAttribute(attachment.name)}" />
        <figcaption>
          <span>${name}${size}</span>
          <a class="file-link" href="${href}" download="${escapeAttribute(attachment.name)}">下载</a>
        </figcaption>
      </figure>
    `;
  }
  if (type.startsWith("video/") && attachment.data) {
    return `
      <figure class="attachment-preview">
        <video src="${href}" controls></video>
        <figcaption>
          <span>${name}${size}</span>
          <a class="file-link" href="${href}" download="${escapeAttribute(attachment.name)}">下载</a>
        </figcaption>
      </figure>
    `;
  }
  return attachment.data
    ? `<a class="document-attachment" href="${href}" download="${escapeAttribute(attachment.name)}"><strong>${name}</strong><span>文档附件${size}</span></a>`
    : `<div class="document-attachment"><strong>${name}</strong><span>文档附件${size}</span></div>`;
}

async function readFilesAsAttachments(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return [];
  if (files.length > MAX_ATTACHMENTS) {
    throw new Error(`最多一次上传 ${MAX_ATTACHMENTS} 个附件`);
  }
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENTS_SIZE) {
    throw new Error("附件总大小超过 8MB，请减少或压缩后再上传");
  }
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("单个附件超过 2.5MB，请先压缩后再上传");
    }
  }
  const attachments = [];
  for (const file of files) {
    attachments.push({
      id: createId("attachment"),
      name: file.name,
      type: file.type || inferAttachmentType(file.name, ""),
      size: file.size,
      data: await readFileAsDataUrl(file),
    });
  }
  return attachments;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function getUserDisplayName(user) {
  if (!user) return "";
  return (user.profileName || user.username || "").trim();
}

function getUserInitial(user) {
  const name = getUserDisplayName(user);
  return name.slice(0, 1) || "华";
}

function avatarStyle(user) {
  return user?.avatarData ? `background-image:url("${escapeHtml(user.avatarData)}")` : "";
}

function getExcerpt(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 11);
}

function isValidPhone(value) {
  return /^\d{11}$/.test(value);
}

function countCommentThreads(comments = []) {
  return comments.reduce((sum, comment) => {
    const replies = Array.isArray(comment.replies) ? comment.replies : [];
    return sum + 1 + countCommentThreads(replies);
  }, 0);
}

function findCommentById(comments = [], id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    const match = findCommentById(comment.replies || [], id);
    if (match) return match;
  }
  return null;
}

function inferAttachmentType(name = "", data = "") {
  if (typeof data === "string" && data.startsWith("data:")) {
    return data.slice(5, data.indexOf(";")) || "application/octet-stream";
  }
  const extension = String(name).split(".").pop()?.toLowerCase();
  const typeMap = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    zip: "application/zip",
  };
  return typeMap[extension] || "application/octet-stream";
}

function formatFileSize(size) {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2600);
}

