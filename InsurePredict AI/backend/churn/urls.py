from django.urls import path
from .views import prediction_form, predict, retrain_model_api

urlpatterns = [
    path("predict/", predict, name="predict"),  # Your existing API endpoint
    path("prediction-form/", prediction_form, name="prediction_form"),  
    path("retrain-model/", retrain_model_api, name="retrain_model"),  # New endpoint for retraining
]