import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "./reference-theme.css";

createApp(App).mount("#app");

nextTick(async () => {
  const intro = document.querySelector("#cinemaIntro");
  const introVideo = intro?.querySelector(".intro-bg-video");
  const sceneVideos = [...document.querySelectorAll(".scene-video[data-scene]")];
  const homeClockTime = document.querySelector("#homeClockTime");
  const homeClockDate = document.querySelector("#homeClockDate");
  const hdViewport = window.matchMedia("(min-width: 900px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedConnection = Boolean(connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType));
  const viewScenes = {
    forum: "forum",
    postDetail: "discussion",
    activities: "activities",
    activityDetail: "activities",
    mailbox: "mailbox",
    letterDetail: "mailbox",
    writing: "writing",
    essayDetail: "writing",
    profile: "profile",
    admin: "admin",
  };
  let introActive = Boolean(intro);
  let mediaResizeTimer;
  let homeClockTimer;

  const updateHomeClock = () => {
    if (!homeClockTime) return;
    const now = new Date();
    homeClockTime.textContent = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    if (homeClockDate) {
      homeClockDate.textContent = new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      }).format(now).replace(/\s+/g, " ");
    }
  };

  if (homeClockTime) {
    updateHomeClock();
    homeClockTimer = window.setInterval(updateHomeClock, 1000);
  }

  const selectedMediaProfile = () => {
    return hdViewport.matches ? "hd" : "mobile";
  };

  const mediaAsset = (video, kind) => {
    const profile = selectedMediaProfile();
    const profileKey = `${kind}${profile[0].toUpperCase()}${profile.slice(1)}`;
    return video?.dataset[profileKey] || video?.dataset[`${kind}Lite`];
  };

  const selectedScene = () => {
    const view = document.body.dataset.view || "home";
    if (view === "profile" && document.body.dataset.profileScene === "friends") return "friends";
    return viewScenes[view] || "home";
  };

  const syncProfileSceneState = () => {
    const friendsOpen = document.querySelector("#profileFriendsDrawer")?.classList.contains("is-open");
    if (friendsOpen) {
      document.body.dataset.profileScene = "friends";
    } else {
      delete document.body.dataset.profileScene;
    }
  };

  const setPoster = (video) => {
    if (!video) return;
    const poster = mediaAsset(video, "poster");
    if (poster && video.getAttribute("poster") !== poster) video.setAttribute("poster", poster);
  };

  const prepareVideo = (video) => {
    if (!video) return;
    setPoster(video);
    const source = mediaAsset(video, "src");
    if (!source || video.dataset.activeSource === source) return;
    video.pause();
    video.classList.remove("is-ready");
    video.src = source;
    video.dataset.activeSource = source;
    video.load();
  };

  const releaseVideo = (video) => {
    if (!video) return;
    video.pause();
    video.classList.remove("is-ready");
    if (!video.dataset.activeSource) return;
    video.removeAttribute("src");
    delete video.dataset.activeSource;
    video.load();
  };

  const playVideo = (video) => {
    prepareVideo(video);
    video.preload = "metadata";
    const playback = video.play();
    if (playback?.then) {
      playback
        .then(() => {
          if (!introActive && video.dataset.scene === selectedScene()) video.classList.add("is-ready");
        })
        .catch(() => video.classList.remove("is-ready"));
    }
  };

  const syncSceneMedia = () => {
    const scene = selectedScene();
    const pageCanAnimate = !constrainedConnection && !document.hidden && !reducedMotion.matches;

    sceneVideos.forEach((video) => {
      window.clearTimeout(video.releaseTimer);
      const isActive = !introActive && pageCanAnimate && video.dataset.scene === scene;
      if (isActive) {
        playVideo(video);
        return;
      }

      video.pause();
      video.classList.remove("is-ready");
      setPoster(video);
      if (video.dataset.scene !== scene) {
        video.releaseTimer = window.setTimeout(() => releaseVideo(video), 900);
      }
    });

    if (!introVideo) return;
    if (introActive && pageCanAnimate) {
      playVideo(introVideo);
    } else {
      introVideo.pause();
      setPoster(introVideo);
    }
  };

  sceneVideos.forEach((video) => {
    video.addEventListener("loadeddata", () => {
      if (!introActive && video.dataset.scene === selectedScene()) video.classList.add("is-ready");
    });
    video.addEventListener("playing", () => {
      if (!introActive && video.dataset.scene === selectedScene()) video.classList.add("is-ready");
    });
    video.addEventListener("waiting", () => video.classList.remove("is-ready"));
    video.addEventListener("stalled", () => video.classList.remove("is-ready"));
  });

  const refreshMediaQuality = () => {
    [introVideo, ...sceneVideos].forEach((video) => {
      if (!video) return;
      const source = mediaAsset(video, "src");
      if (video.dataset.activeSource && video.dataset.activeSource !== source) releaseVideo(video);
      setPoster(video);
    });
    syncSceneMedia();
  };

  const closeDrawerGroup = (group) => {
    group.querySelectorAll("[data-drawer-target]").forEach((trigger) => {
      trigger.classList.remove("is-active");
      trigger.setAttribute("aria-expanded", "false");
    });

    group.querySelectorAll(".module-drawer-panel").forEach((panel) => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      panel.inert = true;
    });
  };

  const openDrawer = (trigger, panel) => {
    trigger.classList.add("is-active");
    trigger.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panel.inert = false;
  };

  document.querySelectorAll("[data-module-drawers]").forEach((group) => {
    closeDrawerGroup(group);
    const firstTrigger = group.querySelector("[data-drawer-target]");
    const firstPanel = firstTrigger ? document.getElementById(firstTrigger.dataset.drawerTarget || "") : null;
    if (firstTrigger && firstPanel && group.contains(firstPanel)) openDrawer(firstTrigger, firstPanel);
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-drawer-target]");
    if (!trigger) return;

    const group = trigger.closest("[data-module-drawers]");
    const panel = document.getElementById(trigger.dataset.drawerTarget || "");
    if (!group || !panel || !group.contains(panel)) return;

    const shouldOpen = !panel.classList.contains("is-open");
    closeDrawerGroup(group);
    if (!shouldOpen) {
      syncProfileSceneState();
      syncSceneMedia();
      return;
    }

    openDrawer(trigger, panel);
    syncProfileSceneState();
    syncSceneMedia();
  });

  const enterButton = document.querySelector("#cinemaEnterButton");
  const dismissIntro = () => {
    if (!intro || intro.classList.contains("is-leaving")) return;
    intro.classList.add("is-leaving");
    introActive = false;
    introVideo?.pause();
    window.sessionStorage.setItem("huayu-intro-seen", "1");
    window.setTimeout(() => {
      releaseVideo(introVideo);
      intro.remove();
    }, 760);
    window.setTimeout(syncSceneMedia, 220);
  };
  const skipIntro = window.matchMedia("(max-width: 820px)").matches || constrainedConnection || reducedMotion.matches;
  if (skipIntro || window.sessionStorage.getItem("huayu-intro-seen") === "1") {
    intro?.remove();
    introActive = false;
  } else {
    enterButton?.addEventListener("click", dismissIntro, { once: true });
  }

  const { initLegacyApp } = await import("./legacy-app.js");
  initLegacyApp();

  const viewObserver = new MutationObserver(syncSceneMedia);
  viewObserver.observe(document.body, { attributes: true, attributeFilter: ["data-view"] });
  document.addEventListener("visibilitychange", syncSceneMedia);
  window.addEventListener("pagehide", () => {
    window.clearInterval(homeClockTimer);
    [introVideo, ...sceneVideos].forEach((video) => video?.pause());
  });
  window.addEventListener("resize", () => {
    window.clearTimeout(mediaResizeTimer);
    mediaResizeTimer = window.setTimeout(refreshMediaQuality, 220);
  }, { passive: true });
  hdViewport.addEventListener?.("change", refreshMediaQuality);
  reducedMotion.addEventListener?.("change", syncSceneMedia);
  refreshMediaQuality();
});
