'use client'

import React, { useState, useEffect } from 'react'
import { EventCard } from './components/EventCard'
import { Search, Plus, Users, CalendarDays, Building2 } from 'lucide-react'
import AddClubModal from '../forms/AddClub'
import { Apis } from '../apiserveices/api'
import Loader from '../Loader'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events')
  const [searchQuery, setSearchQuery] = useState('')
  const [popup, setpopup] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const [events, setEvents] = useState([])
  const [eventReqs, setEventReqs] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    setLoading(true)
    try {
      const events = await Apis.fetchEvents()
      setEvents(events.filter(event => event.status === 'accepted'))
      setEventReqs(events.filter(event => event.status === 'pending'))
      
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    // Fetch events from the backend
    fetchData()
  }, [])

  const handleEditEvent = (event) => {
    console.log('Edit event:', event)
  }

  const handleDeleteEvent = (eventId) => {
    console.log('Delete event:', eventId)
  }

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onclose = () => {
    setpopup(false)
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <AddClubModal isOpen={popup} onClose={onclose} />
      <header className="sticky top-0 z-10 border-b border-purple-800/20 bg-[#1A1A1A]">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-white">EventSphere Admin</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Summary Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="rounded-lg bg-[#1E1E1E] p-4 flex items-center space-x-4">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <Building2 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Clubs</p>
                  <p className="text-2xl font-bold text-white">15</p>
                </div>
              </div>
              <div className="rounded-lg bg-[#1E1E1E] p-4 flex items-center space-x-4">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <CalendarDays className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-white">{events?.length}</p>
                </div>
              </div>
              <div className="rounded-lg bg-[#1E1E1E] p-4 flex items-center space-x-4">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <CalendarDays className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-white">{requestCount}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 rounded-lg bg-[#1E1E1E] p-1 mb-6">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeTab === 'events'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
                  }`}
              >
                <CalendarDays className="h-4 w-4" />
                <span>Events</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${activeTab === 'requests'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
                  }`}
              >
                <Users className="h-4 w-4" />
                <span>Event Requests</span>
                {eventReqs.length > 0 && (
                  <span className="ml-2 rounded-full bg-purple-500 px-2 py-1 text-xs font-medium text-white">
                    {eventReqs.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Events or Requests */}
            <div className="mt-6">
              {activeTab === 'events' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents?.map(event => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-[#1E1E1E] p-6">
                  {eventReqs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {eventReqs.map(event => (
                        <EventCard
                          key={event._id}
                          event={event}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                          fetchData={fetchData}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No pending event requests</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}