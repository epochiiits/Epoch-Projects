from django.urls import path
from .views import prediction_form, predict

urlpatterns = [
    path("predict/", predict, name="predict"),  # Your existing API endpoint
    path("prediction-form/", prediction_form, name="prediction_form"),  # New URL for the form
]