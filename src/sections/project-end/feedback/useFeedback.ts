import { useState } from "react";
import { UserInfo, FeedbackResponse } from "./types";
import { postData } from "@/Api";

const useFeedback = () => {
  const [feedbackData, setFeedbackData] = useState<Record<string, FeedbackResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  const fetchFeedback = async (user: UserInfo) => {
    if (loading[user.user_name]) return;

    setLoading(prev => ({ ...prev, [user.user_name]: true }));

    try {
      const data = await postData<UserInfo, FeedbackResponse>("/feedback", user);
      setFeedbackData(prev => ({ ...prev, [user.user_name]: data }));
      setError(prev => {
        const newErrors = { ...prev };
        delete newErrors[user.user_name];
        return newErrors;
      });
    } catch (err) {
      console.error('Feedback request failed:', err);
      setError(prev => ({
        ...prev,
        [user.user_name]: err instanceof Error ? err.message : "Failed to fetch feedback"
      }));
    } finally {
      setLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[user.user_name];
        return newLoading;
      });
    }
  };

  return {
    feedbackData,
    loading,
    error,
    fetchFeedback
  };
};

export default useFeedback;