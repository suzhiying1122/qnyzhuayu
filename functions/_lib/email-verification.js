import { ensureUserTables } from "./api.js";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_SENDS_PER_EMAIL = 6;
const MAX_SENDS_PER_IP = 30;
const MAX_VERIFY_ATTEMPTS = 5;

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashCode(env, email, code) {
  if (!env.RESEND_API_KEY) throw new Error("邮件服务尚未配置");
  return digest(`${env.RESEND_API_KEY}:${email}:${code}`);
}

function generateCode() {
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return String(100000 + (random[0] % 900000));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendWithResend(env, email, code) {
  const from = env.RESEND_FROM || "华煜话剧社 <verify@qnyzhuayu.cn>";
  const codeCells = String(code)
    .split("")
    .map((digit) => `<td align="center" width="16.66%" style="padding:0 3px"><div style="padding:13px 0 11px;background:#fffdf9;border:1px solid #dfd1c2;border-bottom:2px solid #a51c38;border-radius:7px;font-family:Consolas,'Courier New',monospace;font-size:30px;line-height:1;font-weight:700;color:#4c1820">${escapeHtml(digit)}</div></td>`)
    .join("");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "【华煜话剧社】你的注册验证码",
      text: `欢迎来到华煜话剧社线上空间。你的注册验证码是 ${code}，10 分钟内有效。若不是你本人操作，请忽略这封邮件。`,
      html: `
        <!doctype html>
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
              @media only screen and (max-width: 640px) {
                .email-shell { padding: 14px 8px !important; }
                .header-cell { padding: 26px 22px 22px !important; }
                .content-cell { padding: 26px 22px 28px !important; }
                .email-title { font-size: 27px !important; }
              }
            </style>
          </head>
          <body style="margin:0;padding:0;background:#f3f0eb;color:#2d2020;font-family:'Microsoft YaHei','PingFang SC','Noto Sans CJK SC',Arial,sans-serif">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">验证码 ${escapeHtml(code)}，10 分钟内有效。</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f0eb">
              <tr>
                <td class="email-shell" align="center" style="padding:34px 14px">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#fffdf9;border:1px solid #ddd3c8;border-radius:12px;overflow:hidden">
                    <tr>
                      <td height="5" style="height:5px;background:#791327;font-size:0;line-height:0">&nbsp;</td>
                    </tr>
                    <tr>
                      <td class="header-cell" style="padding:30px 38px 25px;border-bottom:1px solid #e9e1d8">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td valign="middle">
                              <div style="font-size:11px;line-height:1.4;letter-spacing:1.8px;color:#9a713b;font-weight:700">HUAYU DRAMA CLUB</div>
                              <div style="margin-top:5px;font-size:20px;line-height:1.45;font-weight:700;color:#4d1520">华煜话剧社</div>
                            </td>
                            <td align="right" valign="middle">
                              <span style="display:inline-block;padding:6px 11px;border:1px solid #dcc7ad;border-radius:999px;font-size:11px;line-height:1.3;color:#795c3c;background:#fbf7f0">注册验证</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="content-cell" style="padding:34px 38px 36px">
                        <div style="font-size:12px;line-height:1.5;color:#a51c38;font-weight:700">第一幕 · 邮箱确认</div>
                        <h1 class="email-title" style="margin:9px 0 10px;font-size:31px;line-height:1.35;font-weight:700;color:#2e1d1e;letter-spacing:0">确认你的邮箱</h1>
                        <p style="margin:0 0 25px;font-size:15px;line-height:1.8;color:#716462">你好，欢迎来到华煜话剧社线上空间。请在注册页面输入下面的验证码。</p>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f8f3ec;border:1px solid #e1d4c6;border-radius:10px">
                          <tr>
                            <td style="padding:22px 18px 24px">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%">
                                <tr>
                                  <td style="font-size:12px;line-height:1.5;color:#7c6a65">你的注册验证码</td>
                                  <td align="right" style="font-size:12px;line-height:1.5;color:#9a713b;font-weight:700">10 分钟有效</td>
                                </tr>
                              </table>
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:14px;table-layout:fixed">
                                <tr>${codeCells}</tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:23px">
                          <tr>
                            <td width="3" style="width:3px;background:#a51c38;font-size:0;line-height:0">&nbsp;</td>
                            <td style="padding-left:13px;font-size:13px;line-height:1.75;color:#756866">
                              为了账号安全，请勿向任何人转发验证码。若不是你本人发起注册，可以忽略这封邮件。
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:18px 38px;background:#f7f2eb;border-top:1px solid #e7ded3">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="font-size:12px;line-height:1.6;color:#8b7c76">在排练场里相遇，在舞台上发光</td>
                            <td align="right" style="font-size:12px;line-height:1.6"><a href="https://qnyzhuayu.cn" style="color:#791327;text-decoration:none;font-weight:700">访问网站 →</a></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <div style="padding:18px 12px 0;font-size:11px;line-height:1.7;color:#9b8d84">这是一封由华煜话剧社网站自动发送的验证邮件，请勿直接回复。</div>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    console.error("Resend request failed", response.status, detail);
    throw new Error("验证码邮件发送失败，请稍后再试");
  }
}

export async function issueEmailCode({ env, email, ipAddress }) {
  await ensureUserTables(env);
  if (!env.RESEND_API_KEY) throw new Error("邮件服务尚未配置");

  const now = Date.now();
  const existingUser = await env.DB.prepare("SELECT id FROM site_users WHERE email = ?").bind(email).first();
  if (existingUser) throw new Error("这个邮箱已经注册过账号");

  const existingCode = await env.DB.prepare("SELECT * FROM email_verification_codes WHERE email = ?").bind(email).first();
  if (existingCode && now < Number(existingCode.resend_after)) {
    const retryAfter = Math.max(1, Math.ceil((Number(existingCode.resend_after) - now) / 1000));
    const cooldownError = new Error(`请等待 ${retryAfter} 秒后再发送`);
    cooldownError.status = 429;
    throw cooldownError;
  }

  const emailWindowActive = existingCode && now - Number(existingCode.window_started_at) < RATE_WINDOW_MS;
  const emailSendCount = emailWindowActive ? Number(existingCode.send_count) : 0;
  if (emailSendCount >= MAX_SENDS_PER_EMAIL) {
    const rateError = new Error("该邮箱请求过于频繁，请一小时后再试");
    rateError.status = 429;
    throw rateError;
  }

  const ipHash = await digest(`${env.RESEND_API_KEY}:${ipAddress || "unknown"}`);
  const ipLimit = await env.DB.prepare("SELECT * FROM email_verification_ip_limits WHERE ip_hash = ?").bind(ipHash).first();
  const ipWindowActive = ipLimit && now - Number(ipLimit.window_started_at) < RATE_WINDOW_MS;
  const ipSendCount = ipWindowActive ? Number(ipLimit.send_count) : 0;
  if (ipSendCount >= MAX_SENDS_PER_IP) {
    const rateError = new Error("请求过于频繁，请一小时后再试");
    rateError.status = 429;
    throw rateError;
  }

  const code = generateCode();
  const codeHash = await hashCode(env, email, code);
  await sendWithResend(env, email, code);

  const emailWindowStartedAt = emailWindowActive ? Number(existingCode.window_started_at) : now;
  const ipWindowStartedAt = ipWindowActive ? Number(ipLimit.window_started_at) : now;
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO email_verification_codes (
        email, code_hash, expires_at, resend_after, attempts, send_count, window_started_at, created_at
      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        code_hash = excluded.code_hash,
        expires_at = excluded.expires_at,
        resend_after = excluded.resend_after,
        attempts = 0,
        send_count = excluded.send_count,
        window_started_at = excluded.window_started_at,
        created_at = excluded.created_at
    `).bind(email, codeHash, now + CODE_TTL_MS, now + RESEND_COOLDOWN_MS, emailSendCount + 1, emailWindowStartedAt, new Date(now).toISOString()),
    env.DB.prepare(`
      INSERT INTO email_verification_ip_limits (ip_hash, window_started_at, send_count)
      VALUES (?, ?, ?)
      ON CONFLICT(ip_hash) DO UPDATE SET
        window_started_at = excluded.window_started_at,
        send_count = excluded.send_count
    `).bind(ipHash, ipWindowStartedAt, ipSendCount + 1),
  ]);

  return { retryAfter: RESEND_COOLDOWN_MS / 1000 };
}

export async function verifyEmailCode(env, email, code) {
  await ensureUserTables(env);
  const row = await env.DB.prepare(`UPDATE email_verification_codes SET attempts = attempts + 1
    WHERE email = ? AND expires_at > ? AND attempts < ? RETURNING *`)
    .bind(email, Date.now(), MAX_VERIFY_ATTEMPTS).first();
  if (!row) return { ok: false, message: "验证码已过期、尝试次数过多或尚未发送，请重新发送" };

  const suppliedHash = await hashCode(env, email, code);
  if (suppliedHash !== row.code_hash) {
    const attempts = Number(row.attempts);
    const remaining = Math.max(0, MAX_VERIFY_ATTEMPTS - attempts);
    return {
      ok: false,
      message: remaining ? `验证码不正确，还可尝试 ${remaining} 次` : "验证码尝试次数过多，请重新发送",
    };
  }
  return { ok: true, codeHash: suppliedHash };
}
