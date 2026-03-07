import { FeedbackResponse } from "./types"

const FeedbackResponseDisplay = ({ feedback }: { feedback: FeedbackResponse }) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
        <h3 className="text-gray-800 font-medium mb-2">Personalized Feedback</h3>
        <p className="text-gray-700">{feedback.feedback_text ?? "-"}</p>
      </div>
    </div>
  );
};

export default FeedbackResponseDisplay;