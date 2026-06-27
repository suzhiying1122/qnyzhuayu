const X="huayu-drama-club-state-v2",pt="huayu-drama-club-state-v1",E="huayu-admin-key-unlocked",N="HUAYU-ADMIN-2026";const G=new Set(["home","forum","activities","mailbox","profile","admin","postDetail","activityDetail","letterDetail"]),mt={home:"/",forum:"/forum/",activities:"/activities/",mailbox:"/mailbox/",profile:"/profile/",admin:"/admin-panel/"},v={users:[{id:"user-admin",username:"社团秘书",password:"huayu2026",role:"admin",profileName:"社团秘书",avatarData:"",intro:"负责华煜话剧社线上内容审核、活动档案发布和社团信箱回复。",clubRole:"管理员 / 社团秘书",phone:"",firstUsedAt:"2026-06-01T10:00:00.000Z",lastUsedAt:"2026-06-01T10:00:00.000Z",createdAt:"2026-06-01T10:00:00.000Z"}],currentUserId:null,activeView:"home",activePostId:"post-1",activeActivityId:"activity-1",activeLetterId:"letter-1",activityFilter:"all",adminKey:N,posts:[{id:"post-1",title:"大家平时想在论坛里交流哪些话题？",body:"这里不限定内容方向，学习生活、社团日常、资源互助、兴趣分享、活动建议都可以发。也欢迎把你觉得有意思的话题开成帖子，让更多社员参与进来。",author:"社团秘书",tag:"交流",createdAt:"2026-06-18T12:10:00.000Z",approvedAt:"2026-06-18T12:40:00.000Z",attachments:[],comments:[{id:"comment-1",author:"南楼观众",body:"可以开一个资料互助帖，也可以放一些日常闲聊主题。",createdAt:"2026-06-18T13:05:00.000Z",approvedAt:"2026-06-18T13:30:00.000Z",attachments:[],replies:[{id:"reply-1",author:"社团秘书",body:"这个方向很好，后续可以把资料帖置顶成长期交流帖。",createdAt:"2026-06-18T14:05:00.000Z",attachments:[],replies:[]}]}]},{id:"post-2",title:"期末复习资料可以集中放一个帖子",body:"如果大家有公共课笔记、复习重点或者好用的学习方法，可以统一发在这个帖子下面，方便社员互相查找。",author:"学习互助组",tag:"互助",createdAt:"2026-06-14T09:25:00.000Z",approvedAt:"2026-06-14T10:00:00.000Z",attachments:[],comments:[]}],pendingPosts:[{id:"pending-post-1",title:"想开一个社员闲聊帖",body:"大家可以在里面分享最近看的书、电影、音乐、课程体验，也可以约饭、约自习或者找搭子。",author:"青藤",tag:"闲聊",createdAt:"2026-06-24T15:10:00.000Z",attachments:[]}],pendingComments:[],activities:[{id:"activity-1",type:"briefing",title:"《雷雨》片段展演复盘",date:"2026-05-26",summary:"完成三场片段展演，重点复盘了舞台调度、人物关系推进和灯光转场节奏。下一轮排练将补充走位记录和道具清单。",fileName:"",fileData:"",attachments:[],createdAt:"2026-05-27T10:00:00.000Z",approvedAt:"2026-05-27T11:00:00.000Z",author:"社团秘书"},{id:"activity-2",type:"preview",title:"夏季读本会：独幕剧夜读",date:"2026-07-06",summary:"面向全体成员开放，计划共读两部短剧并进行分组围读。欢迎携带自己喜欢的文本片段。",fileName:"",fileData:"",attachments:[],createdAt:"2026-06-21T15:30:00.000Z",approvedAt:"2026-06-21T16:00:00.000Z",author:"社团秘书"}],pendingActivities:[{id:"pending-activity-1",type:"preview",title:"红幕夜读与即兴片段开放场",date:"2026-07-18",summary:"计划开放给全校同学参与，设置红色飘带布景、追光体验和十分钟即兴片段展示。",fileName:"",fileData:"",attachments:[],createdAt:"2026-06-25T10:15:00.000Z",author:"活动组"}],letters:[{id:"letter-1",subject:"希望排练表可以更早公布",body:"如果每周排练时间能提前两三天同步，大家安排课程和晚自习会更从容。",visibility:"public",author:"匿名同学",createdAt:"2026-06-12T11:10:00.000Z",reply:"收到建议。之后排练表会在每周日晚前发布，如有临时变动会同步补发。",repliedAt:"2026-06-13T08:30:00.000Z",attachments:[]},{id:"letter-2",subject:"想增加幕后岗位介绍",body:"不少同学不一定想上台，但对灯光、音效、服化和舞监感兴趣。",visibility:"public",author:"青藤",createdAt:"2026-06-16T19:00:00.000Z",reply:"",repliedAt:"",attachments:[]}]};let n=ft(),$="login",J=0,L={phone:"",code:"",expiresAt:0};const r={accountName:document.querySelector("#accountName"),authOpenButton:document.querySelector("#authOpenButton"),authCloseButton:document.querySelector("#authCloseButton"),authModal:document.querySelector("#authModal"),authForm:document.querySelector("#authForm"),authUsername:document.querySelector("#authUsername"),authPassword:document.querySelector("#authPassword"),authPhone:document.querySelector("#authPhone"),authCode:document.querySelector("#authCode"),registerFields:document.querySelector("#registerFields"),sendCodeButton:document.querySelector("#sendCodeButton"),verificationNote:document.querySelector("#verificationNote"),authMessage:document.querySelector("#authMessage"),authSubmitButton:document.querySelector("#authSubmitButton"),logoutButton:document.querySelector("#logoutButton"),adminNavButton:document.querySelector("#adminNavButton"),adminHomeGate:document.querySelector("#adminHomeGate"),threadList:document.querySelector("#threadList"),postDetailContent:document.querySelector("#postDetailContent"),activityDetailContent:document.querySelector("#activityDetailContent"),letterDetailContent:document.querySelector("#letterDetailContent"),postForm:document.querySelector("#postForm"),postTitle:document.querySelector("#postTitle"),postBody:document.querySelector("#postBody"),postTag:document.querySelector("#postTag"),postAttachments:document.querySelector("#postAttachments"),currentUserHint:document.querySelector("#currentUserHint"),activityForm:document.querySelector("#activityForm"),activityType:document.querySelector("#activityType"),activityTitle:document.querySelector("#activityTitle"),activityDate:document.querySelector("#activityDate"),activitySummary:document.querySelector("#activitySummary"),activityFile:document.querySelector("#activityFile"),activityList:document.querySelector("#activityList"),letterForm:document.querySelector("#letterForm"),letterSubject:document.querySelector("#letterSubject"),letterBody:document.querySelector("#letterBody"),letterAttachments:document.querySelector("#letterAttachments"),letterList:document.querySelector("#letterList"),mailboxAdminHint:document.querySelector("#mailboxAdminHint"),profileAvatarPreview:document.querySelector("#profileAvatarPreview"),profileDisplayTitle:document.querySelector("#profileDisplayTitle"),profileRoleText:document.querySelector("#profileRoleText"),profileIntroText:document.querySelector("#profileIntroText"),profilePostMetric:document.querySelector("#profilePostMetric"),profileActivityMetric:document.querySelector("#profileActivityMetric"),profileForm:document.querySelector("#profileForm"),profileNameInput:document.querySelector("#profileNameInput"),profileAvatarInput:document.querySelector("#profileAvatarInput"),profileClubRoleInput:document.querySelector("#profileClubRoleInput"),profileIntroInput:document.querySelector("#profileIntroInput"),passwordForm:document.querySelector("#passwordForm"),currentPassword:document.querySelector("#currentPassword"),newPassword:document.querySelector("#newPassword"),confirmPassword:document.querySelector("#confirmPassword"),adminKeyForm:document.querySelector("#adminKeyForm"),currentAdminKey:document.querySelector("#currentAdminKey"),newAdminKey:document.querySelector("#newAdminKey"),confirmAdminKey:document.querySelector("#confirmAdminKey"),postCount:document.querySelector("#postCount"),activityCount:document.querySelector("#activityCount"),publicLetterCount:document.querySelector("#publicLetterCount"),forumPostMetric:document.querySelector("#forumPostMetric"),forumCommentMetric:document.querySelector("#forumCommentMetric"),briefingMetric:document.querySelector("#briefingMetric"),previewMetric:document.querySelector("#previewMetric"),visibleLetterMetric:document.querySelector("#visibleLetterMetric"),privateLetterMetric:document.querySelector("#privateLetterMetric"),pendingPostMetric:document.querySelector("#pendingPostMetric"),pendingActivityMetric:document.querySelector("#pendingActivityMetric"),adminKeyInput:document.querySelector("#adminKeyInput"),adminUnlockButton:document.querySelector("#adminUnlockButton"),adminKeyStatus:document.querySelector("#adminKeyStatus"),pendingPostHint:document.querySelector("#pendingPostHint"),pendingActivityHint:document.querySelector("#pendingActivityHint"),pendingPostList:document.querySelector("#pendingPostList"),pendingActivityList:document.querySelector("#pendingActivityList"),accountAdminHint:document.querySelector("#accountAdminHint"),accountAdminList:document.querySelector("#accountAdminList"),toast:document.querySelector("#toast")};function Yt(){O(),yt(),vt(),u(),window.addEventListener("popstate",()=>{O(),u()}),window.addEventListener("hashchange",()=>{O(),u()})}async function A(t,e={}){const i=await fetch(t,{...e,headers:{"Content-Type":"application/json",...e.headers||{}}}),a=await i.json().catch(()=>({}));if(!i.ok)throw new Error(a.error||a.detail||"服务器请求失败");return a}async function vt(){try{const t=await A("/api/site-state/");n.posts=Array.isArray(t.posts)?t.posts:n.posts,n.pendingPosts=Array.isArray(t.pendingPosts)?t.pendingPosts:n.pendingPosts,n.activities=Array.isArray(t.activities)?t.activities:n.activities,n.pendingActivities=Array.isArray(t.pendingActivities)?t.pendingActivities:n.pendingActivities,n.letters=Array.isArray(t.letters)?t.letters:n.letters,it(),u()}catch(t){s(`后端数据同步失败：${t.message}`)}}function yt(){document.querySelectorAll("[data-view-target]").forEach(t=>{t.addEventListener("click",()=>M(t.dataset.viewTarget))}),document.querySelectorAll("[data-auth-mode]").forEach(t=>{t.addEventListener("click",()=>{$=t.dataset.authMode,Rt()})}),document.querySelectorAll("[data-activity-filter]").forEach(t=>{t.addEventListener("click",()=>{n.activityFilter=t.dataset.activityFilter,f(),et()})}),r.authOpenButton.addEventListener("click",h),r.accountName.addEventListener("click",()=>{if(p()){M("profile");return}h()}),r.authCloseButton.addEventListener("click",F),r.authModal.addEventListener("click",t=>{t.target===r.authModal&&F()}),r.logoutButton.addEventListener("click",()=>{n.currentUserId=null,sessionStorage.removeItem(E),f(),s("已退出当前账号"),u()}),r.authForm.addEventListener("submit",_t),r.sendCodeButton.addEventListener("click",Vt),r.postForm.addEventListener("submit",Lt),r.activityForm.addEventListener("submit",Tt),r.letterForm.addEventListener("submit",Pt),r.profileForm.addEventListener("submit",Mt),r.passwordForm.addEventListener("submit",Et),r.adminKeyForm.addEventListener("submit",Ft),r.adminUnlockButton.addEventListener("click",kt)}function ft(){try{const t=JSON.parse(localStorage.getItem(X)||localStorage.getItem(pt));if(!t||!Array.isArray(t.posts))return structuredClone(v);const e={...structuredClone(v),...t,activeView:t.activeView||t.activeTab||"home",activePostId:t.activePostId||"post-1",activeActivityId:t.activeActivityId||"activity-1",activeLetterId:t.activeLetterId||"letter-1",adminKey:t.adminKey||N,pendingPosts:Array.isArray(t.pendingPosts)?t.pendingPosts:[],pendingComments:Array.isArray(t.pendingComments)?t.pendingComments:[],pendingActivities:Array.isArray(t.pendingActivities)?t.pendingActivities:[]};return ht(e),gt(e),bt(e),e}catch{return structuredClone(v)}}function ht(t){const e=t.users.find(i=>i.username==="社团秘书");if(e){e.password||(e.password="huayu2026"),e.role="admin",j(e);return}t.users.unshift(structuredClone(v.users[0]))}function gt(t){t.adminKey=t.adminKey||N,t.users.forEach(j),t.posts.forEach(e=>{e.attachments=b(e),e.comments=Array.isArray(e.comments)?e.comments:[],e.comments=e.comments.map(H)}),t.pendingPosts.forEach(e=>{e.attachments=b(e)}),t.pendingComments.forEach(e=>{e.attachments=b(e)}),At(t),t.activities.forEach(e=>{e.attachments=b(e)}),t.pendingActivities.forEach(e=>{e.attachments=b(e)}),t.letters.forEach(e=>{e.attachments=b(e)})}function H(t){return{...t,id:t.id||I("comment"),author:t.author||"匿名社员",body:t.body||"",createdAt:t.createdAt||new Date().toISOString(),attachments:b(t),replies:Array.isArray(t.replies)?t.replies.map(H):[]}}function At(t){!Array.isArray(t.pendingComments)||!t.pendingComments.length||(t.pendingComments.forEach(e=>{const i=t.posts.find(a=>a.id===e.postId);i&&i.comments.push(H({id:e.id||I("comment"),author:e.author,body:e.body,createdAt:e.createdAt,attachments:e.attachments||[],replies:[]}))}),t.pendingComments=[])}function j(t){t.profileName=t.profileName||t.username,t.avatarData=t.avatarData||"",t.intro=t.intro||"",t.clubRole=t.clubRole||(t.role==="admin"?"管理员 / 社团秘书":"社员"),t.phone=t.phone||"",t.firstUsedAt=t.firstUsedAt||t.createdAt||new Date().toISOString(),t.lastUsedAt=t.lastUsedAt||t.firstUsedAt,t.createdAt=t.createdAt||t.firstUsedAt}function bt(t){const e=t.posts.find(o=>o.id==="post-1");if(e){e.title=v.posts[0].title,e.body=v.posts[0].body,e.tag=v.posts[0].tag,e.author=v.posts[0].author;const o=e.comments?.find(d=>d.id==="comment-1");o&&Object.assign(o,v.posts[0].comments[0])}const i=t.posts.find(o=>o.id==="post-2");i&&(i.title=v.posts[1].title,i.body=v.posts[1].body,i.tag=v.posts[1].tag,i.author=v.posts[1].author);const a=t.pendingPosts.find(o=>o.id==="pending-post-1");a&&Object.assign(a,v.pendingPosts[0])}function f(){localStorage.setItem(X,JSON.stringify(n))}function u(){it(),Y(),Q(),$t(),tt(),et(),qt(),xt(),Nt(),rt(),nt(),at()}function p(){return n.users.find(t=>t.id===n.currentUserId)||null}function y(){return p()?.role==="admin"}function U(){return sessionStorage.getItem(E)==="true"}function I(t){return`${t}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`}function M(t){if(G.has(t)){if(t==="profile"&&!p()){h(),s("请先登录或注册账号");return}if(t==="admin"&&!y()){h(),s("请先使用管理员账号登录");return}n.activeView=t,f(),Y(),t==="postDetail"&&rt(),t==="activityDetail"&&nt(),t==="letterDetail"&&at(),T(t),window.scrollTo({top:0,behavior:"smooth"})}}function O(){const t=St(window.location.pathname);if(t){n.activeView=t.view,t.postId&&(n.activePostId=t.postId),t.activityId&&(n.activeActivityId=t.activityId),t.letterId&&(n.activeLetterId=t.letterId);return}const e=decodeURIComponent(window.location.hash.replace("#",""));if(e.startsWith("post/")){n.activePostId=e.slice(5),n.activeView="postDetail";return}if(e.startsWith("activity/")){n.activeActivityId=e.slice(9),n.activeView="activityDetail";return}if(e.startsWith("letter/")){n.activeLetterId=e.slice(7),n.activeView="letterDetail";return}G.has(e)&&(n.activeView=e)}function T(t){const e=wt(t);if(window.location.pathname===e&&!window.location.hash)return;const i=`${e}${window.location.search}`;window.history.pushState(null,"",i)}function wt(t){return t==="postDetail"?`/forum/${encodeURIComponent(n.activePostId||"")}/`:t==="activityDetail"?`/activities/${encodeURIComponent(n.activeActivityId||"")}/`:t==="letterDetail"?`/mailbox/${encodeURIComponent(n.activeLetterId||"")}/`:mt[t]||"/"}function St(t){const e=t.split("/").filter(Boolean).map(decodeURIComponent);return e.length?e[0]==="forum"?e[1]?{view:"postDetail",postId:e[1]}:{view:"forum"}:e[0]==="activities"?e[1]?{view:"activityDetail",activityId:e[1]}:{view:"activities"}:e[0]==="mailbox"?e[1]?{view:"letterDetail",letterId:e[1]}:{view:"mailbox"}:e[0]==="profile"?{view:"profile"}:e[0]==="admin-panel"?{view:"admin"}:null:{view:"home"}}function Y(){n.activeView==="admin"&&!y()&&(n.activeView="home",T("home")),n.activeView==="profile"&&!p()&&(n.activeView="home",T("home")),n.activeView==="postDetail"&&!n.posts.some(t=>t.id===n.activePostId)&&(n.activeView="forum",T("forum")),n.activeView==="activityDetail"&&!n.activities.some(t=>t.id===n.activeActivityId)&&(n.activeView="activities",T("activities")),n.activeView==="letterDetail"&&!n.letters.some(t=>t.id===n.activeLetterId&&t.visibility==="public")&&(n.activeView="mailbox",T("mailbox")),document.body.dataset.view=n.activeView,document.querySelectorAll(".view").forEach(t=>{t.classList.toggle("is-active",t.dataset.view===n.activeView)}),document.querySelectorAll("[data-view-target]").forEach(t=>{const e=t.dataset.viewTarget===n.activeView;t.classList.toggle("is-active",e),t.classList.contains("nav-link")&&t.setAttribute("aria-current",e?"page":"false")})}function Q(){const t=p(),e=y();r.accountName.textContent=t?g(t):"未登录",r.accountName.classList.toggle("is-clickable",!!t),r.authOpenButton.classList.toggle("hidden",!!t),r.logoutButton.classList.toggle("hidden",!t),r.adminNavButton.classList.toggle("hidden",!e),r.adminHomeGate.classList.toggle("hidden",!e),r.currentUserHint.textContent=t?`${g(t)} 可自由交流，公开前需审核`:"注册账号后可提交话题不限的内容"}function $t(){const t=n.letters.filter(m=>m.visibility==="public"),e=n.letters.filter(m=>m.visibility==="private"),i=n.activities.filter(m=>m.type==="briefing").length,a=n.activities.filter(m=>m.type==="preview").length,o=n.posts.reduce((m,ut)=>m+K(ut.comments),0),d=p(),l=d?g(d):"",x=l?n.activities.filter(m=>m.author===l).length:0;r.postCount.textContent=n.posts.length,r.activityCount.textContent=n.activities.length,r.publicLetterCount.textContent=t.length,r.forumPostMetric.textContent=n.posts.length,r.forumCommentMetric.textContent=o,r.briefingMetric.textContent=i,r.previewMetric.textContent=a,r.visibleLetterMetric.textContent=t.length,r.privateLetterMetric.textContent=e.length,r.pendingPostMetric.textContent=n.pendingPosts.length,r.pendingActivityMetric.textContent=n.pendingActivities.length,r.profilePostMetric.textContent=l?n.posts.filter(m=>m.author===l).length:0,r.profileActivityMetric.textContent=x}function tt(){const t=p();r.postTitle.disabled=!t,r.postBody.disabled=!t,r.postTag.disabled=!t,r.postAttachments.disabled=!t,r.postForm.querySelector("button").disabled=!t,r.threadList.innerHTML=n.posts.length?n.posts.slice().sort((e,i)=>new Date(i.approvedAt||i.createdAt)-new Date(e.approvedAt||e.createdAt)).map(Ct).join(""):'<div class="empty-state">还没有公开帖子。</div>',r.threadList.querySelectorAll("[data-open-post]").forEach(e=>{e.addEventListener("click",()=>{V("post",e.dataset.openPost)})}),r.threadList.querySelectorAll("[data-post-id]").forEach(e=>{e.addEventListener("click",i=>{i.target.closest("[data-open-post]")||(n.activePostId=e.dataset.postId,f(),tt())})})}function Ct(t){const e=Array.isArray(t.comments)?t.comments:[],i=q(t);return`
    <article class="thread-card ${t.id===n.activePostId?"is-active":""}" data-post-id="${t.id}">
      <div class="tag-row">
        <span class="tag">${c(t.tag||"讨论")}</span>
        <span>${K(e)} 条留言</span>
        ${i}
      </div>
      <button class="thread-title-button" type="button" data-open-post="${t.id}">
        <h4>${c(t.title)}</h4>
      </button>
      <div class="thread-preview">${c(Xt(t.body,96))}</div>
      <div class="meta-row">
        <span>${c(t.author)}</span>
        <span>${w(t.approvedAt||t.createdAt)}</span>
      </div>
    </article>
  `}async function Lt(t){if(t.preventDefault(),!B())return;const e=r.postTitle.value.trim(),i=r.postBody.value.trim(),a=r.postTag.value.trim()||"讨论";if(!e||!i)return;let o=[];try{o=await Z(r.postAttachments.files)}catch(d){s(d.message);return}try{const d=await A("/api/forum/posts/",{method:"POST",body:JSON.stringify({title:e,body:i,author:g(p()),tag:a,attachments:o})});n.pendingPosts.unshift(d.result)}catch(d){s(d.message);return}r.postForm.reset(),s("帖子已提交管理员审核"),u()}async function Tt(t){if(t.preventDefault(),!B())return;let e=[];try{e=await Z(r.activityFile.files)}catch(i){s(i.message);return}try{const i=await A("/api/activities/",{method:"POST",body:JSON.stringify({type:r.activityType.value,title:r.activityTitle.value.trim(),date:r.activityDate.value,summary:r.activitySummary.value.trim(),author:g(p()),attachments:e})});n.pendingActivities.unshift(i.result)}catch(i){s(i.message);return}r.activityForm.reset(),s("活动已提交管理员审核"),u()}function et(){document.querySelectorAll("[data-activity-filter]").forEach(i=>{i.classList.toggle("is-active",i.dataset.activityFilter===n.activityFilter)});const t=p();r.activityForm.querySelectorAll("input, textarea, select, button").forEach(i=>{i.disabled=!t});const e=n.activities.filter(i=>n.activityFilter==="all"||i.type===n.activityFilter).sort((i,a)=>new Date(a.date)-new Date(i.date));r.activityList.innerHTML=e.length?e.map(It).join(""):'<div class="empty-state">当前筛选下暂无公开活动。</div>',r.activityList.querySelectorAll("[data-open-activity]").forEach(i=>{i.addEventListener("click",()=>V("activity",i.dataset.openActivity))})}function It(t){const e=t.type==="preview",i=e?"活动预告":"活动简报",a=q(t)||"<span>暂无附件</span>";return`
    <article class="activity-card">
      <div class="tag-row">
        <span class="type-pill ${e?"preview":""}">${i}</span>
        <span>${z(t.date)}</span>
      </div>
      <button class="card-title-button" type="button" data-open-activity="${t.id}">
        <h3>${c(t.title)}</h3>
      </button>
      <div class="activity-summary">${c(t.summary)}</div>
      <footer>
        <span>${c(t.author||"华煜话剧社")}</span>
        ${a}
      </footer>
    </article>
  `}async function Pt(t){if(t.preventDefault(),!B())return;const e=new FormData(r.letterForm).get("letterVisibility");let i=[];try{i=await Z(r.letterAttachments.files)}catch(a){s(a.message);return}try{const a=await A("/api/letters/",{method:"POST",body:JSON.stringify({subject:r.letterSubject.value.trim(),body:r.letterBody.value.trim(),visibility:e,author:e==="public"?g(p()):"匿名来信",attachments:i})});n.letters.unshift(a.result)}catch(a){s(a.message);return}r.letterForm.reset(),r.letterForm.querySelector("input[value='public']").checked=!0,s(e==="public"?"公开信件已投递":"不公开信件已投递"),u()}function qt(){const t=p();r.letterForm.querySelectorAll("input, textarea, button").forEach(i=>{i.disabled=!t}),r.mailboxAdminHint.textContent=y()?U()?"管理员可回复公开信件":"输入密钥后可回复公开信件":"";const e=n.letters.filter(i=>i.visibility==="public").sort((i,a)=>new Date(a.createdAt)-new Date(i.createdAt));r.letterList.innerHTML=e.length?e.map(Dt).join(""):'<div class="empty-state">暂无公开信件。</div>',r.letterList.querySelectorAll("[data-open-letter]").forEach(i=>{i.addEventListener("click",()=>V("letter",i.dataset.openLetter))}),r.letterList.querySelectorAll("[data-reply-form]").forEach(i=>{i.addEventListener("submit",async a=>{if(a.preventDefault(),!P())return;const o=n.letters.find(l=>l.id===i.dataset.replyForm),d=i.querySelector("textarea").value.trim();if(!(!o||!d))try{const l=await A(`/api/admin/letters/${o.id}/reply/`,{method:"POST",body:JSON.stringify({admin_key:C(),reply:d})});Object.assign(o,l.result),s("社团回复已发布"),u()}catch(l){s(l.message)}})})}function Dt(t){const e=t.reply?`<div class="club-reply"><strong>社团回复：</strong>${c(t.reply)}</div>`:'<div class="empty-state">等待社团回复。</div>';return`
    <article class="letter-card">
      <div class="tag-row">
        <span class="reply-pill">公开信件</span>
        <span>${c(t.author)} · ${w(t.createdAt)}</span>
      </div>
      <button class="card-title-button" type="button" data-open-letter="${t.id}">
        <h3>${c(t.subject)}</h3>
      </button>
      <div class="letter-body">${c(t.body)}</div>
      ${D(t,"compact")}
      ${e}
      <footer>
        <span>${q(t)||"无附件"}</span>
        <span>${t.reply?"已回复":"待回复"}</span>
      </footer>
    </article>
  `}function xt(){const t=p(),e=y();if(!t){r.profileDisplayTitle.textContent="未登录",r.profileRoleText.textContent="登录后完善你的社员资料",r.profileIntroText.textContent="这里会显示你的个人介绍。",r.profileAvatarPreview.textContent="华",r.profileAvatarPreview.style.backgroundImage="",r.profileForm.querySelectorAll("input, textarea, button").forEach(o=>{o.disabled=!0}),r.passwordForm.querySelectorAll("input, button").forEach(o=>{o.disabled=!0}),r.adminKeyForm.classList.add("hidden");return}j(t);const i=g(t),a=i.slice(0,1)||"华";r.profileDisplayTitle.textContent=i,r.profileRoleText.textContent=t.clubRole||(e?"管理员 / 社团秘书":"社员"),r.profileIntroText.textContent=t.intro||"还没有填写个人介绍。",r.profileAvatarPreview.textContent=t.avatarData?"":a,r.profileAvatarPreview.style.backgroundImage=t.avatarData?`url("${t.avatarData}")`:"",r.profileNameInput.value=t.profileName||t.username,r.profileClubRoleInput.value=t.clubRole||"",r.profileIntroInput.value=t.intro||"",r.profileForm.querySelectorAll("input, textarea, button").forEach(o=>{o.disabled=!1}),r.passwordForm.querySelectorAll("input, button").forEach(o=>{o.disabled=!1}),r.adminKeyForm.classList.toggle("hidden",!e)}async function Mt(t){t.preventDefault();const e=p();if(!e){h();return}const i=r.profileAvatarInput.files[0];if(i&&!i.type.startsWith("image/")){s("头像需要上传图片文件");return}if(i&&i.size>2621440){s("头像超过 2.5MB，请先压缩后再上传");return}let a=e.avatarData||"";i&&(a=await st(i)),e.profileName=r.profileNameInput.value.trim()||e.username,e.avatarData=a,e.clubRole=r.profileClubRoleInput.value.trim()||(e.role==="admin"?"管理员 / 社团秘书":"社员"),e.intro=r.profileIntroInput.value.trim();try{f()}catch{s("浏览器本地空间不足，头像未保存");return}r.profileAvatarInput.value="",s("个人资料已保存"),u()}function Et(t){t.preventDefault();const e=p();if(!e){h();return}const i=r.currentPassword.value,a=r.newPassword.value,o=r.confirmPassword.value;if(i!==e.password){s("当前密码不正确");return}if(a!==o){s("两次输入的新密码不一致");return}if(a.length<4){s("新密码至少需要 4 位");return}e.password=a,f(),r.passwordForm.reset(),s("密码已更新"),Q()}function Ft(t){if(t.preventDefault(),!y()){h(),s("请先使用管理员账号登录");return}const e=r.currentAdminKey.value.trim(),i=r.newAdminKey.value.trim(),a=r.confirmAdminKey.value.trim();if(e!==C()){s("当前密钥不正确");return}if(i.length<6){s("新密钥至少需要 6 位");return}if(i!==a){s("两次输入的新密钥不一致");return}n.adminKey=i,sessionStorage.removeItem(E),f(),r.adminKeyForm.reset(),s("管理员密钥已更新，请用新密钥重新解锁"),u()}function kt(){if(!y()){h(),s("请先使用管理员账号登录");return}if(r.adminKeyInput.value.trim()!==C()){r.adminKeyStatus.textContent="密钥不正确",r.adminKeyStatus.classList.remove("is-ok"),s("密钥不正确");return}sessionStorage.setItem(E,"true"),r.adminKeyInput.value="",s("审批权限已解锁"),u()}function Nt(){const t=y(),e=U();r.adminKeyInput.disabled=!t,r.adminUnlockButton.disabled=!t,r.adminKeyStatus.textContent=t?e?"已解锁：可以审核、驳回和回复。":"请输入当前内容修改密钥解锁审批。":"请使用社团秘书账号登录。",r.adminKeyStatus.classList.toggle("is-ok",t&&e),r.pendingPostHint.textContent=`${n.pendingPosts.length} 条待处理`,r.pendingActivityHint.textContent=`${n.pendingActivities.length} 条待处理`,r.accountAdminHint.textContent=t?`${n.users.length} 个账号 · 仅展示账号与使用时间`:"管理员登录后可查看",r.pendingPostList.innerHTML=t?n.pendingPosts.length?n.pendingPosts.map(i=>Ut(i,e)).join(""):'<div class="empty-state">暂无待审核帖子。</div>':'<div class="empty-state">管理员登录后可查看待审内容。</div>',r.pendingActivityList.innerHTML=t?n.pendingActivities.length?n.pendingActivities.map(i=>Bt(i,e)).join(""):'<div class="empty-state">暂无待审核活动。</div>':'<div class="empty-state">管理员登录后可查看待审内容。</div>',r.accountAdminList.innerHTML=t?n.users.slice().sort((i,a)=>new Date(a.lastUsedAt||a.createdAt)-new Date(i.lastUsedAt||i.createdAt)).map(i=>Kt(i,e)).join(""):'<div class="empty-state">管理员登录后可查看账号列表。</div>',r.pendingPostList.querySelectorAll("[data-approve-post]").forEach(i=>{i.addEventListener("click",()=>Ht(i.dataset.approvePost))}),r.pendingPostList.querySelectorAll("[data-reject-post]").forEach(i=>{i.addEventListener("click",()=>W("post",i.dataset.rejectPost))}),r.pendingActivityList.querySelectorAll("[data-approve-activity]").forEach(i=>{i.addEventListener("click",()=>jt(i.dataset.approveActivity))}),r.pendingActivityList.querySelectorAll("[data-reject-activity]").forEach(i=>{i.addEventListener("click",()=>W("activity",i.dataset.rejectActivity))}),r.accountAdminList.querySelectorAll("[data-delete-user]").forEach(i=>{i.addEventListener("click",()=>Ot(i.dataset.deleteUser))})}function Ut(t,e){return`
    <article class="review-card">
      <div class="tag-row">
        <span class="tag">${c(t.tag||"讨论")}</span>
        <span>${c(t.author)} · ${w(t.createdAt)}</span>
      </div>
      <h4>${c(t.title)}</h4>
      <p>${c(t.body)}</p>
      ${D(t,"compact")}
      <div class="review-actions">
        <button class="approve-button" data-approve-post="${t.id}" type="button" ${e?"":"disabled"}>通过发布</button>
        <button class="reject-button" data-reject-post="${t.id}" type="button" ${e?"":"disabled"}>驳回</button>
      </div>
    </article>
  `}function Bt(t,e){const i=t.type==="preview";return`
    <article class="review-card">
      <div class="tag-row">
        <span class="type-pill ${i?"preview":""}">${i?"活动预告":"活动简报"}</span>
        <span>${c(t.author)} · ${z(t.date)}</span>
      </div>
      <h4>${c(t.title)}</h4>
      <p>${c(t.summary)}</p>
      ${D(t,"compact")}
      <div class="review-actions">
        <button class="approve-button" data-approve-activity="${t.id}" type="button" ${e?"":"disabled"}>通过发布</button>
        <button class="reject-button" data-reject-activity="${t.id}" type="button" ${e?"":"disabled"}>驳回</button>
      </div>
    </article>
  `}function Kt(t,e){const i=t.role==="admin"||t.id===n.currentUserId;return`
    <article class="account-row">
      <div>
        <strong>${c(t.username)}</strong>
        <span>${t.role==="admin"?"设备管理员":"注册账号"}</span>
      </div>
      <dl>
        <div>
          <dt>首次使用</dt>
          <dd>${w(t.firstUsedAt||t.createdAt)}</dd>
        </div>
        <div>
          <dt>最近使用</dt>
          <dd>${w(t.lastUsedAt||t.createdAt)}</dd>
        </div>
      </dl>
      <button class="reject-button" data-delete-user="${t.id}" type="button" ${e&&!i?"":"disabled"}>
        ${i?"不可注销":"注销账号"}
      </button>
    </article>
  `}function P(){return y()?U()?!0:(M("admin"),s("请输入内容修改密钥"),!1):(h(),s("请先使用管理员账号登录"),!1)}function Ot(t){if(!P())return;const e=n.users.find(a=>a.id===t);if(!e)return;if(e.role==="admin"||e.id===n.currentUserId){s("管理员账号不能在这里注销");return}window.confirm(`确定注销账号“${e.username}”吗？注销后该账号不能再登录。`)&&(n.users=n.users.filter(a=>a.id!==t),f(),s("账号已注销"),u())}async function Ht(t){if(P())try{const e=await A(`/api/admin/posts/${t}/approve/`,{method:"POST",body:JSON.stringify({admin_key:C()})});n.pendingPosts=n.pendingPosts.filter(i=>i.id!==t),n.posts.unshift(e.result),n.activePostId=e.result.id,s("帖子已通过并公开"),u()}catch(e){s(e.message)}}async function jt(t){if(P())try{const e=await A(`/api/admin/activities/${t}/approve/`,{method:"POST",body:JSON.stringify({admin_key:C()})});n.pendingActivities=n.pendingActivities.filter(i=>i.id!==t),n.activities.unshift(e.result),s("活动已通过并公开"),u()}catch(e){s(e.message)}}async function W(t,e){if(P())try{await A(`/api/admin/${t}/${e}/reject/`,{method:"POST",body:JSON.stringify({admin_key:C()})}),t==="post"&&(n.pendingPosts=n.pendingPosts.filter(i=>i.id!==e)),t==="activity"&&(n.pendingActivities=n.pendingActivities.filter(i=>i.id!==e)),s("内容已驳回"),u()}catch(i){s(i.message)}}function Vt(){if($!=="register")return;const t=ct(r.authPhone.value);if(r.authPhone.value=t,!dt(t)){r.authMessage.textContent="请输入 11 位手机号";return}if(n.users.some(i=>i.phone===t)){r.authMessage.textContent="这个手机号已经注册过账号";return}const e=String(Math.floor(1e5+Math.random()*9e5));L={phone:t,code:e,expiresAt:Date.now()+3e5},r.authCode.value="",r.verificationNote.textContent=`演示验证码：${e}，5 分钟内有效。`,r.authMessage.textContent="",s(`验证码已发送：${e}`)}function _t(t){t.preventDefault();const e=r.authUsername.value.trim(),i=r.authPassword.value;if(!e||!i)return;if($==="register"){const o=ct(r.authPhone.value),d=r.authCode.value.trim();if(n.users.some(m=>m.username===e)){r.authMessage.textContent="这个用户名已经被注册";return}if(!dt(o)){r.authMessage.textContent="请输入 11 位手机号";return}if(n.users.some(m=>m.phone===o)){r.authMessage.textContent="这个手机号已经注册过账号";return}if(!L.code||L.phone!==o||L.expiresAt<Date.now()){r.authMessage.textContent="请先发送有效验证码";return}if(d!==L.code){r.authMessage.textContent="验证码不正确";return}const l=new Date().toISOString(),x={id:I("user"),username:e,password:i,role:"member",profileName:e,avatarData:"",intro:"",clubRole:"社员",phone:o,firstUsedAt:l,lastUsedAt:l,createdAt:l};n.users.push(x),n.currentUserId=x.id,L={phone:"",code:"",expiresAt:0},f(),F(),s(`欢迎加入，${g(x)}`),u();return}const a=n.users.find(o=>o.username===e&&o.password===i);if(!a){r.authMessage.textContent="用户名或密码不正确";return}n.currentUserId=a.id,a.lastUsedAt=new Date().toISOString(),a.role!=="admin"&&sessionStorage.removeItem(E),f(),F(),s(`欢迎回来，${g(a)}`),u()}function h(){r.authModal.classList.remove("hidden"),r.authMessage.textContent="",r.authUsername.focus()}function F(){r.authModal.classList.add("hidden"),r.authForm.reset(),r.authMessage.textContent="",r.verificationNote.textContent="验证码会以站内弹窗形式展示，作为短信流程演示。"}function Rt(){document.querySelectorAll("[data-auth-mode]").forEach(e=>{e.classList.toggle("is-active",e.dataset.authMode===$)});const t=$==="register";r.registerFields.classList.toggle("hidden",!t),r.authPhone.required=t,r.authCode.required=t,r.authPhone.disabled=!t,r.authCode.disabled=!t,r.sendCodeButton.disabled=!t,r.authSubmitButton.textContent=$==="login"?"登录":"注册",r.authMessage.textContent="",r.authPassword.autocomplete=$==="login"?"current-password":"new-password"}function B(){return p()?!0:(h(),s("请先登录或注册账号"),!1)}function it(){n.posts.some(t=>t.id===n.activePostId)||(n.activePostId=n.posts[0]?.id||"")}function V(t,e){const i={post:"postDetail",activity:"activityDetail",letter:"letterDetail"};t==="post"&&(n.activePostId=e),t==="activity"&&(n.activeActivityId=e),t==="letter"&&(n.activeLetterId=e),M(i[t])}function rt(){const t=n.posts.find(o=>o.id===n.activePostId);if(!t){r.postDetailContent.innerHTML=_("forum","帖子不存在或尚未公开。");return}const e=Array.isArray(t.comments)?t.comments:[],i=e.length?e.map(o=>ot(o,t.id,1)).join(""):'<div class="empty-state">还没有留言，来做第一个回复的人。</div>',a=p();r.postDetailContent.innerHTML=`
    <div class="detail-page-hero">
      <button class="back-button" data-view-target="forum" type="button">返回论坛</button>
      <div>
        <p class="section-kicker">Thread</p>
        <h2 id="postDetailTitle">${c(t.title)}</h2>
        <p>${c(t.author)} · ${w(t.approvedAt||t.createdAt)} · ${K(e)} 条留言</p>
      </div>
    </div>
    <article class="tieba-thread">
      <div class="thread-floor floor-host">
        <aside class="floor-author">
          <div class="floor-avatar">${c((t.author||"华").slice(0,1))}</div>
          <strong>${c(t.author||"匿名社员")}</strong>
          <span>楼主</span>
        </aside>
        <div class="floor-content">
          <div class="tag-row">
            <span class="tag">${c(t.tag||"讨论")}</span>
            ${q(t)}
          </div>
          <div class="detail-body">${c(t.body)}</div>
          ${D(t,"full")}
        </div>
      </div>
      <section class="thread-replies">
        <div class="list-title">
          <h3>全部留言</h3>
          <span>实时发布，可对任意留言继续回复</span>
        </div>
        <form class="comment-form primary-comment-form" data-comment-form data-post-id="${t.id}">
          <textarea name="commentBody" rows="4" maxlength="420" placeholder="${a?"回复楼主，内容会立即显示":"登录后可以留言"}" ${a?"":"disabled"} required></textarea>
          <button class="primary-button" type="submit" ${a?"":"disabled"}>发布留言</button>
        </form>
        <div class="comment-thread-list">${i}</div>
      </section>
    </article>
  `,R(r.postDetailContent),Zt()}function nt(){const t=n.activities.find(a=>a.id===n.activeActivityId);if(!t){r.activityDetailContent.innerHTML=_("activities","活动内容不存在或尚未公开。");return}const e=t.type==="preview",i=e?"活动预告":"活动简报";r.activityDetailContent.innerHTML=`
    <div class="detail-page-hero">
      <button class="back-button" data-view-target="activities" type="button">返回活动</button>
      <div>
        <p class="section-kicker">Activity</p>
        <h2 id="activityDetailTitle">${c(t.title)}</h2>
        <p>${i} · ${z(t.date)} · ${c(t.author||"华煜话剧社")}</p>
      </div>
    </div>
    <article class="detail-readable-card">
      <div class="tag-row">
        <span class="type-pill ${e?"preview":""}">${i}</span>
        ${q(t)}
      </div>
      <div class="detail-body">${c(t.summary)}</div>
      ${D(t,"full")}
    </article>
  `,R(r.activityDetailContent)}function at(){const t=n.letters.find(o=>o.id===n.activeLetterId&&o.visibility==="public");if(!t){r.letterDetailContent.innerHTML=_("mailbox","信件不存在或未选择公开。");return}const e=y()&&U(),i=t.reply?`<div class="club-reply"><strong>社团回复：</strong>${c(t.reply)}<span>${t.repliedAt?` · ${w(t.repliedAt)}`:""}</span></div>`:'<div class="empty-state">等待社团回复。</div>',a=y()?`
      <form class="reply-form letter-reply-form" id="letterDetailReplyForm">
        <textarea rows="4" maxlength="420" placeholder="${e?"填写社团回复":"输入管理员密钥后可回复"}" ${e?"":"disabled"}>${c(t.reply)}</textarea>
        <button class="primary-button" type="submit" ${e?"":"disabled"}>发布回复</button>
      </form>
    `:"";r.letterDetailContent.innerHTML=`
    <div class="detail-page-hero">
      <button class="back-button" data-view-target="mailbox" type="button">返回信箱</button>
      <div>
        <p class="section-kicker">Letter</p>
        <h2 id="letterDetailTitle">${c(t.subject)}</h2>
        <p>${c(t.author)} · ${w(t.createdAt)}</p>
      </div>
    </div>
    <article class="detail-readable-card">
      <div class="tag-row">
        <span class="reply-pill">公开信件</span>
        ${q(t)}
      </div>
      <div class="detail-body">${c(t.body)}</div>
      ${D(t,"full")}
      ${i}
      ${a}
    </article>
  `,R(r.letterDetailContent),zt()}function _(t,e){return`
    <div class="detail-page-hero">
      <button class="back-button" data-view-target="${t}" type="button">返回</button>
      <div>
        <p class="section-kicker">Not Found</p>
        <h2>没有找到内容</h2>
        <p>${c(e)}</p>
      </div>
    </div>
  `}function R(t){t.querySelectorAll("[data-view-target]").forEach(e=>{e.addEventListener("click",()=>M(e.dataset.viewTarget))})}function Zt(){r.postDetailContent.querySelectorAll("[data-comment-form]").forEach(t=>{t.addEventListener("submit",async e=>{if(e.preventDefault(),!B())return;const i=t.querySelector("textarea").value.trim(),a=t.dataset.postId,o=t.dataset.parentId||"";i&&await Jt(a,i,o)})})}function zt(){const t=r.letterDetailContent.querySelector("#letterDetailReplyForm");t?.addEventListener("submit",async e=>{if(e.preventDefault(),!P())return;const i=n.letters.find(o=>o.id===n.activeLetterId),a=t.querySelector("textarea").value.trim();if(!(!i||!a))try{const o=await A(`/api/admin/letters/${i.id}/reply/`,{method:"POST",body:JSON.stringify({admin_key:C(),reply:a})});Object.assign(i,o.result),s("社团回复已发布"),u()}catch(o){s(o.message)}})}async function Jt(t,e,i=""){const a=n.posts.find(o=>o.id===t);if(a)try{const d=(await A("/api/forum/comments/",{method:"POST",body:JSON.stringify({post_id:t,parent_id:i,author:g(p()),body:e})})).result;if(!i)a.comments.push(d);else{const l=lt(a.comments,i);l?(l.replies=Array.isArray(l.replies)?l.replies:[],l.replies.push(d)):a.comments.push(d)}s(i?"回复已发布":"留言已发布"),u()}catch(o){s(o.message)}}function ot(t,e,i=1){const a=p(),o=Array.isArray(t.replies)?t.replies:[],d=o.length?o.map(l=>ot(l,e,Math.min(i+1,5))).join(""):"";return`
    <article class="comment-card comment-depth-${Math.min(i,5)}">
      <div class="meta-row">
        <strong>${c(t.author||"匿名社员")}</strong>
        <span>${w(t.createdAt)}</span>
      </div>
      <p>${c(t.body)}</p>
      <form class="comment-form inline-reply-form" data-comment-form data-post-id="${e}" data-parent-id="${t.id}">
        <textarea name="commentBody" rows="2" maxlength="360" placeholder="${a?`回复 ${S(t.author||"这条留言")}`:"登录后可以回复"}" ${a?"":"disabled"} required></textarea>
        <button class="secondary-button" type="submit" ${a?"":"disabled"}>回复</button>
      </form>
      ${d?`<div class="nested-replies">${d}</div>`:""}
    </article>
  `}function b(t){const i=(Array.isArray(t.attachments)?t.attachments.filter(Boolean):[]).map(a=>({id:a.id||I("attachment"),name:a.name||a.fileName||"附件",type:a.type||k(a.name||a.fileName||"",a.data||a.fileData||""),size:Number(a.size)||0,data:a.data||a.fileData||""}));return t.fileData&&t.fileName&&!i.some(a=>a.data===t.fileData)&&i.push({id:I("attachment"),name:t.fileName,type:k(t.fileName,t.fileData),size:0,data:t.fileData}),i}function q(t){const e=b(t).length;return e?`<span class="attachment-count">附件 ${e}</span>`:""}function D(t,e="full"){const i=b(t);if(!i.length)return e==="full"?'<div class="empty-state">暂无附件。</div>':"";const a=i.map(o=>Wt(o,e)).join("");return`
    <div class="attachment-list ${e==="compact"?"attachment-list-compact":""}">
      <h4>附件</h4>
      <div class="attachment-grid">${a}</div>
    </div>
  `}function Wt(t,e){const i=c(t.name||"附件"),a=S(t.data||"#"),o=k(t.name,t.data||t.type),d=t.size?` · ${Gt(t.size)}`:"";return e==="compact"?t.data?`<a class="attachment-chip" href="${a}" download="${S(t.name)}">${i}${d}</a>`:`<span class="attachment-chip">${i}${d}</span>`:o.startsWith("image/")&&t.data?`
      <figure class="attachment-preview">
        <img src="${a}" alt="${S(t.name)}" />
        <figcaption>
          <span>${i}${d}</span>
          <a class="file-link" href="${a}" download="${S(t.name)}">下载</a>
        </figcaption>
      </figure>
    `:o.startsWith("video/")&&t.data?`
      <figure class="attachment-preview">
        <video src="${a}" controls></video>
        <figcaption>
          <span>${i}${d}</span>
          <a class="file-link" href="${a}" download="${S(t.name)}">下载</a>
        </figcaption>
      </figure>
    `:t.data?`<a class="document-attachment" href="${a}" download="${S(t.name)}"><strong>${i}</strong><span>文档附件${d}</span></a>`:`<div class="document-attachment"><strong>${i}</strong><span>文档附件${d}</span></div>`}async function Z(t){const e=Array.from(t||[]);if(!e.length)return[];if(e.length>5)throw new Error("最多一次上传 5 个附件");if(e.reduce((o,d)=>o+d.size,0)>8388608)throw new Error("附件总大小超过 8MB，请减少或压缩后再上传");for(const o of e)if(o.size>2621440)throw new Error("单个附件超过 2.5MB，请先压缩后再上传");const a=[];for(const o of e)a.push({id:I("attachment"),name:o.name,type:o.type||k(o.name,""),size:o.size,data:await st(o)});return a}function st(t){return new Promise((e,i)=>{const a=new FileReader;a.addEventListener("load",()=>e(a.result)),a.addEventListener("error",i),a.readAsDataURL(t)})}function g(t){return t?(t.profileName||t.username||"").trim():""}function Xt(t,e){const i=String(t||"").replace(/\s+/g," ").trim();return i.length>e?`${i.slice(0,e)}...`:i}function ct(t){return String(t||"").replace(/\D/g,"").slice(0,11)}function dt(t){return/^\d{11}$/.test(t)}function K(t=[]){return t.reduce((e,i)=>{const a=Array.isArray(i.replies)?i.replies:[];return e+1+K(a)},0)}function lt(t=[],e){for(const i of t){if(i.id===e)return i;const a=lt(i.replies||[],e);if(a)return a}return null}function C(){return n.adminKey||N}function k(t="",e=""){if(typeof e=="string"&&e.startsWith("data:"))return e.slice(5,e.indexOf(";"))||"application/octet-stream";const i=String(t).split(".").pop()?.toLowerCase();return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",mp4:"video/mp4",mov:"video/quicktime",webm:"video/webm",pdf:"application/pdf",doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",ppt:"application/vnd.ms-powerpoint",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",xls:"application/vnd.ms-excel",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",txt:"text/plain",zip:"application/zip"}[i]||"application/octet-stream"}function Gt(t){return t?t<1024*1024?`${Math.max(1,Math.round(t/1024))}KB`:`${(t/1024/1024).toFixed(1)}MB`:""}function w(t){return new Intl.DateTimeFormat("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(t))}function z(t){return new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(`${t}T00:00:00`))}function c(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function S(t){return c(t).replaceAll("`","&#096;")}function s(t){window.clearTimeout(J),r.toast.textContent=t,r.toast.classList.remove("hidden"),J=window.setTimeout(()=>{r.toast.classList.add("hidden")},2600)}export{Yt as initLegacyApp};
