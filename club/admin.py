from django.contrib import admin

from .models import ClubActivity, Contract, ForumComment, ForumPost, MailLetter


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("contact_name", "phone", "club_position")
    search_fields = ("contact_name", "phone", "club_position")
    list_filter = ("club_position",)
    ordering = ("-id",)


class ForumCommentInline(admin.TabularInline):
    model = ForumComment
    extra = 0
    fields = ("author", "body", "parent", "created_at")
    readonly_fields = ("created_at",)


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "tag", "status", "created_at", "approved_at")
    list_filter = ("status", "tag")
    search_fields = ("title", "body", "author", "tag")
    readonly_fields = ("created_at", "approved_at")
    inlines = [ForumCommentInline]


@admin.register(ForumComment)
class ForumCommentAdmin(admin.ModelAdmin):
    list_display = ("post", "author", "body", "created_at")
    search_fields = ("post__title", "author", "body")
    readonly_fields = ("created_at",)


@admin.register(ClubActivity)
class ClubActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "date", "author", "status", "created_at", "approved_at")
    list_filter = ("type", "status", "date")
    search_fields = ("title", "summary", "author")
    readonly_fields = ("created_at", "approved_at")


@admin.register(MailLetter)
class MailLetterAdmin(admin.ModelAdmin):
    list_display = ("subject", "author", "visibility", "created_at", "replied_at")
    list_filter = ("visibility",)
    search_fields = ("subject", "body", "author", "reply")
    readonly_fields = ("created_at", "replied_at")
