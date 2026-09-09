// Inspect the Git index, not ignored working-tree files. Never print secret values.
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const paths = git('ls-files', '-z').split('\0').filter(Boolean);
const tracked = new Set(paths);
const forbidden = /(^|\/)(?:node_modules|\.wrangler|\.tmp-[^/]*|output)(?:\/|$)|^frontend\/dist\/|(^|\/)\.dev\.vars(?:\.|$)|(^|\/)\.env(?:$|\.(?!example$))|\.(?:sqlite3?|pem|key)$/;
const findings = paths.filter((path) => forbidden.test(path)).map((path) => `${path}: local-only path`);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:ghp_|github_pat_|sk_live_|re_)[A-Za-z0-9_-]{24,}\b/,
  /(?:RESEND_API_KEY|CLOUDFLARE_API_TOKEN|CF_API_TOKEN)\s*[:=]\s*['"][A-Za-z0-9_-]{20,}['"]/,
];
const assetRefs = new Set();
let textFiles = 0;
for (const path of paths) {
  if (!/\.(?:[cm]?js|vue|css|jsonc?|sql|md|html|py|toml|ya?ml|txt)$/.test(path) && !path.endsWith('/_headers')) continue;
  const text = git('show', `:${path}`);
  textFiles++;
  if (secretPatterns.some((pattern) => pattern.test(text))) findings.push(`${path}: potential credential (value withheld)`);
  if (path.startsWith('frontend/src/')) {
    for (const [ref] of text.matchAll(/\/assets\/[A-Za-z0-9_./%-]+\.(?:png|jpe?g|webp|mp4|gif|svg)/g)) assetRefs.add(ref);
  }
}
for (const ref of assetRefs) {
  if (!tracked.has(`frontend/public${ref}`)) findings.push(`${ref}: public asset missing from index`);
}
for (const path of ['package-lock.json', 'frontend/package-lock.json', 'frontend/public/_headers',
  'frontend/public/_redirects', 'schema.sql', 'migrations/2026-09-08-email-verification.sql',
  'migrations/2026-09-09-secure-auth.sql', 'functions/api/auth/me.js', 'functions/api/auth/logout.js']) {
  if (!tracked.has(path)) findings.push(`${path}: release input missing`);
}
assert.equal(findings.length, 0, findings.join('\n'));
git('diff', '--cached', '--check');
console.log(`PASS: ${textFiles} indexed text files checked; ${assetRefs.size} public asset references present; no local artifacts or common credential patterns in release inputs.`);
