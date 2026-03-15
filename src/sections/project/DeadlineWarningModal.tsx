import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "@/Api";
import toast from "react-hot-toast";

type DeadlineWarningModalProps = {
  open: boolean;
  projectId: string;
  delayDays: number;
  onClose: () => void;
  onContinue: () => void;
};

const DeadlineWarningModal: React.FC<DeadlineWarningModalProps> = ({
  open,
  projectId,
  delayDays,
  onContinue,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const reductionPercent = Math.min(delayDays * 5, 50)

  const handleCloseProject = async () => {
    try {
      setIsProcessing(true);
      await post<{ project_id: string }, any>("/api/project/close/", {
        project_id: projectId,
      });
      toast.success("Project closed successfully");
      navigate(`/project/${projectId}/end`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to close project");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async () => {
    try {
      setIsProcessing(true);
      await post<{}, any>(`/api/project/${projectId}/deadline/continue/`, {});
      toast.success(`Score reduction applied: ${reductionPercent}%`);
      onContinue();
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply score reduction");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <div className="text-center font-mono tracking-widest bg-slate-900 p-8 rounded-lg border-2 border-yellow-500 max-w-md">
        <h1 className="text-yellow-300 text-2xl mb-4">PROJECT DEADLINE PASSED</h1>
        <div className="mt-2 tracking-normal flex flex-col gap-4">
          <div className="text-white">
            <p className="text-lg mb-2">Delay: {delayDays} day{delayDays !== 1 ? 's' : ''}</p>
            <p className="text-sm text-yellow-200">
              If you continue working, all team members' scores will be reduced by {reductionPercent}%
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleContinue}
              disabled={isProcessing}
              className="!bg-blue-500 hover:!bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            >
              Continue Working
            </button>
            <button
              onClick={handleCloseProject}
              disabled={isProcessing}
              className="!bg-red-500 hover:!bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            >
              Close Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineWarningModal;


