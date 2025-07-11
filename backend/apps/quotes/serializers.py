from rest_framework import serializers
from .models import Quote, QuoteUserLog, QuoteLock


class QuoteSerializer(serializers.ModelSerializer):
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