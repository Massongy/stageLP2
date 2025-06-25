from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserDetail, ChangePasswordView, GroupViewSet, UserViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('me/', UserDetail.as_view(), name='user_detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('', include(router.urls)),

]
