import json
from pathlib import Path

from django.utils import timezone
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ClubActivity, Contract, ForumComment, ForumPost, MailLetter


BASE_DIR = Path(__file__).resolve().parent.parent


def serialize_contract(contract):
    return {
        "id": contract.id,
        "contact_name": contract.contact_name,
        "phone": contract.phone,
        "club_position": contract.club_position,
    }


def iso_datetime(value):
    return value.isoformat() if value else ""


def serialize_comment(comment, children_by_parent):
    return {
        "id": str(comment.id),
        "author": comment.author,
        "body": comment.body,
        "createdAt": iso_datetime(comment.created_at),
        "attachments": comment.attachments or [],
        "replies": [serialize_comment(child, children_by_parent) for child in children_by_parent.get(comment.id, [])],
    }


def serialize_post(post, include_comments=True):
    comments = []
    if include_comments:
        all_comments = list(post.comments.all())
        children_by_parent = {}
        for comment in all_comments:
            children_by_parent.setdefault(comment.parent_id, []).append(comment)
        comments = [serialize_comment(comment, children_by_parent) for comment in children_by_parent.get(None, [])]

    return {
        "id": str(post.id),
        "title": post.title,
        "body": post.body,
        "author": post.author,
        "tag": post.tag,
        "createdAt": iso_datetime(post.created_at),
        "approvedAt": iso_datetime(post.approved_at),
        "attachments": post.attachments or [],
        "comments": comments,
    }


def serialize_activity(activity):
    return {
        "id": str(activity.id),
        "type": activity.type,
        "title": activity.title,
        "date": activity.date.isoformat(),
        "summary": activity.summary,
        "author": activity.author,
        "createdAt": iso_datetime(activity.created_at),
        "approvedAt": iso_datetime(activity.approved_at),
        "attachments": activity.attachments or [],
    }


def serialize_letter(letter):
    return {
        "id": str(letter.id),
        "subject": letter.subject,
        "body": letter.body,
        "visibility": letter.visibility,
        "author": letter.author,
        "createdAt": iso_datetime(letter.created_at),
        "reply": letter.reply,
        "repliedAt": iso_datetime(letter.replied_at),
        "attachments": letter.attachments or [],
    }


def get_payload_value(payload, *keys):
    for key in keys:
        value = payload.get(key)
        if value is not None:
            return str(value).strip()
    return ""


def get_json_payload(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}"), None
    except json.JSONDecodeError:
        return None, JsonResponse({"error": "请求体必须是合法 JSON"}, status=400)


def json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def require_admin_payload(payload):
    if payload.get("admin_key") != "HUAYU-ADMIN-2026":
        return json_error("管理员密钥不正确", status=403)
    return None


