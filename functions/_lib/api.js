export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

export async function readJson(request) {
  try {
    return await request.json();
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

export function serializePost(row, comments = []) {
  return {
    id: String(row.id),
    title: row.title,
    body: row.body,
    author: row.author,
    tag: row.tag || "",
    createdAt: row.created_at,
    approvedAt: row.approved_at || "",
    attachments: parseAttachments(row.attachments),
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

export async function getSiteState(env) {
  const [posts, pendingPosts, comments, activities, pendingActivities, letters] = await Promise.all([
    env.DB.prepare("SELECT * FROM forum_posts WHERE status = 'approved' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM forum_posts WHERE status = 'pending' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM forum_comments ORDER BY datetime(created_at) ASC").all(),
    env.DB.prepare("SELECT * FROM club_activities WHERE status = 'approved' ORDER BY date DESC, datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM club_activities WHERE status = 'pending' ORDER BY datetime(created_at) DESC").all(),
    env.DB.prepare("SELECT * FROM mail_letters ORDER BY datetime(created_at) DESC").all(),
  ]);
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

  return {
    posts: posts.results.map((post) => serializePost(post, buildCommentTree(commentsByPost.get(String(post.id)) || []))),
    pendingPosts: pendingPosts.results.map((post) => serializePost(post, [])),
    activities: activities.results.map(serializeActivity),
    pendingActivities: pendingActivities.results.map(serializeActivity),
    letters: letters.results.map(serializeLetter),
    writingEvents: writingEvents.results.map(serializeWritingEvent),
    essays: essays.results.map(serializeEssay),
  };
}
