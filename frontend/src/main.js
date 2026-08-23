import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "./reference-theme.css";

createApp(App).mount("#app");

nextTick(async () => {
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

  const intro = document.querySelector("#cinemaIntro");
  const enterButton = document.querySelector("#cinemaEnterButton");
  const dismissIntro = () => {
    if (!intro || intro.classList.contains("is-leaving")) return;
    intro.classList.add("is-leaving");
    window.sessionStorage.setItem("huayu-intro-seen", "1");
    window.setTimeout(() => intro.remove(), 760);
  };
  if (window.sessionStorage.getItem("huayu-intro-seen") === "1") {
    intro?.remove();
  } else {
    enterButton?.addEventListener("click", dismissIntro, { once: true });
  }

  const { initLegacyApp } = await import("./legacy-app.js");
  initLegacyApp();
});
