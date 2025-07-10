from django.urls import path
from .views import UserDetail, ChangePasswordView, UserCreateView, MyUsersView, UserDelete,  UserGroups

urlpatterns = [
    path('me/', UserDetail.as_view(), name='user_detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/', UserCreateView.as_view(), name='user_create'),
    path('my-users/', MyUsersView.as_view(), name='my_user_detail'),
    path('delete/<int:id>', UserDelete.as_view(), name='user-delete'),
    path('groups', UserGroups.as_view(), name='user-groups')
]
