import type { Project } from "@/types/Project";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";

type ProfileTabCardProps = {
    project: Project;
  };

export default function ProjectTabCard({project}:ProfileTabCardProps){
    return (
        <Dialog>
        <DialogTrigger asChild>
        <div className="flex w-[100%] cursor-pointer h-[15%] bg-offWhite rounded-xl border-b-4 border-darkGray justify-between items-center px-4 hover:border-b-0 hover:border-t-4 hover:border-blue hover:bg-cream transition-all duration-300 ease-out">
                    <h3 className={""}>{project.ProjectName}</h3>
                    <div className="flex justify-between w-[40%]">
                        <h3 className={"!font-medium"}>{project.Status}</h3>
                        <h3 className="w-[60%] items-end text-right overflow-auto !font-medium">{project.OwnerName}</h3>
                    </div>
                    </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
            <DialogTitle>{project.ProjectName} Project Detail</DialogTitle>
            {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
                <div className="flex flex-col">
                <div className="flex items-center gap-4"><h3>Owner:</h3> <p>{project.OwnerName}</p></div>
                <div className="flex items-center gap-4"><h3>Team member:</h3> <p></p></div>
                <div className="flex items-center gap-4"><h3>Start:</h3> <p>{project.CreatedAt}</p></div>
                <div className="flex items-center gap-4"><h3>DeadLine:</h3> <p>{project.DeadLine}</p></div>
                <div className="flex items-center gap-4"><h3>TotalTask:</h3> <p>{project.TotalTask}</p></div>
                <div className="flex items-center gap-4"><h3>CompletedTasks:</h3> <p>{project.CompletedTasks}</p></div>
                <div className="flex items-center gap-4"><h3>Status:</h3> <p>{project.Status}</p></div>
                <div className="flex items-center gap-4"><h3>Boss:</h3> 
                <img src="/mockImg/boss2.svg" alt="boss" className="cursor-pointer"/></div>
                </div>
            <DialogFooter>
            <Button className="!bg-darkBlue !font-['Baloo_2']">Let's fight</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
        
    )
}