import { useState, useEffect } from "react";
import "./index_r.css";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Base_Url } from "./apiserveices/api";

const Nav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch profile data if user is already logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = Cookies.get("user");
      if (userId) {
        try {
          const response = await axios.get(`${Base_Url}/profile/${userId}`, {
          });
          setUserProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult) {
        const response = await axios.get(`${Base_Url}/auth/google`, {
          params: { tokens: authResult },
        });
        if (response.data.message) {
          Cookies.set("user", response.data.userId);
          setUserProfile(response.data); // Update state with user data
          navigate("/events");
        }
      }
    } catch (error) {
      console.log("Error during Google login:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
  });

  return (
    <div>
      <nav className="bg-purple-950 text-white shadow-md fixed w-full z-50 flex justify-center items-center">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-lg font-bold">Event Manager</span>
          </div>

          {/* Centered Navigation Links */}
          <ul className="mr-24 md:flex space-x-8 text-sm font-medium">
            <li className="hover:text-blue-500 transition duration-300">
              <a href="/club/dashboard/abcd">Organize</a>
            </li>
            <li className="hover:text-blue-500 transition duration-300">
              <a href="/events">Participate</a>
            </li>
          </ul>

          {/* Profile or Sign In Button */}
          

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block focus:outline-none"
          >
            <div className="w-6 h-0.5 bg-white mb-1 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-white mb-1 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
          </button>
        </div>

        {/* Mobile Popup Menu */}
        {menuOpen && (
          <div className="absolute top-14 right-4 bg-gray-800 text-white shadow-lg rounded-lg p-4 w-48">
            <ul className="space-y-3">
              <li className="hover:text-blue-400 transition duration-300">
                <a href="#previous-events">Previous Events</a>
              </li>
              <li className="hover:text-blue-400 transition duration-300">
                <a href="#upcoming-events">Upcoming Events</a>
              </li>
              <li className="hover:text-blue-400 transition duration-300">
                <a href="#photos">Photos</a>
              </li>
              <li className="hover:text-blue-400 transition duration-300">
                <a href="#contacts">Contacts</a>
              </li>
              {userProfile ? (
            <div className="flex items-center space-x-3">
              <img
                src={userProfile.profile || "https://via.placeholder.com/40"}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <span>{userProfile.name || "User"}</span>
            </div>
          ) : (
            <motion.button
              onClick={googleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign in with Google
            </motion.button>
          )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Nav;
