import { useNavigate } from "react-router-dom";

interface FinishedProjectBoxProps {
  project_id: string;
  project_name: string;
  score: number;
  boss_count: number;
}

export default function FinishedProjectBox({
  project_id,
  project_name,
  score,
  boss_count,
}: FinishedProjectBoxProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project_id}/project-end`);
  };

  return (
    <div
      className="flex flex-row p-2 border-2 rounded-md border-veryLightBrown cursor-pointer hover:bg-cream/50 transition-colors"
      onClick={handleClick}
    >
      <div className="flex flex-col flex-1 gap-1">
        <p className="!text-xl font-bold">
          {project_name || "Project Name"}
        </p>
        <div className="flex gap-4 text-sm text-lightBrown">
          <span className="font-medium">Score: {score.toLocaleString()}</span>
          <span className="font-medium">Bosses Defeated: {boss_count}</span>
        </div>
      </div>
    </div>
  );
}

