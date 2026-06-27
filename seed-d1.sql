INSERT INTO forum_posts (title, body, author, tag, status, approved_at)
SELECT '大家平时想在论坛里交流哪些话题？', '这里不限制内容方向，学习生活、社团日常、资源互助、兴趣分享、活动建议都可以发。也欢迎把你觉得有意思的话题开成帖子，让更多社员参与进来。', '社团秘书', '交流', 'approved', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM forum_posts);

INSERT INTO forum_posts (title, body, author, tag, status, approved_at)
SELECT '期末复习资料可以集中放一个帖子', '如果大家有公共课笔记、复习重点或者好用的学习方法，可以统一发在这个帖子下面，方便社员互相查找。', '学习互助组', '互助', 'approved', datetime('now')
WHERE (SELECT COUNT(*) FROM forum_posts) = 1;

INSERT INTO forum_posts (title, body, author, tag, status)
SELECT '想开一个社员闲聊帖', '大家可以在里面分享最近看的书、电影、音乐、课程体验，也可以约饭、约自习或者找搭子。', '青藤', '闲聊', 'pending'
WHERE (SELECT COUNT(*) FROM forum_posts) = 2;

INSERT INTO forum_comments (post_id, author, body)
SELECT id, '南楼观众', '可以开一个资料互助帖，也可以放一些日常闲聊主题。'
FROM forum_posts
WHERE title = '大家平时想在论坛里交流哪些话题？'
  AND NOT EXISTS (SELECT 1 FROM forum_comments);

INSERT INTO forum_comments (post_id, parent_id, author, body)
SELECT p.id, c.id, '社团秘书', '这个方向很好，后续可以把资料帖置顶成为长期交流帖。'
FROM forum_posts p
JOIN forum_comments c ON c.post_id = p.id
WHERE p.title = '大家平时想在论坛里交流哪些话题？'
  AND c.author = '南楼观众'
  AND NOT EXISTS (SELECT 1 FROM forum_comments WHERE parent_id = c.id);

INSERT INTO club_activities (type, title, date, summary, author, status, approved_at)
SELECT 'briefing', '《雷雨》片段展演复盘', '2026-05-26', '完成三场片段展演，重点复盘了舞台调度、人物关系推进和灯光转场节奏。下一轮排练将补充走位记录和道具清单。', '社团秘书', 'approved', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM club_activities);

INSERT INTO club_activities (type, title, date, summary, author, status, approved_at)
SELECT 'preview', '夏季读本会：独幕剧夜读', '2026-07-06', '面向全体成员开放，计划共读两部短剧并进行分组围读。欢迎携带自己喜欢的文本片段。', '社团秘书', 'approved', datetime('now')
WHERE (SELECT COUNT(*) FROM club_activities) = 1;

INSERT INTO club_activities (type, title, date, summary, author, status)
SELECT 'preview', '红幕夜读与即兴片段开放场', '2026-07-18', '计划开放给全校同学参与，设置红色飘带布景、追光体验和十分钟即兴片段展示。', '活动组', 'pending'
WHERE (SELECT COUNT(*) FROM club_activities) = 2;

INSERT INTO mail_letters (subject, body, visibility, author, reply, replied_at)
SELECT '希望排练表可以更早公布', '如果每周排练时间能提前两三天同步，大家安排课程和晚自习会更从容。', 'public', '匿名同学', '收到建议。之后排练表会在每周日晚前发布，如有临时变动会同步补发。', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM mail_letters);

INSERT INTO mail_letters (subject, body, visibility, author)
SELECT '想增加幕后岗位介绍', '不少同学不一定想上台，但对灯光、音效、服化和舞监感兴趣。', 'public', '青藤'
WHERE (SELECT COUNT(*) FROM mail_letters) = 1;
