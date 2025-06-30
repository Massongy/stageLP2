from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins
from .models import Quote
from .serializers import QuoteSerializer


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