from rest_framework import viewsets, permissions, status
from .models import Question, Reponse, Questionnaire, GivenAnswer
from .serializers import QuestionSerializer, ReponseSerializer, QuestionnaireSerializer, GivenAnswerSerializer, GivenAnswersInputSerializer, QuestionnaireInputSerializer
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import Http404
from rest_framework.decorators import action


class QuestionnaireViewSet(viewsets.GenericViewSet):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
             return QuestionnaireSerializer
        elif self.request.method == 'PUT':
            return QuestionnaireInputSerializer
        return super().get_serializer_class()
  
  
    @swagger_auto_schema(
        method='get',
        responses={200: QuestionnaireSerializer, 404: 'Not Found'},
        operation_description="Retrieve a questionnaire by quote_id"
    )
    @swagger_auto_schema(
        method='put',
        request_body=QuestionnaireInputSerializer,
        responses={200: QuestionnaireInputSerializer, 400: 'Validation Error', 404: 'Not Found'},
        operation_description="Update a questionnaire by quote_id"
    )
    @action(detail=False, methods=['get', 'put'], url_path='(?P<quote_id>[^/.]+)')
    def get_by_quote(self, request, quote_id=None):
        try:
            questionnaire = Questionnaire.objects.get(quote__id=quote_id)
        except Questionnaire.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            print(f"Retrieving questionnaire for quote_id: {quote_id}")
            serializer = self.get_serializer(questionnaire)
            return Response(serializer.data)

        elif request.method == 'PUT':
            print(f"Updating questionnaire for quote_id: {quote_id}")
            serializer = self.get_serializer(questionnaire, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class QuestionViewSet(viewsets.GenericViewSet,  viewsets.mixins.ListModelMixin):
    
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return GivenAnswersInputSerializer
        return GivenAnswerSerializer

    def get_tags(self):
        return ["questions - reponses"]
    
    def get_view_name(self):
        return "questions - reponses"
    
    def get_queryset(self):
        queryset = super().get_queryset()
        id_param = self.request.query_params.get('questionnaire_id')
        if id_param:
            return queryset.filter(questionnaire_id=id_param)
        return queryset
    
    #TODO : Add routing URL to find by ID
    @swagger_auto_schema(
        tags=["questions - reponses"],
        manual_parameters=[
            openapi.Parameter(
                'questionnaire_id', openapi.IN_QUERY,
                description="Filter by Questionnaire ID",
                type=openapi.TYPE_INTEGER
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["questions - reponses"],
        operation_description="Custom bulk create method for GivenAnswer.",
        request_body=openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                'answer': openapi.Schema(type=openapi.TYPE_INTEGER, description='Answer ID'),
                'questionnaire': openapi.Schema(type=openapi.TYPE_INTEGER, description='Questionnaire ID'),
            }),
            description="List of answers for a questionnaire"
        ),
        responses={201: "Created", 400: "Bad Request"}
    )
    def create(self, request, *args, **kwargs):
        """
        Custom create method for GivenAnswer.
        """
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
            
        results = []
        for data in serializer.validated_data: 
            questionnaire = data['questionnaire']
            reponse = data['answer']
            question = reponse.question

            existing = GivenAnswer.objects.filter(questionnaire=questionnaire, question=question).first()
            if existing : 
                existing.answer = reponse
                existing.question = question
                existing.save()
                results.append(existing)
               
            else : 
                new = GivenAnswer.objects.create(answer=reponse,questionnaire=questionnaire,question=question)
                results.append(new)
           
        res_serializer = self.get_serializer(results, many=True)
        return Response(res_serializer.data, status=status.HTTP_201_CREATED)
  
  