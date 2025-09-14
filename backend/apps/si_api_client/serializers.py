from rest_framework import serializers
from ..questionnaire.models import Questionnaire, Quote
from ..questionnaire.serializers import QuestionnaireIdSerializer
from ..quotes.serializers import CommentLabelSerializer
from ..questionnaire.models import GivenAnswer



class FetchQuestionnairesSerializer(serializers.ModelSerializer):
    """
    Serializer for fetching questionnaires.
    """
    quote = serializers.IntegerField(required=True, help_text="ID of the demand to fetch questionnaires for.")
    
    class Meta:
        model = Questionnaire
        fields = ['opName', 'potential', 'reference_id_SI', 'quote' ]  # Specify the fields you want to include

    def validate_demandeId(self, value):
        """
        Validate that the demandeId is a positive integer.
        """
        if value <= 0:
            raise serializers.ValidationError("demandeId must be a positive integer.")
        return value
    
class FetchQuoteserlializer(serializers.ModelSerializer):
    comments = CommentLabelSerializer(many=False, required=False)
    order_id = serializers.CharField(required=False, allow_blank=True)
    reference = serializers.CharField(required=False, allow_blank=True)
    firstname = serializers.CharField(required=False, allow_blank=True)
    lastname = serializers.CharField(required=False, allow_blank=True)
   # questionnaire = FetchQuestionnairesSerializer(required=False, allow_null=True)
    
    
    class Meta:
        model = Quote
        fields = '__all__'  # Specify the fields you want to include
        read_only_fields = ('id', 'status', 'firstname', 'lastname')
        
    
     
class FetchGivenAnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for fetching given answers.
    """
    answer = serializers.IntegerField(required=True, help_text="ID of the answer.")

    class Meta:
        model = GivenAnswer
        fields = '__all__'  # Specify the fields you want to include
        
   
