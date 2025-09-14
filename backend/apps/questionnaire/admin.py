from django.contrib import admin
from .models import Question, Reponse, Questionnaire, GivenAnswer

class GivenAnswersInline(admin.TabularInline):  # Or admin.StackedInline
    model = GivenAnswer 
    extra = 0  # No extra empty rows by default
    
class ReponsesInline(admin.TabularInline): 
    model = Reponse
    extra = 0

# Register your models here.
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'order')
    inlines = [ReponsesInline]

@admin.register(Reponse)
class ReponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'value', 'score')
    list_filter = ( 'question', 'value')
    search_fields = ('question__label', 'value')


@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'quote', 'score', 'potential', 'opName')
    list_filter = ('id', 'score', 'potential', 'opName')
    search_fields = ('quote__text', 'opName')
    inlines = [GivenAnswersInline]
    '''def list_answers(self, obj):
        return ", ".join([str(answer) for answer in obj.given_answers.all()])
    list_answers.short_description = 'Answers'
    '''
    
@admin.register(GivenAnswer)
class GivenAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'questionnaire', 'question', 'answer')
    list_filter = ('questionnaire', 'question', 'answer')
    search_fields = ('question__label', 'answer__value')
    