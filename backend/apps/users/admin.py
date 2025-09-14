from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as DefaultGroupAdmin
from .models import User
from django.contrib.auth.models import Group, Permission
from django import forms

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


class CustomGroupAdminForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.all(),
        widget=admin.widgets.FilteredSelectMultiple('permissions', is_stacked=False),
        required=False
    )


class GroupAdmin(DefaultGroupAdmin):
    form = CustomGroupAdminForm
    list_display = ('id', 'name')

admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)