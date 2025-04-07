import React, { useState } from 'react';
import axios from 'axios';

const RetrainModel = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRetrain = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://ec2-13-60-196-93.eu-north-1.compute.amazonaws.com/api/retrain-model/');
      setMessage(response.data.message || 'Model retrained successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Retrain Churn Model</h2>
      <button
        onClick={handleRetrain}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        {loading ? 'Retraining...' : 'Retrain Model'}
      </button>
      {message && (
        <p className={`mt-2 ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RetrainModel;
