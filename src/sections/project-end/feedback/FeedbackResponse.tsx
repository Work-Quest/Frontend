import { FeedbackResponse } from "./types";

interface FeedbackResponseProps {
  feedback: FeedbackResponse;
}

const FeedbackResponseDisplay = ({ feedback }: FeedbackResponseProps) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-lg">Assigned Role: </h3>
        <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {feedback.assigned_role}
        </p>
      </div>
      
      <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="text-gray-800 font-medium mb-2">Personalized Feedback</h3>
        <p className="text-gray-700">{feedback.feedback}</p>
      </div>
    </div>
  );
};

export default FeedbackResponseDisplay;