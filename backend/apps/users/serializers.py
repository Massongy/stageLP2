from rest_framework import serializers
from django.contrib.auth import password_validation
from django.contrib.auth.models import Permission, Group
from .models import User

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='name'
    )
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'groups', 'permissions')

    def get_permissions(self, user):
            # Permissions individuelles
            user_perms = set(user.user_permissions.values_list('codename', flat=True))
            # Permissions via groupes
            group_perms = set(
                Permission.objects.filter(group__user=user).values_list('codename', flat=True)
            )

            return sorted(user_perms.union(group_perms))

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value, self.context['request'].user)
        return value

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']