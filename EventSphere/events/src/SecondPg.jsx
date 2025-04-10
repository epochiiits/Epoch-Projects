import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index_r.css";
import Section from "./Section";
import { Base_Url } from "./apiserveices/api";

const SecondPg = () => {
  const [clubs, setClubs] = useState({
    technical: [],
    nonTechnical: [],
    sports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        // Replace with your actual backend base URL
        const baseUrl = Base_Url;
        const response = await fetch(`${baseUrl}/clubs`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setClubs(
         data
        );
        
      } catch (err) {
        setError(err.message);
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading clubs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-purple-900 flex items-center justify-center py-8">
      {/* Box container with gradient */}
      <div className="max-w-6xl w-full mx-4 md:mx-8 p-8 rounded-lg shadow-xl bg-gradient-to-br from-purple-500 via-purple-800 to-purple-500">
        {/* Page Header */}
        <header className="py-8 text-center">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-indigo-400 animate-pulse">
            Discover Our Clubs & Activities
          </h1>
          <p className="mt-4 text-gray-300">
            Learn more about our technical, non-technical, and sports clubs!
          </p>
        </header>
        
        {/* Content */}
        <div className="px-8 relative z-10 w-100">
          <Section
            title="Clubs"
            items={clubs}
            color="from-green-400 to-blue-500"
            onItemClick={(id) => navigate(`/club/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondPg;