import { useNavigate } from "react-router-dom";
import { ChevronRight, Swords, Trophy } from "lucide-react";

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

  const title = project_name?.trim() || "Untitled project";
  const bossLabel = boss_count === 1 ? "1 boss" : `${boss_count} bosses`;

  return (
    <button
      type="button"
      onClick={() => navigate(`/project/${project_id}/project-end`)}
      aria-label={`Open project summary: ${title}`}
      className="group w-full rounded-xl !border-2 !border-lightBrown/20 bg-offWhite/90 text-left transition-all hover:border-orange hover:bg-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/55 focus-visible:ring-offset-2 focus-visible:ring-offset-offWhite active:scale-[0.99]"
    >
      <div className="flex items-stretch gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p
            className="truncate font-baloo2 text-base font-bold text-darkBrown sm:text-lg group-hover:text-orange"
            title={title}
          >
            {title}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lightBrown/50 bg-cream/80 px-2.5 py-1 font-baloo2 text-xs font-semibold text-darkBrown">
              <Trophy className="size-3.5 shrink-0 text-orange" aria-hidden />
              <span className="tabular-nums">{score.toLocaleString()}</span>
              <span className="font-medium text-darkBrown/70">pts</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lightBrown/50 bg-cream/80 px-2.5 py-1 font-baloo2 text-xs font-semibold text-darkBrown">
              <Swords className="size-3.5 shrink-0 text-darkBrown/60" aria-hidden />
              <span>{bossLabel}</span>
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center self-center text-lightBrown transition-colors group-hover:text-orange">
          <ChevronRight className="size-5 sm:size-6" aria-hidden />
        </div>
      </div>
    </button>
  );
}


