from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins, status
from .models import Quote, QuoteUserLog, QuoteLock
from .serializers import QuoteSerializer, QuoteUserLogSerializer, QuoteLockSerializer
from .signals import log_quote_action
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404

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
    
    
class QuoteLockViewSet( mixins.CreateModelMixin,
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin,
    viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = QuoteLock.objects.all()
    serializer_class = QuoteLockSerializer
    
    def get_tags(self):
        return ["Quote Lock"]

    def get_view_name(self):
        return "Quote Lock"
    
    def create(self, request):
        quote_id = request.data.get("quote_id")
        if not quote_id:
            return Response({"detail": "quote_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        #Quote introuvable
        try:
            quote = Quote.objects.get(id=quote_id)
        except Quote.DoesNotExist:
            return Response({"detail": "Quote not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
        try:
            lock = quote.lock  # OneToOneField
            if not lock.is_expired() and lock.user != request.user:
                print(f'Quote {quote_id} is currently locked')
                return Response(
                    {"detail": f"Quote is currently locked by {lock.user.username}."},
                    status=status.HTTP_423_LOCKED  # 423 Locked
                )
            print("Quote locked by current user")           
            lock.delete()  # Remove expired or user's old lock
        except QuoteLock.DoesNotExist:
            pass
        
        expire_at = timezone.now() + timedelta(minutes=5)
        lock = QuoteLock.objects.create(
            quote=quote,
            user=request.user,
            expire_at=expire_at
        )
        serializer = QuoteLockSerializer(lock)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def get(self, request, pk):
        quote = get_object_or_404(Quote, pk=pk)

        # Handle quote locking logic
        try:
            lock = quote.lock  # Access OneToOneField: quote -> QuoteLock
            if not lock.is_expired() and lock.user != request.user:
                return Response(
                    {"detail": f"Quote is currently locked by {lock.user.username}."},
                    status=status.HTTP_423_LOCKED  # HTTP 423: Locked
                )
            # If lock is expired or belongs to current user, delete it
            lock.delete()
        except QuoteLock.DoesNotExist:
            pass  # No lock exists yet — continue normally

        serializer = QuoteSerializer(quote)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        quote = get_object_or_404(Quote, pk=pk)

        quote.delete()
        return Response({"detail": "Quote deleted with success"}, status=status.HTTP_204_NO_CONTENT)