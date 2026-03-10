import { FeedbackResponse } from "./types"
import { get } from "@/Api"
import { useCallback, useRef, useState } from "react"


const useFeedback = (projectId: string) => {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inFlightRef = useRef(false)

  const fetchFeedback = useCallback(async () => {
    if (!projectId) return
    if (inFlightRef.current) return
    inFlightRef.current = true
    setLoading(true)
    setError(null)
    try {
      const data = await get<FeedbackResponse>(
        `/api/project/${projectId}/feedback/`
      )
      setFeedback(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch feedback")
    } finally {
      inFlightRef.current = false
      setLoading(false)
    }
  }, [projectId])

  return { feedback, loading, error, fetchFeedback };
};

export default useFeedback;