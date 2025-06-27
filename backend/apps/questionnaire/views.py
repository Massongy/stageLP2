from rest_framework import viewsets
from .models import Question, Reponse, Questionnaire
from .serializers import QuestionSerializer, ReponseSerializer, QuestionnaireSerializer


class QuestionnaireViewSet(viewsets.ModelViewSet):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    # You might want to add permission_classes or other configurations here

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class ReponseViewSet(viewsets.ModelViewSet):
    queryset = Reponse.objects.all()  # Use the through model for the ManyToMany relationship
    serializer_class = ReponseSerializer

    def perform_create(self, serializer):
        # Automatically set the quote field if needed
        serializer.save(quote=self.request.user)  # Assuming the user is creating a response related to their quote