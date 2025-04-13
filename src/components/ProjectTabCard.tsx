import type { Project } from "@/types/Project";

type ProfileTabCardProps = {
    project: Project;
  };

export default function ProjectTabCard({project}:ProfileTabCardProps){
    return (
        <div className="flex w-[100%] cursor-pointer h-[15%] bg-offWhite rounded-xl border-b-4 border-darkBlue justify-between items-center px-4  hover:bg-[#84babe] ">
                <h3>{project.ProjectName}</h3>
                <div className="flex justify-between w-[40%]">
                    <h3 className={``}>{project.Status}</h3>
                    <h3 className="w-[60%] items-end text-right overflow-auto">{project.OwnerName}</h3>
                </div>
        </div>
    )
}