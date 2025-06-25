from rest_framework import permissions

class IsSuperUserOrCreator(permissions.BasePermission):
    """
    Autorise uniquement le superuser ou le créateur à accéder/éditer l'objet.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.created_by == request.user
