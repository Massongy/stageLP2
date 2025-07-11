from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Quote, QuoteUserLog, QuoteLock
from .serializers import QuoteSerializer, QuoteUserLogSerializer, QuoteLockSerializer
from .signals import log_quote_action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
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
    viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = QuoteLock.objects.all()
    serializer_class = QuoteLockSerializer
    
    def get_tags(self):
        return ["Quote Lock"]

    def get_view_name(self):
        return "Quote Lock"
    
    
    
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['quote_id'],
            properties={
                'quote_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID of the quote'),
            },
        ),
        responses={201: QuoteLockSerializer}
    )
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
                    {"detail": f"Quote is currently locked by {lock.user.email}."},
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
       
class QuoteLockDeleteView(APIView):
        
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='quote_id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='Quote ID',
                required=True,
            )
        ],
        responses={204: openapi.Response(description="No lock remains for this quote.")}
    )
    def delete(self, request, quote_id):
        
        
        print(f'Quote ID : {quote_id}')
        quote = get_object_or_404(Quote, pk=quote_id)
        
      
        try:
            if quote.lock:
                    print(f'Quote locked by : {quote.lock.user}' )
                    if self.request.user != quote.lock.user: 
                        raise PermissionDenied("You are not authorized to modify this lock.")
                    quote.lock.delete()                  
        except QuoteLock.DoesNotExist:
            print(f'No Quote lock for Quote {quote_id}')
            pass

        return Response({"detail": "No lock remains for this quote."}, status=status.HTTP_204_NO_CONTENT)