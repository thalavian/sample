"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { type Task, useTaskService } from "@/lib/task-service"
import { PlusIcon } from "lucide-react"
import { type FormEvent, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTaskService(user?.id || "")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const { toast } = useToast()

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createTask(title, description)
    setTitle("")
    setDescription("")
    setIsCreateDialogOpen(false)

    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    })
  }

  const handleUpdateTask = (e: FormEvent) => {
    e.preventDefault()
    if (!currentTask || !title.trim()) return

    updateTask(currentTask.id, { title, description })
    setIsEditDialogOpen(false)

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  const handleDeleteTask = (id: string) => {
    deleteTask(id)

    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    })
  }

  const openEditDialog = (task: Task) => {
    setCurrentTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setIsEditDialogOpen(true)
  }

  const handleStatusChange = (id: string, status: "pending" | "in-progress" | "completed") => {
    updateTask(id, { status })

    toast({
      title: "Status updated",
      description: `Task status changed to ${status}.`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Tasks</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateTask}>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your list.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Task description"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
            <p className="text-muted-foreground mb-6">Create your first task to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription>Created on {new Date(task.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{task.description || "No description provided"}</p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Status:</span>
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        handleStatusChange(task.id, value as "pending" | "in-progress" | "completed")
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => openEditDialog(task)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <form onSubmit={handleUpdateTask}>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Make changes to your task.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
