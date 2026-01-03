"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Clock, Trash2, Check } from "lucide-react"

interface Reminder {
  id: number
  crop: string
  task: string
  date: string
  status: 'upcoming' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
}

export default function PlantingReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newReminder, setNewReminder] = useState({ 
    crop: "", 
    task: "", 
    date: "", 
    priority: "medium" as const 
  })

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('plantingReminders')
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders)
      setReminders(updateReminderStatuses(parsed))
    } else {
      // Default reminders
      const defaultReminders: Reminder[] = [
        { 
          id: 1, 
          crop: "Rice", 
          task: "Prepare seedbed", 
          date: getDateString(2), 
          status: "upcoming", 
          priority: "high" 
        },
        { 
          id: 2, 
          crop: "Wheat", 
          task: "Sowing", 
          date: getDateString(7), 
          status: "upcoming", 
          priority: "medium" 
        }
      ]
      setReminders(defaultReminders)
      localStorage.setItem('plantingReminders', JSON.stringify(defaultReminders))
    }

    // Set up daily status check
    const interval = setInterval(() => {
      setReminders(prev => {
        const updated = updateReminderStatuses(prev)
        localStorage.setItem('plantingReminders', JSON.stringify(updated))
        return updated
      })
    }, 86400000) // Check daily

    // Check for due reminders and send notifications
    checkDueReminders()

    return () => clearInterval(interval)
  }, [])

  const getDateString = (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString().split('T')[0]
  }

  const updateReminderStatuses = (reminderList: Reminder[]): Reminder[] => {
    const today = new Date().toISOString().split('T')[0]
    
    return reminderList.map(reminder => {
      if (reminder.status === 'completed') return reminder
      
      if (reminder.date < today) {
        return { ...reminder, status: 'overdue' as const }
      } else {
        return { ...reminder, status: 'upcoming' as const }
      }
    })
  }

  const checkDueReminders = () => {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = getDateString(1)
    
    reminders.forEach(reminder => {
      if (reminder.date === today || reminder.date === tomorrow) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Farming Reminder: ${reminder.crop}`, {
            body: `${reminder.task} is ${reminder.date === today ? 'due today' : 'due tomorrow'}`,
            icon: '/favicon.ico'
          })
        }
      }
    })
  }

  const addReminder = () => {
    if (newReminder.crop && newReminder.task && newReminder.date) {
      const reminder: Reminder = {
        id: Date.now(),
        ...newReminder,
        status: 'upcoming'
      }
      
      const updatedReminders = [...reminders, reminder]
      setReminders(updatedReminders)
      localStorage.setItem('plantingReminders', JSON.stringify(updatedReminders))
      
      setNewReminder({ crop: "", task: "", date: "", priority: "medium" })
      setShowForm(false)
    }
  }

  const deleteReminder = (id: number) => {
    const updatedReminders = reminders.filter(r => r.id !== id)
    setReminders(updatedReminders)
    localStorage.setItem('plantingReminders', JSON.stringify(updatedReminders))
  }

  const toggleComplete = (id: number) => {
    const updatedReminders = reminders.map(r => 
      r.id === id 
        ? { ...r, status: r.status === 'completed' ? 'upcoming' : 'completed' as const }
        : r
    )
    setReminders(updatedReminders)
    localStorage.setItem('plantingReminders', JSON.stringify(updatedReminders))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      default: return 'border-l-green-500'
    }
  }

  const sortedReminders = [...reminders].sort((a, b) => {
    // Sort by status (overdue first, then upcoming, then completed)
    const statusOrder = { overdue: 0, upcoming: 1, completed: 2 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    // Then by date
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold flex items-center text-gray-800">
          <Calendar className="mr-2 text-gray-700" /> Planting Schedule
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {reminders.filter(r => r.status !== 'completed').length} active
          </span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center text-sm font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Crop name"
              value={newReminder.crop}
              onChange={(e) => setNewReminder({...newReminder, crop: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Task (e.g., Sowing, Harvesting)"
              value={newReminder.task}
              onChange={(e) => setNewReminder({...newReminder, task: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="date"
              value={newReminder.date}
              onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
            <select
              value={newReminder.priority}
              onChange={(e) => setNewReminder({...newReminder, priority: e.target.value as 'low' | 'medium' | 'high'})}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="low" className="text-gray-800">Low Priority</option>
              <option value="medium" className="text-gray-800">Medium Priority</option>
              <option value="high" className="text-gray-800">High Priority</option>
            </select>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={addReminder} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex-1 sm:flex-none"
            >
              Save Reminder
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition-colors flex-1 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedReminders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reminders set</p>
        ) : (
          sortedReminders.map((reminder) => (
            <div key={reminder.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 ${getPriorityColor(reminder.priority)} gap-3`}>
              <div className="flex items-center flex-1 w-full">
                <button
                  onClick={() => toggleComplete(reminder.id)}
                  className={`mr-3 p-2 rounded-lg transition-colors ${
                    reminder.status === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : 'border-2 border-gray-300 hover:border-green-600 bg-white'
                  }`}
                >
                  {reminder.status === 'completed' && <Check className="h-4 w-4" />}
                </button>
                <Clock className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-800 break-words ${
                    reminder.status === 'completed' ? 'line-through text-gray-600' : ''
                  }`}>
                    {reminder.crop} - {reminder.task}
                  </p>
                  <p className="text-sm text-gray-700">
                    {new Date(reminder.date).toLocaleDateString()} 
                    <span className="ml-2 text-xs text-gray-600">
                      ({Math.ceil((new Date(reminder.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days)
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reminder.status)}`}>
                  {reminder.status}
                </span>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}