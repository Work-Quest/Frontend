import { UserInfo, FeedbackResponse } from "./types";
import FeedbackMetrics from "./FeedbackMetrics";
import WorkloadChart from "./WorkloadChart";
import FeedbackResponseDisplay from "./FeedbackResponse";
import SkeletonLoading from "./SkeletonLoading";

interface FeedbackCardProps {
  user: UserInfo;
  fetchFeedback: (user: UserInfo) => Promise<void>;
  feedbackData?: FeedbackResponse;
  loading?: boolean;
  error?: string;
}

const FeedbackCard = ({
  user,
  fetchFeedback,
  feedbackData,
  loading,
  error
}: FeedbackCardProps) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <div className="flex justify-between items-start mb-4 border-t pt-4">
        <div>
          <h3 className="text-xl font-semibold">{user.user_name}</h3>
          <p className="text-gray-600">{user.work_category}</p>
        </div>
        
        {!feedbackData && !loading && (
          <button 
            onClick={() => fetchFeedback(user)}
            className="px-4 py-2 !bg-orange !text-white hover:!bg-orange-400 transition !font-['Baloo_2']"
          >
            Get Feedback
          </button>
        )}
        
        {loading && (
          <div className="px-4 py-2 bg-gray-200 text-gray-500 rounded animate-pulse !font-['Baloo_2']">
            Loading...
          </div>
        )}
      </div>
      
      <FeedbackMetrics user={user} />
      <WorkloadChart work_load_per_day={user.work_load_per_day} />
      
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