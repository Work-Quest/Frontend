import { useEffect, useMemo, useState } from 'react'
import type { Project } from '@/types/Project'
import { getBossProfileImageSrc } from '@/lib/bossProfileAsset'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Calendar, User, Target, CheckCircle, ScrollText } from 'lucide-react'
import ProjectEditForm from './ProjectEditForm'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NotificationDialog from './NotificationDialog'

type ProfileTabCardProps = {
  project: Project
  onUpdateProject: (
    projectId: string,
    data: {
      project_name: string
      deadline: string
      status: string
    }
  ) => Promise<Project>
  onDelete: (projectId: string) => void
}

export default function ProjectTabCard({
  project,
  onUpdateProject,
  onDelete,
}: ProfileTabCardProps) {
  const completionPercentage = Math.round((project.completed_tasks / project.total_tasks) * 100)
  const navigate = useNavigate()
  const [bossPortraitFailed, setBossPortraitFailed] = useState(false)

  useEffect(() => {
    setBossPortraitFailed(false)
  }, [project.project_id, project.boss_name, project.boss_image])

  const bossPortraitSrc = useMemo(() => {
    if (bossPortraitFailed) return '/assets/sprites/bosses/b01/profile.png'
    return getBossProfileImageSrc(project)
  }, [bossPortraitFailed, project])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer h-full bg-offWhite rounded-md justify-between items-center px-4 !border-veryLightBrown !border-2 shadow-[0_4px_0_0_#d6cec4] hover:shadow-[0_2px_0_0_#d6cec4] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#d6cec4] active:translate-y-1 transition-all group">
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="!font-bold !text-brown truncate group-hover:text-orange transition-colors">
              {project.project_name}
            </p>
            <div className="flex items-center mt-1">
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                <div
                  className="bg-orange h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-brown/70 font-baloo2">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="flex justify-between w-[40%] items-center">
            <div className="flex flex-col items-center">
              <Badge
                variant={project.status === 'Done' ? 'default' : 'secondary'}
                className={`text-xs ${
                  project.status === 'Done'
                    ? 'bg-orange text-offWhite hover:bg-orange/90'
                    : 'bg-orange/20 text-orange hover:bg-orange/30'
                }`}
              >
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center w-[60%] justify-end">
              <div className="w-6 h-6 bg-orange/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-orange">
                  {project.owner_username.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-right overflow-hidden !font-medium !text-brown truncate text-sm">
                {project.owner_username}
              </p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">{project.project_name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Owner</p>
                <p className="text-sm text-brown/80">{project.owner_username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-brown/60" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Start Date</p>
                <p className="text-sm text-brown/80">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-red" />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Deadline</p>
                <p className="text-sm text-brown/80">
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
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
                  {project.completed_tasks} / {project.total_tasks} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${project.status === 'Done' ? 'bg-orange' : 'bg-orange/60'}`}
              />
              <div>
                <p className="!font-semibold !text-brown -mb-1">Status</p>
                <Badge
                  variant={project.status === 'Done' ? 'default' : 'secondary'}
                  className={
                    project.status === 'Done'
                      ? 'bg-orange text-offWhite hover:bg-orange/90'
                      : 'bg-orange/20 text-orange'
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {project.status === 'Done' ? (
          <div className="mt-6 rounded-xl border-2 border-orange/40 bg-orange/10 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange/50 bg-offWhite">
                  <ScrollText className="h-5 w-5 text-orange" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-baloo2 font-bold text-darkBrown">This quest is complete</p>
                  <p className="font-baloo2 text-sm leading-snug text-brown/75">
                    Open the project summary for scores, achievements, and feedback—not the battle
                    screen.
                  </p>
                </div>
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="orange"
                  className="w-full shrink-0 font-baloo2 sm:w-auto !bg-orange hover:!bg-orange/90 !text-offWhite"
                  onClick={() => navigate(`/project/${project.project_id}/project-end`)}
                >
                  View project results
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-orange/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={bossPortraitSrc}
                  alt={project.boss_name ? `${project.boss_name} boss` : 'Boss'}
                  className="h-10 w-10 shrink-0 rounded-lg border border-veryLightBrown/60 bg-offWhite object-cover [image-rendering:pixelated]"
                  onError={() => setBossPortraitFailed(true)}
                />
                <div className="min-w-0">
                  <p className="!font-semibold !text-brown">Boss challenge</p>
                  <p className="!text-brown/70">Ready to face the challenge?</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="warning"
                  className="shrink-0 !bg-orange hover:!bg-orange/90 hover:!outline-none !font-baloo2"
                  onClick={() => navigate(`/project/${project.project_id}`)}
                >
                  Let&apos;s fight!
                </Button>
              </DialogClose>
            </div>
          </div>
        )}
        <DialogFooter>
          <ProjectEditForm project={project} onUpdateProject={onUpdateProject} />
          <NotificationDialog
            title="Delete Project"
            description="Are you sure you want to proceed with this action? All Project history will be lost forever."
            trigger={<Button className="text-red">Delete Project</Button>}
            onConfirm={async () => {
              try {
                await onDelete(project.project_id)
                toast.success('Project deleted\nIt’s removed from your list permanently.')
              } catch (err) {
                toast.error('Couldn’t delete project\nTry again or refresh the page.')
                console.error(err)
              }
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
