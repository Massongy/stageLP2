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
        #read_only_fields = ['id', 'text']  # Make sure to set read-only fields if needed

    def to_representation(self, instance):
        return instance.text
    
    
class QuoteSerializer(serializers.ModelSerializer):
    comment = serializers.CharField(required=False, allow_null=True)
    questionnaire = QuestionnaireIdSerializer(read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        comment = getattr(instance, 'comment', None)  # related_name='comment' on OneToOneField
        rep['comment'] = comment.text if comment else None
        return rep

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        comment_text = validated_data.pop('comment', None)
        validated_data['user'] = self.context['request'].user
        instance = super().update(instance, validated_data)
        
        if comment_text  is not None:
            try:
                comment = instance.comment  # get related Comment instance via OneToOneField related_name
                comment.text = comment_text
                comment.user = self.context['request'].user  # Update user if needed
                comment.save()
            except Comment.DoesNotExist:
                Comment.objects.create(quote=instance, text=comment_text, user=self.context['request'].user)

        return instance
    
    def get_comment(self, obj):
        comment = getattr(obj, 'comments', None)  # won't raise error
        if comment is not None:
            return CommentLabelSerializer(comment).data
        return None

    
    
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