@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def contract_collection(request):
    if request.method == "OPTIONS":
        return JsonResponse({"detail": "ok"})

    if request.method == "GET":
        contracts = Contract.objects.order_by("-id")
        return JsonResponse({"results": [serialize_contract(contract) for contract in contracts]})

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "请求体必须是合法 JSON"}, status=400)

    contact_name = get_payload_value(payload, "contact_name", "contactName", "联系人")
    phone = get_payload_value(payload, "phone", "联系电话")
    club_position = get_payload_value(payload, "club_position", "clubPosition", "社团职务")

    errors = {}
    if not contact_name:
        errors["contact_name"] = "联系人不能为空"
    if not phone:
        errors["phone"] = "联系电话不能为空"
    if not club_position:
        errors["club_position"] = "社团职务不能为空"
    if len(contact_name) > 50:
        errors["contact_name"] = "联系人不能超过 50 个字符"
    if len(phone) > 20:
        errors["phone"] = "联系电话不能超过 20 个字符"
    if len(club_position) > 50:
        errors["club_position"] = "社团职务不能超过 50 个字符"

    if errors:
        return JsonResponse({"errors": errors}, status=400)

    contract = Contract.objects.create(
        contact_name=contact_name,
        phone=phone,
        club_position=club_position,
    )
    return JsonResponse({"result": serialize_contract(contract)}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def site_state(request):
    approved_posts = ForumPost.objects.filter(status=ForumPost.STATUS_APPROVED).prefetch_related("comments")
    pending_posts = ForumPost.objects.filter(status=ForumPost.STATUS_PENDING)
    approved_activities = ClubActivity.objects.filter(status=ClubActivity.STATUS_APPROVED)
    pending_activities = ClubActivity.objects.filter(status=ClubActivity.STATUS_PENDING)
    letters = MailLetter.objects.all()
    return JsonResponse(
        {
            "posts": [serialize_post(post) for post in approved_posts],
            "pendingPosts": [serialize_post(post, include_comments=False) for post in pending_posts],
            "activities": [serialize_activity(activity) for activity in approved_activities],
            "pendingActivities": [serialize_activity(activity) for activity in pending_activities],
            "letters": [serialize_letter(letter) for letter in letters],
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def forum_posts(request):
    payload, error = get_json_payload(request)
    if error:
        return error
    title = get_payload_value(payload, "title")
    body = get_payload_value(payload, "body")
    author = get_payload_value(payload, "author") or "匿名社员"
    tag = get_payload_value(payload, "tag")
    if not title or not body:
        return json_error("标题和内容不能为空")
    post = ForumPost.objects.create(
        title=title,
        body=body,
        author=author,
        tag=tag,
        attachments=payload.get("attachments") or [],
        status=ForumPost.STATUS_PENDING,
    )
    return JsonResponse({"result": serialize_post(post, include_comments=False)}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def forum_comments(request):
    payload, error = get_json_payload(request)
    if error:
        return error
    post_id = get_payload_value(payload, "post_id", "postId")
    body = get_payload_value(payload, "body")
    author = get_payload_value(payload, "author") or "匿名社员"
    parent_id = get_payload_value(payload, "parent_id", "parentId")
    if not post_id or not body:
        return json_error("帖子和留言内容不能为空")
    try:
        post = ForumPost.objects.get(id=post_id, status=ForumPost.STATUS_APPROVED)
    except ForumPost.DoesNotExist:
        return json_error("帖子不存在或尚未公开", status=404)
    parent = None
    if parent_id:
        try:
            parent = ForumComment.objects.get(id=parent_id, post=post)
        except ForumComment.DoesNotExist:
            return json_error("回复对象不存在", status=404)
    comment = ForumComment.objects.create(
        post=post,
        parent=parent,
        author=author,
        body=body,
        attachments=payload.get("attachments") or [],
    )
    return JsonResponse({"result": serialize_comment(comment, {})}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def activities(request):
    payload, error = get_json_payload(request)
    if error:
        return error
    activity_type = get_payload_value(payload, "type")
    title = get_payload_value(payload, "title")
    date = get_payload_value(payload, "date")
    summary = get_payload_value(payload, "summary")
    author = get_payload_value(payload, "author") or "匿名社员"
    if activity_type not in {ClubActivity.TYPE_BRIEFING, ClubActivity.TYPE_PREVIEW}:
        return json_error("活动类型不正确")
    if not title or not date or not summary:
        return json_error("标题、日期和摘要不能为空")
    activity = ClubActivity.objects.create(
        type=activity_type,
        title=title,
        date=date,
        summary=summary,
        author=author,
        attachments=payload.get("attachments") or [],
        status=ClubActivity.STATUS_PENDING,
    )
    activity.refresh_from_db()
    return JsonResponse({"result": serialize_activity(activity)}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def letters(request):
    payload, error = get_json_payload(request)
    if error:
        return error
    subject = get_payload_value(payload, "subject")
    body = get_payload_value(payload, "body")
    visibility = get_payload_value(payload, "visibility") or MailLetter.VISIBILITY_PUBLIC
    author = get_payload_value(payload, "author") or "匿名同学"
    if visibility not in {MailLetter.VISIBILITY_PUBLIC, MailLetter.VISIBILITY_PRIVATE}:
        return json_error("公开方式不正确")
    if not subject or not body:
        return json_error("主题和内容不能为空")
    letter = MailLetter.objects.create(
        subject=subject,
        body=body,
        visibility=visibility,
        author=author,
        attachments=payload.get("attachments") or [],
    )
    return JsonResponse({"result": serialize_letter(letter)}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def approve_post(request, post_id):
    payload, error = get_json_payload(request)
    if error:
        return error
    key_error = require_admin_payload(payload)
    if key_error:
        return key_error
    try:
        post = ForumPost.objects.get(id=post_id)
    except ForumPost.DoesNotExist:
        return json_error("帖子不存在", status=404)
    post.status = ForumPost.STATUS_APPROVED
    post.approved_at = timezone.now()
    post.save(update_fields=["status", "approved_at"])
    return JsonResponse({"result": serialize_post(post)})


@csrf_exempt
@require_http_methods(["POST"])
def approve_activity(request, activity_id):
    payload, error = get_json_payload(request)
    if error:
        return error
    key_error = require_admin_payload(payload)
    if key_error:
        return key_error
    try:
        activity = ClubActivity.objects.get(id=activity_id)
    except ClubActivity.DoesNotExist:
        return json_error("活动不存在", status=404)
    activity.status = ClubActivity.STATUS_APPROVED
    activity.approved_at = timezone.now()
    activity.save(update_fields=["status", "approved_at"])
    return JsonResponse({"result": serialize_activity(activity)})


@csrf_exempt
@require_http_methods(["POST"])
def reject_item(request, item_type, item_id):
    payload, error = get_json_payload(request)
    if error:
        return error
    key_error = require_admin_payload(payload)
    if key_error:
        return key_error
    model_map = {"post": ForumPost, "activity": ClubActivity}
    model = model_map.get(item_type)
    if not model:
        return json_error("内容类型不正确")
    try:
        item = model.objects.get(id=item_id)
    except model.DoesNotExist:
        return json_error("内容不存在", status=404)
    item.status = model.STATUS_REJECTED
    item.save(update_fields=["status"])
    return JsonResponse({"detail": "ok"})


@csrf_exempt
@require_http_methods(["POST"])
def reply_letter(request, letter_id):
    payload, error = get_json_payload(request)
    if error:
        return error
    key_error = require_admin_payload(payload)
    if key_error:
        return key_error
    reply = get_payload_value(payload, "reply")
    if not reply:
        return json_error("回复不能为空")
    try:
        letter = MailLetter.objects.get(id=letter_id)
    except MailLetter.DoesNotExist:
        return json_error("信件不存在", status=404)
    letter.reply = reply
    letter.replied_at = timezone.now()
    letter.save(update_fields=["reply", "replied_at"])
    return JsonResponse({"result": serialize_letter(letter)})


def robots_txt(request):
    sitemap_url = request.build_absolute_uri("/sitemap.xml")
    body = f"User-agent: *\nAllow: /\nSitemap: {sitemap_url}\n"
    return HttpResponse(body, content_type="text/plain; charset=utf-8")


def sitemap_xml(request):
    base_url = request.build_absolute_uri("/").rstrip("/")
    urls = [
        ("", "1.0"),
        ("/forum/", "0.9"),
        ("/activities/", "0.9"),
        ("/mailbox/", "0.8"),
    ]
    body = ['<?xml version="1.0" encoding="UTF-8"?>']
    body.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for path, priority in urls:
        body.append("  <url>")
        body.append(f"    <loc>{base_url}{path}</loc>")
        body.append(f"    <priority>{priority}</priority>")
        body.append("  </url>")
    body.append("</urlset>")
    return HttpResponse("\n".join(body), content_type="application/xml; charset=utf-8")


def home(request):
    index_path = BASE_DIR / "frontend" / "dist" / "index.html"
    if not index_path.exists():
        return render(request, "index.html")
    return FileResponse(index_path.open("rb"))


def root_file(request, filename):
    allowed_files = {"styles.css", "app.js", "华煜话剧社.html"}
    if filename not in allowed_files:
        raise Http404("File not found")

    file_path = BASE_DIR / filename
    if not file_path.exists():
        raise Http404("File not found")
    return FileResponse(file_path.open("rb"))


def asset_file(request, path):
    asset_roots = [
        (BASE_DIR / "frontend" / "dist" / "assets").resolve(),
        (BASE_DIR / "assets").resolve(),
    ]

    for assets_dir in asset_roots:
        file_path = (assets_dir / path).resolve()
        if assets_dir in file_path.parents and file_path.exists():
            return FileResponse(file_path.open("rb"))

    raise Http404("Asset not found")
