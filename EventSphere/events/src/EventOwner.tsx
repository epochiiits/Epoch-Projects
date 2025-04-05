import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, Phone, DollarSign, Search, Plus, Star } from 'lucide-react';

// Mock data to demonstrate the layout
const events = [
  {
    id: 1,
    title: "Hackathon 2024",
    description: "Join us for a 24-hour coding marathon where teams compete to build innovative solutions. Great prizes, amazing networking opportunities.",
    date: "Mar 15, 2024",
    time: "09:00 AM",
    venue: "Main Auditorium, Tech Campus",
    teamSize: 4,
    prizeMoney: 5000,
    amount: 50,
    type: "Technical",
    isPaid: true,
    participants: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
      },
      {
        name: "Carol Williams",
        email: "carol@example.com",
        profile: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      }
    ],
    ratings: [
      {
        user: "David Chen",
        profile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        comment: "Excellent event organization!",
        createdAt: "2024-01-15"
      },
      {
        user: "Emma Wilson",
        profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        rating: 4,
        comment: "Great experience, but room for improvement in scheduling",
        createdAt: "2024-01-14"
      }
    ],
    contactInfo: "+1 (555) 123-4567"
  }
];

function EventOwner() {
  const [activeTab, setActiveTab] = useState('participants');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-[#333] px-6 py-4">
  <div className="flex justify-between items-center">
    {/* Back Button */}
    <a
      href="/club/Dashboard/clubname"
      className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
    >
      Back
    </a>

    <h1 className="text-2xl font-bold text-white">Club Name</h1>

    <button className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded-md text-sm text-white">
      Log Out
    </button>
  </div>
</header>


      {/* Main Content */}
      <main className="p-6">
        {/* Search and Add Event */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-[#2a2a2a] border border-[#333] rounded-md pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
            />
          </div>
         
        </div>

        {/* Event List */}
        {events.map(event => {
          const averageRating = event.ratings.reduce((acc, curr) => acc + curr.rating, 0) / event.ratings.length;
          
          return (
            <div key={event.id} className="bg-[#2a2a2a] rounded-lg overflow-hidden mb-6">
              {/* Event Header */}
              <div className="p-6 border-b border-[#333]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-semibold">{event.title}</h2>
                      <div className="flex items-center gap-1 bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-purple-400" />
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-purple-500">({event.ratings.length} reviews)</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{event.description}</p>
                    <div className="flex gap-2">
                      <span className="bg-purple-600 text-sm px-3 py-1 rounded-full">
                        {event.type}
                      </span>
                      {event.isPaid && (
                        <span className="bg-emerald-600 text-sm px-3 py-1 rounded-full">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${event.prizeMoney}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.date}
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
                    EventOwner
                 ({event.participants.length})
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
                    {event.participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-[#222] rounded-lg hover:bg-[#333] transition-colors">
                        <img
                          src={participant.profile}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500"
                        />
                        <div>
                          <h4 className="font-medium">{participant.name}</h4>
                          <p className="text-sm text-gray-400">{participant.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'ratings' && (
                  <div className="space-y-4">
                    {event.ratings.map((rating, index) => (
                      <div key={index} className="p-4 bg-[#222] rounded-lg">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={rating.profile}
                            alt={rating.user}
                            className="w-10 h-10 rounded-full object-cover border border-purple-500"
                          />
                          <div>
                            <h4 className="font-medium">{rating.user}</h4>
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default EventOwner;