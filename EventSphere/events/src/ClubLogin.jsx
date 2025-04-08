import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../apiserveices/api";
import Cookies from "js-cookie";

const ClubLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${Base_Url}/clubs/login`, {
        email,
        password,
      });

      if (response.data.club) {
        // Store club info in cookies
        Cookies.set("club_id", response.data.club.id);
        Cookies.set("club_name", response.data.club.name);
        Cookies.set("club_email", response.data.club.email);
        
        // Redirect to club dashboard
        navigate(`/club/dashboard/${response.data.club.id}`);
      }
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Club Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to manage your club events
          </p>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Club Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150`}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have a club account?{" "}
            <Link
              to="/club/register"
              className="font-medium text-purple-600 hover:text-purple-500 transition"
            >
              Register your club
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClubLogin;