import React, { useState } from "react";
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

interface AddTaskOverlayProps {
  columnId: TaskStatus;
  onAddTask: (task: Omit<Task, "id">) => void;
}

export const AddTaskOverlay: React.FC<AddTaskOverlayProps> = ({
  columnId,
  onAddTask,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [iteration, setIteration] = useState("Sprint 1");
  const [assignees, setAssignees] = useState("You");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Omit<Task, "id"> = {
      title,
      priority,
      iteration,
      assignees: assignees.split(",").map((a) => a.trim()),
      status: columnId,
    };

    onAddTask(newTask);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setPriority("Medium");
    setIteration("Sprint 1");
    setAssignees("You");
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
                htmlFor="iteration"
                className="font-['Baloo_2'] text-darkBrown"
              >
                Iteration
              </Label>
              <Input
                id="iteration"
                value={iteration}
                onChange={(e) => setIteration(e.target.value)}
                placeholder="Sprint 1"
                className="font-['Baloo_2'] text-darkBrown"
              />
            </div>

            <div className="space-y-2">
              {/* change later */}
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
            </div>

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
