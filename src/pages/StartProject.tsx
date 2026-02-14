import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import { MissionDetails } from "@/sections/start-project/MissionDetails";
import { PartyMembers } from "@/sections/start-project/PartyMembers";
import { PartyMember } from "@/types/User";
import { QuestFormData } from "@/types/Quest";
import { useProjects } from "@/hook/useProjects";



function StartProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<QuestFormData>({
    questName: "",
    startDate: "",
    dueDate: "",
  });
  const { createProject } = useProjects()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.questName,
      deadline: new Date(formData.dueDate).toISOString(),
    };

    try {
      console.log("API Payload:", payload);
      const res = await createProject({ project_name: formData.questName, deadline: formData.dueDate })
      navigate(`/project/${res.project_id}/setup`)
      toast.success("Quest started successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start quest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-offWhite p-4 md:p-8 font-['Baloo_2'] text-darkBrown flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col mb-4 md:mb-6">
        <h2 className="text-3xl md:text-4xl font-bold !text-red tracking-tight">
          Start a New Quest
        </h2>
        <p className="text-lightBrown font-medium text-sm md:text-base mt-1">
          Define your mission objectives and gather your party.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full"
      >
        <MissionDetails
          formData={formData}
          handleChange={handleChange}
          isLoading={isLoading}
        />
        <div
        className="
            fixed bottom-0 left-0
            w-screen h-[70px]
            flex items-center 
            bg-white
            z-[9999]
            shadow-md
        "
        >
          <div className="flex w-screen mx-10 justify-between">
                  <button
                      className= "!text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                      onClick={() => navigate(`/home`)}
                  >
                      retreat
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="!bg-[rgba(215,206,197,1)] !text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                  >
                      Create Party!
                  </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StartProject;
