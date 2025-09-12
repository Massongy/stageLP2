from django.db import models
from apps.quotes.models import Quote

# Create your models here.

class Questionnaire(models.Model):
    
    quote = models.OneToOneField(Quote, on_delete=models.CASCADE, related_name='questionnaire')   
    score = models.IntegerField(default=0)
    potential = models.CharField(blank=True, null=True, max_length=100) 
    opName = models.CharField(max_length=255, blank=True, null=True)   
    date_prevue = models.DateField(blank=True, null=True)
    reference_id_SI = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Questionnaire for {self.quote}"


class Question(models.Model):
    label = models.CharField(max_length=255)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)
    is_date_input = models.BooleanField(default=False)  # For date input questions
    def __str__(self):
        return self.label

class Reponse(models.Model):
    
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='reponses')
    value = models.TextField()
    score = models.IntegerField(default=0)
    reference_id_SI = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.value}"

class GivenAnswer(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.SET_NULL, null=True, related_name='given_answers')
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True )
    answer = models.ForeignKey(Reponse, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['questionnaire', 'question'],
                name='unique_answer_per_question_per_questionnaire'
            )
        ]

    def __str__(self):
        return f"{self.question}: {self.answer}"


