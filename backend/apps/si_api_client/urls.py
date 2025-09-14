from rest_framework.routers import DefaultRouter
from ..quotes.views import ExternalAPIQuotesView
from ..questionnaire.views import ExchangeWithBackendViewSet

router = DefaultRouter()
router.register(r'api/external-api-quotes', ExternalAPIQuotesView, basename='external-api-quotes')
#router.register(r'api/external-api-questionnaire', ExternalAPIQuotesView, basename='external-api-questionnaire')
router.register(r'api/external-api-backend', ExchangeWithBackendViewSet, basename='external-api-global')
urlpatterns = router.urls
