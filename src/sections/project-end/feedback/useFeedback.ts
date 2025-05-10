import { useState } from "react";
import { UserInfo, FeedbackResponse } from "./types";

const useFeedback = () => {
  const [feedbackData, setFeedbackData] = useState<Record<string, FeedbackResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  const fetchFeedback = async (user: UserInfo) => {
    if (loading[user.user_name]) return;
    
    setLoading(prev => ({ ...prev, [user.user_name]: true }));
    
    try {
      const response = await fetch("http://127.0.0.1:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedbackData(prev => ({ ...prev, [user.user_name]: data }));
      setError(prev => {
        const newErrors = { ...prev };
        delete newErrors[user.user_name];
        return newErrors;
      });
    } catch (err) {
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