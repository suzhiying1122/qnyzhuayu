export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function error(message, status = 400, code) {
  return json({ error: message, ...(code ? { code } : {}) }, status);
}

export async function readJson(request) {
  try {
    const limit = new URL(request.url).pathname.includes('/auth/') ? 8192 : 12 * 1024 * 1024;
    if (Number(request.headers.get('Content-Length')) > limit) return null;
    const reader = request.body?.getReader();
    if (!reader) return null;
    let size = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null;
  } catch {
    return null;
  }
}

export function textValue(payload, ...keys) {
  for (const key of keys) {
    if (payload?.[key] !== undefined && payload[key] !== null) {
      return String(payload[key]).trim();
    }
  }
  return "";
}

export function parseAttachments(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializePost(row, comments = [], reaction = {}) {
  const likeCount = Number.isFinite(Number(reaction.likeCount))
    ? Math.max(0, Number(reaction.likeCount))
    : Math.max(0, Number(row.like_count) || 0);
  return {
    id: String(row.id),
    title: row.title,
    body: row.body,
    author: row.author,
    tag: row.tag || "",
    createdAt: row.created_at,
    approvedAt: row.approved_at || "",
    attachments: parseAttachments(row.attachments),
    likeCount,
    liked: Boolean(reaction.liked),
    comments,
  };
}

export function serializeActivity(row) {
  return {
    id: String(row.id),
    type: row.type,
    title: row.title,
    date: row.date,
    summary: row.summary,
    author: row.author,
    createdAt: row.created_at,
    approvedAt: row.approved_at || "",
    attachments: parseAttachments(row.attachments),
  };
}

export function serializeLetter(row) {
  return {
    id: String(row.id),
    subject: row.subject,
    body: row.body,
    visibility: row.visibility,
    author: row.author,
    createdAt: row.created_at,
    reply: row.reply || "",
    repliedAt: row.replied_at || "",
    attachments: parseAttachments(row.attachments),
  };
}

export function serializeContract(row) {
  return {
    id: row.id,
    contact_name: row.contact_name,
    phone: row.phone,
    club_position: row.club_position,
  };
}

export function serializeWritingEvent(row) {
  return {
    id: String(row.id),
    title: row.title,
    prompt: row.prompt,
    deadline: row.deadline || "",
    author: row.author,
    fixed: Boolean(row.fixed),
    createdAt: row.created_at,
  };
}

export function serializeEssay(row) {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    title: row.title,
    body: row.body,
    author: row.author,
    createdAt: row.created_at,
    attachments: parseAttachments(row.attachments),
  };
}

export function parseJsonValue(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function serializeUser(row) {
  const user = {
    id: row.id,
    accountNo: row.account_no,
    username: row.username,
    role: row.role || "member",
    profileName: row.profile_name || row.username,
    avatarData: row.avatar_data || "",
    intro: row.intro || "",
    clubRole: row.club_role || (row.role === "admin" ? "管理员 / 社团秘书" : "社员"),
    phone: row.phone || "",
    firstUsedAt: row.first_used_at,
    lastUsedAt: row.last_used_at,
    createdAt: row.created_at,
    friends: parseJsonValue(row.friends, []),
    friendRequests: parseJsonValue(row.friend_requests, []),
    chats: parseJsonValue(row.chats, {}),
  };
  return user;
}

// Schema changes are applied explicitly before deployment, never during public requests.
export async function ensureUserTables(env) {
  await env.DB.prepare("SELECT password_hash FROM site_users LIMIT 0").all();
}

export function serializePublicUser(row) {
  const { phone, friends, friendRequests, chats, ...user } = serializeUser(row);
  return user;
}

export async function getUserById(env, id) {
  await ensureUserTables(env);
  return env.DB.prepare("SELECT * FROM site_users WHERE id = ?").bind(id).first();
}

export async function updateUserJsonFields(env, id, fields) {
  const assignments = [];
  const values = [];
  for (const [key, value] of Object.entries(fields)) {
    assignments.push(`${key} = ?`);
    values.push(JSON.stringify(value));
  }
  if (!assignments.length) return;
  values.push(id);
  await env.DB.prepare(`UPDATE site_users SET ${assignments.join(", ")} WHERE id = ?`).bind(...values).run();
}

export function buildCommentTree(rows) {
  const byParent = new Map();
  for (const row of rows) {
    const key = row.parent_id ? String(row.parent_id) : "";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(row);
  }
  const render = (row) => ({
    id: String(row.id),
    author: row.author,
    body: row.body,
    createdAt: row.created_at,
    attachments: parseAttachments(row.attachments),
    replies: (byParent.get(String(row.id)) || []).map(render),
  });
  return (byParent.get("") || []).map(render);
}

export async function ensureForumReactionTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS forum_post_likes (
      post_id INTEGER NOT NULL,
      actor_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (post_id, actor_id),
      FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_forum_post_likes_post_id ON forum_post_likes(post_id)").run();
}

export async function getSiteState(env, viewerId = "") {
  await ensureForumReactionTable(env);
  const [posts, pendingPosts, comments, activities, pendingActivities, letters] = await Promise.all([
    env.DB.prepare("SELECT * FROM forum_posts WHERE status = 'approved' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM forum_posts WHERE status = 'pending' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM forum_comments ORDER BY datetime(created_at) ASC").all(),
    env.DB.prepare("SELECT * FROM club_activities WHERE status = 'approved' ORDER BY date DESC, datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM club_activities WHERE status = 'pending' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM mail_letters ORDER BY datetime(created_at) DESC").all(),
  ]);
  const likes = await env.DB.prepare("SELECT post_id, actor_id FROM forum_post_likes").all();
  let writingEvents = { results: [] };
  let essays = { results: [] };
  try {
    [writingEvents, essays] = await Promise.all([
      env.DB.prepare("SELECT * FROM writing_events ORDER BY fixed DESC, datetime(created_at) DESC").all(),
      env.DB.prepare("SELECT * FROM writing_essays ORDER BY datetime(created_at) DESC").all(),
    ]);
  } catch {
    writingEvents = { results: [] };
    essays = { results: [] };
  }

  const commentsByPost = new Map();
  for (const comment of comments.results) {
    const key = String(comment.post_id);
    if (!commentsByPost.has(key)) commentsByPost.set(key, []);
    commentsByPost.get(key).push(comment);
  }

  const likesByPost = new Map();
  for (const like of likes.results || []) {
    const key = String(like.post_id);
    if (!likesByPost.has(key)) likesByPost.set(key, []);
    likesByPost.get(key).push(String(like.actor_id));
  }

  const reactionFor = (post) => {
    const actors = likesByPost.get(String(post.id)) || [];
    return {
      likeCount: actors.length,
      liked: Boolean(viewerId && actors.includes(String(viewerId))),
    };
  };

  return {
    posts: posts.results.map((post) => serializePost(post, buildCommentTree(commentsByPost.get(String(post.id)) || []), reactionFor(post))),
    pendingPosts: pendingPosts.results.map((post) => serializePost(post, [])),
    activities: activities.results.map(serializeActivity),
    pendingActivities: pendingActivities.results.map(serializeActivity),
    letters: letters.results.map(serializeLetter),
    writingEvents: writingEvents.results.map(serializeWritingEvent),
    essays: essays.results.map(serializeEssay),
  };
}
