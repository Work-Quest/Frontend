"use client"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoAddCircleOutline } from "react-icons/io5";
import { Task, TaskPriority, TaskStatus } from "./types";
import { UserStatus } from "@/types/User";
import MultiCombobox, { MultiComboboxOption } from "@/components/ui/multicombobox";
import { useParams } from "react-router-dom";
import useProjects from "@/hook/useProjects";
interface AddTaskOverlayProps {
  columnId: TaskStatus;
  projectMember: UserStatus[];
  onAddTask: (task:  Task) => void;
}

export const AddTaskOverlay: React.FC<AddTaskOverlayProps> = ({
  columnId,
  projectMember,
  onAddTask,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useProjects();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [deadline, setDeadline] = useState<string>("");
  const [defaultDeadline, setDefaultDeadline] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Derive project deadline from global projects list
  useEffect(() => {
    if (!projectId || !projects || projects.length === 0) return;

    const currentProject = projects.find((p) => p.project_id === projectId);
    if (!currentProject) return;

    // Assume backend stores ISO string; convert to yyyy-MM-dd for input[type="date"]
    const iso = currentProject.deadline ?? "";
    const formatted = iso ? iso.split("T")[0] : "";

    setDeadline(formatted);
    setDefaultDeadline(formatted);
  }, [projectId, projects]);

    const memberOptions = React.useMemo<MultiComboboxOption[]>(() => {
    return projectMember?.map(member => ({
      value: member.id,
      label: member.name
    })) ?? []
  }, [projectMember])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = ""

    const newTask: Task = {
      id,
      title,
      priority,
      iteration: null,
      assignees: selectedMembers,
      status: columnId,
      description: null,
      deadline: deadline || null,
    };

    console.log("newTask", newTask)

    onAddTask(newTask);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setPriority("Medium");
    setDeadline(defaultDeadline);
    setSelectedMembers([]);
  };

  return (
    <>
      <Button
        variant="shadow"
        className="!bg-blue mb-4"
        onClick={() => setOpen(true)}
      >
        <IoAddCircleOutline className="mr-2" />
        Add Task
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-offWhite">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="font-['Baloo_2'] text-darkBrown"
              >
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                className="font-['Baloo_2'] text-darkBrown"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="font-['Baloo_2'] text-darkBrown"
              >
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(value: TaskPriority) => setPriority(value)}
              >
                <SelectTrigger
                  className={`
                  w-full
                  !font-['Baloo_2']
                  !bg-offWhite
                  text-darkBrown
                  !border
                  !border-lightBrown
                  text-left
                  focus:outline-none
                  focus:ring-1
                  focus:ring-lightBrown
                  !text-sm
                  !font-normal
                `}
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="font-['Baloo_2'] bg-offWhite text-darkBrown border-lightBrown">
                  <SelectItem value="Low" className="hover:!bg-cream">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="hover:!bg-cream">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="hover:!bg-cream">
                    High
                  </SelectItem>
                  <SelectItem value="Urgent" className="hover:!bg-cream">
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="Deadline"
                className="font-['Baloo_2'] text-darkBrown"
              >
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="font-['Baloo_2'] text-darkBrown"
                required
              />
            </div>

            {/* <div className="space-y-2">
             
              <Label
                htmlFor="assignees"
                className="font-['Baloo_2'] text-darkBrown"
              >
                Assignees (comma separated)
              </Label>
              <Input
                id="assignees"
                value={assignees}
                onChange={(e) => setAssignees(e.target.value)}
                placeholder="You"
                className="font-['Baloo_2'] text-darkBrown"
              />
            </div> */}

            <MultiCombobox
              label="Assignees"
              placeholder="Select Assignee"
              searchPlaceholder="Search Assignee"
              options={memberOptions}
              value={selectedMembers}
            onChange={setSelectedMembers}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="!bg-offWhite !border-darkBrown !font-['Baloo_2'] hover:!bg-cream"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="!bg-blue !font-['Baloo_2'] !border-blue hover:!bg-blue-400"
              >
                Add Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
