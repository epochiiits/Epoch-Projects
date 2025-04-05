import React from "react";
import { useNavigate } from "react-router-dom";
import "./index_r.css";
import Section from "./Section";
import { technicalClubs, nonTechnicalClubs, sportsClubs } from "./data/clubData";

const SecondPg = () => {
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
          {/* example usage of the Section component */}
          <Section
            title="Technical Clubs"
            items={technicalClubs }
            color="from-green-400 to-blue-500"
          />
          <Section
            title="Non-Technical Clubs"
            items={ nonTechnicalClubs }
            color="from-purple-400 to-pink-500"
          />
          <Section
            title="Sports"
            items={ sportsClubs }
            color="from-blue-400 to-green-500"
          />
        </div>
      </div>
    </div>
  )
  };
  
   // Reusing Section and Card components from Card.jsx and Section.jsx . Data from clubData.js is used to populate the sections here and then in section.jsx we use this data to populate the cards
  // Ensure you have the data arrays (technicalClubs, nonTechnicalClubs, sportsClubs) in clubData.js

  export default SecondPg;