import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, MapPin, Phone, DollarSign, Search, Plus, Star } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_Url } from './apiserveices/api';
import useAuth from './hooks/useAuth';
import Cookies from 'js-cookie'
function EventOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setleads] = useState(null)
  const [activeTab, setActiveTab] = useState('participants');
  
  useEffect(() => {

    const token = Cookies.get('club')
    if (!token) {
      navigate('/club/login');
    }
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${Base_Url}/clubs/event/${id}`);
        setEvent(response.data.event);
        setleads(response.data.leads) 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-lg">Event not found</div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Calculate average rating
  const averageRating = event.ratings.length > 0 
    ? event.ratings.reduce((acc, curr) => acc + curr.rating, 0) / event.ratings.length 
    : 0;

  // Format participants data
  const participants = event.participants.flatMap(participant => 
    participant.registrationData.members.map(member => ({
      name: member.name || 'Participant',
      email: member.email || '',
      profile: 'https://via.placeholder.com/150' // Placeholder for profile picture
    }))
  );

  // Add lead to participants if not already included
  if (event.leads && leads.length > 0) {
    const lead = event.leads[0];
    if (!participants.some(p => p.email === lead.email)) {
      participants.unshift({
        name: lead.name,
        email: lead.email,
        profile: lead.profilePic
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-[#333] px-6 py-4">
          <h1 className=" text-center text-2xl font-bold text-white">{event.title}</h1>
      </header> 

      {/* Main Content */}
      <main className="p-6">
        {/* Search and Add Event */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full bg-[#2a2a2a] border border-[#333] rounded-md pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden mb-6">
          {/* Event Header */}
          <div className="p-6 border-b border-[#333]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  {event.ratings.length > 0 && (
                    <div className="flex items-center gap-1 bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-purple-400" />
                      <span>{averageRating.toFixed(1)}</span>
                      <span className="text-sm text-purple-500">({event.ratings.length} reviews)</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="flex gap-2">
                  <span className="bg-purple-600 text-sm px-3 py-1 rounded-full">
                    {event.event_type}
                  </span>
                  {event.isPaid && (
                    <span className="bg-emerald-600 text-sm px-3 py-1 rounded-full">
                      Paid (${event.amount})
                    </span>
                  )}
                  {event.isTeamEvent && (
                    <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">
                      Team ({event.teamSize} members)
                    </span>
                  )}
                </div>
              </div>
              {event.prizeMoney > 0 && (
                <div className="bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${event.prizeMoney}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.venue}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {event.contactInfo}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#333]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('participants')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'participants'
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Participants ({participants.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'ratings'
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Ratings ({event.ratings.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'participants' && (
              <div className="space-y-4">
                {event.participants.map((registration, index) => (
                  <div key={index} className="p-4 bg-[#222] rounded-lg">
                    {/* Team Info */}
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={
                          leads.find((lead) => lead._id === registration.lead)?.profilePic ||
                          'https://via.placeholder.com/150'
                        }
                        alt="Lead Profile"
                        className="w-10 h-10 rounded-full object-cover border border-purple-500"
                      />
                      <div>
                        <h4 className="font-medium">
                          {registration.registrationData.teamName || 'Unnamed Team'}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Lead: {leads.find((lead) => lead._id === registration.lead)?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Dropdown for Participants */}
                    <details className="bg-[#333] rounded-lg p-3">
                      <summary className="cursor-pointer text-gray-300">
                        View Participants ({registration.registrationData.members.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {registration.registrationData.members.map((member, memberIndex) => (
                          <div
                            key={memberIndex}
                            className="flex items-center justify-between text-sm text-gray-400"
                          >
                            <span>{member.name || 'Participant'}</span>
                            <span>{member.email || 'No Email'}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="space-y-4">
                {event.ratings.length > 0 ? (
                  event.ratings.map((rating, index) => (
                    <div key={index} className="p-4 bg-[#222] rounded-lg">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src="https://via.placeholder.com/150"
                          alt={rating.name}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500"
                        />
                        <div>
                          <h4 className="font-medium">{rating.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'fill-gray-600 text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400">{rating.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No ratings yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventOwner;