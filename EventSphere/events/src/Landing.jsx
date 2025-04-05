import React from 'react'
import { motion } from 'framer-motion'

export default function Landing() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/assets/img3.jpg" // Replace with your actual image
        alt="Landing Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-black/40" />


      

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center animate-float">
        <motion.h1
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to the Eventverse
        </motion.h1>
        <motion.p
          className="text-3xl text-green-400 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Join us for unforgettable experiences
        </motion.p>

        {/* Call-to-Action Buttons */}
        <div className="mt-6 flex space-x-4 ">
          <button className="px-6 py-3 bg-pink-500 hover:bg-pink-700 text-white rounded-lg shadow-lg transition-all duration-300">
            Explore Events
          </button>
          <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-all duration-300">
            Join the Fun
          </button>
        </div>


      </div>
    </div>
  )
}