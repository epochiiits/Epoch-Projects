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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 w-full max-w-4xl border border-white/20"
      >
        <h2 className="text-5xl font-extrabold text-center text-white drop-shadow-lg">
          Insurance Churn Prediction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {[
              { name: "age", label: "Age", placeholder: "Enter age in years" },
              { name: "earnings", label: "Annual Earnings", placeholder: "Enter amount in $" },
              { name: "claimAmount", label: "Claim Amount", placeholder: "Enter claim amount" },
              { name: "planAmount", label: "Plan Amount", placeholder: "Enter plan amount" },
              { name: "creditScore", label: "Credit Score", placeholder: "300-850" },
              { name: "daysPassed", label: "Days Since Last Claim", placeholder: "Enter days" },
            ].map(({ name, label, placeholder }) => (
              <div key={name} className="relative group">
                <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900/70 text-white rounded-lg focus:ring-2 focus:ring-purple-400 transition-all group-hover:scale-105"
                  required
                />
              </div>
            ))}

            {[
              { name: "gender", label: "Gender", options: ["Male", "Female"] },
              { name: "maritalStatus", label: "Marital Status", options: ["Single", "Married"] },
              { name: "autoInsurance", label: "Auto Insurance", options: ["Yes", "No"] },
              { name: "healthInsurance", label: "Health Insurance", options: ["Yes", "No"] },
              { name: "lifeInsurance", label: "Life Insurance", options: ["Yes", "No"] },
              { name: "planType", label: "Plan Type", options: ["Basic", "Premium"] },
            ].map(({ name, label, options }) => (
              <div key={name} className="relative group">
                <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900/70 text-white rounded-lg focus:ring-2 focus:ring-purple-400 transition-all group-hover:scale-105"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-500 text-white py-4 rounded-lg hover:bg-purple-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-purple-500/50"
          >
            Get Prediction 🚀
          </motion.button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/30 text-white rounded-lg border border-red-400 text-center"
          >
            {error}
          </motion.p>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 space-y-6 text-white"
          >
            <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-white">Prediction Result</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Churn Probability</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(result.churn_analysis.churn_probability * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Risk Status</p>
                  <p className="text-2xl font-bold">
                    {result.churn_analysis.is_churn_risk ? "High Risk" : "Low Risk"}
                  </p>
                </div>
              </div>

              <p className="mt-4">Recommendation: <span className="font-bold">{result.churn_analysis.recommendation}</span></p>

              <h3 className="text-lg font-semibold mt-6">Plan Recommendation:</h3>
              <p>Recommended Plan: <span className="font-bold">{result.plan_recommendation.recommended_plan_name}</span></p>
              <p>Current Plan: <span className="font-bold">{result.plan_recommendation.current_plan || "None"}</span></p>
              <p>Plan Message: <span className="font-bold">{result.plan_recommendation.plan_message}</span></p>

              <h3 className="text-lg font-semibold mt-6">Customer Recommendations:</h3>
              {result.customer_recommendations && Object.entries(result.customer_recommendations).map(([key, recs]) => (
              <div key={key} className="mt-4">
                <h4 className="text-md font-semibold text-purple-300">
                  {key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                </h4>
                <ul className="list-disc list-inside ml-4 mt-2 text-sm text-white/90">
                  {recs.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            ))}

            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChurnPred;
