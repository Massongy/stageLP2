from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
       
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if extra_fields.get('is_superuser') is False:
            user.is_active = False
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser, PermissionsMixin):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_users'
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()
    
    class Meta:
        permissions = [
            ("can_create_acceor_user" , "Can create Acceor user"),
            ("can_create_acceor_admin", "Can create Acceor Admin"),
            ("can_create_options_user", "Can create Options user"), 
            ("can_create_options_admin", "Can create Options admin"), 
            ("can_delete_options_user", "Can delete Options User"), 
            ("can_delete_acceor_user", "Can delete Acceor user"),
            ("can_delete_options_admin", "Can delete Options admin"),
            ("can_delete_acceor_admin", "Can delete Acceor admin"), 
            ("can_view_created_users", "Can view created users"),
            ("can_change_user_data", "Can change user data"), 

        ]

    def __str__(self):
        return self.email



group_permission_map = {
    3: 'can_create_acceor_user',
    1: 'can_create_acceor_admin',
    4 : 'can_create_options_user',
    2: 'can_create_options_admin',
}