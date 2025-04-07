import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Base_Url } from '../../apiserveices/api';

// This component checks if the user is authenticated as a club
// If authenticated, it renders the children components
// If not authenticated, it redirects to the login page

const ClubAuthWrapper = ({ children }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const verifyClub = async () => {
      const clubId = Cookies.get('club_id');
      
      // If no club ID in cookies, redirect to login
      if (!clubId) {
        setLoading(false);
        return;
      }
      
      // If club ID exists but doesn't match the ID in URL, redirect to the correct dashboard
      if (id && clubId !== id) {
        setLoading(false);
        return;
      }
      
      try {
        // Verify with backend that this is a valid club
        const response = await axios.get(`${Base_Url}/clubs/${clubId}`);
        if (response.data) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid cookies
        Cookies.remove('club_id');
        Cookies.remove('club_name');
        Cookies.remove('club_email');
      } finally {
        setLoading(false);
      }
    };
    
    verifyClub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!authenticated) {
    return <Navigate to="/club/login" />;
  }
  
  return <>{children}</>;
};

export default ClubAuthWrapper;