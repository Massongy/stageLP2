from django.contrib import admin
from .models import Quote, Status, Comment, QuoteUserLog, QuoteLock

# Register your models here.

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'reference', 'firstname', 'lastname', 'phone', 'status', 'created_at')
    search_fields = ('reference', 'firstname', 'lastname', 'customer_email', 'phone')
    list_filter = ('status', 'created_at')

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
    
@admin.register(QuoteLock)
class QuoteLockAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'user', 'expireAt')
    search_fields = ('quote__reference', 'user__email')
    list_filter = ('expireAt',)