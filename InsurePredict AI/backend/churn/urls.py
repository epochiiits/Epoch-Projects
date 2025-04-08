from django.conf import settings
from django.urls import path, re_path
from .views import prediction_form, predict, retrain_model_api

urlpatterns = [
    path("predict/", predict, name="predict"),  # Your existing API endpoint
    path("prediction-form/", prediction_form, name="prediction_form"),  
    path("retrain-model/", retrain_model_api, name="retrain_model"),  # New endpoint for retraining
]

# if settings.DEBUG:
#     from django.conf.urls.static import static
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# urlpatterns += [
#     re_path(r'^(?:.*)/?$',index,name = 'index')
# ]