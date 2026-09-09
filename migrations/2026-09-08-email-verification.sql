-- One-time legacy SQL: site_users must exist and must NOT already have email.
-- Fresh databases use schema.sql. For safe retries and partially upgraded
-- databases, use npm run auth:migrate -- --local/--remote instead.
ALTER TABLE site_users ADD COLUMN email TEXT DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_site_users_email
ON site_users(email)
WHERE email <> '';

CREATE TABLE IF NOT EXISTS email_verification_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  resend_after INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  send_count INTEGER NOT NULL DEFAULT 1,
  window_started_at INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_verification_ip_limits (
  ip_hash TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  send_count INTEGER NOT NULL DEFAULT 0
);
