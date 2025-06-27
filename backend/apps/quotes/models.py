from django.db import models
from django.conf import settings


# Create your models here.
class Status(models.Model):
    name = models.CharField(max_length=50)

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
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
class Status (models.Model):
    name = models.CharField(max_length=50)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.name

class QuoteUserLog(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.SET_NULL, related_name='user_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    
class QuoteUserLog(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='user_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)


class QuoteLock (models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='locks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expireAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('quote', 'user')

    def __str__(self):
        return f"Lock on Quote #{self.quote.id} by {self.user.username}"

