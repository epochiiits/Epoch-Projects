import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Insurance Churn Prediction</h1>
      <Link to="/predict" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
        Go to Prediction Page
      </Link>
    </div>
  );
};

export default Home;
