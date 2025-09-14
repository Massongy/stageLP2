from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuoteViewSet, QuoteUserLogsViewSet, QuoteLockViewSet, QuoteLockDeleteView  # Assuming you have a QuoteViewSet defined in views.py


router = DefaultRouter()
router.register(r'quotes', QuoteViewSet)  # Assuming you have a QuoteViewSet defined in views.py
router.register(r'quote-logs', QuoteUserLogsViewSet)  # Registering the QuoteUserLogsViewSet
router.register(r'quote-lock', QuoteLockViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('quote-lock/<int:quote_id>/', QuoteLockDeleteView.as_view(), name='quote-lock-delete'),
]