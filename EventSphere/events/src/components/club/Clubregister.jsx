import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../apiserveices/api";

const ClubRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    banner: null,
    logo: null,
  });
  const [bannerPreview, setBannerPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });

    // Create preview for the image
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (name === "banner") {
          setBannerPreview(e.target.result);
        } else if (name === "logo") {
          setLogoPreview(e.target.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate file uploads
    if (!formData.banner || !formData.logo) {
      setError("Both banner and logo images are required");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("description", formData.description);
      data.append("banner", formData.banner);
      data.append("logo", formData.logo);

      const response = await axios.post(`${Base_Url}/clubs`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.club) {
        navigate("/club/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Register Your Club</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account to start managing events for your club
          </p>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Club Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Club Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Club Logo
              </label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                onChange={handleFileChange}
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-24 w-24 object-cover rounded-full"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700">
                Club Banner
              </label>
              <input
                id="banner"
                name="banner"
                type="file"
                accept="image/*"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                onChange={handleFileChange}
              />
              {bannerPreview && (
                <div className="mt-2">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="h-24 w-full object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {loading ? "Registering..." : "Register Club"}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have a club account?{" "}
            <Link
              to="/club/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClubRegister;