from rest_framework import viewsets
from .models import Question, Reponse, Questionnaire
from .serializers import QuestionSerializer, ReponseSerializer, QuestionnaireSerializer
from drf_yasg.utils import swagger_auto_schema


class QuestionnaireViewSet(viewsets.GenericViewSet, viewsets.mixins.RetrieveModelMixin, viewsets.mixins.UpdateModelMixin):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    # You might want to add permission_classes or other configurations here


class QuestionViewSet(viewsets.GenericViewSet,  viewsets.mixins.ListModelMixin):
    
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    def get_tags(self):
        return ["questions - reponses"]
    
    def get_view_name(self):
        return "questions - reponses"

    @swagger_auto_schema(tags=["questions - reponses"])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    

    
    
    

class ReponseViewSet(viewsets.GenericViewSet,  viewsets.mixins.ListModelMixin):
    queryset = Reponse.objects.all()  # Use the through model for the ManyToMany relationship
    serializer_class = ReponseSerializer
    def get_tags(self):
        return ["questions - reponses"]
    
    def get_view_name(self):
        return "questions - reponses"

    @swagger_auto_schema(tags=["questions - reponses"])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
