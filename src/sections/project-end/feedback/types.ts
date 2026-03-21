export interface FeedbackResponse {
  feedback_id: string
  project_member_id: string
  project_id: string
  feedback_text: string | null
  overall_quality_score: number | null
  team_work: number | null
  strength: string | null
  work_load_per_day: string | number[] | null
  work_speed: string | null
  diligence: number | null
  created_at: string
  achievement_ids?: string[] | null
}
