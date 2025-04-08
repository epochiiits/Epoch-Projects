import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar,
  Clock,
  MapPin,
  Users2,
  Trophy,
  DollarSign,
  Phone,
  User,
  Menu,
  X,
  Plus,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Base_Url } from '../../apiserveices/api';
import Cookies from 'js-cookie';

// Rest of your ClubDashboard.jsx remains the same

// Modify your Club Dashboard function to include club data
function ClubDashboard() {
  const navigate = useNavigate();
  // Add club state
  const [club, setClub] = useState(null);
  
  // Your existing states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showNav, setShowNav] = useState(false);
  // ...rest of your existing states

  // Fetch club data
  useEffect(() => {
    const fetchClubData = async () => {
      const clubId = Cookies.get('club_id');
      if (clubId) {
        try {
          const response = await axios.get(`${Base_Url}/clubs/${clubId}`);
          setClub(response.data);
        } catch (error) {
          console.error('Error fetching club data:', error);
        }
      }
    };

    fetchClubData();
  }, []);

  // Add logout function
  const handleLogout = () => {
    Cookies.remove('club_id');
    Cookies.remove('club_name');
    Cookies.remove('club_email');
    navigate('/club/login');
  };

  // Rest of your component remains the same
  // ...

  // Update the sidebar to show actual club name and handle logout
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out z-30`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">{club?.name || 'Club Dashboard'}</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-4">
            <button 
              onClick={() => setShowEventModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
            
            <Link
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-white-400 hover:bg-slate-600 transition-colors"
              to="/"
            >
              <LogOut className="w-5 h-5" />
              Back
            </Link>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-red-400 hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </nav>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* ... */}
    </div>
  );
}

export default ClubDashboard;