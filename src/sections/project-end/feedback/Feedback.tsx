import { UserInfo } from "./types";
import FeedbackCard from "./FeedbackCard";
import useFeedback from "./useFeedback";

const Feedback = ({ users }: { users: UserInfo[] }) => {
  const { feedbackData, loading, error, fetchFeedback } = useFeedback();

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50">
      {users.map((user, idx) => (
        <FeedbackCard
          key={idx}
          user={user}
          fetchFeedback={fetchFeedback}
          feedbackData={feedbackData[user.user_name]}
          loading={loading[user.user_name]}
          error={error[user.user_name]}
        />
      ))}
    </div>
  );
};

export default Feedback;