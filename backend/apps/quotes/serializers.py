from rest_framework import serializers
from .models import Quote, QuoteUserLog, QuoteLock, Comment
from apps.questionnaire.serializers import QuestionnaireIdSerializer

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class CommentLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text']  # or whatever your label field is called
        read_only_fields = ['id', 'text']  # Make sure to set read-only fields if needed

class QuoteSerializer(serializers.ModelSerializer):
    comments = CommentLabelSerializer(many=False)
    questionnaire = QuestionnaireIdSerializer(read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)
    
    
    
class QuoteUserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteUserLog
        fields = '__all__'
        read_only_fields = ('timestamp', 'user', 'action')
        
        
class QuoteLockSerializer(serializers.ModelSerializer): 
    class Meta:
        model = QuoteLock
        fields = '__all__'
        read_only_fields = ['id', 'quote', 'user', 'expire_at']