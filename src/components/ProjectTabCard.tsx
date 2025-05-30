import type { Project } from "@/types/Project"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar, User, Target, CheckCircle } from "lucide-react"

type ProfileTabCardProps = {
  project: Project
}

export default function ProjectTabCard({ project }: ProfileTabCardProps) {
  const completionPercentage = Math.round((project.CompletedTasks / project.TotalTask) * 100)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer h-full bg-offWhite rounded-md justify-between items-center px-4 !border-veryLightBrown !border-2 shadow-[0_4px_0_0_#d6cec4] hover:shadow-[0_2px_0_0_#d6cec4] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#d6cec4] active:translate-y-1 transition-all group">
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="!font-bold !text-brown truncate group-hover:text-orange transition-colors">
              {project.ProjectName}
            </p>
            <div className="flex items-center mt-1">
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                <div
                  className="bg-orange h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-brown/70 font-['Baloo_2']">{completionPercentage}%</span>
            </div>
          </div>
          <div className="flex justify-between w-[40%] items-center">
            <div className="flex flex-col items-center">
              <Badge
                variant={project.Status === "Done" ? "default" : "secondary"}
                className={`text-xs ${
                  project.Status === "Done"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-orange/20 text-orange hover:bg-orange/30"
                }`}
              >
                {project.Status}
              </Badge>
            </div>
            <div className="flex items-center w-[60%] justify-end">
              <div className="w-6 h-6 bg-orange/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-orange">{project.OwnerName.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-right overflow-hidden !font-medium !text-brown truncate text-sm">
                {project.OwnerName}
              </p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {project.ProjectName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Owner</p>
                <p className="text-sm text-brown/80">{project.OwnerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Start Date</p>
                <p className="text-sm text-brown/80">{new Date(project.CreatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-red" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Deadline</p>
                <p className="text-sm text-brown/80">{new Date(project.DeadLine).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-brown/80">{completionPercentage}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Tasks</p>
                <p className="text-sm text-brown/80">
                  {project.CompletedTasks} / {project.TotalTask} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${project.Status === "Done" ? "bg-green-500" : "bg-orange"}`} />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Status</p>
                <Badge
                  variant={project.Status === "Done" ? "default" : "secondary"}
                  className={
                    project.Status === "Done"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-orange/20 text-orange"
                  }
                >
                  {project.Status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-orange/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/placeholder.svg?height=40&width=40" alt="boss" className="w-10 h-10 rounded-lg" />
              <div>
                <p className="!font-semibold !text-brown">Boss Challenge</p>
                <p className="!text-brown/70">Ready to face the challenge?</p>
              </div>
            </div>
            <Button variant="warning" className="!bg-orange hover:!bg-orange/90 hover:!outline-none !font-['Baloo_2']">Let's Fight!</Button>
          </div>
        </div>
        <DialogFooter>
          <Button className="text-brown border-brown hover:bg-brown/10">
            Edit Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
