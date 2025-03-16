from django.db import models

class Customer(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    insurance_type = models.CharField(max_length=50)
    earnings = models.FloatField()
    claim_amount = models.FloatField()
    insurance_plan_amount = models.FloatField()
    plan_type = models.CharField(max_length=50)
    credit_score = models.IntegerField()
    marital_status = models.CharField(max_length=20)
    policy_start_date = models.DateField()
    churn = models.CharField(max_length=3)  # 'Yes' or 'No'

    def __str__(self):
        return self.name
