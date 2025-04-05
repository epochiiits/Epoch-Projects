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
    

class CustomerRecord(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    MARITAL_STATUS_CHOICES = [
        ('S', 'Single'),
        ('M', 'Married'),
    ]

    INSURANCE_TYPE_CHOICES = [
        ('health', 'Health'),
        ('life', 'Life'),
        ('auto', 'Auto'),
    ]
    PLAN_TYPE_CHOICES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
    ]


    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    earnings = models.FloatField()
    claim_amount = models.FloatField()
    insurance_plan_amount = models.FloatField()
    credit_score = models.BooleanField()
    marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS_CHOICES)
    days_passed = models.IntegerField()
    type_of_insurance = models.CharField(max_length=10, choices=INSURANCE_TYPE_CHOICES)
    plan_type = models.CharField(max_length=10, choices=PLAN_TYPE_CHOICES)

    churn_probability = models.FloatField(null=True, blank=True)
    recommendation = models.TextField(null=True, blank=True)
    

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Customer {self.id} - {self.age} yrs"


