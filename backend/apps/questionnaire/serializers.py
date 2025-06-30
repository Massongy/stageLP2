from rest_framework import serializers
from .models import Question, Reponse, Questionnaire

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'  # Includes all model fields (only 'label' in this case)

class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = '__all__'  # Specify the fields you want to include
  
  
class QuestionnaireSerializer(serializers.ModelSerializer):
    responses = ReponseSerializer(many=True, read_only=True)  # Use related_name here

    class Meta:
        model = Questionnaire
        fields = '__all__'