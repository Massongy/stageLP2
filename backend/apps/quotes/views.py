from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Quote
from .serializers import QuoteSerializer


class QuoteViewSet(viewsets.ModelViewSet):

    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the user field if needed
        serializer.save(user=self.request.user)  # Assuming the user is creating a quote related to their profile