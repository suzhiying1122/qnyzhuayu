import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "./styles.css";

createApp(App).mount("#app");

nextTick(async () => {
  const { initLegacyApp } = await import("./legacy-app.js");
  initLegacyApp();
});
