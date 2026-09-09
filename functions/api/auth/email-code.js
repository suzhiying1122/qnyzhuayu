import { error, json, readJson, textValue } from "../../_lib/api.js";
import { isValidEmail, issueEmailCode, normalizeEmail } from "../../_lib/email-verification.js";

export async function onRequestPost({ request, env }) {
  const payload = await readJson(request);
  if (!payload) return error("请求体必须是合法 JSON");

  const email = normalizeEmail(textValue(payload, "email"));
  if (!isValidEmail(email)) return error("请输入有效的邮箱地址");

  try {
    const result = await issueEmailCode({
      env,
      email,
      ipAddress: request.headers.get("CF-Connecting-IP") || "local",
    });
    return json({
      message: "验证码已发送，请检查收件箱和垃圾邮件。",
      retryAfter: result.retryAfter,
    });
  } catch (sendError) {
    return error(sendError.status === 429 ? "发送过于频繁，请稍后重试" : "验证码邮件发送失败，请稍后再试", sendError.status === 429 ? 429 : 502);
  }
}
