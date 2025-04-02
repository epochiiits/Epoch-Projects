from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import get_comprehensive_analysis

@api_view(["POST"])
def predict(request):
    try:
        data = request.data  # DRF automatically parses JSON

        # Validate "features" key
        if "features" not in data:
            return Response({"error": "Missing 'features' key in request"}, status=400)

        features = data["features"]

        # Ensure features is a list
        if not isinstance(features, list):
            return Response({"error": "'features' should be a list"}, status=400)

        # Perform comprehensive analysis (churn, recommendation, customer insights)
        result = get_comprehensive_analysis(features)

        return Response(result)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


def prediction_form(request):
    return render(request, "prediction_form.html")
