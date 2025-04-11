"use client"

import { useState, useEffect } from "react"

export type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
  userId: string
}

// Helper function to get tasks from localStorage
const getTasks = (userId: string): Task[] => {
  if (typeof window === "undefined") return []

  const tasks = localStorage.getItem("tasks")
  if (!tasks) return []

  const parsedTasks: Task[] = JSON.parse(tasks)
  return parsedTasks.filter((task) => task.userId === userId)
}

// Helper function to save tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

export function useTaskService(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    // Load tasks from localStorage
    const loadedTasks = getTasks(userId)
    setTasks(loadedTasks)
    setIsLoading(false)
  }, [userId])

  const createTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
      userId,
    }

    const allTasks = [...getTasks(""), newTask]
    saveTasks(allTasks)
    setTasks((prev) => [...prev, newTask])
    return newTask
  }

  const updateTask = (id: string, updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>) => {
    const allTasks = getTasks("")
    const updatedTasks = allTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))

    saveTasks(updatedTasks)
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    const allTasks = getTasks("")
    const updatedTasks = allTasks.filter((task) => task.id !== id)

    saveTasks(updatedTasks)
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  }
}
