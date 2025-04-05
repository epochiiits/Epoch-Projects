from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from.models import CustomerRecord
import json
from .utils import get_comprehensive_analysis
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomerRecord
from .serializers import CustomerRecordSerializer
import os
import csv
from django.conf import settings

# @api_view(['POST'])
# def predict_and_save(request):
#     features = request.data.get("features")
#     raw_data = request.data.get("raw_data")

#     if not features or not raw_data:
#         return Response({"error": "Invalid data"}, status=400)

#     # === ML Prediction (based on features) ===
#     churn_prob = your_model.predict(features)
#     recommendation = your_model.get_recommendation(features)

#     # === Save raw_data + prediction ===
#     raw_data["churn_probability"] = churn_prob
#     raw_data["recommendation"] = recommendation

#     serializer = CustomerRecordSerializer(data=raw_data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({
#             "churn_probability": churn_prob,
#             "recommendation": recommendation
#         })
#     else:
#         return Response(serializer.errors, status=400)

@api_view(['POST'])
def predict(request):
    try:
        data = request.data

        # Check for required keys
        features = data.get("features")
        raw_data = data.get("raw_data")

        if not features or not isinstance(features, list):
            return Response({"error": "'features' should be a list"}, status=400)

        if not raw_data or not isinstance(raw_data, dict):
            return Response({"error": "Missing or invalid 'raw_data'"}, status=400)

        # 🔍 Perform model prediction
        result = get_comprehensive_analysis(features)
        churn_data = result.get("churn_analysis", {})
        churn_prob = churn_data.get("churn_probability", 0.0)
        recommendation = churn_data.get("recommendation", "No recommendation.")

        # ➕ Add prediction data to raw_data
        raw_data["churn_probability"] = churn_prob
        raw_data["recommendation"] = recommendation
        csv_path = os.path.join(settings.BASE_DIR, 'logs', 'training_data.csv')
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)  # Create folder if not exists

        with open(csv_path, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(features + [churn_prob]) 

        # ✅ Save raw_data to the database
        serializer = CustomerRecordSerializer(data=raw_data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({"error": "Invalid data", "details": serializer.errors}, status=400)

        # ✅ Return only prediction result
        return Response(result)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

def prediction_form(request):
    return render(request, "prediction_form.html")


def save_customer_data(data, churn_prob, recommendation):
    CustomerRecord.objects.create(
    age=data['age'],
    gender=data['gender'],
    earnings=data['earnings'],
    claim_amount=data['claim_amount'],
    insurance_plan_amount=data['insurance_plan_amount'],
    credit_score=data['credit_score'],
    marital_status=data['marital_status'],
    days_passed=data['days_passed'],
    type_of_insurance=data['type_of_insurance'],
    plan_type=data['plan_type'],  
    churn_probability=churn_prob,
    recommendation=recommendation
)
