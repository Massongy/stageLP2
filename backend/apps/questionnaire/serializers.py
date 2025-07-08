from rest_framework import serializers
from .models import Question, Reponse, Questionnaire, GivenAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'  # Includes all model fields (only 'label' in this case)

class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = '__all__'  # Specify the fields you want to include
  
  
  
  
class QuestionLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'label']  # or whatever your label field is called

class ReponseLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = ['id', 'value']  # or the appropriate field


class GivenAnswersInputSerializer(serializers.ModelSerializer):    
    class Meta:
        model = GivenAnswer
        fields = ['answer', 'questionnaire']  # just the IDs    
        
class GivenAnswerSerializer(serializers.ModelSerializer):
    question = QuestionLabelSerializer(read_only=True)
    answer = ReponseLabelSerializer(read_only=True)

    class Meta:
        model = GivenAnswer  # Use the through model for the ManyToMany relationship
        fields = ['question', 'answer', 'questionnaire']  # Specify the fields you want to include
        
class QuestionnaireSerializer(serializers.ModelSerializer):

    given_answers = GivenAnswerSerializer(many=True, read_only=True)  # Use related_name here
    class Meta:
        model = Questionnaire
        fields = '__all__'
        
