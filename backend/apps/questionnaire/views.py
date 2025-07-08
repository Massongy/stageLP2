from rest_framework import viewsets
from .models import Question, Reponse, Questionnaire, GivenAnswer
from .serializers import QuestionSerializer, ReponseSerializer, QuestionnaireSerializer, GivenAnswerSerializer, GivenAnswersInputSerializer
from rest_framework.response import Response
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
    

class GivenAnswerViewSet(viewsets.GenericViewSet,  viewsets.mixins.ListModelMixin):
    """
    Viewset for managing given answers.
    """
    queryset = GivenAnswer.objects.all()  # Use the through model for the ManyToMany relationship
    serializer_class = GivenAnswerSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return GivenAnswersInputSerializer
        return GivenAnswerSerializer

    def get_tags(self):
        return ["questions - reponses"]
    
    def get_view_name(self):
        return "questions - reponses"

    @swagger_auto_schema(tags=["questions - reponses"])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        tags=["questions - reponses"],
        operation_description="Custom create method for GivenAnswer.",
        request_body=GivenAnswersInputSerializer,
        responses={201: GivenAnswerSerializer, 400: "Bad Request"}
    )
    def create(self, request, *args, **kwargs):
        """
        Custom create method for GivenAnswer.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        serializer.instance.question = Question.objects.get(id=request.data['answer']['question'])
        print(f"Id de la question : {serializer.instance.question.id}")
        self.perform_create(serializer)
        res_serializer = GivenAnswerSerializer(serializer.instance)
        return Response("Ajouté avec succés", status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        serializer.save()
  