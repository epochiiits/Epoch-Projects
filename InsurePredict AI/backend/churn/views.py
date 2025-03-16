from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from .utils import predict_churn

@api_view(["POST"])
def predict(request):
    try:
        # Parse JSON data correctly
        data = json.loads(request.body)  # Ensure data is properly formatted
        
        # Validate that "features" exist in the request
        if "features" not in data:
            return Response({"error": "Missing 'features' key in request"}, status=400)

        # Get the feature list
        features = data["features"]
        
        # Ensure the feature list is valid
        if not isinstance(features, list):
            return Response({"error": "'features' should be a list"}, status=400)

        # Get prediction
        result = predict_churn(features)

        return Response(result)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
