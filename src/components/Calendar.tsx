'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/supabase-client'
import { getObservationForms, getJournalEntries } from '@/lib/actions'

interface CalendarEvent {
  id: string
  type: 'observation' | 'journal'
  title: string
  date: Date
  href: string
  color: string
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Fetch observations and journal entries
      const [observations, journalEntries] = await Promise.all([
        getObservationForms(user.id),
        getJournalEntries(user.id)
      ])

      // Combine and format events
      const calendarEvents: CalendarEvent[] = []

      // Add observations
      observations.forEach((obs: any) => {
        calendarEvents.push({
          id: obs.id,
          type: 'observation',
          title: `${obs.school} - ${obs.grade}`,
          date: new Date(obs.created_at),
          href: `/observations/${obs.id}`,
          color: 'blue'
        })
      })

      // Add journal entries
      journalEntries.forEach((entry: any) => {
        calendarEvents.push({
          id: entry.id,
          type: 'journal',
          title: `Journal Eintrag`,
          date: new Date(entry.entry_date),
          href: `/journal/${entry.id}`,
          color: 'green'
        })
      })

      setEvents(calendarEvents)
    } catch (error) {
      console.error('Error loading calendar events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/observations/new"
              className="group flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neue Beobachtung
            </Link>
            <Link
              href="/journal/new"
              className="group flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Eintrag
            </Link>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDate(day) : []
          const isToday = day && day.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 rounded-xl border ${
                day 
                  ? isToday 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  : 'bg-transparent border-transparent'
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <Link
                        key={event.id}
                        href={event.href}
                        className={`block text-xs px-2 py-1 rounded-lg truncate transition-colors duration-200 ${
                          event.color === 'blue'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {event.title}
                      </Link>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} weitere
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
          <span className="text-gray-600">Beobachtungsbögen</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
          <span className="text-gray-600">Journal Einträge</span>
        </div>
      </div>
    </div>
  )
}
