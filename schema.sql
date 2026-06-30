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

CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_club_activities_status ON club_activities(status);
CREATE INDEX IF NOT EXISTS idx_mail_letters_visibility ON mail_letters(visibility);
CREATE INDEX IF NOT EXISTS idx_writing_essays_event_id ON writing_essays(event_id);
