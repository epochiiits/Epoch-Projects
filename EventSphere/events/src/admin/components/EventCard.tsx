import React from 'react'
import { Calendar, MapPin, Users, DollarSign, Star, Clock, Trophy, Phone } from 'lucide-react'
import { Apis } from '../../apiserveices/api'

export function EventCard({ event, onEdit, onDelete , fetchData }) {
  const averageRating = event.ratings?.length
    ? (event.ratings.reduce((acc, curr) => acc + curr.rating, 0) / event.ratings.length).toFixed(1)
    : 0

  const handleAcceptEvent = async () => {
    try {
      const response = await Apis.acceptEvent(event._id) // Assuming `acceptEvent` is defined in your API services
      console.log('Event accepted:', response)
      fetchData() // Refresh the data after accepting the event
      alert('Event has been accepted successfully!')
    } catch (error) {
      console.error('Error accepting event:', error)
      alert('Failed to accept the event.')
    }
  }

  return (
    <a href={"/participants/"+event._id} >
    <div className="bg-[#1E1E1E] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="relative">
        <img
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {event.category}
          </span>
          {event.isPaid && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Paid
            </span>
          )}
        </div>
        {event.prizeMoney > 0 && (
          <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            ${event.prizeMoney}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{event.title}</h3>
          <div className="flex -space-x-2">
            {event.clubs?.map((club, index) => (
              <div key={index} className="relative group">
                <img
                  src={club.logo || "/placeholder.svg"}
                  alt={club.name}
                  className="w-8 h-8 rounded-full border-2 border-[#1E1E1E] object-cover"
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {club.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-gray-400">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-xs">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center text-gray-400">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-xs">{event.time}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-xs">{event.venue}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <Users className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-xs">
              {event.isTeamEvent ? `Team: ${event.teamSize}` : 'Individual'}
            </span>
          </div>

          {event.isPaid && (
            <div className="flex items-center text-gray-400">
              <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-xs">${event.amount}</span>
            </div>
          )}

          <div className="flex items-center text-gray-400">
            <Phone className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-xs">{event.contactInfo}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-purple-500/10">
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(event._id)}
              className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
          <button
            onClick={handleAcceptEvent}
            className="px-3 py-1 text-sm bg-green-500/10 text-green-400 rounded-md hover:bg-green-500/20 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
    </a>
  )
}