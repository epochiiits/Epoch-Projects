
import { motion, useAnimation, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react'

// Sample Data
const eventsData = [
  {
    month: 'January',
    events: [
      {
        id: 1,
        title: 'New Year Music Festival',
        date: 'January 1, 2024',
        time: '20:00',
        location: 'Central Park',
        image:
          'https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8l',
        category: 'Music',
      },
      {
        id: 2,
        title: 'Winter Art Exhibition',
        date: 'January 15, 2024',
        time: '10:00',
        location: 'City Gallery',
        image:
          'https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
        category: 'Art',
      },
    ],
  },
  {
    month: 'February',
    events: [
      {
        id: 6,
        title: 'Tech Conference 2024',
        date: 'February 5, 2024',
        time: '09:00',
        location: 'Convention Center',
        image:
          'https://source.unsplash.com/800x600/?technology,conference',
        category: 'Technology',
      },
    ],
  },
  {
    month: 'March',
    events: [
      {
        id: 7,
        title: 'Spring Food Festival',
        date: 'March 10, 2024',
        time: '11:00',
        location: 'Downtown Square',
        image:
          'https://source.unsplash.com/800x600/?food,festival',
        category: 'Food',
      },
    ],
  },
]

export default function ClubPage() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start('show')
    }
  }, [inView, controls])

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src="/banners/epoch.jpeg"
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
              Epoch
            </h1>
            <p className="max-w-xl text-lg text-gray-300">
              AI ML Club
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section (Left-Aligned) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16" ref={ref}>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Upcoming Events
        </h2>

        {/* Timeline Wrapper */}
        <div className="relative flex flex-col items-start">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-blue-600" />

          {eventsData.map((monthGroup, i) => (
            <motion.div
              key={monthGroup.month}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: i * 0.2 },
                },
              }}
              initial="hidden"
              animate={controls}
              className="w-full mb-16"
            >
              {/* Month Label */}
              <div className="sticky top-16 z-10 text-yellow-600 font-bold text-lg sm:text-xl mb-6">
                <span className="py-1 px-3 bg-white/10 rounded-full backdrop-blur-sm">
                  {monthGroup.month} 2024
                </span>
              </div>

              {monthGroup.events.map((event, index) => (
                <div key={event.id} className="relative mb-10">
                  {/* Circle */}
                  <motion.div
                      className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 left-2 top-1/2 -translate-y-1/2"
                      variants={{
                      hidden: { scale: 0 },
                      show: { scale: 1, transition: { duration: 0.4 } },
                       }}
                />

                  {/* Horizontal line from circle to card */}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 w-9 bg-gray-300" />
                  
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
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-black/50 text-white rounded-full backdrop-blur-sm">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg md:text-xl font-semibold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
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
                        <a href={`/event/${event.title}`}>
                          <button className="mt-3 inline-block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-md hover:shadow-lg transition-shadow">
                            Details
                          </button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}