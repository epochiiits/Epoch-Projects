import joblib
import os
import numpy as np

# Load the pre-trained model (assumes the file is in the same folder)
model_path = os.path.join(os.path.dirname(__file__), "churn_model.pkl")
model = joblib.load(model_path)

def predict_churn(features):
    """
    Predicts churn probability and returns recommendations.
    `features` should be a list with the order:
    [Age, Gender, Earnings ($), Claim Amount ($), Insurance Plan Amount ($), 
     Credit Score, Marital Status, days_passed, Automobile Insurance, Health Insurance, 
     Life Insurance, Plan Type]
    """
    # Ensure features is a numpy array with correct shape
    input_data = np.array(features).reshape(1, -1)
    
    # Use model's predict_proba if available
    churn_probability = model.predict_proba(input_data)[0][1]  # assuming second column is probability for class 1 (churn)
    
    # Example recommendation logic based on churn probability
    if churn_probability > 0.5:
        recommendation = "High churn risk! Consider offering personalized discounts or improved benefits."
    else:
        recommendation = "Low churn risk. Maintain regular engagement and customer satisfaction measures."
    
    return {"churn_probability": churn_probability, "recommendation": recommendation}
