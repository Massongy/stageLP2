from rest_framework import serializers
from ..questionnaire.models import Questionnaire

class FetchQuestionnairesSerializer(serializers.Serializer):
    """
    Serializer for fetching questionnaires.
    """
    demandeId = serializers.IntegerField(required=True, help_text="ID of the demand to fetch questionnaires for.")
    
    class Meta:
        model = Questionnaire
        fields = '__all__'  # Specify the fields you want to include

    def validate_demandeId(self, value):
        """
        Validate that the demandeId is a positive integer.
        """
        if value <= 0:
            raise serializers.ValidationError("demandeId must be a positive integer.")
        return value
    
    
