from django.urls import path
from .views import UserDetail, ChangePasswordView, UserCreateView, QuestionnaireList, QuestionnaireDetail

urlpatterns = [
    path('me/', UserDetail.as_view(), name='user_detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/', UserCreateView.as_view(), name='user_create'),
    path('list/', QuestionnaireList.as_view(), name='questionnaire-list'),
    path('details/', QuestionnaireDetail.as_view(), name='questionnaire-detail'),
]
