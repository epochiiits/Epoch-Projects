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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Base_Url } from './apiserveices/api';
import Cookies from "js-cookie";
import useAuth from './hooks/useAuth';

// Club stats component
const ClubStats = ({ events }) => {
  const stats = [
    { label: "Total Events", value: events?.length || 0 },
    { label: "Upcoming Events", value: events?.filter(e => new Date(e.date) > new Date()).length || 0 },
    { label: "Past Events", value: events?.filter(e => new Date(e.date) <= new Date()).length || 0 }
  ];

  return (
    <div className="flex gap-8 mt-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

function ClubDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [clubData, setClubData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showNav, setShowNav] = useState(false);
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    event_type: 'Technical',
    description: '',
    date: '',
    time: '',
    venue: '',
    isTeamEvent: false,
    teamSize: 1,
    prizeMoney: 0,
    isPaid: false,
    amount: 0,
    contactInfo: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchClubData = async () => {
      const clubId = Cookies.get('club');
      if (clubId) {
        try {
          setIsLoading(true);
          const response = await axios.get(`${Base_Url}/clubs/${clubId}`);
          setClubData(response.data);
          console.log("Club data:", response.data);
        } catch (error) {
          console.error('Error fetching club data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClubData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('club');
    Cookies.remove('club_name');
    Cookies.remove('club_email');
    navigate('/club/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowNav(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const groupEventsByStatus = () => {
    if (!clubData?.events) return { upcoming: [], past: [] };
    
    const now = new Date();
    return {
      upcoming: clubData.events.filter(event => new Date(event.date) > now),
      past: clubData.events.filter(event => new Date(event.date) <= now)
    };
  };

  const groupedEvents = groupEventsByStatus();

  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    }, {});

    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return grouped;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setEventForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      event_type: 'Technical',
      description: '',
      date: '',
      time: '',
      venue: '',
      isTeamEvent: false,
      teamSize: 1,
      prizeMoney: 0,
      isPaid: false,
      amount: 0,
      contactInfo: '',
      image: null
    });
    setImagePreview('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.date || 
        !eventForm.time || !eventForm.venue || !eventForm.contactInfo || !eventForm.image) {
      setErrorMessage('Please fill all required fields and upload an image');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const eventData = {
        club_id: clubData.club._id,
        title: eventForm.title,
        description: eventForm.description, 
        image: eventForm.image,
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue,
        isTeamEvent: eventForm.isTeamEvent,
        teamSize: eventForm.isTeamEvent ? eventForm.teamSize : 1,
        prizeMoney: eventForm.prizeMoney || 0,
        isPaid: eventForm.isPaid,
        amount: eventForm.isPaid ? eventForm.amount : 0,
        event_type: eventForm.event_type,
        contactInfo: eventForm.contactInfo
      };
      
      console.log('Sending event data:', eventData);
      
      const response = await axios.post(Base_Url+'/events', eventData, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxContentLength: 50 * 1024 * 1024,
        maxBodyLength: 50 * 1024 * 1024,
      });
      
      console.log('Event created:', response.data);
      
      // Refresh club data to include the new event
      const updatedResponse = await axios.get(`${Base_Url}/clubs/${clubData.club._id}`);
      setClubData(updatedResponse.data);
      
      setShowEventModal(false);
      resetForm();
      
    } catch (error) {
      console.error('Error creating event:', error);
      
      if (error.response) {
        console.error('Server response error:', error.response.data);
        setErrorMessage(`Failed to create event: ${error.response.data.error || 'Server error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrorMessage('Failed to create event: No response from server');
      } else {
        setErrorMessage(`Failed to create event: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEventCard = (event) => (
   <a href={`/club/event/${event._id}`} className="block"> 
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] max-w-2xl">
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`px-3 py-1 text-sm rounded-full bg-purple-600 text-white`}>
            {event.event_type}
          </span>
          {event.isPaid && (
            <span className="px-3 py-1 text-sm rounded-full bg-emerald-600 text-white">
              Paid
            </span>
          )}
        </div>
        {event.prizeMoney > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 bg-yellow-500 text-black font-semibold rounded-full text-sm flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              ${event.prizeMoney}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            {event.time}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            {event.venue}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users2 className="w-4 h-4" />
            Team: {event.teamSize}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Phone className="w-4 h-4" />
            {event.contactInfo}
          </div>
          {event.isPaid && (
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-4 h-4" />
              ${event.amount}
            </div>
          )}
        </div>

        {event.participants && event.participants.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {event.participants.slice(0, 3).map((p, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm border-2 border-[#1a1a1a]">
                  <User className="w-4 h-4" />
                </div>
              ))}
              {event.participants.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm border-2 border-[#1a1a1a]">
                  +{event.participants.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-400">
              {event.participants.length} Registered
            </span>
          </div>
        )}
      </div>
    </div>
    </a>
  );

  useAuth({userType:'club'});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading club data...</p>
        </div>
      </div>
    );
  }

  if (!clubData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Failed to load club data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out z-30`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">{clubData.club.name}</h2>
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

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 bg-[#1a1a1a] border-b border-[#333] transform transition-transform duration-300 z-20 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="px-6 py-4 flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Events Dashboard</h1>
          </div>
          {/* Tabs */}
          <div className="px-6 border-t border-[#333]">
            <div className="flex gap-6">
              {(['upcoming', 'past']).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 ${
                    activeTab === tab
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="relative h-[500px]">
          <img 
            src={clubData.club.banner_url || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000"}
            alt="Club Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                {clubData.club.logo_url && (
                  <img 
                    src={clubData.club.logo_url} 
                    alt="Club Logo" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                )}
                <h1 className="text-5xl font-bold">{clubData.club.name}</h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl">
                {clubData.club.description || "Club description goes here..."}
              </p>
              <ClubStats events={clubData.events} />
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {clubData.events && clubData.events.length > 0 ? (
            Object.entries(groupEventsByMonth(groupedEvents[activeTab])).map(([month, monthEvents]) => (
              <div key={month} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">{month}</h2>
                <div className="space-y-6">
                  {monthEvents.map((event) => (
                    <div key={event._id}>
                      {renderEventCard(event)}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No {activeTab} events found</p>
              <button
                onClick={() => setShowEventModal(true)}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Create Your First Event
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Event</h2>
                <button onClick={() => {setShowEventModal(false); resetForm();}} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {errorMessage && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  
                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Type</label>
                    <select
                      name="event_type"
                      value={eventForm.event_type}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Competition">Competition</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={eventForm.time}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  
                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Venue *</label>
                    <input
                      type="text"
                      name="venue"
                      value={eventForm.venue}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  
                  {/* Contact Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Info *</label>
                    <input
                      type="text"
                      name="contactInfo"
                      value={eventForm.contactInfo}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                      placeholder="Phone number or email"
                    />
                  </div>
                  
                  {/* Team Event Toggle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isTeamEvent"
                        name="isTeamEvent"
                        checked={eventForm.isTeamEvent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-[#2a2a2a] border-[#3a3a3a] rounded"
                      />
                      <label htmlFor="isTeamEvent" className="text-sm font-medium text-gray-300">Team Event</label>
                    </div>
                  </div>
                  
                  {/* Team Size (conditional) */}
                  {eventForm.isTeamEvent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Team Size</label>
                      <input
                        type="number"
                        name="teamSize"
                        value={eventForm.teamSize}
                        onChange={handleInputChange}
                        min="2"
                        max="20"
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  )}
                  
                  {/* Prize Money */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Prize Money ($)</label>
                    <input
                      type="number"
                      name="prizeMoney"
                      value={eventForm.prizeMoney}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  
                  {/* Paid Event Toggle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        name="isPaid"
                        checked={eventForm.isPaid}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-[#2a2a2a] border-[#3a3a3a] rounded"
                      />
                      <label htmlFor="isPaid" className="text-sm font-medium text-gray-300">Paid Event</label>
                    </div>
                  </div>
                  
                  {/* Amount (conditional) */}
                  {eventForm.isPaid && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                      <input
                        type="number"
                        name="amount"
                        value={eventForm.amount}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={eventForm.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      required
                    ></textarea>
                  </div>
                  
                  {/* Image Upload */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Image *</label>
                    <div className="flex flex-col gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Event Preview" 
                            className="h-48 w-auto object-cover rounded-lg" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {setShowEventModal(false); resetForm();}}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubDashboard;