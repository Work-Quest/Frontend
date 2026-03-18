import { ScrollArea } from "../components/ui/scroll-area";
import FinishedProjectBox from "./FinishedProjectBox";
import { useFinishedProjects } from "@/hook/useFinishedProjects";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FinishedProjectsHistoryProps {
  userId?: string;
}

export default function FinishedProjectsHistory({ userId }: FinishedProjectsHistoryProps) {
  const { finishedProjects, loading, error } = useFinishedProjects(userId);

  return (
    <>
      <div className="flex flex-col h-full gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <div className="flex">
          <p className="!text-2xl mr-auto">Finished Projects</p>
          <div className="inline-flex items-center justify-center px-3 py-1 text-white rounded-full bg-lightBrown">
            {finishedProjects?.length || 0}
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              Error: {error}
            </div>
          ) : finishedProjects && finishedProjects.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="flex flex-col w-full h-full gap-2">
                {finishedProjects.map((project) => (
                  <FinishedProjectBox
                    key={project.project_id}
                    project_id={project.project_id}
                    project_name={project.project_name}
                    score={project.score}
                    boss_count={project.boss_count}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No finished projects yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}

