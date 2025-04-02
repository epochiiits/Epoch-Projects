import joblib
import os
import numpy as np
import pandas as pd

# Load the pre-trained models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current script's directory
PARENT_DIR = os.path.dirname(BASE_DIR)  # Moves one level up
MODELS_DIR = os.path.join(PARENT_DIR, "models")

# Load all models
churn_model_path = os.path.join(MODELS_DIR, "churn_model.pkl")
churn_model = joblib.load(churn_model_path)

plan_recommender_path = os.path.join(MODELS_DIR, "plan_type_recommender.pkl")
plan_recommender = joblib.load(plan_recommender_path)

plan_recommender_churn_path = os.path.join(MODELS_DIR, "plan_type_recommender_churn.pkl")
plan_recommender_churn = joblib.load(plan_recommender_churn_path)

ml_model_path = os.path.join(MODELS_DIR, "ml_model.pkl")
ml_model = joblib.load(ml_model_path)

# Load scalers
churn_scaler_path = os.path.join(MODELS_DIR, "churn_scaler.pkl")
plan_scaler_path = os.path.join(MODELS_DIR, "plan_type_scaler.pkl")
plan_scaler_churn_path = os.path.join(MODELS_DIR, "plan_type_scaler_churn.pkl")

try:
    churn_scaler = joblib.load(churn_scaler_path)
    plan_scaler = joblib.load(plan_scaler_path)
    plan_scaler_churn = joblib.load(plan_scaler_churn_path)
except FileNotFoundError:
    # Handle the case where scalers aren't needed or available
    churn_scaler = None
    plan_scaler = None
    plan_scaler_churn = None

# Define the feature names as per training data
feature_names = ['Age', 'Gender', 'Earnings ($)', 'Claim Amount ($)',
                'Insurance Plan Amount ($)', 'Credit Score', 'Marital Status', 'days_passed',
                'Automobile Insurance', 'Health Insurance', 'Life Insurance', 'Plan Type']
def get_comprehensive_analysis(features):
    """
    Combined function that performs churn prediction, plan recommendation,
    and customer value analysis in one call.
    
    Parameters:
    - features: List of customer features in the same order as feature_names
    
    Returns:
    - Dictionary with all analysis results
    """
    # Create DataFrame with all features
    input_data = pd.DataFrame([features], columns=feature_names).astype(float)
    
    # Define the columns to be scaled
    scale_columns = ['Age', 'Earnings ($)', 'Claim Amount ($)', 'Insurance Plan Amount ($)']
    
    # 1. CHURN PREDICTION
    # Create a copy for churn prediction to avoid affecting the original
    churn_input = input_data.copy()
    
    # Scale only the selected columns for churn prediction
    if churn_scaler is not None:
        churn_input.loc[:, scale_columns] = churn_scaler.transform(churn_input[scale_columns])
    
    # Get churn probability
    churn_probability = churn_model.predict_proba(churn_input)[0][1]
    is_churn_risk = churn_probability > 0.5
    
    churn_result = {
        "churn_probability": float(churn_probability),
        "is_churn_risk": is_churn_risk,
        "recommendation": (
            "High churn risk! Consider offering personalized discounts or improved benefits."
            if is_churn_risk else
            "Low churn risk. Maintain regular engagement and customer satisfaction measures."
        )
    }
    
    # 2. PLAN RECOMMENDATION
    # Create a copy for plan recommendation
    plan_input = input_data.copy()
    
    # Apply appropriate scaling based on churn risk
    if is_churn_risk:
        plan_input.loc[:, scale_columns] = plan_scaler_churn.transform(plan_input[scale_columns])
        recommended_plan = plan_recommender_churn.predict(plan_input.loc[:, plan_input.columns != "Plan Type"])[0]
    else:
        plan_input.loc[:, scale_columns] = plan_scaler.transform(plan_input[scale_columns])
        recommended_plan = plan_recommender.predict(plan_input.loc[:, plan_input.columns != "Plan Type"])[0]
    
    # Convert numeric plan type to descriptive name
    plan_names = {1: "Basic", 2: "Standard", 3: "Premium"}
    current_plan = plan_names.get(int(features[11]), "Unknown")  # Plan type is at index 11
    recommended_plan_name = plan_names.get(int(recommended_plan), "Unknown")
    
    # Generate recommendation message
    if int(recommended_plan) == int(features[11]):  # Current plan is already optimal
        plan_message = f"The customer's current {current_plan} plan is already optimal based on their profile."
    else:
        plan_message = f"Recommend upgrading from {current_plan} to {recommended_plan_name} plan for better value and reduced churn risk."
    
    plan_result = {
        "recommended_plan": int(recommended_plan),
        "recommended_plan_name": recommended_plan_name,
        "current_plan": current_plan,
        "plan_message": plan_message
    }
    
    # 3. CUSTOMER VALUE ANALYSIS - ENHANCED VERSION
    # Create a copy for customer value analysis
    ml_input = input_data.copy()
    
    # Scale the appropriate columns (using churn scaler as default)
    if churn_scaler is not None:
        ml_input.loc[:, scale_columns] = churn_scaler.transform(ml_input[scale_columns])
    
    # Predict customer lifetime value
    try:
        customer_value = float(ml_model.predict(ml_input)[0])
    except Exception as e:
        print(f"Error predicting customer value: {e}")
        customer_value = 5000  # Default fallback value
    
    # Categorize the customer based on predicted value
    if customer_value > 10000:
        value_category = "High Value"
        value_message = "High value customer deserving premium service and retention efforts."
        value_recommendations = [
            "Offer exclusive benefits and priority service",
            "Provide personalized policy review sessions",
            "Consider loyalty discounts for multi-year commitments"
        ]
    elif customer_value > 5000:
        value_category = "Medium Value"
        value_message = "Moderate value customer with growth potential."
        value_recommendations = [
            "Focus on cross-selling complementary insurance products",
            "Offer bundled services for better value",
            "Provide annual coverage reviews"
        ]
    else:
        value_category = "Low Value"
        value_message = "New or low-value customer requiring nurturing."
        value_recommendations = [
            "Educate on benefits of higher coverage plans",
            "Suggest budget-friendly policy upgrades",
            "Implement regular check-ins to build relationship"
        ]
    
    # Create enhanced customer analysis result
    ml_result = {
        "customer_value": round(customer_value, 2),  # Round to 2 decimal places
        "value_category": value_category,
        "value_message": value_message,
        "value_recommendations": value_recommendations,
        # Add additional metrics based on customer data
        "customer_segment": "New Customer" if input_data["days_passed"].values[0] < 1 else "Existing Customer",
        "revenue_potential": "High" if input_data["Earnings ($)"].values[0] > 75000 else "Medium" if input_data["Earnings ($)"].values[0] > 40000 else "Low",
        "cross_sell_opportunity": "Yes" if (input_data["Automobile Insurance"].values[0] + 
                                           input_data["Health Insurance"].values[0] + 
                                           input_data["Life Insurance"].values[0]) < 2 else "Limited"
    }
    
    # Return combined results
    return {
        "churn_analysis": churn_result,
        "plan_recommendation": plan_result,
        "customer_analysis": ml_result
    }
