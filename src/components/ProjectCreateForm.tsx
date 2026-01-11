import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { IoAddCircle } from "react-icons/io5"
import toast from "react-hot-toast"

type CreateProjectProps = {
  onCreateProject: (data: {
    project_name: string
    deadline: string
  }) => Promise<void>
}


export default function ProjectCreateForm({onCreateProject}: CreateProjectProps) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onCreateProject({ project_name: projectName, deadline })
      toast.success("Project created successfully!")
      setOpen(false)
      setProjectName("")
      setDeadline("")
    } catch (err) {
      toast.error("Failed to create project.")
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-orange/20 border-2 border-orange border-dashed rounded-md hover:bg-orange/30 flex items-center justify-center p-3 m-4 cursor-pointer flex-shrink-0 transition-colors h-12">
          <IoAddCircle className="w-5 h-5 text-orange" />
          <p className="!text-orange !font-bold ml-2">Add new project</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new project.
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
              className="col-span-3"
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

          <DialogFooter>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
