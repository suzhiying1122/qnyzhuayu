import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "./reference-theme.css";

createApp(App).mount("#app");

nextTick(async () => {
  const intro = document.querySelector("#cinemaIntro");
  const introVideo = intro?.querySelector(".intro-bg-video");
  const sceneVideos = [...document.querySelectorAll(".scene-video[data-scene]")];
  const hdViewport = window.matchMedia("(min-width: 900px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedConnection = Boolean(connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType));
  const communityViews = new Set(["forum", "activities", "profile", "admin"]);
  const readerViews = new Set(["mailbox", "writing", "postDetail", "activityDetail", "letterDetail", "essayDetail"]);
  let introActive = Boolean(intro);
  let mediaResizeTimer;

  const selectedMediaProfile = () => {
    if (constrainedConnection) return "lite";
    return hdViewport.matches ? "hd" : "mobile";
  };

  const mediaAsset = (video, kind) => {
    const profile = selectedMediaProfile();
    const profileKey = `${kind}${profile[0].toUpperCase()}${profile.slice(1)}`;
    return video?.dataset[profileKey] || video?.dataset[`${kind}Lite`];
  };

  const selectedScene = () => {
    const view = document.body.dataset.view || "home";
    if (communityViews.has(view)) return "community";
    if (readerViews.has(view)) return "reader";
    return "home";
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
    video.src = source;
    video.dataset.activeSource = source;
    video.load();
  };

  const releaseVideo = (video) => {
    if (!video) return;
    video.pause();
    if (!video.dataset.activeSource) return;
    video.removeAttribute("src");
    delete video.dataset.activeSource;
    video.load();
  };

  const playVideo = (video) => {
    prepareVideo(video);
    const playback = video.play();
    if (playback?.catch) playback.catch(() => undefined);
  };

  const syncSceneMedia = () => {
    const scene = selectedScene();
    const pageCanAnimate = !document.hidden && !reducedMotion.matches;

    sceneVideos.forEach((video) => {
      window.clearTimeout(video.releaseTimer);
      const isActive = !introActive && pageCanAnimate && video.dataset.scene === scene;
      if (isActive) {
        playVideo(video);
        return;
      }

      video.pause();
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

  document.querySelectorAll("[data-module-drawers]").forEach((group) => {
    closeDrawerGroup(group);
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-drawer-target]");
    if (!trigger) return;

    const group = trigger.closest("[data-module-drawers]");
    const panel = document.getElementById(trigger.dataset.drawerTarget || "");
    if (!group || !panel || !group.contains(panel)) return;

    const shouldOpen = !panel.classList.contains("is-open");
    closeDrawerGroup(group);
    if (!shouldOpen) return;

    trigger.classList.add("is-active");
    trigger.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panel.inert = false;
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
  if (window.sessionStorage.getItem("huayu-intro-seen") === "1") {
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
  window.addEventListener("pagehide", () => [introVideo, ...sceneVideos].forEach((video) => video?.pause()));
  window.addEventListener("resize", () => {
    window.clearTimeout(mediaResizeTimer);
    mediaResizeTimer = window.setTimeout(refreshMediaQuality, 220);
  }, { passive: true });
  hdViewport.addEventListener?.("change", refreshMediaQuality);
  reducedMotion.addEventListener?.("change", syncSceneMedia);
  refreshMediaQuality();
});
