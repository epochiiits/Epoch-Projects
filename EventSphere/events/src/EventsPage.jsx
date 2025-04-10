import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Phone,
  DollarSign,
  Search,
  Filter,
  LogOut,
  Star,
  Award,
  User,
  Ticket,
} from "lucide-react";
import { Apis } from "./apiserveices/api";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await Apis.fetchEvents();
        const safeEvents = Array.isArray(fetchedEvents) ? fetchedEvents : [];
        setEvents(safeEvents.filter(event => event.status != 'pending'));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Failed to load events");
        setEvents([]);
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // Filter events based on active tab
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (activeTab === "upcoming") {
      return eventDate >= now;
    } else {
      return eventDate < now;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-lg border-b border-white/10 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold ">EventSphere</div>
          <button className="px-4 py-2 text-white hover:text-purple-400 flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.3,
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 bg-clip-text text-transparent">
            Discover Events
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join exciting events, competitions, and festivals happening around
            your campus
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto backdrop-blur-lg bg-white/5 p-4 rounded-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-10 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <select className="w-full md:w-auto px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>
      </section>

      {/* Events Tabs and Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full max-w-md">
            <div className="flex bg-white/5 rounded-md p-1">
              <button
                className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 ease-in-out ${
                  activeTab === "upcoming"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Events
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 ease-in-out ${
                  activeTab === "past"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past Events
              </button>
            </div>
          </div>
          <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition-colors duration-200 ease-in-out">
            <Filter className="w-4 h-4 inline-block mr-2" />
            Filters
          </button>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No {activeTab} events found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id || event.id || Math.random()}
                event={event}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EventCard({ event }) {
  if (!event) return null;

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const {
    _id,
    title = "Untitled Event",
    description = "No description available",
    date,
    time = "TBA",
    venue = "Location not specified",
    isTeamEvent = false,
    teamSize = 1,
    contactInfo = "Contact not available",
    isPaid = false,
    amount = 0,
    prizeMoney = 0,
    category = "General",
    imageUrl = "/placeholder.svg",
    event_type,
    participants = [],
    ratings = [],
  } = event;

  // Determine if event is upcoming or past
  const eventDate = new Date(date);
  const now = new Date();
  const isUpcoming = eventDate >= now;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600/80 text-white">
            {category}
          </span>
          {event_type && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600/80 text-white">
              {event_type}
            </span>
          )}
          {isPaid && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-600/80 text-white flex items-center">
              <Ticket className="w-3 h-3 mr-1" /> ${amount}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        {prizeMoney > 0 && (
          <div className="flex items-center gap-2 text-yellow-500 mb-4">
            <Award className="w-4 h-4" />
            <span className="font-bold">Prize pool: ${prizeMoney}</span>
          </div>
        )}
        
        <div className="space-y-2 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {isTeamEvent ? `Team (${teamSize} members)` : "Individual"}
            </span>
          </div>
          {participants.length > 0 && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{participants.length} registered</span>
            </div>
          )}
          {ratings.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>
                {(
                  ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                  ratings.length
                ).toFixed(1)}{" "}
                ({ratings.length} reviews)
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Phone className="w-4 h-4" />
          <span>{contactInfo}</span>
        </div>
        <button>
        <a
          href={`/event/${_id}`}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
           
               "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"}`}
          disabled={status === "past"}
        >
            Register Now
          </a>
        </button>
      </div>
    </div>
  );
}