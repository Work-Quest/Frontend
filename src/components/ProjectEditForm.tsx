import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import type { Project } from "@/types/Project"
import { isoToDateInput } from "@/util/Datetime"
import { cn } from "@/lib/utils"

type ProjectEditFormProps = {
  project: Project
  onUpdateProject: (projectId: string, data: {
    project_name: string
    deadline: string
    status: string
  }) => Promise<void>
}

export default function ProjectEditForm({ project, onUpdateProject }: ProjectEditFormProps) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState(project.project_name)
const [deadline, setDeadline] = useState(
  isoToDateInput(project.deadline)
)
  const [status, setStatus] = useState(project.status)

  useEffect(() => {
    setProjectName(project.project_name)
    setDeadline(isoToDateInput(project.deadline))
    setStatus(project.status)
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onUpdateProject(project.project_id, {
        project_name: projectName,
        deadline: deadline,
        status: status
      })
      toast.success("Project updated successfully!")
      setOpen(false)
    } catch (err) {
      toast.error("Failed to update project.")
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-brown border-brown hover:bg-brown/10">
          Edit Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3 w-[300px]"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <div className="col-span-3 flex items-center">
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1"
                required
              />
              <Calendar className="ml-2 h-4 w-4 text-brown/60" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>

            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "Working" | "Done")
              }
            >
              <SelectTrigger className={cn(
                    "col-span-3 h-10 px-3 py-2 text-sm",
                    status === "Done" && "bg-green-50 text-green-700",
                    status === "Working" && "bg-orange/20 text-orange"
                  )}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}




