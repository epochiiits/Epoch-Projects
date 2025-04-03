import { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      alert("Failed to get prediction. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Insurance Churn Prediction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="input" required />
            <select name="gender" value={formData.gender} onChange={handleChange} className="input">
              <option>Male</option>
              <option>Female</option>
            </select>
            <input type="number" name="earnings" placeholder="Annual Earnings" value={formData.earnings} onChange={handleChange} className="input" required />
            <input type="number" name="claimAmount" placeholder="Claim Amount" value={formData.claimAmount} onChange={handleChange} className="input" required />
            <input type="number" name="planAmount" placeholder="Plan Amount" value={formData.planAmount} onChange={handleChange} className="input" required />
            <input type="number" name="creditScore" placeholder="Credit Score" value={formData.creditScore} onChange={handleChange} className="input" required />
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input">
              <option>Single</option>
              <option>Married</option>
            </select>
            <input type="number" name="daysPassed" placeholder="Days Since Last Claim" value={formData.daysPassed} onChange={handleChange} className="input" required />
            <select name="autoInsurance" value={formData.autoInsurance} onChange={handleChange} className="input">
              <option>Yes</option>
              <option>No</option>
            </select>
            <select name="healthInsurance" value={formData.healthInsurance} onChange={handleChange} className="input">
              <option>Yes</option>
              <option>No</option>
            </select>
            <select name="lifeInsurance" value={formData.lifeInsurance} onChange={handleChange} className="input">
              <option>Yes</option>
              <option>No</option>
            </select>
            <select name="planType" value={formData.planType} onChange={handleChange} className="input">
              <option>Basic</option>
              <option>Premium</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Predict</button>
        </form>
        {result && (
          <div className="mt-4 p-4 bg-gray-200 rounded-md">
            <h3 className="text-lg font-semibold">Prediction Result:</h3>
            <p>Churn Probability: <span className="font-bold">{result.churn_analysis.churn_probability}</span></p>
            <p>Churn Risk: <span className="font-bold">{result.churn_analysis.is_churn_risk ? "Yes" : "No"}</span></p>
            <p>Recommendation: <span className="font-bold">{result.churn_analysis.recommendation}</span></p>
            <h3 className="text-lg font-semibold mt-3">Plan Recommendation:</h3>
            <p>Recommended Plan: <span className="font-bold">{result.plan_recommendation.recommended_plan_name}</span></p>
            <p>Plan Message: <span className="font-bold">{result.plan_recommendation.plan_message}</span></p>
            <h3 className="text-lg font-semibold mt-3">Customer Analysis:</h3>
            <p>Customer Value: <span className="font-bold">{result.customer_analysis.customer_value}</span></p>
            <p>Value Category: <span className="font-bold">{result.customer_analysis.value_category}</span></p>
            <p>Segment: <span className="font-bold">{result.customer_analysis.customer_segment}</span></p>
            <p>Revenue Potential: <span className="font-bold">{result.customer_analysis.revenue_potential}</span></p>
            <p>Cross-sell Opportunity: <span className="font-bold">{result.customer_analysis.cross_sell_opportunity}</span></p>
            <h3 className="text-lg font-semibold mt-3">Value Recommendations:</h3>
            <ul className="list-disc pl-5">
              {result.customer_analysis.value_recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChurnPred;