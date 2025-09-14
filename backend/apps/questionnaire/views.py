from rest_framework import viewsets, permissions, status
from .models import Question, Reponse, Questionnaire, GivenAnswer
from .serializers import QuestionSerializer, ReponseSerializer, QuestionnaireSerializer, GivenAnswerSerializer, GivenAnswersInputSerializer, QuestionnaireInputSerializer, QuestionIdSerializerSIResponse
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import Http404
from rest_framework.decorators import action
from ..si_api_client.request import ExternalAPIDataView
from ..si_api_client.serializers import FetchQuestionnairesSerializer
from .request import QuestionnaireExternalAPIRequest 
from .utils import map_api_to_questionnaire_dict
from ..quotes.models import Quote
import os

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
                'date_answer': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, description='Date of the answer (only for one question)', example='null')
            
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
            print(f"Validated data: {data}") 
            is_date_answer = False

            # Find the question with Date answer
            date_question = Question.objects.filter(is_date_input=True).first()

            reponse = data['answer']
            print(f"{reponse}")
            #reponse = Reponse.objects.filter(id=reponse_id).first()

            if date_question and date_question.id == reponse.question.id:
                is_date_answer = True


            questionnaire = data['questionnaire']

            if is_date_answer:
                date_prevue = data.get('date_answer', None)
                print(f"Date question found: {date_question}, date_prevue: {date_prevue}")
                if not date_prevue:
                    return Response({"detail": "Date answer is required for date input questions."}, status=status.HTTP_400_BAD_REQUEST)
                print("Date question found, updating date_answer")
                questionnaire.date_prevue = data.get('date_answer', None)
                questionnaire.save()
            else:
                print("Non-date question found, using existing logic")
                question = reponse.question
                existing = GivenAnswer.objects.filter(
                    questionnaire=questionnaire,
                    question=question
                ).first()

                if existing:
                    existing.answer = reponse
                    existing.question = question
                    existing.save()
                    results.append(existing)
                else:
                    new = GivenAnswer.objects.create(
                        answer=reponse,
                        questionnaire=questionnaire,
                        question=question
                    )
                    results.append(new)
        
        res_serializer = self.get_serializer(results, many=True)
        return Response(res_serializer.data, status=status.HTTP_201_CREATED)



class ExchangeWithBackendViewSet(viewsets.GenericViewSet):
    """
    Viewset for managing exchange with backend.
    """
    permission_classes = [permissions.AllowAny]  # Allow any user to access this viewset
    serializer_class = None

    @swagger_auto_schema(
        tags=["exchange with backend"],
        operation_description="Exchange data with the backend."
    )
    
    def get_queryset(self):

    
        """
        Custom method to query questions from the backend.
        """
        
        res = ExternalAPIDataView().get(self.request)
        print(f'Response obtained in view')
        return Response(data="Success", status=status.HTTP_200_OK)

      
    '''
    def list(self, request, *args, **kwargs):
        try : 
            res = ExternalAPIDataView().get(request)
            return Response({res}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    '''
    @action(detail=False, methods=["get"], url_path="fetch-token")
    def  getSIToken(self, request):
        """
        Custom action to fetch the token from the external API.
        """
        try:
            token = ExternalAPIDataView().getToken()
            if token:
                return Response({"token": token}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to fetch token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
    @action(detail=False, methods=["get"], url_path="get-questions")
    def get_questions(self, request):
        """
        Custom action to fetch questions from the external API.
        """
        try:
            res = QuestionnaireExternalAPIRequest(os.getenv('EXTERNAL_API_BASE_URL')).get_questions()
            print(f'Response obtained in view: {res}')
            return res  # This will return the Response object from ExternalAPIDataView
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    @action(detail=False, methods=["get"], url_path="get-answers")
    def get_answers(self, request):
        """
        Custom action to fetch questions from the external API.
        """
        try:
            res = QuestionnaireExternalAPIRequest(os.getenv('EXTERNAL_API_BASE_URL')).get_answers()
            print(f'Response obtained in view: {res}')
            return res  # This will return the Response object from ExternalAPIDataView
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    @action(detail=False, methods=["get"], url_path="get-questionnaire")
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'demandeId',
                openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='ID of the demand to fetch the questionnaire for',
                required=True
            )
        ],
        responses={200: openapi.Response(description="Questionnaire data"), 400: "Bad Request", 500: "Internal Server Error"}
    )
    def get_questionnaire(self, request):
        """
        Custom action to fetch questionnaires from the external API.
        Accepts 'demandeId' as a URL query parameter.
        """
        demandeId = request.query_params.get('demandeId')

        try:
            res = QuestionnaireExternalAPIRequest(os.getenv('EXTERNAL_API_BASE_URL')).fetch_questionnaires(demand_id=demandeId)
            print(f'Response obtained in view: {res}')
            if res.status_code == 404:
                return Response({"error": "No questionnaire found"}, status=status.HTTP_404_NOT_FOUND)
            if res.status_code != 200: 
                return Response({"error": "Failed to fetch questionnaires"}, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"Questionnaire fetched successfully: {res.data}")
            
            maped_data = map_api_to_questionnaire_dict(res.data)
            serializer = FetchQuestionnairesSerializer(data=maped_data)
            print (f"Serializer data: {serializer.initial_data}")
            if serializer.is_valid():
                print(f"Valid questionnaire data: {serializer.validated_data}")
                existing_quote = Quote.objects.filter(reference_id_SI=serializer.validated_data['quote']).first()
                if not existing_quote:
                    return Response({"error": "Quote not found for the given ID"}, status=status.HTTP_404_NOT_FOUND)
                
                serializer.validated_data['quote'] = existing_quote
                
                
                existing_questionnaire = Questionnaire.objects.filter(quote=existing_quote).first()
                if existing_questionnaire:
                    print(f"UpdatING existing questionnaire: {existing_questionnaire.id}")
                    serializer.update(existing_questionnaire, serializer.validated_data)
                else: 
                    print(f"Creating new questionnaire: {serializer.validated_data['reference_id_SI']}")
                    serializer.save()
            else:
                print("Invalid questionnaire data:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(res.data, status=200)  # This will return the Response object from QuestionnaireExternalAPIRequest
        except Exception as e:
            print(f"Error fetching questionnaires: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        