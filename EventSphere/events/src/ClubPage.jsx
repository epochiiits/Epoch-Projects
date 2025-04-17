import { motion, useAnimation, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Base_Url } from './apiserveices/api'

export default function ClubPage() {
  const { id } = useParams()
  const [clubData, setClubData] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const upcomingRef = useRef(null)
  const pastRef = useRef(null)
  const upcomingInView = useInView(upcomingRef, { once: true })
  const pastInView = useInView(pastRef, { once: true })
  const upcomingControls = useAnimation()
  const pastControls = useAnimation()

  useEffect(() => {
    if (upcomingInView) {
      upcomingControls.start('show')
    }
    if (pastInView) {
      pastControls.start('show')
    }
  }, [upcomingInView, pastInView, upcomingControls, pastControls])

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const response = await axios.get(Base_Url + `/club/${id}`)
        setClubData(response.data.club)
        
        // Filter only approved events
        const approvedEvents = response.data.events.filter(event => event.status === 'accepted')
        console.log(approvedEvents)
        // Get current date for comparison
        const currentDate = new Date()
        
        // Separate upcoming and past events
        const upcoming = approvedEvents.filter(event => new Date(event.date) >= currentDate)
        const past = approvedEvents.filter(event => new Date(event.date) < currentDate)
        
        // Format both sets of events
        setUpcomingEvents(formatEventsByMonth(upcoming))
        setPastEvents(formatEventsByMonth(past, true)) // true for reverse sort
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClubData()
  }, [id])

  // Function to format events by month
  const formatEventsByMonth = (events, reverseSort = false) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const eventsByMonth = {}
    
    events.forEach(event => {
      const eventDate = new Date(event.date)
      const month = months[eventDate.getMonth()]
      const year = eventDate.getFullYear()
      const formattedDate = `${month} ${eventDate.getDate()}, ${year}`
      const monthYearKey = `${month}-${year}`
      
      if (!eventsByMonth[monthYearKey]) {
        eventsByMonth[monthYearKey] = {
          month,
          year,
          events: []
        }
      }
      
      eventsByMonth[monthYearKey].events.push({
        id: event._id,
        title: event.title,
        date: formattedDate,
        time: event.time,
        location: event.venue,
        image: event.imageUrl,
        category: event.category,
        description: event.description,
        rawDate: eventDate
      })
    })
    
    // Convert to array and sort
    let result = Object.values(eventsByMonth)
    
    // Sort by date (newest first for past events, oldest first for upcoming)
    result.sort((a, b) => {
      const dateA = a.events[0].rawDate
      const dateB = b.events[0].rawDate
      return reverseSort ? dateB - dateA : dateA - dateB
    })
    
    return result
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  if (!clubData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Club not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src={clubData.banner_url}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-white">
              {clubData.name}
            </h1>
            <p className="max-w-xl text-lg text-gray-300">
              AI ML Club
            </p>
          </motion.div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16" ref={upcomingRef}>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Upcoming Events
        </h2>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No upcoming events</p>
          </div>
        ) : (
          <div className="relative flex flex-col items-start">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-blue-600" />

            {upcomingEvents.map((monthGroup, i) => (
              <motion.div
                key={`upcoming-${monthGroup.month}-${monthGroup.year}`}
              
                // animate={upcomingControls}
                className="w-full mb-16"
              >
                {/* Month Label */}
                <div className="sticky top-16 z-10 text-yellow-600 font-bold text-lg sm:text-xl mb-6">
                  <span className="py-1 px-3 bg-white/10 rounded-full backdrop-blur-sm">
                    {monthGroup.month} {monthGroup.year}
                  </span>
                </div>

                {monthGroup.events.map((event, index) => (
                  <EventCard 
                    key={`upcoming-${event.id}`} 
                    event={event} 
                    index={index} 
                    controls={upcomingControls} 
                  />
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16" ref={pastRef}>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-purple-400 via-pink-400 to-red-500 bg-clip-text text-transparent">
          Past Events
        </h2>

        {pastEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No past events</p>
          </div>
        ) : (
          <div className="relative flex flex-col items-start">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />

            {pastEvents.map((monthGroup, i) => (
              <motion.div
                key={`past-${monthGroup.month}-${monthGroup.year}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: i * 0.2 },
                  },
                }}
                initial="hidden"
                animate={pastControls}
                className="w-full mb-16"
              >
                {/* Month Label */}
                <div className="sticky top-16 z-10 text-gray-400 font-bold text-lg sm:text-xl mb-6">
                  <span className="py-1 px-3 bg-white/10 rounded-full backdrop-blur-sm">
                    {monthGroup.month} {monthGroup.year}
                  </span>
                </div>

                {monthGroup.events.map((event, index) => (
                  <EventCard 
                    key={`past-${event.id}`} 
                    event={event} 
                    index={index} 
                    controls={pastControls} 
                    isPast={true}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable Event Card Component
function EventCard({ event, index, controls, isPast = false }) {
  return (
    <div className="relative mb-10">
      {/* Circle */}
      <motion.div
        className={`absolute w-4 h-4 rounded-full left-2 top-1/2 -translate-y-1/2 ${
          isPast ? 'bg-gray-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'
        }`}
        variants={{
          hidden: { scale: 0 },
          show: { scale: 1, transition: { duration: 0.4 } },
        }}
      />

      {/* Horizontal line from circle to card */}
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 h-0.5 w-9 ${
        isPast ? 'bg-gray-500/50' : 'bg-gray-300'
      }`} />
      
      {/* Card */}
      <motion.div
        className="ml-14 mt-2 w-full max-w-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, delay: index * 0.1 },
          },
        }}
      >
        <div className={`bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
          isPast ? 'opacity-80 hover:opacity-100' : ''
        }`}>
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-3 right-3">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                isPast 
                  ? 'bg-gray-700/50 text-gray-300' 
                  : 'bg-black/50 text-white'
              }`}>
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className={`text-lg md:text-xl font-semibold mb-2 bg-clip-text text-transparent ${
              isPast
                ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                : 'bg-gradient-to-r from-green-400 to-blue-500'
            }`}>
              {event.title}
            </h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {event.description}
            </p>
            <div className={`space-y-2 text-sm ${
              isPast ? 'text-gray-400' : 'text-gray-300'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            {/* Details Button */}
            <a href={`/event/${event.id}`}>
              <button className={`mt-3 inline-block px-4 py-2 text-sm font-medium text-white rounded-full shadow-md hover:shadow-lg transition-shadow ${
                isPast
                  ? 'bg-gradient-to-r from-gray-600 to-gray-800'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                {isPast ? 'View Details' : 'Details'}
              </button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}