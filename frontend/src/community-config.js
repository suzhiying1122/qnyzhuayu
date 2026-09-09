export const QQ_CHANNEL = Object.freeze({
  name: "华煜剧坊",
  number: "pd45766824",
  url: "https://pd.qq.com/g/pd45766824",
  qrImage: "/assets/qq-channel/huayu-channel-qr.jpg",
});

export const QQ_CHANNEL_SECTIONS = Object.freeze([
  Object.freeze({
    key: "literary",
    name: "文艺圆谈",
    description: "聚集观演心得，聊聊那些让你记住的舞台与故事。",
    participation: "聊作品、聊角色、聊舞台",
    url: QQ_CHANNEL.url,
  }),
  Object.freeze({
    key: "affairs",
    name: "社团事务",
    description: "回顾活动、发布通知，把社团里的重要时刻留档。",
    participation: "查看活动通知与社团记录",
    url: QQ_CHANNEL.url,
  }),
  Object.freeze({
    key: "partners",
    name: "寻找搭档",
    description: "寻找演员、编剧、摄影与舞台伙伴，让灵感找到同路人。",
    participation: "寻找演员和幕后伙伴",
    url: QQ_CHANNEL.url,
  }),
  Object.freeze({
    key: "chat",
    name: "幕间闲聊",
    description: "社员日常、排练碎片，以及每一次轻松的幕间碰面。",
    participation: "加入社员的日常交流",
    url: QQ_CHANNEL.url,
  }),
]);

export const QQ_CHANNEL_SECTION_MAP = Object.freeze(
  Object.fromEntries(QQ_CHANNEL_SECTIONS.map((section) => [section.key, section])),
);
