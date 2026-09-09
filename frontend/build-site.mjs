import { build, createServer } from 'vite';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

// Vite's renderer loader must not switch the subsequent client build to dev mode.
process.env.NODE_ENV = 'production';

// Render the same public shell that browsers use. No user-agent branching,
// database calls, credentials or account state are part of this build step.
const renderer = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
let markup;
try {
  const { default: App } = await renderer.ssrLoadModule('/src/App.vue');
  markup = await renderToString(createSSRApp(App));
} finally {
  await renderer.close();
}
if (!markup.includes('华煜话剧社') || !markup.includes('id="homeView"')) {
  throw new Error('Public homepage prerender is missing required content');
}
await build({
  plugins: [{
    name: 'huayu-public-prerender',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const shell = '<div id="app"></div>';
        if (!html.includes(shell)) throw new Error('Homepage mount point has changed');
        return html.replace(shell, () => `<div id="app">${markup}</div>`);
      },
    },
  }],
});
