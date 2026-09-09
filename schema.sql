-- Complete schema for NEW databases. CREATE TABLE IF NOT EXISTS does not add
-- columns to existing tables. Upgrade existing D1 via tools/migrate-auth.mjs.
CREATE TABLE IF NOT EXISTS contract (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  club_position TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  tag TEXT DEFAULT '',
  attachments TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved_at TEXT
);

CREATE TABLE IF NOT EXISTS forum_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  parent_id INTEGER,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_post_likes (
  post_id INTEGER NOT NULL,
  actor_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (post_id, actor_id),
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS club_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  summary TEXT NOT NULL,
  author TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved_at TEXT
);

CREATE TABLE IF NOT EXISTS mail_letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public',
  author TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  reply TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  replied_at TEXT
);

CREATE TABLE IF NOT EXISTS writing_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  deadline TEXT DEFAULT '',
  author TEXT NOT NULL,
  fixed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS writing_essays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_users (
  id TEXT PRIMARY KEY,
  account_no TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  profile_name TEXT NOT NULL,
  avatar_data TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  club_role TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  first_used_at TEXT NOT NULL,
  last_used_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  friends TEXT DEFAULT '[]',
  friend_requests TEXT DEFAULT '[]',
  chats TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_post_id ON forum_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_club_activities_status ON club_activities(status);
CREATE INDEX IF NOT EXISTS idx_mail_letters_visibility ON mail_letters(visibility);
CREATE INDEX IF NOT EXISTS idx_writing_essays_event_id ON writing_essays(event_id);
CREATE INDEX IF NOT EXISTS idx_site_users_account_no ON site_users(account_no);
CREATE INDEX IF NOT EXISTS idx_site_users_phone ON site_users(phone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_users_email ON site_users(email) WHERE email <> '';

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
