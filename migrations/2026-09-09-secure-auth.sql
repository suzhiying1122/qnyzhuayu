-- Existing databases: use tools/migrate-auth.mjs, not this file directly.
-- The tool converts legacy passwords before this rename; any unexpected value is disabled.
ALTER TABLE site_users RENAME COLUMN password TO password_hash;
UPDATE site_users SET password_hash = '!' WHERE password_hash NOT GLOB 'scrypt$16384$8$5$*';

CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES site_users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiry ON auth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_auth_rate_expiry ON auth_rate_limits(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_users_username ON site_users(username);
