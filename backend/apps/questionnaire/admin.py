from django.contrib import admin
from .models import Question, Reponse, Questionnaire

# Register your models here.
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'label')

@admin.register(Reponse)
class ReponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'Questionnaire', 'question', 'value')
    list_filter = ('Questionnaire', 'question')
    search_fields = ('question__label', 'value')


@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'score', 'potential', 'opName', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('quote__text', 'opName')