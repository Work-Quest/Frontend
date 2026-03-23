import FinishedProjectBox from './FinishedProjectBox'
import { useFinishedProjects } from '@/hook/useFinishedProjects'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FolderCheck } from 'lucide-react'

interface FinishedProjectsHistoryProps {
  userId?: string
}

export default function FinishedProjectsHistory({ userId }: FinishedProjectsHistoryProps) {
  const { finishedProjects, loading, error } = useFinishedProjects(userId)
  const count = finishedProjects?.length ?? 0

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 rounded-xl border-2 border-veryLightBrown bg-offWhite/40 p-4 pb-3 font-baloo2">
      <div className="flex shrink-0 items-center gap-3 border-b border-lightBrown/25 pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FolderCheck className="size-7 shrink-0 text-orange" aria-hidden />
          <h2 className="truncate text-xl font-bold text-darkBrown sm:text-2xl">
            Finished Projects
          </h2>
        </div>
        <span
          className="inline-flex min-w-[2.25rem] items-center justify-center rounded-full border-2 border-darkBrown/20 bg-orange px-3 py-1 text-sm font-bold text-offWhite tabular-nums"
          aria-label={`${count} finished projects`}
        >
          {loading ? '…' : count}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-darkBrown/60">
            <LoadingSpinner size="md" />
            <p className="text-sm font-medium">Loading projects…</p>
          </div>
        ) : error ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-red-200 bg-red-50/50 px-4 py-10 text-center"
            role="alert"
          >
            <p className="font-bold text-red-700">Couldn’t load projects</p>
            <p className="max-w-xs text-sm text-red-600/90">{error}</p>
          </div>
        ) : count > 0 ? (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable] custom-scrollbar">
            <ul className="flex flex-col gap-2.5 pb-1">
              {finishedProjects!.map((project) => (
                <li key={project.project_id}>
                  <FinishedProjectBox
                    project_id={project.project_id}
                    project_name={project.project_name}
                    score={project.score}
                    boss_count={project.boss_count}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-lightBrown/50 bg-cream/25 px-4 py-12 text-center">
            <FolderCheck className="size-10 text-lightBrown/70" aria-hidden />
            <p className="font-bold text-darkBrown">No finished projects yet</p>
            <p className="max-w-[16rem] text-sm leading-relaxed text-darkBrown/65">
              When you close a project, it will show up here with your score and bosses defeated.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
