from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Quote, QuoteUserLog, QuoteLock
from .serializers import QuoteSerializer, QuoteUserLogSerializer, QuoteLockSerializer
from .signals import log_quote_action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from .request import QuotesExternalAPIRequest 
from rest_framework.decorators import action
from .utils import map_api_to_quote_dict
import os
from ..si_api_client.serializers import FetchQuoteserlializer, FetchQuestionnairesSerializer, FetchGivenAnswerSerializer
from ..questionnaire.models import Questionnaire, Question, Reponse, GivenAnswer
from ..questionnaire.utils import map_api_to_questionnaire_dict
from ..questionnaire.utils import map_api_to_given_answer_dict


class QuoteViewSet(mixins.RetrieveModelMixin,  mixins.ListModelMixin,
                   mixins.UpdateModelMixin,
                   viewsets.GenericViewSet):

    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    
    def get_tags(self):
        return ["Quote"]
    
    
    def get_view_name(self):
        return "Quote"

    def perform_update(self, serializer):
        # Automatically set the user field if needed
        serializer.save(user=self.request.user)  # Assuming the user is creating a quote related to their profile
        log_quote_action(
            quote=serializer.instance,
            user=self.request.user,
            action='updated'
            , details=f"Quote {serializer.instance.id} updated by {self.request.user.first_name} {self.request.user.last_name}"
        )
    
    def retrieve(self, request, *args, **kwargs):
        isinstance = self.get_object()
        log_quote_action(quote=isinstance, user=self.request.user, action='retrieved', details=f"Quote {isinstance.id} retrieved by {self.request.user.first_name} {self.request.user.last_name}")
        return super().retrieve(request, *args, **kwargs) 
    
    def list(self, request, *args, **kwargs):
        log_quote_action(quote=None, user=self.request.user , action='retrieved', details=f"List of quotes retrieved by {self.request.user.first_name} {self.request.user.last_name}")
        return super().list(request, *args, **kwargs)
    


class QuoteUserLogsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Viewset for listing quote logs.
    """
    queryset = QuoteUserLog.objects.all()  # Adjust this to your logging model
    serializer_class = QuoteUserLogSerializer  # Use the appropriate serializer for your logs
    permission_classes = [permissions.IsAuthenticated]

    def get_tags(self):
        return ["Quote Logs"]

    def get_view_name(self):
        return "Quote Logs"
    
    @swagger_auto_schema(tags=["Quote Logs"])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    
class QuoteLockViewSet( mixins.CreateModelMixin, mixins.ListModelMixin,
    viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = QuoteLock.objects.all()
    serializer_class = QuoteLockSerializer
    
    def get_tags(self):
        return ["Quote Lock"]

    def get_view_name(self):
        return "Quote Lock"
    
    
    
    def list(self, request, *args, **kwargs):
        """
        List all locks for quotes.
        """
        
        return super().list(request, *args, **kwargs)

    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['quote_id'],
            properties={
                'quote_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID of the quote'),
            },
        ),
        responses={201: QuoteLockSerializer}
    )
    
    def create(self, request):
        quote_id = request.data.get("quote_id")
        if not quote_id:
            return Response({"detail": "quote_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        #Quote introuvable
        try:
            quote = Quote.objects.get(id=quote_id)
        except Quote.DoesNotExist:
            return Response({"detail": "Quote not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
        try:
            lock = quote.lock  # OneToOneField
            if not lock.is_expired() and lock.user != request.user:
                print(f'Quote {quote_id} is currently locked')
                return Response(
                    {"detail": f"Quote is currently locked by {lock.user.email}."},
                    status=status.HTTP_423_LOCKED  # 423 Locked
                )
            print("Quote locked by current user")      
            lock.delete()  # Remove expired or user's old lock
            log_quote_action(
                quote=quote,
                user=self.request.user,
                action='unlocked', 
                details=f"Lock on quote {quote_id} expired"
            )
        except QuoteLock.DoesNotExist:
            pass
        
        expire_at = timezone.now() + timedelta(minutes=5)
        lock = QuoteLock.objects.create(
            quote=quote,
            user=request.user,
            expire_at=expire_at
        )
        serializer = QuoteLockSerializer(lock)
        
        log_quote_action(
            quote=quote,
            user=self.request.user,
            action='locked'
            , details=f"Quote {serializer.instance.id} locked by {self.request.user.email} until {expire_at}"
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
       
class QuoteLockDeleteView(APIView):
        
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                name='quote_id',
                in_=openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description='Quote ID',
                required=True,
            )
        ],
        responses={204: openapi.Response(description="No lock remains for this quote.")}
    )
    def delete(self, request, quote_id):
        
        
        print(f'Quote ID : {quote_id}')
        quote = get_object_or_404(Quote, pk=quote_id)
        
      
        try:
            if quote.lock:
                    print(f'Quote locked by : {quote.lock.user}' )
                    if self.request.user != quote.lock.user: 
                        raise PermissionDenied("You are not authorized to modify this lock.")
                    quote.lock.delete()    
                    log_quote_action(
                        quote=quote,
                        user=self.request.user,
                        action='unlocked', 
                        details=f"Quote {quote.id} unlocked by {self.request.user.email} at {timezone.now()}"
                    )              
        except QuoteLock.DoesNotExist:
            print(f'No Quote lock for Quote {quote_id}')
            pass

        return Response({"detail": "No lock remains for this quote."}, status=status.HTTP_204_NO_CONTENT)
    
class ExternalAPIQuotesView(viewsets.GenericViewSet):
    """
    View to handle external API requests for quotes.
    """
    permission_classes = [permissions.AllowAny]  # Allow any user to access this viewset
    serializer_class = None
    queryset = None  # No queryset needed for this viewset

    def get_tags(self):
        return ["eXternal API Quotes"]

    def get_view_name(self):
        return "eXternal API Quotes"
    

    @swagger_auto_schema(
        tags=["external-api"],
        operation_description="Exchange data with the backend."
    )
    
    
    @action(detail=False, methods=["get"], url_path="fetch-external-quotes", url_name="fetch_external_quotes")
    def fetch_external_quotes(self, request):
        instance = QuotesExternalAPIRequest(os.getenv('EXTERNAL_API_BASE_URL'))
        res = instance.fetch_quotes()
        
        if res.status_code == 404:
            return Response({"error": "No quotes found."}, status=status.HTTP_404_NOT_FOUND) 
        
        if res.status_code != 200:
            return Response({"error": "Failed to fetch quotes from external API."}, status=status.HTTP_502_BAD_GATEWAY)
        
        saved_quotes = []
        print(f"Fetched {len(res.data)} quotes from external API.")
        for item in res.data:
            #print("Full response item:", item)
                       
            mapped_data = map_api_to_quote_dict(item)
          
            serializer = FetchQuoteserlializer(data=mapped_data)
         
            if serializer.is_valid():
               
                #Check if the quote already exists and update or create
                if Quote.objects.filter(reference_id_SI=serializer.validated_data['reference_id_SI']).exists():
                    quote = Quote.objects.get(reference_id_SI=serializer.validated_data['reference_id_SI'])
                    serializer.update(quote, serializer.validated_data)
                    print(f"Updated existing quote: {quote.id}")
                else:
                    serializer.save()
                    print(f"Created new quote: {serializer.validated_data['reference_id_SI']}") 
                
                saved_quotes.append(serializer.validated_data)
                
                if item['questionnaire']:
                    print("Questionnaire data found, processing...")
                    questionnaire_mapped_data = map_api_to_questionnaire_dict(item['questionnaire'])
                    serializer = FetchQuestionnairesSerializer(data=questionnaire_mapped_data)
                  
                    if serializer.is_valid():
                    
                        existing_quote = Quote.objects.filter(reference_id_SI=serializer.validated_data['quote']).first()
                        if not existing_quote:
                            return Response({"error": "Quote not found for the returned questionnaire"}, status=status.HTTP_404_NOT_FOUND)
                        serializer.validated_data['quote'] = existing_quote
                
                        existing_questionnaire = Questionnaire.objects.filter(quote=existing_quote).first()
                    
                        if existing_questionnaire:
                            print(f"UpdatING existing questionnaire from fetch-quotes: {existing_questionnaire.id}")
                            serializer.update(existing_questionnaire, serializer.validated_data)
                        else: 
                            print(f"Creating new questionnaire: {serializer.validated_data['reference_id_SI']}")
                            serializer.save()
                            
                
                    #TODO Update given answers on the questionnaire
                    for answer in item['questionnaire']['questionsReponsesList']:
                        
                        
                        if not answer['reponsePossibleId']:
                           
                            continue
                        
                        given_answer_mapped_data = map_api_to_given_answer_dict(answer)
                       
                        serializer = FetchGivenAnswerSerializer(data=given_answer_mapped_data)
                     
                        if serializer.is_valid():
                          
                            answer  = get_object_or_404(Reponse, reference_id_SI=given_answer_mapped_data['answer'])
                            question = get_object_or_404(Question, id=answer.question.id) 
                            
                            
                            questionnaire = get_object_or_404(Questionnaire, quote=existing_quote)
                            serializer.validated_data['question'] = question
                            serializer.validated_data['answer'] = answer
                            serializer.validated_data['questionnaire'] = questionnaire
                           
                           
                           
                            # Check if the answer already exists
                            if GivenAnswer.objects.filter(questionnaire=questionnaire, question=question).exists():
                                given_answer = GivenAnswer.objects.get(questionnaire=questionnaire, question=question)
                                serializer.update(given_answer, serializer.validated_data)
                                print(f"Updated existing given answer: {given_answer.id}")
                            else:
                                serializer.save()
                                print(f"Created new given answer for quote {existing_quote.id}: {serializer.validated_data['answer']}")
                        else : 
                            print("Invalid given answer:", serializer.errors)
                        
                               
            else:
                print("Invalid quote:", serializer.errors)
                # Optionally: collect errors and return them

        return Response(saved_quotes, status=status.HTTP_201_CREATED)