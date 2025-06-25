from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        if not extra_fields.get("first_name") or not extra_fields.get("last_name"):
            raise ValueError("Superuser must have first_name and last_name")
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

    def __str__(self):
        return self.email

class Status(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Quote(models.Model):
    order_id = models.CharField(max_length=100)
    customer_email = models.EmailField()
    reference = models.CharField(max_length=100)
    status = models.ForeignKey(Status, on_delete=models.SET_NULL, null=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    nbr_call = models.IntegerField(default=0)
    date_first_call = models.DateTimeField(null=True, blank=True)
    date_last_call = models.DateTimeField(null=True, blank=True)
    lock = models.BooleanField(default=False)
    score = models.IntegerField(null=True, blank=True)
    potentiel = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quote #{self.id} - {self.reference}"

class Comment(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class QuoteUserLog(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='user_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    label = models.CharField(max_length=255)

    def __str__(self):
        return self.label

class Reponse(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='reponses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    value = models.TextField()
