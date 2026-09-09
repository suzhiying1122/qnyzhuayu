import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: process.env.HUAYU_API_TARGET || "http://127.0.0.1:8788",
        changeOrigin: false,
        secure: true,
      },
    },
  },
  build: {
    // Release checks can build into a fresh directory without removing local files.
    outDir: process.env.HUAYU_BUILD_OUT_DIR || "dist",
    emptyOutDir: true,
  },
});
