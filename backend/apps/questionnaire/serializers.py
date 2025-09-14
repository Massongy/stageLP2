from rest_framework import serializers
from .models import Question, Reponse, Questionnaire, GivenAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__' # Includes all model fields (only 'label' in this case)

class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = '__all__' # Specify the fields you want to include

class QuestionLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'label'] # or whatever your label field is called

class QuestionIdSerializerSIResponse(serializers.ModelSerializer):
    reference_id_SI = serializers.IntegerField(source='idKey', read_only=True) # Assuming reference_id_SI is the field you want to use
    
    class Meta:
        model = Question
        fields = ['id', 'reference_id_SI', ] # Only include the ID field

class ReponseLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = ['id', 'value'] # or the appropriate field

class GivenAnswersInputSerializer(serializers.ModelSerializer):
    question = serializers.SerializerMethodField(read_only=True)
    date_answer = serializers.DateField(required=False, allow_null=True, format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    
    class Meta:
        model = GivenAnswer
        fields = ['answer', 'questionnaire', 'question', 'date_answer']
        read_only_fields = ['question']
    
    def get_question(self, obj):
        print("get_Question serializer called")
        if obj.answer and obj.answer.question:
            # Fix: Convert Question object to string representation
            print(f"question exists: {obj.answer.question.label}")  # Using f-string
            # Alternative: print("question exists: " + str(obj.answer.question))
            return {
                'id': obj.answer.question.id,
                'label': obj.answer.question.label
            }
        return None

class QuestionnaireLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'quote', 'score']
        # Specify the fields you want to include

class QuestionnaireIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id'] # Only include the ID field

class GivenAnswerSerializer(serializers.ModelSerializer):
    question = QuestionLabelSerializer(read_only=True)
    answer = ReponseLabelSerializer(read_only=True)
    questionnaire = QuestionnaireLabelSerializer(read_only=True)
    
    class Meta:
        model = GivenAnswer # Use the through model for the ManyToMany relationship
        fields = ['question', 'answer', 'questionnaire'] # Specify the fields you want to include

class QuestionnaireSerializer(serializers.ModelSerializer):
    given_answers = GivenAnswerSerializer(many=True, read_only=True) # Use related_name here
    
    class Meta:
        model = Questionnaire
        fields = '__all__'

class QuestionnaireInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['score' , 'potential', 'opName']