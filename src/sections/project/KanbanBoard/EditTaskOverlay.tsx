"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task, TaskPriority } from "./types"
import { UserStatus } from "@/types/User"
import MultiCombobox, {
  MultiComboboxOption,
} from "@/components/ui/multicombobox"

const inputStyle =
  "w-full rounded-xl !border-brown !border-2 px-4 py-3 font-['Baloo_2'] text-darkBrown placeholder:text-brown/50 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange !bg-cream/30 transition-all"

interface EditTaskOverlayProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  projectMember: UserStatus[]
  onUpdateTask: (task: Task) => void
}

export const EditTaskOverlay: React.FC<EditTaskOverlayProps> = ({
  task,
  open,
  onOpenChange,
  projectMember,
  onUpdateTask,
}) => {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("Medium")
  const [deadline, setDeadline] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setPriority(task.priority)
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "")
      setSelectedMembers(task.assignees)
    }
  }, [task, open])

  const memberOptions: MultiComboboxOption[] = React.useMemo(
    () =>
      projectMember?.map((member) => ({
        value: member.id,
        label: member.name,
      })) ?? [],
    [projectMember],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    const updatedTask: Task = {
      ...task,
      title,
      priority,
      deadline: deadline || null,
      assignees: selectedMembers,
    }

    onUpdateTask(updatedTask)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-offWhite">
        <DialogHeader>
          <DialogTitle className="font-['Baloo_2']">Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="edit-title"
              className="font-['Baloo_2'] font-bold text-darkBrown"
            >
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className={inputStyle}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-priority"
              className="font-['Baloo_2'] font-bold text-darkBrown"
            >
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value: TaskPriority) => setPriority(value)}
            >
              <SelectTrigger
                className={
                  inputStyle +
                  " h-auto min-h-[44px] justify-between data-[placeholder]:text-brown/50"
                }
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="font-['Baloo_2'] !bg-cream/95 text-darkBrown !border-brown !border-2 rounded-xl">
                <SelectItem
                  value="Low"
                  className="font-['Baloo_2'] hover:!bg-cream"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="Medium"
                  className="font-['Baloo_2'] hover:!bg-cream"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="High"
                  className="font-['Baloo_2'] hover:!bg-cream"
                >
                  High
                </SelectItem>
                <SelectItem
                  value="Urgent"
                  className="font-['Baloo_2'] hover:!bg-cream"
                >
                  Urgent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-deadline"
              className="font-['Baloo_2'] font-bold text-darkBrown"
            >
              Deadline
            </Label>
            <Input
              id="edit-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputStyle + " [color-scheme:light]"}
            />
          </div>

          <MultiCombobox
            label="Assignees"
            placeholder="Select Assignee"
            searchPlaceholder="Search Assignee"
            options={memberOptions}
            value={selectedMembers}
            onChange={setSelectedMembers}
            triggerClassName={
              inputStyle +
              " h-auto min-h-[44px] justify-between font-normal shadow-none [&_svg]:!text-brown/60"
            }
          />

          <DialogFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="!bg-offWhite !border-darkBrown !text-darkBrown !font-['Baloo_2'] hover:!bg-cream normal-case"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="!bg-blue !text-white !font-['Baloo_2'] !border-blue hover:!bg-darkBlue normal-case"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
