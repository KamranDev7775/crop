"use client"

import { useState } from "react"
import {
    CheckCircle,
    Circle,
  } from "lucide-react"



export default function ManagementPlan({ tasksData } : { tasksData: any[] }) {

    const initialTasks = tasksData.map((task : any) => {
        return {
            id: task.task_id,
            description: task.description,
            frequency: task.frequency,
            lastCompleted: null as Date | null
        }
    })

    console.log(initialTasks)

  const [tasks, setTasks] = useState(initialTasks)

  const [completedTasks, setCompletedTasks] = useState<number[]>([])

//   useEffect(() => {
//     const today = new Date()
//     const updatedTasks = tasks.map((task) => {
//       if (task.lastCompleted) {
//         const daysSinceLastCompleted = Math.floor((today.getTime() - task.lastCompleted.getTime()) / (1000 * 3600 * 24))
//         if (
//           (task.frequency === "daily" && daysSinceLastCompleted >= 1) ||
//           (task.frequency === "weekly" && daysSinceLastCompleted >= 7) ||
//           (task.frequency === "monthly" && daysSinceLastCompleted >= 30)
//         ) {
//           return { ...task, lastCompleted: null }
//         }
//       }
//       return task
//     })
//   }, []) // Added tasks to the dependency array

  const toggleTask = (taskId: number) => {
      setCompletedTasks((prev) => {
        const newCompletedTasks = prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
  
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, lastCompleted: new Date() as Date | null } : task)))
  
        return newCompletedTasks
      })
    }

  const getTaskStatus = (task: { id: number; description: string; frequency: string; lastCompleted: Date | null }) => {
    if (completedTasks.includes(task.id)) return "completed"
    if (task.lastCompleted === null) return "due"
    return "upcoming"
  }

  const calculateProgress = () => {
    const totalTasks = tasks.length
    const completedCount = completedTasks.length
    return Math.round((completedCount / totalTasks) * 100)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Management Plan</h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => {
          const status = getTaskStatus(task)
          return (
            <div
              key={task.id}
              className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                status === "completed" ? "bg-green-50" : status === "due" ? "bg-yellow-50" : "hover:bg-gray-50"
              }`}
            >
              <button onClick={() => toggleTask(task.id)} className="focus:outline-none">
                {status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </button>
              <span className={`flex-grow ${status === "completed" ? "line-through text-gray-400" : "text-gray-700"}`}>
                {task.description}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {task.frequency}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}