from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins
from .models import Quote, QuoteUserLog
from .serializers import QuoteSerializer, QuoteUserLogSerializer
from .signals import log_quote_action
from drf_yasg.utils import swagger_auto_schema


class QuoteViewSet(mixins.RetrieveModelMixin,  mixins.ListModelMixin,
                   mixins.UpdateModelMixin,
                   viewsets.GenericViewSet):

    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    
    def get_tags(self):
        return ["Quote"]
    
    
    def get_view_name(self):
        return "Quote"

    def perform_update(self, serializer):
        # Automatically set the user field if needed
        serializer.save(user=self.request.user)  # Assuming the user is creating a quote related to their profile
        log_quote_action(
            quote=serializer.instance,
            user=self.request.user,
            action='updated'
            , details=f"Quote {serializer.instance.id} updated by {self.request.user.first_name} {self.request.user.last_name}"
        )
    
    def retrieve(self, request, *args, **kwargs):
        isinstance = self.get_object()
        log_quote_action(quote=isinstance, user=self.request.user, action='retrieved', details=f"Quote {isinstance.id} retrieved by {self.request.user.first_name} {self.request.user.last_name}")
        return super().retrieve(request, *args, **kwargs) 
    
    def list(self, request, *args, **kwargs):
        log_quote_action(quote=None, user=self.request.user , action='retrieved', details=f"List of quotes retrieved by {self.request.user.first_name} {self.request.user.last_name}")
        return super().list(request, *args, **kwargs)
    


class QuoteUserLogsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Viewset for listing quote logs.
    """
    queryset = QuoteUserLog.objects.all()  # Adjust this to your logging model
    serializer_class = QuoteUserLogSerializer  # Use the appropriate serializer for your logs
    permission_classes = [permissions.IsAuthenticated]

    def get_tags(self):
        return ["Quote Logs"]

    def get_view_name(self):
        return "Quote Logs"
    
    @swagger_auto_schema(tags=["Quote Logs"])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)