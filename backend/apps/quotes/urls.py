from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuoteViewSet  # Assuming you have a QuoteViewSet defined in views.py


router = DefaultRouter()
router.register(r'quotes', QuoteViewSet)  # Assuming you have a QuoteViewSet defined in views.py

urlpatterns = [
    path('', include(router.urls)),
]