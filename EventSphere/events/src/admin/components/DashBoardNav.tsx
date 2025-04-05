'use client'
import React from 'react'
import { Calendar, ClipboardList } from 'lucide-react'

interface NavProps {
  activeTab: 'events' | 'requests'
  onTabChange: (tab: 'events' | 'requests') => void
  requestCount: number
}

export function DashboardNav({ activeTab, onTabChange, requestCount }: NavProps) {
  return (
    <nav className="flex space-x-1 rounded-lg bg-[#1E1E1E] p-1">
      <button
        onClick={() => onTabChange('events')}
        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${activeTab === 'events' 
            ? 'bg-purple-500 text-white' 
            : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
          }`}
      >
        <Calendar className="h-4 w-4" />
        <span>Events</span>
      </button>
      <button
        onClick={() => onTabChange('requests')}
        className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${activeTab === 'requests' 
            ? 'bg-purple-500 text-white' 
            : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
          }`}
      >
        <ClipboardList className="h-4 w-4" />
        <span>Event Requests</span>
        {requestCount > 0 && (
          <span className="ml-2 rounded-full bg-purple-500 px-2 py-1 text-xs font-medium text-white">
            {requestCount}
          </span>
        )}
      </button>
    </nav>
  )
}

