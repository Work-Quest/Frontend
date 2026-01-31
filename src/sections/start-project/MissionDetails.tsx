// src/sections/start-project/MissionDetails.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestFormData } from "@/types/Quest";

interface MissionDetailsProps {
  formData: QuestFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function MissionDetails({
  formData,
  handleChange,
  isLoading,
}: MissionDetailsProps) {
  return (
    <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-5 md:p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center gap-3 border-b border-offWhite pb-4">
        <h3 className="text-xl font-bold text-darkBrown">Mission Details</h3>
      </div>

      {/* Quest Name */}
      <div className="grid gap-2">
        <Label
          htmlFor="questName"
          className="text-sm font-bold text-darkBrown pl-1"
        >
          Quest Name
        </Label>
        <Input
          id="questName"
          name="questName"
          value={formData.questName}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Input your quest name here..."
          className="h-11 px-4 text-sm bg-offWhite border border-brown/20 rounded-xl focus-visible:ring-2 focus-visible:ring-orange focus-visible:border-orange transition-all placeholder:text-gray-400"
          required
        />
      </div>

      {/* Tip Box */}
      <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-800 text-xs font-medium">
        Tip: Choose a clear name so your party knows exactly what the objective
        is!
      </div>

      {/* Dates Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
        <div className="grid gap-2">
          <Label
            htmlFor="startDate"
            className="text-sm font-bold text-darkBrown pl-1"
          >
            Start Date
          </Label>
          <div className="relative group">
            <Input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11 px-4 bg-offWhite border border-brown/20 rounded-xl focus-visible:ring-2 focus-visible:ring-orange focus-visible:border-orange transition-all cursor-pointer relative z-10 text-sm w-full block"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="dueDate"
            className="text-sm font-bold text-darkBrown pl-1"
          >
            Due Date
          </Label>
          <div className="relative group">
            <Input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11 px-4 bg-offWhite border border-brown/20 rounded-xl focus-visible:ring-2 focus-visible:ring-orange focus-visible:border-orange transition-all cursor-pointer relative z-10 text-sm w-full block"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
