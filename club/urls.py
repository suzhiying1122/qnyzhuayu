from django.urls import path, re_path

from . import views

app_name = "club"

urlpatterns = [
    path("", views.home, name="home"),
    path("robots.txt", views.robots_txt, name="robots-txt"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap-xml"),
    path("api/site-state/", views.site_state, name="site-state"),
    path("api/contracts/", views.contract_collection, name="contract-collection"),
    path("api/forum/posts/", views.forum_posts, name="forum-posts"),
    path("api/forum/comments/", views.forum_comments, name="forum-comments"),
    path("api/activities/", views.activities, name="activities"),
    path("api/letters/", views.letters, name="letters"),
    path("api/admin/posts/<int:post_id>/approve/", views.approve_post, name="approve-post"),
    path("api/admin/activities/<int:activity_id>/approve/", views.approve_activity, name="approve-activity"),
    path("api/admin/<str:item_type>/<int:item_id>/reject/", views.reject_item, name="reject-item"),
    path("api/admin/letters/<int:letter_id>/reply/", views.reply_letter, name="reply-letter"),
    path("assets/<path:path>", views.asset_file, name="asset-file"),
    re_path(r"^(?:forum|activities|mailbox|profile|admin-panel)(?:/.*)?$", views.home, name="vue-page"),
    path("<str:filename>", views.root_file, name="root-file"),
]
