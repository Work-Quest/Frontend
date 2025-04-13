import React from "react";
import { Task } from "./types";

interface DeleteConfirmationOverlayProps {
  task: Task;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationOverlay: React.FC<
  DeleteConfirmationOverlayProps
> = ({ task, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold text-darkBrown">Delete Task?</h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{task.title}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-lg border border-lightBrown text-darkBrown hover:bg-offWhite"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded-lg bg-red text-white hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
