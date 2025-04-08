import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = ["age", "earnings", "claimAmount", "planAmount", "creditScore", "daysPassed"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields", {
        position: "top-center",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    const features = [
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
    ];
  
    // 🧠 Construct the raw_data object to save
    const raw_data = {
      age: parseFloat(formData.age),
      gender: formData.gender === "Male" ? "M" : "F",
      earnings: parseFloat(formData.earnings),
      claim_amount: parseFloat(formData.claimAmount),
      insurance_plan_amount: parseFloat(formData.planAmount),
      credit_score: formData.creditScore === "1" || formData.creditScore === "true" || formData.creditScore === true,
      marital_status: formData.maritalStatus === "Married" ? "M" : "S",
      days_passed: parseInt(formData.daysPassed),
      type_of_insurance: "health", // default; update if needed
      plan_type: formData.planType === "Basic" ? "basic" : "premium"
    };
  
    const payload = { features, raw_data };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/predict/", payload);
      setResult(response.data);
      setLoading(false);
      
      // Essential churn risk notification
      if (response.data.churn_analysis.is_churn_risk) {
        toast.error("⚠️ High Churn Risk Detected! Action recommended.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
      
    } catch (error) {
      console.error("Error making request:", error);
      setLoading(false);
      setError("Failed to get prediction. Please try again.");
      
      toast.error("Failed to get prediction. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleReset = () => {
    setFormData({
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
    setResult(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-2 sm:p-4 md:p-8"
    >
      {/* Toast Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      
      {/* Glassmorphic Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-4 sm:p-6 md:p-10 w-full max-w-4xl border border-white/20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-lg">
          Insurance Churn Prediction
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-6 sm:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-6 md:gap-y-8">
            {[
              { name: "age", label: "Age", placeholder: "Enter age in years" },
              { name: "earnings", label: "Annual Earnings", placeholder: "Enter amount in $" },
              { name: "claimAmount", label: "Claim Amount", placeholder: "Enter claim amount" },
              { name: "planAmount", label: "Plan Amount", placeholder: "Enter plan amount" },
              { name: "creditScore", label: "Credit Score", placeholder: "300-850" },
              { name: "daysPassed", label: "Days Since Last Claim", placeholder: "Enter days" },
            ].map(({ name, label, placeholder }) => (
              <div key={name} className="relative group">
                <label className="block text-white/80 text-sm font-medium mb-1 sm:mb-2">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-900/70 text-white rounded-lg focus:ring-2 focus:ring-purple-400 transition-all group-hover:scale-105"
                  required
                />
              </div>
            ))}

            {/* Dropdown Fields */}
            {[
              { name: "gender", label: "Gender", options: ["Male", "Female"] },
              { name: "maritalStatus", label: "Marital Status", options: ["Single", "Married"] },
              { name: "autoInsurance", label: "Auto Insurance", options: ["Yes", "No"] },
              { name: "healthInsurance", label: "Health Insurance", options: ["Yes", "No"] },
              { name: "lifeInsurance", label: "Life Insurance", options: ["Yes", "No"] },
              { name: "planType", label: "Plan Type", options: ["Basic", "Premium"] },
            ].map(({ name, label, options }) => (
              <div key={name} className="relative group">
                <label className="block text-white/80 text-sm font-medium mb-1 sm:mb-2">{label}</label>
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-900/70 text-white rounded-lg focus:ring-2 focus:ring-purple-400 transition-all group-hover:scale-105"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-500 text-white py-3 sm:py-4 rounded-lg hover:bg-purple-600 transition-all duration-300 font-medium text-base sm:text-lg shadow-lg hover:shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Get Prediction 🚀"}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-700 text-white py-3 sm:py-4 rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium text-base sm:text-lg shadow-lg"
            >
              Reset Form
            </motion.button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 sm:p-4 bg-red-500/30 text-white rounded-lg border border-red-400 text-center text-sm sm:text-base"
          >
            {error}
          </motion.p>
        )}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-center"
          >
            <div className="animate-pulse text-white text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-2">Analyzing customer data...</p>
            </div>
          </motion.div>
        )}

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 sm:mt-10 space-y-4 sm:space-y-6 text-white"
          >
            <div className="bg-gray-900/80 p-4 sm:p-6 rounded-lg shadow-xl border border-white/20">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Prediction Result</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 ${result.churn_analysis.is_churn_risk ? 'bg-red-900/50' : 'bg-green-900/50'} rounded-lg`}>
                  <p className="text-gray-300 text-sm">Churn Probability</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {result.churn_analysis.churn_probability.toFixed(2)}%
                    {result.churn_analysis.is_churn_risk && 
                      <span className="ml-2 animate-pulse inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                    }
                  </p>
                </div>
                <div className={`p-3 sm:p-4 ${result.churn_analysis.is_churn_risk ? 'bg-red-900/50' : 'bg-green-900/50'} rounded-lg`}>
                  <p className="text-gray-300 text-sm">Risk Status</p>
                  <p className="text-xl sm:text-2xl font-bold">{result.churn_analysis.is_churn_risk ? "High Risk" : "Low Risk"}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm sm:text-base">
                <div className="p-3 bg-purple-900/30 rounded-lg">
                  <p className="font-medium">Recommendation:</p>
                  <p className="font-bold text-purple-200">{result.churn_analysis.recommendation}</p>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold mt-3">Plan Recommendation:</h3>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p>Recommended Plan: <span className="font-bold text-purple-300">{result.plan_recommendation.recommended_plan_name}</span></p>
                  <p>Plan Message: <span className="font-bold text-purple-200">{result.plan_recommendation.plan_message}</span></p>
                </div>
                
                {/* <h3 className="text-base sm:text-lg font-semibold mt-3">Customer Analysis:</h3>
                <div className="bg-gray-800/50 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p>Customer Value: <span className="font-bold text-yellow-300">{result.customer_analysis.customer_value}</span></p>
                  <p>Value Category: <span className={`font-bold ${
                    result.customer_analysis.value_category === "High Value" ? "text-green-300" : 
                    result.customer_analysis.value_category === "Medium Value" ? "text-yellow-300" : "text-gray-300"
                  }`}>{result.customer_analysis.value_category}</span></p>
                  <p>Segment: <span className="font-bold text-blue-300">{result.customer_analysis.customer_segment}</span></p>
                  <p>Revenue Potential: <span className="font-bold text-green-300">{result.customer_analysis.revenue_potential}</span></p>
                  <p>Cross-sell Opportunity: <span className={`font-bold ${
                    result.customer_analysis.cross_sell_opportunity === "High" ? "text-green-300" : 
                    result.customer_analysis.cross_sell_opportunity === "Medium" ? "text-yellow-300" : "text-gray-300"
                  }`}>{result.customer_analysis.cross_sell_opportunity}</span></p>
                </div> */}
                
                {/* Customer Recommendations */}
                <h3 className="text-base sm:text-lg font-semibold mt-3">Customer Recommendations:</h3>
                {result.customer_recommendations && Object.keys(result.customer_recommendations).map((key) => (
                  <div key={key} className="mt-2 bg-gray-800/30 p-3 rounded-lg">
                    <p className="font-medium text-purple-400">{key.replace(/_/g, " ")}:</p>
                    <ul className="list-disc list-inside pl-2 sm:pl-4">
                      {result.customer_recommendations[key].map((recommendation, index) => (
                        <li key={index} className="text-xs sm:text-sm">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChurnPred;