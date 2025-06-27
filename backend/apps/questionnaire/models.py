from django.db import models
from apps.quotes.models import Quote
from apps.questionnaire.models import Question, Reponse, Questionnaire
# Create your models here.

class Questionnaire(models.Model):
    
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='questionnaire')   
    score = models.IntegerField(default=0)
    potential = models.CharField(blank=True, null=True, max_length=100) 
    opName = models.CharField(max_length=255, blank=True, null=True) 
    
    def __str__(self):
        return f"Questionnaire for {self.quote}"

class GivenAnswer(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.SET_NULL, related_name='given_answers')
    question = models.ForeignKey(Question, on_delete=models.SET_NULL)
    answer = models.ForeignKey(Reponse, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.question}: {self.answer}"

class Question(models.Model):
    label = models.CharField(max_length=255)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.label

class Reponse(models.Model):
    Questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    value = models.TextField()
    reference_id_SI = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return f"{self.question.label}: {self.value}"
