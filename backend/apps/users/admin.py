from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.contrib.auth.models import Group

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'created_by')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('created_by',)
    fieldsets = (
        ('identifiants', {'fields': ('email', 'password', 'created_by' )}),
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


class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)