from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, ReponseViewSet, QuestionnaireViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'reponses', ReponseViewSet)  # Assuming you want to use the same viewset for responses
router.register(r'questionnaires', QuestionnaireViewSet)  # Registering the Questionnaire viewset


urlpatterns = [
    path('', include(router.urls)),
]