'use client'

import { useEffect, useRef, useState } from 'react'
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  mapTaskResponseToTask,
  mapTaskToTaskResponse,
  PRIORITY_TO_NUMBER,
  Task,
  TaskResponse,
  Tasks,
  TaskStatus,
} from './types'
import axios from 'axios'
import { post, del, patch, put } from '@/Api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

type UseKanbanBoardOptions = {
  onMovedToDone?: (taskId: string) => void | Promise<void>
}

export const useKanbanBoard = (initialTasks: Tasks, options?: UseKanbanBoardOptions) => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { projectId } = useParams<{ projectId: string }>()
  const dragStartContainerRef = useRef<TaskStatus | null>(null)
  const dragStartTasksSnapshotRef = useRef<Tasks | null>(null)

  // Add this useEffect to update tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const findContainer = (id: string) => {
    if (id in tasks) return id as keyof Tasks
    for (const [container, containerTasks] of Object.entries(tasks)) {
      if (containerTasks.some((task: { id: string }) => task.id === id)) {
        return container as keyof Tasks
      }
    }
    return null
  }

  const handleAddTask = async (columnId: TaskStatus, task: Task) => {
    try {
      const mappedTask = mapTaskToTaskResponse(task)
      const res = await post<TaskResponse, TaskResponse>(
        `/api/project/${projectId}/tasks/create/`,
        mappedTask
      )
      const createdTask = {
        ...mapTaskResponseToTask(res),
        // ensure UI shows assignees immediately after submit
        assignees: task.assignees,
        assigneesName: task.assigneesName,
      }
      console.log('Created Task:', createdTask)

      console.log(task.assignees)
      if (task.assignees.length > 0) {
        for (const assignee of task.assignees) {
          // Assuming there's an API endpoint to assign users to tasks
          await post(`/api/project/${projectId}/tasks/${createdTask.id}/assign/`, {
            project_member_id: assignee,
          })
          console.log(`Assigned ${assignee} to task ${createdTask.id}`)
        }
      }
      // update state without refetch
      setTasks((prev) => ({
        ...prev,
        [columnId]: [...prev[columnId], createdTask],
      }))
      toast.success('Task added\nIt appears on your board and is saved for the team.')
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t add task\nCheck your connection and try again.')
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    let previousAssignees: string[] = []
    for (const column of Object.keys(tasks) as (keyof Tasks)[]) {
      const found = tasks[column].find((t) => t.id === updatedTask.id)
      if (found) {
        previousAssignees = found.assignees.map(String)
        break
      }
    }
    const nextAssignees = updatedTask.assignees.map(String)
    const prevSet = new Set(previousAssignees)
    const nextSet = new Set(nextAssignees)

    let putResponse: TaskResponse
    try {
      const mappedTask = mapTaskToTaskResponse(updatedTask)
      putResponse = await put<Record<string, unknown>, TaskResponse>(
        `/api/project/${projectId}/tasks/${updatedTask.id}/update/`,
        {
          task_name: mappedTask.task_name,
          priority: PRIORITY_TO_NUMBER[updatedTask.priority],
          description: mappedTask.description,
          deadline: mappedTask.deadline,
          status: mappedTask.status,
        }
      )
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t update task\nRefresh and try again if the problem continues.')
      return
    }

    try {
      for (const id of previousAssignees) {
        if (!nextSet.has(id)) {
          try {
            await del(`/api/project/${projectId}/tasks/${updatedTask.id}/unassign/`, {
              project_member_id: id,
            })
          } catch (e) {
            // Already removed on server (stale UI) — continue syncing the rest
            if (!axios.isAxiosError(e) || e.response?.status !== 404) throw e
          }
        }
      }
      for (const id of nextAssignees) {
        if (!prevSet.has(id)) {
          await post(`/api/project/${projectId}/tasks/${updatedTask.id}/assign/`, {
            project_member_id: id,
          })
        }
      }
    } catch (err) {
      console.error(err)
      toast.error(
        'Task details saved, but assignees could not be updated\nRefresh the board and try changing assignees again.'
      )
      const fallback = mapTaskResponseToTask(putResponse)
      setTasks((prev) => {
        const newTasks = { ...prev }
        for (const column in newTasks) {
          const idx = newTasks[column as keyof Tasks].findIndex((t) => t.id === updatedTask.id)
          if (idx !== -1) {
            newTasks[column as keyof Tasks] = [...newTasks[column as keyof Tasks]]
            newTasks[column as keyof Tasks][idx] = {
              ...fallback,
              status: newTasks[column as keyof Tasks][idx].status,
            }
            break
          }
        }
        return newTasks
      })
      return
    }

    setTasks((prev) => {
      const newTasks = { ...prev }
      for (const column in newTasks) {
        const idx = newTasks[column as keyof Tasks].findIndex((t) => t.id === updatedTask.id)
        if (idx !== -1) {
          newTasks[column as keyof Tasks] = [...newTasks[column as keyof Tasks]]
          newTasks[column as keyof Tasks][idx] = updatedTask
          break
        }
      }
      return newTasks
    })
    toast.success('Task updated\nChanges are saved for everyone on the project.')
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await del(`/api/project/${projectId}/tasks/${taskId}/delete/`)
      setTasks((prev) => {
        const newTasks = { ...prev }
        for (const column in newTasks) {
          newTasks[column as keyof Tasks] = newTasks[column as keyof Tasks].filter(
            (task) => task.id !== taskId
          )
        }
        return newTasks
      })
      toast.success('Task deleted\nIt’s removed from the board for all teammates.')
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t delete task\nCheck your connection and try again.')
    }
  }

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await patch<{ status: string }, TaskResponse>(
        `/api/project/${projectId}/tasks/${taskId}/move/`,
        { status }
      )
    } catch (err) {
      console.error(err)
      toast.error('Couldn’t update task status\nRefresh the board and try moving the card again.')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string
    setActiveId(taskId)
    dragStartContainerRef.current = findContainer(taskId) as TaskStatus | null

    // Snapshot tasks so we can revert if the drag is cancelled / dropped outside.
    dragStartTasksSnapshotRef.current = Object.fromEntries(
      Object.entries(tasks).map(([k, v]) => [k, [...v]])
    ) as unknown as Tasks
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const originContainer = dragStartContainerRef.current
    if (!originContainer) return

    // Tasks in Done cannot be moved out (we'll also enforce on dragEnd).
    if (originContainer === 'done') return

    let targetStatus: TaskStatus | null = null

    if (over.id.toString().startsWith('column-')) {
      targetStatus = over.id.toString().replace('column-', '') as TaskStatus
    } else {
      const overContainer = findContainer(over.id as string)
      if (!overContainer) return
      targetStatus = overContainer
    }

    // Validate target status exists and is different from origin
    if (!targetStatus || targetStatus === originContainer) return

    // Ensure targetStatus is a valid TaskStatus
    const validStatuses: TaskStatus[] = ['backlog', 'todo', 'inProgress', 'done']
    if (!validStatuses.includes(targetStatus)) return

    const toStatus: TaskStatus = targetStatus

    // Prevent moving to "done" if task has no assignees
    if (toStatus === 'done') {
      const originalTasks =
        dragStartTasksSnapshotRef.current?.[originContainer] ||
        tasks[originContainer as keyof Tasks]
      const taskToMove = originalTasks.find((item) => item.id === taskId)
      if (taskToMove && (!taskToMove.assignees || taskToMove.assignees.length === 0)) {
        // Don't update UI - prevent the move visually
        return
      }
    }

    // Optimistic UI - use original container state to avoid issues with multiple updates
    setTasks((prev) => {
      // Use the original container from when drag started
      const originalTasks =
        dragStartTasksSnapshotRef.current?.[originContainer] || prev[originContainer]
      const taskIndex = originalTasks.findIndex((item) => item.id === taskId)
      if (taskIndex === -1) return prev

      const movedTask = originalTasks[taskIndex]

      // Remove from all containers and add to target
      const newTasks = { ...prev }
      for (const key in newTasks) {
        newTasks[key as keyof Tasks] = newTasks[key as keyof Tasks].filter(
          (item) => item.id !== taskId
        )
      }
      newTasks[toStatus] = [...newTasks[toStatus], movedTask]

      return newTasks
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      if (dragStartTasksSnapshotRef.current) {
        setTasks(dragStartTasksSnapshotRef.current)
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    const taskId = active.id as string
    const originContainer = dragStartContainerRef.current

    const activeContainer = findContainer(active.id as string)
    if (!activeContainer) {
      if (dragStartTasksSnapshotRef.current) {
        setTasks(dragStartTasksSnapshotRef.current)
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    if (over.id.toString().startsWith('column-')) {
      const containerId = over.id.toString().replace('column-', '') as keyof Tasks

      // Validate containerId is a valid TaskStatus
      const validStatuses: TaskStatus[] = ['backlog', 'todo', 'inProgress', 'done']
      if (!validStatuses.includes(containerId as TaskStatus)) {
        if (dragStartTasksSnapshotRef.current) {
          setTasks(dragStartTasksSnapshotRef.current)
        }
        setActiveId(null)
        dragStartContainerRef.current = null
        dragStartTasksSnapshotRef.current = null
        return
      }

      // Tasks cannot be moved OUT of done.
      if (originContainer === 'done' && containerId !== 'done') {
        if (dragStartTasksSnapshotRef.current) {
          setTasks(dragStartTasksSnapshotRef.current)
        }
        setActiveId(null)
        dragStartContainerRef.current = null
        dragStartTasksSnapshotRef.current = null
        return
      }

      // Only update UI if moving to a different container
      if (originContainer && originContainer !== containerId) {
        setTasks((prev) => {
          // Find the task in the original container (before optimistic updates)
          const originalContainer = originContainer as keyof Tasks
          const originalTasks =
            dragStartTasksSnapshotRef.current?.[originalContainer] || prev[originalContainer]
          const taskIndex = originalTasks.findIndex((item) => item.id === taskId)

          if (taskIndex === -1) return prev

          const taskToMove = originalTasks[taskIndex]

          // Remove from all containers and add to target
          const newTasks = { ...prev }
          for (const key in newTasks) {
            newTasks[key as keyof Tasks] = newTasks[key as keyof Tasks].filter(
              (item) => item.id !== taskId
            )
          }
          newTasks[containerId] = [...newTasks[containerId], taskToMove]

          return newTasks
        })
      }

      // Only persist when the task is dropped into a different column
      if (originContainer && containerId && originContainer !== containerId) {
        // Check if moving to "done" and task has no assignees
        if (containerId === 'done') {
          const originalContainer = originContainer as keyof Tasks
          const originalTasks =
            dragStartTasksSnapshotRef.current?.[originalContainer] || tasks[originalContainer]
          const taskToMove = originalTasks.find((item) => item.id === taskId)

          if (taskToMove && (!taskToMove.assignees || taskToMove.assignees.length === 0)) {
            toast.error(
              'Can’t move to Done yet\nAdd at least one assignee before completing this task.'
            )
            // Revert the UI change
            if (dragStartTasksSnapshotRef.current) {
              setTasks(dragStartTasksSnapshotRef.current)
            }
            setActiveId(null)
            dragStartContainerRef.current = null
            dragStartTasksSnapshotRef.current = null
            return
          }
        }

        try {
          await updateTaskStatus(taskId, containerId as TaskStatus)
          if (containerId === 'done') {
            await options?.onMovedToDone?.(taskId)
          }
        } catch {
          toast.error('Couldn’t save column change\nWe reverted the card—try again in a moment.')
          if (dragStartTasksSnapshotRef.current) {
            setTasks(dragStartTasksSnapshotRef.current)
          }
        }
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    const overContainer = findContainer(over.id as string)
    if (!overContainer) {
      if (dragStartTasksSnapshotRef.current) {
        setTasks(dragStartTasksSnapshotRef.current)
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    // Validate overContainer is a valid TaskStatus
    const validStatuses: TaskStatus[] = ['backlog', 'todo', 'inProgress', 'done']
    if (!validStatuses.includes(overContainer as TaskStatus)) {
      if (dragStartTasksSnapshotRef.current) {
        setTasks(dragStartTasksSnapshotRef.current)
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    // Tasks cannot be moved OUT of done.
    if (originContainer === 'done' && overContainer !== 'done') {
      if (dragStartTasksSnapshotRef.current) {
        setTasks(dragStartTasksSnapshotRef.current)
      }
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    // Handle reordering within the same container
    if (originContainer && originContainer === overContainer) {
      const originalTasks =
        dragStartTasksSnapshotRef.current?.[originContainer as keyof Tasks] ||
        tasks[originContainer]
      const activeIndex = originalTasks.findIndex((task) => task.id === active.id)
      const overIndex = originalTasks.findIndex((task) => task.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setTasks((prev) => ({
          ...prev,
          [overContainer]: arrayMove(originalTasks, activeIndex, overIndex),
        }))
      }
      // No API call needed for reordering within same container
      setActiveId(null)
      dragStartContainerRef.current = null
      dragStartTasksSnapshotRef.current = null
      return
    }

    // Handle moving between different containers
    if (originContainer && overContainer && originContainer !== overContainer) {
      // Update UI using original container state
      setTasks((prev) => {
        const originalContainer = originContainer as keyof Tasks
        const originalTasks =
          dragStartTasksSnapshotRef.current?.[originalContainer] || prev[originalContainer]
        const taskIndex = originalTasks.findIndex((item) => item.id === taskId)

        if (taskIndex === -1) return prev

        const taskToMove = originalTasks[taskIndex]

        // Remove from all containers and add to target
        const newTasks = { ...prev }
        for (const key in newTasks) {
          newTasks[key as keyof Tasks] = newTasks[key as keyof Tasks].filter(
            (item) => item.id !== taskId
          )
        }
        newTasks[overContainer] = [...newTasks[overContainer], taskToMove]

        return newTasks
      })

      // Check if moving to "done" and task has no assignees
      if (overContainer === 'done') {
        const originalContainer = originContainer as keyof Tasks
        const originalTasks =
          dragStartTasksSnapshotRef.current?.[originalContainer] || tasks[originalContainer]
        const taskToMove = originalTasks.find((item) => item.id === taskId)

        if (taskToMove && (!taskToMove.assignees || taskToMove.assignees.length === 0)) {
          toast.error(
            'Can’t move to Done yet\nAdd at least one assignee before completing this task.'
          )
          // Revert the UI change
          if (dragStartTasksSnapshotRef.current) {
            setTasks(dragStartTasksSnapshotRef.current)
          }
          setActiveId(null)
          dragStartContainerRef.current = null
          dragStartTasksSnapshotRef.current = null
          return
        }
      }

      try {
        await updateTaskStatus(taskId, overContainer as TaskStatus)
        if (overContainer === 'done') {
          await options?.onMovedToDone?.(taskId)
        }
      } catch {
        toast.error('Couldn’t save column change\nWe reverted the card—try again in a moment.')
        if (dragStartTasksSnapshotRef.current) {
          setTasks(dragStartTasksSnapshotRef.current)
        }
      }
    }
    setActiveId(null)
    dragStartContainerRef.current = null
    dragStartTasksSnapshotRef.current = null
  }

  const findActiveTask = () => {
    if (!activeId) return null
    const container = findContainer(activeId)
    if (!container) return null
    return tasks[container].find((task) => task.id === activeId) || null
  }

  return {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  }
}
