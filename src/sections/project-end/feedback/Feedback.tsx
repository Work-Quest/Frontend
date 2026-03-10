import FeedbackCard from "./FeedbackCard";
import useFeedback from "./useFeedback";
import { useEffect, useRef } from "react";

const Feedback = ({ projectId }: { projectId: string }) => {
  const { feedback, loading, error, fetchFeedback } = useFeedback(projectId);
  const fetchedForProjectIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!projectId) return;
    // Fetch only once per projectId (avoid re-fetch loops on re-renders)
    if (fetchedForProjectIdRef.current === projectId) return
    fetchedForProjectIdRef.current = projectId
    void fetchFeedback();
  }, [projectId, fetchFeedback]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50">
      <FeedbackCard
        feedbackData={feedback}
        loading={loading}
        error={error ?? undefined}
      />
    </div>
  );
};
export default Feedback;