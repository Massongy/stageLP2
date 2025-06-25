from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Quote, Status, Comment, QuoteUserLog, Question, Reponse

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )
    filter_horizontal = ('groups', 'user_permissions',)

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'reference', 'firstname', 'lastname', 'phone', 'status', 'created_at')
    search_fields = ('reference', 'firstname', 'lastname', 'customer_email', 'phone')
    list_filter = ('status', 'lock', 'created_at')

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'user', 'created_at')
    search_fields = ('text',)

@admin.register(QuoteUserLog)
class QuoteUserLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'user', 'action', 'timestamp')
    search_fields = ('action',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'label')

@admin.register(Reponse)
class ReponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'question', 'value')