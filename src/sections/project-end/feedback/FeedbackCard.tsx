import { FeedbackResponse } from "./types"
import FeedbackMetrics from "./FeedbackMetrics";
import WorkloadChart from "./WorkloadChart";
import FeedbackResponseDisplay from "./FeedbackResponse";
import SkeletonLoading from "./SkeletonLoading";

interface FeedbackCardProps {
  feedbackData: FeedbackResponse | null;
  loading?: boolean;
  error?: string;
}

const FeedbackCard = ({
  feedbackData,
  loading,
  error
}: FeedbackCardProps) => {  
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <div className="flex justify-between items-start mb-4 border-t pt-4">
        <div>
          <h3 className="text-xl font-semibold">Your feedback</h3>
          <p className="text-gray-600">{feedbackData?.strength ?? ""}</p>
        </div>
        
       
      </div>
      
      {feedbackData && (
        <>
          <FeedbackMetrics feedback={feedbackData} />
          <WorkloadChart work_load_per_day={feedbackData.work_load_per_day ?? ""} />
        </>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading && <SkeletonLoading />}
      
      {feedbackData && <FeedbackResponseDisplay feedback={feedbackData} />}
    </div>
  );
};

export default FeedbackCard;