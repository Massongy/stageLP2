from django.db.models.signals import post_save, post_delete, post_init
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import QuoteUserLog  # your logging model
from django.utils.timezone import now


def log_quote_action(quote, user, action, details):
    """
    Helper function to log actions on quotes.
    """
    QuoteUserLog.objects.create(
        quote=quote,
        user=user,
        action=action,
        timestamp = now(),
        details=details
    )
    
