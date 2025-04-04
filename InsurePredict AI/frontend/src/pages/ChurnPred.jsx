import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ChurnPred = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    earnings: "",
    claimAmount: "",
    planAmount: "",
    creditScore: "",
    maritalStatus: "Single",
    daysPassed: "",
    autoInsurance: "Yes",
    healthInsurance: "Yes",
    lifeInsurance: "Yes",
    planType: "Basic",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formattedData = {
      features: [
        parseFloat(formData.age),
        formData.gender === "Male" ? 1 : 0,
        parseFloat(formData.earnings),
        parseFloat(formData.claimAmount),
        parseFloat(formData.planAmount),
        parseInt(formData.creditScore),
        formData.maritalStatus === "Married" ? 1 : 0,
        parseInt(formData.daysPassed),
        formData.autoInsurance === "Yes" ? 1 : 0,
        formData.healthInsurance === "Yes" ? 1 : 0,
        formData.lifeInsurance === "Yes" ? 1 : 0,
        formData.planType === "Basic" ? 0 : 1,
      ],
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/predict/", formattedData);
      setResult(response.data);
    } catch (error) {
      console.error("Error making request:", error);
      setError("Failed to get prediction. Please try again.");
    }
  };

  const inputStyles = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 outline-none bg-white hover:bg-gray-50";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  const formFields = {
    age: { label: "Age", placeholder: "Enter age in years" },
    gender: { label: "Gender", options: ["Male", "Female"] },
    earnings: { label: "Annual Earnings", placeholder: "Enter amount in dollars" },
    claimAmount: { label: "Claim Amount", placeholder: "Enter claim amount" },
    planAmount: { label: "Plan Amount", placeholder: "Enter plan amount" },
    creditScore: { label: "Credit Score", placeholder: "Enter score (300-850)" },
    maritalStatus: { label: "Marital Status", options: ["Single", "Married"] },
    daysPassed: { label: "Days Since Last Claim", placeholder: "Enter number of days" },
    autoInsurance: { label: "Auto Insurance", options: ["Yes", "No"] },
    healthInsurance: { label: "Health Insurance", options: ["Yes", "No"] },
    lifeInsurance: { label: "Life Insurance", options: ["Yes", "No"] },
    planType: { label: "Plan Type", options: ["Basic", "Premium"] }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Insurance Churn Prediction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {Object.entries(formFields).map(([key, field]) => (
              <div key={key}>
                <label htmlFor={key} className={labelStyles}>
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={key}
                    type="number"
                    name={key}
                    placeholder={field.placeholder}
                    value={formData[key]}
                    onChange={handleChange}
                    className={inputStyles}
                    required
                  />
                )}
              </div>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 mt-8 font-medium text-lg shadow-md hover:shadow-xl"
          >
            Get Prediction
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200"
          >
            {error}
          </motion.p>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <p className="text-gray-400">Churn Probability</p>
                  <p className="text-2xl font-bold">{result.churn_analysis.churn_probability.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-black/40 rounded-lg">
                  <p className="text-gray-400">Risk Status</p>
                  <p className="text-2xl font-bold">{result.churn_analysis.is_churn_risk ? "High Risk" : "Low Risk"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Plan Recommendation</h4>
              <div className="space-y-2">
                <p>Recommended Plan: <span className="font-semibold">{result.plan_recommendation.recommended_plan_name}</span></p>
                <p>Current Plan: <span className="font-semibold">{result.plan_recommendation.current_plan || "None"}</span></p>
                <p className="text-gray-600">{result.plan_recommendation.plan_message}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Customer Recommendations</h4>
              {Object.entries(result.customer_recommendations).map(([category, recs]) => (
                <div key={category} className="mb-4">
                  <p className="font-medium text-gray-800 mb-2">{category.replace(/_/g, " ")}</p>
                  <ul className="space-y-2">
                    {recs.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChurnPred;
