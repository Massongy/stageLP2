from rest_framework import permissions

class IsSuperUserOrCreator(permissions.BasePermission):
    """
    Autorise uniquement le superuser ou le créateur à accéder/éditer l'objet.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.created_by == request.user

class ViewCreatedUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm("can_view_created_users")
