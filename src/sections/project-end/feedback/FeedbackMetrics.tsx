import { FeedbackResponse } from "./types"

const FeedbackMetrics = ({ feedback }: { feedback: FeedbackResponse }) => {

  function avgFromJsonNumberArrayIgnoreZero(input: string | null | undefined) {
  if (!input) return null;

  let arr: unknown;
  try {
    arr = JSON.parse(input);
  } catch {
    return null;
  }

  if (!Array.isArray(arr)) return null;

  const nums = arr
    .map((x) => (typeof x === "number" ? x : Number(x)))
    .filter((n) => Number.isFinite(n) && n !== 0);

  if (nums.length === 0) return null;

  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

// usage:
const work_speed_avg = avgFromJsonNumberArrayIgnoreZero(feedback.work_speed);
const work_speed_display = work_speed_avg == null ? "-" : work_speed_avg.toFixed(2);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Teamwork Score (out of 100)</p>
        <p className="!text-lg !font-medium">
          {feedback.team_work ?? "-"}{feedback.team_work != null ? "%" : ""}
        </p>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Speed (minute)</p>
        <p className="!text-lg !font-medium">{work_speed_display}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Quality Score (out of 5)</p>
        <p className="!text-lg !font-medium">
          {feedback.overall_quality_score ?? "-"}
        </p>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <p className="!font-bold !text-brown">Diligence Score (out of 100)</p>
        <p className="!text-lg !font-medium">
          {feedback.diligence ?? "-"}
        </p>
      </div>
    </div>
  );
};

export default FeedbackMetrics;