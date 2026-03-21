import FeedbackCard from './FeedbackCard'
import useFeedback from './useFeedback'
import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

const Feedback = ({ projectId }: { projectId: string }) => {
  const { feedback, loading, error, fetchFeedback } = useFeedback(projectId)
  const fetchedForProjectIdRef = useRef<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!projectId) return
    if (fetchedForProjectIdRef.current === projectId) return
    fetchedForProjectIdRef.current = projectId
    void fetchFeedback()
  }, [projectId, fetchFeedback])

  return (
    <section className="pb-8">
      <FeedbackCard
        feedbackData={feedback}
        loading={loading}
        error={error ?? undefined}
        memberName={user?.name}
      />
    </section>
  )
}

export default Feedback
