from django.db import models


class Contract(models.Model):
    contact_name = models.CharField("联系人", max_length=50)
    phone = models.CharField("联系电话", max_length=20)
    club_position = models.CharField("社团职务", max_length=50)

    class Meta:
        db_table = "contract"
        verbose_name = "联系表单"
        verbose_name_plural = "联系表单"

    def __str__(self):
        return self.contact_name


class ForumPost(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_CHOICES = [
        (STATUS_PENDING, "待审核"),
        (STATUS_APPROVED, "已公开"),
        (STATUS_REJECTED, "已驳回"),
    ]

    title = models.CharField("标题", max_length=80)
    body = models.TextField("内容")
    author = models.CharField("作者", max_length=50)
    tag = models.CharField("标签", max_length=30, blank=True)
    attachments = models.JSONField("附件", default=list, blank=True)
    status = models.CharField("审核状态", max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField("创建时间", auto_now_add=True)
    approved_at = models.DateTimeField("公开时间", null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "论坛帖子"
        verbose_name_plural = "论坛帖子"

    def __str__(self):
        return self.title


class ForumComment(models.Model):
    post = models.ForeignKey(ForumPost, verbose_name="所属帖子", related_name="comments", on_delete=models.CASCADE)
    parent = models.ForeignKey("self", verbose_name="回复对象", related_name="replies", null=True, blank=True, on_delete=models.CASCADE)
    author = models.CharField("作者", max_length=50)
    body = models.TextField("内容")
    attachments = models.JSONField("附件", default=list, blank=True)
    created_at = models.DateTimeField("创建时间", auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "论坛留言"
        verbose_name_plural = "论坛留言"

    def __str__(self):
        return f"{self.author}: {self.body[:20]}"


class ClubActivity(models.Model):
    TYPE_BRIEFING = "briefing"
    TYPE_PREVIEW = "preview"
    TYPE_CHOICES = [
        (TYPE_BRIEFING, "活动简报"),
        (TYPE_PREVIEW, "活动预告"),
    ]
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_CHOICES = [
        (STATUS_PENDING, "待审核"),
        (STATUS_APPROVED, "已公开"),
        (STATUS_REJECTED, "已驳回"),
    ]

    type = models.CharField("类型", max_length=20, choices=TYPE_CHOICES)
    title = models.CharField("标题", max_length=80)
    date = models.DateField("活动日期")
    summary = models.TextField("摘要")
    author = models.CharField("提交人", max_length=50)
    attachments = models.JSONField("附件", default=list, blank=True)
    status = models.CharField("审核状态", max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField("创建时间", auto_now_add=True)
    approved_at = models.DateTimeField("公开时间", null=True, blank=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "活动档案"
        verbose_name_plural = "活动档案"

    def __str__(self):
        return self.title


class MailLetter(models.Model):
    VISIBILITY_PUBLIC = "public"
    VISIBILITY_PRIVATE = "private"
    VISIBILITY_CHOICES = [
        (VISIBILITY_PUBLIC, "公开"),
        (VISIBILITY_PRIVATE, "不公开"),
    ]

    subject = models.CharField("主题", max_length=80)
    body = models.TextField("内容")
    visibility = models.CharField("公开方式", max_length=20, choices=VISIBILITY_CHOICES, default=VISIBILITY_PUBLIC)
    author = models.CharField("作者", max_length=50)
    attachments = models.JSONField("附件", default=list, blank=True)
    reply = models.TextField("社团回复", blank=True)
    created_at = models.DateTimeField("创建时间", auto_now_add=True)
    replied_at = models.DateTimeField("回复时间", null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "社团信箱"
        verbose_name_plural = "社团信箱"

    def __str__(self):
        return self.subject
