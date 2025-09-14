from django.contrib import admin
from django.urls import path, re_path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Vue pour la racine de l'API
def api_root(request):
    return JsonResponse({
        "message": "🎉 Qualilead API is running!",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "admin": "/admin/",
            "api_login": "/api/login/",
            "api_token": "/api/token/",
            "api_token_refresh": "/api/token/refresh/",
            "users": "/api/users/",
            "quotes": "/api/quotes/",
            "questionnaire": "/api/questionnaire/",
            "external_api": "/api/external-api/",
            "swagger_ui": "/swagger/",
            "redoc": "/redoc/"
        },
        "documentation": {
            "swagger": "/swagger/",
            "redoc": "/redoc/"
        }
    })

schema_view = get_schema_view(
    openapi.Info(
        title="Qualilead API",
        default_version='v1',
        description="Documentation interactive de l'API",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    # url='https://qualilead.options.net', // A supprimer en dev sur localhost
)

urlpatterns = [
    # Route racine - AJOUT IMPORTANT
    path('', api_root, name='api_root'),
    
    # Routes existantes
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('apps.users.urls')),
    path('api/quotes/', include('apps.quotes.urls')),
    path('api/questionnaire/', include('apps.questionnaire.urls')),
    path('api/external-api/', include('apps.si_api_client.urls')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui()),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]