import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "./reference-theme.css";

createApp(App).mount("#app");

nextTick(async () => {
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
