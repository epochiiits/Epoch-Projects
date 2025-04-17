import joblib
import os
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

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



# Use the correct path to the training data file
LOGS_DIR = os.path.join(PARENT_DIR, "logs")
customer_profiles = pd.read_csv(os.path.join(LOGS_DIR, "training_data.csv"))
X = customer_profiles.iloc[:,:12]
y = customer_profiles.iloc[:,12]

def get_similar_customers(target_customer, n=10):
    """
    Find similar customers based on cosine similarity
    """
    # Convert target_customer to a 2D numpy array with shape (1, n_features)
    if isinstance(target_customer, pd.Series):
        target_array = target_customer.values.reshape(1, -1)
    else:
        target_array = target_customer.values.reshape(1, -1)

    # Convert X to a 2D numpy array
    X_array = X.values
    # Calculate similarity directly with numpy arrays
    similarity_matrix = cosine_similarity(target_array, X_array)

    # Get indices of most similar customers
    similar_indices = similarity_matrix[0].argsort()[::-1][:n]

    return similar_indices
# Function to generate personalized recommendations based on similar customers
def generate_recommendations(target_customer):
    """
    Generate personalized recommendations based on similar non-churned customers

    Parameters:
    target_customer (pd.Series): The customer profile to generate recommendations for

    Returns:
    dict: Dictionary of recommendations
    """

    # Get similar customers
    similar_indices = get_similar_customers(target_customer)

    # Ensure target_customer is a Series (not a DataFrame)
    if hasattr(target_customer, 'iloc') and not isinstance(target_customer, pd.Series):
        target_customer = target_customer.iloc[0]
    # Filter to non-churned similar customers
    non_churned_similar = [idx for idx in similar_indices if y.iloc[idx] == 0]

    if not non_churned_similar:
        return {"General": ["We don't have enough similar customers to provide personalized recommendations."]}

    similar_customers_data = X.iloc[non_churned_similar]

    recommendations = {}


    # 1. Insurance Types comparison
    # Check which insurance types are common among similar non-churned customers
    auto_insurance_popular = similar_customers_data['Automobile Insurance'].mean() > 0.5
    health_insurance_popular = similar_customers_data['Health Insurance'].mean() > 0.5
    life_insurance_popular = similar_customers_data['Life Insurance'].mean() > 0.5

    insurance_recs = []
    if auto_insurance_popular and target_customer['Automobile Insurance'] == 0:
        insurance_recs.append("Add automobile insurance - popular among similar customers who stay with us")
    if health_insurance_popular and target_customer['Health Insurance'] == 0:
        insurance_recs.append("Include health insurance coverage - common among customers with your profile")
    if life_insurance_popular and target_customer['Life Insurance'] == 0:
        insurance_recs.append("Consider life insurance protection - beneficial for customers similar to you")

    if insurance_recs:
        recommendations['Insurance_Options'] = insurance_recs
        print(recommendations["Insurance_Options"])  # Only print if the key exists
    # 2. Analyze claim behaviors of similar customers
    avg_claim = similar_customers_data['Claim Amount ($)'].mean()
    if target_customer['Claim Amount ($)'] < avg_claim - 0.5:
        recommendations['Claim_Optimization'] = [
            "You may be under-utilizing your benefits compared to similar customers",
            "Schedule a coverage review to ensure you're getting the most from your plan"
        ]
    elif target_customer['Claim Amount ($)'] > avg_claim + 0.5:
        recommendations['Claim_Optimization'] = [
            "Your claim pattern differs from similar satisfied customers",
            "Consider our premium protection plan with higher claim limits"
        ]

    # 3. Credit score-based recommendations
    avg_credit = similar_customers_data['Credit Score'].mean()
    if target_customer['Credit Score'] < avg_credit - 0.1:
        recommendations['Credit_Improvement'] = [
            "Our credit improvement program can help enhance your insurance terms",
            "Customers with improved credit scores often receive better rates"
        ]

    # 4. Additional demographic insights
    age = target_customer['Age']
    if age < 30:
        recommendations['Young_Customer'] = [
            "Short-term flexible coverage plans for young professionals",
            "Digital service with mobile app benefits"
        ]
    elif age > 55:
        recommendations['Senior_Customer'] = [
            "Fixed premium rates for long-term loyalty",
            "Priority human customer support"
        ]

    # If no specific recommendations were generated, provide a general one
    if not recommendations:
        recommendations['General'] = ["Based on similar customers, your current plan appears optimal."]

    return recommendations
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
    temp=input_data.copy()
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
    if is_churn_risk and plan_scaler_churn is not None:
        plan_input.loc[:, scale_columns] = plan_scaler_churn.transform(plan_input[scale_columns])
        recommended_plan = plan_recommender_churn.predict(plan_input.loc[:, plan_input.columns != "Plan Type"])[0]
    elif plan_scaler is not None:
        plan_input.loc[:, scale_columns] = plan_scaler.transform(plan_input[scale_columns])
        recommended_plan = plan_recommender.predict(plan_input.loc[:, plan_input.columns != "Plan Type"])[0]
    else:
        # Handle case where scalers are None
        recommended_plan = features[11]  # Default to current plan

    # Convert numeric plan type to descriptive name
    plan_names = {1: "Basic", 2: "Standard", 3: "Premium"}
    current_plan = plan_names.get(int(features[11]))  # Plan type is at index 11
    recommended_plan_name = plan_names.get(int(recommended_plan))

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

    # 3. CUSTOMER SIMILARITY ANALYSIS
    # Generate personalized recommendations based on similar customers
    try:
        customer_recommendations = generate_recommendations(temp)
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        customer_recommendations = {"General": ["Unable to generate personalized recommendations."]}

    # Return combined results
    return {
        "churn_analysis": churn_result,
        "plan_recommendation": plan_result,
        "customer_recommendations": customer_recommendations
    }