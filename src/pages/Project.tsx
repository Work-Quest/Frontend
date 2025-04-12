import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";

export default function Project() {
  return (
    <div className="self-stretch bg-cream border-r-2 inline-flex flex-col justify-start items-start">
      <div className="self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
        <ProjectDetailCard
          // dummy data
          hpData={{
            boss: { current: 50, max: 100 },
            player: { current: 80, max: 100 },
          }}
          projectData={{
            deadline: "2023-12-31",
            daysLeft: 30,
            estimatedTime: 10,
          }}
        />
      </div>
      <div className="self-stretch bg-offWhite inline-flex flex-col justify-start items-start mt-4">
        <DamageLog
          // dummy data
          logs={[
            {
              id: "1",
              action: "Setup Django",
              timestamp: "2023-05-15T10:00:00Z",
              damageValue: 1234,
              participants: ["John", "Janny"],
              comment: "Good job!",
            },
            {
              id: "2",
              action: "Setup TailwindCSS",
              timestamp: "2024-05-15T10:00:00Z",
              damageValue: -127,
              participants: ["John", "Nano"],
              comment: "Late!",
            },
          ]}
        />
      </div>
      <div className="self-stretch bg-offWhite inline-flex flex-col justify-start items-start mt-4">
        <ReviewTask />
      </div>
    </div>
  );
}
