import { UserInfo } from "./types";

interface FeedbackMetricsProps {
  user: UserInfo;
}

const FeedbackMetrics = ({ user }: FeedbackMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Teamwork</p>
        <p className="!text-lg !font-medium">{user.team_work}%</p>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Speed</p>
        <p className="!text-lg !font-medium">{user.work_speed}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Quality Score</p>
        <p className="!text-lg !font-medium">{user.overall_quality_score}</p>
      </div>
    </div>
  );
};

export default FeedbackMetrics;