from django.db import models
from django.conf import settings
from django.utils import timezone


# Create your models here.
class Status (models.Model):
    name = models.CharField(max_length=50)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.name



class Quote(models.Model):
    order_id = models.CharField(max_length=100)
    reference = models.CharField(max_length=100)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    customer_email = models.EmailField()
    status = models.ForeignKey(Status, on_delete=models.SET_NULL, null=True)
    weeknumber = models.IntegerField(null=True, blank=True)
    call_count = models.IntegerField(default=0)
    date_first_call = models.DateTimeField(null=True, blank=True)
    date_last_call = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    idEtablissement = models.CharField(max_length=5, blank=True, null=True)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    

    def __str__(self):
        return f"Quote #{self.id} - {self.reference}"


class Comment(models.Model):
    quote = models.OneToOneField(Quote, on_delete=models.CASCADE, related_name='comment', null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    

class QuoteUserLog(models.Model):
    ACTION_CHOICES = (
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('retrieved', 'Retrieved'),
        ('deleted', 'Deleted'),
        ('locked', 'Locked'), 
        ('unlocked', 'Unlocked')
    )

    quote = models.ForeignKey(Quote, on_delete=models.SET_NULL, null=True, related_name='user_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)
    
    


class QuoteLock (models.Model):
    quote = models.OneToOneField(Quote, on_delete=models.CASCADE, related_name='lock')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expire_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now) 

    class Meta:
        unique_together = ('quote', 'user')

    def is_expired(self):
        return timezone.now() > self.expire_at  

    def __str__(self):
        return f"Lock on Quote #{self.quote.id} by {self.user.email}"

